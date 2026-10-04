# Pertemuan 7 - Serialisasi RDF


## Langkah 1: Membandingkan Serialisasi RDF

| Format | Kekuatan Utama | Skenario Tepat |
|--------|----------------|----------------|
| Turtle | Ringkas dan mudah dibaca manusia | Menulis dan mengedit ontology RDF secara manual. |
| JSON-LD | Cocok untuk web, API, dan HTML | Mengintegrasikan data terstruktur ke aplikasi web dan API. |
| RDF/XML | Kompatibilitas dengan data lama | Bertukar data dengan sistem lama yang mendukung RDF/XML. |
| N-Triples | Satu triple per baris; stabil untuk diff | Membandingkan perubahan data RDF menggunakan Git atau diff. |
| N-Quads | Menambahkan konteks graf | Menyimpan data dari beberapa named graph dalam satu dataset. |

## Artefak
- Graf asal: [jumlah triple]
- Format ekspor: Turtle, JSON-LD, N-Triples
- Named graph: [nama graf 1] dan [nama graf 2]

## Reifikasi dan provenance
- Triple yang dianotasi: [isi]
- Creator: [isi]
- Date: [isi]
- Source: [isi]

## Perbandingan
- Format paling mudah dibaca manusia: **Turtle**, karena sintaksnya ringkas dan mudah dipahami.
- Format untuk HTML/API: **JSON-LD**, karena mudah diintegrasikan dengan aplikasi web dan API.
- Perbedaan reifikasi klasik dan RDF-star: **Reifikasi klasik** menggunakan beberapa triple tambahan untuk menjelaskan sebuah triple, sedangkan **RDF-star** memungkinkan triple disisipkan langsung ke dalam triple lain sehingga lebih ringkas.
  
## Refleksi
1. Mengapa named graph berguna saat menggabungkan data dari sumber berbeda?
2. Mengapa provenance penting untuk sebuah triple?
3. Format apa yang Anda pilih untuk git diff, dan mengapa?
