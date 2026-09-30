# [Pertemuan 6](README.md) - RDF Dasar

## IRI dasar graf
http://example.org/

## Ringkasan graf
- Jumlah triple: 3
- Namespace yang digunakan: 
  - ex: <http://example.org/>
  - rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
- Entitas: ex:ida (Ida Adi), ex:Lecturer (kelas dosen), ex:WebSemantik (mata kuliah Web Semantik)

## Contoh triple
1. [ex:ida] - [rdf:type] - [ex:Lecturer]
2. [ex:ida] - [ex:teaches] - [ex:WebSemantik]
3. [ex:WebSemantik] - [ex:name] - ["Web Semantik"]

### Format Tabel

| No | Subject | Predicate | Object |
|----|---------|-----------|--------|
| 1 | ex:ida | rdf:type | ex:Lecturer |
| 2 | ex:ida | ex:teaches | ex:WebSemantik |
| 3 | ex:WebSemantik | ex:name | "Web Semantik" |

## Perbandingan serialisasi
- Turtle: [pengamatan]
- JSON-LD: [pengamatan]
- Pernyataan yang sama: [isi]

## Refleksi
1. Kapan object harus berupa IRI dan kapan berupa literal?
2. Mengapa prefix membantu keterbacaan tanpa mengubah IRI?
3. Sebutkan satu kesalahan pemodelan yang Anda hindari pada graf ini.