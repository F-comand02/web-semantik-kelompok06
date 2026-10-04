# Pertemuan 7 - Serialisasi RDF


## Langkah 1: Membandingkan Serialisasi RDF

| Format | Kekuatan Utama | Skenario Tepat |
|--------|----------------|----------------|
| Turtle | Ringkas dan mudah dibaca manusia | Menulis dan mengedit ontology RDF secara manual. |
| JSON-LD | Cocok untuk web, API, dan HTML | Mengintegrasikan data terstruktur ke aplikasi web dan API. |
| RDF/XML | Kompatibilitas dengan data lama | Bertukar data dengan sistem lama yang mendukung RDF/XML. |
| N-Triples | Satu triple per baris; stabil untuk diff | Membandingkan perubahan data RDF menggunakan Git atau diff. |
| N-Quads | Menambahkan konteks graf | Menyimpan data dari beberapa named graph dalam satu dataset. |
