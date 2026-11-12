# Demo D Pertemuan 11: materialisasi kelas pada graf lokal kampus.ttl.
from pathlib import Path

from rdflib import Graph


FOLDER = Path(__file__).resolve().parent
g = Graph().parse(FOLDER / "kampus.ttl", format="turtle")
Q_ORANG = "SELECT ?x WHERE { ?x a foaf:Person }"
print("Sebelum:", len(g.query(Q_ORANG)))

turunan = g.query(
    """CONSTRUCT { ?x a ?super }
       WHERE { ?x a/rdfs:subClassOf* ?super }"""
)
for triple in turunan:
    g.add(triple)

print("Sesudah:", len(g.query(Q_ORANG)))
g.serialize(destination=FOLDER / "kampus_v4.ttl", format="turtle")

RINA = """
@prefix ex: <http://contoh.id/kampus/> .
ex:rina a ex:DosenTetap .
"""
g.parse(data=RINA, format="turtle")
print("Ada Rina:", len(g.query(Q_ORANG)))
