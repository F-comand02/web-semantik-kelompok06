import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  LayoutGrid,
  History,
  Bookmark,
  Settings,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sun,
  Moon,
  FlaskConical,
  ChevronDown,
  Network,
  Terminal,
  Code2,
  Utensils,
  Flame,
  MapPin,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Star,
  Clock,
  ExternalLink,
  X,
  Database,
  Play,
  Layers,
  AlertTriangle,
  Award,
  ChefHat,
  HeartHandshake,
  GitBranch,
  Store,
  BarChart2,
  Check,
  Copy,
  Users,
  Menu,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';
const ONTOLOGY_URI = 'http://kuliner-medan.org/ontology/Kelompok06/KomA/25#';

// ============================================================================
// CUSTOM BRAND LOGO ("M" + MAGNIFYING GLASS) & ISTANA MAIMUN SILHOUETTE SVG
// ============================================================================
function MedanSearchLogo({ size = 'md', darkMode = false }) {
  const iconDim = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-6 h-6' : 'w-9 h-9';
  const textClass =
    size === 'lg'
      ? 'text-4xl sm:text-5xl font-extrabold tracking-tight'
      : size === 'sm'
      ? 'text-base font-bold tracking-tight'
      : 'text-lg font-extrabold leading-tight tracking-tight';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg viewBox="0 0 64 64" className={`${iconDim} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="medanGrad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="55%" stopColor="#1d63ed" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
        {/* Stylized Letter M */}
        <path
          d="M10 50V18C10 14.5 14.2 12.8 16.6 15.3L32 31.5L47.4 15.3C49.8 12.8 54 14.5 54 18V31"
          stroke="url(#medanGrad)"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Integrated Magnifying Glass on Bottom-Right */}
        <circle cx="44" cy="43" r="10" stroke="url(#medanGrad)" strokeWidth="5.5" fill={darkMode ? '#0f172a' : '#ffffff'} />
        <path d="M51.5 50.5L58 57" stroke="url(#medanGrad)" strokeWidth="6" strokeLinecap="round" />
      </svg>
      {size === 'md' ? (
        <div className={textClass}>
          <span className={darkMode ? 'text-white block' : 'text-slate-900 block'}>Medan</span>
          <span className="text-[#1d63ed] dark:text-sky-400 block -mt-1">Search</span>
        </div>
      ) : (
        <span className={textClass}>
          <span className={darkMode ? 'text-white' : 'text-slate-900'}>Medan </span>
          <span className="text-[#1d63ed] dark:text-sky-400">Search</span>
        </span>
      )}
    </div>
  );
}

function MaimunSilhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 520 220" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Subtle architectural silhouette inspired by Istana Maimun & Masjid Raya Medan */}
      <path d="M0 220V195H45V165H75V145C75 130 90 120 90 120C90 120 105 130 105 145V165H145V130H185V105C185 75 230 55 260 35C290 55 335 75 335 105V130H375V165H415V145C415 130 430 120 430 120C430 120 445 130 445 145V165H480V195H520V220H0Z" />
      <rect x="257" y="14" width="6" height="24" rx="3" />
      <circle cx="260" cy="12" r="5" />
      <rect x="155" y="92" width="14" height="75" rx="4" />
      <path d="M152 94C152 82 162 74 162 74C162 74 172 82 172 94H152Z" />
      <rect x="351" y="92" width="14" height="75" rx="4" />
      <path d="M348 94C348 82 358 74 358 74C358 74 368 82 368 94H348Z" />
    </svg>
  );
}

// ============================================================================
// 6 PRESET MULTI-HOP & AGGREGATION SPARQL QUERIES (Kelompok06/KomA/25#)
// ============================================================================
const PRESET_SPARQL = [
  {
    title: '1. Kuliner Halal di Sekitar Kawasan Medan Baru',
    badge: 'Rekomendasi Area',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?kuliner ?restoran ?kecamatanTetangga ?kelurahan ?harga WHERE {
  ex:KecMedanBaru ex:berbatasanDengan ?kec .
  ?kec rdfs:label ?kecamatanTetangga .
  ?r a ex:Restoran ;
     schema:name ?restoran ;
     ex:berlokasiDi ?kec ;
     ex:berlokasiDiKelurahan ?kel .
  ?kel rdfs:label ?kelurahan .
  ?k a ex:Kuliner ;
     rdfs:label ?kuliner ;
     ex:isHalal true ;
     ex:kisaranHarga ?harga ;
     ex:rekomendasiTempat ?r .
  FILTER(LANG(?kuliner) = "id")
}
ORDER BY ?kecamatanTetangga ?kuliner`,
  },
  {
    title: '2. Jaringan Cabang Restoran Populer & Lokasi Kelurahan',
    badge: 'Cabang Resmi',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?restoranInduk ?cabang ?kecamatan ?kelurahan ?lat ?long WHERE {
  ?c a ex:Restoran ;
     schema:name ?cabang ;
     ex:cabangDari ?induk ;
     ex:berlokasiDi ?kec ;
     ex:berlokasiDiKelurahan ?kel ;
     schema:geo ?geo .
  ?induk schema:name ?restoranInduk .
  ?kec rdfs:label ?kecamatan .
  ?kel rdfs:label ?kelurahan .
  ?geo schema:latitude ?lat ;
       schema:longitude ?long .
}
ORDER BY ?restoranInduk`,
  },
  {
    title: '3. Sajian Halal Berbahan Andaliman Khas Sumatera',
    badge: 'Rempah Autentik',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?kuliner ?budaya ?restoran ?harga WHERE {
  ?k a ex:Kuliner ;
     rdfs:label ?kuliner ;
     ex:isHalal true ;
     ex:memilikiBahan ex:BahanAndaliman ;
     ex:pengaruhBudaya ?b ;
     ex:kisaranHarga ?harga ;
     ex:rekomendasiTempat ?r .
  FILTER(LANG(?kuliner) = "id")
  ?b rdfs:label ?budaya . FILTER(LANG(?budaya) = "id")
  ?r schema:name ?restoran .
}`,
  },
  {
    title: '4. Destinasi Kuliner Legendaris Medan (Berdiri Sebelum 1985)',
    badge: 'Kuliner Legendaris',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?restoran ?tahunBerdiri ?kuliner ?kecamatan WHERE {
  ?r a ex:Restoran ;
     schema:name ?restoran ;
     ex:tahunBerdiri ?tahunBerdiri ;
     ex:berlokasiDi ?kec .
  FILTER(?tahunBerdiri < 1985)
  ?kec rdfs:label ?kecamatan .
  ?k ex:rekomendasiTempat ?r ;
     rdfs:label ?kuliner .
  FILTER(LANG(?kuliner) = "id")
}
ORDER BY ASC(?tahunBerdiri)`,
  },
  {
    title: '5. Ragam Kuliner & Kisaran Harga Berdasarkan Akar Budaya',
    badge: 'Wawasan Budaya',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?budaya (COUNT(DISTINCT ?k) AS ?totalKuliner) (ROUND(AVG(?hMin)) AS ?rataHargaMinIDR) WHERE {
  ?k a ex:Kuliner ;
     ex:pengaruhBudaya ?b ;
     ex:hargaMin ?hMin .
  ?b rdfs:label ?budaya .
  FILTER(LANG(?budaya) = "id")
}
GROUP BY ?budaya
ORDER BY DESC(?totalKuliner)`,
  },
  {
    title: '6. Sebaran Destinasi Kuliner di 21 Kecamatan Kota Medan',
    badge: 'Peta Wilayah',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?kecamatan (COUNT(DISTINCT ?kel) AS ?totalKelurahan) (COUNT(DISTINCT ?r) AS ?totalRestoran) WHERE {
  ?kec a ex:Kecamatan ;
       rdfs:label ?kecamatan .
  OPTIONAL { ?kel a ex:Kelurahan ; ex:bagianDariKecamatan ?kec . }
  OPTIONAL { ?r a ex:Restoran ; ex:berlokasiDi ?kec . }
}
GROUP BY ?kecamatan
ORDER BY DESC(?totalRestoran) DESC(?totalKelurahan)`,
  },
];

const NODE_COLORS = {
  Kuliner: '#1d63ed',
  Kategori: '#7c3aed',
  PengaruhBudaya: '#d97706',
  BahanUtama: '#059669',
  Restoran: '#e11d48',
  Kecamatan: '#0284c7',
  Kelurahan: '#4f46e5',
  KawasanKuliner: '#db2777',
  TeknikMasak: '#ea580c',
  ProfilRasa: '#ca8a04',
  PenghargaanKuliner: '#9333ea',
};

const NODE_LABELS = {
  Kuliner: 'Hidangan',
  Kategori: 'Kategori',
  PengaruhBudaya: 'Budaya',
  BahanUtama: 'Bahan & Rempah',
  Restoran: 'Tempat Makan',
  Kecamatan: 'Kecamatan',
  Kelurahan: 'Kelurahan',
  KawasanKuliner: 'Kawasan Kuliner',
  TeknikMasak: 'Teknik Masak',
  ProfilRasa: 'Profil Rasa',
  PenghargaanKuliner: 'Penghargaan',
};

const TEAM_MEMBERS = [
  { name: 'Farel Yamotaro Hia', role: 'Founder & Product Lead' },
  { name: 'Ray Nathan Geereno Saragih', role: 'Head of Culinary Data & Curation' },
  { name: 'Naufal Muhammad Dzaki', role: 'Lead Search & Backend Engineer' },
  { name: 'William Fransisco Sihotang', role: 'Lead UI/UX & Product Designer' },
  { name: 'Yabesh Day Siahaan', role: 'Quality Assurance & Content Strategist' },
];

const DEMO_DISHES = [
  {
    slug: 'SotoMedan',
    uri: `${ONTOLOGY_URI}SotoMedan`,
    nama: 'Soto Medan',
    namaEn: 'Medan Coconut Beef Soup',
    deskripsi:
      'Soto berkuah santan kental kuning kehijauan dengan rempah jintan, kapulaga, dan pilihan daging sapi, ayam, atau udang.',
    gambar: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 2,
    kisaranHarga: 'Rp 35.000 - Rp 55.000',
    rasaDominan: 'Gurih Santan & Creamy',
    metodeMasak: 'Rebus & Masak Kuah',
    teknikSlug: 'TeknikRebusKuah',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Makan Siang',
    penghargaan: 'Warisan Budaya Takbenda Indonesia (Kemendikbud)',
    bahanUtama: ['Santan Kelapa', 'Daging Sapi', 'Daun Jeruk Purut', 'Serai Wangi'],
    sameAs: ['http://dbpedia.org/resource/Soto_Medan'],
    pairings: [{ slug: 'SateKerangMedan', nama: 'Sate Kerang Medan' }],
    branches: [
      {
        slug: 'CabangSotoSinarPagiRingRoad',
        nama: 'Soto Medan Sinar Pagi Cab. Ring Road',
        alamat: 'Jl. Ring Road Gagak Hitam No. 30, Sunggal',
        kecamatan: 'Medan Sunggal',
        kelurahan: 'Kelurahan Sunggal',
        rating: 4.7,
      },
    ],
    restoran: {
      nama: 'Soto Medan Sinar Pagi',
      alamat: 'Jl. Sei Deli No. 2D, Silalas, Medan Barat',
      kecamatan: 'Medan Barat',
      kecamatanSlug: 'KecMedanBarat',
      kelurahan: 'Kelurahan Silalas',
      kawasan: 'Kawasan Heritage Kesawan',
      kawasanSlug: 'KawasanKesawan',
      jamBuka: '07:00 - 15:30 WIB',
      rating: 4.7,
      tahunBerdiri: 1962,
      lat: 3.5975,
      long: 98.6722,
    },
  },
  {
    slug: 'BikaAmbon',
    uri: `${ONTOLOGY_URI}BikaAmbon`,
    nama: 'Bika Ambon',
    namaEn: 'Bika Ambon Honeycomb Cake',
    deskripsi:
      'Kue khas Medan berwarna kuning keemasan bertekstur bersarang kenyal dengan aroma harum daun jeruk purut serta serai.',
    gambar: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 0,
    kisaranHarga: 'Rp 55.000 - Rp 95.000',
    rasaDominan: 'Manis Legit & Harum',
    metodeMasak: 'Panggang Oven / Loyang',
    teknikSlug: 'TeknikPanggangOven',
    kategori: 'Oleh-Oleh Khas',
    kategoriSlug: 'KatOlehOleh',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Sepanjang Hari',
    penghargaan: 'Top Oleh-Oleh Bandara Kualanamu',
    bahanUtama: ['Santan Kelapa', 'Daun Jeruk Purut', 'Tepung Tapioka & Sagu', 'Serai Wangi'],
    sameAs: ['http://dbpedia.org/resource/Bika_ambon'],
    pairings: [],
    branches: [
      {
        slug: 'CabangZulaikhaAmplas',
        nama: 'Bika Ambon Zulaikha Cab. Amplas',
        alamat: 'Jl. Sisingamangaraja KM 6.5, Harjosari II',
        kecamatan: 'Medan Amplas',
        kelurahan: 'Kelurahan Harjosari II',
        rating: 4.6,
      },
    ],
    restoran: {
      nama: 'Bika Ambon Zulaikha',
      alamat: 'Jl. Mojopahit No. 62, Petisah Tengah, Medan Petisah',
      kecamatan: 'Medan Petisah',
      kecamatanSlug: 'KecMedanPetisah',
      kelurahan: 'Kelurahan Petisah Tengah',
      kawasan: 'Sentra Kuliner Pasar Petisah & Mojopahit',
      kawasanSlug: 'KawasanPasarPetisah',
      jamBuka: '07:30 - 21:00 WIB',
      rating: 4.6,
      tahunBerdiri: 2003,
      lat: 3.5831,
      long: 98.6654,
    },
  },
  {
    slug: 'MieGomak',
    uri: `${ONTOLOGY_URI}MieGomak`,
    nama: 'Mie Gomak',
    namaEn: 'Batak Andaliman Stick Noodles',
    deskripsi:
      'Mie lidi khas Batak yang dijuluki Spageti Batak dengan kuah santan kental berbumbu andaliman yang getir pedas.',
    gambar: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 4,
    kisaranHarga: 'Rp 12.000 - Rp 22.000',
    rasaDominan: 'Pedas Getir Andaliman',
    metodeMasak: 'Rebus & Masak Kuah',
    teknikSlug: 'TeknikRebusKuah',
    kategori: 'Sarapan Khas',
    kategoriSlug: 'KatSarapan',
    budaya: 'Batak Toba',
    budayaSlug: 'BudayaBatakToba',
    waktuSajian: 'Sarapan (Pagi)',
    penghargaan: 'Ikon Medan Culinary Festival',
    bahanUtama: ['Mie Lidi', 'Andaliman (Merica Batak)', 'Santan Kelapa', 'Kunyit Segar'],
    sameAs: ['http://dbpedia.org/resource/Mie_gomak'],
    pairings: [],
    branches: [],
    restoran: {
      nama: 'Mie Gomak Pasar Petisah',
      alamat: 'Jl. Razak Baru, Petisah Tengah, Medan Petisah',
      kecamatan: 'Medan Petisah',
      kecamatanSlug: 'KecMedanPetisah',
      kelurahan: 'Kelurahan Petisah Tengah',
      kawasan: 'Sentra Kuliner Pasar Petisah & Mojopahit',
      kawasanSlug: 'KawasanPasarPetisah',
      jamBuka: '06:30 - 14:00 WIB',
      rating: 4.5,
      tahunBerdiri: 1998,
      lat: 3.5912,
      long: 98.6641,
    },
  },
  {
    slug: 'LontongMedan',
    uri: `${ONTOLOGY_URI}LontongMedan`,
    nama: 'Lontong Medan',
    namaEn: 'Medan Savory Rice Cake',
    deskripsi:
      'Lontong disajikan dengan sayur labu santan, tauco udang, sambal teri kacang, mie gomak goreng, telur balado, dan kerupuk merah.',
    gambar: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 3,
    kisaranHarga: 'Rp 18.000 - Rp 32.000',
    rasaDominan: 'Gurih Santan & Creamy',
    metodeMasak: 'Rebus & Masak Kuah',
    teknikSlug: 'TeknikRebusKuah',
    kategori: 'Sarapan Khas',
    kategoriSlug: 'KatSarapan',
    budaya: 'Melayu Deli',
    budayaSlug: 'BudayaMelayu',
    waktuSajian: 'Sarapan (Pagi)',
    penghargaan: 'Ikon Medan Culinary Festival',
    bahanUtama: ['Santan Kelapa', 'Tauco Medan', 'Ikan Teri Medan', 'Kacang Tanah Sangrai'],
    sameAs: ['http://dbpedia.org/resource/Lontong'],
    pairings: [{ slug: 'SateKerangMedan', nama: 'Sate Kerang Medan' }],
    branches: [
      {
        slug: 'CabangLontongKakLinMansyur',
        nama: 'Lontong Kak Lin Cab. Dr. Mansyur',
        alamat: 'Jl. Dr. Mansyur No. 48, Merdeka',
        kecamatan: 'Medan Baru',
        kelurahan: 'Kelurahan Merdeka',
        rating: 4.6,
      },
    ],
    restoran: {
      nama: 'Lontong Kak Lin',
      alamat: 'Jl. Teuku Cik Ditiro No. 8M, Madras Hulu, Medan Polonia',
      kecamatan: 'Medan Polonia',
      kecamatanSlug: 'KecMedanPolonia',
      kelurahan: 'Kelurahan Madras Hulu',
      kawasan: 'Kampung Madras (Little India)',
      kawasanSlug: 'KawasanKampungMadras',
      jamBuka: '07:00 - 16:00 WIB',
      rating: 4.6,
      tahunBerdiri: 1994,
      lat: 3.5802,
      long: 98.671,
    },
  },
  {
    slug: 'KariBihunTabona',
    uri: `${ONTOLOGY_URI}KariBihunTabona`,
    nama: 'Kari Bihun Tabona',
    namaEn: 'Tabona Indian-Medan Curry Vermicelli',
    deskripsi:
      'Bihun lembut disiram kuah kari kental kaya rempah India-Melayu dengan pilihan daging ayam kampung atau daging sapi empuk.',
    gambar: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isHalal: true,
    tingkatKepedasan: 3,
    kisaranHarga: 'Rp 45.000 - Rp 65.000',
    rasaDominan: 'Rempah Kari Tajam',
    metodeMasak: 'Rebus & Masak Kuah',
    teknikSlug: 'TeknikRebusKuah',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'India-Tamil',
    budayaSlug: 'BudayaIndiaTamil',
    waktuSajian: 'Makan Siang',
    penghargaan: 'Warisan Kuliner Istana Maimun Kesultanan Deli',
    bahanUtama: ['Bihun Halus', 'Rempah Kari India-Melayu', 'Santan Kelapa', 'Daging Sapi'],
    sameAs: [],
    pairings: [],
    branches: [],
    restoran: {
      nama: 'Rumah Makan Tabona',
      alamat: 'Jl. Mangkubumi No. 17, Aur, Medan Maimun',
      kecamatan: 'Medan Maimun',
      kecamatanSlug: 'KecMedanMaimun',
      kelurahan: 'Kelurahan Aur',
      kawasan: 'Kawasan Istana Maimun & Masjid Raya',
      kawasanSlug: 'KawasanIstanaMaimun',
      jamBuka: '06:30 - 16:30 WIB',
      rating: 4.7,
      tahunBerdiri: 1982,
      lat: 3.5829,
      long: 98.6813,
    },
  },
  {
    slug: 'BihunBebek',
    uri: `${ONTOLOGY_URI}BihunBebek`,
    nama: 'Bihun Bebek Medan',
    namaEn: 'Medan Herbal Duck Vermicelli',
    deskripsi:
      'Bihun halus disajikan dengan suwiran daging bebek empuk, bawang putih goreng, selada, dan kuah kaldu herbal obat Tionghoa yang pekat.',
    gambar: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isHalal: false,
    tingkatKepedasan: 1,
    kisaranHarga: 'Rp 55.000 - Rp 85.000',
    rasaDominan: 'Gurih Kaldu Bening & Herbal',
    metodeMasak: 'Rebus & Masak Kuah',
    teknikSlug: 'TeknikRebusKuah',
    kategori: 'Makanan Berat',
    kategoriSlug: 'KatMakananBerat',
    budaya: 'Tionghoa-Medan',
    budayaSlug: 'BudayaTionghoaMedan',
    waktuSajian: 'Makan Siang',
    penghargaan: 'Kurasi Kuliner Kesawan City Walk',
    bahanUtama: ['Bihun Halus', 'Daging Bebek', 'Kecap Asin & Minyak Wijen'],
    sameAs: [],
    pairings: [],
    branches: [],
    restoran: {
      nama: 'Bihun Bebek Asie Kumango',
      alamat: 'Jl. Kumango No. 15, Kesawan, Medan Barat',
      kecamatan: 'Medan Barat',
      kecamatanSlug: 'KecMedanBarat',
      kelurahan: 'Kelurahan Kesawan',
      kawasan: 'Kawasan Heritage Kesawan',
      kawasanSlug: 'KawasanKesawan',
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
    hubs: tally((d) => ({ slug: d.restoran.kawasanSlug, label: d.restoran.kawasan })),
    techniques: tally((d) => ({ slug: d.teknikSlug, label: d.metodeMasak })),
    ingredients: [],
  };
}

function buildDemoGraph(focusSlug) {
  const dish = DEMO_DISHES.find((d) => d.slug === focusSlug) || DEMO_DISHES[0];
  const restoId = `Resto_${dish.slug}`;
  const nodes = [
    { id: dish.slug, label: dish.nama, type: 'Kuliner' },
    { id: dish.kategoriSlug, label: dish.kategori, type: 'Kategori' },
    { id: dish.budayaSlug, label: dish.budaya, type: 'PengaruhBudaya' },
    { id: dish.teknikSlug, label: dish.metodeMasak, type: 'TeknikMasak' },
    { id: `Award_${dish.slug}`, label: dish.penghargaan.slice(0, 26), type: 'PenghargaanKuliner' },
    { id: restoId, label: dish.restoran.nama, type: 'Restoran' },
    { id: dish.restoran.kecamatanSlug, label: dish.restoran.kecamatan, type: 'Kecamatan' },
    { id: dish.restoran.kawasanSlug, label: dish.restoran.kawasan.slice(0, 24), type: 'KawasanKuliner' },
  ];
  const edges = [
    { source: dish.slug, target: dish.kategoriSlug, predicate: 'kategori' },
    { source: dish.slug, target: dish.budayaSlug, predicate: 'pengaruhBudaya' },
    { source: dish.slug, target: dish.teknikSlug, predicate: 'teknikMasak' },
    { source: dish.slug, target: `Award_${dish.slug}`, predicate: 'memilikiPenghargaan' },
    { source: dish.slug, target: restoId, predicate: 'rekomendasiTempat' },
    { source: restoId, target: dish.restoran.kecamatanSlug, predicate: 'berlokasiDi' },
    { source: restoId, target: dish.restoran.kawasanSlug, predicate: 'beradaDiKawasan' },
  ];
  dish.bahanUtama.slice(0, 3).forEach((b, idx) => {
    const id = `Bahan_${idx}`;
    nodes.push({ id, label: b, type: 'BahanUtama' });
    edges.push({ source: dish.slug, target: id, predicate: 'memilikiBahan' });
  });
  return { nodes, edges };
}

export default function App() {
  // Active View: 'beranda' | 'eksplorasi' | 'kategori' | 'riwayat' | 'favorit' | 'pengaturan' | 'graph' | 'sparql' | 'api'
  const [activeView, setActiveView] = useState('beranda');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advancedMenuOpen, setAdvancedMenuOpen] = useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [health, setHealth] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [facets, setFacets] = useState({
    categories: [],
    cultures: [],
    districts: [],
    hubs: [],
    techniques: [],
    ingredients: [],
  });

  // Search & Filter states
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedBudaya, setSelectedBudaya] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [includeNeighbors, setIncludeNeighbors] = useState(false);
  const [selectedKawasan, setSelectedKawasan] = useState('');
  const [selectedTeknik, setSelectedTeknik] = useState('');
  const [halalFilter, setHalalFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const [results, setResults] = useState([]);
  const [lastSparql, setLastSparql] = useState('');
  const [loading, setLoading] = useState(false);

  // Favorites & Search History
  const [favorites, setFavorites] = useState(['SotoMedan', 'BikaAmbon', 'MieGomak']);
  const [searchHistory, setSearchHistory] = useState([
    { query: 'Soto Medan', time: 'Baru saja', filter: 'Semua Kategori' },
    { query: 'Andaliman', time: '10 menit lalu', filter: 'Rempah Utama' },
    { query: 'Kesawan', time: '25 menit lalu', filter: 'Kawasan Heritage' },
  ]);

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
  const [copiedText, setCopiedText] = useState('');

  // Fetch health & facets on mount
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

  // Reactive SPARQL query execution
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setVisibleCount(12);
      try {
        if (isDemoMode) {
          const q = keyword.trim().toLowerCase();
          const filtered = DEMO_DISHES.filter((item) => {
            if (selectedKategori && item.kategoriSlug !== selectedKategori) return false;
            if (selectedBudaya && item.budayaSlug !== selectedBudaya) return false;
            if (selectedKecamatan && item.restoran.kecamatanSlug !== selectedKecamatan) return false;
            if (selectedKawasan && item.restoran.kawasanSlug !== selectedKawasan) return false;
            if (selectedTeknik && item.teknikSlug !== selectedTeknik) return false;
            if (halalFilter === 'true' && !item.isHalal) return false;
            if (halalFilter === 'false' && item.isHalal) return false;
            if (q) {
              const haystack = [
                item.nama,
                item.namaEn,
                item.deskripsi,
                item.kategori,
                item.budaya,
                item.metodeMasak,
                item.restoran.nama,
                item.restoran.kecamatan,
                item.restoran.kelurahan,
                item.restoran.kawasan,
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
        if (selectedKecamatan) {
          params.set('kecamatan', selectedKecamatan);
          if (includeNeighbors) params.set('includeNeighbors', 'true');
        }
        if (selectedKawasan) params.set('kawasan', selectedKawasan);
        if (selectedTeknik) params.set('teknik', selectedTeknik);
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
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    keyword,
    selectedKategori,
    selectedBudaya,
    selectedKecamatan,
    includeNeighbors,
    selectedKawasan,
    selectedTeknik,
    halalFilter,
    isDemoMode,
  ]);

  // Load Knowledge Graph when active
  useEffect(() => {
    if (activeView !== 'graph') return;
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
  }, [activeView, graphFocus, isDemoMode]);

  const executeSearchSubmit = (e, overrideQuery) => {
    if (e) e.preventDefault();
    const term = overrideQuery !== undefined ? overrideQuery : searchInput;
    setSearchInput(term);
    setKeyword(term);
    if (term.trim()) {
      setSearchHistory((prev) => [
        {
          query: term.trim(),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          filter: selectedKategori || selectedKecamatan || 'Pencarian Kuliner',
        },
        ...prev.filter((h) => h.query.toLowerCase() !== term.trim().toLowerCase()).slice(0, 9),
      ]);
    }
  };

  const toggleFavorite = (e, slug) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

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
          reason: d.budaya === dish.budaya ? `Budaya sama: ${d.budaya}` : 'Bahan utama sama',
        }));
      setDishExtra({
        sameAs: dish.sameAs || [],
        awards: dish.penghargaan ? [dish.penghargaan] : [],
        pairings: dish.pairings || [],
        branches: dish.branches || [],
        recommendations,
      });
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
      setSparqlError(
        'Jalankan backend Express + Apache Jena Fuseki (port 3030) secara lokal untuk mengeksekusi kueri SPARQL 1.1 secara live.'
      );
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

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 1800);
  };

  const positionedGraph = useMemo(() => {
    const { nodes, edges } = graphData;
    if (!nodes.length) return { nodes: [], edges: [] };

    const cx = 440;
    const cy = 270;
    const centerNode = nodes.find((n) => n.id === graphFocus) || nodes[0];
    const outerNodes = nodes.filter((n) => n.id !== centerNode.id);

    const posMap = new Map();
    posMap.set(centerNode.id, { ...centerNode, x: cx, y: cy, isCenter: true });

    if (outerNodes.length <= 9) {
      const rx = 310;
      const ry = 195;
      outerNodes.forEach((n, idx) => {
        const angle = (2 * Math.PI * idx) / outerNodes.length - Math.PI / 2;
        posMap.set(n.id, {
          ...n,
          x: cx + rx * Math.cos(angle),
          y: cy + ry * Math.sin(angle),
          isCenter: false,
        });
      });
    } else {
      const innerTypes = new Set(['Kategori', 'PengaruhBudaya', 'Restoran', 'TeknikMasak', 'ProfilRasa']);
      const inner = outerNodes.filter((n) => innerTypes.has(n.type));
      const outer = outerNodes.filter((n) => !innerTypes.has(n.type));

      inner.forEach((n, idx) => {
        const angle = (2 * Math.PI * idx) / Math.max(1, inner.length) - Math.PI / 2;
        posMap.set(n.id, {
          ...n,
          x: cx + 185 * Math.cos(angle),
          y: cy + 120 * Math.sin(angle),
          isCenter: false,
        });
      });

      outer.forEach((n, idx) => {
        const angle = (2 * Math.PI * idx) / Math.max(1, outer.length) - Math.PI / 2 + 0.18;
        posMap.set(n.id, {
          ...n,
          x: cx + 365 * Math.cos(angle),
          y: cy + 225 * Math.sin(angle),
          isCenter: false,
        });
      });
    }

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
    setSearchInput('');
    setKeyword('');
    setSelectedKategori('');
    setSelectedBudaya('');
    setSelectedKecamatan('');
    setIncludeNeighbors(false);
    setSelectedKawasan('');
    setSelectedTeknik('');
    setHalalFilter('');
  };

  const hasActiveFilter = Boolean(
    keyword || selectedKategori || selectedBudaya || selectedKecamatan || selectedKawasan || selectedTeknik || halalFilter
  );

  const displayedResults = results.slice(0, visibleCount);
  const favoriteDishes = results.filter((d) => favorites.includes(d.slug));

  const sidebarItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'eksplorasi', label: 'Eksplorasi', icon: Compass },
    { id: 'kategori', label: 'Kategori', icon: LayoutGrid },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'favorit', label: 'Favorit', icon: Bookmark, count: favorites.length },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  // Reusable Culinary Card Renderer
  const renderDishCard = (item) => {
    const isFav = favorites.includes(item.slug);
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={item.slug}
        onClick={() => openDishDetail(item)}
        className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all flex flex-col ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 hover:border-sky-500/60 shadow-lg'
            : 'bg-white border-slate-200/80 hover:border-blue-400/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_30px_rgba(29,99,237,0.10)]'
        }`}
      >
        <div className="h-44 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
          <img
            src={item.gambar}
            alt={item.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Halal Badge */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm ${
              item.isHalal ? 'bg-emerald-500/95 text-white' : 'bg-rose-500/95 text-white'
            }`}
          >
            {item.isHalal ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {item.isHalal ? 'Halal' : 'Non-Halal'}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={(e) => toggleFavorite(e, item.slug)}
            title="Simpan ke Favorit"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav
                ? 'bg-[#1d63ed] text-white shadow-md'
                : 'bg-white/85 text-slate-700 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
          </button>

          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/90 text-[#1d63ed] dark:text-sky-300 text-[11px] font-semibold shadow-sm">
            {item.kategori}
          </span>

          {item.restoran.rating > 0 && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-white/95 px-2 py-1 rounded-lg shadow-sm">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {item.restoran.rating}
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={`text-base font-bold transition-colors ${
                  darkMode
                    ? 'text-slate-100 group-hover:text-sky-400'
                    : 'text-slate-900 group-hover:text-[#1d63ed]'
                }`}
              >
                {item.nama}
              </h3>
              {item.namaEn && <p className="text-[11px] text-slate-400">{item.namaEn}</p>}
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0 ${
                darkMode
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/70'
              }`}
            >
              {item.budaya}
            </span>
          </div>

          <p className={`text-xs mt-2 line-clamp-2 flex-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {item.deskripsi}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.bahanUtama.slice(0, 3).map((b) => (
              <span
                key={b}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  darkMode
                    ? 'bg-slate-800 text-sky-300'
                    : 'bg-[#eef4ff] text-[#1d63ed]'
                }`}
              >
                {b}
              </span>
            ))}
          </div>

          <div
            className={`mt-3.5 pt-3 border-t flex items-center justify-between text-xs ${
              darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1 truncate max-w-[58%]">
              <MapPin className="w-3.5 h-3.5 text-[#1d63ed] shrink-0" />
              <span className="truncate">{item.restoran.kecamatan}</span>
            </span>
            <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {item.kisaranHarga.split(' /')[0]}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 font-sans ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f6f9ff] text-slate-800'
      }`}
    >
      {/* ==================== LEFT SIDEBAR (DESKTOP) ==================== */}
      <aside
        className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r transition-colors ${
          darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200/80'
        }`}
      >
        <div className="p-6">
          <button
            onClick={() => {
              resetFilters();
              setActiveView('beranda');
            }}
            className="text-left focus:outline-none"
          >
            <MedanSearchLogo size="md" darkMode={darkMode} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? darkMode
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'bg-[#e8f0fe] text-[#1d63ed] font-semibold'
                    : darkMode
                    ? 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#1d63ed] dark:text-sky-400' : ''}`} />
                  {item.label}
                </span>
                {item.count > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      active
                        ? 'bg-[#1d63ed] text-white'
                        : darkMode
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Promo Card ("Pencarian Cerdas") */}
        <div className="p-4">
          <div
            onClick={() => setActiveView('graph')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden group ${
              darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-sky-500/50'
                : 'bg-gradient-to-br from-[#eef4ff] to-[#e0ecff] border-blue-200/60 hover:shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-3">
              <Network className="w-5 h-5 text-[#1d63ed] dark:text-sky-400" />
            </div>
            <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pencarian Cerdas</h4>
            <p className={`text-xs mt-1 leading-relaxed pr-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Lebih akurat, sesuai seleramu.
            </p>
            <span className="absolute bottom-3.5 right-3.5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-[#1d63ed] dark:text-sky-400 flex items-center justify-center shadow-sm group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </aside>

      {/* ==================== MOBILE SIDEBAR DRAWER ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-64 h-full p-5 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <MedanSearchLogo size="md" darkMode={darkMode} />
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1.5 flex-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-[#e8f0fe] text-[#1d63ed] font-semibold'
                          : darkMode
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Subtle Ambient Background & Istana Maimun Architectural Watermark */}
        <div className="pointer-events-none fixed inset-0 lg:left-64 overflow-hidden">
          <div
            className={`absolute -top-24 left-1/4 w-[540px] h-[360px] rounded-full blur-3xl ${
              darkMode ? 'bg-sky-500/10' : 'bg-blue-200/35'
            }`}
          />
          <MaimunSilhouette
            className={`absolute right-0 top-24 w-[520px] h-auto ${
              darkMode ? 'text-slate-800/40' : 'text-blue-900/[0.055]'
            }`}
          />
        </div>

        {/* TOP BAR (Theme Toggle, Fitur Lanjutan Dropdown, Kelompok 06 Avatar) */}
        <header className="relative z-20 flex items-center justify-between lg:justify-end px-4 sm:px-8 py-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`lg:hidden p-2 rounded-xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200/90 text-slate-600 hover:text-[#1d63ed] shadow-xs'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`h-5 w-px ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* "Fitur Lanjutan v" Dropdown Menu (Matches Reference Image!) */}
            <div className="relative">
              <button
                onClick={() => {
                  setAdvancedMenuOpen((o) => !o);
                  setTeamMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700 text-sky-300 hover:border-sky-500'
                    : 'bg-white border-blue-200/90 text-[#1d63ed] hover:bg-blue-50/60 shadow-xs'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>Fitur Lanjutan</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advancedMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {advancedMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    className={`absolute right-0 mt-2 w-56 rounded-2xl border p-1.5 shadow-xl z-40 ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200/90'
                    }`}
                  >
                    {[
                      { id: 'graph', label: 'Jejaring Kuliner', sub: 'Peta koneksi rasa & bahan', icon: Network },
                      { id: 'sparql', label: 'Wawasan & Analisis', sub: 'Filter mendalam & statistik', icon: Terminal },
                      { id: 'api', label: 'Portal Mitra & API', sub: 'Integrasi data kuliner Medan', icon: Code2 },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveView(opt.id);
                            setAdvancedMenuOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                            darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#eef4ff]'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#1d63ed] dark:text-sky-400 mt-0.5 shrink-0" />
                          <div>
                            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                              {opt.label}
                            </p>
                            <p className="text-[11px] text-slate-400">{opt.sub}</p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Medan Search Team Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setTeamMenuOpen((o) => !o);
                  setAdvancedMenuOpen(false);
                }}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-[#1d63ed] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  MS
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <AnimatePresence>
                {teamMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className={`absolute right-0 mt-2 w-72 rounded-2xl border p-4 shadow-xl z-40 ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1d63ed] dark:text-sky-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Tim Medan Search
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Platform Direktori &amp; Eksplorasi Kuliner Medan</p>
                    <div className="space-y-2">
                      {TEAM_MEMBERS.map((m) => (
                        <div key={m.name} className="text-xs border-t border-slate-100 dark:border-slate-800 pt-1.5">
                          <p className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {m.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{m.role}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ==================== VIEW 1: BERANDA (MINIMALIST SEARCH HERO) ==================== */}
        {activeView === 'beranda' && (
          <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 pt-4 pb-12">
            {/* Hero Title & Subtitle */}
            <div className="text-center max-w-2xl mx-auto mt-4 mb-8">
              <div className="flex justify-center mb-3">
                <MedanSearchLogo size="lg" darkMode={darkMode} />
              </div>
              <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Temukan cita rasa autentik, kuliner legendaris, dan destinasi makan terbaik di seluruh penjuru Kota Medan.
              </p>
            </div>

            {/* Pill Search Bar */}
            <form onSubmit={executeSearchSubmit} className="max-w-3xl mx-auto mb-5">
              <div
                className={`flex items-center rounded-full border p-1.5 pl-5 transition-all ${
                  darkMode
                    ? 'bg-slate-900/95 border-slate-700 focus-within:border-sky-400 shadow-lg'
                    : 'bg-white border-slate-200/90 focus-within:border-blue-400 shadow-[0_10px_35px_rgba(29,99,237,0.08)]'
                }`}
              >
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setKeyword(e.target.value);
                  }}
                  placeholder="Mau makan apa hari ini? Cari Soto Medan, Bika Ambon, Andaliman, Kesawan..."
                  className={`flex-1 bg-transparent text-sm sm:text-base outline-none ${
                    darkMode ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setKeyword('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer((s) => !s)}
                  title="Filter Pencarian"
                  className={`p-2.5 rounded-full mx-1 transition-colors ${
                    showFilterDrawer || hasActiveFilter
                      ? 'bg-[#e8f0fe] text-[#1d63ed]'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1d63ed] to-[#1e40af] hover:from-blue-500 hover:to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <span>Cari</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Pencarian Populer Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
              <span className={`font-semibold flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Pencarian Populer:
              </span>
              {['Soto Medan', 'Bika Ambon', 'Mie Gomak', 'Andaliman', 'Kesawan', 'Lontong Medan'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => executeSearchSubmit(null, chip)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    keyword.toLowerCase() === chip.toLowerCase()
                      ? 'bg-[#1d63ed] text-white shadow-xs'
                      : darkMode
                      ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                      : 'bg-[#e9effa] text-slate-700 hover:bg-[#dce6f9] hover:text-[#1d63ed]'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Expandable Multi-Facet Semantic Filter Bar */}
            <AnimatePresence>
              {showFilterDrawer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div
                    className={`rounded-2xl border p-4 space-y-3 ${
                      darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <select
                        value={selectedKategori}
                        onChange={(e) => setSelectedKategori(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua Kategori</option>
                        {facets.categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label} ({c.count})
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedBudaya}
                        onChange={(e) => setSelectedBudaya(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua Budaya</option>
                        {facets.cultures.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label} ({c.count})
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedKecamatan}
                        onChange={(e) => {
                          setSelectedKecamatan(e.target.value);
                          if (!e.target.value) setIncludeNeighbors(false);
                        }}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua 21 Kecamatan</option>
                        {facets.districts.map((d) => (
                          <option key={d.slug} value={d.slug}>
                            {d.label} ({d.count})
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedKawasan}
                        onChange={(e) => setSelectedKawasan(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua Kawasan Kuliner</option>
                        {(facets.hubs || []).map((h) => (
                          <option key={h.slug} value={h.slug}>
                            {h.label} ({h.count})
                          </option>
                        ))}
                      </select>

                      <select
                        value={halalFilter}
                        onChange={(e) => setHalalFilter(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Halal &amp; Non-Halal</option>
                        <option value="true">Halal Saja</option>
                        <option value="false">Non-Halal Saja</option>
                      </select>
                    </div>

                    {selectedKecamatan && (
                      <label className="flex items-center gap-2 text-xs text-[#1d63ed] dark:text-sky-400 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={includeNeighbors}
                          onChange={(e) => setIncludeNeighbors(e.target.checked)}
                          className="accent-[#1d63ed]"
                        />
                        <span>
                          <strong>Perluas Radius Lokasi</strong> — tampilkan juga rekomendasi kuliner di kecamatan sekitar
                        </span>
                      </label>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Culinary Results Section */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {hasActiveFilter ? `Menampilkan ${results.length} Rekomendasi Kuliner` : 'Rekomendasi Kuliner Pilihan di Medan'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih hidangan untuk melihat detail racikan rempah, jam buka, lokasi peta, dan padanan menu terbaik.
                  </p>
                </div>
                {hasActiveFilter && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-[#1d63ed] dark:text-sky-400 hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className={`h-72 rounded-2xl animate-pulse ${darkMode ? 'bg-slate-900' : 'bg-white border border-slate-200/70'}`}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayedResults.map(renderDishCard)}
                  </div>

                  {visibleCount < results.length && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setVisibleCount((c) => c + 12)}
                        className={`px-6 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                          darkMode
                            ? 'bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800'
                            : 'bg-white border-blue-200 text-[#1d63ed] hover:bg-blue-50 shadow-xs'
                        }`}
                      >
                        Muat Lebih Banyak ({results.length - visibleCount} kuliner lainnya)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        )}

        {/* ==================== VIEW 2: EKSPLORASI (FULL SEMANTIC CATALOG) ==================== */}
        {activeView === 'eksplorasi' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12">
            <div className="mb-6">
              <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Jelajah Lengkap Kuliner Medan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Saring pilihan kuliner berdasarkan kategori hidangan, warisan budaya, 21 kecamatan, kawasan populer, hingga status halal.
              </p>
            </div>

            {/* Full Filter Card */}
            <div
              className={`rounded-2xl border p-4 mb-6 space-y-4 ${
                darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setSearchInput(e.target.value);
                  }}
                  placeholder="Cari nama hidangan, bahan rempah, nama restoran, atau kelurahan..."
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none ${
                    darkMode
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#1d63ed]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Kategori</option>
                  {facets.categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label} ({c.count})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedBudaya}
                  onChange={(e) => setSelectedBudaya(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Budaya</option>
                  {facets.cultures.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label} ({c.count})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedKecamatan}
                  onChange={(e) => {
                    setSelectedKecamatan(e.target.value);
                    if (!e.target.value) setIncludeNeighbors(false);
                  }}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua 21 Kecamatan</option>
                  {facets.districts.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.label} ({d.count})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedKawasan}
                  onChange={(e) => setSelectedKawasan(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Kawasan</option>
                  {(facets.hubs || []).map((h) => (
                    <option key={h.slug} value={h.slug}>
                      {h.label} ({h.count})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTeknik}
                  onChange={(e) => setSelectedTeknik(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Teknik Masak</option>
                  {(facets.techniques || []).map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.label} ({t.count})
                    </option>
                  ))}
                </select>

                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  Reset ({results.length} hasil)
                </button>
              </div>

              {selectedKecamatan && (
                <label className="flex items-center gap-2 text-xs text-[#1d63ed] dark:text-sky-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeNeighbors}
                    onChange={(e) => setIncludeNeighbors(e.target.checked)}
                    className="accent-[#1d63ed]"
                  />
                  <span>
                    <strong>Perluas Radius Lokasi</strong> — tampilkan juga pilihan kuliner di kecamatan sekitar
                  </span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedResults.map(renderDishCard)}
            </div>

            {visibleCount < results.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="px-6 py-2.5 rounded-full bg-[#1d63ed] text-white text-xs font-semibold shadow-sm"
                >
                  Tampilkan Lebih Banyak ({results.length - visibleCount} tersisa)
                </button>
              </div>
            )}

            {lastSparql && (
              <details
                className={`mt-8 rounded-2xl border p-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <summary className="cursor-pointer text-xs font-semibold text-[#1d63ed] dark:text-sky-400 flex items-center gap-2">
                  <Database className="w-4 h-4" /> Detail Kueri Mesin Pencari (Mode Developer)
                </summary>
                <pre className="mt-3 p-4 rounded-xl bg-slate-950 text-xs text-emerald-300 overflow-x-auto font-mono">
                  {lastSparql}
                </pre>
              </details>
            )}
          </main>
        )}

        {/* ==================== VIEW 3: KATEGORI & BUDAYA ==================== */}
        {activeView === 'kategori' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12 space-y-8">
            <div>
              <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Kategori &amp; Warisan Budaya Kuliner
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Telusuri kekayaan gastronomi Kota Medan berdasarkan jenis sajian maupun akar tradisi budaya.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                10 Kategori Sajian Khas Medan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {facets.categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedKategori(cat.slug);
                      setActiveView('eksplorasi');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-sky-500'
                        : 'bg-white border-slate-200/90 hover:border-[#1d63ed] shadow-xs'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cat.label}</p>
                      <p className="text-xs text-[#1d63ed] dark:text-sky-400 mt-1 font-medium">{cat.count} hidangan</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                12 Warisan Budaya Kuliner Sumatera Utara
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {facets.cultures.map((cult) => (
                  <button
                    key={cult.slug}
                    onClick={() => {
                      setSelectedBudaya(cult.slug);
                      setActiveView('eksplorasi');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-amber-500'
                        : 'bg-white border-slate-200/90 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cult.label}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                        {cult.count} entitas kuliner
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ==================== VIEW 4: RIWAYAT PENCARIAN ==================== */}
        {activeView === 'riwayat' && (
          <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Riwayat Pencarian
                </h2>
                <p className="text-xs text-slate-500 mt-1">Klik kata kunci di bawah untuk mencari kembali dengan cepat.</p>
              </div>
              {searchHistory.length > 0 && (
                <button
                  onClick={() => setSearchHistory([])}
                  className="text-xs text-rose-500 font-semibold hover:underline"
                >
                  Hapus Semua Riwayat
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div
                className={`p-10 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Belum ada riwayat pencarian</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchHistory.map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      executeSearchSubmit(null, h.query);
                      setActiveView('beranda');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-sky-500'
                        : 'bg-white border-slate-200 hover:border-[#1d63ed] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#1d63ed]" />
                      <div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{h.query}</p>
                        <p className="text-[11px] text-slate-400">
                          {h.filter} · {h.time}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* ==================== VIEW 5: FAVORIT ==================== */}
        {activeView === 'favorit' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12">
            <div className="mb-6">
              <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Daftar Kuliner Favoritmu ({favoriteDishes.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Simpan dan kelola daftar hidangan khas Medan yang ingin kamu kunjungi.
              </p>
            </div>

            {favoriteDishes.length === 0 ? (
              <div
                className={`p-10 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">Belum ada kuliner favorit</p>
                <p className="text-xs text-slate-400 mt-1">Klik ikon bookmark pada kartu kuliner untuk menyimpannya.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteDishes.map(renderDishCard)}
              </div>
            )}
          </main>
        )}

        {/* ==================== VIEW 6: KNOWLEDGE GRAPH EXPLORER ==================== */}
        {activeView === 'graph' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12 space-y-5">
            <div
              className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <h2 className="text-lg font-extrabold text-[#1d63ed] dark:text-sky-400 flex items-center gap-2">
                  <Network className="w-5 h-5" /> Peta Koneksi &amp; Jejaring Kuliner Medan
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lihat bagaimana setiap hidangan terhubung dengan bahan rempah, warisan budaya, dan lokasi terbaiknya.
                </p>
              </div>
              <select
                value={graphFocus}
                onChange={(e) => setGraphFocus(e.target.value)}
                className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                  darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {(results.length ? results : DEMO_DISHES).map((r) => (
                  <option key={r.slug} value={r.slug}>
                    Fokus Hidangan: {r.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {Object.entries(NODE_COLORS).map(([cls, color]) => (
                <span
                  key={cls}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  {NODE_LABELS[cls] || cls}
                </span>
              ))}
            </div>

            <div
              className={`rounded-2xl border p-4 overflow-x-auto ${
                darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <svg viewBox="0 0 880 540" className="w-full h-[540px] min-w-[720px]">
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="20"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={darkMode ? '#64748b' : '#94a3b8'} />
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
                        stroke={highlighted ? '#1d63ed' : darkMode ? '#334155' : '#cbd5e1'}
                        strokeWidth={highlighted ? 2.2 : 1.3}
                        markerEnd="url(#arrow)"
                      />
                      <rect
                        x={mx - 48}
                        y={my - 8}
                        width="96"
                        height="15"
                        rx="4"
                        fill={darkMode ? '#0f172a' : '#f8fafc'}
                      />
                      <text
                        x={mx}
                        y={my + 2.5}
                        textAnchor="middle"
                        fill={darkMode ? '#94a3b8' : '#475569'}
                        fontSize="8.5"
                        fontFamily="sans-serif"
                      >
                        {e.predicate}
                      </text>
                    </g>
                  );
                })}

                {positionedGraph.nodes.map((n) => {
                  const fill = NODE_COLORS[n.type] || '#64748b';
                  const shortLabel = n.label.length > 22 ? `${n.label.slice(0, 21)}…` : n.label;
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
                        r={n.isCenter ? 24 : 14}
                        fill={fill}
                        fillOpacity="0.18"
                        stroke={fill}
                        strokeWidth={n.isCenter ? 3 : 2}
                      />
                      <circle r={n.isCenter ? 8 : 5} fill={fill} />
                      <text
                        y={n.isCenter ? 38 : 26}
                        textAnchor="middle"
                        fill={darkMode ? '#f1f5f9' : '#0f172a'}
                        fontSize={n.isCenter ? '12' : '9.5'}
                        fontWeight={n.isCenter ? '700' : '600'}
                      >
                        {shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </main>
        )}

        {/* ==================== VIEW 7: LIVE SPARQL LAB ==================== */}
        {activeView === 'sparql' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-lg font-extrabold text-[#1d63ed] dark:text-sky-400 flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Wawasan &amp; Analisis Kuliner
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih topik analisis kuliner di bawah ini untuk menampilkan daftar rekomendasi dan statistik secara langsung.
                </p>
                {PRESET_SPARQL.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSparqlInput(p.query)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-sky-500'
                        : 'bg-white border-slate-200 hover:border-[#1d63ed] shadow-xs'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1d63ed]">
                      {p.badge}
                    </span>
                    <p className={`text-xs font-bold mt-1.5 leading-snug ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      {p.title}
                    </p>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div
                  className={`rounded-2xl border p-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 font-mono">Editor Kueri Lanjutan (SPARQL 1.1)</span>
                    <button
                      onClick={runCustomSparql}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-xs font-bold text-white shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" /> Tampilkan Hasil
                    </button>
                  </div>
                  <textarea
                    value={sparqlInput}
                    onChange={(e) => setSparqlInput(e.target.value)}
                    rows={14}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 outline-none focus:border-sky-400"
                  />
                </div>

                {sparqlError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500">
                    {sparqlError}
                  </div>
                )}

                {sparqlOutput && (
                  <div
                    className={`rounded-2xl border p-4 overflow-x-auto ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <p className="text-xs text-slate-500 mb-3">
                      Mengembalikan <strong className="text-[#1d63ed]">{sparqlOutput.count}</strong> baris dalam{' '}
                      <strong className="text-emerald-600">{sparqlOutput.elapsedMs} ms</strong>
                    </p>
                    {sparqlOutput.bindings.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-[#1d63ed] dark:text-sky-400">
                            {Object.keys(sparqlOutput.bindings[0]).map((col) => (
                              <th key={col} className="py-2 px-3 font-mono">
                                ?{col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sparqlOutput.bindings.map((row, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                              {Object.keys(sparqlOutput.bindings[0]).map((col) => (
                                <td key={col} className="py-2 px-3">
                                  {row[col]?.value || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-slate-400">Tidak ada triple yang cocok.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ==================== VIEW 8: API DEVELOPER & ONTOLOGY DOCS ==================== */}
        {activeView === 'api' && (
          <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12 space-y-6">
            <div>
              <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Portal Mitra &amp; Integrasi Data
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Akses katalog direktori kuliner Kota Medan secara terstruktur untuk mitra pariwisata, aplikasi, dan pengembang.
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 space-y-3 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#1d63ed]">Base Data Namespace</p>
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs">
                <span className="truncate">{ONTOLOGY_URI}</span>
                <button
                  onClick={() => copyToClipboard(ONTOLOGY_URI)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1 shrink-0"
                >
                  {copiedText === ONTOLOGY_URI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { method: 'GET', path: '/api/health', desc: 'Cek status koneksi Apache Jena Fuseki & statistik 500 entitas.' },
                { method: 'GET', path: '/api/facets', desc: 'Ambil daftar dinamis kategori, budaya, 21 kecamatan & kawasan.' },
                { method: 'GET', path: '/api/search?keyword=Soto&includeNeighbors=true', desc: 'Pencarian multi-facet & traversal spasial kecamatan tetangga.' },
                { method: 'GET', path: '/api/culinary/:slug', desc: 'Detail entitas, pasangan cocok, cabang restoran, owl:sameAs & rekomendasi.' },
                { method: 'GET', path: '/api/graph?focus=SotoMedan', desc: 'Ekstraksi node & edge RDF untuk visualisasi Knowledge Graph.' },
                { method: 'POST', path: '/api/sparql', desc: 'Eksekusi kueri SPARQL 1.1 SELECT/ASK langsung ke triplestore.' },
              ].map((ep) => (
                <div
                  key={ep.path}
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1d63ed] font-mono text-[11px] font-bold">
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono font-semibold">{ep.path}</code>
                  </div>
                  <p className="text-xs text-slate-500">{ep.desc}</p>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ==================== VIEW 9: PENGATURAN & INFO TIM ==================== */}
        {activeView === 'pengaturan' && (
          <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12 space-y-6">
            <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Pengaturan &amp; Tentang Medan Search
            </h2>

            <div
              className={`rounded-2xl border p-5 flex items-center justify-between ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Tema Tampilan Antarmuka</p>
                <p className="text-xs text-slate-500">Pilih mode terang minimalis atau mode gelap.</p>
              </div>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="px-4 py-2 rounded-full bg-[#1d63ed] text-white text-xs font-semibold"
              >
                {darkMode ? 'Gunakan Light Mode' : 'Gunakan Dark Mode'}
              </button>
            </div>

            <div
              className={`rounded-2xl border p-5 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Tim Kreator Medan Search
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {TEAM_MEMBERS.map((m, idx) => (
                  <div key={m.name} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold">{idx + 1}. {m.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eef4ff] text-[#1d63ed] font-medium">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ==================== FOOTER (MATCHES REFERENCE SCREENSHOT) ==================== */}
        <footer
          className={`relative z-10 mt-auto border-t px-4 sm:px-8 py-4 text-xs ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white border-slate-200/80 text-slate-500'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MedanSearchLogo size="sm" darkMode={darkMode} />
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span>© 2026 Medan Search. Semua hak dilindungi.</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 font-medium">
              <button onClick={() => setActiveView('api')} className="hover:text-[#1d63ed]">
                Portal Mitra
              </button>
              <button onClick={() => setActiveView('sparql')} className="hover:text-[#1d63ed]">
                Wawasan Kuliner
              </button>
              <button onClick={() => setActiveView('graph')} className="hover:text-[#1d63ed]">
                Jejaring Rasa
              </button>
              <button onClick={() => setActiveView('pengaturan')} className="hover:text-[#1d63ed]">
                Tentang Kami
              </button>
            </div>

            <div className="flex items-center gap-2 font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health?.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {health?.status === 'connected' ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Online · Katalog Aktif
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Mode Pratinjau</span>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* ==================== SEMANTIC DETAIL MODAL ==================== */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="relative h-56">
                <img src={selectedDish.gambar} alt={selectedDish.nama} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <button
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1d63ed] text-white text-[11px] font-semibold mb-1.5">
                    {selectedDish.kategori}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{selectedDish.nama}</h3>
                  <p className="text-xs text-slate-200">{selectedDish.namaEn}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedDish.deskripsi}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
                    <span className="text-slate-400 block">Pengaruh Budaya</span>
                    <strong className="text-amber-600 dark:text-amber-300 mt-0.5 block">{selectedDish.budaya}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
                    <span className="text-slate-400 block">Level Pedas</span>
                    <strong className="text-rose-500 mt-0.5 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {selectedDish.tingkatKepedasan} / 5
                    </strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
                    <span className="text-slate-400 block">Teknik Masak</span>
                    <strong className="text-orange-600 dark:text-orange-300 mt-0.5 flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{selectedDish.metodeMasak || '-'}</span>
                    </strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
                    <span className="text-slate-400 block">Profil Rasa</span>
                    <strong className="text-[#1d63ed] dark:text-sky-300 mt-0.5 block">
                      {selectedDish.rasaDominan || '-'}
                    </strong>
                  </div>
                </div>

                {selectedDish.penghargaan && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-medium">
                      <Award className="w-3.5 h-3.5" /> {selectedDish.penghargaan}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Bahan Utama &amp; Racikan Rempah
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDish.bahanUtama.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          executeSearchSubmit(null, b);
                          setSelectedDish(null);
                        }}
                        className="px-3 py-1 rounded-full bg-[#eef4ff] dark:bg-sky-500/15 text-[#1d63ed] dark:text-sky-300 text-xs font-medium hover:bg-blue-100"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {dishExtra?.pairings?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#1d63ed]" /> Paling Cocok Dinikmati Bersama
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dishExtra.pairings.map((p) => (
                        <button
                          key={p.slug}
                          onClick={() => {
                            const match = results.find((r) => r.slug === p.slug);
                            if (match) openDishDetail(match);
                          }}
                          className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
                        >
                          {p.nama}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#f6f9ff] border-blue-200/70'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs text-[#1d63ed] dark:text-sky-400 font-bold">
                      Rekomendasi Tempat Terbaik
                    </p>
                    <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedDish.restoran.nama}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1d63ed] shrink-0" /> {selectedDish.restoran.alamat}
                    </p>
                    <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      {selectedDish.restoran.kelurahan && (
                        <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                          {selectedDish.restoran.kelurahan}
                        </span>
                      )}
                      {selectedDish.restoran.kawasan && <span>· {selectedDish.restoran.kawasan}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedDish.restoran.jamBuka}
                      </span>
                      {selectedDish.restoran.tahunBerdiri && <span>Berdiri sejak {selectedDish.restoran.tahunBerdiri}</span>}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedDish.restoran.lat},${selectedDish.restoran.long}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Compass className="w-4 h-4" /> Buka Google Maps
                  </a>
                </div>

                {dishExtra?.branches?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#1d63ed]" /> Cabang Resmi Lainnya di Medan
                    </h4>
                    <div className="space-y-2">
                      {dishExtra.branches.map((b) => (
                        <div
                          key={b.slug}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <p className="font-bold flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-rose-500" /> {b.nama}
                            </p>
                            <p className="text-slate-500 mt-0.5">
                              {b.alamat} · {b.kelurahan || b.kecamatan}
                            </p>
                          </div>
                          <span className="text-amber-500 font-bold shrink-0">★ {b.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dishExtra?.sameAs?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">Referensi Ensiklopedia:</span>
                    {dishExtra.sameAs.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1d63ed] dark:text-sky-400 underline flex items-center gap-1"
                      >
                        {link.replace('http://dbpedia.org/resource/', '').replace(/_/g, ' ')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}

                {dishExtra?.recommendations?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Rekomendasi Serupa Untukmu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dishExtra.recommendations.slice(0, 4).map((rec) => (
                        <div
                          key={rec.slug}
                          onClick={() => {
                            const match = results.find((r) => r.slug === rec.slug);
                            if (match) openDishDetail(match);
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            darkMode
                              ? 'bg-slate-950 border-slate-800 hover:border-sky-500'
                              : 'bg-slate-50 border-slate-200 hover:border-[#1d63ed]'
                          }`}
                        >
                          <img src={rec.gambar} alt={rec.nama} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{rec.nama}</p>
                            <p className="text-[11px] text-[#1d63ed] dark:text-sky-400 truncate">{rec.reason}</p>
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