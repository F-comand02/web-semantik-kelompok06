# Pemakaian: python jalankan.py DATA.ttl QUERY.rq
import sys
from pathlib import Path

from rdflib import Graph, Namespace


if len(sys.argv) != 3:
    raise SystemExit("Pemakaian: python jalankan.py DATA.ttl QUERY.rq")

FOLDER = Path(__file__).resolve().parent
data = Path(sys.argv[1])
berkas_rq = Path(sys.argv[2])
if not data.is_absolute():
    data = FOLDER / data
if not berkas_rq.is_absolute():
    berkas_rq = FOLDER / berkas_rq

g = Graph().parse(data, format="turtle")
for prefix, iri in {
    "dbo": "http://dbpedia.org/ontology/",
    "dbr": "http://dbpedia.org/resource/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "schema": "https://schema.org/",
    "ex": "http://contoh.id/",
}.items():
    g.bind(prefix, Namespace(iri))

PREFIX = """
PREFIX dbo:    <http://dbpedia.org/ontology/>
PREFIX dbr:    <http://dbpedia.org/resource/>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf:   <http://xmlns.com/foaf/0.1/>
PREFIX schema: <https://schema.org/>
PREFIX ex:     <http://contoh.id/>
"""
hasil = g.query(PREFIX + berkas_rq.read_text(encoding="utf-8"))
nm = g.namespace_manager

if hasil.type == "CONSTRUCT":
    print(len(hasil.graph), "triple")
    for s, p, o in sorted(hasil.graph):
        print(" ", s.n3(nm), p.n3(nm), o.n3(nm), ".")
else:
    baris = list(hasil)
    print(len(baris), "baris")
    for row in baris:
        print(" ", " | ".join(v.n3(nm) if v is not None else "-" for v in row))
