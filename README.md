# Study Direction Assessment

A simple web-based assessment designed to help **high school students explore potential study directions** based on their interests, traits, and preferences.

Users answer a series of questions, and the system analyzes their responses to generate a study-direction profile. The result includes recommended study categories, secondary tendencies, and a visual representation of their traits.

> **Note:** This assessment is intended as a self-exploration and guidance tool, not as a definitive academic or psychological assessment.

## ✨ Features

* Interactive multiple-choice assessment
* Trait-based scoring system
* Main and secondary study-direction categories
* Trait statistics
* Radar/spider chart visualization
* Retake assessment
* Responsive design for desktop and mobile

## 🧠 How It Works

The assessment uses a two-step scoring system:

```text
Questions
    ↓
Answers
    ↓
Trait Scores
    ↓
Study Direction Scores
    ↓
Assessment Result
```

Each answer can contribute to multiple traits with different weights.

For example:

```text
Answer
 ├── Creativity     +5
 ├── Analytical     +3
 └── Adaptability   +2
```

The accumulated traits are then used to determine the user's study-direction categories.

## 🛠️ Tech Stack

* **HTML** — Page structure
* **CSS** — Styling and responsive design
* **JavaScript** — Assessment logic and scoring
* **JSON** — Questions, traits, and study-direction data
* **SVG** — Radar/spider chart
* **Vercel** — Deployment

No backend, database, API, or authentication is required.

## 📁 Project Structure

```text
study-direction-assessment/
├── index.html
├── test.html
├── result.html
│
├── css/
│   ├── style.css
│   ├── test.css
│   └── result.css
│
├── js/
│   ├── data-loader.js
│   ├── test.js
│   ├── scoring.js
│   ├── result.js
│   └── radar-chart.js
│
├── data/
│   ├── questions.json
│   ├── traits.json
│   └── categories.json
│
└── assets/
```

## 🎯 Purpose

This project aims to help high school students gain an initial understanding of their strengths, interests, and tendencies when considering their **future study direction**.

The results can be used as a starting point for further exploration when choosing study programs, fields, or areas of interest.

## 🚀 Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Open the project in a browser or run it using a local development server.

Because this is a static web application, no backend setup or database configuration is required.

## 📌 Disclaimer

The results provided by this application should not be considered a definitive recommendation for a student's academic or career path.

Students are encouraged to use the results as a reference for self-exploration and consider other factors such as personal interests, academic performance, goals, and guidance from parents, teachers, or counselors.

