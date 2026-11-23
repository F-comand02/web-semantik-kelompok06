import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Network,
  Terminal,
  Utensils,
  Compass,
  Clock,
  Star,
  ExternalLink,
  X,
  Database,
  Play,
  Layers,
  AlertTriangle,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const PRESET_SPARQL = [
  {
    title: 'Halal Dishes with Andaliman Pepper',
    query: `PREFIX ex: <http://kuliner-medan.org/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?dish ?culture ?restaurant ?price WHERE {
  ?k a ex:Kuliner ;
     rdfs:label ?dish ;
     ex:isHalal true ;
     ex:memilikiBahan ex:BahanAndaliman ;
     ex:pengaruhBudaya ?b ;
     ex:kisaranHarga ?price ;
     ex:rekomendasiTempat ?r .
  FILTER(LANG(?dish) = "id")
  ?b rdfs:label ?culture . FILTER(LANG(?culture) = "id")
  ?r schema:name ?restaurant .
}`,
  },
  {
    title: 'Heritage Venues Established Before 1985',
    query: `PREFIX ex: <http://kuliner-medan.org/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?restaurant ?established ?dish ?district WHERE {
  ?r a ex:Restoran ;
     schema:name ?restaurant ;
     ex:tahunBerdiri ?established ;
     ex:berlokasiDi ?kec .
  FILTER(?established < 1985)
  ?kec rdfs:label ?district .
  ?k ex:rekomendasiTempat ?r ;
     rdfs:label ?dish .
  FILTER(LANG(?dish) = "id")
}
ORDER BY ASC(?established)`,
  },
  {
    title: 'Culinary Count by Medan District (GROUP BY)',
    query: `PREFIX ex: <http://kuliner-medan.org/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?district (COUNT(DISTINCT ?dish) AS ?totalDishes) WHERE {
  ?dish a ex:Kuliner ;
        ex:rekomendasiTempat ?r .
  ?r ex:berlokasiDi ?kec .
  ?kec rdfs:label ?district .
}
GROUP BY ?district
ORDER BY DESC(?totalDishes)`,
  },
];

const NODE_COLORS = {
  Kuliner: '#22d3ee',
  Kategori: '#a855f7',
  PengaruhBudaya: '#f59e0b',
  BahanUtama: '#10b981',
  Restoran: '#f43f5e',
  Kecamatan: '#60a5fa',
};

