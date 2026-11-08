import sys
from pathlib import Path
from rdflib import Graph

if len(sys.argv) != 3:
    raise SystemExit(
        "Pemakaian: python jalankan.py DATA.ttl QUERY.rq"
    )

data = sys.argv[1]
berkas_rq = sys.argv[2]

if not Path(data).is_file():
    raise SystemExit("File data tidak ditemukan.")

if not Path(berkas_rq).is_file():
    raise SystemExit("File query tidak ditemukan.")

# Membaca graf RDF
g = Graph().parse(
    data,
    format="turtle"
)

# Namespace
g.bind("ex", "http://contoh.id/")
g.bind("schema", "https://schema.org/")

PREFIX = """
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <https://schema.org/>
PREFIX ex: <http://contoh.id/>
"""

# Membaca query
query = Path(berkas_rq).read_text(
    encoding="utf-8"
)

hasil = g.query(PREFIX + query)

nm = g.namespace_manager

# Menampilkan hasil
if hasil.type == "CONSTRUCT":

    print(len(hasil.graph), "triple")

    for s, p, o in sorted(hasil.graph):

        print(
            " ",
            s.n3(nm),
            p.n3(nm),
            o.n3(nm),
            "."
        )

else:

    baris = list(hasil)

    print(len(baris), "baris")

    for b in baris:

        print(
            " ",
            " | ".join(
                v.n3(nm) if v is not None else "-"
                for v in b
            )
        )