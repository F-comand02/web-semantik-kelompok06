from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, FOAF, XSD

# Membuat RDF Graph
g = Graph()

# Namespace
EX = Namespace(
    "https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#"
)

g.bind("ex", EX)
g.bind("foaf", FOAF)
g.bind("xsd", XSD)

# =========================
# DOSEN
# =========================

g.add((EX.opim_salim_sitompul, RDF.type, EX.Lecturer))
g.add((
    EX.opim_salim_sitompul,
    FOAF.name,
    Literal("Prof. Dr. Drs. Opim Salim Sitompul, M.Sc", lang="id")
))

g.add((EX.dedy_arisandi, RDF.type, EX.Lecturer))
g.add((
    EX.dedy_arisandi,
    FOAF.name,
    Literal("Dedy Arisandi, S.T., M.Kom.", lang="id")
))

g.add((EX.muhammad_atqa_adzkia_zaldi, RDF.type, EX.Lecturer))
g.add((
    EX.muhammad_atqa_adzkia_zaldi,
    FOAF.name,
    Literal("Muhammad Atqa Adzkia Zaldi, S.T., M.Kom", lang="id")
))

# =========================
# MATA KULIAH
# =========================

g.add((EX.web_semantik, RDF.type, EX.Course))
g.add((
    EX.web_semantik,
    FOAF.name,
    Literal("Web Semantik", lang="id")
))

g.add((EX.basis_data, RDF.type, EX.Course))
g.add((
    EX.basis_data,
    FOAF.name,
    Literal("Basis Data", lang="id")
))

g.add((EX.pemrograman_web, RDF.type, EX.Course))
g.add((
    EX.pemrograman_web,
    FOAF.name,
    Literal("Pemrograman Web", lang="id")
))

# =========================
# RELASI DOSEN MENGAJAR
# =========================

g.add((
    EX.opim_salim_sitompul,
    EX.mengajar,
    EX.web_semantik
))

g.add((
    EX.dedy_arisandi,
    EX.mengajar,
    EX.basis_data
))

g.add((
    EX.muhammad_atqa_adzkia_zaldi,
    EX.mengajar,
    EX.pemrograman_web
))

# =========================
# MAHASISWA
# =========================

g.add((EX.william_fransisco_sihotang, RDF.type, EX.Student))
g.add((
    EX.william_fransisco_sihotang,
    FOAF.name,
    Literal("William Fransisco Sihotang", lang="id")
))

g.add((EX.naufal_muhammad_dzaki, RDF.type, EX.Student))
g.add((
    EX.naufal_muhammad_dzaki,
    FOAF.name,
    Literal("Naufal Muhammad Dzaki", lang="id")
))

# =========================
# RELASI MAHASISWA MENGAMBIL MATA KULIAH
# =========================

g.add((
    EX.william_fransisco_sihotang,
    EX.mengambil,
    EX.web_semantik
))

g.add((
    EX.william_fransisco_sihotang,
    EX.mengambil,
    EX.basis_data
))

g.add((
    EX.william_fransisco_sihotang,
    EX.mengambil,
    EX.pemrograman_web
))

g.add((
    EX.naufal_muhammad_dzaki,
    EX.mengambil,
    EX.web_semantik
))

g.add((
    EX.naufal_muhammad_dzaki,
    EX.mengambil,
    EX.basis_data
))

g.add((
    EX.naufal_muhammad_dzaki,
    EX.mengambil,
    EX.pemrograman_web
))

# =========================
# JUMLAH KREDIT
# =========================

g.add((
    EX.web_semantik,
    EX.jumlahKredit,
    Literal(3, datatype=XSD.integer)
))

g.add((
    EX.basis_data,
    EX.jumlahKredit,
    Literal(3, datatype=XSD.integer)
))

g.add((
    EX.pemrograman_web,
    EX.jumlahKredit,
    Literal(2, datatype=XSD.integer)
))

# =========================
# HARI KULIAH
# =========================

g.add((
    EX.web_semantik,
    EX.hariKuliah,
    Literal("Senin", lang="id")
))

g.add((
    EX.basis_data,
    EX.hariKuliah,
    Literal("Selasa", lang="id")
))

g.add((
    EX.pemrograman_web,
    EX.hariKuliah,
    Literal("Rabu", lang="id")
))

# =========================
# OUTPUT
# =========================

print("Jumlah triple:", len(g))
print("\n=== TURTLE ===\n")
print(g.serialize(format="turtle"))

# Simpan ke file Turtle
g.serialize("kampus_usu.ttl", format="turtle")

# Simpan ke file JSON-LD
g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)

print("\nFile kampus_usu.ttl dan kampus_usu.jsonld berhasil dibuat.")
