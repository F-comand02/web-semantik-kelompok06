# 🍜 Ranah KulMed — Sistem Informasi Kuliner Medan Berbasis Web Semantik

[![W3C Semantic Web](https://img.shields.io/badge/W3C-OWL%20%7C%20RDF%20%7C%20SPARQL%201.1%20%7C%20SHACL-1d63ed.svg)](https://www.w3.org/standards/semanticweb/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind%20v4-0ea5e9.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%205-10b981.svg)](https://nodejs.org/)
[![Triplestore](https://img.shields.io/badge/Triplestore-Apache%20Jena%20Fuseki-f59e0b.svg)](https://jena.apache.org/documentation/fuseki2/)

**Ranah KulMed** adalah platform direktori dan mesin pencari semantik kuliner khas Kota Medan yang dibangun menggunakan standar **W3C Semantic Web** (*OWL 2 Ontology*, *RDF/XML Knowledge Graph*, *SPARQL 1.1 Protocol*, *SHACL Validation*, dan *5-Star Linked Open Data* `owl:sameAs` ke DBpedia).

Dataset memodelkan **360 entitas kuliner Medan**, **71 restoran & cabang resmi**, **koordinat geospasial WGS84**, **seluruh 21 kecamatan & 151 kelurahan resmi Kota Medan**, **15 kawasan sentra kuliner**, **50 bahan utama & rempah**, **12 warisan budaya**, serta **10 teknik memasak**.

---

## ✨ Fitur Unggulan

- **Pencarian Multi-Faset Berbasis SPARQL 1.1**: Filter kuliner secara semantik berdasarkan kategori sajian, pengaruh budaya, 21 kecamatan, kawasan kuliner, teknik masak, waktu sajian (`ex:WaktuSajian`), batas budget harga (`ex:hargaMin`), serta status halal (`ex:isHalal`).
- **Inferensi Tetangga Spasial (`ex:berbatasanDengan`)**: Perluasan radius pencarian otomatis ke kecamatan-kecamatan yang berbatasan langsung menggunakan properti simetris OWL (`owl:SymmetricProperty`).
- **Peta Geospasial Interaktif WGS84 (Leaflet + OpenStreetMap)**: Visualisasi titik koordinat `geo:lat` dan `geo:long` untuk 71 tempat kuliner di 21 kecamatan Kota Medan beserta *mini-map* interaktif di setiap detail hidangan.
- **5-Star Linked Open Data (`owl:sameAs` ↔ DBpedia)**: Pengayaan ringkasan ensiklopedia secara langsung (*live dereferencing*) dari DBpedia/Wikipedia untuk entitas kuliner ikonik Sumatera Utara.
- **Asisten Kuliner AI Berbasis GraphRAG**: Rekomendasi kontekstual bebas halusinasi (*zero-hallucination structured JSON*) yang di-*grounding* langsung ke katalog Knowledge Graph.
- **Validasi Integritas Data SHACL (`shapes_validation.rdf`)**: Penjaminan mutu struktur graf untuk seluruh 360 individu `ex:Kuliner` dan 71 individu `ex:Restoran` (label bilingual `@id`/`@en`, rentang kepedasan `0–5`, batas koordinat Kota Medan, dan validitas URI gambar).

---

## 🏗️ Arsitektur Sistem

```text
+-----------------------------------------------------------------------+
|              FRONTEND (React 19 + Vite + Tailwind + Leaflet)          |
|     Multi-Facet Search, Peta Geospasial WGS84, Asisten GraphRAG       |
+-----------------------------------------------------------------------+
                                   │  REST JSON API (Port 5001)
                                   ▼
+-----------------------------------------------------------------------+
|                    BACKEND (Node.js + Express 5)                      |
|      Dynamic SPARQL 1.1 Query Builder + DBpedia Linked Data Cache     |
+-----------------------------------------------------------------------+
                                   │  W3C SPARQL 1.1 Protocol (Port 3030)
                                   ▼
+-----------------------------------------------------------------------+
|                 TRIPLESTORE (Apache Jena Fuseki)                      |
|     Dataset: /kuliner  (ontology_schema.rdf + kuliner_medan.rdf)      |
+-----------------------------------------------------------------------+
```

---

## 📁 Struktur Direktori (`TUBES/`)

```text
TUBES/
├── data/
│   ├── ontology_schema.rdf      # Skema Ontologi OWL 2 (Kelas, Object & Datatype Properties)
│   ├── kuliner_medan.rdf        # Knowledge Graph (360 Kuliner, 71 Restoran, 21 Kecamatan, 151 Kelurahan)
│   └── shapes_validation.rdf    # Aturan Validasi W3C SHACL (KulinerShape & RestoranShape)
├── backend/
│   ├── server.js                # REST API & SPARQL 1.1 Query Controller (Port 5001)
│   ├── validate_shacl.js        # Skrip Verifikasi Kepatuhan SHACL Otomatis
│   └── package.json
├── frontend/
│   ├── public/images/kuliner/   # Koleksi 109 Foto Kuliner Asli Medan & Nusantara
│   ├── src/
│   │   ├── components/
│   │   │   ├── MedanCulinaryMap.jsx   # Komponen Peta Geospasial Interaktif Leaflet
│   │   │   └── OrganicIcons.jsx       # Ikonografi Organik Kustom Ranah KulMed
│   │   ├── culinaryImages.js    # Pemetaan Slug 360 Entitas ke Foto Kuliner Autentik
│   │   ├── App.jsx              # Antarmuka Utama Aplikasi
│   │   └── main.jsx
│   └── package.json
├── package.json                 # Runner Terpadu (concurrently backend + frontend)
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Persiapan Apache Jena Fuseki (Port `3030`)
1. Jalankan **Apache Jena Fuseki** dan buka `http://localhost:3030`.
2. Buat dataset baru bernama **`kuliner`** (*Persistent / TDB2*).
3. Unggah file `data/ontology_schema.rdf` dan `data/kuliner_medan.rdf` ke dataset **`kuliner`**.

### 2. Instalasi Seluruh Dependensi
Dari dalam direktori `TUBES`, jalankan satu perintah berikut untuk menginstal dependensi root, backend, dan frontend sekaligus:

```powershell
npm run install:all
```

### 3. Menjalankan Server Backend & Frontend Bersamaan
```powershell
npm start
```
- **Frontend UI**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api/health`

*(Catatan: Jika Fuseki sedang tidak aktif, frontend otomatis beralih dengan mulus ke **Mode Pratinjau** agar antarmuka tetap dapat dieksplorasi).*

### 4. Menjalankan Validasi SHACL Knowledge Graph
Untuk memverifikasi bahwa seluruh 360 entitas `ex:Kuliner` dan 71 `ex:Restoran` memenuhi seluruh batasan skema `shapes_validation.rdf`:

```powershell
npm run validate
```

---

## 📡 Ringkasan Endpoint REST API (`http://localhost:5001`)

| Metode | Endpoint | Deskripsi |
| :---: | :--- | :--- |
| `GET` | `/api/health` | Mengecek koneksi ke Fuseki serta statistik jumlah *triples* dan entitas. |
| `GET` | `/api/facets` | Mengambil faset dinamis (kategori, budaya, 21 kecamatan, kawasan, teknik masak, waktu sajian, bahan). |
| `GET` | `/api/search` | Pencarian multi-faset (`keyword`, `kategori`, `budaya`, `kecamatan`, `includeNeighbors`, `kawasan`, `teknik`, `waktu`, `maxHarga`, `halal`). |
| `GET` | `/api/culinary/:slug` | Detail entitas semantik: pasangan cocok (`ex:pasanganCocok`), cabang resmi (`ex:cabangDari`), rekomendasi graf, serta abstrak *Linked Open Data* DBpedia (`owl:sameAs`). |
| `GET` | `/api/graph` | Ekstraksi simpul (*nodes*) dan relasi (*edges*) multi-hop Knowledge Graph. |
| `POST` | `/api/sparql` | Eksekusi kueri analitik SPARQL 1.1 *read-only* (`SELECT` / `ASK`). |

---

## 👨‍💻 Tim Pengembang — Kelompok 06 (Kom A '25)

Disusun untuk memenuhi **Tugas Besar Mata Kuliah Web Semantik**:

| No | Nama Mahasiswa | NIM | Peran |
| :-: | :--- | :---: | :--- |
| 1 | **Farel Yamotaro Hia** | 251402069 | Project Manager |
| 2 | **Yabesh Day Siahaan** | 251402004 | Anggota |
| 3 | **Ray Nathan Geereno Saragih** | 251402046 | Anggota |
| 4 | **William Fransisco Sihotang** | 251402052 | Anggota |
| 5 | **Naufal Muhammad Dzaki** | 251402128 | Anggota |
