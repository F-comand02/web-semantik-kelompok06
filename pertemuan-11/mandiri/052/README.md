# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

**Nama:** William Fransisco Sihotang
**NIM:** 251402052  
**Mata Kuliah:** Web Semantik

## Bagian A - LIMIT dan triple

- Triple dengan LIMIT 10: **30** (diukur 12 November 2026).
- Triple dengan LIMIT 30: **90**.
- Baris SELECT LIMIT 10 / kota berbeda: **10 / 10**.
- Mengapa hasilnya tepat 30: template CONSTRUCT memiliki tiga pola, yaitu tipe kota, label, dan populasi. Dalam pengambilan ini, sepuluh baris SELECT merujuk ke sepuluh kota yang berbeda. Tidak ada triple tipe atau label yang berulang, jadi sepuluh solution menghasilkan 30 triple berbeda. Pada LIMIT 30, hasil yang diamati juga 30 kota berbeda dan 90 triple. Endpoint Wikidata dapat berubah, dan urutan hasil tanpa ORDER BY tidak dijamin; angka screenshot bisa berbeda pada pengambilan berikutnya.

## Bagian B - DBpedia ke Turtle

- Output demo_c.py: **48 triple**, film tanpa tanggal: **16**.
- Sumber data: **DBpedia**.
- Untuk film yang tidak memiliki dbo:releaseDate, tiga pola yang tetap tercetak adalah rdf:type schema:Movie, schema:name, dan schema:director. Pola schema:datePublished tidak tercetak karena variabel ?rilis tidak terikat. OPTIONAL mempertahankan solution tanpa tanggal; template mengabaikan pola yang variabelnya tidak terikat, sehingga tidak terjadi error.
- Query lokal tanpa internet berhasil karena film_nolan.ttl sudah memuat graf yang diambil sebelumnya. Query Q_TANPA_TANGGAL hanya membaca file itu dan tidak menghubungi DBpedia. Jika seluruh demo_c.py dijalankan ulang tanpa internet, permintaan ke endpoint terjadi di awal dan gagal sebelum proses lokal.
- Query dengan dbo:Film menghasilkan 0 karena graf hasil CONSTRUCT hanya diberi tipe schema:Movie; triple rdf:type dbo:Film tidak ikut disalin ke film_nolan.ttl.

## Bagian C - Materialisasi

- Output demo_d.py: Sebelum: 0, Sesudah: 3, Ada Rina: 3.
- Jumlah Rina tetap 3 karena aturan materialisasi sudah dijalankan sebelum triple Rina ditambahkan. RDFLib tidak menjalankan ulang aturan secara otomatis; tiga individu yang sudah menjadi foaf:Person adalah Budi, Sari, dan Andi.
- Output materialisasi_ulang.py: Putaran 1: 4 triple baru | Person: 3; Rina masuk | Person: 3; Putaran 2 | Person: 4; Triple turunan disimpan terpisah: 6.
- Dari tujuh triple hasil query aturan pada putaran pertama, tiga bukan triple baru: ex:budi a ex:DosenTetap, ex:sari a ex:Dosen, dan ex:andi a ex:Mahasiswa. Ketiganya sudah ada sebagai tipe langsung pada data awal. Jalur rdfs:subClassOf* mengizinkan nol langkah, sehingga tipe langsung itu juga muncul dalam hasil CONSTRUCT.
- kampus_turunan.ttl memisahkan enam kesimpulan dari data asal, sehingga kesimpulan lebih mudah ditinjau atau dibuang saat taksonomi berubah. Perubahan tetap harus ditangani manual: perbarui graf sumber, jalankan ulang aturan, lalu bandingkan atau ganti graf turunan. Tidak ada pencabutan kesimpulan lama secara otomatis.

## Bagian D - Diagnosis

| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a.rq | 0 triple | Graf kosong tanpa error | WHERE mengikat ?f, tetapi template memakai ?film; ?film tidak terikat. | 3 triple, satu judul untuk masing-masing film Nolan |
| rusak_b.rq | 4 triple | Lebih banyak triple daripada target | Jalur foaf:name\|rdfs:label\|schema:name mengambil semua nama. Christopher Nolan punya foaf:name dan rdfs:label; literal dengan tag bahasa berbeda tetap berbeda. | 3 triple, satu nama per orang; prioritas nama: foaf:name, lalu rdfs:label, lalu schema:name |
| rusak_c.rq | 0 triple | Graf kosong tanpa error | WHERE hanya mencari tipe langsung ex:Permukiman, sedangkan Medan, Surabaya, dan Tomok bertipe sebagai kelas turunannya. | 3 triple: Medan, Surabaya, dan Tomok |

## Bagian E - Etika dan diskusi

| Aturan | a_kota_limit.rq | demo_c.py |
|--------|------------------|-------------|
| 1 User-Agent bermakna | Query dijalankan melalui browser; berkas .rq tidak mengatur User-Agent klien. | Baris UA memuat nama aplikasi dan email; nilainya diberikan melalui agent=UA. |
| 2 LIMIT saat eksplorasi | LIMIT 10 membatasi solution. | q_demo_b.rq tidak memiliki LIMIT. Pola film dan sutradara cukup spesifik untuk demo, tetapi penambahan LIMIT tetap layak dipertimbangkan saat eksplorasi endpoint. |
| 3 Simpan, jangan ulangi | Query browser hanya dipakai untuk melihat hasil dan mengambil screenshot; tidak ada proses lokal yang membaca graf simpanan. | Graf hasil satu permintaan disimpan dengan g.serialize(...), lalu query kedua membaca film_nolan.ttl. |
| 4 Jangkar jalur | Jalur wdt:P31/wdt:P279* berakhir pada IRI tetap wd:Q515 (kelas kota). | Tidak ada jalur * atau + dalam query ini; pola film ditambatkan pada dbo:Film dan dbr:Christopher_Nolan. |

