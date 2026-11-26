/**
 * SHACL Validation Verifier for Ranah KulMed RDF Knowledge Graph
 * Validates all ex:Kuliner (360) & ex:Restoran (71) individuals in data/kuliner_medan.rdf
 * against the constraints defined in data/shapes_validation.rdf.
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const rdfXml = fs.readFileSync(path.join(dataDir, 'kuliner_medan.rdf'), 'utf8');
const shapesXml = fs.readFileSync(path.join(dataDir, 'shapes_validation.rdf'), 'utf8');
const schemaXml = fs.readFileSync(path.join(dataDir, 'ontology_schema.rdf'), 'utf8');

const EXPECTED_NS = 'http://kuliner-medan.org/ontology/Kelompok06/KomA/25#';

let errors = 0;

if (!shapesXml.includes(`${EXPECTED_NS}KulinerShape`) || !shapesXml.includes(`${EXPECTED_NS}RestoranShape`)) {
  console.error('❌ shapes_validation.rdf namespace mismatch!');
  errors++;
}

// Merge blocks by URI since OWL API serializes some individuals across two blocks (declaration + axioms)
const byUri = new Map();
for (const raw of rdfXml.split('<owl:NamedIndividual').slice(1)) {
  const m = raw.match(/rdf:about="([^"]+)"/);
  if (!m) continue;
  const uri = m[1];
  byUri.set(uri, (byUri.get(uri) || '') + '\n' + raw);
}

let kulinerCount = 0;
let restoranCount = 0;

for (const [uri, block] of byUri.entries()) {
  if (block.includes(`rdf:resource="${EXPECTED_NS}Kuliner"`)) {
    kulinerCount++;
    const labels = (block.match(/<rdfs:label/g) || []).length;
    const hasDesc = /<schema:description[^>]*>[^<]+<\/schema:description>/.test(block);
    const imgMatch = block.match(/<schema:image[^>]*>([^<]+)<\/schema:image>/);
    const spiceMatch = block.match(/<tingkatKepedasan[^>]*>(\d+)<\/tingkatKepedasan>/);
    const hasHalal = /<isHalal[^>]*>(true|false)<\/isHalal>/.test(block);
    const hasKat = block.includes('<kategori ');
    const hasBud = block.includes('<pengaruhBudaya ');
    const hasBahan = block.includes('<memilikiBahan ');
    const hasResto = block.includes('<rekomendasiTempat ');
    const hasHMin = /<hargaMin[^>]*>\d+<\/hargaMin>/.test(block);
    const hasHMax = /<hargaMax[^>]*>\d+<\/hargaMax>/.test(block);

    if (labels < 2) { console.error(`❌ ${uri}: fewer than 2 rdfs:label`); errors++; }
    if (!hasDesc) { console.error(`❌ ${uri}: missing schema:description`); errors++; }
    if (!imgMatch || !/^https?:\/\//.test(imgMatch[1])) { console.error(`❌ ${uri}: invalid schema:image`); errors++; }
    if (!spiceMatch || Number(spiceMatch[1]) < 0 || Number(spiceMatch[1]) > 5) { console.error(`❌ ${uri}: invalid tingkatKepedasan`); errors++; }
    if (!hasHalal || !hasKat || !hasBud || !hasBahan || !hasResto || !hasHMin || !hasHMax) {
      console.error(`❌ ${uri}: missing required KulinerShape property`);
      errors++;
    }
  }

  if (block.includes(`rdf:resource="${EXPECTED_NS}Restoran"`)) {
    restoranCount++;
    const hasName = /<schema:name[^>]*>[^<]+<\/schema:name>/.test(block);
    const hasAddr = /<schema:address[^>]*>[^<]+<\/schema:address>/.test(block);
    const hasKec = block.includes('<berlokasiDi ');
    const hasKel = block.includes('<berlokasiDiKelurahan ');
    const hasGeo = block.includes('<schema:geo ');
    const latMatch = block.match(/<geo:lat[^>]*>([0-9.]+)<\/geo:lat>/);
    const longMatch = block.match(/<geo:long[^>]*>([0-9.]+)<\/geo:long>/);
    const lat = latMatch ? Number(latMatch[1]) : NaN;
    const lng = longMatch ? Number(longMatch[1]) : NaN;

    if (!hasName || !hasAddr || !hasKec || !hasKel || !hasGeo) {
      console.error(`❌ ${uri}: missing required RestoranShape property`);
      errors++;
    }
    if (isNaN(lat) || lat < 3.40 || lat > 3.85 || isNaN(lng) || lng < 98.50 || lng > 98.85) {
      console.error(`❌ ${uri}: WGS84 coordinates (${lat}, ${lng}) out of Medan bounds`);
      errors++;
    }
  }
}

if (schemaXml.includes('xmlns="http://kuliner-medan.org/ontology#"')) {
  console.error('❌ ontology_schema.rdf still uses old default xmlns');
  errors++;
}

if (errors === 0) {
  console.log(`✅ SHACL Validation Conforms! Verified ${kulinerCount} ex:Kuliner & ${restoranCount} ex:Restoran individuals (0 violations).`);
} else {
  console.error(`❌ SHACL Validation failed with ${errors} violation(s).`);
  process.exit(1);
}
