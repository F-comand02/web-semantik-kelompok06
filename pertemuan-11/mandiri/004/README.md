# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

**Nama:** Yabesh Day Siahaan  
**NIM:** 251402004  
**Mata Kuliah:** Web Semantik

---

## Bagian A - LIMIT dan Triple

- Triple dengan LIMIT 10: 30 triple (`screenshots/a-limit10.png`)
- Triple dengan LIMIT 30: 90 triple
- Baris SELECT LIMIT 10: 10 baris
- Jumlah kota berbeda: 10 kota

**Penjelasan:**

CONSTRUCT mempunyai tiga pola template, yaitu tipe kota, label kota, dan populasi kota. Dengan LIMIT 10, setiap solution menghasilkan tiga pola triple sehingga jumlah maksimal teoritis adalah 30 triple.

Hasil pengujian LIMIT 10 menghasilkan tepat 30 triple. Hal ini terjadi karena terdapat 10 solution dengan 10 entitas kota yang berbeda. Setiap entitas mempunyai satu label nama (`rdfs:label`) dan satu nilai populasi (`ex:populasi`).

Pada pengujian LIMIT 30, hasilnya adalah 90 triple. Hal ini karena jumlah solution yang diproses meningkat menjadi 30 dan setiap solution menghasilkan tiga pola triple.

Perbandingan hasil:

| Pengujian | Jumlah solution | Jumlah triple |
|---|---:|---:|
| LIMIT 10 | 10 | 30 |
| LIMIT 30 | 30 | 90 |

Dengan demikian, LIMIT membatasi jumlah solution yang diproses, bukan secara langsung membatasi jumlah triple yang dihasilkan. Jumlah triple juga dipengaruhi oleh pola CONSTRUCT dan kemungkinan adanya triple identik yang digabungkan oleh RDF Graph.

---

## Bagian B - DBpedia ke Turtle

- Output `demo_c.py`: 48 triple.
- Film tanpa tanggal: 16 film.
- Sumber data: DBpedia.

**Triple yang tetap tercetak untuk film tanpa tanggal:**

Triple yang tetap tercetak adalah tipe film (`?film a schema:Movie`), nama film (`schema:name ?judul`), dan sutradara (`schema:director ?sutradara`).

Sementara itu, triple tanggal rilis (`schema:datePublished ?rilis`) tidak tercetak. Hal ini terjadi karena klausa `OPTIONAL` tidak menemukan nilai untuk variabel `?rilis`, sehingga variabel tersebut menjadi *unbound*.

SPARQL tetap dapat menampilkan bagian data yang variabelnya berhasil ditemukan. Dengan demikian, tidak ditemukannya tanggal rilis tidak menyebabkan seluruh query gagal.

**Query lokal tanpa internet:**

Query lokal berhasil karena data sudah disimpan dalam file `film_nolan.ttl`. RDFLib membaca file tersebut secara langsung dan menjalankan query menggunakan data lokal tanpa harus mengakses endpoint DBpedia.

Hasil query lokal:

```text
Film tanpa tanggal: 16
```

Namun, ketika seluruh `demo_c.py` dijalankan kembali tanpa internet, program mengalami error:

```text
urllib.error.URLError:
<urlopen error [Errno 11001] getaddrinfo failed>
```

Error tersebut terjadi karena program masih mencoba mengirim request HTTP ke endpoint eksternal DBpedia (`https://dbpedia.org/sparql`), sedangkan jaringan internet tidak tersedia.

**Mengapa `dbo:Film` menghasilkan 0 pada `film_nolan.ttl`?**

Hal tersebut terjadi karena hasil CONSTRUCT telah memetakan tipe film menjadi `schema:Movie`, bukan `dbo:Film`.

Di dalam file `film_nolan.ttl`, tidak terdapat triple yang menggunakan tipe `dbo:Film`. Oleh karena itu, query yang mencari entitas dengan tipe tersebut tidak menemukan hasil dan menghasilkan 0 solution.

---

## Bagian C - Materialisasi

### C1. Output `demo_d.py`

```text
Sebelum: 0
Sesudah: 3
Ada Rina: 3
```

**Mengapa Ada Rina bernilai 3?**

Nilai Ada Rina tetap 3 karena proses materialisasi hanya dilakukan satu kali sebelum data Rina ditambahkan ke dalam graf.

Ketika data `ex:rina a ex:DosenTetap` dimasukkan ke dalam graf, triple turunan yang menyatakan bahwa Rina juga merupakan `foaf:Person` belum terbentuk.

Hal ini terjadi karena aturan inferensi tidak dijalankan kembali setelah Rina ditambahkan. Tanpa proses materialisasi ulang atau reasoner yang berjalan secara dinamis, graf tidak otomatis menghasilkan tipe turunan untuk Rina.

### C2. Output `materialisasi_ulang.py`

