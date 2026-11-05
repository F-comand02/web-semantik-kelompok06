from pathlib import Path
from rdflib import Graph

folder = Path(__file__).resolve().parent
file_rdf = folder.parent / "pertemuan-06" / "kampus_usu.ttl"
file_hasil = folder / "kampus_usu_v2.ttl"

g = Graph()
g.parse(file_rdf, format="turtle")
print("Jumlah triple awal:", len(g))

PREFIX = """
PREFIX ex:   <https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
"""

q_select = PREFIX + """
SELECT ?namaDosen ?namaMK
WHERE {
  ?dosen ex:mengajar ?mk ;
         foaf:name ?namaDosen .
  ?mk foaf:name ?namaMK .
}
ORDER BY ?namaDosen
"""

print("\nDaftar dosen dan mata kuliah:")
for row in g.query(q_select):
    print(f"{row.namaDosen} - {row.namaMK}")

q_ask = PREFIX + """
ASK {
  ex:ida ex:mengajar ex:praktik_sparql
}
"""

print("\nSebelum INSERT:", g.query(q_ask).askAnswer)

q_insert = PREFIX + """
INSERT DATA {
  ex:ida ex:mengajar ex:praktik_sparql .
  ex:praktik_sparql a ex:Course ;
                    foaf:name "Praktik SPARQL (contoh Langkah 3)"@id .
}
"""

g.update(q_insert)

print("Sesudah INSERT:", g.query(q_ask).askAnswer)
print("Jumlah triple akhir:", len(g))

g.serialize(destination=file_hasil, format="turtle")
print("File hasil disimpan:", file_hasil)
