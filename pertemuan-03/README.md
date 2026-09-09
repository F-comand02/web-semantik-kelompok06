# [Latihan Pertemuan 3](README.md) - JSON-LD dan Structured Data

## Identitas
| No. | Nama                       |       NIM |
| --: | -------------------------- | --------: |
|   1 | Farel Yamotaro Hia         | 251402069 |
|   2 | Ray Nathan Geereno Saragih | 251402046 |
|   3 | Naufal Muhammad Dzaki      | 251402128 |
|   4 | William Fransisco Sihotang | 251402052 |
|   5 | Yabesh Day Siahaan         | 251402004 |

## Struktur Hasil
- `profil_saya.jsonld`
- `profil_perbaikan.jsonld`
- `seminar.html`
- folder `screenshots`

## 1. JSON Biasa dan JSON-LD

### 1. JSON Biasa

JSON (JavaScript Object Notation) digunakan untuk menyimpan dan bertukar data dalam format yang sederhana dan mudah dibaca oleh manusia maupun mesin.

Contoh:

```json
{
  "nama": "Ida Dadi",
  "pekerjaan": "Dosen"
}
```

Pada JSON biasa, informasi hanya disimpan sebagai pasangan **key-value**. Data `"nama"` berisi `"Ida Dadi"` dan `"pekerjaan"` berisi `"Dosen"`.

Namun, JSON biasa tidak menjelaskan secara eksplisit **apa makna atau konteks** dari setiap data tersebut. Sistem lain hanya mengetahui bahwa terdapat sebuah field bernama `nama` dan `pekerjaan`, tetapi tidak memiliki informasi standar mengenai arti dari field tersebut.

---

### 2. JSON-LD

JSON-LD (**JavaScript Object Notation for Linked Data**) merupakan format JSON yang memungkinkan data memiliki **konteks dan makna semantik** sehingga dapat dipahami secara lebih baik oleh mesin.

Contoh:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://usu.ac.id/dosen/idadi",
  "name": "Ida Dadi",
  "jobTitle": "Dosen"
}
```
---

### 1. Perbedaan fungsi kunci:
#### Jawaban: 
Kalau **JSON biasa**, pasangan `"nama"` dan `"pekerjaan"` merupakan nama properti yang dibuat oleh pengembang sesuai kebutuhan aplikasi. Maknanya hanya dapat dipahami berdasarkan struktur atau dokumentasi dari sistem yang menggunakannya.

Sedangkan kalau **JSON-LD**, `"name"` dan `"jobTitle"` merupakan properti yang memiliki makna semantik berdasarkan vocabulary yang ditentukan oleh `@context`, yaitu **Schema.org**. Dengan demikian, mesin dapat memahami bahwa `"name"` menunjukkan nama suatu entitas dan `"jobTitle"` menunjukkan jabatan atau pekerjaan entitas tersebut.

*Kesimpulannya:* `nama`/`pekerjaan` hanya merupakan field JSON biasa, sedangkan `name`/`jobTitle` memiliki makna yang terstandarisasi dalam konteks Linked Data.

---
### 2. Fungsi `@context`, `@type`, dan `@id`:
#### Jawaban:



Nah, tiga ini properti tersebut merupakan bagian penting dari **JSON-LD**:
* **`@context`**
  Berfungsi untuk menentukan **konteks atau vocabulary** yang digunakan dalam dokumen JSON-LD. Pada contoh ini:
  ```json
  "@context": "https://schema.org"
  ```
  Artinya, istilah seperti `Person`, `name`, dan `jobTitle` mengacu pada vocabulary yang didefinisikan oleh **Schema.org**.

* **`@type`**
  Berfungsi untuk menentukan **tipe atau jenis entitas** yang direpresentasikan oleh sebuah node. Contohnya:
  ```json
  "@type": "Person"
  ```
  menunjukkan bahwa node tersebut merepresentasikan sebuah **Person (orang)**.

* **`@id`**
  Berfungsi sebagai **identitas unik** untuk sebuah node atau entitas. Contohnya:
  ```json
  "@id": "https://usu.ac.id/dosen/idadi"
  ```
  memberikan identifier berupa URI sehingga entitas tersebut dapat dikenali dan dirujuk secara konsisten oleh sistem lain.

---
### 3. Node tanpa `@id`:
#### Jawaban:

Jika sebuah node JSON-LD tidak memiliki `@id`, node tersebut tetap dapat diproses dan memiliki makna berdasarkan `@type` serta properti lainnya. Namun, node tersebut **tidak memiliki identifier global yang eksplisit**.

Akibatnya, node tersebut lebih sulit untuk dirujuk secara unik dari dokumen atau dataset lain. Jika terdapat beberapa node dengan informasi yang sama atau serupa, sistem juga tidak memiliki `@id` sebagai penanda eksplisit untuk membedakan atau menghubungkan node tersebut.

Sebagai contoh, node berikut tidak memiliki `@id`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ida Dadi",
  "jobTitle": "Dosen"
}
```

Node tersebut tetap dikenali sebagai `Person`, tetapi tidak mempunyai identifier global seperti:

```json
"@id": "https://usu.ac.id/dosen/idadi"
```

**Kesimpulannya:** `@id` tidak selalu wajib agar sebuah node dapat memiliki makna, tetapi keberadaannya penting untuk memberikan **identitas yang dapat dirujuk dan dihubungkan** dengan data lain dalam ekosistem Linked Data.
## 2. Pemeriksaan schema.org
1. Alasan memilih tipe paling spesifik: ...
2. Nama properti dan bahasa nilai: ...
3. Manfaat array pada `knowsAbout`: ...

## 3. Perbaikan Lima Kesalahan
| No. | Bagian Salah | Alasan | Perbaikan |
|---|---|---|---|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |
| 4 | ... | ... | ... |
| 5 | ... | ... | ... |

## 4. Triple dari JSON-LD Playground
Tuliskan satu baris N-Quads yang terbentuk:

```text
ISI_TRIPLE
```

## 5. Hasil Validasi
- Schema Markup Validator: ...
- Rich Results Test: ...
- JSON-LD Playground: ...

## 6. Refleksi
1. Mengapa `@context` disebut jembatan menuju makna?
2. Apa perbedaan fungsi Schema Markup Validator dan Rich Results Test?
3. Mengapa isi JSON-LD harus sama dengan konten yang terlihat pada halaman?

## Bukti
![Schema Markup Validator](screenshots/profil-schema-validator.png)
![JSON-LD Playground](screenshots/profil-playground.png)
![Rich Results Test](screenshots/seminar-rich-results.png)
