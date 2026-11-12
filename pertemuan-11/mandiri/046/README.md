# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

**Nama:** Ray Nathan Geereno Saragih
**NIM:** 251402046  
**Mata Kuliah:** Web Semantik


## Bagian A - LIMIT dan triple

- Triple dengan LIMIT 10: 30
- Triple dengan LIMIT 30: 90
- Baris SELECT LIMIT 10 / kota berbeda: 10 / 10
- Mengapa tidak (atau mengapa tepat) 30 triple:  Hasilnya tepat mencapai 30 triple karena klausa LIMIT 10 membatasi jumlah solusi dari blok WHERE menjadi 10 baris, dan ke-10 baris pertama tersebut berasal dari 10 kota berbeda tanpa nilai populasi ganda sehingga 3 pola template CONSTRUCT mencetak 3 × 10 = 30 triple unik.

## Bagian B - DBpedia ke Turtle

- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia
- Triple yang tetap tercetak untuk film tanpa tanggal: Untuk film yang tidak memiliki properti dbo:releaseDate, tiga pola triple dari template CONSTRUCT tetap tercetak, yaitu ?film a schema:Movie, ?film schema:name ?judul, dan ?film schema:director dbr:Christopher_Nolan. Sementara itu, satu pola triple yang tidak tercetak adalah ?film schema:datePublished ?rilis. Tidak muncul pesan error karena pola dbo:releaseDate dibungkus dalam blok OPTIONAL { ?film dbo:releaseDate ?rilis } sehingga solusi tetap terbentuk dengan variabel ?rilis dalam keadaan tak terikat (unbound), dan standar SPARQL CONSTRUCT secara otomatis melewatkan pembentukan triple yang mengandung variabel tak terikat.
- Query lokal tanpa internet: Menjalankan hanya query Q_TANPA_TANGGAL pada berkas film_nolan.ttl berhasil berjalan tanpa koneksi internet karena data graf sudah tersimpan secara lokal di penyimpanan komputer dan dievaluasi langsung oleh pustaka rdflib secara luring. Namun, apabila seluruh skrip demo_c.py dijalankan ulang tanpa internet, program akan gagal dan memunculkan kesalahan jaringan (urllib.error.URLError) pada baris sp.queryAndConvert() karena SPARQLWrapper berupaya mengirimkan permintaan HTTP ke endpoint eksternal https://dbpedia.org/sparql.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: Berkas film_nolan.ttl menyimpan graf hasil keluaran query CONSTRUCT dari q_demo_b.rq, bukan salinan graf mentah dari DBpedia. Pada proses CONSTRUCT tersebut, kosakata kelas telah dipetakan dan dikonversi dari dbo:Film menjadi schema:Movie melalui pola template ?film a schema:Movie. Oleh karena itu, tidak ada lagi satu pun triple berpredikat rdf:type dengan objek dbo:Film di dalam film_nolan.ttl, sehingga query pencarian dbo:Film menghasilkan 0.

## Bagian C - Materialisasi

- Output demo_d.py:

```text
Sebelum: 0
Sesudah: 3
Ada Rina: 3
```

- Mengapa Ada Rina bernilai 3: Materialisasi dengan CONSTRUCT bekerja dengan cara mengevaluasi aturan pada saat query dieksekusi dan menambahkan hasilnya sebagai triple eksplisit ke dalam graf (g.add(t)), bukan memasang mekanisme inferensi dinamis yang aktif memantau perubahan graf. Ketika data baru ex:rina a ex:DosenTetap ditambahkan setelah blok CONSTRUCT selesai dijalankan, triple turunan ex:rina a foaf:Person tidak otomatis tercipta. Akibatnya, query Q_ORANG tetap hanya menemukan 3 individu yang sudah dimaterialisasi sebelumnya (ex:budi, ex:sari, dan ex:andi).

- Output materialisasi_ulang.py:

```text
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6
```

- Tiga triple yang bukan baru: Tiga triple yang dihasilkan query ATURAN namun bukan merupakan triple baru adalah pernyataan kelas asli yang sudah tercatat di dalam berkas kampus.ttl, yakni ex:budi a ex:DosenTetap, ex:sari a ex:Dosen, dan ex:andi a ex:Mahasiswa. Ketiga triple ini ikut tertangkap oleh query karena operator * (zero-or-more) pada jalur properti a/rdfs:subClassOf* turut mencocokkan panjang jalur nol langkah (kelas awal entitas itu sendiri sebelum menelusuri superkelas di atasnya).

- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: Penyimpanan hasil inferensi secara terpisah di dalam kampus_turunan.ttl menjaga agar graf data dasar (kampus.ttl) tetap bersih dan tidak tercampur dengan triple hasil penurunan. Apabila suatu hari taksonomi berubah—misalnya ex:Dosen tidak lagi menjadi subkelas foaf:Person—kita tidak perlu mencari dan menghapus triple turunan satu per satu dari graf utama; kita cukup membuang berkas kampus_turunan.ttl yang lama. Langkah manual yang tetap harus dilakukan adalah mengubah atau menghapus relasi rdfs:subClassOf pada skema taksonomi yang berubah tersebut, lalu menjalankan ulang skrip materialisasi_ulang.py untuk membangun kembali berkas kampus_turunan.ttl yang baru sesuai aturan terkini.

