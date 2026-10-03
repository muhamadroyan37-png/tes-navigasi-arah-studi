// Logika halaman tes: tampilkan pertanyaan, simpan jawaban, navigasi.
const ANSWERS_KEY = "navstudi_answers";

const state = {
  questions: [],
  index: 0,
  answers: {} // { [questionId]: answerId }
};

const el = {
  status: document.getElementById("status"),
  area: document.getElementById("test-area"),
  counter: document.getElementById("counter"),
  progress: document.querySelector(".progress"),
  bar: document.getElementById("progress-bar"),
  question: document.getElementById("question-text"),
  answers: document.getElementById("answers"),
  prev: document.getElementById("prev-btn"),
  next: document.getElementById("next-btn")
};

function renderQuestion() {
  const total = state.questions.length;
  const number = state.index + 1;
  const question = state.questions[state.index];
  const selected = state.answers[question.id];

  // 👉 Putar sound effect saat pertanyaan baru ditampilkan
  if (typeof SoundManager !== "undefined") {
    SoundManager.playQuestionSFX();
  }

  // Nomor + progress bar
  const percent = Math.round((number / total) * 100);
  el.counter.textContent = "Pertanyaan " + number + " dari " + total;
  el.bar.style.width = percent + "%";
  el.progress.setAttribute("aria-valuenow", percent);

  // Teks pertanyaan
  el.question.textContent = question.question;

    // Pilihan jawaban (radio button asli agar bisa dipakai dengan keyboard)
  el.answers.innerHTML = "";
  question.answers.forEach(function (answer) {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = answer.id;
    input.checked = answer.id === selected;
    input.addEventListener("change", function () {
      selectAnswer(question.id, answer.id);
    });

    const box = document.createElement("div");
    box.className = "option-box";

    // Jika jawaban memiliki gambar valid, render elemen gambar
    if (answer.image && answer.image.trim() !== "") {
      const img = document.createElement("img");
      img.className = "option-img";
      img.src = answer.image;
      img.alt = answer.text;
      box.appendChild(img);
    }

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = answer.text;

    // 👉 Masukkan text ke dalam box, lalu masukkan box ke dalam label
    box.appendChild(text);
    label.append(input, box);
    el.answers.appendChild(label);
  });

  // Tombol
  el.prev.disabled = state.index === 0;
  el.next.disabled = selected === undefined;
  el.next.textContent = number === total ? "Lihat Hasil" : "Selanjutnya";
}

function selectAnswer(questionId, answerId) {
  state.answers[questionId] = answerId;
  el.next.disabled = false;
}

function goPrevious() {
  if (state.index > 0) {
    state.index--;
    renderQuestion();
    el.question.focus();
  }
}

function goNext() {
  const question = state.questions[state.index];
  if (state.answers[question.id] === undefined) return; // wajib pilih jawaban

  if (state.index === state.questions.length - 1) {
    finishTest();
  } else {
    state.index++;
    renderQuestion();
    el.question.focus();
  }
}

function finishTest() {
  // Simpan jawaban agar bisa dihitung di halaman hasil
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(state.answers));
  window.location.href = "result.html";
}

async function init() {
  try {
    const questions = await DataLoader.loadJSON("data/questions.json");
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Daftar pertanyaan kosong.");
    }
    state.questions = questions;
    el.status.hidden = true;
    el.area.hidden = false;
    el.prev.addEventListener("click", goPrevious);
    el.next.addEventListener("click", goNext);
    renderQuestion();
  } catch (error) {
    console.error(error);
    el.status.textContent =
      "Pertanyaan tidak dapat dimuat. Jalankan proyek lewat server lokal " +
      "(misalnya Live Server di VS Code), bukan dengan membuka file langsung.";
  }
}

init();