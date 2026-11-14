from pathlib import Path
from rdflib import Graph, RDF, RDFS
from owlrl import DeductiveClosure, RDFS_Semantics

BASE = "https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#"
SUMBER = Path(r"C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-09\kampus_usu_v2.ttl")   # graf asserted dari Pertemuan 9

# 1. Graf asserted: data Anda + skema kecil
asserted = Graph().parse(SUMBER, format="turtle")
asserted.update(f"""
PREFIX ex: <{BASE}>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
INSERT DATA {{
  ex:Lecturer rdfs:subClassOf ex:Pegawai .
  ex:Pegawai rdfs:subClassOf foaf:Person .
  ex:mengajar rdfs:domain ex:Lecturer ;
              rdfs:range  ex:MataKuliah .
}}""")
print("Sumber:", SUMBER, "| asserted:", len(asserted))

# 2. Closure dihitung pada salinan, inferred = selisihnya
closure = Graph() + asserted
DeductiveClosure(RDFS_Semantics).expand(closure)
inferred = closure - asserted

# 3. Simpan hanya turunan yang bermakna
TRIVIAL = {RDFS.Resource, RDF.Property}
bermakna = Graph()
for s, p, o in inferred:
    if str(s).startswith(BASE) and o not in TRIVIAL and s != o:
        bermakna.add((s, p, o))
print("Closure:", len(closure), "| inferred:", len(inferred),
      "| bermakna:", len(bermakna))

asserted.serialize("kampus_usu_v5.ttl", format="turtle")        # sumber kebenaran
bermakna.serialize("kampus_usu_inferred.ttl", format="turtle")  # boleh dibuang

# 4. Bandingkan dengan hasil materialisasi Pertemuan 11
V4 = Path(r"C:\Users\ASUS\OneDrive\Documents\web-semantik-kelompok06\web-semantik-kelompok06\pertemuan-11\kampus_usu_v4.ttl")
if V4.exists():
    v4 = Graph().parse(V4, format="turtle")
    tercampur = [t for t in v4 if t not in asserted]
    print("Triple di v4 yang tidak ada di asserted:", len(tercampur))