## Bagian D - Diagnosis

| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0 triple | Graf kosong, tanpa error | Variabel ?film pada baris CONSTRUCT { ?film ex:judul ?j . } tidak cocok dengan variabel ?f pada baris WHERE { ?f dbo:director dbr:Christopher_Nolan ; sehingga ?film selalu tak terikat (unbound). | 3 triple (dbr:Following, dbr:Insomnia, dan dbr:Memento dengan predikat ex:judul) |
| rusak_b | 4 triple | Dua nilai yang tampak sama | Jalur alternatif pada baris ?o foaf:name\|rdfs:label\|schema:name ?n . mencocokkan dua properti berbeda pada dbr:Christopher_Nolan yang menghasilkan Christopher Nolan (tanpa tag bahasa) dan Christopher Nolan@en (bertag bahasa Inggris). | 3 triple (masing-masing tepat satu ex:nama untuk dbr:Christopher_Nolan, dbr:Joko_Anwar, dan dbr:Mira_Lesmana) |
| rusak_c | 0 triple | Graf kosong, tanpa error | Pola WHERE { ?x a ex:Permukiman . } hanya mencocokkan tipe langsung tanpa jalur penelusuran hierarki kelas (/rdfs:subClassOf*), padahal individu di kota.ttl bertipe subkelasnya (ex:KotaMetropolitan, ex:KotaDiIndonesia, dan ex:Desa). | 3 triple (ex:Medan, ex:Surabaya, dan ex:Tomok bertipe ex:Permukiman) |

## Bagian E - Etika dan diskusi

| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak relevan di dalam berkas .rq karena query dijalankan langsung melalui antarmuka web Wikidata Query Service yang otomatis mengirimkan identitas header peramban (browser). | Memenuhi pada baris UA = "KelasWebSemantik/1.0 (raynathan@students.usu.ac.id)"  dan diteruskan ke parameter SPARQLWrapper("https://dbpedia.org/sparql", agent=UA). |
| 2 LIMIT | Memenuhi pada baris terakhir LIMIT 10 untuk membatasi jumlah baris solution yang diambil saat tahap eksplorasi data. | Tidak menggunakan LIMIT karena query q_demo_b.rq sudah dibatasi secara spesifik pada satu entitas sutradara (dbo:director dbr:Christopher_Nolan) sehingga jumlah datanya sudah kecil dan terkendali. |
| 3 Simpan, jangan ulangi | Tidak relevan di dalam sintaks .rq karena penyimpanan hasil query ke berkas lokal dilakukan secara manual oleh pengguna melalui antarmuka web endpoint. | Memenuhi pada baris g.serialize("film_nolan.ttl", format="turtle") yang menyimpan graf hasil query satu kali ke disk, lalu baris lokal = Graph().parse("film_nolan.ttl") memproses query lanjutan secara lokal tanpa menghubungi endpoint lagi. |
| 4 Jangkar jalur | Memenuhi pada pola ?kota wdt:P31/wdt:P279* wd:Q515 ; karena penelusuran jalur transitif * berjangkar pada IRI spesifik wd:Q515 (kelas kota) di posisi objek. | Tidak relevan karena query q_demo_b.rq yang dikirimkan oleh demo_c.py tidak menggunakan operator property path * maupun + sama sekali. |

### Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya

```sparql
PREFIX ex: <http://contoh.id/>
CONSTRUCT {
  ?kota a ex:Kota ;
        rdfs:label ?namaKota ;
        ex:populasi ?populasi .
}
WHERE {
  ?kota wdt:P31/wdt:P279* ?kelasApaSaja .
  ?kota wdt:P17 wd:Q252 ;
        wdt:P1082 ?populasi ;
        rdfs:label ?namaKota .
  FILTER ( LANG(?namaKota) = "id" )
}
LIMIT 10
```

Alasan: Pada pola ?kota wdt:P31/wdt:P279* ?kelasApaSaja, kedua ujung jalur properti (?kota dan ?kelasApaSaja) sama-sama berupa variabel bebas tanpa jangkar IRI tertentu. Akibatnya, mesin endpoint dipaksa menelusuri seluruh rantai subkelas wdt:P279* ke atas hingga ke akar ontologi untuk setiap entitas yang ada di Indonesia (wd:Q252), yang memicu ledakan kombinasi graf, membebani CPU serta memori server publik, dan sangat berisiko menyebabkan timeout.

### Diskusi 1 - Taksonomi berubah

Apabila tim menyimpan hasil materialisasi seperti pada berkas kampus_v4.ttl di Bagian C1 langsung ke dalam graf produksi, perubahan taksonomi setahun kemudian (misalnya kelas ex:Dosen tidak lagi menjadi subkelas foaf:Person) akan menyisakan triple rdf:type yang kini keliru secara semantik—secara spesifik adalah ex:budi a foaf:Person dan ex:sari a foaf:Person (serta ex:rina a foaf:Person bila telah dimaterialisasi). Pada kampus_v4.ttl, seluruh triple turunan tersebut telah menyatu dengan fakta dasar (ex:budi a ex:DosenTetap dan ex:sari a ex:Dosen) tanpa adanya catatan pembuktian (provenance) yang membedakan mana fakta asli dan mana hasil inferensi. Untuk menemukannya, tim harus menelusuri seluruh entitas yang memiliki relasi ke cabang kelas ex:Dosen pada skema lama dan menghapus triple foaf:Person satu per satu secara manual dengan risiko menghapus fakta eksplisit yang sah. Sebaliknya, pada pendekatan kampus_turunan.ttl di Bagian C2, seluruh triple hasil penurunan terisolasi dalam berkas tersendiri. Ketika taksonomi berubah, graf inti tetap bersih dari kesimpulan usang; tim cukup membuang berkas kampus_turunan.ttl lama dan menjalankan ulang materialisasi_ulang.py terhadap graf dasar.

### Diskusi 2 - SELECT atau CONSTRUCT

Untuk membangun dashboard populasi kota, query SELECT jauh lebih sesuai karena aplikasi antarmuka membutuhkan struktur data tabular (baris dan kolom berisi nama kota dan angka populasi) agar mudah diolah menjadi tabel atau grafik. Meskipun pada uji coba Bagian A (LIMIT 10) kebetulan muncul 10 kota berbeda, satu kota di Wikidata pada umumnya dapat menyimpan lebih dari satu nilai wdt:P1082 sehingga tetap berpotensi memunculkan baris populasi kembar pada skala data penuh; oleh karena itu, query SELECT untuk dashboard wajib dilengkapi fungsi agregasi seperti MAX(?populasi) dan klausa GROUP BY agar satu kota tidak tampil berulang kali. Di sisi lain, untuk menggabungkan data kota dari tiga sumber berbeda, query CONSTRUCT adalah pilihan yang tepat karena tujuannya membangun graf RDF terpadu dengan kosakata yang selaras (menyeragamkan berbagai skema sumber ke dalam satu ontologi lokal). Pengalaman mendiagnosis rusak_b.rq membuktikan pentingnya normalisasi saat menyatukan sumber: tanpa penyaringan tag bahasa atau pemilihan properti yang ketat, satu entitas yang sama (dbr:Christopher_Nolan) menghasilkan dua triple nama berbeda (Christopher Nolan dan Christopher Nolan@en). Dengan CONSTRUCT yang disertai FILTER bahasa atau STR(), duplikasi semantik lintas tiga sumber dapat dicegah sebelum data disimpan.



## Cek diri

| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 | Pada Bagian A, menjalankan a_kota_limit.rq dengan LIMIT 10 menghasilkan maksimal 30 triple karena setiap solution dicetak ke dalam 3 pola template dan apabila muncul triple kembar dari kota yang sama maka otomatis digabung menjadi satu oleh graf RDF. |
| 2 | Pada Bagian B2, data film dari DBpedia tanpa tanggal rilis (terdeteksi 16 film oleh Q_TANPA_TANGGAL) tidak memicu error saat dieksekusi; pola ?film schema:datePublished ?rilis pada template CONSTRUCT dilewati begitu saja sementara tiga pola lainnya tetap tercetak sehingga menghasilkan 48 triple. |
| 3 | Pada perbaikan_b.rq (Bagian D), penggunaan jalur alternatif rdfs:label\|schema:name bersama klausa VALUES ?o berhasil menyatukan dua predikat nama berbeda menjadi satu predikat seragam ex:nama untuk ketiga tokoh (dbr:Christopher_Nolan, dbr:Joko_Anwar, dan dbr:Mira_Lesmana), menghasilkan tepat 3 triple. |
| 4 | Pada perbaikan_c.rq (Bagian D), jalur a/rdfs:subClassOf* ex:Permukiman berhasil menelusuri hierarki kelas di kota.ttl dan menghasilkan 3 triple (ex:Medan, ex:Surabaya, dan ex:Tomok) tanpa perlu menyebutkan kelas perantara seperti ex:Kota, ex:KotaMetropolitan, ex:KotaDiIndonesia, maupun ex:Desa. |
| 5 | Pada Bagian C1 (demo_d.py), penambahan triple baru ex:rina a ex:DosenTetap ke graf tidak mengubah hasil query foaf:Person (Ada Rina: 3); kesimpulan baru untuk Rina baru tercatat (Putaran 2 \| Person: 4 dengan total 6 triple turunan) setelah fungsi materialisasi(g) dijalankan ulang pada Bagian C2 (materialisasi_ulang.py). |
