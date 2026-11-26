import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  History,
  Bookmark,
  Search,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  Network,
  Utensils,
  Flame,
  MapPin,
  ShieldAlert,
  Star,
  Clock,
  ExternalLink,
  X,
  Database,
  Play,
  Layers,
  Award,
  ChefHat,
  HeartHandshake,
  GitBranch,
  Store,
  Check,
  Copy,
  Users,
  Menu,
  Send,
  RotateCcw,
  KeyRound,
  Filter,
} from 'lucide-react';
import {
  OrganicHomeIcon,
  OrganicExploreIcon,
  OrganicCategoryIcon,
  OrganicHistoryIcon,
  OrganicBookmarkIcon,
  OrganicSettingsIcon,
  OrganicSearchIcon,
  OrganicFilterIcon,
  OrganicCulinaryBowlIcon,
  OrganicSpiceCompassIcon,
  OrganicSpiceFlameIcon,
  OrganicHalalLeafIcon,
} from './components/OrganicIcons';
import { resolveDishImage } from './culinaryImages';
import MedanCulinaryMap from './components/MedanCulinaryMap';

const API_BASE = 'http://localhost:5001/api';
const ONTOLOGY_URI = 'http://kuliner-medan.org/ontology/Kelompok06/KomA/25#';
const GEMINI_API_KEY = '';
const GEMINI_MODEL = 'gemini-3-flash-preview';
const LOCAL_KEY_STORAGE = 'ranah_kulmed_gemini_key';

// Structured JSON Schema for reliable, zero-hallucination AI culinary recommendations
const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          slug: { type: 'STRING' },
          nama: { type: 'STRING' },
          alasan: { type: 'STRING' },
          estimasiHarga: { type: 'STRING' },
          lokasi: { type: 'STRING' },
        },
        required: ['slug', 'nama', 'alasan'],
      },
    },
    suggestedFilters: {
      type: 'OBJECT',
      properties: {
        keyword: { type: 'STRING' },
        halal: { type: 'STRING' },
        kategoriSlug: { type: 'STRING' },
        kecamatanSlug: { type: 'STRING' },
      },
    },
    followUpQuestions: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: ['summary', 'recommendations', 'followUpQuestions'],
};

const INITIAL_AI_MESSAGE = {
  role: 'model',
  text: 'Halo! Saya Asisten Ranah KulMed. Ceritakan selera rasa, budget, status halal, atau kawasan Medan yang kamu tuju—aku akan mencarikan rekomendasi terbaik langsung dari katalog kami.',
  recommendations: [],
  suggestedFilters: null,
  followUpQuestions: [
    'Sarapan halal di Medan di bawah Rp 30 ribu?',
    'Oleh-oleh khas Medan terbaik untuk keluarga?',
    'Kuliner pedas berempah andaliman yang wajib dicoba?',
  ],
  isFallback: false,
};

const POPULAR_SEARCHES = ['Soto Medan', 'Bika Ambon', 'Mie Gomak', 'Durian', 'Andaliman', 'Kesawan'];

const NODE_COLORS = {
  Kuliner: '#1d63ed',
  Kategori: '#8b5cf6',
  PengaruhBudaya: '#f59e0b',
  BahanUtama: '#10b981',
  Restoran: '#f43f5e',
  Kecamatan: '#0ea5e9',
  Kelurahan: '#6366f1',
  KawasanKuliner: '#ec4899',
  TeknikMasak: '#f97316',
  ProfilRasa: '#eab308',
  PenghargaanKuliner: '#a855f7',
};

const NODE_LABELS = {
  Kuliner: 'Hidangan',
  Kategori: 'Kategori',
  PengaruhBudaya: 'Budaya',
  BahanUtama: 'Bahan & Rempah',
  Restoran: 'Tempat Kuliner',
  Kecamatan: 'Kecamatan',
  Kelurahan: 'Kelurahan',
  KawasanKuliner: 'Kawasan Populer',
  TeknikMasak: 'Teknik Masak',
  ProfilRasa: 'Profil Rasa',
  PenghargaanKuliner: 'Penghargaan',
};

