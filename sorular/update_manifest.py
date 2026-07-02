"""sorular/ klasöründeki ders JSON dosyalarını tarar ve manifest.json'u günceller.
Kullanım: bu dosyanın bulunduğu klasörde  python update_manifest.py
veya çift tıklayarak guncelle.bat dosyasını çalıştır.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "manifest.json")

# index.html içine zaten gömülü olan, manifest'e eklenmemesi gereken dosyalar
EXCLUDE = {"sorular_ilk_cag_klasik_donem_felsefesi.json"}

files = sorted(
    f for f in os.listdir(HERE)
    if f.endswith(".json") and f != "manifest.json" and f not in EXCLUDE
)

with open(MANIFEST, "w", encoding="utf-8") as out:
    json.dump(files, out, ensure_ascii=False, indent=2)
    out.write("\n")

print(f"manifest.json güncellendi ({len(files)} ders dosyası):")
for f in files:
    print(" -", f)
