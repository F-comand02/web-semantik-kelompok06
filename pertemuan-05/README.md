# [Pertemuan 5](README.md) - Ontology dan Arsitektur Web Semantik

## Ontology mini kampus
- IRI dasar: [https://example.org/ontology/usu#](https://example.org/ontology/usu#)
- Domain: Kampus Universitas Sumatera Utara (USU)

## Komponen ontology
| Komponen | Isi yang dibuat |
| --- | --- |
| Class | Person; Course; (1) Department; (2) Faculty; (3) Scholarship; (4) Library; (5) Laboratory; (6) Organization |
| Subclass | Student subclassOf Person; (1) Lecturer subclassOf Person; (2) UndergraduateStudent subclassOf Student; (3) GraduateStudent subclassOf Student; (4) Professor subclassOf Lecturer; (5) Researcher subclassOf Person; AssistantLecturer subclassOf Lecturer |
| Individual | mahasiswa_anda bertipe Student; (1) dosen_nurul bertipe Lecturer; (2) web_semantik bertipe Course; (3) fakultas_ti bertipe Faculty; (4) beasiswa_unggulan bertipe Scholarship; (5) perpustakaan_usu bertipe Library; (6) lab_jaringan bertipe Laboratory |
| Property | (Objek property) takesCourse; (1) teaches; (2) enrolledIn; (3) managesLibrary; (4) providesScholarship; (5) usesLaboratory; (6) memberOf (Datatype property) hasNIM; (1) hasName; (2) hasEmail; (3) hasPhoneNumber; (4) hasAddress; (5) hasStudentID; (6) hasCourseCode|
| Axiom/disjointness | Student disjointWith Lecturer; (1) Course disjointWith Department; (2) Faculty disjointWith Library; (3) Professor disjointWith Student; (4) Scholarship disjointWith Course; (5) Researcher disjointWith UndergraduateStudent |

## Eksplorasi Protégé
| Jenis | Contoh | Penjelasan |
|-------|--------|------------|
| Class | `Pizza` | Class atau kategori untuk pizza |
| Subclass | `NamedPizza` | Subclass dari `Pizza` |
| Individual | `America` | Individual dari `Country` |
| Object Property | `hasTopping` | Menghubungkan `Pizza` dengan `PizzaTopping` |
| Datatype Property | Tidak ditemukan | Tidak terdapat `owl:DatatypeProperty` pada ontology `pizza.owl` |

## Layer Cake
Jelaskan posisi ontology dalam Semantic Web Layer Cake: [isi jawaban]

## Perbandingan serialisasi
- Turtle: [dua pengamatan sintaks]
- RDF/XML: [dua pengamatan sintaks]
- Kesamaan makna: [isi]

## Refleksi
1. Apa perbedaan ontology dan taksonomi?
2. Mengapa domain pada OWL bukan constraint database?
3. Mengapa kosakata yang sudah ada sebaiknya dipakai kembali sebelum membuat yang baru?