// Local preview snapshot (used automatically when localhost:5000 / Fuseki is offline)
const DEMO_DISHES = [
  {
    slug: 'SotoMedan',
    uri: 'http://kuliner-medan.org/ontology#SotoMedan',
    nama: 'Soto Medan',
    namaEn: 'Medan Coconut Beef Soup',
    deskripsi:
      'Soto berkuah santan kental berwarna kuning kehijauan dengan rempah jintan, kapulaga, dan isian daging sapi, ayam, atau udang.',
    gambar: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 2,
    kisaranHarga: 'Rp 35.000 - Rp 55.000',
    rasaDominan: 'Gurih Rempah & Creamy',
    metodeMasak: 'Rebus & Tumis Rempah',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Makan Siang',
    bahanUtama: ['Santan Kelapa', 'Daging Sapi', 'Daun Jeruk Purut'],
    sameAs: ['http://dbpedia.org/resource/Soto_Medan'],
    restoran: {
      nama: 'Soto Medan Sinar Pagi',
      alamat: 'Jl. Sei Deli No. 2D, Medan Barat',
      kecamatan: 'Medan Barat',
      kecamatanSlug: 'KecMedanBarat',
      jamBuka: '07:00 - 15:30 WIB',
      rating: 4.7,
      tahunBerdiri: 1962,
      lat: 3.5975,
      long: 98.6722,
    },
  },
  {
    slug: 'BikaAmbon',
    uri: 'http://kuliner-medan.org/ontology#BikaAmbon',
    nama: 'Bika Ambon',
    namaEn: 'Bika Ambon Honeycomb Cake',
    deskripsi:
      'Kue khas Medan berwarna kuning keemasan dengan tekstur bersarang kenyal dan aroma harum daun jeruk serta serai.',
    gambar: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 0,
    kisaranHarga: 'Rp 55.000 - Rp 95.000 / kotak',
    rasaDominan: 'Manis Harum & Kenyal',
    metodeMasak: 'Fermentasi & Panggang',
    kategori: 'Oleh-Oleh Khas',
    kategoriSlug: 'KatOlehOleh',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Sepanjang Hari',
    bahanUtama: ['Santan Kelapa', 'Daun Jeruk Purut', 'Tepung Tapioka & Sagu'],
    sameAs: ['http://dbpedia.org/resource/Bika_ambon'],
    restoran: {
      nama: 'Bika Ambon Zulaikha',
      alamat: 'Jl. Mojopahit No. 62, Medan Petisah',
      kecamatan: 'Medan Petisah',
      kecamatanSlug: 'KecMedanPetisah',
      jamBuka: '07:30 - 21:00 WIB',
      rating: 4.6,
      tahunBerdiri: 2003,
      lat: 3.5831,
      long: 98.6654,
    },
  },
  {
    slug: 'MieGomak',
    uri: 'http://kuliner-medan.org/ontology#MieGomak',
    nama: 'Mie Gomak',
    namaEn: 'Batak Andaliman Stick Noodles',
    deskripsi:
      'Mie lidi khas Batak yang dijuluki Spageti Batak dengan kuah santan kental berbumbu andaliman yang getir pedas.',
    gambar: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 4,
    kisaranHarga: 'Rp 12.000 - Rp 22.000',
    rasaDominan: 'Pedas Getir Andaliman & Gurih',
    metodeMasak: 'Rebus & Kuah Santan',
    kategori: 'Sarapan Khas',
    kategoriSlug: 'KatSarapan',
    budaya: 'Batak Toba',
    budayaSlug: 'BudayaBatakToba',
    waktuSajian: 'Sarapan (Pagi)',
    bahanUtama: ['Mie Lidi', 'Andaliman (Merica Batak)', 'Santan Kelapa'],
    sameAs: ['http://dbpedia.org/resource/Mie_gomak'],
    restoran: {
      nama: 'Mie Gomak Pasar Petisah',
      alamat: 'Jl. Razak Baru, Pasar Petisah, Medan Petisah',
      kecamatan: 'Medan Petisah',
      kecamatanSlug: 'KecMedanPetisah',
      jamBuka: '06:30 - 14:00 WIB',
      rating: 4.5,
      tahunBerdiri: 1998,
      lat: 3.5912,
      long: 98.6641,
    },
  },
  {
    slug: 'LontongMedan',
    uri: 'http://kuliner-medan.org/ontology#LontongMedan',
    nama: 'Lontong Medan',
    namaEn: 'Medan Savory Rice Cake',
    deskripsi:
      'Lontong disajikan dengan sayur labu santan, tauco udang, sambal teri kacang, mie gomak goreng, telur balado, dan kerupuk merah.',
    gambar: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 3,
    kisaranHarga: 'Rp 18.000 - Rp 32.000',
    rasaDominan: 'Gurih, Pedas & Kompleks',
    metodeMasak: 'Rebus & Tumis Tauco',
    kategori: 'Sarapan Khas',
    kategoriSlug: 'KatSarapan',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Sarapan (Pagi)',
    bahanUtama: ['Santan Kelapa', 'Tauco Medan'],
    sameAs: ['http://dbpedia.org/resource/Lontong'],
    restoran: {
      nama: 'Lontong Kak Lin',
      alamat: 'Jl. Teuku Cik Ditiro No. 8M, Medan Polonia',
      kecamatan: 'Medan Polonia',
      kecamatanSlug: 'KecMedanPolonia',
      jamBuka: '07:00 - 16:00 WIB',
      rating: 4.6,
      tahunBerdiri: 1994,
      lat: 3.5802,
      long: 98.671,
    },
  },
  {
    slug: 'KariBihunTabona',
    uri: 'http://kuliner-medan.org/ontology#KariBihunTabona',
    nama: 'Kari Bihun Tabona',
    namaEn: 'Tabona Indian-Medan Curry Vermicelli',
    deskripsi:
      'Bihun lembut disiram kuah kari kental kaya rempah India-Melayu dengan pilihan daging ayam kampung atau daging sapi empuk.',
    gambar: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 3,
    kisaranHarga: 'Rp 45.000 - Rp 65.000',
    rasaDominan: 'Kari Kental & Rempah Tajam',
    metodeMasak: 'Masak Kuah Kari',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'India-Tamil',
    budayaSlug: 'BudayaIndiaTamil',
    waktuSajian: 'Makan Siang',
    bahanUtama: ['Bihun Halus', 'Rempah Kari India-Melayu', 'Santan Kelapa', 'Daging Sapi'],
    sameAs: [],
    restoran: {
      nama: 'Rumah Makan Tabona',
      alamat: 'Jl. Mangkubumi No. 17, Aur, Medan Maimun',
      kecamatan: 'Medan Maimun',
      kecamatanSlug: 'KecMedanMaimun',
      jamBuka: '06:30 - 16:30 WIB',
      rating: 4.7,
      tahunBerdiri: 1982,
      lat: 3.5829,
      long: 98.6813,
    },
  },
  {
    slug: 'BihunBebek',
    uri: 'http://kuliner-medan.org/ontology#BihunBebek',
    nama: 'Bihun Bebek Medan',
    namaEn: 'Medan Herbal Duck Vermicelli',
    deskripsi:
      'Bihun halus disajikan dengan suwiran daging bebek empuk, bawang putih goreng, selada, dan kuah kaldu herbal obat Tionghoa yang pekat.',
    gambar: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isHalal: false,
    tingkatKepedasan: 1,
    kisaranHarga: 'Rp 55.000 - Rp 85.000',
    rasaDominan: 'Gurih Kaldu Herbal & Harum',
    metodeMasak: 'Rebus Lambat (Slow Simmer)',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'Tionghoa-Medan',
    budayaSlug: 'BudayaTionghoaMedan',
    waktuSajian: 'Makan Siang',
    bahanUtama: ['Bihun Halus', 'Daging Bebek'],
    sameAs: [],
    restoran: {
      nama: 'Bihun Bebek Asie Kumango',
      alamat: 'Jl. Kumango No. 15, Kesawan, Medan Barat',
      kecamatan: 'Medan Barat',
      kecamatanSlug: 'KecMedanBarat',
      jamBuka: '07:00 - 11:30 WIB',
      rating: 4.7,
      tahunBerdiri: 1930,
      lat: 3.5861,
      long: 98.6789,
    },
  },
];

