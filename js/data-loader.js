// Memuat data JSON. Dipakai oleh halaman tes dan halaman hasil.
const DataLoader = {
  async loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("Gagal memuat " + path + " (status " + response.status + ")");
    }
    return response.json();
  },

  async loadAll() {
    const [questions, traits, categories] = await Promise.all([
      this.loadJSON("data/questions.json"),
      this.loadJSON("data/traits.json"),
      this.loadJSON("data/categories.json")
    ]);
    return { questions, traits, categories };
  }
};