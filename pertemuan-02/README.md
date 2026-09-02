## 2. Analisis Kesalahan XML

| No | Bagian yang Salah                                                                     | Alasan                                                                                                                         | Perbaikan                                                                                       |
| -- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1  | `<nama>Budi Santoso</Nama>`                                                           | XML bersifat **case-sensitive**, sehingga `<nama>` dan `</Nama>` dianggap sebagai tag yang berbeda.                            | Ubah menjadi `<nama>Budi Santoso</nama>`                                                        |
| 2  | `<angkatan>2024`                                                                      | Tag `<angkatan>` tidak memiliki tag penutup sehingga dokumen XML menjadi **tidak well-formed**.                                | Tambahkan tag penutup: `<angkatan>2024</angkatan>`                                              |
| 3  | `<deskripsi>Saya suka AI & Web Semantik</deskripsi>`                                  | Karakter `&` adalah karakter khusus dalam XML dan tidak boleh digunakan secara langsung dalam teks.                            | Ubah `&` menjadi `&amp;`: `<deskripsi>Saya suka AI &amp; Web Semantik</deskripsi>`              |
| 4  |  Struktur `<angkatan>` menyebabkan `<hobi>` dan `<deskripsi>` ikut terbaca di dalamnya| Karena `<angkatan>` tidak ditutup, elemen setelahnya secara struktur dianggap berada di dalam `<angkatan>`.                    | Tutup `<angkatan>` sebelum elemen `<hobi>`: `<angkatan>2024</angkatan>`                         |
| 5  | `<hobi>Programming</hobi>` dan `<hobi>Membaca</hobi>` berdiri sendiri                 | Ini **bukan error XML**, tetapi struktur data kurang terorganisir jika kedua hobi ingin dianggap sebagai satu kelompok.        | Gunakan elemen pembungkus, misalnya `<hobi><item>Programming</item><item>Membaca</item></hobi>` |
| 6  |  Tidak ada deklarasi XML                                                              | Deklarasi XML **tidak wajib**, jadi ini bukan error. Namun, deklarasi dapat menjelaskan versi XML dan encoding yang digunakan. | Tambahkan `<?xml version="1.0" encoding="UTF-8"?>` di awal dokumen                              |



## 5. Membaca XML Schema (XSD)

1. Root element yang diizinkan: buku
2. Tipe data judul: xs:string
3. Tipe data tahun: xs:gYear
4. Tipe data harga: xs:decimal
5. Atribut isbn tidak boleh dihilangkan, karena use="required" mewajibkan kehadirannya — dokumen tanpa atribut ini akan gagal validasi XSD.







## Pertanyaan Evaluasi

1. Apa perbedaan utama XML dan HTML?

| No | Bagian yang Dibandingkan | XML | HTML |
| -- | ------------------------ | --- | ---- |
| 1 | Kepanjangan | XML adalah singkatan dari **Extensible Markup Language**. | HTML adalah singkatan dari **HyperText Markup Language**. |
| 2 | Tujuan utama | Digunakan untuk **menyimpan, mengatur, dan mengirim data**. | Digunakan untuk **menampilkan dan menyusun konten pada halaman web**. |
| 3 | Fokus | Berfokus pada **struktur dan penyimpanan data**. | Berfokus pada **struktur dan penyajian konten halaman web**. |
| 4 | Tag | Tag dapat **dibuat sendiri** sesuai kebutuhan data. | Menggunakan tag yang **sudah ditentukan oleh standar HTML**. |
| 5 | Case Sensitive | XML bersifat **case-sensitive**, sehingga `<Nama>` dan `<nama>` dianggap berbeda. | HTML umumnya **tidak case-sensitive** terhadap nama tag, meskipun penulisan huruf kecil tetap disarankan. |
| 6 | Aturan penulisan | Memiliki aturan penulisan yang **lebih ketat** dan dokumen harus **well-formed**. | Lebih **fleksibel** dalam menangani beberapa kesalahan penulisan. |
| 7 | Penutupan tag | Setiap elemen XML harus memiliki **tag pembuka dan tag penutup**. | Beberapa elemen HTML tidak memerlukan tag penutup, seperti `<br>` dan `<img>`. |
| 8 | Contoh | `<nama>Naufal</nama>` | `<h1>Naufal</h1>` |
| 9 | Penggunaan | Digunakan untuk **pertukaran, penyimpanan, dan representasi data**. | Digunakan untuk **membuat struktur dan konten halaman web**. |
| 10 | Tampilan | XML **tidak dirancang untuk menampilkan data** secara langsung kepada pengguna. | HTML **dirancang untuk menampilkan konten** pada browser. |

2. Apa yang dimaksud dokumen XML yang well-formed?

Dokumen XML yang well-formed adalah dokumen XML yang memiliki struktur dan penulisan sintaks yang sesuai dengan aturan dasar XML sehingga dapat dibaca dan diproses dengan benar oleh XML parser. Sebuah dokumen XML dikatakan well-formed apabila memiliki satu root element, setiap tag pembuka memiliki tag penutup yang sesuai, penulisan huruf besar dan kecil pada tag harus konsisten karena XML bersifat case-sensitive, serta elemen-elemen di dalamnya harus tersusun atau bersarang dengan benar. Selain itu, nilai atribut harus ditulis menggunakan tanda kutip dan karakter khusus seperti & harus ditulis dalam bentuk entity seperti &amp;. Jika salah satu aturan tersebut dilanggar, maka dokumen XML dianggap tidak well-formed dan dapat menyebabkan kesalahan ketika diproses.



