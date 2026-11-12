# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30
- Triple dengan LIMIT 30: 90
- Baris SELECT LIMIT 10 / kota berbeda: 10
- Mengapa tidak (atau mengapa tepat) 30 triple: iya, Karena LIMIT 10 membatasi jumlah solusi menjadi maksimal 10, sedangkan setiap solusi hanya menghasilkan 3 pola triple. 3x10= 30

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia / film_nolan.ttl
- Triple yang tetap tercetak untuk film tanpa tanggal: Untuk film yang tidak memiliki dbo:releaseDate, triple ?film a schema:Movie, schema:name ?judul, dan schema:director dbr:Christopher_Nolan tetap tercetak karena informasi tersebut tersedia. Sementara itu, triple schema:datePublished ?rilis tidak tercetak karena data tanggal rilis tidak ditemukan. Tidak ada pesan error karena penggunaan OPTIONAL memungkinkan data tanggal rilis tidak tersedia tanpa menggagalkan keseluruhan query.
- Query lokal tanpa internet: Query Q_TANPA_TANGGAL tetap berhasil dijalankan ketika internet dimatikan karena query tersebut menggunakan data dari file lokal film_nolan.ttl, bukan mengambil data langsung dari DBpedia.Namun, jika seluruh program demo_c.py dijalankan ulang tanpa internet, program akan gagal pada bagian pengambilan data dari DBpedia karena membutuhkan koneksi internet untuk mengirim query dan menerima hasilnya.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: Query kedua menggunakan schema:Movie karena tipe film yang disimpan dalam film_nolan.ttl adalah schema:Movie, bukan dbo:Film. Keduanya berasal dari vocabulary yang berbeda. Oleh karena itu, jika menggunakan dbo:Film, hasilnya 0 karena tipe tersebut tidak tersimpan dalam file Turtle.

## Bagian C - Materialisasi

### 1. Output demo_d.py
Sebelum: 0
Sesudah: 3
Ada Rina: 3

### 2. Mengapa Ada Rina bernilai 3?
Karena setelah Rina ditambahkan, aturan materialisasi belum dijalankan kembali. Akibatnya, tipe foaf:Person untuk Rina belum terbentuk sehingga jumlah Person tetap 3.

### 3. Output materialisasi_ulang.py
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6

### 4. Tiga triple yang bukan baru
Tiga triple tersebut sudah ada di graf awal (kampus.ttl). Hal ini terjadi karena penggunaan rdfs:subClassOf* memungkinkan jalur nol langkah, sehingga tipe awal juga dihasilkan kembali. Namun, triple tersebut tidak dihitung sebagai triple baru karena sudah ada di graf.

### 5. Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa
File kampus_turunan.ttl berguna untuk menyimpan triple hasil inferensi secara terpisah dari data asli.

Langkah manual yang masih diperlukan adalah menjalankan ulang aturan materialisasi setiap kali ada data baru agar triple turunannya ikut diperbarui.

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | 0         | Graf kosong tanpa error | Variabel ?film pada CONSTRUCT berbeda dengan ?f pada WHERE, sehingga variabel tidak terikat.	| 3 |
| rusak_b | 4 | Triple lebih banyak dari target | Christopher Nolan memiliki dua nilai nama yang cocok, yaitu foaf:name dan rdfs:label dengan tag bahasa berbeda.| 3 |
| rusak_c | 0 | Superkelas tidak ditemukan|Query hanya mencari tipe ex:Permukiman secara langsung dan tidak menelusuri hubungan rdfs:subClassOf.| 3 |

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak diterapkan secara langsung karena file .rq hanya berisi query SPARQL. |Diterapkan menggunakan agent=UA pada SPARQLWrapper.|
| 2 LIMIT |Diterapkan dengan LIMIT 10 untuk membatasi hasil query maksimal 10 data. |Belum dapat dipastikan karena query yang dijalankan berasal dari file q_demo_b.rq, sehingga perlu memeriksa isi file tersebut.|
| 3 Simpan, jangan ulangi | Tidak terlihat proses penyimpanan hasil query ke file lokal.|Hasil query disimpan ke film_nolan.ttl, kemudian dibaca kembali menggunakan RDFLib. Namun, script masih menghubungi endpoint setiap kali dijalankan ulang.|
| 4 Jangkar jalur |Diterapkan melalui wdt:P31/wdt:P279* wd:Q515, karena menggunakan wd:Q515 sebagai target tetap pada property path.|Belum dapat dipastikan karena property path terdapat dalam file q_demo_b.rq, yang belum diperiksa.|
- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya:
 ```sparql
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

SELECT ?awal ?akhir
WHERE {
    ?awal (wdt:P279|wdt:P31)* ?akhir .
}
LIMIT 10
```
Query tersebut melanggar aturan 4 karena kedua ujung property path menggunakan variabel bebas, yaitu ?awal dan ?akhir, tanpa titik awal atau target yang spesifik. Hal ini dapat menyebabkan endpoint menelusuri hubungan yang sangat luas dan membutuhkan banyak sumber daya. Penggunaan LIMIT 10 tidak selalu mencegah beban pemrosesan yang besar karena pembatasan hasil tidak menjamin pembatasan proses pencarian.
### Diskusi 1 - Taksonomi berubah
Pada perbandingan `kampus_v4.ttl` dari C1 dengan `kampus_turunan.ttl` dari C2, terdapat beberapa triple hasil materialisasi yang perlu diperiksa kembali. Pada `kampus_v4.ttl`, Andi memiliki tipe `ex:Mahasiswa`, Budi memiliki tipe `ex:Dosen` dan `ex:DosenTetap`, sedangkan Sari memiliki tipe `ex:Dosen`. Berdasarkan hierarki subclass, ketiganya dapat memiliki tipe turunan `foaf:Person`, karena `ex:Mahasiswa` dan `ex:Dosen` merupakan subclass dari `foaf:Person`.

