from rdflib import Graph

ATURAN = """
CONSTRUCT {
    ?x a ?super
}
WHERE {
    ?x a/rdfs:subClassOf* ?super
}
"""

Q_ORANG = """
SELECT ?x
WHERE {
    ?x a foaf:Person
}
"""


def materialisasi(g):
    """
    Menambahkan triple inferensi yang belum ada.
    Mengembalikan graf yang hanya berisi triple baru.
    """

    baru = Graph()

    for triple in g.query(ATURAN):

        if triple not in g:
            baru.add(triple)

    for triple in baru:
        g.add(triple)

    return baru


# Membaca data kampus
g = Graph().parse(
    "kampus.ttl",
    format="turtle"
)

# Materialisasi pertama
turunan = materialisasi(g)

print(
    "Putaran 1:",
    len(turunan),
    "triple baru | Person:",
    len(g.query(Q_ORANG))
)

# Menambahkan Rina
RINA = """
@prefix ex: <http://contoh.id/kampus/> .

ex:rina a ex:DosenTetap .
"""

g.parse(
    data=RINA,
    format="turtle"
)

print(
    "Rina masuk | Person:",
    len(g.query(Q_ORANG))
)

# Materialisasi kedua
turunan += materialisasi(g)

print(
    "Putaran 2 | Person:",
    len(g.query(Q_ORANG))
)

# Menyimpan triple turunan
turunan.serialize(
    "kampus_turunan.ttl",
    format="turtle"
)

# Menyimpan graf lengkap
g.serialize(
    "kampus_v4.ttl",
    format="turtle"
)

print(
    "Triple turunan disimpan terpisah:",
    len(turunan)
)