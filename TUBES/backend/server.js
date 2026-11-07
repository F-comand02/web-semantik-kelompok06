const express = require('express');
const cors = require('cors');
const SPARQLClient = require('sparql-http-client');
const ParsingClient = SPARQLClient.default || SPARQLClient;

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint SPARQL Apache Jena Fuseki / GraphDB
const endpointUrl = 'http://localhost:3030/kuliner/query';
const client = new ParsingClient({ endpointUrl });

// API Route Search SPARQL
app.get('/api/search', async (req, res) => {
  const { keyword } = req.query;
  
  const query = `
    PREFIX ex: <http://kuliner-medan.org/ontology#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?id ?nama ?deskripsi ?gambar ?isHalal ?kategoriNama WHERE {
      ?id a ex:Kuliner ;
          rdfs:label ?nama ;
          schema:description ?deskripsi ;
          schema:image ?gambar ;
          ex:isHalal ?isHalal ;
          ex:kategori ?kat .
      
      ?kat rdfs:label ?kategoriNama .
      
      FILTER(CONTAINS(LOWER(?nama), LOWER("${keyword || ''}")))
    }
  `;

  try {
    const stream = await client.query.select(query);
    const bindings = [];
    for await (const row of stream) {
      bindings.push(row);
    }
    res.json(bindings);
  } catch (err) {
    console.error('SPARQL Query Error:', err);
    res.status(500).json({ error: 'Gagal mengambil data dari SPARQL Endpoint' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`));