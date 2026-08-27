# [Pertemuan 1](README.md) - Pengenalan Web Semantik

## 1. Eksplorasi Wikidata
- Nama entitas: Universitas Sumatera Utara (University of North Sumatera)
- Identifier Wikidata: (QID) (Q4200341)
- Deskripsi: national university in North Sumatera, Indonesia
  Universitas Sumatera Utara | University of Sumatera Utara | USU
- Negara: Indonesia (Q252)
- Lokasi: Medan Tuntungan (Q4250985)
- Tahun berdiri: 20 November 1957 / 4 July 1952 
- Website: https://www.usu.ac.id/
- Member Of: ASEAN University Network | ASEAN European Academic University Network
- Postal Code: 20155
- Street Address: Jalan Dr T Mansur No 9 Padang Bulan (Indonesian)


## 2. Entitas, Atribut, dan Relasi

| Informasi                                                                                      | Kategori | Alasan                                                                                                      |
| ---------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| Universitas Sumatera Utara (Q4200341)                                                          | Entitas  | Benda utama yang dibahas dan satu-satunya yang memiliki nama Universitas Sumatera Utara                     |
| National Accreditation Board for Higher Education (Q12473184)                                  | Entitas  | Objek lembaga yang memiliki identitas tersendiri dan berbeda yang berkaitan dengan objek utama              |
| Medan Tuntungan (Q4250985)                                                                     | Entitas  | Objek sendiri yang menandakan wilayah administratif yang memiliki identitas tersendiri                      |
| Perguruan Tinggi Negeri Badan Hukum (Q137993831)                                               | Entitas  | Objek lembaga lainnya yang berbeda jenis atau bentuk kelembagaan yang memiliki identitas tersendiri         |
| Q9766158 (kategori alumni Universitas Sumatera Utara)                                          | Entitas  | karena entitas kategori unik yang secara khusus berkaitan dengan alumni Universitas Sumatera Utara          |
| Singkatan: USU                                                                                 | Atribut  | Menjelaskan nama pendek yang digunakan untuk Universitas Sumatera Utara                                     |
| Koordinat lokasi: 3°33'42.2"N, 98°39'22.8"E                                                    | Atribut  | Menjelaskan posisi geografis Universitas Sumatera Utara                                                     |
| Alamat: Jalan Dr T Mansur No 9 Padang Bulan                                                    | Atribut  | Menjelaskan alamat fisik Universitas Sumatera Utara                                                         |
| Kode pos: 20155                                                                                | Atribut  | Menjelaskan kode pos dari alamat Universitas Sumatera Utara                                                 |
| Situs web resmi: [www.usu.ac.id](http://www.usu.ac.id)                                         | Atribut  | Menjelaskan situs web resmi Universitas Sumatera Utara                                                      |
| Universitas Sumatera Utara → member of → ASEAN University Network                              | Relasi   | Menunjukkan hubungan keanggotaan Universitas Sumatera Utara di dalam ASEAN University Network               |
| Universitas Sumatera Utara → accredited by → National Accreditation Board for Higher Education | Relasi   | Menunjukkan hubungan pemeberian akreditasi Universitas Sumatera Utara dengan lembaga nasional               |
| Universitas Sumatera Utara → category for alumni of educational institution → Q9766158         | Relasi   | Menunjukkan hubungan Universitas Sumatera Utara dengan kategori alumni dari USU yang di identifikasi unik   |
| Universitas Sumatera Utara → has legal form → Perguruan Tinggi Negeri Badan Hukum              | Relasi   | Menunjukkan hubungan Universitas Sumatera Utara dengan sudah memiliki hukum di kelembagaannya               |
| Universitas Sumatera Utara → language of work or name → Indonesian                             | Relasi   | Menunjukkan hubungan Universitas Sumatera Utara dengan bahasa namanya dan bahasa yang digunakan dalam operasionalnya |


## 4. Pertanyaan Evaluasi 

### 1. Apa perbedaan web tradisional dan Web Semantik?
Jawaban: Perbedaan utama antara Web Tradisional dan Web Semantik terletak pada bagaimana komputer memproses informasi. Pada Web Tradisional, situs web itu dirancang supaya manusia bisa membaca dan mengerti isinya. Komputer hanya melihat data, tetapi tidak benar‑benar mengerti makna di baliknya.

Web Semantik itu dibuat supaya komputer lebih cerdas dalam memahami informasi. Komputer tidak hanya melihat kata‑kata di situs, tetapi juga mengenal arti dan hubungan antar informasi. Jadi, data yang didapatnya bisa diolah dan dicari dengan lebih akurat.

Contohnya, ada kalimat “Yabesh adalah mahasiswa di Universitas Sumatera Utara.” Pada Web Tradisional, komputer melihatnya hanya sebagai teks biasa tetapi pada Web Semantik komputer mengenali bahwa Yabesh adalah orang, mahasiswa adalah statusnya, dan Universitas Sumatera Utara adalah tempatnya belajar. Dengan begitu, informasinya itu punya hubungan yang jelas.

Jadi secara sederhana, Web Tradisional hanya menyampaikan informasi, sementara Web Semantik memudahkan komputer memahami informasi. Jadi bisa dibilang, Web Tradisional membuat komputer “membaca” teks, sedangkan Web Semantik membuat komputer “mengerti” teks.


### 2. Mengapa entitas membutuhkan identifier unik?
Jawaban: ...

### 3. Jelaskan subject, predicate, dan object.
Jawaban: ...

### 4. Apa keuntungan merepresentasikan informasi sebagai hubungan antarentitas dibandingkan hanya menyimpannya sebagai teks biasa ?
Jawaban: Informasi sebagai hubungan antarentitas memliki keterkaiatan antara satu data dan data lainnya sehingga pada mesin memudahkan proses pencarian, menganalisis data, serta pembuatan quary kompleks. Melalui informasi yang hubungan antara entitas data lebih terstruktur memungkinkan komputer melakukan penarikan kesimpulan secara otomatis atau inference, mengurangi pengulangan data dan mempermudah jalannya pertukaran informasi antar sistem. Dengan ini data dapat dipahami maknanya secara cepat, tepat dan efisien. Berbeda dengan teks biasa yang tidak terstruktur dan membutuhkan teknik kusus seperti NLP (Natural Language Processing) yang artinya menggunkan LLM (Large Language Model) atau AI dalam memproses data.


### 5. Bagaimana Knowledge Graph membantu AI?
Jawaban: ...
