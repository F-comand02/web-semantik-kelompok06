# Pemakaian: python jalankan.py DATA.ttl QUERY.rq
import sys
from rdflib import Graph

data, berkas_rq = sys.argv[1], sys.argv[2]
g = Graph().parse(data, format="turtle")
g.bind("ex", "http://contoh.id/")
g.bind("schema", "https://schema.org/")
PREFIX = """PREFIX dbo:    <http://dbpedia.org/ontology/>
PREFIX dbr:    <http://dbpedia.org/resource/>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf:   <http://xmlns.com/foaf/0.1/>
PREFIX schema: <https://schema.org/>
PREFIX ex:     <http://contoh.id/>
"""
hasil = g.query(PREFIX + open(berkas_rq, encoding="utf-8").read())
nm = g.namespace_manager
if hasil.type == "CONSTRUCT":
    print(len(hasil.graph), "triple")
    for s, p, o in sorted(hasil.graph):
        print(" ", s.n3(nm), p.n3(nm), o.n3(nm), ".")
else:
    baris = list(hasil)
    print(len(baris), "baris")
    for b in baris:
        print(" ", " | ".join(v.n3(nm) if v is not None else "-" for v in b))