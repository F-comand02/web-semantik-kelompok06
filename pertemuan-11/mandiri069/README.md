# [Pertemuan 11](mandiri069/) - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30
- Triple dengan LIMIT 30: 90
- Baris SELECT LIMIT 10 / kota berbeda: 10 / 10
- Mengapa tidak (atau mengapa tepat) 30 triple: Hasil CONSTRUCT dari saya tepat mencapai 30 triple karena dari 10 baris hasil SELECT (Solution Bindings), seluruh nilai entitas `?kota` bersifat unik (terdapat 10 kota berbeda) dan masing-masing entitas hanya memiliki tepat 1 label nama (`rdfs:label`) serta 1 nilai populasi (`ex:populasi`). Karena template CONSTRUCT mendefinisikan 3 pola triple per baris entitas ($10 \text{ solution} \times 3 \text{ pola template} = 30 \text{ triple}$) dan tidak ada duplikasi entitas/triple kembar yang tereliminasi oleh sifat set RDF Graph, maka batas atas teoritis sebesar 30 triple terpenuhi sepenuhnya.

---

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
```PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python demo_c.py
48 triple
Film tanpa tanggal: 16
```
```PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python
Python 3.14.7 (tags/v3.14.7:823f032, Aug  5 2026, 10:51:32) [MSC v.1944 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
Ctrl click to launch VS Code Native REPL (https://aka.ms/python-native-repl)
>>> from rdflib import Graph
>>> Q_TANPA_TANGGAL = """PREFIX schema: <https://schema.org/>
... SELECT (COUNT(?f) AS ?n) WHERE { ?f a schema:Movie .
...   FILTER NOT EXISTS { ?f schema:datePublished ?d } }"""
>>> lokal = Graph().parse("film_nolan.ttl")   # tanpa internet
... for b in lokal.query(Q_TANPA_TANGGAL):
...     print("Film tanpa tanggal:", b.n)
...     
Film tanpa tanggal: 16
>>> exit()

- Sumber data: DBpedia
- Triple yang tetap tercetak untuk film tanpa tanggal: 
  Triple dari saya lakukan yang tetap tercetak adalah `?film a schema:Movie`, `schema:name ?judul`, dan `schema:director ?sutradara`. Sedangkan triple `schema:datePublished ?rilis` tidak tercetak. Hal ini terjadi karena klausa `OPTIONAL { ?film dbo:releaseDate ?rilis }` pada WHERE clause tidak menemukan nilai `?rilis` untuk film tersebut, sehingga variabel `?rilis` bernilai *unbound*. SPARQL tidak mencetak triple jika salah satu elemennya *unbound* dan klausa OPTIONAL menjamin tidak ada pesan error (*non-matching variables stay unbound*).
- Query lokal tanpa internet: 
  Kueri lokal setelah saya coba, `Q_TANPA_TANGGAL` yang dijalankan pada `film_nolan.ttl` berhasil karena proses parsing dan query SPARQL dieksekusi secara *in-memory* oleh pustaka `rdflib` menggunakan data lokal yang sudah tersimpan. Namun, saat `demo_c.py` dijalankan ulang secara keseluruhan tanpa internet, program mengalami crash/error `urllib.error.URLError: <urlopen error [Errno 11001] getaddrinfo failed>` pada baris `sp.queryAndConvert()` karena script mencoba melakukan *request* HTTP ke endpoint eksternal DBpedia (`https://dbpedia.org/sparql`) yang tidak dapat diakses tanpa jaringan.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: 
  Karena pada disitu file `film_nolan.ttl` merupakan hasil transformasi/konstruksi graf RDF dari klausa `CONSTRUCT` yang telah memetakan entitas film menjadi bertipe `schema:Movie` (`?film a schema:Movie`). Di dalam file `film_nolan.ttl` tidak ada triple yang menggunakan predicate-object `rdf:type dbo:Film`. Oleh karena itu, jika kueri kedua mencari entitas bertipe `dbo:Film`, hasil pencarian (*solution bindings*) akan bernilai 0.

---

