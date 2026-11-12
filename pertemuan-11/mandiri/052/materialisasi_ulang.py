from pathlib import Path

from rdflib import Graph


FOLDER = Path(__file__).resolve().parent
ATURAN = """
CONSTRUCT { ?x a ?super }
WHERE { ?x a/rdfs:subClassOf* ?super }
"""
Q_ORANG = "SELECT ?x WHERE { ?x a foaf:Person }"


def materialisasi(g):
    """Tambahkan hasil aturan yang belum ada dan kembalikan graf triple baru."""
    baru = Graph()
    for triple in g.query(ATURAN):
        if triple not in g:
            baru.add(triple)
    for triple in baru:
        g.add(triple)
    return baru


g = Graph().parse(FOLDER / "kampus.ttl", format="turtle")
turunan = materialisasi(g)
print(
    "Putaran 1:",
    len(turunan),
    "triple baru | Person:",
    len(g.query(Q_ORANG)),
)

RINA = """
@prefix ex: <http://contoh.id/kampus/> .
ex:rina a ex:DosenTetap .
"""
g.parse(data=RINA, format="turtle")
print("Rina masuk | Person:", len(g.query(Q_ORANG)))

turunan += materialisasi(g)
print("Putaran 2 | Person:", len(g.query(Q_ORANG)))

turunan.serialize(destination=FOLDER / "kampus_turunan.ttl", format="turtle")
g.serialize(destination=FOLDER / "kampus_v4.ttl", format="turtle")
print("Triple turunan disimpan terpisah:", len(turunan))
