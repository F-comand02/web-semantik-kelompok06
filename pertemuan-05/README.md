# [Pertemuan 5](README.md) - Ontology dan Arsitektur Web Semantik

---

## Ontology mini kampus
- IRI dasar: [https://example.org/ontology/usu#](https://example.org/ontology/usu#)
- Domain: Kampus Universitas Sumatera Utara (USU)

---

## Komponen ontology
| Komponen | Isi yang dibuat |
| --- | --- |
| Class | Person; Course; (1) Department; (2) Faculty; (3) Scholarship; (4) Library; (5) Laboratory; (6) Organization |
| Subclass | Student subclassOf Person; (1) Lecturer subclassOf Person; (2) UndergraduateStudent subclassOf Student; (3) GraduateStudent subclassOf Student; (4) Professor subclassOf Lecturer; (5) Researcher subclassOf Person; AssistantLecturer subclassOf Lecturer |
| Individual | mahasiswa_anda bertipe Student; (1) dosen_nurul bertipe Lecturer; (2) web_semantik bertipe Course; (3) fakultas_ti bertipe Faculty; (4) beasiswa_unggulan bertipe Scholarship; (5) perpustakaan_usu bertipe Library; (6) lab_jaringan bertipe Laboratory |
| Property | (Objek property) takesCourse; (1) teaches; (2) enrolledIn; (3) managesLibrary; (4) providesScholarship; (5) usesLaboratory; (6) memberOf (Datatype property) hasNIM; (1) hasName; (2) hasEmail; (3) hasPhoneNumber; (4) hasAddress; (5) hasStudentID; (6) hasCourseCode|
| Axiom/disjointness | Student disjointWith Lecturer; (1) Course disjointWith Department; (2) Faculty disjointWith Library; (3) Professor disjointWith Student; (4) Scholarship disjointWith Course; (5) Researcher disjointWith UndergraduateStudent |

---

## Eksplorasi Protégé
| Jenis | Contoh | Penjelasan |
|-------|--------|------------|
| Class | `Pizza` | Class atau kategori untuk pizza |
| Subclass | `NamedPizza` | Subclass dari `Pizza` |
| Individual | `America` | Individual dari `Country` |
| Object Property | `hasTopping` | Menghubungkan `Pizza` dengan `PizzaTopping` |
| Datatype Property | Tidak ditemukan | Tidak terdapat `owl:DatatypeProperty` pada ontology `pizza.owl` 

---

## Layer Cake

Jelaskan posisi ontology dalam Semantic Web Layer Cake: 
Dalam arsitektur *Semantic Web Layer Cake*, **Ontology (OWL)** berada tepat di **tengah tumpukan teknologi**, diapit secara vertikal **di atas lapisan RDF/RDFS** dan **di bawah lapisan SPARQL serta Rules**. 

Mengapa ontology berada di atas RDF/RDFS dan di bawah SPARQL dalam arsitektur ini?
* **Di atas RDF/RDFS karena alasan Fondasi dan Ekspresivitas:** Kalau RDF menyediakan model data dasar berupa graf trio (*Subject-Predicate-Object*) dan RDFS menyediakan kosakata hierarki dasar. Nah, si Ontology (OWL) berdiri di atasnya karena ia membutuhkan model graf tersebut sebagai fondasi, lalu memperluasnya dengan menambahkan logika semantik yang jauh lebih kaya dan ekspresif—seperti batasan jumlah (*cardinality*), karakteristik properti (simetris/transitif), serta pernyataan kelas yang terpisah (*disjoint classes*).
* **Di bawah SPARQL karena alasan Struktur dan Akses:** Karena si Ontology bertindak sebagai penyedia model dan aturan pengetahuan domain yang terstruktur. Setelah seluruh struktur kelas, properti, dan logika penalaran (*reasoning*) selesai didefinisikan di lapisan Ontology, barulah **SPARQL** yang berada di atasnya dapat berfungsi sebagai bahasa kueri untuk menjelajahi, menyaring, dan menarik informasi dari graf pengetahuan tersebut secara akurat.

---

## Perbandingan serialisasi
- [Turtle](ontology-kampus.ttl): 
  * Kami gunakan format deklarasi '@prefix' yang ringkas di awal dokumen untuk mendefinisikan namespace.
  * Kami gunakan tanda titik koma '(;)' untuk memisahkan beberapa predikat-objek dari subjek yang sama, serta tanda titik '(.)' sebagai akhir dari sebuah pernyataan triplet.
- [RDF/XML](ontology-kampus.rdf): 
  * Terlihat menggunakan struktur berbasis tag XML seperti elemen <rdf:RDF> sebagai pembungkus utama dan atribut xmlns untuk deklarasi namespace.
  * Terlihat ada hubungan predikat dan objek direpresentasikan melalui struktur bersarang (nested tags) seperti elemen <owl:NamedIndividual> yang membungkus properti di dalamnya.
- Kesamaan makna: Kedua dokumen memiliki semantik yang identik (100% sama). Keduanya merepresentasikan struktur graf pengetahuan (knowledge graph) yang sama, yang mendefinisikan kelas seperti Student dan Lecturer, properti objek seperti enrolledIn dan takesCourse, serta individual data universitas yang sama (seperti mahasiswa_yabesh dengan NIM 251402004 dan dosen_nurul yang mengajar mata kuliah web_semantik).

---

## Refleksi
1. Apa perbedaan ontology dan taksonomi?
Jawaban: Taksonomi adalah cara untuk mengelompokkan sesuatu berdasarkan tingkatan atau kategori tertentu. Taksonomi ini fokusnya lebih kepada hubungan pengelompokan dan tingkatan, sedangkan ontology lebih luas cakupannya. Ontology bukan cuma mengelompokkan sesuatu, tapi juga menjelaskan apa saja isinya, bagaimana hubungannya, dan aturan yang berlaku di dalamnya.
Jadi, perbedaan ontology dan taksonomi secara sederhana yaitu taksonomi lebih fokus pada pengelompokan, sedangkan ontology menjelaskan pengelompokan sekaligus hubungan dan informasi tentang objek tersebut.

2. Mengapa domain pada OWL bukan constraint database?
Jawaban: Karena domain pada OWL tidak dipakai untuk menolak atau membatasi data yang masuk seperti constraint pada database. Database memakai constraint untuk memastikan data yang diinput sudah sesuai aturan dan tidak salah. Sebaliknya, OWL memakai domain untuk menarik kesimpulan baru seperti contohnya ketika ada suatu data yang dimasukkan, OWL akan otomatis menganggap objek tersebut punya status sesuai domain yang ditentukan. Jadi, domain pada OWL berguna untuk menambah pengetahuan baru berdasarkan hubungan yang ada pada data.


3. Mengapa kosakata yang sudah ada sebaiknya dipakai kembali sebelum membuat yang baru?
Jawaban: Karena menggunakan kembali kosakata yang sudah ada membuat data lebih mudah dipahami, konsisten, digunakan kembali, dan terhubung dengan data lain. Selain itu, kita tidak perlu membuat istilah baru dari awal jika sudah ada kosakata yang sesuai. Dengan menggunakan kosakata yang sudah standar, sistem lain juga lebih mudah mengenali dan memahami data kita. Jadi, menggunakan kembali kosakata yang sudah ada membantu agar data tidak terisolasi dan dapat digunakan lebih luas.

---
