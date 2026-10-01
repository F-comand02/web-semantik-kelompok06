from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, FOAF, XSD

g = Graph()
EX = Namespace("https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#")

g.bind("ex", EX)
g.bind("foaf", FOAF)

# Dosen dan mata kuliah
g.add((EX.ida, RDF.type, EX.Lecturer))
g.add((EX.ida, FOAF.name, Literal("Muhammad Isa Dadi Hasibuan S.Kom., M.Kom", lang="id")))
g.add((EX.web_semantik, RDF.type, EX.Course))
g.add((EX.web_semantik, FOAF.name, Literal("Web Semantik", lang="id")))
g.add((EX.ida, EX.mengajar, EX.web_semantik))

# Tambahkan triple Anda di bawah ini

# Universitas
g.add((EX.usu, RDF.type, EX.University))
g.add((EX.usu, FOAF.name, Literal("Universitas Sumatera Utara", lang="id")))

# Dosen tambahan 
g.add((EX.umay, RDF.type, EX.Lecturer))
g.add((EX.umay, FOAF.name, Literal("Umaya Ramadhani Putri Nasution S.TI., M.Kom", lang="id")))
g.add((EX.ivan, RDF.type, EX.Lecturer))
g.add((EX.ivan, FOAF.name, Literal("Ivan Jaya S.Si., M.Kom.", lang="id")))

# Mata kuliah tambahan 
g.add((EX.basis_data, RDF.type, EX.Course))
g.add((EX.basis_data, FOAF.name, Literal("Basis Data", lang="id")))
g.add((EX.pemrograman_web, RDF.type, EX.Course))
g.add((EX.pemrograman_web, FOAF.name, Literal("Pemrograman Web", lang="id")))

# Relasi mengajar 
g.add((EX.umay, EX.mengajar, EX.basis_data))
g.add((EX.ivan, EX.mengajar, EX.pemrograman_web))

# Relasi bekerja di
g.add((EX.ida, EX.bekerjaDi, EX.usu))
g.add((EX.umay, EX.bekerjaDi, EX.usu))
g.add((EX.ivan, EX.bekerjaDi, EX.usu))

# Mahasiswa dan relasi ke mata kuliah
g.add((EX.mhs251402069, RDF.type, EX.Student))
g.add((EX.mhs251402069, FOAF.name, Literal("Farel Yamotaro Hia", lang="id")))
g.add((EX.mhs251402069, EX.mengambil, EX.web_semantik))
g.add((EX.mhs251402069, EX.mengambil, EX.basis_data))
g.add((EX.mhs251402069, EX.mengambil, EX.pemrograman_web))

g.add((EX.mhs251402004, RDF.type, EX.Student))
g.add((EX.mhs251402004, FOAF.name, Literal("Yabesh Day Siahaan", lang="id")))
g.add((EX.mhs251402004, EX.mengambil, EX.web_semantik))
g.add((EX.mhs251402004, EX.mengambil, EX.basis_data))
g.add((EX.mhs251402004, EX.mengambil, EX.pemrograman_web))

g.add((EX.mhs251402046, RDF.type, EX.Student))
g.add((EX.mhs251402046, FOAF.name, Literal("Ray Nathan Geereno Saragih", lang="id")))
g.add((EX.mhs251402046, EX.mengambil, EX.web_semantik))
g.add((EX.mhs251402046, EX.mengambil, EX.basis_data))
g.add((EX.mhs251402046, EX.mengambil, EX.pemrograman_web))

g.add((EX.mhs251402128, RDF.type, EX.Student))
g.add((EX.mhs251402128, FOAF.name, Literal("Naufal Muhammad Dzaki", lang="id")))
g.add((EX.mhs251402128, EX.mengambil, EX.web_semantik))
g.add((EX.mhs251402128, EX.mengambil, EX.basis_data))
g.add((EX.mhs251402128, EX.mengambil, EX.pemrograman_web))

g.add((EX.mhs251402052, RDF.type, EX.Student))
g.add((EX.mhs251402052, FOAF.name, Literal("William Fransisco sihotang", lang="id")))
g.add((EX.mhs251402052, EX.mengambil, EX.web_semantik))
g.add((EX.mhs251402052, EX.mengambil, EX.basis_data))
g.add((EX.mhs251402052, EX.mengambil, EX.pemrograman_web))

# Jumlah kredit 
g.add((EX.web_semantik, EX.jumlahKredit, Literal(3, datatype=XSD.integer)))
g.add((EX.basis_data, EX.jumlahKredit, Literal(3, datatype=XSD.integer)))
g.add((EX.pemrograman_web, EX.jumlahKredit, Literal(2, datatype=XSD.integer)))

# Hari kuliah
g.add((EX.web_semantik, EX.hariKuliah, Literal("Senin", lang="id")))
g.add((EX.basis_data, EX.hariKuliah, Literal("Selasa", lang="id")))
g.add((EX.pemrograman_web, EX.hariKuliah, Literal("Rabu", lang="id")))

print(len(g))
print(g.serialize(format="turtle"))
g.serialize("kampus_usu.ttl", format="turtle")
g.serialize("kampus_usu.jsonld", format="json-ld", indent=2)