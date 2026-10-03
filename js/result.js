// Halaman hasil: ambil jawaban -> hitung skor -> tampilkan.
const ANSWERS_KEY = "navstudi_answers";

function byId(id) { return document.getElementById(id); }

function loadAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(ANSWERS_KEY));
  } catch (e) {
    return null;
  }
}

function showMessage(text, showStartLink) {
  byId("status-text").textContent = text;
  byId("start-link").hidden = !showStartLink;
}

// Daftar batang persentase (dipakai untuk trait dan kategori)
function renderBars(listEl, items) {
  listEl.innerHTML = "";
  items.forEach(function (item) {
    const li = document.createElement("li");

    const head = document.createElement("div");
    head.className = "bar-head";
    const name = document.createElement("span");
    name.textContent = item.name;
    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = item.percentage + "%";
    head.append(name, value);

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = item.percentage + "%";
    track.appendChild(fill);

    li.append(head, track);
    listEl.appendChild(li);
  });
}

function renderPrimary(category) {
  byId("primary-name").textContent = category.name;
  byId("primary-percent").textContent = category.percentage + "%";
  byId("primary-desc").textContent = category.description;

  const list = byId("primary-majors");
  list.innerHTML = "";
  category.majors.forEach(function (major) {
    const li = document.createElement("li");
    li.textContent = major;
    list.appendChild(li);
  });
  byId("primary-majors-wrap").hidden = category.majors.length === 0;
}

function renderSecondary(category) {
  byId("secondary-name").textContent = category.name;
  byId("secondary-percent").textContent = category.percentage + "%";
  byId("secondary-desc").textContent = category.description;
}

function renderTopTraits(traits) {
  const list = byId("top-traits");
  list.innerHTML = "";
  traits.slice().sort(function (a, b) { return b.percent - a.percent; })
    .slice(0, 3)
    .forEach(function (trait) {
      const li = document.createElement("li");
      const title = document.createElement("p");
      title.className = "top-trait-title";
      title.textContent = trait.name + " " + trait.percentage + "%";
      const desc = document.createElement("p");
      desc.className = "top-trait-desc";
      desc.textContent = trait.description;
      li.append(title, desc);
      list.appendChild(li);
    });
}

function retakeTest() {
  sessionStorage.removeItem(ANSWERS_KEY);
  window.location.href = "test.html";
}

async function init() {
  const answers = loadAnswers();
  if (!answers) {
    showMessage("Belum ada hasil tes. Selesaikan tes terlebih dahulu.", true);
    return;
  }

  try {
    const data = await DataLoader.loadAll();

    const complete = data.questions.every(function (q) { return answers[q.id] !== undefined; });
    if (!complete) {
      showMessage("Jawabanmu belum lengkap. Selesaikan semua pertanyaan dulu.", true);
      return;
    }

    const result = Scoring.calculate(answers, data);

    renderPrimary(result.primary);
    renderSecondary(result.secondary);
    RadarChart.render(byId("radar"), result.traits);
    renderBars(byId("trait-list"), result.traits);
    renderTopTraits(result.traits);
    renderBars(byId("other-categories"), result.categories.slice(2));

    // 👉 Putar sound effect saat hasil asesmen muncul
    if (typeof SoundManager !== "undefined") {
      SoundManager.playResultSFX();
    }

    byId("retake-btn").addEventListener("click", retakeTest);
    byId("status").hidden = true;
    byId("result").hidden = false;
  } catch (error) {
    console.error(error);
    showMessage(
      "Hasil tidak dapat dimuat. Jalankan proyek lewat server lokal " +
      "(misalnya Live Server di VS Code), bukan dengan membuka file langsung.",
      false
    );
  }
}

init();