Namun, pada `kampus_turunan.ttl` terdapat data Rina dengan tipe `ex:Dosen` dan `foaf:Person`, sedangkan Rina tidak ditemukan dalam data sumber `kampus_v4.ttl`. Oleh karena itu, kedua triple milik Rina tersebut tidak dapat dibuktikan berdasarkan data C1 dan perlu diperiksa apakah berasal dari data lama atau sumber lain.

Untuk menemukannya, saya membandingkan hasil materialisasi dengan data sumber dan memeriksa hubungan `rdf:type` serta `rdfs:subClassOf`. Jika hierarki kelas berubah, hasil inferensi lama harus dihitung ulang agar tidak menyimpan informasi yang sudah tidak sesuai. Dengan demikian, materialisasi perlu diperbarui setiap kali taksonomi mengalami perubahan.

### Diskusi 2 - SELECT atau CONSTRUCT
Untuk membuat dashboard populasi kota, saya memilih SELECT karena hasil yang dibutuhkan berupa data terstruktur dalam bentuk tabel, seperti nama kota dan jumlah penduduk. Dengan SELECT, data dapat langsung ditampilkan dan diolah untuk kebutuhan dashboard, misalnya pengurutan berdasarkan jumlah penduduk atau perbandingan antarwilayah.

Sementara itu, CONSTRUCT lebih cocok digunakan ketika ingin menggabungkan data dari tiga sumber menjadi sebuah graf RDF baru dengan struktur dan kosakata yang seragam. Hasilnya dapat digunakan kembali sebagai knowledge graph atau diproses dengan query lain.

Pilihan tersebut juga didasarkan pada temuan di Bagian A. Pada data kota, Medan memiliki dua nilai populasi, yaitu 2.435.252 dan 2.097.610. Hal ini menunjukkan bahwa data dari sumber berbeda bisa memiliki nilai yang tidak sama sehingga perlu dilakukan validasi sebelum ditampilkan. Selain itu, pada query rusak_b.rq, satu orang dapat memiliki lebih dari satu nama karena query mengambil data dari beberapa properti, yaitu foaf:name, rdfs:label, dan schema:name. Christopher Nolan, misalnya, memiliki dua nilai nama dengan tag bahasa yang berbeda.

Oleh karena itu, penggabungan data tidak cukup hanya mengumpulkan seluruh nilai. Data perlu dibersihkan, diperiksa bahasa literalnya, dan disesuaikan agar tidak menghasilkan informasi ganda atau bertentangan.

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1. CONSTRUCT mencetak template sekali per solution dan menggabungkan triple kembar | Bagian A, LIMIT 10 menghasilkan maksimal 30 triple karena setiap solution menghasilkan 3 pola triple. Hasil pengujian menunjukkan 30 triple. |
| 2. Triple dengan variabel tak terikat tidak dicetak, tanpa error | Demo C, nomor 1. Film yang tidak memiliki dbo:releaseDate tetap menghasilkan triple lainnya. Triple datePublished tidak dicetak karena variabel tanggal tidak memiliki nilai. Query tetap berjalan tanpa error.|
| 3. UNION, jalur |, dan VALUES menyatukan predikat berbeda |, dan VALUES menyatukan predikat berbeda |Bagian D, rusak_b.rq. VALUES berisi 3 orang, yaitu Christopher Nolan, Joko Anwar, dan Mira Lesmana. Jalur | digunakan untuk mencari nama melalui tiga predikat berbeda, yaitu foaf:name, rdfs:label, dan schema:name.|
| 4. Jalur + dan * menelusuri hierarki tanpa menyebut perantara |Bagian C, materialisasi menggunakan jalur rdfs:subClassOf*. Rina yang bertipe DosenTetap dapat dikenali sebagai Person tanpa harus menuliskan setiap kelas perantara secara manual.|
| 5. Materialisasi menyimpan kesimpulan, tetapi harus dihitung ulang |Bagian C, materialisasi_ulang.py. Putaran pertama menghasilkan 4 triple baru dengan jumlah 3 Person. Setelah Rina ditambahkan, jumlah Person tetap 3. Setelah materialisasi dijalankan kembali, jumlah Person menjadi 4. Total triple turunan yang disimpan adalah 6.|
