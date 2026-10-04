# Pertemuan 7 - Serialisasi RDF


## Langkah 1: Membandingkan Serialisasi RDF

| Format | Kekuatan Utama | Skenario Tepat |
|--------|----------------|----------------|
| Turtle | Ringkas dan mudah dibaca manusia | Menulis dan mengedit ontology RDF secara manual. |
| JSON-LD | Cocok untuk web, API, dan HTML | Mengintegrasikan data terstruktur ke aplikasi web dan API. |
| RDF/XML | Kompatibilitas dengan data lama | Bertukar data dengan sistem lama yang mendukung RDF/XML. |
| N-Triples | Satu triple per baris; stabil untuk diff | Membandingkan perubahan data RDF menggunakan Git atau diff. |
| N-Quads | Menambahkan konteks graf | Menyimpan data dari beberapa named graph dalam satu dataset. |

## Langkah 3: Merekam Provenance dengan Reifikasi Klasik
Reifikasi klasik lebih verbose karena membutuhkan beberapa triple tambahan untuk menjelaskan sebuah pernyataan. Kita harus membuat resource khusus, misalnya `ex:pernyataan1`, lalu mendefinisikan `rdf:type`, `rdf:subject`, `rdf:predicate`, dan `rdf:object`. Setelah itu, metadata seperti `dct:creator` dan `dct:date` ditambahkan ke resource tersebut.

Sementara itu, RDF-star lebih ringkas karena memungkinkan kita memberikan metadata langsung pada triple yang ingin dianotasi, tanpa harus membuat resource reifikasi dan menuliskan empat triple tambahan untuk mendeskripsikan pernyataan tersebut.

Contoh RDF-star:

`<< ex:ida ex:mengajar ex:web_semantik >> dct:creator ex:ida .`

Secara konsep, kedua pendekatan tersebut memungkinkan kita memberikan metadata pada sebuah pernyataan. Perbedaannya, reifikasi klasik menggunakan resource dan beberapa triple tambahan, sedangkan RDF-star menggunakan sintaks yang lebih sederhana dan mudah dibaca.


## Artefak
- Graf asal: 66 triple
- Format ekspor: Turtle, JSON-LD, N-Triples
- Named graph: https://f-comand02.github.io/graph/kampus dan https://f-comand02.github.io/graph/fakultas

## Reifikasi dan provenance

- Triple yang dianotasi: `ex:ida ex:mengajar ex:web_semantik`
- Creator: `ex:ida`
- Date: `2026-10-01`
- Source: `Data akademik kampus`

## Perbandingan
- Format paling mudah dibaca manusia: **Turtle**, karena sintaksnya ringkas dan mudah dipahami.
- Format untuk HTML/API: **JSON-LD**, karena mudah diintegrasikan dengan aplikasi web dan API.
- Perbedaan reifikasi klasik dan RDF-star: **Reifikasi klasik** menggunakan beberapa triple tambahan untuk menjelaskan sebuah triple, sedangkan **RDF-star** memungkinkan triple disisipkan langsung ke dalam triple lain sehingga lebih ringkas.
  
## Refleksi
1. Mengapa named graph berguna saat menggabungkan data dari sumber berbeda?
2. Mengapa provenance penting untuk sebuah triple?
3. Format apa yang Anda pilih untuk git diff, dan mengapa?
