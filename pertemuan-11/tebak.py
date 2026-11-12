from rdflib import Graph

g = Graph().parse("peran.ttl", format="turtle")
P = """PREFIX ex:   <http://contoh.id/kampus/>;
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>;
"""
soal = {
    "A": "SELECT ?c WHERE { ?c rdfs:subClassOf* ex:Dosen }",
    "B": "SELECT ?x WHERE { ?x a/rdfs:subClassOf* ex:Pegawai }",
    "C": "CONSTRUCT { ?x a ex:Pegawai } WHERE { ?x a/rdfs:subClassOf* ex:Pegawai }",
    "D": "CONSTRUCT { ?x ex:label ?n } WHERE { ?x a ex:Tendik . OPTIONAL { ?x ex:nama ?n } }",
}
for kode, q in soal.items():
    hasil = g.query(P + q)
    satuan = "triple" if q.startswith("CONSTRUCT") else "baris"
    print(kode, len(list(hasil)), satuan)
