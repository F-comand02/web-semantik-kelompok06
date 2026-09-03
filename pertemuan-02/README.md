# [Pertemuan 2](README.md) - Format Dokumen XML

## 1. Profil XML

### `Struktur XML Profil Mahasiswa`

#### ``Elemen Root``
Elemen root merupakan elemen paling luar dan menjadi induk dari seluruh elemen lainnya. Pada XML ini, elemen root yang digunakan adalah:

```xml
<mahasiswa>
```
Elemen `<mahasiswa>` membungkus seluruh data profil mahasiswa.

#### ``Struktur Elemen XML``
Struktur XML yang dibuat adalah sebagai berikut:
```text
mahasiswa
└── profilList
    └── profil
        ├── nama
        ├── angkatan
        ├── programStudi
        ├── hobiList
        │   └── hobi
        └── deskripsi
            └── paragraf
```
Elemen `<profilList>` digunakan sebagai wadah untuk menampung seluruh data profil mahasiswa. Setiap mahasiswa disimpan dalam satu elemen `<profil>`.

#### ``Elemen-Elemen di Dalam Root``
Berikut adalah elemen-elemen yang terdapat di dalam root `<mahasiswa>`:
- `<profilList>` digunakan untuk mengelompokkan seluruh profil mahasiswa.
- `<profil>` digunakan untuk menyimpan data satu mahasiswa.
- `<nama>` digunakan untuk menyimpan nama mahasiswa.
- `<angkatan>` digunakan untuk menyimpan tahun angkatan mahasiswa.
- `<programStudi>` digunakan untuk menyimpan program studi mahasiswa.
- `<hobiList>` digunakan untuk menyimpan daftar hobi mahasiswa.
- `<hobi>` digunakan untuk menyimpan setiap hobi mahasiswa.
- `<deskripsi>` digunakan untuk menyimpan deskripsi diri mahasiswa.
- `<paragraf>` digunakan untuk menyimpan isi deskripsi mahasiswa.

#### ``Atribut yang Digunakan``
Atribut yang digunakan adalah atribut `nim` pada elemen `<profil>`. Atribut ini berfungsi untuk memberikan informasi tambahan berupa Nomor Induk Mahasiswa sebagai identitas setiap mahasiswa.

Contoh penggunaan atribut:
```xml
<profil nim="251402069">
```
Nilai `251402069` merupakan NIM dari mahasiswa yang bersangkutan.

#### ``Contoh Data XML``
Berikut adalah contoh struktur data dalam XML:

```xml
<mahasiswa>
    <profilList>
        <profil nim="251402069">
            <nama>Farel Yamotaro Hia</nama>
            <angkatan>2025</angkatan>
            <programStudi>Teknologi Informasi</programStudi>

            <hobiList>
                <hobi>Bermain Musik</hobi>
                <hobi>Bernyanyi</hobi>
            </hobiList>

            <deskripsi>
                <paragraf>
                    Halo, nama saya Farel Yamotaro Hia.
                    Saya adalah mahasiswa Teknologi Informasi angkatan 2025.
                </paragraf>
            </deskripsi>
        </profil>
    </profilList>
</mahasiswa>
```

#### ``Hubungan Antar Elemen``
Elemen-elemen XML memiliki hubungan hierarkis, yaitu:
- Elemen yang berada di dalam elemen lain disebut elemen anak atau *child*.
- Elemen yang membungkus elemen lain disebut elemen induk atau *parent*.

Contohnya:
- `<mahasiswa>` merupakan parent dari `<profilList>`.
- `<profilList>` merupakan parent dari `<profil>`.
- `<profil>` merupakan parent dari `<nama>`, `<angkatan>`, `<programStudi>`, `<hobiList>`, dan `<deskripsi>`.
- `<hobiList>` merupakan parent dari elemen-elemen `<hobi>`.
- `<deskripsi>` merupakan parent dari `<paragraf>`.
Hubungan tersebut membuat struktur XML menjadi terorganisasi dan mudah dipahami.

#### ``Struktur Data``

Data dalam XML disimpan menggunakan tiga bagian utama, yaitu:
1. **Elemen**, digunakan untuk mengelompokkan dan memberi nama pada data.
2. **Atribut**, digunakan untuk memberikan informasi tambahan pada suatu elemen.
3. **Nilai atau *text content***, yaitu isi atau nilai yang terdapat di dalam suatu elemen.

