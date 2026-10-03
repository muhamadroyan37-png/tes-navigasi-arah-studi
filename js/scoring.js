// Mesin penilaian dua langkah:
//   Langkah 1: jawaban -> skor trait
//   Langkah 2: trait   -> skor kategori (memakai trait_weights)
const Scoring = {
  // answers: { [questionId]: answerId }
  // data:    { questions, traits, categories } (isi file JSON)
  calculate(answers, data) {
    const traits = this.calculateTraits(answers, data.questions, data.traits);
    const categories = this.calculateCategories(traits, data.categories);
    return {
      primary: categories[0],
      secondary: categories[1],
      categories: categories,
      traits: traits
    };
  },

  // Langkah 1: jumlahkan skor semua jawaban yang dipilih untuk tiap trait
  calculateTraits(answers, questions, traitDefs) {
    const totals = {};
    traitDefs.forEach(function (t) { totals[t.id] = 0; });

    questions.forEach(function (question) {
      const chosen = question.answers.find(function (a) {
        return a.id === answers[question.id];
      });
      if (!chosen) return; // pertanyaan belum dijawab / jawaban tidak dikenal

      Object.keys(chosen.scores).forEach(function (traitId) {
        if (traitId in totals) totals[traitId] += chosen.scores[traitId];
      });
    });

    // persentase = skor / skor maksimum x 100
    return traitDefs.map(function (t) {
      const score = totals[t.id];
      const ratio = t.max_score > 0 ? score / t.max_score : 0;
      const percent = Math.min(100, Math.max(0, ratio * 100));
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        score: score,
        max: t.max_score,
        percent: percent,                   // belum dibulatkan (untuk perhitungan)
        percentage: Math.round(percent)     // dibulatkan (untuk ditampilkan)
      };
    });
  },

  // Langkah 2: skor kategori = jumlah (bobot trait x persentase trait)
  // Memakai persentase (bukan skor mentah) agar trait dengan skor maksimum
  // lebih besar tidak otomatis lebih menguntungkan kategori tertentu.
  calculateCategories(traits, categoryDefs) {
    const percentById = {};
    traits.forEach(function (t) { percentById[t.id] = t.percent; });

    const results = categoryDefs.map(function (cat) {
      let score = 0;
      Object.keys(cat.trait_weights).forEach(function (traitId) {
        score += cat.trait_weights[traitId] * (percentById[traitId] || 0);
      });
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        majors: cat.majors || [],
        score: score,
        percentage: Math.round(score)
      };
    });

    // urutkan dari skor tertinggi (sort stabil: seri mengikuti urutan di JSON)
    return results.sort(function (a, b) { return b.score - a.score; });
  }
};

// Agar bisa diuji di Node.js; tidak berpengaruh di browser.
if (typeof module !== "undefined") module.exports = Scoring;