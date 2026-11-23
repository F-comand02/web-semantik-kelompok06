/**
 * Medan Culinary Information System - Semantic Web Backend API
 * Stack: Node.js (v18+/v24+) + Express + W3C SPARQL 1.1 Protocol (Native Fetch)
 * Connects to Apache Jena Fuseki / GraphDB Triplestore
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT || 'http://localhost:3030/kuliner/query';

const PREFIXES = `
PREFIX ex:     <http://kuliner-medan.org/ontology#>
PREFIX schema: <http://schema.org/>
PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl:    <http://www.w3.org/2002/07/owl#>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>
PREFIX geo:    <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX dbr:    <http://dbpedia.org/resource/>
`;

function sanitizeSparqlLiteral(input = '') {
  return String(input)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .trim();
}

function sanitizeSlug(slug = '') {
  return String(slug).replace(/[^a-zA-Z0-9_]/g, '');
}

async function executeSparql(query) {
  const params = new URLSearchParams();
  params.append('query', query);

  const response = await fetch(SPARQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/sparql-results+json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Fuseki HTTP ${response.status}: ${errText.slice(0, 200)}`);
  }

  const json = await response.json();
  return json.results?.bindings || [];
}

function toSlug(uri = '') {
  const idx = uri.lastIndexOf('#');
  return idx !== -1 ? uri.slice(idx + 1) : uri;
}

// ============================================================================
// 1. HEALTH & KNOWLEDGE GRAPH STATS ENDPOINT
// ============================================================================
app.get('/api/health', async (req, res) => {
  const statsQuery = `
    ${PREFIXES}
    SELECT (COUNT(*) AS ?totalTriples) WHERE { ?s ?p ?o }
  `;
  const entityQuery = `
    ${PREFIXES}
    SELECT
      (COUNT(DISTINCT ?k) AS ?dishes)
      (COUNT(DISTINCT ?r) AS ?restaurants)
      (COUNT(DISTINCT ?b) AS ?ingredients)
      (COUNT(DISTINCT ?c) AS ?categories)
    WHERE {
      { ?k a ex:Kuliner }
      UNION { ?r a ex:Restoran }
      UNION { ?b a ex:BahanUtama }
      UNION { ?c a ex:Kategori }
    }
  `;

  try {
    const [tripleRows, entityRows] = await Promise.all([
      executeSparql(statsQuery),
      executeSparql(entityQuery),
    ]);
    res.json({
      status: 'connected',
      endpoint: SPARQL_ENDPOINT,
      stats: {
        totalTriples: Number(tripleRows[0]?.totalTriples?.value || 0),
        dishes: Number(entityRows[0]?.dishes?.value || 0),
        restaurants: Number(entityRows[0]?.restaurants?.value || 0),
        ingredients: Number(entityRows[0]?.ingredients?.value || 0),
        categories: Number(entityRows[0]?.categories?.value || 0),
      },
    });
  } catch (err) {
    res.status(503).json({
      status: 'disconnected',
      endpoint: SPARQL_ENDPOINT,
      error: err.message,
      hint: 'Make sure Apache Jena Fuseki is running on port 3030 with dataset "kuliner" loaded.',
    });
  }
});

// ============================================================================
// 2. DYNAMIC FACETS ENDPOINT (Categories, Cultures, Districts, Ingredients)
// ============================================================================
app.get('/api/facets', async (req, res) => {
  const makeFacetQuery = (className, linkPred, viaResto = false) => `
    ${PREFIXES}
    SELECT ?uri ?label (COUNT(DISTINCT ?dish) AS ?count) WHERE {
      ?uri a ${className} ;
           rdfs:label ?label .
      FILTER(LANG(?label) = "id" || LANG(?label) = "")
      OPTIONAL {
        ${
          viaResto
            ? `?dish a ex:Kuliner ; ex:rekomendasiTempat ?resto . ?resto ${linkPred} ?uri .`
            : `?dish a ex:Kuliner ; ${linkPred} ?uri .`
        }
      }
    }
    GROUP BY ?uri ?label
    ORDER BY DESC(?count) ?label
  `;

  try {
    const [categories, cultures, districts, ingredients] = await Promise.all([
      executeSparql(makeFacetQuery('ex:Kategori', 'ex:kategori')),
      executeSparql(makeFacetQuery('ex:PengaruhBudaya', 'ex:pengaruhBudaya')),
      executeSparql(makeFacetQuery('ex:Kecamatan', 'ex:berlokasiDi', true)),
      executeSparql(makeFacetQuery('ex:BahanUtama', 'ex:memilikiBahan')),
    ]);

    const format = (rows) =>
      rows.map((r) => ({
        slug: toSlug(r.uri.value),
        uri: r.uri.value,
        label: r.label.value,
        count: Number(r.count?.value || 0),
      }));

    res.json({
      categories: format(categories),
      cultures: format(cultures),
      districts: format(districts),
      ingredients: format(ingredients),
    });
  } catch (err) {
    console.error('Facets Error:', err.message);
    res.status(500).json({ error: 'Failed to load semantic facets from SPARQL endpoint.' });
  }
});

// ============================================================================
// 3. MULTI-FACETED SEMANTIC SEARCH ENDPOINT
// ============================================================================
app.get('/api/search', async (req, res) => {
  const { keyword = '', kategori = '', budaya = '', kecamatan = '', halal = '' } = req.query;

  const cleanKw = sanitizeSparqlLiteral(keyword);
  const cleanKat = sanitizeSlug(kategori);
  const cleanBud = sanitizeSlug(budaya);
  const cleanKec = sanitizeSlug(kecamatan);

  const whereFilters = [];
  if (cleanKat) whereFilters.push(`FILTER(?katUri = ex:${cleanKat})`);
  if (cleanBud) whereFilters.push(`FILTER(?budayaUri = ex:${cleanBud})`);
  if (cleanKec) whereFilters.push(`FILTER(?kecUri = ex:${cleanKec})`);
  if (halal === 'true') whereFilters.push(`FILTER(?isHalal = true)`);
  if (halal === 'false') whereFilters.push(`FILTER(?isHalal = false)`);

  const finalQuery = `
${PREFIXES}
SELECT
  ?id ?nama ?namaEn ?deskripsi ?gambar ?isHalal
  ?spice ?kisaranHarga ?rasaDominan ?metodeMasak
  ?katUri ?kategoriNama ?budayaNama ?waktuNama
  ?restoNama ?alamat ?kecNama ?jamBuka ?rating ?tahunBerdiri ?lat ?long
  (GROUP_CONCAT(DISTINCT ?bahanNama; SEPARATOR=", ") AS ?bahanList)
WHERE {
  ?id a ex:Kuliner ;
      rdfs:label ?nama ;
      schema:description ?deskripsi ;
      schema:image ?gambar ;
      ex:isHalal ?isHalal ;
      ex:tingkatKepedasan ?spice ;
      ex:kisaranHarga ?kisaranHarga ;
      ex:kategori ?katUri ;
      ex:pengaruhBudaya ?budayaUri ;
      ex:rekomendasiTempat ?restoUri .

  FILTER(LANG(?nama) = "id" || LANG(?nama) = "")
  OPTIONAL { ?id rdfs:label ?namaEn . FILTER(LANG(?namaEn) = "en") }
  OPTIONAL { ?id ex:rasaDominan ?rasaDominan }
  OPTIONAL { ?id ex:metodeMasak ?metodeMasak }
  OPTIONAL {
    ?id ex:waktuSajian ?waktuUri .
    ?waktuUri rdfs:label ?waktuNama .
    FILTER(LANG(?waktuNama) = "id" || LANG(?waktuNama) = "")
  }

  ?katUri rdfs:label ?kategoriNama .
  FILTER(LANG(?kategoriNama) = "id" || LANG(?kategoriNama) = "")

  ?budayaUri rdfs:label ?budayaNama .
  FILTER(LANG(?budayaNama) = "id" || LANG(?budayaNama) = "")

  OPTIONAL {
    ?id ex:memilikiBahan ?bahanUri .
    ?bahanUri rdfs:label ?bahanNama .
    FILTER(LANG(?bahanNama) = "id" || LANG(?bahanNama) = "")
  }

  ?restoUri schema:name ?restoNama ;
            schema:address ?alamat ;
            ex:berlokasiDi ?kecUri ;
            geo:lat ?lat ;
            geo:long ?long .
  ?kecUri rdfs:label ?kecNama .
  OPTIONAL { ?restoUri ex:jamBuka ?jamBuka }
  OPTIONAL { ?restoUri ex:rating ?rating }
  OPTIONAL { ?restoUri ex:tahunBerdiri ?tahunBerdiri }
  ${whereFilters.join('\n  ')}
}
GROUP BY
  ?id ?nama ?namaEn ?deskripsi ?gambar ?isHalal
  ?spice ?kisaranHarga ?rasaDominan ?metodeMasak
  ?katUri ?kategoriNama ?budayaNama ?waktuNama
  ?restoNama ?alamat ?kecNama ?jamBuka ?rating ?tahunBerdiri ?lat ?long
  ?budayaUri ?kecUri
ORDER BY DESC(?rating) ?nama
  `;

  try {
    const bindings = await executeSparql(finalQuery);
    let results = bindings.map((b) => ({
      slug: toSlug(b.id.value),
      uri: b.id.value,
      nama: b.nama?.value || '',
      namaEn: b.namaEn?.value || '',
      deskripsi: b.deskripsi?.value || '',
      gambar: b.gambar?.value || '',
      isHalal: b.isHalal?.value === 'true',
      tingkatKepedasan: Number(b.spice?.value || 0),
      kisaranHarga: b.kisaranHarga?.value || '',
      rasaDominan: b.rasaDominan?.value || '',
      metodeMasak: b.metodeMasak?.value || '',
      kategori: b.kategoriNama?.value || '',
      kategoriSlug: toSlug(b.katUri?.value || ''),
      budaya: b.budayaNama?.value || '',
      waktuSajian: b.waktuNama?.value || '',
      bahanUtama: b.bahanList?.value ? b.bahanList.value.split(', ').filter(Boolean) : [],
      restoran: {
        nama: b.restoNama?.value || '',
        alamat: b.alamat?.value || '',
        kecamatan: b.kecNama?.value || '',
        jamBuka: b.jamBuka?.value || '',
        rating: Number(b.rating?.value || 0),
        tahunBerdiri: b.tahunBerdiri?.value ? Number(b.tahunBerdiri.value) : null,
        lat: Number(b.lat?.value || 0),
        long: Number(b.long?.value || 0),
      },
    }));

    if (cleanKw) {
      const q = cleanKw.toLowerCase();
      results = results.filter((item) =>
        [
          item.nama,
          item.namaEn,
          item.deskripsi,
          item.kategori,
          item.budaya,
          item.rasaDominan,
          item.restoran.nama,
          item.restoran.kecamatan,
          ...item.bahanUtama,
        ]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }

    res.json({
      count: results.length,
      results,
      meta: {
        sparql: finalQuery.trim(),
      },
    });
  } catch (err) {
    console.error('SPARQL Search Error:', err.message);
    res.status(500).json({ error: 'SPARQL query failed', details: err.message });
  }
});

// ============================================================================
// 4. SEMANTIC ENTITY DETAIL & KNOWLEDGE GRAPH RECOMMENDATIONS
// ============================================================================
app.get('/api/culinary/:slug', async (req, res) => {
  const slug = sanitizeSlug(req.params.slug);
  if (!slug) return res.status(400).json({ error: 'Invalid culinary slug' });

  const detailQuery = `
    ${PREFIXES}
    SELECT ?sameAs ?pairUri ?pairNama WHERE {
      OPTIONAL { ex:${slug} owl:sameAs ?sameAs }
      OPTIONAL {
        { ex:${slug} ex:pasanganCocok ?pairUri } UNION { ?pairUri ex:pasanganCocok ex:${slug} }
        ?pairUri rdfs:label ?pairNama .
        FILTER(LANG(?pairNama) = "id" || LANG(?pairNama) = "")
      }
    }
  `;

  const recommendQuery = `
    ${PREFIXES}
    SELECT DISTINCT ?recUri ?recNama ?recGambar ?recKategori ?reason WHERE {
      {
        ex:${slug} ex:memilikiBahan ?sharedBahan .
        ?recUri a ex:Kuliner ;
                ex:memilikiBahan ?sharedBahan .
        ?sharedBahan rdfs:label ?sharedLabel .
        FILTER(LANG(?sharedLabel) = "id" || LANG(?sharedLabel) = "")
        BIND(CONCAT("Shared ingredient: ", STR(?sharedLabel)) AS ?reason)
      }
      UNION
      {
        ex:${slug} ex:pengaruhBudaya ?sharedBudaya .
        ?recUri a ex:Kuliner ;
                ex:pengaruhBudaya ?sharedBudaya .
        ?sharedBudaya rdfs:label ?sharedLabel .
        FILTER(LANG(?sharedLabel) = "id" || LANG(?sharedLabel) = "")
        BIND(CONCAT("Same heritage: ", STR(?sharedLabel)) AS ?reason)
      }
      FILTER(?recUri != ex:${slug})
      ?recUri rdfs:label ?recNama ;
              schema:image ?recGambar ;
              ex:kategori ?kat .
      FILTER(LANG(?recNama) = "id" || LANG(?recNama) = "")
      ?kat rdfs:label ?recKategori .
      FILTER(LANG(?recKategori) = "id" || LANG(?recKategori) = "")
    }
    LIMIT 6
  `;

  try {
    const [detailRows, recRows] = await Promise.all([
      executeSparql(detailQuery),
      executeSparql(recommendQuery),
    ]);

    const sameAs = [...new Set(detailRows.map((r) => r.sameAs?.value).filter(Boolean))];
    const pairings = [];
    const seenPairs = new Set();
    for (const r of detailRows) {
      if (r.pairUri && !seenPairs.has(r.pairUri.value)) {
        seenPairs.add(r.pairUri.value);
        pairings.push({ slug: toSlug(r.pairUri.value), nama: r.pairNama.value });
      }
    }

    const recommendations = [];
    const seenRec = new Set();
    for (const r of recRows) {
      if (!seenRec.has(r.recUri.value)) {
        seenRec.add(r.recUri.value);
        recommendations.push({
          slug: toSlug(r.recUri.value),
          nama: r.recNama.value,
          gambar: r.recGambar.value,
          kategori: r.recKategori.value,
          reason: r.reason.value,
        });
      }
    }

    res.json({
      slug,
      sameAs,
      pairings,
      recommendations,
      sparql: recommendQuery.trim(),
    });
  } catch (err) {
    console.error('Detail Error:', err.message);
    res.status(500).json({ error: 'Failed to load semantic details.' });
  }
});

// ============================================================================
// 5. KNOWLEDGE GRAPH VISUALIZATION ENDPOINT (Nodes & Edges)
// ============================================================================
app.get('/api/graph', async (req, res) => {
  const { focus = '' } = req.query;
  const cleanFocus = sanitizeSlug(focus);

  const query = `
    ${PREFIXES}
    SELECT DISTINCT ?s ?sLabel ?sType ?p ?o ?oLabel ?oType WHERE {
      ${cleanFocus ? `BIND(ex:${cleanFocus} AS ?s)` : ''}
      ?s a ?sType .
      FILTER(?sType IN (ex:Kuliner, ex:Restoran))
      ?s ?p ?o .
      FILTER(?p IN (ex:kategori, ex:pengaruhBudaya, ex:memilikiBahan, ex:rekomendasiTempat, ex:pasanganCocok, ex:berlokasiDi))
      ?o a ?oType .

      OPTIONAL { ?s rdfs:label ?sLbl . FILTER(LANG(?sLbl) = "id" || LANG(?sLbl) = "") }
      OPTIONAL { ?s schema:name ?sName }
      BIND(COALESCE(?sLbl, ?sName, STRAFTER(STR(?s), "#")) AS ?sLabel)

      OPTIONAL { ?o rdfs:label ?oLbl . FILTER(LANG(?oLbl) = "id" || LANG(?oLbl) = "") }
      OPTIONAL { ?o schema:name ?oName }
      BIND(COALESCE(?oLbl, ?oName, STRAFTER(STR(?o), "#")) AS ?oLabel)
    }
    LIMIT 140
  `;

  try {
    const rows = await executeSparql(query);
    const nodeMap = new Map();
    const edges = [];

    for (const r of rows) {
      const sId = toSlug(r.s.value);
      const oId = toSlug(r.o.value);
      const pred = toSlug(r.p.value);

      if (!nodeMap.has(sId)) {
        nodeMap.set(sId, { id: sId, label: r.sLabel.value, type: toSlug(r.sType.value) });
      }
      if (!nodeMap.has(oId)) {
        nodeMap.set(oId, { id: oId, label: r.oLabel.value, type: toSlug(r.oType.value) });
      }
      edges.push({ source: sId, target: oId, predicate: pred });
    }

    res.json({
      nodes: Array.from(nodeMap.values()),
      edges,
    });
  } catch (err) {
    console.error('Graph Error:', err.message);
    res.status(500).json({ error: 'Failed to load Knowledge Graph triples.' });
  }
});

// ============================================================================
// 6. LIVE SPARQL PLAYGROUND ENDPOINT (Read-Only SELECT / ASK)
// ============================================================================
app.post('/api/sparql', async (req, res) => {
  const { query = '' } = req.body || {};
  const trimmed = query.trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'SPARQL query cannot be empty.' });
  }
  if (/\b(INSERT|DELETE|DROP|CLEAR|LOAD|CREATE|MOVE|COPY|ADD)\b/i.test(trimmed)) {
    return res.status(403).json({ error: 'Only read-only SELECT / ASK queries are permitted in the playground.' });
  }

  try {
    const start = Date.now();
    const bindings = await executeSparql(trimmed);
    const elapsedMs = Date.now() - start;
    res.json({ elapsedMs, count: bindings.length, bindings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Medan Semantic Web Backend running at http://localhost:${PORT}`);
  console.log(`🔗 Connected SPARQL Endpoint: ${SPARQL_ENDPOINT}`);
});