Contohnya:
```xml
<nama>Farel Yamotaro Hia</nama>
```
Pada contoh tersebut, `<nama>` merupakan elemen, sedangkan `Farel Yamotaro Hia` merupakan nilai atau *text content*.

#### ``Kesimpulan``
XML kami ini menyimpan data profil mahasiswa secara terstruktur dan hierarkis. Elemen root `<mahasiswa>` menjadi induk dari seluruh data, sedangkan atribut `nim` digunakan sebagai identitas setiap mahasiswa.
Penggunaan elemen, atribut, dan nilai membuat data dapat dibaca serta diproses dan bermakna oleh manusia maupun komputer.

## 2. Analisis Kesalahan XML

| No | Bagian yang Salah                                                                     | Alasan                                                                                                                         | Perbaikan                                                                                       |
| -- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1  | `<nama>Budi Santoso</Nama>`                                                           | XML bersifat **case-sensitive**, sehingga `<nama>` dan `</Nama>` dianggap sebagai tag yang berbeda.                            | Ubah menjadi `<nama>Budi Santoso</nama>`                                                        |
| 2  | `<angkatan>2024`                                                                      | Tag `<angkatan>` tidak memiliki tag penutup sehingga dokumen XML menjadi **tidak well-formed**.                                | Tambahkan tag penutup: `<angkatan>2024</angkatan>`                                              |
| 3  | `<deskripsi>Saya suka AI & Web Semantik</deskripsi>`                                  | Karakter `&` adalah karakter khusus dalam XML dan tidak boleh digunakan secara langsung dalam teks.                            | Ubah `&` menjadi `&amp;`: `<deskripsi>Saya suka AI &amp; Web Semantik</deskripsi>`              |
| 4  |  Struktur `<angkatan>` menyebabkan `<hobi>` dan `<deskripsi>` ikut terbaca di dalamnya| Karena `<angkatan>` tidak ditutup, elemen setelahnya secara struktur dianggap berada di dalam `<angkatan>`.                    | Tutup `<angkatan>` sebelum elemen `<hobi>`: `<angkatan>2024</angkatan>`                         |
| 5  | `<hobi>Programming</hobi>` dan `<hobi>Membaca</hobi>` berdiri sendiri                 | Ini **bukan error XML**, tetapi struktur data kurang terorganisir jika kedua hobi ingin dianggap sebagai satu kelompok.        | Gunakan elemen pembungkus, misalnya `<hobi><item>Programming</item><item>Membaca</item></hobi>` |
| 6  |  Tidak ada deklarasi XML                                                              | Deklarasi XML **tidak wajib**, jadi ini bukan error. Namun, deklarasi dapat menjelaskan versi XML dan encoding yang digunakan. | Tambahkan `<?xml version="1.0" encoding="UTF-8"?>` di awal dokumen                              |

## 3. Analisis XML Schema

1. Root element: Buku
2. Tipe data `judul`: xs:string
3. Tipe data `tahun`: xs:gYear
4. Tipe data `harga`: xs:decimal
5. Atribut `ISBN`: Tidak boleh dihilangkan, karena use="required" mewajibkan kehadirannya — dokumen tanpa atribut ini akan gagal validasi XSD.

## 4. Analisis Namespace

1. Mengapa kedua elemen title tersebut tidak dianggap sama?

Jawaban: Karena kedua elemen title berada di namespace yang berbeda.
<buku:title> berada pada namespace https://example.org/buku
<web:title> berada pada namespace https://example.org/web
Walaupun nama lokalnya sama-sama title, namespace membuat keduanya menjadi dua elemen yang berbeda.
   
2. Apa fungsi prefix buku: dan web:?

Jawaban: Prefix digunakan sebagai penanda namespace pada sebuah elemen XML.
Dengan prefix tersebut, XML dapat membedakan elemen yang memiliki nama sama tetapi berasal dari namespace berbeda.
 
3. Apa fungsi atribut xmlns?

Jawaban: xmlns digunakan untuk mendeklarasikan namespace dalam XML.
Contohnya:
xmlns:buku="https://example.org/buku"
xmlns:web="https://example.org/web"