```text
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6
```

**Tiga triple yang bukan baru:**

Contoh triple yang sudah ada dalam graf dasar adalah:

```turtle
ex:budi a ex:DosenTetap .
ex:siti a ex:DosenKontrak .
ex:joko a ex:Mahasiswa .
```

Ketiga triple tersebut bukan triple baru karena sudah terdapat dalam graf awal `kampus.ttl`.

Pola property path `a/rdfs:subClassOf*` juga mencakup jalur dengan panjang nol (`* = 0`). Artinya, sebuah entitas dapat dipetakan ke kelas asalnya sendiri tanpa harus melewati kelas induk.

Karena triple tersebut sudah ada dalam graf dasar, triple tidak dimasukkan kembali sebagai hasil inferensi baru.

**Kegunaan `kampus_turunan.ttl`:**

File `kampus_turunan.ttl` digunakan untuk menyimpan triple hasil inferensi secara terpisah dari triple fakta dasar (*asserted facts*).

Pemisahan ini berguna untuk mempermudah pemeliharaan data. Jika taksonomi ontologi berubah, triple hasil inferensi lama dapat dihapus atau dihitung ulang tanpa merusak data asli.

Langkah manual yang perlu dilakukan adalah memperbarui taksonomi, menghapus atau mereset graf turunan lama, kemudian menjalankan kembali script materialisasi berdasarkan ontologi terbaru.

---

## Bagian D - Diagnosis

Hasil pengujian query yang mengalami kesalahan:

```text
rusak_a.rq: 0 triple
rusak_b.rq: 4 triple
rusak_c.rq: 0 triple
```

| Query | Hasil mesin | Gejala | Penyebab | Hasil setelah diperbaiki |
|---|---:|---|---|---:|
| `rusak_a.rq` | 0 triple | Graf kosong tanpa error | Perbedaan nama variabel antara CONSTRUCT (`?film`) dan WHERE (`?f`) | 3 triple |
| `rusak_b.rq` | 4 triple | Terdapat nilai nama yang tampak sama tetapi berbeda tag bahasa | Penggunaan beberapa predikat nama tanpa filter bahasa | 3 triple |
| `rusak_c.rq` | 0 triple | Superkelas tidak ditemukan | Tidak menggunakan jalur `rdfs:subClassOf*` | 3 triple |

**Penjelasan kesalahan:**

1. `rusak_a.rq`: Variabel yang digunakan pada bagian CONSTRUCT tidak terikat dengan variabel pada WHERE. Akibatnya, query tidak menghasilkan triple.
2. `rusak_b.rq`: Penggunaan beberapa predikat nama tanpa filter bahasa menyebabkan satu orang dapat mempunyai lebih dari satu literal nama. Contohnya `"Christopher Nolan"` dan `"Christopher Nolan"@en`.
3. `rusak_c.rq`: Query hanya mencari tipe langsung `ex:Permukiman`, sehingga tidak dapat menemukan entitas yang memperoleh tipe tersebut melalui hubungan subclass.

**Hasil setelah diperbaiki:**

- `perbaikan_a.rq` menghasilkan 3 triple, yaitu Following, Insomnia, dan Memento.
- `perbaikan_b.rq` menghasilkan 3 triple, yaitu satu nama untuk setiap orang.
- `perbaikan_c.rq` menghasilkan 3 triple, yaitu Medan, Surabaya, dan Tomok.

Perbaikan dilakukan dengan menyamakan variabel, mengatur pemilihan literal nama, dan menggunakan property path untuk menelusuri hubungan subclass.

---

## Bagian E - Etika dan Diskusi

### E1. Etika Endpoint

| Aturan | `a_kota_limit.rq` | `demo_c.py` |
|---|---|---|
| 1. User-Agent | User-Agent diatur oleh HTTP client yang mengirim query. | Menggunakan variabel `UA` yang diteruskan ke SPARQLWrapper. |
| 2. LIMIT | Menggunakan `LIMIT 10`. | Query pengambilan data tidak menggunakan LIMIT, tetapi dijangkarkan pada entitas Christopher Nolan. |
| 3. Simpan, jangan ulangi | Hasil query dapat disimpan untuk digunakan kembali. | Menyimpan hasil graf ke `film_nolan.ttl`. |
| 4. Jangkar jalur | Menggunakan IRI `wd:Q515` dan `wd:Q252` sebagai jangkar. | Menggunakan IRI spesifik `dbr:Christopher_Nolan`. |

**Query yang melanggar aturan 4:**

Contoh query berikut tidak dijalankan karena menggunakan property path tanpa IRI jangkar.

```sparql
PREFIX ex: <http://contoh.id/>

CONSTRUCT {
    ?s ex:terhubung ?o .
}
WHERE {
    ?s ?p* ?o .
}
LIMIT 10
```

