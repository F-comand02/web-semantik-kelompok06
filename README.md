# 🌐 Web Semantik & Knowledge Graph

<p align="center">
  <img src="https://img.shields.io/badge/Web-Semantik-blue?style=for-the-badge" alt="Web Semantik">
  <img src="https://img.shields.io/badge/Knowledge-Graph-purple?style=for-the-badge" alt="Knowledge Graph">
  <img src="https://img.shields.io/badge/AI-Ready-green?style=for-the-badge" alt="AI Ready">
</p>

<p align="center">
  <b>Selamat datang di repository kelompok kami! 👋</b>
</p>

<p align="center">
  Repository ini merupakan dokumentasi perjalanan pembelajaran kami dalam memahami
  <b>Web Semantik, RDF, Knowledge Graph, dan keterkaitannya dengan Artificial Intelligence.</b>
</p>

---

## 👋 Selamat Datang!

Halo dan selamat datang di repository **Web Semantik & Knowledge Graph** kelompok kami.

Repository ini dibuat sebagai ruang dokumentasi seluruh proses pembelajaran, latihan, eksperimen, dan hasil proyek selama satu semester pada mata kuliah **Web Semantik**.

Di sini kami tidak hanya menyimpan hasil akhir tugas, tetapi juga mendokumentasikan bagaimana kami memahami konsep-konsep penting seperti **Semantic Web, RDF, Triple, URI, Ontology, SPARQL, dan Knowledge Graph**.

> 💡 **Tujuan utama repository ini adalah belajar, bereksperimen, mendokumentasikan, dan membangun pemahaman tentang bagaimana data dapat dibuat lebih bermakna bagi manusia maupun mesin.**

---

# 🧠 Pengantar Web Semantik & Knowledge Graph di Era AI

## 🌐 Apa Itu Web Semantik?

Bagaimana jika web tidak hanya dapat **dibaca oleh manusia**, tetapi juga dapat **memahami hubungan dan makna dari data** yang tersedia di dalamnya?

### ❓ Pertanyaan Pemantik

> **Pernahkah kamu mencari seseorang, tempat, atau organisasi di Google, lalu informasi pentingnya langsung muncul tanpa harus membuka sebuah website?**

Dari mana mesin pencari mengetahui bahwa informasi-informasi tersebut saling berhubungan?

Jawabannya berkaitan dengan bagaimana data di web dapat direpresentasikan dalam bentuk yang memiliki **makna, hubungan, dan struktur yang dapat dipahami oleh mesin**.

Di sinilah konsep **Web Semantik** menjadi penting.

---

## 🤔 Mengapa Web Semantik?

Web tradisional sangat baik dalam menyajikan informasi kepada manusia. Namun, bagi komputer, sebagian besar informasi pada halaman web masih berupa rangkaian karakter yang belum memiliki makna yang dinyatakan secara eksplisit.

Sebagai contoh, sebuah halaman mungkin menuliskan:

> **"Java memiliki populasi lebih dari 150 juta jiwa."**

Manusia dapat memahami bahwa **Java** dalam konteks tersebut merupakan sebuah pulau.

Namun, komputer dapat menemukan berbagai kemungkinan arti dari kata *Java*, misalnya:

* 🏝️ Pulau Jawa
* 💻 Bahasa pemrograman Java
* ☕ Nama produk atau merek tertentu

**Web Semantik** hadir untuk memberikan struktur dan makna pada data sehingga informasi dapat:

* diproses oleh mesin,
* dihubungkan dengan informasi lain,
* dicari berdasarkan hubungan,
* digunakan kembali,
* dan dimanfaatkan dalam sistem yang lebih cerdas.

Dengan kata lain:

> **Web Semantik berusaha membuat data tidak hanya dapat dibaca, tetapi juga dapat dipahami oleh mesin.**

---

# 🎯 Tujuan Pembelajaran

Setelah mempelajari topik ini, kami diharapkan mampu:

* Menjelaskan konsep dasar **Web Semantik** dengan bahasa sendiri.
* Memahami perkembangan **Web 1.0 → Web 2.0 → Web 3.0**.
* Mengenali komponen utama **Semantic Web Stack**.
* Memahami konsep **URI, RDF, Triple, Ontology, dan SPARQL**.
* Menjelaskan bagaimana sebuah **Knowledge Graph** dibangun.
* Memahami hubungan antara **Knowledge Graph dan Artificial Intelligence**.
* Menjelaskan bagaimana Knowledge Graph dapat melengkapi kemampuan **Large Language Model (LLM)**.

---

# 🔗 Konsep yang Akan Dipelajari

### 🌐 Web Semantik

Membuat data di web memiliki struktur dan makna sehingga dapat dipahami serta diproses oleh mesin.

