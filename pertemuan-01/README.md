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

## 3. Eksplorasi Schema.org

Tipe yang digunakan: [EducationalOrganization](https://schema.org/EducationalOrganization) (diatas dari turunan CollegeUniversity)
| Property        | Fungsi                                                                | Contoh Nilai                     |
| --------------- | --------------------------------------------------------------------- | -------------------------------- |
| alumni          | Menunjukkan orang yang pernah menjadi lulusan universitas.            | B.J. Habibie                     |
| department      | Menunjukkan departemen atau bagian yang terdapat dalam universitas.   | Departemen Teknologi Informasi   |
| founder         | Menunjukkan pihak yang mendirikan universitas.                        | Pemerintah Republik Indonesia    |
| foundingDate    | Menunjukkan tanggal berdirinya universitas.                           | 1952-08-20                       |
| accreditation   | Menunjukkan informasi atau status akreditasi universitas.             | Akreditasi Unggul                |
| areaServed      | Menunjukkan wilayah yang dilayani atau menjadi cakupan universitas.   | Sumatera Utara                   |
| award           | Menunjukkan penghargaan yang pernah diterima universitas.             | Penghargaan Universitas Hijau    |
| knowsAbout      | Menunjukkan bidang ilmu atau topik yang menjadi keahlian universitas. | Artificial Intelligence          |
| memberOf        | Menunjukkan organisasi atau asosiasi yang diikuti universitas.        | Asosiasi Perguruan Tinggi        |
| sameAs          | Menunjukkan URL lain yang merujuk pada universitas yang sama.         | https://www.usu.ac.id/           |

## Implementasi JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Universitas Sumatera Utara",
  "alumni": {
    "@type": "Person",
    "name": "B.J. Habibie"
  },
  "department": {
    "@type": "Organization",
    "name": "Departemen Teknologi Informasi"
  },
  "founder": {
    "@type": "Organization",
    "name": "Pemerintah Republik Indonesia"
  },
  "foundingDate": "1952-08-20",
  "accreditation": "Akreditasi Unggul",
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Sumatera Utara"
  },
  "award": "Penghargaan Universitas Hijau",
  "knowsAbout": [
    "Artificial Intelligence",
    "Teknologi Informasi"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Asosiasi Perguruan Tinggi"
  },
  "sameAs": "https://www.usu.ac.id/"
}
```


## 4. Pertanyaan Evaluasi 

### 1. Apa perbedaan web tradisional dan Web Semantik?
Jawaban: Perbedaan utama antara Web Tradisional dan Web Semantik terletak pada bagaimana komputer memproses informasi. Pada Web Tradisional, situs web itu dirancang supaya manusia bisa membaca dan mengerti isinya. Komputer hanya melihat data, tetapi tidak benar‑benar mengerti makna di baliknya.

Web Semantik itu dibuat supaya komputer lebih cerdas dalam memahami informasi. Komputer tidak hanya melihat kata‑kata di situs, tetapi juga mengenal arti dan hubungan antar informasi. Jadi, data yang didapatnya bisa diolah dan dicari dengan lebih akurat.

Contohnya, ada kalimat “Yabesh adalah mahasiswa di Universitas Sumatera Utara.” Pada Web Tradisional, komputer melihatnya hanya sebagai teks biasa tetapi pada Web Semantik komputer mengenali bahwa Yabesh adalah orang, mahasiswa adalah statusnya, dan Universitas Sumatera Utara adalah tempatnya belajar. Dengan begitu, informasinya itu punya hubungan yang jelas.

Jadi secara sederhana, Web Tradisional hanya menyampaikan informasi, sementara Web Semantik memudahkan komputer memahami informasi. Jadi bisa dibilang, Web Tradisional membuat komputer “membaca” teks, sedangkan Web Semantik membuat komputer “mengerti” teks.


### 2. Mengapa entitas membutuhkan identifier unik?
Jawaban: Suatu entitas membutuhkan identifier unik karena namanya bisa disebut dengan banyak cara berbeda, seperti "Universitas Sumatera Utara", "University of North Sumatra", atau "USU", sehingga tanpa ID yang pasti, mesin bisa bingung apakah semua sebutan itu merujuk pada entitas yang sama. Selain itu, ada universitas lain dengan nama mirip seperti Universitas Islam Sumatera Utara dan Universitas Muhammadiyah Sumatera Utara, sehingga identifier unik seperti Q4200341 memastikan tidak terjadi kesalahan atau tertukar antara satu entitas dengan entitas lain yang serupa. Identifier ini juga membuat data bisa dihubungkan lintas sumber, misalnya Wikipedia Bahasa Indonesia dan Bahasa Inggris bisa merujuk ke entitas yang sama lewat satu ID yang konsisten, sehingga data lebih mudah diproses dan dinalar oleh mesin dibanding hanya mengandalkan teks nama saja. Terakhir, identifier unik memberi stabilitas jangka panjang, karena meskipun nama entitas berubah di masa depan, ID seperti Q4200341 akan tetap sama sehingga semua relasi dan data yang sudah dibangun sebelumnya tetap valid dan tidak rusak.

### 3. Jelaskan subject, predicate, dan object.
Jawaban: Pada Web Semantik, ada yang namanya RDF Triple yaitu cara untuk menyusun sebuah informasi menjadi tiga bagian: subjek, predikat, dan objek. Ketiganya bisa dianggap seperti susunan kalimat biasa supaya komputer lebih mudah memahami informasi.
Subjek adalah siapa atau apa yang sedang dibicarakan. Contoh sederhananya ada dalam kalimat "Naufal adalah mahasiswa di Universitas Sumatera Utara", maka Naufal adalah subjek karena Naufal yang sedang dibicarakan. Predikat adalah hubungan atau keterangan yang menjelaskan subjek dengan objek. Pada contoh kalimat tersebut, "adalah mahasiswa di" menjadi predikat. Sedangkan objek adalah informasi yang berhubungan dengan subjek, yaitu "Universitas Sumatera Utara".
Jadi, kalau digabungkan, contohnya adalah "Naufal → adalah mahasiswa di → USU". Naufal merupakan subjek, "adalah mahasiswa di" merupakan predikat, dan USU merupakan objek. Dengan cara seperti ini, komputer tidak hanya melihat kalimat sebagai tulisan biasa, tetapi bisa mengetahui hubungan antara Naufal dan Universitas Sumatera Utara. 


### 4. Apa keuntungan merepresentasikan informasi sebagai hubungan antarentitas dibandingkan hanya menyimpannya sebagai teks biasa ?
Jawaban: Informasi sebagai hubungan antarentitas memliki keterkaiatan antara satu data dan data lainnya sehingga pada mesin memudahkan proses pencarian, menganalisis data, serta pembuatan quary kompleks. Melalui informasi yang hubungan antara entitas data lebih terstruktur memungkinkan komputer melakukan penarikan kesimpulan secara otomatis atau inference, mengurangi pengulangan data dan mempermudah jalannya pertukaran informasi antar sistem. Dengan ini data dapat dipahami maknanya secara cepat, tepat dan efisien. Berbeda dengan teks biasa yang tidak terstruktur dan membutuhkan teknik kusus seperti NLP (Natural Language Processing) yang artinya menggunkan LLM (Large Language Model) atau AI dalam memproses data.


### 5. Bagaimana Knowledge Graph membantu AI?
Jawaban: Knowledge Graph membantu AI dengan menyusun informasi dan hubungan antar informasi secara terstruktur. Dengan adanya struktur ini, AI tidak hanya memahami informasi secara terpisah, tetapi juga mengetahui bagaimana satu informasi berhubungan dengan informasi lainnya. Hal ini membuat AI lebih mudah memahami konteks, menghubungkan fakta, mencari informasi yang relevan, dan melakukan reasoning. Misalnya, AI dapat memahami bahwa Messi bermain untuk Barcelona, Barcelona berada di Spanyol, dan Spanyol berada di Eropa. Sederhananya, Knowledge Graph seperti peta pengetahuan yang membantu AI melihat dan memahami hubungan antara berbagai informasi dengan lebih jelas dan terstruktur.