## Bagian C - Materialisasi
- Output demo_d.py:
``` C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python demo_d.py
Sebelum: 0
Sesudah: 3
Ada Rina: 3

- Mengapa Ada Rina bernilai 3: 
  Karena nilai `Ada Rina` tetap 3 itu adalah proses materialisasi (pemetaan aturan `CONSTRUCT` yang inferensial) **hanya dijalankan satu kali di awal** sebelum data Rina ditambahkan ke dalam graf. Ketika data entitas `ex:rina a ex:DosenTetap` dimasukkan ke dalam graf `g`, triple turunan bahwa Rina juga merupakan `foaf:Person` belum pernah di-generate/ditambahkan. Tanpa adanya eksekusi ulang aturan materialisasi (atau tanpa adanya *reasoner* yang berjalan secara dinamis), graf tidak secara otomatis mematerialisasikan tipe implisit Rina menjadi `foaf:Person`.
- Output materialisasi_ulang.py:
```PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python materialisasi_ulang.py
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6

- Tiga triple yang bukan baru: 
  Contoh di dapat tiga triple yang sudah ada (bukan triple baru) adalah triple tipe asli (*explicit typing*) milik entitas yang sudah didefinisikan langsung di file `kampus.ttl`, yaitu:
  1. `<...budi> a ex:DosenTetap`
  2. `<...siti> a ex:DosenKontrak`
  3. `<...joko> a ex:Mahasiswa`
  
  Garis jalur `a/rdfs:subClassOf*` yang mencetak triple ini adalah **panjang jalur nol (`* = 0`)**, yaitu klausa `?x a ?x_type` di mana entitas memetakan tipenya sendiri ke superkelas pada tingkat yang sama (`?super` bernilai kelas asal dari entitas itu sendiri). Karena triple ini sudah ada di dalam graf asal `kampus.ttl`, maka `t not in g` bernilai *False* dan triple tersebut tidak dimasukkan ke dalam daftar triple baru.

- Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa: 
- **Kegunaan:** Untuk nanti memisahkan triple hasil inferensi/turunan ke file `kampus_turunan.ttl` secara independen dari triple fakta dasar (*asserted facts*) berguna untuk pemeliharaan data (*decoupling data*). Jika hirarki ontologi berubah (misalnya `ex:Dosen` tidak lagi dianggap subkelas dari `foaf:Person`), kita cukup menghapus atau me-reset file `kampus_turunan.ttl` tanpa merusak atau kehilangan data asli kampus.
- **Langkah Manual yang Tersisa:** Saya memuat langkah manual yang harus dilakukan adalah menghapus (*reset/clear*) graf turunan lama (`kampus_turunan.ttl`), lalu menjalankan ulang script aturan materialisasi dari awal berdasarkan ontologi baru agar triple turunan yang sudah usang tidak lagi mengotori dataset.

---

## Bagian D - Diagnosis
```Output:
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py film.ttl rusak_a.rq
0 triple
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py film.ttl rusak_b.rq
4 triple
  dbr:Christopher_Nolan ex:nama "Christopher Nolan" .
  dbr:Christopher_Nolan ex:nama "Christopher Nolan"@en .
  dbr:Joko_Anwar ex:nama "Joko Anwar"@id .
  dbr:Mira_Lesmana ex:nama "Mira Lesmana" .
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py kota.ttl rusak_c.rq
0 triple

| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
| --- | --- | --- | --- | --- |
| rusak_a | 0 triple | Graf kosong, tanpa error | Perbedaan nama variabel antara `CONSTRUCT` (`?film`) dan `WHERE` (`?f`) pada baris 2-3 | 3 triple, satu judul per film Nolan |
| rusak_b | 4 triple | Triplenya lebih 1 dari target / dua nilai yang tampak sama | Penggunaan predikat alternatif `foaf:name|rdfs:label|schema:name` tanpa filter bahasa pada baris 4 mencocokkan dua label untuk Christopher Nolan | 3 triple, tepat satu ex:nama per orang |
| rusak_c | 0 triple | Superkelas tidak ditemukan / Graf kosong | Penggunaan predikat `a ex:Permukiman` tanpa jalur `rdfs:subClassOf*` pada baris 4 gagal mendeteksi entitas yang merupakan subkelas dari Permukiman | 3 triple: Medan, Surabaya, Tomok |

```Output perbaikan:
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py film.ttl perbaikan_a.rq
3 triple
  dbr:Following ex:judul "Following"@en .
  dbr:Insomnia ex:judul "Insomnia"@en .
  dbr:Memento ex:judul "Memento"@en .
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py film.ttl perbaikan_b.rq
3 triple
  dbr:Christopher_Nolan ex:nama "Christopher Nolan" .
  dbr:Joko_Anwar ex:nama "Joko Anwar"@id .
  dbr:Mira_Lesmana ex:nama "Mira Lesmana" .
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069> python jalankan.py kota.ttl perbaikan_c.rq
3 triple
  ex:Medan rdf:type ex:Permukiman .
  ex:Surabaya rdf:type ex:Permukiman .
  ex:Tomok rdf:type ex:Permukiman .
PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\mandiri069>


---

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | Tidak relevan untuk pada file `.rq` itu sendiri (User-Agent diset oleh HTTP client/browser saat mengirim kueri). | Dipenuhi pada baris `UA = "KelasWebSemantik/1.0 (farelyamotaro@students.usu.ac.id)"` yang diteruskan ke `SPARQLWrapper(..., agent=UA)`. |
| 2 LIMIT | Dipenuhi pada baris 15: `LIMIT 10` untuk membatasi jumlah *solution bindings* agar tidak membebankan server. | Tidak ada klausul `LIMIT` pada kueri `Q_NOLAN_GRAF`, namun dampaknya terminimalisir karena kuerinya spesifik dijangkari ke entitas `dbr:Christopher_Nolan`. |
| 3 Simpan, jangan ulangi | Tidak relevan (file `.rq` hanya berisi teks kueri SPARQL statis). | Dipenuhi pada baris `g.serialize("film_nolan.ttl", format="turtle")`, di mana data di-download sekali lalu di-query lokal via `Graph().parse("film_nolan.ttl")`. |
| 4 Jangkar jalur | Dipenuhi pada baris `?kota wdt:P31/wdt:P279* wd:Q515 ;` di mana jalur `wdt:P279*` dijangkari ke IRI entitas `wd:Q515` (city). | Dipenuhi di file `q_demo_b.rq` (dan kueri `WHERE`) dengan menjangkari subjek/objek ke IRI spesifik `dbr:Christopher_Nolan`. |

- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya:
  ```sparql
  # Versi melanggar Aturan 4 (JANGAN DIJALANKAN)
  PREFIX ex: [http://contoh.id/](http://contoh.id/)
  CONSTRUCT {
    ?kota a ex:Kota ;
          rdfs:label ?namaKota ;
          ex:populasi ?populasi .
  }
  WHERE {
    ?kota ?p* ?subkelasKota .   # Jalur * antara dua variabel tanpa jangkar IRI
    ?kota wdt:P17 wd:Q252 ;
          wdt:P1082 ?populasi ;
          rdfs:label ?namaKota .
    FILTER ( LANG(?namaKota) = "id" )
  }
  LIMIT 10

---

### Diskusi 1 - Taksonomi berubah
Kalau taksonomi ontologi berubah (misalnya `ex:Dosen` tidak lagi menjadi subkelas dari `foaf:Person`), triple hasil inferensi lama yang menyatakan bahwa setiap dosen adalah `foaf:Person` (seperti `ex:budi a foaf:Person` dan `ex:rina a foaf:Person`) akan menjadi salah dan tidak valid. Pada `kampus_v4.ttl` dari Demo C1, triple fakta eksplisit (*asserted facts*) dan triple hasil materialisasi dicampur menjadi satu file tunggal. Hal ini menyulitkan pemisahan, karena kita harus memeriksa data satu per satu secara manual untuk membedakan fakta asal dari fakta turunan yang sudah usang. Sebaliknya, pada `kampus_turunan.ttl` dari Demo C2, seluruh triple turunan (seperti 6 triple hasil inferensi `materialisasi_ulang.py`) disimpan dalam file terpisah yang ter-decouple dari fakta dasar. Cara menemukannya sangat mudah: saya tinggal me-reset atau menghapus seluruh isi `kampus_turunan.ttl`, memperbarui ontologi dasar `kampus.ttl`, lalu menjalankan ulang fungsi `materialisasi(g)` pada graf dasar. Pendekatan C2 menjamin data produksi tetap bersih tanpa risiko merusak atau menghapus fakta asli entitas.

---

### Diskusi 2 - SELECT atau CONSTRUCT
Untuk dashboard populasi kota, bentuk kueri yang digunakan bergantung pada kebutuhan penyajian data. Saya memilih **SELECT** untuk menampilkan data pada komponen *dashboard* visual. Sebaliknya, saya memilih **CONSTRUCT** untuk menggabungkan data kota dari tiga sumber heterogen menjadi satu basis pengetahuan (*knowledge graph*) yang seragam. 

Bukti temuan pada Bagian A (populasi kembar) menunjukkan bahwa data mentah dari endpoint sering kali memiliki redundansi atau variasi tipe data (seperti literal bertipe `xsd:integer` vs `xsd:decimal`). Kueri `CONSTRUCT` berfungsi sebagai lapisan ETL (*Extract-Transform-Load*) untuk melakukan harmonisasi ontologi dan mentransformasikan berbagai skema lokal menjadi skema standar (seperti `schema:City` dan `ex:populasi`). Selain itu, bukti dari diagnosis `rusak_b.rq` memperlihatkan bahwa penggabungan entitas dari berbagai sumber tanpa kontrol akan menghasilkan duplikasi properti akibat tag bahasa yang berbeda (misalnya `"Christopher Nolan"` tanpa tag dan `"Christopher Nolan"@en`). Dengan kueri `CONSTRUCT`, kita dapat menormalisasi data, menerapkan `FILTER (LANG(?n) = "id")`, dan memetakan struktur nama agar tepat menghasilkan satu triple per entitas sebelum dikonsumsi oleh aplikasi. Setelah graf hasil `CONSTRUCT` bersih dan terpadu, kueri `SELECT` digunakan oleh *dashboard* untuk mengambil nilai spesifik secara presisi.

---

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 | **Demo A / Demo D (`rusak_b`)**: Pada Demo A, 30 solusi `WHERE` dikonsolidasi menjadi 30 triple unik (menggabungkan duplikat). Pada `rusak_b.rq`, Christopher Nolan memiliki 2 label nama tetapi `CONSTRUCT` menggabungkan cetakan kembar tersebut sehingga hanya menghasilkan 4 triple di awal dan dipangkas menjadi pas 3 triple di `perbaikan_b.rq`. |
| 2 | **Bagian B (`demo_c.py`) / Demo D (`rusak_a`)**: Pada `demo_c.py`, 16 film tidak memiliki `dbo:releaseDate` (`?rilis` bernilai *unbound*), tetapi triple `schema:datePublished` cukup diabaikan tanpa memicu error. Pada `rusak_a.rq`, variabel `?film` tidak terikat di `WHERE` sehingga menghasilkan 0 triple tanpa error. |
| 3 | **Bagian D (`rusak_b.rq` / `perbaikan_b.rq`)**: Penggunaan pola predikat alternatif `foaf:name|rdfs:label|schema:name` dan blok `VALUES ?o { dbr:Christopher_Nolan dbr:Joko_Anwar dbr:Mira_Lesmana }` berhasil menyatukan pencarian dari berbagai properti nama entitas yang berbeda dalam satu kueri. |
| 4 | **Bagian C (`demo_d.py`) / Bagian D (`perbaikan_c.rq`)**: Penggunaan jalur `a/rdfs:subClassOf*` pada `kampus.ttl` berhasil memetakan entitas ke superkelas `foaf:Person` tanpa menyebut kelas perantara (`ex:Dosen`), serta pada `perbaikan_c.rq` yang berhasil menemukan 3 kota (Medan, Surabaya, Tomok) sebagai `ex:Permukiman`. |
| 5 | **Bagian C (`demo_d.py` vs `materialisasi_ulang.py`)**: Pada `demo_d.py`, saat `ex:rina` baru masuk, `Ada Rina` tetap bernilai 3 (kesimpulan lama tidak otomatis memperbarui Rina). Pada `materialisasi_ulang.py`, aturan harus dihitung ulang pada Putaran 2 agar Rina terhitung sebagai `foaf:Person` (sehingga Person bertambah dari 3 menjadi 4). |