### 🔗 Triple & RDF

Merepresentasikan pengetahuan dalam bentuk hubungan:

**Subject → Predicate → Object**

Contoh:

```text
Universitas Sumatera Utara
        ↓
     memiliki
        ↓
     fakultas
```

Secara konsep dapat direpresentasikan sebagai:

```text
(Universitas Sumatera Utara, memiliki, Fakultas Ilmu Komputer dan Teknologi Informasi)
```

### 🕸️ Knowledge Graph

Menghubungkan berbagai **entitas, fakta, dan hubungan** menjadi sebuah jaringan pengetahuan.

Contohnya:

```text
[Universitas Sumatera Utara]
          │
          ├── memiliki → [Fasilkom-TI]
          │
          ├── berlokasi → [Medan]
          │
          └── berada_di → [Indonesia]
```

### 🤖 Semantic Web + AI

Knowledge Graph dapat membantu sistem AI memperoleh informasi yang lebih **terstruktur, terhubung, dapat ditelusuri, dan lebih mudah diverifikasi**.

Pendekatan ini menjadi semakin menarik ketika dikombinasikan dengan teknologi seperti:

* Large Language Model (LLM)
* Retrieval-Augmented Generation (RAG)
* GraphRAG
* Information Retrieval

---

# 📚 Evolusi Web

Perkembangan web dapat dipahami secara sederhana melalui tiga tahap:

```text
┌─────────────┐
│   WEB 1.0   │
│    READ     │
└──────┬──────┘
       ↓
┌─────────────┐
│   WEB 2.0   │
│ READ + WRITE│
└──────┬──────┘
       ↓
┌─────────────┐
│   WEB 3.0   │
│ READ + WRITE│
│   + EXECUTE │
└─────────────┘
```

### Web 1.0 — Read

Web pada tahap awal lebih berfokus pada penyajian informasi secara satu arah.

**Pengguna → membaca informasi**

### Web 2.0 — Read + Write

Web berkembang menjadi lebih interaktif dan memungkinkan pengguna menghasilkan serta berbagi konten.

**Pengguna ↔ web**

Contohnya:

* media sosial,
* forum,
* blog,
* platform berbagi video.

### Web 3.0 — Read + Write + Execute

Dalam konteks mata kuliah ini, istilah **Web 3.0** digunakan untuk menggambarkan visi **Semantic Web**, yaitu web yang memungkinkan data memiliki makna dan hubungan yang dapat diproses oleh mesin.

> ⚠️ **Catatan:** Dalam repository ini, Web 3.0 merujuk pada konsep **Semantic Web**, bukan Web3 yang berkaitan dengan blockchain dan cryptocurrency.

---

# 💡 Web Semantik di Era Artificial Intelligence

Perkembangan **Artificial Intelligence (AI)** membuat kebutuhan terhadap data yang terstruktur dan memiliki konteks menjadi semakin penting.

Large Language Model seperti **ChatGPT, Claude, dan Gemini** memiliki kemampuan luar biasa dalam memahami serta menghasilkan bahasa alami.

Namun, sistem berbasis LLM juga memiliki beberapa tantangan, seperti:

* kemungkinan menghasilkan informasi yang keliru,
* sumber informasi yang tidak selalu mudah ditelusuri,
* kesulitan dalam memastikan asal suatu fakta,
* dan keterbatasan dalam melakukan audit terhadap hubungan antarentitas.

Di sinilah **Knowledge Graph** dapat memberikan pendekatan yang berbeda.

Knowledge Graph merepresentasikan fakta dan hubungan antarentitas secara eksplisit.

Contohnya:

```text
[Albert Einstein]
       │
       ├── born_in → [Ulm]
       │
       ├── occupation → [Physicist]
       │
       └── known_for → [Theory of Relativity]
```

Hubungan tersebut dapat ditelusuri oleh sistem sehingga informasi tidak hanya berupa teks, tetapi juga memiliki struktur relasional.

---

# 🔎 Knowledge Graph + LLM

Salah satu perkembangan menarik adalah menggabungkan kemampuan **Knowledge Graph** dengan **Large Language Model**.

Salah satu pendekatan yang berkembang adalah:

```text
         User Question
              │
              ↓
       ┌──────────────┐
       │     LLM      │
       └──────┬───────┘
              ↓
         Information
          Retrieval
              │
              ↓
       ┌──────────────┐
       │ Knowledge    │
       │    Graph     │
       └──────┬───────┘
              ↓
       Structured Data
              │
              ↓
       ┌──────────────┐
       │     LLM      │
       └──────┬───────┘
              ↓
         Final Answer
```

