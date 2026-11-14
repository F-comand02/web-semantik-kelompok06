# [Pertemuan 12](README.md) - Inferensi dan Reasoning

## Langkah 1 - Closure dengan tangan
| # | Triple turunan | Aturan | Premis |
|---|----------------|--------|--------|
| 1 | `ex:budi a ex:Dosen` | `rdfs2` | `ex:membimbing rdfs:domain ex:Dosen` + `ex:budi ex:membimbing ex:andi` |
| 2 | `ex:andi a ex:Mahasiswa` | `rdfs3` | `ex:membimbing rdfs:range ex:Mahasiswa` + `ex:budi ex:membimbing ex:andi` |
| 3 | `ex:budi ex:mengenal ex:andi` | `rdfs7` | `ex:membimbing rdfs:subPropertyOf ex:mengenal` + `ex:budi ex:membimbing ex:andi` |
| 4 | `ex:sari a ex:Dosen` | `rdfs9` | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:sari a ex:DosenTamu` |
| 5 | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` | `rdfs11` | `ex:DosenTamu rdfs:subClassOf ex:Dosen` + `ex:Dosen rdfs:subClassOf ex:Pegawai` |
| 6 | `ex:Dosen rdfs:subClassOf ex:Orang` | `rdfs11` | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 7 | `ex:budi a ex:Pegawai` | `rdfs9` | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:budi a ex:Dosen` |
| 8 | `ex:andi a ex:Orang` | `rdfs9` | `ex:Mahasiswa rdfs:subClassOf ex:Orang` + `ex:andi a ex:Mahasiswa` |
| 9 | `ex:sari a ex:Pegawai` | `rdfs9` | `ex:Dosen rdfs:subClassOf ex:Pegawai` + `ex:sari a ex:Dosen` |
| 10 | `ex:DosenTamu rdfs:subClassOf ex:Orang` | `rdfs11` | `ex:DosenTamu rdfs:subClassOf ex:Pegawai` + `ex:Pegawai rdfs:subClassOf ex:Orang` |
| 11 | `ex:budi a ex:Orang` | `rdfs9` | `ex:Pegawai rdfs:subClassOf ex:Orang` + `ex:budi a ex:Pegawai` |
| 12 | `ex:sari a ex:Orang` | `rdfs9` | `ex:Pegawai rdfs:subClassOf ex:Orang` + `ex:sari a ex:Pegawai` |
- Jumlah triple turunan bermakna: **12 triple** dimana kami ada 9 fakta individu/`rdf:type` & properti, serta 3 hubungan taksonomi transitif `rdfs:subClassOf`.
- Triple yang baru ditemukan di putaran kedua: `ex:budi a ex:Pegawai`, `ex:andi a ex:Orang`, `ex:sari a ex:Pegawai`, dan `ex:DosenTamu rdfs:subClassOf ex:Orang` dimana pas kami lanjutkan di putaran ketiga untuk `ex:budi a ex:Orang` dan `ex:sari a ex:Orang` karena bergantung pada hasil inferensi putaran sebelumnya).
- Triple asserted yang tidak menurunkan apa pun, dan alasannya: `ex:andi a ex:MahasiswaBerprestasi`, karena tidak ada aksioma skema (`rdfs:subClassOf`, `rdfs:domain`, dll.) yang menghubungkan kelas `ex:MahasiswaBerprestasi` dengan kelas/properti lain, dan mesin *reasoner* tidak menebak relasi hanya dari kemiripan nama kelasnya dengan `ex:Mahasiswa`.

## Langkah 2 - Tebak lalu cek
```
(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> py tebak.py
A RDFS 3 baris
B OWL RL 10 baris
C RDFS 0 baris
C OWL RL 1 baris
D OWL RL False
(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> 
```

## Langkah 2 - Tebak lalu cek

| Soal | Profil | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|--------|---------|-------------|-------------------------|
| A | RDFS | 3 baris (`ex:budi`, `ex:andi`, `ex:sari`) | `3 baris` | - *(Tebakan tepat; semua diturunkan melalui rantai `rdfs:domain`/`rdfs:range` dan `rdfs:subClassOf` hingga ke `ex:Orang`)* |
| B | OWL RL | 10 baris | `10 baris` | - *(Tebakan tepat; 4 triple asserted + 6 triple transitif dari rantai panjang 4: $4 + 3 + 2 + 1 = 10$ pasangan)* |
| C | RDFS | 0 baris | `0 baris` | - *(Tebakan tepat; profil RDFS mengabaikan aksioma `owl:inverseOf` tanpa pesan error sehingga `ex:dibimbing` tetap kosong)* |
| C | OWL RL | 1 baris (`ex:andi`, `ex:budi`) | `1 baris` | - *(Tebakan tepat; OWL RL mengenali `ex:dibimbing owl:inverseOf ex:membimbing` sehingga membalik relasi `ex:budi ex:membimbing ex:andi`)* |
| D | OWL RL | `False` | `False` | - *(Tebakan tepat; tidak ada `rdfs:domain`/`rdfs:range` pada `ex:beradaDi` maupun deklarasi tipe untuk `ex:medan`, sehingga di bawah Open-World Assumption statusnya tidak diketahui / belum terbukti)* |

## [Langkah 3](screenshots/output-lokal.png) - Reasoner pada graf kampus
```
(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> py reasoner_lokal.py
Sumber: C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-09\kampus_usu_v2.ttl | asserted: 58
Closure: 130 | inferred: 72 | bermakna: 11
Triple di v4 yang tidak ada di asserted: 6
(.venv) PS C:\Users\ASUS\^CeDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> 
```

- Berkas sumber dan IRI dasar graf: `C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-09\kampus_usu_v2.ttl` dan `https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#`
- Asserted / closure / inferred / bermakna: `58` / `130` / `72` / `11`
- Triple di v4 yang tidak ada di asserted: `6`
- Turunan yang muncul karena domain dan range ex:mengajar: Aturan `rdfs:range` menurunkan **4 triple baru** yaitu `ex:basis_data a ex:MataKuliah`, `ex:pemrograman_web a ex:MataKuliah`, `ex:praktik_sparql a ex:MataKuliah`, dan `ex:web_semantik a ex:MataKuliah` (keempat mata kuliah otomatis diklasifikasikan sebagai `ex:MataKuliah` di samping tipe aslinya `ex:Course`). Sementara itu, aturan `rdfs:domain` menghasilkan tipe `ex:Lecturer` untuk ketiga dosen (`ex:ida`, `ex:ivan`, `ex:umay`), namun tidak muncul sebagai triple baru di berkas *inferred* karena sudah dideklarasikan secara eksplisit (*asserted*) sejak awal.
- Bila menambah dosen baru: Cukup tambahkan fakta dasar (*asserted*) dosen tersebut ke graf sumber (misalnya `ex:dosen_baru a ex:Lecturer` atau cukup relasi `ex:dosen_baru ex:mengajar ex:matkul_baru`), lalu jalankan ulang skrip `reasoner_lokal.py`. Tipe turunan seperti `a ex:Pegawai`, `a foaf:Person`, maupun `a ex:MataKuliah` tidak perlu ditulis manual karena akan disimpulkan otomatis oleh mesin *reasoner*.

## [Langkah 4](screenshots/output-wikidata.png) - Wikidata
- ?n Q8 / Q9: `877` / `1343`
- Penyebab selisih: Kueri Q8 hanya menghitung entitas yang dinyatakan secara langsung (*asserted*) sebagai *instance of* (`wdt:P31`) kelas universitas (`wd:Q3918`). Sementara itu, kueri Q9 menggunakan *property path* `wdt:P31/wdt:P279*` sehingga turut menjaring entitas yang merupakan *instance* dari subkelas-subkelas di bawah `wd:Q3918` (menambah 466 entitas).
- Satu subkelas yang menyumbang selisih: **Perguruan tinggi swasta** (`wd:Q902104` / *private university*) atau **Perguruan tinggi negeri** (`wd:Q875538` / *public university*) — salah satu subkelas dari `wd:Q3918` yang ditemukan melalui kueri hierarki `wdt:P279+` (seperti pada Q7 Pertemuan 11).
- WDQS: materialisasi, saat query, atau tidak keduanya: **Tidak keduanya.** Wikidata Query Service (WDQS) tidak mematerialisasikan *closure* RDFS (`rdfs:subClassOf` / `wdt:P279`) ke dalam basis datanya dan juga tidak menjalankan mesin *reasoner* otomatis saat kueri dieksekusi (terbukti dari Q8 yang tidak mengembalikan entitas subkelas). Pihak yang sebenarnya menjalankan logika aturan `rdfs9` pada Q9 adalah **kueri SPARQL itu sendiri** yang ditulis oleh pengguna melalui pola *property path* transitif `wdt:P31/wdt:P279*`.

## [Langkah 5](screenshots/output-konsistensi.png) - Konsistensi
```
1

(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> py konsistensi.py
RDFS 138 triple | 0 pesan galat
OWL RL 238 triple | 2 pesan galat
   Disjoint classes https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#Pegawai and https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#MataKuliah have a common individual https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#ida
   Disjoint classes https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#Pegawai and https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#MataKuliah have a common individual https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#web_semantik
CSV tersimpan: laporan_kelas.csv
(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> 

csv
kelas,asserted,rdfs,owl_rl
Lecturer,3,4,4
Pegawai,0,4,4
MataKuliah,0,5,5

```

```
2

(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12> py konsistensi.py
RDFS 133 triple | 0 pesan galat
OWL RL 229 triple | 0 pesan galat
CSV tersimpan: laporan_kelas.csv
(.venv) PS C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-12>

csv
kelas,asserted,rdfs,owl_rl
Lecturer,3,3,3
Pegawai,0,3,3
MataKuliah,0,4,4

```

- Pesan galat RDFS / OWL RL: `0` / `2`
- Individu yang disebut pesan: `ex:ida` dan `ex:web_semantik` (keduanya terdeteksi berada di kelas `ex:Pegawai` sekaligus `ex:MataKuliah` yang saling *disjoint*)
- Setelah baris terbalik dihapus: RDFS menghasilkan `0 pesan galat` (133 triple) dan OWL RL menghasilkan `0 pesan galat` (229 triple)
- Isi laporan_kelas.csv sebelum dan sesudah:
  - **Sebelum baris terbalik dihapus:** `Lecturer` (3, 4, 4), `Pegawai` (0, 4, 4), `MataKuliah` (0, 5, 5) — jumlah masing-masing kelas bertambah 1 karena `ex:web_semantik` ikut masuk ke `Lecturer`/`Pegawai` dan `ex:ida` ikut masuk ke `MataKuliah`.
  - **Sesudah baris terbalik dihapus:** `Lecturer` (3, 3, 3), `Pegawai` (0, 3, 3), `MataKuliah` (0, 4, 4) — graf kembali konsisten dengan tepat 3 dosen dan 4 mata kuliah.
- Dari mana dosen menjadi mata kuliah: Karena adanya triple terbalik `ex:web_semantik ex:mengajar ex:ida`, objek dari properti `ex:mengajar` adalah `ex:ida`. Aturan `rdfs3` membaca skema `ex:mengajar rdfs:range ex:MataKuliah` dan menyimpulkan `ex:ida a ex:MataKuliah`. Di sisi lain, `ex:ida` sudah bertipe `ex:Lecturer` yang merupakan subkelas dari `ex:Pegawai` (`rdfs9`), sehingga OWL RL mendeteksi pelanggaran `ex:Pegawai owl:disjointWith ex:MataKuliah` pada `ex:ida` (dan hal sebaliknya terjadi pada `ex:web_semantik` melalui aturan `rdfs:domain`). Sementara itu, profil **RDFS tidak melaporkan apa pun** karena kosakata RDFS tidak mengenal aksioma `owl:disjointWith` beserta semantik pendeteksian kontradiksi kelas, sehingga triple OWL tersebut diabaikan begitu saja tanpa memicu `ErrorMessage`.

## Refleksi
1. Mengapa graf asserted disimpan terpisah dari graf inferred, dan apa akibatnya bila keduanya dicampur seperti `kampus_usu_v4.ttl`?
   Kami memisahkan graf *asserted* sebagai satu-satunya sumber kebenaran (*single source of truth*) agar fakta dasar yang kami tulis tetap bersih dari hasil penalaran otomatis. Jika keduanya dicampur dalam satu berkas seperti `kampus_usu_v4.ttl`, akan timbul masalah pemeliharaan (*non-monotonic update*): saat ada perubahan fakta atau skema (misalnya seorang dosen berhenti mengajar atau suatu kelas tidak lagi menjadi subkelas tertentu), triple turunan lama yang sudah terlanjur tersimpan di dalamnya tidak otomatis terhapus, sehingga data menjadi usang, sulit diaudit asal-usulnya, dan berisiko memicu inkonsistensi di kemudian hari.

2. Pada Langkah 2, profil RDFS tidak memberi tahu bahwa aksioma OWL diabaikan. Bagaimana Anda akan memastikan profil yang dipakai sudah tepat untuk data Anda?
   Untuk memastikan profil yang dipakai sudah tepat, kami perlu memeriksa seluruh predikat skema/aksioma yang digunakan dalam berkas ontologi kami terlebih dahulu (misalnya dengan inspeksi manual atau kueri `SELECT DISTINCT ?p` pada skema). Jika di dalam graf terdapat konstruksi di luar kosakata RDFS—seperti `owl:TransitiveProperty`, `owl:SymmetricProperty`, `owl:inverseOf`, atau `owl:disjointWith`—maka kami wajib menggunakan profil yang lebih ekspresif seperti **OWL RL**, serta selalu memvalidasi hasilnya dengan menguji kueri uji (*sanity check* / kasus uji positif dan negatif) seperti yang kami lakukan di Langkah 2 dan Langkah 5.

3. Kapan Anda memilih menulis jalur seperti `wdt:P279*` di query, dan kapan memilih menjalankan reasoner lalu menyimpan closure?
   - **Menulis jalur di query (`wdt:P279*`):** Kami memilih pendekatan ini ketika ukuran graf sangat besar dan dinamis (seperti Wikidata) sehingga materialisasi penuh terlalu mahal dari sisi ruang penyimpanan maupun waktu komputasi ulang setiap ada pembaruan, atau ketika kebutuhan penalarannya sederhana dan hanya terbatas pada penelusuran hierarki transitif pada kueri tertentu.
   - **Menjalankan reasoner lalu menyimpan closure:** Kami memilih pendekatan ini untuk graf berskala lokal hingga menengah (seperti graf kampus kami) yang membutuhkan aturan penalaran lebih kaya daripada sekadar *property path*—seperti kombinasi `rdfs:domain`, `rdfs:range`, `owl:inverseOf`, maupun deteksi inkonsistensi `owl:disjointWith`—serta ketika graf tersebut akan sering di-query berulang kali sehingga hasil turunan yang sudah dimaterialisasi membuat eksekusi kueri jauh lebih cepat dan sederhana.