# [Pertemuan 6](README.md) - RDF Dasar

---

## IRI dasar graf
[http://example.org/](https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#)
- https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#

---

## Ringkasan graf
- Jumlah triple: 3
- Namespace yang digunakan: 
  - ex: <http://example.org/>
  - rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
- Entitas: ex:ida (Ida Adi), ex:Lecturer (kelas dosen), ex:WebSemantik (mata kuliah Web Semantik)

---

## Contoh triple
1. [ex:ida] - [rdf:type] - [ex:Lecturer]
2. [ex:ida] - [ex:teaches] - [ex:WebSemantik]
3. [ex:WebSemantik] - [ex:name] - ["Web Semantik"]

---

### Format Tabel

| No | Subject | Predicate | Object |
|----|---------|-----------|--------|
| 1 | ex:ida | rdf:type | ex:Lecturer |
| 2 | ex:ida | ex:teaches | ex:WebSemantik |
| 3 | ex:WebSemantik | ex:name | "Web Semantik" |

---

## Pertanyaan

### RDF Dasar: IRI, Literal, Blank Node, dan Prefix

### IRI Dasar Graf

`http://example.org/`
`https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#`

---

#### 1. Identifikasi jenis node untuk `ex:ida`, `"Ida Adi"@id`, dan `[ ex:kota "Medan" ]`

##### Pertanyaan

Identifikasi jenis node untuk:

- `ex:ida`
- `"Ida Adi"@id`
- `[ ex:kota "Medan" ]`

##### Jawaban

| Node | Jenis Node | Penjelasan |
|---|---|---|
| `ex:ida` | **IRI** | `ex:ida` merupakan resource yang memiliki identitas berupa IRI. |
| `"Ida Adi"@id` | **Literal** | Merupakan nilai berupa teks/string. |
| `[ ex:kota "Medan" ]` | **Blank Node** | Merupakan node anonim yang tidak memiliki IRI secara langsung. |

##### Penjelasan

##### 1. `ex:ida` → IRI

`ex:ida` ini merupakan **IRI (Internationalized Resource Identifier)**, karena dia mengidentifikasi sebuah resource secara unik.

Contoh:

```turtle
ex:ida
```

##### 2. `"Ida Adi"@id` → Literal

Kalau `"Ida Adi"@id` merupakan **Literal**, yaitu nilai yang berisi data berupa teks.

Contoh literal lainnya:

```turtle
"Ida Adi"
"Medan"
"Web Semantik"
```

##### 3. `[ ex:kota "Medan" ]` → Blank Node

Selanjutnya `[ ex:kota "Medan" ]` merupakan **Blank Node**, karena node tersebut tidak mempunyai nama atau IRI yang ditentukan secara langsung.

Contoh:

```turtle
[
    ex:kota "Medan"
]
```

Jadi, kesimpulannya:

```text
ex:ida                  → IRI
"Ida Adi"@id            → Literal
[ ex:kota "Medan" ]     → Blank Node
```

---

#### 2. Mengapa literal tidak boleh menjadi subject RDF?

##### Pertanyaan

Mengapa literal tidak boleh menjadi subject RDF?

##### Jawaban

Menurut kami literal tidak boleh menjadi **subject** dalam RDF karena literal digunakan untuk menyimpan **nilai atau data**, bukan untuk mengidentifikasi suatu resource.

Dalam RDF, sebuah triple memiliki bentuk:

```text
Subject → Predicate → Object
```

Subject hanya dapat berupa:

- **IRI**
- **Blank Node**

Sedangkan **Literal hanya dapat digunakan sebagai Object**.

##### Contoh yang benar

```turtle
ex:ida ex:nama "Ida Adi" .
```

Penjelasannya:

| Bagian | Nilai | Jenis |
|---|---|---|
| Subject | `ex:ida` | IRI |
| Predicate | `ex:nama` | IRI |
| Object | `"Ida Adi"` | Literal |

##### Contoh yang salah

```turtle
"Ida Adi" ex:nama ex:ida .
```

Contoh tersebut salah karena `"Ida Adi"` merupakan literal dan digunakan sebagai **subject**.

##### Kesimpulan

Nah, literal tidak boleh menjadi subject karena literal hanya merepresentasikan **nilai/data**, sedangkan subject harus merepresentasikan **resource atau entitas** yang dapat memiliki hubungan dengan resource lainnya.

---

#### 3. Buat IRI dasar untuk graf Anda dengan pola HTTP

##### Pertanyaan

Buat IRI dasar untuk graf Anda dengan pola HTTP, misalnya:

```text
https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#
```

### Jawaban

IRI dasar yang digunakan untuk graf adalah:

```text
https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#
```

IRI tersebut dapat digunakan sebagai namespace `ex`:

```turtle
@prefix ex: <https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#> .
```

Dengan menggunakan prefix tersebut, penulisan IRI menjadi lebih singkat.

Contohnya:

```turtle
ex:ida
ex:Lecturer
ex:WebSemantik
ex:teaches
ex:name
```

daripada harus menulis IRI lengkap setiap kali di pakai.

##### Contoh RDF/Turtle

```turtle
@prefix ex: <https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:ida rdf:type ex:Lecturer .
ex:ida ex:teaches ex:WebSemantik .
ex:WebSemantik ex:name "Web Semantik" .
```

##### Penjelasan Triple

Triple pertama:

```turtle
ex:ida rdf:type ex:Lecturer .
```

Artinya `ex:ida` merupakan seorang `ex:Lecturer`.

Triple kedua:

```turtle
ex:ida ex:teaches ex:WebSemantik .
```

Artinya `ex:ida` mengajar mata kuliah `ex:WebSemantik`.

Triple ketiga:

```turtle
ex:WebSemantik ex:name "Web Semantik" .
```

Artinya nama dari `ex:WebSemantik` adalah `"Web Semantik"`.

---

#### 4. Tuliskan kepanjangan namespace `rdf`, `rdfs`, `xsd`, dan `foaf`

##### Pertanyaan

Tuliskan kepanjangan namespace:

- `rdf`
- `rdfs`
- `xsd`
- `foaf`

##### Jawaban

| Prefix | Kepanjangan | Namespace |
|---|---|---|
| `rdf` | Resource(Sumber Daya) Description Framework | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` |
| `rdfs` | RDF Schema | `http://www.w3.org/2000/01/rdf-schema#` |
| `xsd` | XML Schema Definition | `http://www.w3.org/2001/XMLSchema#` |
| `foaf` | Friend of a Friend | `http://xmlns.com/foaf/0.1/` |

##### 1. RDF

**RDF** merupakan singkatan dari **Resource Description Framework**.

Namespace:

```text
http://www.w3.org/1999/02/22-rdf-syntax-ns#
```

Contoh penggunaan:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
```

Contoh:

```turtle
ex:ida rdf:type ex:Lecturer .
```

---

##### 2. RDFS

**RDFS** merupakan singkatan dari **RDF Schema**.

Namespace:

```text
http://www.w3.org/2000/01/rdf-schema#
```

Contoh penggunaan:

```turtle
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
```

---

##### 3. XSD

**XSD** merupakan singkatan dari **XML Schema Definition**.

Namespace:

```text
http://www.w3.org/2001/XMLSchema#
```

XSD digunakan untuk menentukan tipe data literal, misalnya:

```turtle
"20"^^xsd:integer
```

Contoh penggunaan:

```turtle
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
```

---

##### 4. FOAF

**FOAF** merupakan singkatan dari **Friend of a Friend**.

Namespace:

```text
http://xmlns.com/foaf/0.1/
```

FOAF digunakan untuk mendeskripsikan informasi mengenai orang dan hubungan antarorang.

Contoh penggunaan:

```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
```

---

## Perbandingan serialisasi
- Turtle: [pengamatan]
- JSON-LD: [pengamatan]
- Pernyataan yang sama: [isi]

## Refleksi
1. Kapan object harus berupa IRI dan kapan berupa literal?
2. Mengapa prefix membantu keterbacaan tanpa mengubah IRI?
3. Sebutkan satu kesalahan pemodelan yang Anda hindari pada graf ini.