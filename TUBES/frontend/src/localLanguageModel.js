const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';
const MODEL_REVISION = '79346d370dfae34801d26993fda9ae2372900fd0';

let generatorPromise;

async function getGenerator(onProgress) {
  if (!generatorPromise) {
    generatorPromise = (async () => {
      if (!navigator.gpu) {
        throw new Error('Browser ini tidak mendukung WebGPU. Gunakan Chrome atau Edge terbaru pada perangkat yang mendukung WebGPU.');
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('Perangkat tidak menyediakan adapter WebGPU. Asisten lokal tidak dapat menjalankan model di perangkat ini.');
      }

      const { env, pipeline } = await import('@huggingface/transformers');
      env.allowRemoteModels = true;
      env.useBrowserCache = true;
      env.useWasmCache = true;

      return pipeline('text-generation', MODEL_ID, {
        revision: MODEL_REVISION,
        device: 'webgpu',
        dtype: 'q4f16',
        progress_callback: (progress) => {
          if (progress.status === 'progress_total') {
            onProgress(`Mengunduh model lokal: ${Math.round(progress.progress)}%`);
          } else if (progress.status === 'ready') {
            onProgress('Model siap. Menyusun jawaban...');
          } else if (progress.status === 'initiate' || progress.status === 'download') {
            onProgress('Menyiapkan model Qwen3 (unduhan awal sekitar 543 MB)...');
          }
        },
      });
    })().catch((error) => {
      generatorPromise = undefined;
      throw error;
    });
  }

  return generatorPromise;
}

function formatCatalogContext(dishes) {
  if (!dishes.length) return 'Katalog tidak menemukan hidangan yang cocok.';

  return dishes.slice(0, 3).map((dish, index) => {
    const facts = [
      `Nama: ${dish.nama}`,
      dish.deskripsi && `Deskripsi katalog: ${dish.deskripsi}`,
      dish.kategori && `Kategori: ${dish.kategori}`,
      dish.metodeMasak && `Teknik: ${dish.metodeMasak}`,
      dish.rasaDominan && `Rasa: ${dish.rasaDominan}`,
      typeof dish.isHalal === 'boolean' && `Status halal: ${dish.isHalal ? 'Halal' : 'Non-halal'}`,
      dish.kisaranHarga && `Harga: ${dish.kisaranHarga}`,
    ].filter(Boolean);
    return `${index + 1}. ${facts.join('; ')}`;
  }).join('\n');
}

export async function generateLocalAssistantText(question, dishes, onProgress, intent = {}) {
  const generator = await getGenerator(onProgress);
  onProgress('Model siap. Menyusun jawaban...');
  const intentStyle = intent.wantsWarmFood
    ? 'Untuk kedinginan, awali dengan "Kalau sedang kedinginan," lalu sebut nama hidangan dari katalog dan hubungkan dengan fakta memakai frasa "bisa jadi pilihan karena".'
    : intent.wantsCoolingFood
      ? 'Untuk kepanasan, awali dengan "Kalau sedang kepanasan," lalu sebut nama hidangan dari katalog dan hubungkan dengan fakta memakai frasa "bisa jadi pilihan karena".'
      : '';

  const messages = [
    {
      role: 'system',
      content: [
        'Kamu adalah asisten kuliner Ranah KulMed yang menjawab dalam Bahasa Indonesia.',
        'Tanggapi langsung maksud pengguna, bukan proses pencarian. Jika ada kandidat, sebut satu hidangan dan jelaskan alasan kecocokannya.',
        'Tulis tepat dua kalimat pendek, maksimal 35 kata, tanpa Markdown.',
        'Kalimat pertama berisi rekomendasi dan alasan; kalimat kedua hanya mengarahkan pengguna ke kartu tanpa mengulang alasan.',
        'Gunakan kalimat utuh dan Bahasa Indonesia yang alami; jangan menempelkan nama menu dengan deskripsinya tanpa kata penghubung.',
        'Gunakan hanya fakta yang tertulis di konteks katalog; jangan mengarang bahan, rasa, suhu sajian, harga, status halal, atau lokasi.',
        'Jika pengguna menyebut kedinginan, jelaskan kecocokan hanya dari keterangan berkuah, kaldu, atau direbus yang tercantum; jangan mengklaim suhu penyajian.',
        'Jika pengguna menyebut kepanasan, jelaskan kecocokan hanya dari nama atau deskripsi yang secara eksplisit menyebut es, dingin, sirup, atau soda.',
        'Jika tidak ada kandidat, katakan dengan jelas bahwa katalog belum menemukan pilihan yang sesuai dan ajak pengguna memberi preferensi lain; jangan menyebut alasan atau fakta yang tidak ada di katalog.',
        'Jangan menyebut jumlah kandidat atau menjelaskan proses pencarian.',
        intentStyle,
        'Jangan gunakan placeholder, tanda kurung siku, Markdown, atau daftar.',
      ].join(' '),
    },
    {
      role: 'user',
      content: [
        `Pertanyaan: ${question}`,
        intent.description && `Maksud pertanyaan: ${intent.description}`,
        'Fakta katalog yang boleh digunakan:',
        formatCatalogContext(dishes),
        '',
        'Sebut nama hidangan persis seperti di katalog, jelaskan satu fakta yang relevan, lalu arahkan pengguna ke kartu. /no_think',
      ].join('\n'),
    },
  ];

  const output = await generator(messages, {
    max_new_tokens: 80,
    do_sample: false,
  });
  const generated = output[0]?.generated_text;
  const response = Array.isArray(generated) ? generated.at(-1)?.content : generated;
  const rawAnswer = String(response || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<\/?think>/gi, '')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const sentences = (rawAnswer.match(/[^.!?]+[.!?]+/g) || []).slice(0, 2);
  if (sentences.length > 1 && /bisa jadi pilihan|alasan kecocokan/i.test(sentences[1])) {
    sentences.pop();
  }
  const answer = sentences.join(' ').trim();

  if (!answer) {
    throw new Error('Model tidak menghasilkan jawaban. Silakan coba lagi.');
  }

  return answer;
}