Artinya:
buku: dipetakan ke namespace https://example.org/buku
web: dipetakan ke namespace https://example.org/web
Namespace membantu mencegah konflik nama ketika XML menggunakan elemen dari berbagai sumber atau kosakata.
  
4. Apakah URI namespace harus dapat dibuka sebagai halaman web? Jelaskan.

Jawaban: Tidak harus.

URI namespace berfungsi sebagai identifier (penanda) unik, bukan sebagai alamat yang wajib menyediakan halaman web.
URI tersebut tidak harus benar-benar memiliki halaman web yang dapat dibuka di browser. Yang penting URI tersebut 
digunakan sebagai identitas namespace yang unik dan konsisten.

## 5. Pertanyaan Evaluasi

1. Apa perbedaan utama XML dan HTML?

Jawaban: 
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

Jawaban: 
Dokumen XML yang well-formed adalah dokumen XML yang memiliki struktur dan penulisan sintaks yang sesuai dengan aturan dasar XML sehingga dapat dibaca dan diproses dengan benar oleh XML parser. Sebuah dokumen XML dikatakan well-formed apabila memiliki satu root element, setiap tag pembuka memiliki tag penutup yang sesuai, penulisan huruf besar dan kecil pada tag harus konsisten karena XML bersifat case-sensitive, serta elemen-elemen di dalamnya harus tersusun atau bersarang dengan benar. Selain itu, nilai atribut harus ditulis menggunakan tanda kutip dan karakter khusus seperti & harus ditulis dalam bentuk entity seperti &amp;. Jika salah satu aturan tersebut dilanggar, maka dokumen XML dianggap tidak well-formed dan dapat menyebabkan kesalahan ketika diproses.

3. Jelaskan perbedaan well-formed dan valid.

Jawaban: 
| Well-formed                     | Valid                                               |
| ------------------------------- | --------------------------------------------------- |
| Memenuhi aturan **sintaks XML** | Memenuhi aturan **struktur/isi XML**                |
| Tidak membutuhkan DTD/XSD       | Biasanya diperiksa dengan DTD/XSD                   |
| Fokus pada cara XML ditulis     | Fokus pada apakah XML sesuai aturan yang ditentukan |
| Syarat dasar                    | Tingkat pemeriksaan lebih lanjut                    |

4. Mengapa XSD lebih kuat dibandingkan DTD?

Jawaban: 
XSD lebih kuat daripada DTD karena mampu melakukan validasi XML secara lebih detail, ketat, dan fleksibel, terutama dalam menentukan tipe data dan aturan struktur.

5. Mengapa namespace penting ketika data XML berasal dari beberapa kosakata berbeda?

Jawaban: 
Namespace sangat penting ketika menggabungkan data dari berbagai sumber karena berfungsi mencegah bentrokan nama tag. Jika tidak menggunakan namespace, komputer akan bingung ketika menemukan nama elemen yang sama tetapi memiliki arti yang berbeda. Contoh sederhananya yaitu jika kita menggabungkan data toko furnitur yang menggunakan tag untuk meja dengan data tata letak web yang juga menggunakan tag untuk tabel HTML, sistem tidak bisa membedakan mana barang dagangan dan mana struktur tampilan. Namespace menyelesaikan masalah ini dengan memberikan label unik atau awalan pada setiap tag, sehingga komputer dapat mengenali asal-usul dan konteks data tersebut secara pasti.

6. Apa kegunaan XPath dalam pengolahan dokumen XML?

Jawaban: 
XPath digunakan untuk menentukan lokasi atau alamat suatu elemen, atribut, atau bagian tertentu di dalam struktur dokumen XML, sehingga memudahkan proses navigasi dan pencarian data tanpa harus membaca seluruh dokumen secara manual. XPath juga berperan penting sebagai dasar transformasi dokumen dengan XSLT, digunakan dalam validasi tambahan, dipakai untuk mengekstrak data XML melalui berbagai bahasa pemrograman, serta digunakan dalam pengujian otomatis pada aplikasi web untuk menemukan elemen tertentu. Jadi secara sederhana, XPath memudahkan pencarian, penyaringan, dan pengambilan data secara presisi dari struktur dokumen XML yang kompleks.






