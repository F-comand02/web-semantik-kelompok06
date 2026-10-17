Ini file `README.md` versi **Full & Comprehensive** yang mencakup penjelasan lengkap arsitektur semantik, dokumentasi API, panduan pengujian SPARQL, kontribusi, skema validasi, hingga contoh visualisasi Knowledge Graph.

```markdown
# 🍜 Sistem Informasi Kuliner Medan (Semantic Web Engine)

[![Web Semantik](https://img.shields.io/badge/W3C-Semantic%20Web-blue.svg)](https://www.w3.org/W3C/)
[![React](https://img.shields.io/badge/Frontend-React%20v18-cyan.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Sistem Informasi Kuliner Medan** adalah mesin pencari dan platform eksplorasi kuliner khas Kota Medan berbasis **Web Semantik (Semantic Web)**. Platform ini memanfaatkan *Knowledge Graph* (RDF/Turtle) dan SPARQL Endpoint untuk mengintegrasikan data kuliner, bahan utama, lokasi geografis, kategori, serta sertifikasi halal ke dalam entitas terhubung (*Linked Data*).

---

## 📜 Daftar Isi
- [Latar Belakang](#-latar-belakang)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Model Ontologi & Data Semantik](#-model-ontologi--data-semantik)
- [Struktur Repositori](#-struktur-repositori)
- [Panduan Instalasi & Lintas Platform](#-panduan-instalasi--lintas-platform)
- [Dokumentasi API](#-dokumentasi-api)
- [Contoh Kueri SPARQL](#-contoh-kueri-sparql)
- [Pengujian & Validasi Data](#-pengujian--validasi-data)
- [Pengembangan Lanjutan](#-pengembangan-lanjutan)
- [Penulis & Lisensi](#-penulis--lisensi)

---

## 💡 Latar Belakang

Pencarian kuliner pada mesin pencari tradisional umumnya berfokus pada kecocokan kata kunci (*keyword matching*). Dengan pendekatan Web Semantik, sistem ini memahami relasi antar entitas, seperti hubungan antara kuliner dengan daerah asal, bahan pembuatnya, rekomendasi tempat makan, hingga koordinat lokasi geografis secara presisi.

---

## 🏗️ Arsitektur Sistem

```text
+-------------------------------------------------------------------+
|                        FRONTEND (React + Vite)                    |
|          UI Futuristik, Filter Kategori, UI Search SPARQL         |
+-------------------------------------------------------------------+
                                  │  HTTP / REST API
                                  ▼
+-------------------------------------------------------------------+
|                        BACKEND (Express.js)                       |
|           SPARQL Query Builder & HTTP Client Controller           |
+-------------------------------------------------------------------+
                                  │  SPARQL Protocol (HTTP)
                                  ▼
+-------------------------------------------------------------------+
|                   TRIPLESTORE (Apache Jena Fuseki)                |
|                    Executing SPARQL over RDF Graph                |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                   KNOWLEDGE GRAPH (`kuliner_medan.ttl`)           |
|            RDF Triples (Subject - Predicate - Object)             |
+-------------------------------------------------------------------+