- Versi yang melanggar aturan 4 berikut **hanya ditulis, tidak dijalankan**. Kedua ujung jalur subclass berupa variabel, tanpa IRI jangkar:

    PREFIX ex:   <http://contoh.id/>
    PREFIX wd:   <http://www.wikidata.org/entity/>
    PREFIX wdt:  <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    CONSTRUCT {
      ?kota a ex:Kota ;
            rdfs:label ?namaKota ;
            ex:populasi ?populasi .
    }
    WHERE {
      ?kelasAwal wdt:P279* ?kelasAkhir .
      ?kota wdt:P31 ?kelasAwal ;
            wdt:P17 wd:Q252 ;
            wdt:P1082 ?populasi ;
            rdfs:label ?namaKota .
      FILTER (LANG(?namaKota) = "id")
    }
    LIMIT 10

  Tanpa IRI tetap di ujung jalur, endpoint perlu menjelajahi banyak kemungkinan pasangan kelas subclass sebelum membatasi solution. LIMIT membatasi hasil akhir, bukan biaya pencarian jalur yang luas.

### Diskusi 1 - Taksonomi berubah

Misalkan tahun depan hubungan ex:Dosen rdfs:subClassOf foaf:Person dihapus dari taksonomi. Dalam kampus_turunan.ttl, kesimpulan ex:budi a foaf:Person, ex:sari a foaf:Person, dan ex:rina a foaf:Person menjadi usang karena semuanya bergantung pada jalur melalui ex:Dosen. Kesimpulan ex:andi a foaf:Person tetap didukung oleh jalur ex:Mahasiswa ke foaf:Person. Keadaan ini dapat ditemukan dengan membandingkan graf sumber dan taksonomi terbaru, menjalankan ulang aturan pada graf sumber yang bersih, lalu membandingkan hasil turunan lama dan baru. kampus_v4.ttl dari Demo D mencampur data asal dengan kesimpulan materialisasi dan tidak menandai asal setiap triple. kampus_turunan.ttl dari C2 menyimpan kesimpulan terpisah, sehingga lebih mudah diperiksa dan diganti. Percobaan sendiri menunjukkan risikonya: setelah Rina ditambahkan, hitungan Person pada C1 tetap 3 karena aturan tidak berjalan ulang; C2 menjalankan putaran kedua dan hitungannya menjadi 4. Jadi saat taksonomi berubah, tim tetap harus memperbarui data kelas, menghitung ulang kesimpulan, memeriksa selisihnya, dan mengganti graf turunan lama secara manual. Pemeriksaan ini juga harus memperhatikan pernyataan asal agar tidak menghapus fakta yang memang dinyatakan eksplisit.

### Diskusi 2 - SELECT atau CONSTRUCT

Untuk dashboard populasi, saya memilih SELECT karena dashboard membutuhkan kolom yang bisa difilter dan diringkas, misalnya kota, populasi, tahun, dan sumber. Pada pengambilan Wikidata saya, SELECT LIMIT 10 menghasilkan 10 baris untuk 10 kota, sedangkan CONSTRUCT menghasilkan 30 triple. Angka triple bukan jumlah kota; tiga pola template dicetak untuk setiap solution. Tidak ada kota berulang pada sepuluh baris pengambilan ini, jadi saya tidak mengklaim ada populasi ganda pada hasil tersebut. Namun data latihan kota.ttl memberi Medan dua nilai ex:populasi, contoh bahwa satu kota dapat punya beberapa angka yang perlu dibedakan berdasarkan tahun atau sumber, bukan dijumlahkan begitu saja. Untuk menggabungkan tiga sumber, saya akan memakai CONSTRUCT bila perlu membuat graf terpadu dengan IRI dan properti yang dinormalisasi, lalu SELECT untuk menghasilkan tabel dashboard. rusak_b.rq juga menunjukkan bahaya menggabungkan label tanpa aturan: Christopher Nolan memiliki literal "Christopher Nolan" dan "Christopher Nolan"@en, yang berbeda dalam RDF, sehingga query menghasilkan empat triple untuk tiga orang. Proses integrasi perlu memilih bahasa/nilai, mempertahankan sumber dan periode, lalu mengagregasi setelah duplikasi semantik ditangani.

### Cek diri

| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1. CONSTRUCT mencetak template sekali per solution dan menggabungkan triple kembar. | A: LIMIT 10 menghasilkan 30 triple dari 10 solution. Pada data kota, Medan memiliki dua nilai populasi; dua solution menghasilkan 7 triple berbeda, bukan 9, karena tipe dan label Medan yang sama digabung. |
| 2. Triple dengan variabel tak terikat tidak dicetak, tanpa error. | D: rusak_a.rq menghasilkan 0 triple karena ?film tidak terikat di WHERE; query tetap berjalan tanpa pesan error. |
| 3. UNION, jalur \|, dan VALUES menyatukan predikat berbeda. | D: rusak_b.rq memakai VALUES untuk tiga orang dan property path tiga predikat; hasilnya empat nama. perbaikan_b.rq memberi satu nama per orang, total tiga triple. |
| 4. Jalur + dan * menelusuri hierarki tanpa menyebut perantara. | C: aturan a/rdfs:subClassOf* menyimpulkan tipe Person melalui kelas antara; putaran pertama menambah empat triple baru dan putaran kedua dua triple. |
| 5. Materialisasi menyimpan kesimpulan, tetapi harus dihitung ulang. | C: C1 tetap menampilkan 3 Person setelah Rina masuk; C2 menjalankan putaran kedua dan menghasilkan 4 Person serta enam triple turunan. |

