# Demo C Pertemuan 11: ambil graf Nolan sekali dari DBpedia,
# simpan sebagai Turtle, lalu kerjakan query kedua secara lokal.
# Jalankan dari folder yang berisi q_demo_b.rq.
from pathlib import Path

from rdflib import Graph
from SPARQLWrapper import SPARQLWrapper, TURTLE


FOLDER = Path(__file__).resolve().parent
Q_NOLAN_GRAF = (FOLDER / "q_demo_b.rq").read_text(encoding="utf-8")
Q_TANPA_TANGGAL = """
PREFIX schema: <https://schema.org/>
SELECT (COUNT(?f) AS ?n)
WHERE {
  ?f a schema:Movie .
  FILTER NOT EXISTS { ?f schema:datePublished ?d }
}
"""

UA = "KelasWebSemantik/1.0 (williamfransisco04@gmail.com)"
sp = SPARQLWrapper("https://dbpedia.org/sparql", agent=UA)
sp.setQuery(Q_NOLAN_GRAF)
sp.setReturnFormat(TURTLE)

data = sp.queryAndConvert()
g = data if isinstance(data, Graph) else Graph().parse(data=data, format="turtle")
print(len(g), "triple")

film_nolan = FOLDER / "film_nolan.ttl"
g.serialize(destination=film_nolan, format="turtle")

lokal = Graph().parse(film_nolan, format="turtle")
for baris in lokal.query(Q_TANPA_TANGGAL):
    print("Film tanpa tanggal:", baris.n)
