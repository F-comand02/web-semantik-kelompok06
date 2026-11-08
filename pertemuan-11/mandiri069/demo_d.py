# Demo D Pertemuan 11 — materialisasi kelas dengan CONSTRUCT pada graf lokal (kampus.ttl).
from rdflib import Graph

g = Graph().parse("kampus.ttl")
Q_ORANG = "SELECT ?x WHERE { ?x a foaf:Person }"
print("Sebelum:", len(g.query(Q_ORANG)))

turunan = g.query("""CONSTRUCT { ?x a ?super }
    WHERE { ?x a/rdfs:subClassOf* ?super }""")
for t in turunan:
    g.add(t)
print("Sesudah:", len(g.query(Q_ORANG)))
g.serialize("kampus_v4.ttl", format="turtle")

RINA = "@prefix ex: <http://contoh.id/kampus/> . ex:rina a ex:DosenTetap ."
g.parse(data=RINA, format="turtle")   # dosen baru
print("Ada Rina:", len(g.query(Q_ORANG)))