function buildDemoFacets(dishes) {
  const tally = (extractor) => {
    const map = new Map();
    dishes.forEach((d) => {
      const item = extractor(d);
      if (!item || !item.slug) return;
      const existing = map.get(item.slug) || { slug: item.slug, label: item.label, count: 0 };
      existing.count += 1;
      map.set(item.slug, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  };

  return {
    categories: tally((d) => ({ slug: d.kategoriSlug, label: d.kategori })),
    cultures: tally((d) => ({ slug: d.budayaSlug, label: d.budaya })),
    districts: tally((d) => ({ slug: d.restoran.kecamatanSlug, label: d.restoran.kecamatan })),
    ingredients: [],
  };
}

function buildDemoGraph(focusSlug) {
  const dish = DEMO_DISHES.find((d) => d.slug === focusSlug) || DEMO_DISHES[0];
  const nodes = [
    { id: dish.slug, label: dish.nama, type: 'Kuliner' },
    { id: dish.kategoriSlug, label: dish.kategori, type: 'Kategori' },
    { id: dish.budayaSlug, label: dish.budaya, type: 'PengaruhBudaya' },
    { id: `Resto_${dish.slug}`, label: dish.restoran.nama, type: 'Restoran' },
    { id: dish.restoran.kecamatanSlug, label: dish.restoran.kecamatan, type: 'Kecamatan' },
  ];
  const edges = [
    { source: dish.slug, target: dish.kategoriSlug, predicate: 'kategori' },
    { source: dish.slug, target: dish.budayaSlug, predicate: 'pengaruhBudaya' },
    { source: dish.slug, target: `Resto_${dish.slug}`, predicate: 'rekomendasiTempat' },
    { source: `Resto_${dish.slug}`, target: dish.restoran.kecamatanSlug, predicate: 'berlokasiDi' },
  ];
  dish.bahanUtama.forEach((b, idx) => {
    const id = `Bahan_${idx}`;
    nodes.push({ id, label: b, type: 'BahanUtama' });
    edges.push({ source: dish.slug, target: id, predicate: 'memilikiBahan' });
  });
  return { nodes, edges };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [health, setHealth] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [facets, setFacets] = useState({ categories: [], cultures: [], districts: [], ingredients: [] });

  // Search filters
  const [keyword, setKeyword] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedBudaya, setSelectedBudaya] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [halalFilter, setHalalFilter] = useState('');

  const [results, setResults] = useState([]);
  const [lastSparql, setLastSparql] = useState('');
  const [loading, setLoading] = useState(false);

  // Detail modal
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishExtra, setDishExtra] = useState(null);

  // Knowledge Graph state
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [graphFocus, setGraphFocus] = useState('SotoMedan');
  const [hoveredNode, setHoveredNode] = useState(null);

  // SPARQL Playground state
  const [sparqlInput, setSparqlInput] = useState(PRESET_SPARQL[0].query);
  const [sparqlOutput, setSparqlOutput] = useState(null);
  const [sparqlError, setSparqlError] = useState('');

  // Initial load: health + facets
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => {
        setHealth(data);
        if (data.status !== 'connected') {
          setIsDemoMode(true);
          setFacets(buildDemoFacets(DEMO_DISHES));
        }
      })
      .catch(() => {
        setHealth({ status: 'disconnected', error: 'Backend server on port 5000 is not reachable.' });
        setIsDemoMode(true);
        setFacets(buildDemoFacets(DEMO_DISHES));
      });

    fetch(`${API_BASE}/facets`)
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setFacets(d);
      })
      .catch(() => {});
  }, []);

  // Reactive semantic search
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (isDemoMode) {
          const q = keyword.trim().toLowerCase();
          const filtered = DEMO_DISHES.filter((item) => {
            if (selectedKategori && item.kategoriSlug !== selectedKategori) return false;
            if (selectedBudaya && item.budayaSlug !== selectedBudaya) return false;
            if (selectedKecamatan && item.restoran.kecamatanSlug !== selectedKecamatan) return false;
            if (halalFilter === 'true' && !item.isHalal) return false;
            if (halalFilter === 'false' && item.isHalal) return false;
            if (q) {
              const haystack = [
                item.nama,
                item.namaEn,
                item.deskripsi,
                item.kategori,
                item.budaya,
                item.restoran.nama,
                item.restoran.kecamatan,
                ...item.bahanUtama,
              ]
                .join(' ')
                .toLowerCase();
              if (!haystack.includes(q)) return false;
            }
            return true;
          });
          setResults(filtered);
          setLastSparql(PRESET_SPARQL[0].query);
          return;
        }

        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (selectedKategori) params.set('kategori', selectedKategori);
        if (selectedBudaya) params.set('budaya', selectedBudaya);
        if (selectedKecamatan) params.set('kecamatan', selectedKecamatan);
        if (halalFilter) params.set('halal', halalFilter);

        const res = await fetch(`${API_BASE}/search?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setLastSparql(data.meta?.sparql || '');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setIsDemoMode(true);
          setResults(DEMO_DISHES);
        }
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, selectedKategori, selectedBudaya, selectedKecamatan, halalFilter, isDemoMode]);

  // Load Knowledge Graph when tab or focus changes
  useEffect(() => {
    if (activeTab !== 'graph') return;
    if (isDemoMode) {
      setGraphData(buildDemoGraph(graphFocus));
      return;
    }
    const url = graphFocus ? `${API_BASE}/graph?focus=${graphFocus}` : `${API_BASE}/graph`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.nodes) setGraphData(d);
      })
      .catch(() => setGraphData(buildDemoGraph(graphFocus)));
  }, [activeTab, graphFocus, isDemoMode]);

  const openDishDetail = async (dish) => {
    setSelectedDish(dish);
    setDishExtra(null);
    if (isDemoMode) {
      const recommendations = DEMO_DISHES.filter((d) => d.slug !== dish.slug)
        .filter((d) => d.budaya === dish.budaya || d.bahanUtama.some((b) => dish.bahanUtama.includes(b)))
        .map((d) => ({
          slug: d.slug,
          nama: d.nama,
          gambar: d.gambar,
          reason: d.budaya === dish.budaya ? `Same heritage: ${d.budaya}` : 'Shared primary ingredient',
        }));
      setDishExtra({ sameAs: dish.sameAs || [], recommendations });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/culinary/${dish.slug}`);
      const data = await res.json();
      setDishExtra(data);
    } catch (err) {
      console.error(err);
    }
  };

  const runCustomSparql = async () => {
    setSparqlError('');
    setSparqlOutput(null);
    if (isDemoMode) {
      setSparqlError('Connect your local Express backend + Apache Jena Fuseki (port 3030) to execute live SPARQL queries.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/sparql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sparqlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Query failed');
      setSparqlOutput(data);
    } catch (err) {
      setSparqlError(err.message);
    }
  };

  // Compute radial SVG coordinates for the Knowledge Graph Explorer
  const positionedGraph = useMemo(() => {
    const { nodes, edges } = graphData;
    if (!nodes.length) return { nodes: [], edges: [] };

    const cx = 420;
    const cy = 250;
    const centerNode = nodes.find((n) => n.id === graphFocus) || nodes[0];
    const outerNodes = nodes.filter((n) => n.id !== centerNode.id);

    const posMap = new Map();
    posMap.set(centerNode.id, { ...centerNode, x: cx, y: cy, isCenter: true });

    const radiusX = Math.min(310, 150 + outerNodes.length * 8);
    const radiusY = Math.min(195, 110 + outerNodes.length * 5);
    outerNodes.forEach((n, idx) => {
      const angle = (2 * Math.PI * idx) / outerNodes.length - Math.PI / 2;
      posMap.set(n.id, {
        ...n,
        x: cx + radiusX * Math.cos(angle),
        y: cy + radiusY * Math.sin(angle),
        isCenter: false,
      });
    });

    return {
      nodes: Array.from(posMap.values()),
      edges: edges
        .map((e) => ({
          ...e,
          from: posMap.get(e.source),
          to: posMap.get(e.target),
        }))
        .filter((e) => e.from && e.to),
    };
  }, [graphData, graphFocus]);

  const resetFilters = () => {
    setKeyword('');
    setSelectedKategori('');
    setSelectedBudaya('');
    setSelectedKecamatan('');
    setHalalFilter('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Ambient Futuristic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Navigation & Status Bar */}
        <nav className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Utensils className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-400 bg-clip-text text-transparent">
                Medan Culinary Semantic Engine
              </h1>
              <p className="text-xs text-slate-400">W3C RDF / OWL 2 / SPARQL 1.1 Knowledge Graph</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            {[
              { id: 'search', label: 'Semantic Search', icon: Search },
              { id: 'graph', label: 'Knowledge Graph', icon: Network },
              { id: 'sparql', label: 'SPARQL Lab', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Live Fuseki Triplestore Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {health?.status === 'connected' ? (
              <span className="text-slate-300">
                Fuseki Live · <strong className="text-cyan-300">{health.stats.totalTriples}</strong> triples
              </span>
            ) : (
              <span className="text-amber-300">Preview Mode (Fuseki Offline)</span>
            )}
          </div>
        </nav>

        {/* Disconnected Diagnostic Banner */}
        {health?.status === 'disconnected' && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Running in Preview Mode (Apache Jena Fuseki not detected)</p>
              <p className="text-slate-300 mt-1">
                To query all 94 entities live, start Fuseki on <code className="text-cyan-300">http://localhost:3030</code>,
                create dataset <code className="text-cyan-300">kuliner</code>, upload{' '}
                <code className="text-cyan-300">data/ontology_schema.ttl</code> &amp;{' '}
                <code className="text-cyan-300">data/kuliner_medan.ttl</code>, and run{' '}
                <code className="text-cyan-300">npm start</code>.
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: SEMANTIC SEARCH ==================== */}
        {activeTab === 'search' && (
          <div className="mt-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Explore Medan’s Culinary Graph
              </h2>
              <p className="text-slate-400 mt-3 text-sm sm:text-base">
                Search by dish name, signature spice (like <span className="text-cyan-300">Andaliman</span> or{' '}
                <span className="text-cyan-300">Tauco</span>), cultural heritage, or Medan district using real-time
                SPARQL queries.
              </p>
            </div>

            {/* Futuristic Search Bar */}
            <div className="max-w-3xl mx-auto relative mb-5">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Soto Medan, Andaliman, Santan, Batak Toba, Kesawan..."
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl py-4 pl-12 pr-28 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" /> SPARQL
              </span>
            </div>

            {/* Quick Semantic Ingredient Chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 text-xs">
              {['Andaliman', 'Santan', 'Tauco', 'Kari', 'Kesawan', 'Petisah'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setKeyword(chip)}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  #{chip}
                </button>
              ))}
            </div>

            {/* Multi-Facet Semantic Filter Bar */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 mb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedKategori('')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedKategori === ''
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Categories
                </button>
                {facets.categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedKategori(selectedKategori === cat.slug ? '' : cat.slug)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedKategori === cat.slug
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label} <span className="opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/70">
                <select
                  value={selectedBudaya}
                  onChange={(e) => setSelectedBudaya(e.target.value)}
                  className="bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  <option value="">All Cultural Heritages</option>
                  {facets.cultures.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label} ({c.count})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  <option value="">All Medan Districts</option>
                  {facets.districts.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.label} ({d.count})
                    </option>
                  ))}
                </select>

                <select
                  value={halalFilter}
                  onChange={(e) => setHalalFilter(e.target.value)}
                  className="bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  <option value="">Halal &amp; Non-Halal</option>
                  <option value="true">Halal Only</option>
                  <option value="false">Non-Halal Only</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
                >
                  Reset Filters ({results.length} found)
                </button>
              </div>
            </div>

            {/* Culinary Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.slug}
                    onClick={() => openDishDetail(item)}
                    className="group cursor-pointer bg-slate-900/60 backdrop-blur-md border border-slate-800/90 hover:border-cyan-400/60 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative bg-slate-800">
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 ${
                          item.isHalal ? 'bg-emerald-500/85 text-white' : 'bg-rose-500/85 text-white'
                        }`}
                      >
                        {item.isHalal ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        {item.isHalal ? 'Halal' : 'Non-Halal'}
                      </span>

                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                        {item.kategori}
                      </span>

                      {item.restoran.rating > 0 && (
                        <span className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold text-amber-300 bg-slate-950/80 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {item.restoran.rating}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {item.nama}
                          </h3>
                          {item.namaEn && <p className="text-xs text-slate-500">{item.namaEn}</p>}
                        </div>
                        <span className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shrink-0">
                          {item.budaya}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm mt-2.5 line-clamp-2 flex-1">{item.deskripsi}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.bahanUtama.slice(0, 3).map((b) => (
                          <span
                            key={b}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-teal-300 border border-slate-700/60"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[60%]">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{item.restoran.kecamatan}</span>
                        </span>
                        <span className="font-semibold text-slate-200">{item.kisaranHarga.split(' /')[0]}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Live Executed SPARQL Accordion */}
            {lastSparql && (
              <details className="mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <summary className="cursor-pointer text-xs font-semibold text-cyan-300 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Inspect Live SPARQL Query Executed for Current Results
                </summary>
                <pre className="mt-3 p-4 rounded-xl bg-slate-950 text-xs text-emerald-300 overflow-x-auto font-mono leading-relaxed">
                  {lastSparql}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* ==================== TAB 2: KNOWLEDGE GRAPH EXPLORER ==================== */}
        {activeTab === 'graph' && (
          <div className="mt-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div>
                <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                  <Network className="w-5 h-5" /> Interactive RDF Knowledge Graph Explorer
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Visualizing Subject–Predicate–Object triples connecting dishes, ingredients, heritage, and venues.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={graphFocus}
                  onChange={(e) => setGraphFocus(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  {(results.length ? results : DEMO_DISHES).map((r) => (
                    <option key={r.slug} value={r.slug}>
                      Focus: {r.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              {Object.entries(NODE_COLORS).map(([cls, color]) => (
                <span
                  key={cls}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  ex:{cls}
                </span>
              ))}
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
              <svg viewBox="0 0 840 500" className="w-full h-[500px] min-w-[680px]">
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                </defs>

                {positionedGraph.edges.map((e, i) => {
                  const mx = (e.from.x + e.to.x) / 2;
                  const my = (e.from.y + e.to.y) / 2;
                  const highlighted = hoveredNode === e.source || hoveredNode === e.target;
                  return (
                    <g key={i}>
                      <line
                        x1={e.from.x}
                        y1={e.from.y}
                        x2={e.to.x}
                        y2={e.to.y}
                        stroke={highlighted ? '#22d3ee' : '#334155'}
                        strokeWidth={highlighted ? 2.2 : 1.3}
                        markerEnd="url(#arrow)"
                      />
                      <rect x={mx - 48} y={my - 9} width="96" height="16" rx="4" fill="#0f172a" opacity="0.88" />
                      <text x={mx} y={my + 2} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                        ex:{e.predicate}
                      </text>
                    </g>
                  );
                })}

                {positionedGraph.nodes.map((n) => {
                  const fill = NODE_COLORS[n.type] || '#94a3b8';
                  return (
                    <g
                      key={n.id}
                      transform={`translate(${n.x}, ${n.y})`}
                      onMouseEnter={() => setHoveredNode(n.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => n.type === 'Kuliner' && setGraphFocus(n.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={n.isCenter ? 24 : 15}
                        fill={fill}
                        fillOpacity="0.22"
                        stroke={fill}
                        strokeWidth={n.isCenter ? 3 : 2}
                      />
                      <circle r={n.isCenter ? 8 : 5} fill={fill} />
                      <text
                        y={n.isCenter ? 38 : 28}
                        textAnchor="middle"
                        fill="#f1f5f9"
                        fontSize={n.isCenter ? '12' : '10'}
                        fontWeight={n.isCenter ? '700' : '500'}
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: LIVE SPARQL LAB ==================== */}
        {activeTab === 'sparql' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Layers className="w-5 h-5" /> Preset A+ SPARQL Queries
              </h2>
              <p className="text-xs text-slate-400">
                Click any query to load it into the editor and demonstrate semantic reasoning live.
              </p>
              {PRESET_SPARQL.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSparqlInput(p.query)}
                  className="w-full text-left p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 transition-all"
                >
                  <p className="text-sm font-semibold text-slate-100">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-mono">{p.query.split('SELECT')[1]}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300 font-mono">SPARQL 1.1 Query Editor</span>
                  <button
                    onClick={runCustomSparql}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-white"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Query
                  </button>
                </div>
                <textarea
                  value={sparqlInput}
                  onChange={(e) => setSparqlInput(e.target.value)}
                  rows={12}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 outline-none focus:border-cyan-400"
                />
              </div>

              {sparqlError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {sparqlError}
                </div>
              )}

              {sparqlOutput && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
                  <p className="text-xs text-slate-400 mb-3">
                    Returned <strong className="text-cyan-300">{sparqlOutput.count}</strong> rows in{' '}
                    <strong className="text-emerald-300">{sparqlOutput.elapsedMs} ms</strong>
                  </p>
                  {sparqlOutput.bindings.length > 0 ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 text-cyan-300">
                          {Object.keys(sparqlOutput.bindings[0]).map((col) => (
                            <th key={col} className="py-2 px-3 font-mono">
                              ?{col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sparqlOutput.bindings.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-800/70 hover:bg-slate-800/40">
                            {Object.keys(sparqlOutput.bindings[0]).map((col) => (
                              <td key={col} className="py-2 px-3 text-slate-200">
                                {row[col]?.value || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-xs text-slate-400">No matching triples found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== SEMANTIC DETAIL MODAL ==================== */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative h-56">
                <img src={selectedDish.gambar} alt={selectedDish.nama} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <button
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-mono text-cyan-300">ex:{selectedDish.slug}</span>
                  <h3 className="text-2xl font-extrabold text-white">{selectedDish.nama}</h3>
                  <p className="text-xs text-slate-300">{selectedDish.namaEn}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-300 leading-relaxed">{selectedDish.deskripsi}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">Cultural Heritage</span>
                    <strong className="text-amber-300 mt-0.5 block">{selectedDish.budaya}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">Spice Level</span>
                    <strong className="text-rose-400 mt-0.5 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {selectedDish.tingkatKepedasan} / 5
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">Dominant Flavor</span>
                    <strong className="text-cyan-300 mt-0.5 block">{selectedDish.rasaDominan || '-'}</strong>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Primary Ingredients (ex:memilikiBahan)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDish.bahanUtama.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setKeyword(b);
                          setSelectedDish(null);
                        }}
                        className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs hover:bg-teal-500/20"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-cyan-400 font-semibold">Recommended Venue (ex:rekomendasiTempat)</p>
                    <p className="text-base font-bold text-white">{selectedDish.restoran.nama}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedDish.restoran.alamat}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedDish.restoran.jamBuka}
                      </span>
                      {selectedDish.restoran.tahunBerdiri && (
                        <span>Est. {selectedDish.restoran.tahunBerdiri}</span>
                      )}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedDish.restoran.lat},${selectedDish.restoran.long}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Compass className="w-4 h-4" /> Open Maps
                  </a>
                </div>

                {dishExtra?.sameAs?.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Linked Open Data (owl:sameAs):</span>
                    {dishExtra.sameAs.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-300 hover:text-indigo-200 underline flex items-center gap-1"
                      >
                        {link.replace('http://dbpedia.org/resource/', 'dbr:')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}

                {dishExtra?.recommendations?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Knowledge Graph Recommendations (Shared Ingredients / Heritage)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dishExtra.recommendations.slice(0, 4).map((rec) => (
                        <div
                          key={rec.slug}
                          onClick={() => {
                            const match = results.find((r) => r.slug === rec.slug);
                            if (match) openDishDetail(match);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer"
                        >
                          <img src={rec.gambar} alt={rec.nama} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-100 truncate">{rec.nama}</p>
                            <p className="text-[11px] text-cyan-300 truncate">{rec.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}