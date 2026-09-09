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

Pada langkah ini dilakukan pemeriksaan kosakata **Schema.org** untuk menentukan tipe dan properti yang sesuai untuk entitas mahasiswa dan universitas.

Tipe yang digunakan adalah:

- `Person` untuk entitas **Mahasiswa**
- `CollegeOrUniversity` untuk entitas **Universitas**

Referensi:
- https://schema.org/Person
- https://schema.org/CollegeOrUniversity

---

## 1. Tabel Pemeriksaan Kosakata

| Entitas | Tipe yang Dipakai | Properti yang Diperiksa |
|---|---|---|
| Mahasiswa | `Person` | `name`, `alumniOf`, `knowsAbout` |
| Universitas | `CollegeOrUniversity` | `name` |

### Penjelasan

**Mahasiswa** menggunakan tipe `Person` karena mahasiswa merupakan seorang manusia atau individu.

Properti yang diperiksa:

- `name` → menyimpan nama mahasiswa.
- `alumniOf` → menunjukkan institusi pendidikan tempat seseorang menjadi alumni.
- `knowsAbout` → menunjukkan bidang, topik, atau pengetahuan yang diketahui atau dikuasai seseorang.

**Universitas** menggunakan tipe `CollegeOrUniversity` karena tipe ini secara khusus digunakan untuk merepresentasikan perguruan tinggi atau universitas.

Properti yang diperiksa:

- `name` → menyimpan nama universitas.

---

# 2. Jawaban Pertanyaan

## 1. Mengapa tipe yang paling spesifik dan masih tepat sebaiknya dipilih?

Tipe yang paling spesifik dan masih sesuai sebaiknya dipilih agar informasi yang diberikan lebih akurat dan memiliki makna yang jelas. Dengan menggunakan tipe yang tepat, mesin atau aplikasi dapat lebih mudah memahami konteks dari suatu entitas.

Contohnya, mahasiswa menggunakan tipe `Person` karena mahasiswa merupakan seseorang. Sedangkan universitas menggunakan `CollegeOrUniversity` karena tipe tersebut lebih spesifik untuk merepresentasikan perguruan tinggi.

Jadi, pemilihan tipe yang spesifik dapat membuat data lebih terstruktur, jelas, dan mudah dipahami oleh mesin.

---

## 2. Mengapa nama properti mengikuti Schema.org, sedangkan nilainya boleh berbahasa Indonesia?

Nama properti harus mengikuti Schema.org agar dapat dikenali dan dipahami oleh mesin berdasarkan vocabulary atau standar yang sudah ditentukan.

Contohnya:

```json
"name": "Budi Santoso"
```

Pada contoh tersebut, `name` merupakan nama properti yang mengikuti Schema.org, sedangkan `"Budi Santoso"` merupakan nilai yang dapat menggunakan bahasa Indonesia.

Contoh lainnya:

```json
"knowsAbout": [
  "Pemrograman",
  "Basis Data",
  "Jaringan Komputer"
]
```

Nama properti `knowsAbout` tetap menggunakan vocabulary Schema.org, tetapi nilai di dalamnya dapat ditulis dalam bahasa Indonesia.

Dengan demikian, penggunaan properti Schema.org menjaga struktur dan makna data agar dapat dipahami mesin, sedangkan nilai dapat disesuaikan dengan bahasa yang digunakan oleh pengguna.

---

## 3. Apa manfaat array pada `knowsAbout`?

Array pada `knowsAbout` digunakan ketika seseorang memiliki lebih dari satu bidang atau topik yang diketahui atau dikuasai.

Contoh:

```json
"knowsAbout": [
  "Pemrograman",
  "Basis Data",
  "Jaringan Komputer"
]
```

Pada contoh tersebut, seorang mahasiswa memiliki tiga bidang pengetahuan, yaitu:

1. Pemrograman
2. Basis Data
3. Jaringan Komputer

Dengan menggunakan array, beberapa nilai dapat disimpan dalam satu properti `knowsAbout`.

Hal ini membuat data menjadi lebih lengkap, fleksibel, dan terstruktur.

---

# 3. Kesimpulan

Berdasarkan pemeriksaan kosakata Schema.org, tipe yang digunakan harus disesuaikan dengan jenis entitas yang direpresentasikan.

| Entitas | Schema.org Type | Properti |
|---|---|---|
| Mahasiswa | `Person` | `name`, `alumniOf`, `knowsAbout` |
| Universitas | `CollegeOrUniversity` | `name` |

`Person` digunakan untuk merepresentasikan mahasiswa sebagai individu, sedangkan `CollegeOrUniversity` digunakan untuk merepresentasikan universitas.

Properti seperti `name`, `alumniOf`, dan `knowsAbout` menggunakan nama standar Schema.org agar data dapat dipahami oleh mesin. Nilai dari properti tersebut tetap dapat menggunakan bahasa Indonesia.

Penggunaan array pada `knowsAbout` memungkinkan satu orang memiliki beberapa bidang pengetahuan yang dapat disimpan dalam satu properti.

---

# 4. Contoh JSON-LD

Berikut contoh penerapan tipe dan properti tersebut dalam JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Budi Santoso",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Universitas Indonesia"
  },
  "knowsAbout": [
    "Pemrograman",
    "Basis Data",
    "Jaringan Komputer"
  ]
}
```

Pada contoh di atas:

- `@type: Person` menunjukkan bahwa data tersebut merepresentasikan seseorang.
- `name` berisi nama mahasiswa.
- `alumniOf` menunjukkan universitas tempat mahasiswa menjadi alumni.
- `@type: CollegeOrUniversity` menunjukkan bahwa institusi tersebut merupakan perguruan tinggi.
- `knowsAbout` berisi beberapa bidang yang diketahui atau dikuasai oleh mahasiswa.

---

# 5. Referensi Schema.org

- [Person](https://schema.org/Person)
- [CollegeOrUniversity](https://schema.org/CollegeOrUniversity)
- [alumniOf](https://schema.org/alumniOf)
- [knowsAbout](https://schema.org/knowsAbout)

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
