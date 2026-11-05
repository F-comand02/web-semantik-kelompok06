import csv
from pathlib import Path
from SPARQLWrapper import SPARQLWrapper, JSON

UA = "KelasWebSemantik/1.0 (raynathangee@gmail.com)"

sparql = SPARQLWrapper(
    "https://query.wikidata.org/sparql",
    agent=UA
)

sparql.setReturnFormat(JSON)

sparql.setQuery("""
SELECT ?univLabel ?kotaLabel WHERE {
  ?univ wdt:P31 wd:Q3918 ;      # instance of: universitas
        wdt:P17 wd:Q252 ;       # negara: Indonesia
        wdt:P131 ?kota .        # terletak di wilayah administratif
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "id,en".
  }
}
LIMIT 20
""")

hasil = sparql.queryAndConvert()
baris = hasil["results"]["bindings"]

print("Jumlah baris:", len(baris))

try:
    folder = Path(__file__).resolve().parent
except NameError:
    folder = Path.cwd()

lokasi_file = folder / "hasil_universitas.csv"

with open(lokasi_file, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["universitas", "kota"])
    for b in baris:
        w.writerow([
            b["univLabel"]["value"],
            b.get("kotaLabel", {}).get("value", "")
        ])

print("Data berhasil disimpan ke:", lokasi_file)