Pendekatan seperti **GraphRAG** mencoba memanfaatkan struktur graf untuk membantu proses pencarian dan pemanfaatan informasi oleh sistem AI.

Dengan demikian:

> **LLM memberikan kemampuan memahami bahasa, sedangkan Knowledge Graph memberikan struktur hubungan dan pengetahuan yang eksplisit.**

---

# 📖 Materi yang Akan Dieksplorasi

Dalam repository ini, beberapa konsep utama yang akan kami pelajari meliputi:

* 🌐 Perbedaan Web Tradisional dan Web Semantik
* 🔄 Evolusi Web 1.0, Web 2.0, dan Web 3.0
* 🆔 URI dan identitas sumber daya
* 🔗 RDF dan Triple
* 🧩 Subject, Predicate, dan Object
* 🧠 Ontology
* 🔍 SPARQL
* 🕸️ Knowledge Graph
* 🔎 Google Knowledge Graph
* 🏷️ schema.org
* 🤖 Knowledge Graph dan LLM
* 📚 RAG
* 🕸️ GraphRAG

---

# 🧩 Semantic Web Stack

Secara konseptual, Semantic Web memiliki beberapa lapisan teknologi yang saling mendukung.

```text
┌─────────────────────────────┐
│            Trust            │
├─────────────────────────────┤
│            Proof            │
├─────────────────────────────┤
│         Logic Rules         │
├─────────────────────────────┤
│     Ontology / OWL / RDFS   │
├─────────────────────────────┤
│             RDF             │
├─────────────────────────────┤
│             URI             │
├─────────────────────────────┤
│         Unicode / XML       │
└─────────────────────────────┘
```

Setiap lapisan memiliki fungsi yang berbeda dalam membangun ekosistem data yang dapat saling terhubung dan diproses oleh mesin.

---

# 🏫 Tentang Tim Kami

Kami adalah kelompok mahasiswa yang sedang mempelajari bagaimana teknologi web berkembang dari sekadar media penyajian informasi menjadi sebuah ekosistem data yang saling terhubung.

Melalui repository ini, kami berusaha mendokumentasikan proses belajar secara terbuka dan terstruktur.

Bagi kami, pembelajaran tidak hanya berhenti pada **"tugas sudah selesai"**, tetapi juga pada pemahaman mengenai:

> **Mengapa teknologi tersebut digunakan, bagaimana cara kerjanya, dan bagaimana teknologi tersebut dapat diterapkan pada permasalahan nyata.**

---

# 👥 Anggota Kelompok

| No. | Nama               | NIM   | Peran                    |
| :-: | ------------------ | ----- | ------------------------ |
|  1  | **Farel Yamotaro Hia** | `251402069` | Project Manager            |
|  2  | **Naufal Muhammad Dzaki** | `251402128` | Research & Documentation |
|  3  | **Yabesh Day Siahaan** | `251402004` | Development              |
|  4  | **William Fransisco sihotang** | `251402052` | Data & Knowledge Graph   |
|  5  | **Ray Nathan Geereno Saragih** | `251402046` | Documentation            |

> ✏️ Silakan ganti data anggota sesuai dengan kelompok kalian.

---

# 💻 Struktur Repository

Seluruh hasil latihan dan pembelajaran **Web Semantik** selama satu semester disimpan dalam satu repository GitHub.

Format nama repository:

```text
web-semantik-kelompok06
```

## 📁 Struktur Folder

```text
web-semantik-kelompok06/
│
├── README.md
│
├── pertemuan-01/
│   ├── README.md
│   ├── triple.md
│   ├── knowledge-graph.png
│   │
│   └── screenshots/
│       └── wikidata-usu.png
│
├── pertemuan-02/
│   └── ...
│
├── pertemuan-03/
│   └── ...
│
└── ...
```

### 📌 Penjelasan Struktur

| Folder/File                    | Fungsi                             |
| ------------------------------ | ---------------------------------- |
| `README.md`                    | Dokumentasi utama repository       |
| `pertemuan-01/`                | Materi dan tugas pertemuan pertama |
| `triple.md`                    | Dokumentasi RDF Triple             |
| `knowledge-graph.png`          | Visualisasi Knowledge Graph        |
| `screenshots/`                 | Dokumentasi hasil eksperimen       |
| `wikidata-usu.png`             | Screenshot eksplorasi Wikidata     |
| `pertemuan-02/` dan seterusnya | Dokumentasi pertemuan berikutnya   |

Struktur tersebut memungkinkan setiap hasil pembelajaran tersusun secara **modular, terorganisir, dan mudah ditelusuri**.

---

# 🛠️ Project & Teknologi yang Digunakan

Repository ini menggunakan beberapa teknologi dan platform yang relevan dengan pembelajaran Web Semantik.