const PRESET_SPARQL = [
  {
    title: 'Kuliner Halal di Sekitar Medan Baru & Kecamatan Tetangga',
    badge: 'Radius Lokasi',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?kuliner ?restoran ?kecamatan ?kelurahan ?harga WHERE {
  { BIND(ex:KecMedanBaru AS ?kec) }
  UNION
  { ex:KecMedanBaru ex:berbatasanDengan ?kec }
  ?kec rdfs:label ?kecamatan .
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
ORDER BY ?kecamatan ?kuliner
LIMIT 25`,
  },
  {
    title: 'Daftar Hidangan Berbumbu Andaliman Khas Sumatera Utara',
    badge: 'Rempah Ikonik',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?kuliner ?budaya ?restoran ?kecamatan ?harga WHERE {
  ?k a ex:Kuliner ;
     rdfs:label ?kuliner ;
     ex:memilikiBahan ex:BahanAndaliman ;
     ex:pengaruhBudaya ?b ;
     ex:kisaranHarga ?harga ;
     ex:rekomendasiTempat ?r .
  FILTER(LANG(?kuliner) = "id")
  ?b rdfs:label ?budaya . FILTER(LANG(?budaya) = "id")
  ?r schema:name ?restoran ; ex:berlokasiDi ?kec .
  ?kec rdfs:label ?kecamatan .
}
ORDER BY ?kuliner`,
  },
  {
    title: 'Cabang Resmi Restoran Populer di Berbagai Kawasan Medan',
    badge: 'Jaringan Cabang',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?restoranUtama ?cabang ?kecamatan ?kelurahan ?kawasan WHERE {
  ?c a ex:Restoran ;
     schema:name ?cabang ;
     ex:cabangDari ?induk ;
     ex:berlokasiDi ?kec ;
     ex:berlokasiDiKelurahan ?kel ;
     ex:beradaDiKawasan ?kaw .
  ?induk schema:name ?restoranUtama .
  ?kec rdfs:label ?kecamatan .
  ?kel rdfs:label ?kelurahan .
  ?kaw rdfs:label ?kawasan . FILTER(LANG(?kawasan) = "id")
}
ORDER BY ?restoranUtama`,
  },
  {
    title: 'Statistik Jumlah Hidangan & Rata-Rata Harga per Tradisi Budaya',
    badge: 'Statistik Budaya',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?budaya (COUNT(DISTINCT ?k) AS ?totalHidangan) (ROUND(AVG(?hMin)) AS ?rataHargaMinIDR) WHERE {
  ?k a ex:Kuliner ;
     ex:pengaruhBudaya ?b ;
     ex:hargaMin ?hMin .
  ?b rdfs:label ?budaya .
  FILTER(LANG(?budaya) = "id")
}
GROUP BY ?budaya
ORDER BY DESC(?totalHidangan)`,
  },
  {
    title: 'Tempat Kuliner Legendaris Medan (Berdiri Sebelum 1985)',
    badge: 'Warisan Kuliner',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT ?kuliner ?restoran ?tahunBerdiri ?kawasan ?rating WHERE {
  ?r a ex:Restoran ;
     schema:name ?restoran ;
     ex:tahunBerdiri ?tahunBerdiri ;
     ex:rating ?rating ;
     ex:beradaDiKawasan ?kaw .
  FILTER(?tahunBerdiri < 1985)
  ?kaw rdfs:label ?kawasan . FILTER(LANG(?kawasan) = "id")
  ?k a ex:Kuliner ;
     rdfs:label ?kuliner ;
     ex:rekomendasiTempat ?r .
  FILTER(LANG(?kuliner) = "id")
}
ORDER BY ASC(?tahunBerdiri)`,
  },
  {
    title: 'Sebaran Kelurahan & Tempat Kuliner di 21 Kecamatan Kota Medan',
    badge: 'Peta 21 Kecamatan',
    query: `PREFIX ex: <${ONTOLOGY_URI}>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?kecamatan (COUNT(DISTINCT ?kel) AS ?totalKelurahan) (COUNT(DISTINCT ?r) AS ?totalTempat) WHERE {
  ?kec a ex:Kecamatan ;
       rdfs:label ?kecamatan .
  OPTIONAL { ?kel a ex:Kelurahan ; ex:bagianDariKecamatan ?kec . }
  OPTIONAL { ?r a ex:Restoran ; ex:berlokasiDi ?kec . }
}
GROUP BY ?kecamatan
ORDER BY DESC(?totalTempat) DESC(?totalKelurahan)`,
  },
];

// Curated preview catalog (used automatically when local Fuseki backend is offline)
const DEMO_DISHES = [
  {
    slug: 'SotoMedan',
    uri: `${ONTOLOGY_URI}SotoMedan`,
    nama: 'Soto Medan',
    namaEn: 'Medan Coconut Beef Soup',
    deskripsi:
      'Soto berkuah santan kental kuning kehijauan dengan rempah jintan, kapulaga, dan pilihan daging sapi, ayam, atau udang.',
    gambar: '/images/kuliner/soto_medan.jpg',
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
    pairings: [
      { slug: 'SateKerangMedan', nama: 'Sate Kerang Medan' },
      { slug: 'SodaBadak', nama: 'Es Soda Badak Susu' },
    ],
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
    gambar: '/images/kuliner/bika_ambon.jpg',
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
    pairings: [{ slug: 'KopiApek', nama: 'Kopi Sidikalang (Kopi Apek)' }],
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
    gambar: '/images/kuliner/mie_gomak.jpg',
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
    pairings: [{ slug: 'TST', nama: 'Teh Susu Telur (TST)' }],
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
    gambar: '/images/kuliner/lontong_medan.png',
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
    pairings: [{ slug: 'KopiApek', nama: 'Kopi Sidikalang (Kopi Apek)' }],
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
    slug: 'DurianPancake',
    uri: `${ONTOLOGY_URI}DurianPancake`,
    nama: 'Pancake Durian Medan',
    namaEn: 'Medan Durian Crepe Pancake',
    deskripsi:
      'Kulit crepe tipis lembut berisi daging buah durian Medan asli yang legit dipadu krim kocok dingin.',
    gambar: '/images/kuliner/durian_pancake.jpg',
    isHalal: true,
    tingkatKepedasan: 0,
    kisaranHarga: 'Rp 75.000 - Rp 120.000',
    rasaDominan: 'Manis Legit & Harum',
    metodeMasak: 'Seduh, Tarik & Racik Dingin',
    teknikSlug: 'TeknikSeduhRacik',
    kategori: 'Oleh-Oleh Khas',
    kategoriSlug: 'KatOlehOleh',
    budaya: 'Akulturasi Jawa & Kolonial',
    budayaSlug: 'BudayaJawaKolonial',
    waktuSajian: 'Sepanjang Hari',
    penghargaan: 'Top Oleh-Oleh Bandara Kualanamu',
    bahanUtama: ['Durian Medan', 'Tepung Gandum / Roti', 'Susu Kental Manis', 'Daun Pandan Wangi'],
    sameAs: ['http://dbpedia.org/resource/Durian'],
    pairings: [],
    branches: [
      {
        slug: 'CabangUcokDurianRingRoad',
        nama: 'Ucok Durian Cab. Ring Road',
        alamat: 'Jl. Ring Road No. 92, Tanjung Sari',
        kecamatan: 'Medan Selayang',
        kelurahan: 'Kelurahan Tanjung Sari',
        rating: 4.5,
      },
    ],
    restoran: {
      nama: 'Ucok Durian Medan',
      alamat: 'Jl. K.H. Wahid Hasyim No. 30-32, Babura, Medan Baru',
      kecamatan: 'Medan Baru',
      kecamatanSlug: 'KecMedanBaru',
      kelurahan: 'Kelurahan Babura',
      kawasan: 'Sentra Durian & Kuliner Jl. Wahid Hasyim',
      kawasanSlug: 'KawasanWahidHasyim',
      jamBuka: '08:00 - 23:59 WIB',
      rating: 4.5,
      tahunBerdiri: 1985,
      lat: 3.5778,
      long: 98.6602,
    },
  },
  {
    slug: 'KariBihunTabona',
    uri: `${ONTOLOGY_URI}KariBihunTabona`,
    nama: 'Kari Bihun Tabona',
    namaEn: 'Tabona Indian-Medan Curry Vermicelli',
    deskripsi:
      'Bihun lembut disiram kuah kari kental kaya rempah India-Melayu dengan pilihan daging ayam kampung atau daging sapi empuk.',
    gambar: '/images/kuliner/kari_bihun.jpg',
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
    branches: [
      {
        slug: 'CabangRMTabonaCemara',
        nama: 'RM Tabona Cab. Cemara Asri',
        alamat: 'Komplek Cemara Asri No. 88, Pulo Brayan Darat II',
        kecamatan: 'Medan Timur',
        kelurahan: 'Kelurahan Pulo Brayan Darat II',
        rating: 4.7,
      },
    ],
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
    gambar: '/images/kuliner/bihun_bebek.jpg',
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
  {
    slug: 'KopiApek',
    uri: `${ONTOLOGY_URI}KopiApek`,
    nama: 'Kopi Sidikalang (Kopi Apek)',
    namaEn: 'Sidikalang Traditional Kopitiam Coffee',
    deskripsi:
      'Kopi bubuk Sidikalang yang diseduh menggunakan saringan kain khas kopitiam Medan, disajikan hitam pekat atau dengan susu kental manis.',
    gambar: '/images/kuliner/kopi_sidikalang.jpg',
    isHalal: true,
    tingkatKepedasan: 0,
    kisaranHarga: 'Rp 14.000 - Rp 22.000',
    rasaDominan: 'Pahit Kopi Aromatik',
    metodeMasak: 'Seduh, Tarik & Racik Dingin',
    teknikSlug: 'TeknikSeduhRacik',
    kategori: 'Kopitiam & Roti',
    kategoriSlug: 'KatKopitiam',
    budaya: 'Tionghoa-Medan',
    budayaSlug: 'BudayaTionghoaMedan',
    waktuSajian: 'Sarapan (Pagi)',
    penghargaan: 'Kurasi Kuliner Kesawan City Walk',
    bahanUtama: ['Kopi Sidikalang', 'Susu Kental Manis'],
    sameAs: [],
    pairings: [{ slug: 'BikaAmbon', nama: 'Bika Ambon' }],
    branches: [],
    restoran: {
      nama: 'Kedai Kopi Apek Kesawan',
      alamat: 'Jl. Hindu No. 37, Kesawan, Medan Barat',
      kecamatan: 'Medan Barat',
      kecamatanSlug: 'KecMedanBarat',
      kelurahan: 'Kelurahan Kesawan',
      kawasan: 'Kawasan Heritage Kesawan',
      kawasanSlug: 'KawasanKesawan',
      jamBuka: '06:30 - 14:30 WIB',
      rating: 4.6,
      tahunBerdiri: 1922,
      lat: 3.5858,
      long: 98.6781,
    },
  },
  {
    slug: 'TST',
    uri: `${ONTOLOGY_URI}TST`,
    nama: 'Teh Susu Telur (TST)',
    namaEn: 'Medan Egg Milk Tea',
    deskripsi:
      'Minuman hangat penambah stamina khas Medan dari kocokan kuning telur ayam kampung, susu kental manis, dan seduhan teh hitam pekat.',
    gambar: '/images/kuliner/tst.jpg',
    isHalal: true,
    tingkatKepedasan: 0,
    kisaranHarga: 'Rp 15.000 - Rp 25.000',
    rasaDominan: 'Manis Legit & Harum',
    metodeMasak: 'Seduh, Tarik & Racik Dingin',
    teknikSlug: 'TeknikSeduhRacik',
    kategori: 'Minuman Khas',
    kategoriSlug: 'KatMinuman',
    budaya: 'India-Tamil',
    budayaSlug: 'BudayaIndiaTamil',
    waktuSajian: 'Makan Malam',
    penghargaan: 'Ikon Medan Culinary Festival',
    bahanUtama: ['Teh Hitam Pekat', 'Susu Kental Manis'],
    sameAs: [],
    pairings: [{ slug: 'MieGomak', nama: 'Mie Gomak' }],
    branches: [],
    restoran: {
      nama: 'TST Pak Haji Puri',
      alamat: 'Jl. Puri No. 58, Kotamatsum II, Medan Area',
      kecamatan: 'Medan Area',
      kecamatanSlug: 'KecMedanArea',
      kelurahan: 'Kelurahan Kotamatsum II',
      kawasan: 'Kuliner Malam Asia Mega Mas',
      kawasanSlug: 'KawasanAsiaMegaMas',
      jamBuka: '17:00 - 01:00 WIB',
      rating: 4.6,
      tahunBerdiri: 1988,
      lat: 3.5754,
      long: 98.6915,
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
    servingTimes: tally((d) =>
      d.waktuSajian
        ? { slug: d.waktuSlug || d.waktuSajian.replace(/[^a-zA-Z0-9]/g, ''), label: d.waktuSajian }
        : null
    ),
    ingredients: [],
  };
}

/**
 * Brand Logo: Hand-crafted Organic Medan Culinary Bowl & Spice Leaf Emblem
 */
function RanahKulMedLogo({ size = 'md', darkMode = false, showText = true }) {
  const dims =
    size === 'lg'
      ? { icon: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-4xl sm:text-5xl', gap: 'gap-3.5' }
      : size === 'sm'
      ? { icon: 'w-6 h-6', text: 'text-sm', gap: 'gap-2' }
      : { icon: 'w-9 h-9', text: 'text-lg', gap: 'gap-2.5' };

  return (
    <div className={`inline-flex items-center ${dims.gap} select-none`}>
      <svg viewBox="0 0 64 64" className={`${dims.icon} shrink-0`} fill="none" aria-hidden="true">
        {/* Soft organic ceramic backdrop */}
        <path
          d="M32 6 C48 6 58 15.5 57.5 31.5 C57 48 47.5 58 31.5 58 C15.5 58 6 48.5 6.5 32.5 C7 16 16.5 6 32 6 Z"
          fill={darkMode ? '#1e293b' : '#eaf2ff'}
          stroke={darkMode ? '#334155' : '#bfdbfe'}
          strokeWidth="2"
        />
        {/* Rising warm aroma wisps */}
        <path
          d="M23.5 23.5 C22.3 19.8 25.5 17.8 24.4 14.2"
          stroke={darkMode ? '#7dd3fc' : '#2563eb'}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M32.5 22 C31.4 18 34.8 15.8 33.6 12"
          stroke={darkMode ? '#7dd3fc' : '#1d63ed'}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Medan aromatic spice leaf (daun jeruk / serai) */}
        <path
          d="M40.5 27.5 C41.8 20.5 47.5 18 51.8 19.4 C50.5 24.8 46.5 28.8 40.5 27.5 Z"
          fill="#10b981"
          fillOpacity={darkMode ? '0.35' : '0.25'}
          stroke={darkMode ? '#34d399' : '#059669'}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* Hand-shaped Medan culinary bowl */}
        <path
          d="M14 31.5 C24.5 29.8 39.5 29.8 50 31.5 C49.2 42.2 42.2 49.6 32 49.8 C21.8 49.6 14.8 42.2 14 31.5 Z"
          fill={darkMode ? '#38bdf8' : '#1d63ed'}
          fillOpacity="0.16"
          stroke={darkMode ? '#38bdf8' : '#1d63ed'}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle artisanal rim accent & foot */}
        <path
          d="M22.5 39.2 C26.8 41.4 33.4 41.6 38.2 39.5"
          stroke={darkMode ? '#7dd3fc' : '#1d63ed'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
        <path
          d="M24.2 53.2 C29 54 35 54 39.8 53.2"
          stroke={darkMode ? '#38bdf8' : '#1e40af'}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`font-extrabold tracking-tight leading-none ${dims.text}`}>
          <span className={darkMode ? 'text-white' : 'text-slate-900'}>Ranah </span>
          <span className="text-[#1d63ed] dark:text-sky-400">KulMed</span>
        </span>
      )}
    </div>
  );
}

/**
 * Subtle Medan Heritage Architectural Watermark (Istana Maimun / Masjid Raya Silhouette)
 */
function MaimunSilhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 640 240" className={className} fill="currentColor" aria-hidden="true">
      <rect x="60" y="185" width="520" height="45" rx="4" />
      <rect x="110" y="145" width="420" height="45" rx="3" />
      <rect x="220" y="105" width="200" height="45" rx="3" />
      <path d="M265 105 C265 55, 375 55, 375 105 Z" />
      <rect x="317" y="34" width="6" height="24" rx="2" />
      <circle cx="320" cy="31" r="5" />
      <path d="M145 145 C145 112, 205 112, 205 145 Z" />
      <path d="M435 145 C435 112, 495 112, 495 145 Z" />
      <rect x="92" y="100" width="16" height="90" rx="2" />
      <path d="M90 100 L100 78 L110 100 Z" />
      <rect x="532" y="100" width="16" height="90" rx="2" />
      <path d="M530 100 L540 78 L550 100 Z" />
    </svg>
  );
}

/**
 * GraphRAG Retriever: ranks the full Medan culinary Knowledge Graph catalog
 * against user intent (budget, halal status, spice, ingredients, district, culture)
 * so only the most relevant entities are grounded into the Gemini prompt.
 */
function retrieveGraphContext(question, catalog) {
  const q = String(question || '').toLowerCase();
  const tokens = q
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  let maxBudget = null;
  const rbMatch = q.match(/(\d+)\s*(rb|ribu|k)\b/);
  const fullMatch = q.match(/\b(\d{2,3})[.,]?000\b/);
  if (rbMatch) maxBudget = Number(rbMatch[1]) * 1000;
  else if (fullMatch) maxBudget = Number(fullMatch[1]) * 1000;
  else if (/\b(murah|hemat|mahasiswa|terjangkau)\b/.test(q)) maxBudget = 30000;

  const wantsHalal = /\bhalal\b/.test(q) && !/\bnon[\s-]?halal\b/.test(q);
  const wantsNonHalal = /\bnon[\s-]?halal\b/.test(q) || /\b(babi|pork|lapo)\b/.test(q);
  const wantsSpicy = /\b(pedas|andaliman|sambal|cabai|lado)\b/.test(q);

  const scored = catalog.map((d) => {
    let score = 0;
    const searchable = [
      d.nama,
      d.namaEn,
      d.deskripsi,
      d.kategori,
      d.budaya,
      d.waktuSajian,
      d.rasaDominan,
      d.metodeMasak,
      d.penghargaan,
      d.restoran?.nama,
      d.restoran?.alamat,
      d.restoran?.kecamatan,
      d.restoran?.kelurahan,
      d.restoran?.kawasan,
      ...(d.bahanUtama || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    tokens.forEach((tok) => {
      if (searchable.includes(tok)) score += 3;
      if ((d.nama || '').toLowerCase().includes(tok)) score += 5;
      if ((d.kategori || '').toLowerCase().includes(tok)) score += 4;
      if ((d.restoran?.kecamatan || '').toLowerCase().includes(tok)) score += 4;
      if ((d.restoran?.kawasan || '').toLowerCase().includes(tok)) score += 4;
    });

    if (wantsHalal) score += d.isHalal ? 6 : -12;
    if (wantsNonHalal) score += !d.isHalal ? 6 : -12;
    if (wantsSpicy && (d.tingkatKepedasan || 0) >= 3) score += 4;

    if (maxBudget !== null) {
      const priceNums = (d.kisaranHarga || '').match(/\d[\d.]*/g);
      const minPrice = priceNums ? Number(priceNums[0].replace(/\./g, '')) : null;
      if (minPrice && minPrice <= maxBudget) score += 5;
      else if (minPrice && minPrice > maxBudget * 1.4) score -= 4;
    }

    if (d.restoran?.rating) score += d.restoran.rating * 0.4;
    return { dish: d, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 15).map((s) => s.dish);
}

/**
 * Graceful local recommendation builder if Gemini cannot be reached (e.g. offline localhost).
 */
function buildLocalFallbackReply(question, retrieved) {
  const top = retrieved.slice(0, 3);
  return {
    text: `Berikut rekomendasi kuliner Medan yang paling sesuai dengan pencarian "${question}" dari katalog Ranah KulMed:`,
    recommendations: top.map((d) => ({
      slug: d.slug,
      nama: d.nama,
      alasan: `${d.kategori} khas ${d.budaya} (${d.isHalal ? 'Halal' : 'Non-Halal'}) dengan cita rasa ${d.rasaDominan || 'autentik'}.`,
      estimasiHarga: d.kisaranHarga,
      lokasi: `${d.restoran?.nama || ''} · ${d.restoran?.kecamatan || 'Medan'}`,
    })),
    suggestedFilters: null,
    followUpQuestions: [
      'Tampilkan pilihan kuliner halal populer lainnya',
      'Rekomendasi kuliner malam di sekitar Kesawan',
    ],
    isFallback: true,
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
    servingTimes: [],
    ingredients: [],
  });

  // Search & Filter states
  const [searchInput, setSearchInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedBudaya, setSelectedBudaya] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [includeNeighbors, setIncludeNeighbors] = useState(false);
  const [selectedKawasan, setSelectedKawasan] = useState('');
  const [selectedTeknik, setSelectedTeknik] = useState('');
  const [selectedWaktu, setSelectedWaktu] = useState('');
  const [maxHargaFilter, setMaxHargaFilter] = useState('');
  const [halalFilter, setHalalFilter] = useState('');
  const [showMapView, setShowMapView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const [results, setResults] = useState([]);
  const [allDishes, setAllDishes] = useState(DEMO_DISHES);
  const [lastSparql, setLastSparql] = useState('');
  const [loading, setLoading] = useState(false);

  // Favorites & Search History
  const [favorites, setFavorites] = useState(['SotoMedan', 'BikaAmbon', 'MieGomak']);
  const [searchHistory, setSearchHistory] = useState([
    { query: 'Soto Medan', time: '09:15', filter: 'Pencarian Kuliner' },
    { query: 'Andaliman', time: '11:40', filter: 'Rempah Khas' },
    { query: 'Kesawan', time: '14:20', filter: 'Kawasan Kuliner' },
  ]);

  // Detail modal, Knowledge Graph, SPARQL Lab & Clipboard states
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishExtra, setDishExtra] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [graphFocus, setGraphFocus] = useState('SotoMedan');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [sparqlInput, setSparqlInput] = useState(PRESET_SPARQL[0].query);
  const [sparqlOutput, setSparqlOutput] = useState(null);
  const [sparqlError, setSparqlError] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Gemini AI Culinary Assistant state (GraphRAG + Structured JSON)
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiMessages, setAiMessages] = useState([INITIAL_AI_MESSAGE]);
  const [customGeminiKey, setCustomGeminiKey] = useState(() => {
    try {
      return window.localStorage.getItem(LOCAL_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [keySavedNotice, setKeySavedNotice] = useState(false);
  const aiChatEndRef = useRef(null);

  // Auto-scroll AI conversation smoothly when new message arrives
  useEffect(() => {
    if (aiOpen) {
      aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [aiMessages, aiLoading, aiOpen]);

  // Fetch health, facets & full catalog snapshot for GraphRAG grounding
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => {
        setHealth(data);
        if (data.status !== 'connected') {
          setIsDemoMode(true);
          setFacets(buildDemoFacets(DEMO_DISHES));
          setAllDishes(DEMO_DISHES);
        }
      })
      .catch(() => {
        setHealth({ status: 'disconnected', error: 'Backend server on port 5001 is not reachable.' });
        setIsDemoMode(true);
        setFacets(buildDemoFacets(DEMO_DISHES));
        setAllDishes(DEMO_DISHES);
      });

    fetch(`${API_BASE}/facets`)
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setFacets(d);
      })
      .catch(() => {});

    fetch(`${API_BASE}/search`)
      .then((r) => r.json())
      .then((d) => {
        if (d.results?.length) setAllDishes(d.results);
      })
      .catch(() => {});
  }, []);

  // Reactive SPARQL query execution
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const hasActiveSearch = Boolean(
        keyword ||
        selectedKategori ||
        selectedBudaya ||
        selectedKecamatan ||
        selectedKawasan ||
        selectedTeknik ||
        selectedWaktu ||
        maxHargaFilter ||
        halalFilter
      );

      if (!hasActiveSearch) {
        setResults([]);
        setLoading(false);
        return;
      }

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
            if (selectedWaktu) {
              const wSlug = item.waktuSlug || (item.waktuSajian || '').replace(/[^a-zA-Z0-9]/g, '');
              if (wSlug !== selectedWaktu) return false;
            }
            if (maxHargaFilter) {
              const priceNums = (item.kisaranHarga || '').match(/\d[\d.]*/g);
              const minP = item.hargaMin || (priceNums ? Number(priceNums[0].replace(/\./g, '')) : 0);
              if (minP > Number(maxHargaFilter)) return false;
            }
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
        if (selectedWaktu) params.set('waktu', selectedWaktu);
        if (maxHargaFilter) params.set('maxHarga', maxHargaFilter);
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
    selectedWaktu,
    maxHargaFilter,
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

  const resetFilters = () => {
    setSearchInput('');
    setShowSearchSuggestions(false);
    setKeyword('');
    setSelectedKategori('');
    setSelectedBudaya('');
    setSelectedKecamatan('');
    setIncludeNeighbors(false);
    setSelectedKawasan('');
    setSelectedTeknik('');
    setSelectedWaktu('');
    setMaxHargaFilter('');
    setHalalFilter('');
    setVisibleCount(12);
  };

  const executeSearchSubmit = (e, overrideQuery) => {
    if (e) e.preventDefault();
    const term = overrideQuery !== undefined ? overrideQuery : searchInput;
    setSearchInput(term);
    setShowSearchSuggestions(false);
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

  const saveLocalGeminiKey = (value) => {
    setCustomGeminiKey(value);
    try {
      if (value.trim()) window.localStorage.setItem(LOCAL_KEY_STORAGE, value.trim());
      else window.localStorage.removeItem(LOCAL_KEY_STORAGE);
    } catch {
      // Ignore storage quota / privacy mode errors
    }
    setKeySavedNotice(true);
    setTimeout(() => setKeySavedNotice(false), 2000);
  };

  const resetAiChat = () => {
    setAiMessages([INITIAL_AI_MESSAGE]);
    setAiError('');
    setAiPrompt('');
  };

  const applyAiFilters = (suggested) => {
    if (!suggested) return;
    resetFilters();
    if (suggested.keyword) {
      setSearchInput(suggested.keyword);
      setKeyword(suggested.keyword);
    }
    if (suggested.halal === 'true' || suggested.halal === 'false') {
      setHalalFilter(suggested.halal);
    }
    if (suggested.kategoriSlug && facets.categories.some((c) => c.slug === suggested.kategoriSlug)) {
      setSelectedKategori(suggested.kategoriSlug);
    }
    if (suggested.kecamatanSlug && facets.districts.some((d) => d.slug === suggested.kecamatanSlug)) {
      setSelectedKecamatan(suggested.kecamatanSlug);
    }
    setShowFilterDrawer(true);
    setActiveView('beranda');
  };

  // Professional GraphRAG + Structured Output Gemini Call with Exponential Backoff
  const askGeminiCulinary = async (e, presetQuestion) => {
    if (e) e.preventDefault();
    const question = (presetQuestion !== undefined ? presetQuestion : aiPrompt).trim();
    if (!question || aiLoading) return;

    setAiOpen(true);
    const userMsg = { role: 'user', text: question };
    const nextMessages = [...aiMessages, userMsg];
    setAiMessages(nextMessages);
    if (presetQuestion === undefined) setAiPrompt('');
    setAiLoading(true);
    setAiError('');

    const catalog = allDishes.length ? allDishes : results.length ? results : DEMO_DISHES;
    const retrieved = retrieveGraphContext(question, catalog);

    const groundedCatalog = retrieved
      .map(
        (d) =>
          `- slug: ${d.slug} | nama: ${d.nama} | kategori: ${d.kategori} (${d.kategoriSlug || ''}) | budaya: ${d.budaya} | halal: ${d.isHalal ? 'Ya' : 'Tidak'} | pedas: ${d.tingkatKepedasan}/5 | harga: ${d.kisaranHarga} | waktu: ${d.waktuSajian || '-'} | rasa: ${d.rasaDominan || '-'} | tempat: ${d.restoran?.nama} (${d.restoran?.kecamatan}, ${d.restoran?.kawasan || ''}) | bahan: ${(d.bahanUtama || []).join(', ')}`
      )
      .join('\n');

    const validCategories = facets.categories.map((c) => `${c.slug} (${c.label})`).join(', ');
    const validDistricts = facets.districts.map((d) => `${d.slug} (${d.label})`).join(', ');

    const systemInstruction = [
      'Kamu adalah Asisten Kuliner profesional untuk platform Ranah KulMed (direktori kuliner Kota Medan).',
      'Jawab selalu dalam Bahasa Indonesia yang ramah, ringkas, dan persuasif.',
      'ATURAN KETAT (ZERO HALLUCINATION):',
      '1. Rekomendasikan 1 hingga 4 hidangan TERBAIK yang HANYA berasal dari daftar KATALOG TERVERIFIKASI di bawah ini. Gunakan nilai `slug` persis seperti di katalog.',
      '2. Jelaskan alasan singkat (1-2 kalimat) yang menonjolkan cita rasa, bahan/rempah, kecocokan budget/halal, dan lokasi.',
      '3. Isi `suggestedFilters` hanya jika relevan dengan pertanyaan pengguna, menggunakan `halal` ("true", "false", atau ""), `keyword`, `kategoriSlug` dari daftar kategori valid, dan `kecamatanSlug` dari daftar kecamatan valid.',
      '4. Berikan 2 sampai 3 `followUpQuestions` singkat yang natural untuk melanjutkan eksplorasi.',
      '',
      `KATEGORI VALID: ${validCategories || '-'}`,
      `KECAMATAN VALID: ${validDistricts || '-'}`,
      '',
      'KATALOG TERVERIFIKASI MEDAN SEARCH:',
      groundedCatalog,
    ].join('\n');

    const historyTurns = nextMessages.slice(-6).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const effectiveApiKey = customGeminiKey.trim() || GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(effectiveApiKey)}`;

    const payload = {
      contents: historyTurns,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: GEMINI_RESPONSE_SCHEMA,
      },
    };

    try {
      let data = null;
      const delays = [1000, 2000, 4000];

      for (let attempt = 0; attempt <= delays.length; attempt++) {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 429 || res.status >= 500) {
          if (attempt < delays.length) {
            await new Promise((r) => setTimeout(r, delays[attempt]));
            continue;
          }
        }

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error?.message || `HTTP ${res.status}`);
        }
        data = json;
        break;
      }

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Respons AI kosong.');
      }

      const parsed = JSON.parse(rawText);
      const catalogMap = new Map(catalog.map((d) => [d.slug, d]));

      const verifiedRecs = (parsed.recommendations || [])
        .filter((rec) => rec && (catalogMap.has(rec.slug) || rec.nama))
        .slice(0, 4)
        .map((rec) => {
          const match =
            catalogMap.get(rec.slug) ||
            catalog.find((d) => d.nama.toLowerCase() === String(rec.nama || '').toLowerCase());
          return {
            slug: match ? match.slug : rec.slug,
            nama: match ? match.nama : rec.nama,
            alasan: rec.alasan || '',
            estimasiHarga: match ? match.kisaranHarga : rec.estimasiHarga || '',
            lokasi: match
              ? `${match.restoran?.nama || ''} · ${match.restoran?.kecamatan || 'Medan'}`
              : rec.lokasi || '',
          };
        });

      const sf = parsed.suggestedFilters || {};
      const hasSuggestedFilter = Boolean(sf.keyword || sf.halal || sf.kategoriSlug || sf.kecamatanSlug);

      setAiMessages([
        ...nextMessages,
        {
          role: 'model',
          text: parsed.summary || 'Berikut rekomendasi kuliner Medan pilihan untukmu:',
          recommendations: verifiedRecs,
          suggestedFilters: hasSuggestedFilter ? sf : null,
          followUpQuestions: (parsed.followUpQuestions || []).slice(0, 3),
          isFallback: false,
        },
      ]);
    } catch {
      const fallback = buildLocalFallbackReply(question, retrieved);
      setAiMessages([...nextMessages, { role: 'model', ...fallback }]);
      setAiError(
        'Mode lokal aktif: untuk jawaban AI generatif penuh saat berjalan di localhost, masukkan API Key gratis Google AI Studio di menu Pengaturan.'
      );
    } finally {
      setAiLoading(false);
    }
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

  const hasActiveFilter = Boolean(
    keyword ||
      selectedKategori ||
      selectedBudaya ||
      selectedKecamatan ||
      selectedKawasan ||
      selectedTeknik ||
      selectedWaktu ||
      maxHargaFilter ||
      halalFilter
  );

  const searchSuggestions = useMemo(() => {
    const query = searchInput.trim().toLocaleLowerCase();
    if (!query) return [];

    return (allDishes.length ? allDishes : DEMO_DISHES)
      .filter((dish) => String(dish.nama || '').toLocaleLowerCase().includes(query))
      .slice(0, 8);
  }, [allDishes, searchInput]);

  const fullCatalog = useMemo(() => {
    const base = allDishes.length ? allDishes : DEMO_DISHES;
    // Utamakan 60 kuliner ikonik asli Medan terlebih dahulu sebelum 300 varian tambahan
    return [...base].sort((a, b) => {
      const aExtra = String(a.slug || '').startsWith('KulinerTambahan') ? 1 : 0;
      const bExtra = String(b.slug || '').startsWith('KulinerTambahan') ? 1 : 0;
      if (aExtra !== bExtra) return aExtra - bExtra;
      return (b.restoran?.rating || 0) - (a.restoran?.rating || 0);
    });
  }, [allDishes]);

  const matchingSearchResults = useMemo(() => {
    const q = searchInput.trim().toLocaleLowerCase();
    if (!q) return results;
    return results.filter((dish) =>
      [
        dish.nama,
        dish.namaEn,
        dish.deskripsi,
        dish.kategori,
        dish.budaya,
        dish.restoran?.nama,
        dish.restoran?.kecamatan,
        dish.restoran?.kawasan,
        ...(dish.bahanUtama || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()
        .includes(q)
    );
  }, [results, searchInput]);

  const activePool = hasActiveFilter ? matchingSearchResults : fullCatalog;
  const displayedResults = activePool.slice(0, visibleCount);
  const favoriteDishes = fullCatalog.filter((d) => favorites.includes(d.slug));

  const sidebarItems = [
    { id: 'beranda', label: 'Beranda', icon: OrganicHomeIcon },
    { id: 'eksplorasi', label: 'Eksplorasi', icon: OrganicExploreIcon },
    { id: 'kategori', label: 'Kategori', icon: OrganicCategoryIcon },
    { id: 'riwayat', label: 'Riwayat', icon: OrganicHistoryIcon },
    { id: 'favorit', label: 'Favorit', icon: OrganicBookmarkIcon, count: favorites.length },
    { id: 'pengaturan', label: 'Pengaturan', icon: OrganicSettingsIcon },
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
            src={resolveDishImage(item)}
            alt={item.nama}
            loading="lazy"
            onError={(e) => {
              if (item.gambar && e.currentTarget.src !== item.gambar) {
                e.currentTarget.src = item.gambar;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm ${
              item.isHalal ? 'bg-emerald-500/95 text-white' : 'bg-rose-500/95 text-white'
            }`}
          >
            {item.isHalal ? <OrganicHalalLeafIcon className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {item.isHalal ? 'Halal' : 'Non-Halal'}
          </span>

          <button
            onClick={(e) => toggleFavorite(e, item.slug)}
            title="Simpan ke Favorit"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav ? 'bg-[#1d63ed] text-white shadow-md' : 'bg-white/85 text-slate-700 hover:bg-white'
            }`}
          >
            <OrganicBookmarkIcon className="w-3.5 h-3.5" filled={isFav} />
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
                  darkMode ? 'text-slate-100 group-hover:text-sky-400' : 'text-slate-900 group-hover:text-[#1d63ed]'
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
                  darkMode ? 'bg-slate-800 text-sky-300' : 'bg-[#eef4ff] text-[#1d63ed]'
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
            className="text-left focus:outline-none cursor-pointer"
          >
            <RanahKulMedLogo size="md" darkMode={darkMode} />
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
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
            onClick={() => setActiveView('beranda')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden group ${
              darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-sky-500/50'
                : 'bg-gradient-to-br from-[#eef4ff] to-[#e0ecff] border-blue-200/60 hover:shadow-md'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-3">
              <OrganicSpiceCompassIcon className="w-5 h-5 text-[#1d63ed] dark:text-sky-400" />
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
                <RanahKulMedLogo size="md" darkMode={darkMode} />
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

        {/* TOP BAR (Theme Toggle & Ranah KulMed Avatar) */}
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
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200/90 text-slate-600 hover:text-[#1d63ed] shadow-xs'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`h-5 w-px ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Ranah KulMed Team Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setTeamMenuOpen((o) => !o);
                }}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                      <Users className="w-3.5 h-3.5" /> Tim Kreator Ranah KulMed
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      Platform Direktori &amp; Eksplorasi Kuliner Kota Medan
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      {[
                        'Farel Yamotaro Hia',
                        'Yabesh Day Siahaan',
                        'Ray Nathan Geereno Saragih',
                        'William Fransisco Sihotang',
                        'Naufal Muhammad Dzaki',
                      ].map((member) => (
                        <li
                          key={member}
                          className={`px-2.5 py-1.5 rounded-lg ${
                            darkMode ? 'bg-slate-800/70 text-slate-200' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {member}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ==================== VIEW 1: BERANDA (MINIMALIST HERO + AI + CATALOG) ==================== */}
        {activeView === 'beranda' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-6 pb-14">
            {/* Centered Hero Branding */}
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="flex justify-center mb-4">
                <RanahKulMedLogo size="lg" darkMode={darkMode} />
              </div>
              <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Temukan kuliner khas Medan, cita rasa legendaris, bahan rempah pilihan, hingga lokasi terbaik di seluruh
                21 kecamatan Kota Medan dengan lebih cepat dan akurat.
              </p>
            </div>

            {/* Pill Search Bar */}
            <form onSubmit={executeSearchSubmit} className="relative max-w-3xl mx-auto mb-4">
              <div
                className={`flex items-center rounded-full border p-1.5 pl-5 transition-all ${
                  darkMode
                    ? 'bg-slate-900/95 border-slate-700 focus-within:border-sky-400 shadow-lg'
                    : 'bg-white border-slate-200/90 focus-within:border-[#1d63ed] shadow-[0_10px_30px_rgba(29,99,237,0.08)]'
                }`}
              >
                <OrganicSearchIcon className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setKeyword(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setShowSearchSuggestions(false)}
                  aria-autocomplete="list"
                  aria-controls="kuliner-search-suggestions"
                  aria-expanded={showSearchSuggestions && Boolean(searchInput.trim())}
                  placeholder="Cari nama kuliner Medan..."
                  className={`flex-1 bg-transparent text-sm outline-none ${
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
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer((s) => !s)}
                  title="Filter Lanjutan"
                  className={`p-2.5 rounded-full mr-1.5 transition-colors cursor-pointer ${
                    showFilterDrawer
                      ? 'bg-[#e8f0fe] text-[#1d63ed] dark:bg-sky-500/20 dark:text-sky-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <OrganicFilterIcon className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1d63ed] to-[#1e40af] hover:from-blue-500 hover:to-blue-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>Cari</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {showSearchSuggestions && searchInput.trim() && (
                <div
                  id="kuliner-search-suggestions"
                  role="listbox"
                  aria-label="Hasil pencarian kuliner"
                  className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border shadow-xl ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  {searchSuggestions.length ? (
                    searchSuggestions.map((dish) => {
                      const name = String(dish.nama || '');
                      const query = searchInput.trim();
                      const matchStart = name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
                      const matchEnd = matchStart + query.length;

                      return (
                        <button
                          key={dish.slug}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeSearchSubmit(null, name)}
                          className={`block w-full px-5 py-3 text-left text-sm transition-colors ${
                            darkMode
                              ? 'text-slate-200 hover:bg-slate-800'
                              : 'text-slate-700 hover:bg-blue-50'
                          }`}
                        >
                          {name.slice(0, matchStart)}
                          <span className="rounded-sm bg-blue-100 font-semibold text-[#1d63ed] dark:bg-sky-500/20 dark:text-sky-300">
                            {name.slice(matchStart, matchEnd)}
                          </span>
                          {name.slice(matchEnd)}
                        </button>
                      );
                    })
                  ) : (
                    <p role="status" className={`px-5 py-3 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Tidak ada kuliner yang cocok.
                    </p>
                  )}
                </div>
              )}
            </form>

            {/* Pencarian Populer Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-500 mr-1">
                <OrganicSpiceFlameIcon className="w-4 h-4 text-orange-500" /> Pencarian Populer:
              </span>
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => executeSearchSubmit(null, tag)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-sky-400 hover:text-sky-300'
                      : 'bg-white/90 border-blue-100 text-[#1d63ed] hover:bg-[#e8f0fe] shadow-2xs'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* AI Culinary Concierge Card (GraphRAG + Structured Output) */}
            <div
              className={`max-w-3xl mx-auto mb-8 rounded-2xl border p-4 sm:p-5 transition-all ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-800 shadow-lg'
                  : 'bg-white/95 border-blue-200/80 shadow-[0_8px_28px_rgba(29,99,237,0.07)]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      darkMode
                        ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                        : 'bg-amber-50/90 border-amber-200/80 text-amber-700'
                    }`}
                  >
                    <OrganicCulinaryBowlIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Asisten Kuliner AI Ranah KulMed
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rekomendasi personal sesuai budget, status halal, bahan rempah, dan lokasi di Medan.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {aiOpen && aiMessages.length > 1 && (
                    <button
                      type="button"
                      onClick={resetAiChat}
                      title="Mulai obrolan baru"
                      className={`p-2 rounded-full border transition-colors cursor-pointer ${
                        darkMode
                          ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'border-slate-200 text-slate-500 hover:text-[#1d63ed] hover:bg-blue-50'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAiOpen((prev) => !prev)}
                    className="px-4 py-2 rounded-full bg-[#e8f0fe] hover:bg-blue-100 dark:bg-sky-500/15 dark:hover:bg-sky-500/25 text-[#1d63ed] dark:text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {aiOpen ? 'Sembunyikan' : 'Tanya Asisten AI'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {aiOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3.5">
                      <div
                        className={`max-h-[420px] overflow-y-auto rounded-2xl p-3.5 space-y-4 text-xs ${
                          darkMode ? 'bg-slate-950/90 border border-slate-800' : 'bg-[#f6f9ff] border border-slate-200/80'
                        }`}
                      >
                        {aiMessages.map((msg, i) => {
                          const catalogLookup = allDishes.length ? allDishes : results.length ? results : DEMO_DISHES;
                          return (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-line ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-r from-[#1d63ed] to-[#1e40af] text-white shadow-xs'
                                    : darkMode
                                    ? 'bg-slate-900 text-slate-200 border border-slate-800'
                                    : 'bg-white text-slate-700 border border-slate-200/80 shadow-2xs'
                                }`}
                              >
                                {msg.text}
                              </div>

                              {/* Interactive Grounded Culinary Recommendation Cards */}
                              {msg.role === 'model' && msg.recommendations?.length > 0 && (
                                <div className="w-full max-w-[96%] grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                                  {msg.recommendations.map((rec, rIdx) => {
                                    const fullDish = catalogLookup.find((d) => d.slug === rec.slug);
                                    return (
                                      <button
                                        key={`${rec.slug}-${rIdx}`}
                                        type="button"
                                        onClick={() => {
                                          if (fullDish) openDishDetail(fullDish);
                                          else executeSearchSubmit(null, rec.nama);
                                        }}
                                        className={`group text-left p-2.5 rounded-xl border transition-all flex gap-3 items-start cursor-pointer ${
                                          darkMode
                                            ? 'bg-slate-900 border-slate-800 hover:border-sky-400'
                                            : 'bg-white border-slate-200/90 hover:border-[#1d63ed] shadow-2xs hover:shadow-sm'
                                        }`}
                                      >
                                        {resolveDishImage(fullDish) ? (
                                          <img
                                            src={resolveDishImage(fullDish)}
                                            alt={rec.nama}
                                            loading="lazy"
                                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                                          />
                                        ) : (
                                          <div className="w-14 h-14 rounded-lg bg-[#e8f0fe] text-[#1d63ed] flex items-center justify-center shrink-0">
                                            <Utensils className="w-5 h-5" />
                                          </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center justify-between gap-1">
                                            <p
                                              className={`font-bold text-xs truncate group-hover:text-[#1d63ed] dark:group-hover:text-sky-400 ${
                                                darkMode ? 'text-white' : 'text-slate-900'
                                              }`}
                                            >
                                              {rec.nama}
                                            </p>
                                            {fullDish && (
                                              <span
                                                className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                                                  fullDish.isHalal
                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                                }`}
                                              >
                                                {fullDish.isHalal ? 'Halal' : 'Non-Halal'}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                                            {rec.alasan}
                                          </p>
                                          <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px]">
                                            <span className="font-semibold text-[#1d63ed] dark:text-sky-400 truncate">
                                              {rec.estimasiHarga}
                                            </span>
                                            <span className="text-slate-400 truncate max-w-[52%]">{rec.lokasi}</span>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* 1-Click Apply Suggested Filters + Dynamic Follow-Up Chips */}
                              {msg.role === 'model' && (msg.suggestedFilters || msg.followUpQuestions?.length > 0) && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                  {msg.suggestedFilters && (
                                    <button
                                      type="button"
                                      onClick={() => applyAiFilters(msg.suggestedFilters)}
                                      className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-[#1d63ed] text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                      <Filter className="w-3 h-3" /> Terapkan ke Filter Pencarian
                                    </button>
                                  )}
                                  {i === aiMessages.length - 1 &&
                                    (msg.followUpQuestions || []).map((sample) => (
                                      <button
                                        key={sample}
                                        type="button"
                                        disabled={aiLoading}
                                        onClick={() => askGeminiCulinary(null, sample)}
                                        className={`text-[11px] px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                                          darkMode
                                            ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-sky-400'
                                            : 'bg-white border-blue-200/80 text-slate-700 hover:border-[#1d63ed] hover:text-[#1d63ed]'
                                        }`}
                                      >
                                        {sample}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {aiLoading && (
                          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200/70 dark:border-slate-800 text-[11px] text-[#1d63ed] dark:text-sky-400 font-medium">
                            <OrganicCulinaryBowlIcon className="w-4 h-4 animate-pulse" /> Mencocokkan katalog kuliner Medan untukmu...
                          </div>
                        )}
                        <div ref={aiChatEndRef} />
                      </div>

                      {aiError && (
                        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300">
                          <span>{aiError}</span>
                          <button
                            type="button"
                            onClick={() => setActiveView('pengaturan')}
                            className="font-bold underline shrink-0 cursor-pointer"
                          >
                            Buka Pengaturan
                          </button>
                        </div>
                      )}

                      <form onSubmit={askGeminiCulinary} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Tanya bebas: misal 'Makan malam halal di Kesawan di bawah 50rb'..."
                          className={`flex-1 rounded-full border px-4 py-2.5 text-xs outline-none ${
                            darkMode
                              ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-sky-400'
                              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1d63ed]'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={aiLoading || !aiPrompt.trim()}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1d63ed] to-[#1e40af] hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim</span>
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expandable Multi-Facet Filter Bar */}
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

                      <select
                        value={selectedWaktu}
                        onChange={(e) => setSelectedWaktu(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua Waktu Sajian</option>
                        {(facets.servingTimes || []).map((w) => (
                          <option key={w.slug} value={w.slug}>
                            {w.label} ({w.count})
                          </option>
                        ))}
                      </select>

                      <select
                        value={maxHargaFilter}
                        onChange={(e) => setMaxHargaFilter(e.target.value)}
                        className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                          darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="">Semua Budget Harga</option>
                        <option value="20000">Hemat (Mulai ≤ Rp 20.000)</option>
                        <option value="35000">Terjangkau (Mulai ≤ Rp 35.000)</option>
                        <option value="50000">Menengah (Mulai ≤ Rp 50.000)</option>
                        <option value="100000">Keluarga / Oleh-Oleh (≤ Rp 100.000)</option>
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
                    {searchInput.trim()
                      ? `Hasil Pencarian (${matchingSearchResults.length})`
                      : hasActiveFilter
                        ? `Hasil Filter (${results.length})`
                        : `Rekomendasi Kuliner Pilihan di Medan (${fullCatalog.length} Hidangan)`}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih hidangan untuk melihat detail racikan rempah, jam buka, lokasi peta, dan padanan menu terbaik.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowMapView((m) => !m)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      showMapView
                        ? 'bg-[#1d63ed] border-[#1d63ed] text-white shadow-xs'
                        : darkMode
                          ? 'bg-slate-900 border-slate-700 text-sky-300 hover:border-sky-400'
                          : 'bg-white border-blue-200 text-[#1d63ed] hover:bg-blue-50 shadow-2xs'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {showMapView ? 'Sembunyikan Peta' : 'Peta Kuliner Medan'}
                  </button>
                  {hasActiveFilter && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-semibold text-[#1d63ed] dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {showMapView && (
                <div className="mb-6">
                  <MedanCulinaryMap dishes={activePool} onSelectDish={openDishDetail} darkMode={darkMode} />
                </div>
              )}

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
                  {displayedResults.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {displayedResults.map(renderDishCard)}
                    </div>
                  ) : hasActiveFilter ? (
                    <p role="status" className={`rounded-2xl border p-6 text-center text-sm ${
                      darkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'
                    }`}>
                      {searchInput.trim()
                        ? 'Tidak ada kuliner yang cocok dengan pencarian.'
                        : 'Tidak ada kuliner yang cocok dengan filter ini.'}
                    </p>
                  ) : null}

                  {visibleCount < activePool.length && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => setVisibleCount((c) => c + 12)}
                        className={`px-6 py-2.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          darkMode
                            ? 'bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800'
                            : 'bg-white border-blue-200 text-[#1d63ed] hover:bg-blue-50 shadow-xs'
                        }`}
                      >
                        Muat Lebih Banyak ({activePool.length - visibleCount} kuliner lainnya)
                      </button>
                      <button
                        onClick={() => setVisibleCount(activePool.length)}
                        className="px-6 py-2.5 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        Tampilkan Semua ({activePool.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        )}

        {/* ==================== VIEW 2: EKSPLORASI (FULL CATALOG) ==================== */}
        {activeView === 'eksplorasi' && (
          <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Jelajah Lengkap Kuliner Medan
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Saring pilihan kuliner berdasarkan kategori hidangan, warisan budaya, waktu sajian, budget harga, 21 kecamatan, hingga peta lokasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMapView((m) => !m)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  showMapView
                    ? 'bg-[#1d63ed] border-[#1d63ed] text-white shadow-xs'
                    : darkMode
                      ? 'bg-slate-900 border-slate-700 text-sky-300 hover:border-sky-400'
                      : 'bg-white border-blue-200 text-[#1d63ed] hover:bg-blue-50 shadow-xs'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {showMapView ? 'Sembunyikan Peta Lokasi' : 'Buka Peta 21 Kecamatan'}
              </button>
            </div>

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

                <select
                  value={selectedWaktu}
                  onChange={(e) => setSelectedWaktu(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Waktu Sajian</option>
                  {(facets.servingTimes || []).map((w) => (
                    <option key={w.slug} value={w.slug}>
                      {w.label} ({w.count})
                    </option>
                  ))}
                </select>

                <select
                  value={maxHargaFilter}
                  onChange={(e) => setMaxHargaFilter(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-xs outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Semua Budget Harga</option>
                  <option value="20000">≤ Rp 20.000</option>
                  <option value="35000">≤ Rp 35.000</option>
                  <option value="50000">≤ Rp 50.000</option>
                  <option value="100000">≤ Rp 100.000</option>
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

                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset ({activePool.length} hasil)
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

            {showMapView && (
              <div className="mb-6">
                <MedanCulinaryMap dishes={activePool} onSelectDish={openDishDetail} darkMode={darkMode} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedResults.map(renderDishCard)}
            </div>

            {visibleCount < activePool.length && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setVisibleCount((c) => c + 24)}
                  className="px-6 py-2.5 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Tampilkan Lebih Banyak ({activePool.length - visibleCount} tersisa)
                </button>
                <button
                  onClick={() => setVisibleCount(activePool.length)}
                  className={`px-6 py-2.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800'
                      : 'bg-white border-blue-200 text-[#1d63ed] hover:bg-blue-50 shadow-xs'
                  }`}
                >
                  Tampilkan Semua ({activePool.length})
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
                Kategori Sajian Khas Medan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {facets.categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedKategori(cat.slug);
                      setActiveView('eksplorasi');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
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
                Warisan Budaya Kuliner Sumatera Utara
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {facets.cultures.map((cult) => (
                  <button
                    key={cult.slug}
                    onClick={() => {
                      setSelectedBudaya(cult.slug);
                      setActiveView('eksplorasi');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      darkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-amber-500'
                        : 'bg-white border-slate-200/90 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cult.label}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                        {cult.count} hidangan khas
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
                  className="text-xs text-rose-500 font-semibold hover:underline cursor-pointer"
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
                {(allDishes.length ? allDishes : DEMO_DISHES).map((r) => (
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
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-xs font-bold text-white shadow-xs cursor-pointer"
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
                      <p className="text-xs text-slate-400">Tidak ada data yang cocok.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ==================== VIEW 8: PORTAL MITRA & API ==================== */}
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
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedText === ONTOLOGY_URI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { method: 'GET', path: '/api/health', desc: 'Cek status koneksi layanan data & statistik katalog kuliner.' },
                { method: 'GET', path: '/api/facets', desc: 'Ambil daftar dinamis kategori, budaya, 21 kecamatan & kawasan.' },
                { method: 'GET', path: '/api/search?keyword=Soto&includeNeighbors=true', desc: 'Pencarian multi-filter & perluasan radius kecamatan sekitar.' },
                { method: 'GET', path: '/api/culinary/:slug', desc: 'Detail hidangan, pasangan cocok, cabang resmi & rekomendasi serupa.' },
                { method: 'GET', path: '/api/graph?focus=SotoMedan', desc: 'Ekstraksi jejaring keterhubungan bahan, budaya, dan lokasi.' },
                { method: 'POST', path: '/api/sparql', desc: 'Eksekusi kueri analitik SPARQL 1.1 read-only ke basis data.' },
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

        {/* ==================== VIEW 9: PENGATURAN & INFO ==================== */}
        {activeView === 'pengaturan' && (
          <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 pt-2 pb-12 space-y-6">
            <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Pengaturan &amp; Tentang Ranah KulMed
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
                className="px-4 py-2 rounded-full bg-[#1d63ed] text-white text-xs font-semibold cursor-pointer"
              >
                {darkMode ? 'Gunakan Light Mode' : 'Gunakan Dark Mode'}
              </button>
            </div>

            <div
              className={`rounded-2xl border p-5 space-y-3 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <KeyRound className="w-4 h-4 text-[#1d63ed]" /> Konfigurasi Asisten AI (Gemini API Gratis)
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Saat dijalankan di laptop lokal (<code className="font-mono">localhost</code>), masukkan API Key gratis
                    dari Google AI Studio agar Asisten AI aktif penuh. Key disimpan lokal di browser dan tidak pernah
                    dikirim ke GitHub.
                  </p>
                </div>
                {keySavedNotice && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold shrink-0">
                    Tersimpan
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={(e) => saveLocalGeminiKey(e.target.value)}
                  placeholder="Opsional untuk localhost: AIza..."
                  className={`flex-1 rounded-xl border px-3.5 py-2 text-xs font-mono outline-none ${
                    darkMode
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#1d63ed]'
                  }`}
                />
                {customGeminiKey && (
                  <button
                    type="button"
                    onClick={() => saveLocalGeminiKey('')}
                    className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                  >
                    Hapus Key
                  </button>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ==================== FOOTER ==================== */}
        <footer
          className={`relative z-10 mt-auto border-t px-4 sm:px-8 py-4 text-xs ${
            darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white border-slate-200/80 text-slate-500'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RanahKulMedLogo size="sm" darkMode={darkMode} />
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span>© 2026 Ranah KulMed. Semua hak dilindungi.</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 font-medium">
              <button onClick={() => setActiveView('pengaturan')} className="hover:text-[#1d63ed] cursor-pointer">
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
                <span className="text-emerald-600 dark:text-emerald-400">Online · Katalog Aktif</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Mode Pratinjau</span>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* ==================== CULINARY DETAIL MODAL ==================== */}
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
                <img
                  src={resolveDishImage(selectedDish)}
                  alt={selectedDish.nama}
                  onError={(e) => {
                    if (selectedDish.gambar && e.currentTarget.src !== selectedDish.gambar) {
                      e.currentTarget.src = selectedDish.gambar;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <button
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md cursor-pointer"
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
                        className="px-3 py-1 rounded-full bg-[#eef4ff] dark:bg-sky-500/15 text-[#1d63ed] dark:text-sky-300 text-xs font-medium hover:bg-blue-100 cursor-pointer"
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
                            const match = (allDishes.length ? allDishes : results).find((r) => r.slug === p.slug);
                            if (match) openDishDetail(match);
                          }}
                          className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-medium cursor-pointer"
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
                    <p className="text-xs text-[#1d63ed] dark:text-sky-400 font-bold">Rekomendasi Tempat Terbaik</p>
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
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedDish.restoran.nama}, ${selectedDish.restoran.alamat}, Medan`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#1d63ed] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Compass className="w-4 h-4" /> Buka Google Maps
                  </a>
                </div>

                {selectedDish.restoran?.lat > 0 && selectedDish.restoran?.long > 0 && (
                  <MedanCulinaryMap singleDish={selectedDish} darkMode={darkMode} heightClass="h-44" />
                )}

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
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${b.nama}, ${b.alamat}, Medan`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 p-2 rounded-full text-[#1d63ed] hover:bg-blue-50 dark:hover:bg-sky-500/15"
                            title="Buka cabang di Google Maps"
                          >
                            <Compass className="w-4 h-4" />
                          </a>
                          <span className="text-amber-500 font-bold shrink-0">★ {b.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dishExtra?.linkedData && (
                  <div
                    className={`p-4 rounded-2xl border space-y-2 text-xs ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/50 border-amber-200/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" /> Wawasan Linked Open Data (owl:sameAs)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        {dishExtra.linkedData.source}
                      </span>
                    </div>
                    <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {dishExtra.linkedData.abstract}
                    </p>
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
                            const match = (allDishes.length ? allDishes : results).find((r) => r.slug === rec.slug);
                            if (match) openDishDetail(match);
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            darkMode
                              ? 'bg-slate-950 border-slate-800 hover:border-sky-500'
                              : 'bg-slate-50 border-slate-200 hover:border-[#1d63ed]'
                          }`}
                        >
                          <img
                            src={resolveDishImage(rec)}
                            alt={rec.nama}
                            loading="lazy"
                            onError={(e) => {
                              if (rec.gambar && e.currentTarget.src !== rec.gambar) {
                                e.currentTarget.src = rec.gambar;
                              }
                            }}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
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

      {/* Floating Quick Summon Button for AI Assistant outside Beranda */}
      {activeView !== 'beranda' && (
        <button
          type="button"
          onClick={() => {
            setActiveView('beranda');
            setAiOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#1d63ed] to-[#1e40af] hover:from-blue-500 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <OrganicCulinaryBowlIcon className="w-4 h-4" />
          <span>Tanya Asisten AI</span>
        </button>
      )}
    </div>
  );
}