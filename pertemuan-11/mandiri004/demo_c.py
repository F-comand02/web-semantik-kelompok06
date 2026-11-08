from SPARQLWrapper import SPARQLWrapper, TURTLE
from rdflib import Graph

# Membaca query DBpedia
Q_NOLAN_GRAF = open(
    "q_demo_b.rq",
    encoding="utf-8"
).read()

# Query untuk menghitung film tanpa tanggal
Q_TANPA_TANGGAL = """
PREFIX schema: <https://schema.org/>

SELECT (COUNT(?f) AS ?n)
WHERE {
    ?f a schema:Movie .

    FILTER NOT EXISTS {
        ?f schema:datePublished ?d
    }
}
"""

UA = "WebSemantikPertemuan11/1.0 (yabeshdaysiahaan@gmail.com)"

# Koneksi DBpedia
sp = SPARQLWrapper(
    "https://dbpedia.org/sparql",
    agent=UA
)

sp.setQuery(Q_NOLAN_GRAF)
sp.setReturnFormat(TURTLE)

# Mengambil data dari DBpedia
isi = sp.queryAndConvert()

# Membuat graf RDF
g = Graph().parse(
    data=isi,
    format="turtle"
)

print(len(g), "triple")

# Menyimpan graf ke Turtle
g.serialize(
    "film_nolan.ttl",
    format="turtle"
)

# Membaca kembali file lokal
lokal = Graph().parse(
    "film_nolan.ttl",
    format="turtle"
)

# Menghitung film tanpa tanggal
for baris in lokal.query(Q_TANPA_TANGGAL):
    print("Film tanpa tanggal:", baris.n)