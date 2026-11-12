from rdflib import Graph

ATURAN = """CONSTRUCT { ?x a ?super }
WHERE { ?x a/rdfs:subClassOf* ?super }"""
Q_ORANG = "SELECT ?x WHERE { ?x a foaf:Person }"

def materialisasi(g):
    """Jalankan ATURAN pada g, tambahkan hasilnya ke g,
    lalu kembalikan graf yang berisi triple yang BARU saja."""
    baru = Graph()
    for t in g.query(ATURAN):
        if t not in g:          # simpan hanya yang belum ada
            baru.add(t)
    for t in baru:
        g.add(t)
    return baru

g = Graph().parse("kampus.ttl")
turunan = materialisasi(g)
print("Putaran 1:", len(turunan), "triple baru | Person:", len(g.query(Q_ORANG)))

RINA = "@prefix ex: <http://contoh.id/kampus/> . ex:rina a ex:DosenTetap ."
g.parse(data=RINA, format="turtle")
print("Rina masuk | Person:", len(g.query(Q_ORANG)))

turunan += materialisasi(g)     # jalankan ulang aturan
print("Putaran 2 | Person:", len(g.query(Q_ORANG)))

turunan.serialize("kampus_turunan.ttl", format="turtle")
g.serialize("kampus_v4.ttl", format="turtle")
print("Triple turunan disimpan terpisah:", len(turunan))