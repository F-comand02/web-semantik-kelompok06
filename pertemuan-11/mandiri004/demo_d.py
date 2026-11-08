from rdflib import Graph

g = Graph().parse("kampus.ttl", format="turtle")

Q_ORANG = """
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?x
WHERE {
    ?x a foaf:Person .
}
"""

ATURAN = """
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
    ?x a ?super .
}
WHERE {
    ?x a/rdfs:subClassOf* ?super .
}
"""

print("Sebelum:", len(list(g.query(Q_ORANG))))

turunan = g.query(ATURAN)

for triple in turunan:
    g.add(triple)

print("Sesudah:", len(list(g.query(Q_ORANG))))

g.serialize("kampus_v4.ttl", format="turtle")

RINA = """
@prefix ex: <http://contoh.id/kampus/> .

ex:rina a ex:DosenTetap .
"""

g.parse(data=RINA, format="turtle")

print("Ada Rina:", len(list(g.query(Q_ORANG))))