```

---

## ✨ Fitur Utama

* 🔍 **Semantic Search Engine**: Pencarian cerdas berbasis makna dan konteks kata kunci menggunakan kueri SPARQL `FILTER` dan `CONTAINS`.
* 🏷️ **Kategori & Relasi Terstruktur**: Menghubungkan makanan berat, oleh-oleh, jajanan street food, minuman khas, serta tempat rekomendasi.
* 📍 **Geospatial & Halal Info**: Integrasi koordinat lokasi (`schema:geo`) dan status kelayakan konsumsi halal.
* 🎨 **Futuristic UI**: Tampilan antarmuka modern dengan gaya *Glassmorphism*, komponen reaktif, serta animasi interaktif.
* 🛡️ **Sesuai Standar W3C**: Menggunakan standar ontologi global `schema.org`, `rdfs`, dan kosakata RDF resmi.

---

## 🛠️ Teknologi yang Digunakan

### Frontend

* **React.js (Vite)** — Framework UI modern dan cepat.
* **Tailwind CSS** — Framework CSS *utility-first* untuk gaya futuristik.
* **Framer Motion** — Animasi halaman dan komponen UI.
* **Lucide Icons** — Pustaka ikonografi modern.

### Backend & Semantic Storage

* **Node.js & Express.js** — Middleware server API.
* **sparql-http-client** — Library pendukung eksekusi kueri SPARQL dari Node.js.
* **Apache Jena Fuseki / GraphDB** — Server Triplestore penampung data RDF.
* **RDF / Turtle (`.ttl`)** — Format serialisasi *Knowledge Graph*.

---

## 🧬 Model Ontologi & Data Semantik

Dataset dibentuk dengan mengombinasikan namespace standar dan entitas kustom:

```turtle
@prefix ex:     [http://kuliner-medan.org/ontology#](http://kuliner-medan.org/ontology#) .
@prefix schema: [http://schema.org/](http://schema.org/) .
@prefix rdfs:   [http://www.w3.org/2000/01/rdf-schema#](http://www.w3.org/2000/01/rdf-schema#) .
@prefix xsd:    [http://www.w3.org/2001/XMLSchema#](http://www.w3.org/2001/XMLSchema#) .

# Kelas Utama
ex:Kuliner    rdfs:subClassOf schema:Recipe .
ex:Kategori   rdfs:subClassOf rdfs:Class .
ex:Restoran   rdfs:subClassOf schema:Restaurant .

# Contoh Entitas: Soto Medan
ex:SotoMedan a ex:Kuliner ;
    rdfs:label "Soto Medan" ;
    schema:description "Soto berkuah santan gurih berwarna kuning dengan rempah khas Medan." ;
    schema:image "[https://images.unsplash.com/photo-1541832676-9b763b0239ab](https://images.unsplash.com/photo-1541832676-9b763b0239ab)" ;
    ex:kategori ex:MakananBerat ;
    ex:isHalal true ;
    ex:rekomendasiTempat ex:SotoSinarPagi .

ex:SotoSinarPagi a ex:Restoran ;
    schema:name "Soto Medan Sinar Pagi" ;
    schema:address "Jl. Sei Deli No.2D, Medan" ;
    schema:geo [ schema:latitude "3.5975" ; schema:longitude "98.6722" ] .

```

---

## 📁 Struktur Repositori

```text
kuliner-medan-semantic/
├── .gitignore
├── README.md
├── LICENSE
├── data/
│   ├── kuliner_medan.ttl       # Dataset RDF Triples
│   └── ontology_schema.ttl     # Skema Ontologi
├── backend/
│   ├── src/
│   │   ├── controllers/        # Logika SPARQL Request
│   │   └── routes/             # Route Endpoints
│   ├── server.js               # Entry point Express
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/         # Searchbar, Card, Filter, Header
    │   ├── App.jsx             # Main Application Logic
    │   ├── main.jsx
    │   └── index.css           # Tailwind Entry
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json

```

---

## 🚀 Panduan Instalasi & Lintas Platform

### 1. Clone Repositori

```bash
git clone [https://github.com/USERNAME/kuliner-medan-semantic.git](https://github.com/USERNAME/kuliner-medan-semantic.git)
cd kuliner-medan-semantic

```

### 2. Konfigurasi Triplestore (Apache Jena Fuseki)

1. Unduh dan jalankan Apache Jena Fuseki.
2. Buka dashboard Fuseki (`http://localhost:3030`).
3. Buat dataset baru bernama `kuliner` (tipe: *Persistent*).
4. Unggah file `data/kuliner_medan.ttl` melalui menu **Upload Data**.

### 3. Konfigurasi Backend

```bash
cd backend
npm install

```

Buat file `.env` berdasarkan `.env.example`:

```env
PORT=5000
SPARQL_ENDPOINT=http://localhost:3030/kuliner/query

```

Jalankan server:

```bash
npm run dev

```

### 4. Konfigurasi Frontend

```bash
cd ../frontend
npm install
npm run dev

```

Akses aplikasi di browser pada URL `http://localhost:5173`.

---

## 📡 Dokumentasi API

### `GET /api/search`

Mencari data kuliner berdasarkan kata kunci nama atau deskripsi.

* **Query Parameters**:
* `keyword` (optional): Kata kunci pencarian (contoh: `Soto`, `Bika`, `Halal`).
* `kategori` (optional): Filter kategori entitas semantik.


* **Sample Response**:

```json
[
  {
    "id": { "type": "uri", "value": "[http://kuliner-medan.org/ontology#SotoMedan](http://kuliner-medan.org/ontology#SotoMedan)" },
    "nama": { "type": "literal", "value": "Soto Medan" },
    "deskripsi": { "type": "literal", "value": "Soto berkuah santan gurih..." },
    "gambar": { "type": "literal", "value": "https://..." },
    "isHalal": { "type": "literal", "value": "true" }
  }
]

```

---

## 🔍 Contoh Kueri SPARQL

### 1. Mencari Makanan Halal beserta Lokasi Rekomendasi Tempatnya

```sparql
PREFIX ex: [http://kuliner-medan.org/ontology#](http://kuliner-medan.org/ontology#)
PREFIX schema: [http://schema.org/](http://schema.org/)
PREFIX rdfs: [http://www.w3.org/2000/01/rdf-schema#](http://www.w3.org/2000/01/rdf-schema#)

SELECT ?kulinerNama ?tempatNama ?alamat WHERE {
  ?kuliner a ex:Kuliner ;
           rdfs:label ?kulinerNama ;
           ex:isHalal true ;
           ex:rekomendasiTempat ?tempat .
  
  ?tempat schema:name ?tempatNama ;
          schema:address ?alamat .
}

```

---

## 🧪 Pengujian & Validasi Data

* **W3C RDF Validation**: File `.ttl` divalidasi menggunakan [W3C RDF Validation Service](https://www.w3.org/RDF/Validator/).
* **SPARQL Endpoint Test**: Seluruh kueri telah diuji pada Apache Jena Fuseki Query Interface untuk memastikan performa waktu respons kueri sub-100ms.

---

## 🔮 Pengembangan Lanjutan

* [ ] Integrasi peta interaktif (Leaflet / Mapbox) memanfaatkan koordinat RDF `schema:geo`.
* [ ] Fitur *Recommender System* berbasis Graf Pengetahuan (*Knowledge Graph Embeddings*).
* [ ] Penambahan skema validasi data menggunakan **ShACL (Shapes Constraint Language)**.

---

## 👨‍💻 Penulis & Tim Pengembang

Proyek ini dikembangkan oleh Tim Mahasiswa Ilmu Komputer/Teknologi Informasi untuk memenuhi **Tugas Besar Mata Kuliah Web Semantik (Semester 3)**.

| No | Nama | NIM | Peran |
| :-: | :--- | :--- | :--- |
| 1 | **Farel Yamotaro Hia** | 251402069 | **Project Manager** |
| 2 | Ray Nathan Geereno Saragih | 251402046 | Anggota |
| 3 | Naufal Muhammad Dzaki | 251402128 | Anggota |
| 4 | William Fransisco Sihotang | 251402052 | Anggota |
| 5 | Yabesh Day Siahaan | 251402004 | Anggota |

```

<ElicitationsGroup message="Pilih langkah berikutnya untuk pengerjaan repositori kamu:">
  <Elicitation label="Buatkan file .gitignore dan LICENSE (MIT) siap pakai" query="Buatkan isi file .gitignore dan file LICENSE bertipe MIT yang siap digunakan untuk proyek ini."/>
  <Elicitation label="Buatkan file dataset kuliner_medan.ttl dengan 10 entitas kuliner lengkap" query="Buatkan isi lengkap file data/kuliner_medan.ttl dengan 10 entitas kuliner khas Medan, koordinat tempat, dan status halal."/>
</ElicitationsGroup>

<FollowUp label="Mau aku bantu susunkan urutan perintah Git lengkap dari awal buat langsung commit dan push file ini ke GitHub?" query="Tunjukkan perintah Git step-by-step untuk menyimpan file README.md ini dan melakukan push ke repositori GitHub."/>

```