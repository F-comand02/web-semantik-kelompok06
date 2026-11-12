import csv
from pathlib import Path
from SPARQLWrapper import SPARQLWrapper, TURTLE
from rdflib import Graph

UA = "KelasWebSemantik/1.0 (raynathan@students.usu.ac.id)"
q6 = Path("queries/q6_universitas_graf.rq").read_text(encoding="utf-8")

sp = SPARQLWrapper("https://query.wikidata.org/sparql", agent=UA)
sp.setQuery(q6)
sp.setReturnFormat(TURTLE)
sp.setOnlyConneg(True)
g = Graph().parse(data=sp.queryAndConvert(), format="turtle")
print("Triple dari Wikidata:", len(g))
g.serialize("universitas.ttl", format="turtle")

q_kota = """
PREFIX ex: <https://contoh.github.io/web-semantik/251402046/kampus#>
SELECT ?kota (COUNT(DISTINCT ?u) AS ?jumlah) WHERE {
  ?u a ex:Universitas ;
     ex:lokasi ?kota .
}
GROUP BY ?kota
ORDER BY DESC(?jumlah) ?kota
"""
with open("universitas_per_kota.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["kota", "jumlah_universitas"])
    for b in g.query(q_kota):
        w.writerow([str(b.kota), int(b.jumlah)])
print("CSV tersimpan: universitas_per_kota.csv")