### 💻 Development & Documentation

* **Git**
* **GitHub**
* **Markdown**
* **Visual Studio Code**

### 🌐 Semantic Web

* **RDF**
* **URI**
* **RDFS**
* **OWL**
* **SPARQL**
* **Ontology**

### 🗃️ Knowledge Graph & Data

* **Wikidata**
* **schema.org**
* **Knowledge Graph**

### 🤖 Artificial Intelligence

* **Large Language Model (LLM)**
* **Retrieval-Augmented Generation (RAG)**
* **GraphRAG**

> Teknologi yang digunakan dapat berkembang seiring bertambahnya materi dan eksperimen pada setiap pertemuan.

---

# 📸 Dokumentasi

Dokumentasi digunakan untuk menyimpan bukti proses pembelajaran dan eksperimen yang dilakukan selama perkuliahan.

Beberapa dokumentasi yang akan tersedia di repository ini antara lain:

### 🔎 Eksplorasi Wikidata

Dokumentasi proses pencarian dan identifikasi entitas menggunakan Wikidata.

### 🕸️ Knowledge Graph

Visualisasi hubungan antarentitas berdasarkan data yang telah dikumpulkan.

### 🔗 RDF Triple

Dokumentasi bagaimana suatu informasi direpresentasikan menjadi:

```text
Subject → Predicate → Object
```

### 💻 Eksperimen

Screenshot dan hasil eksperimen yang dilakukan pada setiap pertemuan.

---

# 🚀 Roadmap Pembelajaran

Perjalanan repository ini akan berkembang seiring dengan proses pembelajaran.

```text
Web Semantik
     │
     ↓
Semantic Web Concept
     │
     ↓
URI & RDF
     │
     ↓
Triple
     │
     ↓
Ontology
     │
     ↓
SPARQL
     │
     ↓
Knowledge Graph
     │
     ↓
RAG
     │
     ↓
GraphRAG
     │
     ↓
Semantic Web + AI
```

🎯 **Target akhirnya bukan hanya memahami teori, tetapi mampu melihat bagaimana konsep-konsep tersebut dapat digunakan untuk membangun sistem berbasis pengetahuan.**

---

# 📂 Dokumentasi Pertemuan

| Pertemuan | Topik                  |         Dokumentasi         |
| :-------: | ---------------------- | :-------------------------: |
|     01    | Pengantar Web Semantik | [📖 Lihat](./pertemuan-01/) |
|     02    | RDF & Triple           | [📖 Lihat](./pertemuan-02/) |
|     03    | URI & Linked Data      | [📖 Lihat](./pertemuan-03/) |
|     04    | Ontology               | [📖 Lihat](./pertemuan-04/) |
|     05    | SPARQL                 | [📖 Lihat](./pertemuan-05/) |
|    ...    | ...                    |             ...             |

> 📌 Daftar akan diperbarui seiring bertambahnya pertemuan dan materi.

---

# 🌱 Our Learning Philosophy

Kami percaya bahwa teknologi tidak hanya perlu **digunakan**, tetapi juga perlu **dipahami**.

Web Semantik mengajarkan bahwa data menjadi jauh lebih berharga ketika data tersebut memiliki konteks, hubungan, dan makna.

Begitu pula dalam pembelajaran:

> **Satu fakta mungkin terlihat sederhana. Namun ketika fakta tersebut dihubungkan dengan fakta lainnya, terbentuklah pengetahuan.**

Dan seperti sebuah Knowledge Graph:

```text
        Knowledge
           │
     ┌─────┼─────┐
     ↓     ↓     ↓
   Learn  Link  Explore
     │     │     │
     └─────┼─────┘
           ↓
      Understanding
```

---

# ❤️ Penutup

Terima kasih telah mengunjungi repository kami.

Repository ini akan terus berkembang bersama proses pembelajaran kami. Setiap folder, kode, diagram, screenshot, dan dokumentasi di dalamnya merupakan bagian dari perjalanan kami dalam memahami **Web Semantik dan Knowledge Graph di era Artificial Intelligence**.

> **"The web is not just a collection of documents. It is a network of knowledge waiting to be connected."**

🌐 **Read the Web.**
🔗 **Connect the Data.**
🧠 **Build the Knowledge.**
🤖 **Empower the Future.**

---

<p align="center">
  <b>🌐 Web Semantik & Knowledge Graph</b>
  <br>
  <sub>Learning • Connecting • Understanding • Building</sub>
</p>

<p align="center">
  Made with ❤️ by <b>Kelompok 06</b>
  <br>
  Universitas Sumatera Utara
</p>

<p align="center">
  ⭐ Jika repository ini bermanfaat, jangan lupa berikan star!
</p>
