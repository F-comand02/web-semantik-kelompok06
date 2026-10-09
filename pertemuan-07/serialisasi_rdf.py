#------------ Kami tambahkan URIRef, Literal, dan Namespace -------------------
from pathlib import Path
from rdflib import Dataset, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DCTERMS, RDF, XSD

data_dir = Path(__file__).resolve().parent

g = Graph()
g.parse(str(data_dir.parent / "pertemuan-06" / "kampus_usu.ttl"), format="turtle")
g.serialize(str(data_dir / "kampus_usu.jsonld"), format="json-ld", indent=2)
g.serialize(str(data_dir / "kampus_usu.nt"), format="nt")

print(f"Jumlah triple: {len(g)}")
print(g.serialize(format="turtle"))

#------------------- Kode tambahan langkah 3 ---------------------------------------------------
EX = Namespace("https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#")
stmt = URIRef(EX + "stmt-01")

g.add((stmt, RDF.type, RDF.Statement))
g.add((stmt, RDF.subject, EX.ida))
g.add((stmt, RDF.predicate, EX.mengajar))
g.add((stmt, RDF.object, EX.web_semantik))
g.add((stmt, DCTERMS.creator, EX.ida))
g.add((stmt, DCTERMS.date, Literal("2026-10-01", datatype=XSD.date)))
g.add((stmt, DCTERMS.source, Literal("Data akademik kampus")))
#-----------------------------------------------------------------------------------------------

ds = Dataset()
ds.parse(str(data_dir / "kampus_tergabung.trig"), format="trig")
for graf in ds.graphs():
    if len(graf) > 0:
        print(f"\nGraf: {graf.identifier} ({len(graf)} triple)")
        print(graf.serialize(format="turtle"))