Query tersebut tidak memiliki IRI jangkar pada property path. Akibatnya, endpoint dapat mengeksplorasi kemungkinan hubungan yang sangat luas sehingga membutuhkan sumber daya dan waktu pemrosesan lebih besar.

### Diskusi 1 - Taksonomi Berubah

Jika suatu saat taksonomi ontologi berubah, misalnya `ex:Dosen` tidak lagi menjadi subclass dari `foaf:Person`, beberapa triple hasil inferensi yang sebelumnya benar dapat menjadi tidak berlaku.

Contohnya adalah triple yang menyatakan bahwa seorang dosen merupakan `foaf:Person`. Jika hubungan subclass tersebut dihapus, kesimpulan yang sebelumnya dihasilkan dari hubungan itu perlu diperiksa dan dihitung ulang.

Pada C1, file `kampus_v4.ttl` menyimpan fakta awal sekaligus triple hasil inferensi. Karena keduanya tercampur, pemeriksaan harus dilakukan dengan membedakan fakta asli dan fakta hasil inferensi.

Berbeda dengan C1, pada C2 file `kampus_turunan.ttl` menyimpan triple hasil inferensi secara terpisah. Hal ini mempermudah proses pemeriksaan karena fakta asli dan kesimpulan yang dihasilkan oleh aturan dapat dibedakan.

Langkah yang perlu dilakukan adalah memperbarui taksonomi, menghapus atau mengganti hasil materialisasi lama, kemudian menjalankan kembali aturan terhadap data dasar. Dengan demikian, kesimpulan yang sudah tidak sesuai dapat diperbarui.

Proses tersebut tetap membutuhkan tindakan manual apabila belum menggunakan reasoner otomatis.

### Diskusi 2 - SELECT atau CONSTRUCT

Untuk membuat dashboard populasi kota, saya memilih **SELECT** karena dashboard membutuhkan data yang dapat ditampilkan secara langsung, seperti nama kota dan jumlah penduduk. SELECT juga mempermudah proses pengolahan data, pengurutan, penyaringan, dan pengelompokan.

Temuan pada Bagian A menunjukkan bahwa LIMIT membatasi jumlah solution, bukan jumlah triple. Oleh karena itu, data perlu diperiksa terlebih dahulu agar jumlah penduduk yang ditampilkan tidak salah atau terduplikasi.

Sementara itu, untuk menggabungkan data kota dari tiga sumber berbeda, saya memilih **CONSTRUCT**. Alasannya, CONSTRUCT dapat membentuk graf RDF baru dengan kosakata yang sudah diseragamkan.

Sebagai contoh, data dari beberapa sumber dapat dipetakan menjadi `ex:Kota`, `rdfs:label`, dan `ex:populasi`.

Temuan pada `rusak_b.rq` juga menunjukkan bahwa satu orang dapat mempunyai beberapa nilai nama dengan tag bahasa berbeda. Contohnya adalah `"Christopher Nolan"` dan `"Christopher Nolan"@en`. Hal tersebut perlu diperhatikan saat menggabungkan data agar tidak menghasilkan informasi nama yang berulang.

Kesimpulannya, SELECT lebih sesuai untuk mengambil data dashboard, sedangkan CONSTRUCT lebih sesuai untuk integrasi dan penyelarasan data dari berbagai sumber.

---

## Cek Diri

| Pernyataan | Bukti dari tugas |
|---|---|
| 1. CONSTRUCT mencetak template untuk setiap solution dan menggabungkan triple identik. | Bagian A: tiga pola template menghasilkan 30 triple pada LIMIT 10 dan 90 triple pada LIMIT 30. |
| 2. Triple dengan variabel tidak terikat tidak dicetak tanpa menyebabkan seluruh query gagal. | Bagian B: OPTIONAL membuat `?rilis` menjadi unbound. Bagian D: `rusak_a.rq` menghasilkan 0 triple. |
| 3. UNION, property path alternatif, dan VALUES dapat digunakan untuk menggabungkan pencarian beberapa predikat. | Bagian D: `rusak_b.rq` dan `perbaikan_b.rq` menguji pencarian beberapa properti nama. |
| 4. Property path `rdfs:subClassOf*` dapat menelusuri hierarki kelas. | Bagian C dan D: materialisasi serta `perbaikan_c.rq` menggunakan jalur subclass. |
| 5. Materialisasi menyimpan kesimpulan, tetapi perlu dihitung ulang ketika data atau taksonomi berubah. | Bagian C: jumlah Person tetap 3 sebelum materialisasi ulang dan menjadi 4 setelah Putaran 2. |

---

## Screenshot

Screenshot pengerjaan yang tersedia disimpan dalam folder `screenshots`:

1. `a-limit10.png`

Screenshot lain dapat ditambahkan apabila sudah tersedia.

---