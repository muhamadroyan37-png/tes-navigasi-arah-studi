// Radar/spider chart dengan SVG murni. Menggambarkan TRAIT (bukan kategori).
const RadarChart = {
  // container: elemen tempat chart digambar
  // traits: array dari Scoring.calculate().traits (butuh name, percent, percentage)
  render(container, traits) {
    const NS = "http://www.w3.org/2000/svg";
    const W = 440, H = 380, CX = 220, CY = 190, R = 105;
    const n = traits.length;
    const levels = [25, 50, 75, 100];

    function make(tag, attrs) {
      const node = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    function angle(i) { return -Math.PI / 2 + (i * 2 * Math.PI) / n; }

    // titik pada sumbu ke-i, pada jarak radius tertentu
    function point(i, radius) {
      return [CX + radius * Math.cos(angle(i)), CY + radius * Math.sin(angle(i))];
    }

    function polygonPoints(radiusOf) {
      return traits.map(function (t, i) { return point(i, radiusOf(t)).join(","); }).join(" ");
    }

    const summary = traits.map(function (t) { return t.name + " " + t.percentage + "%"; }).join(", ");
    const svg = make("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": "Radar chart profil trait: " + summary
    });

    // cincin 25/50/75/100%
    levels.forEach(function (level) {
      svg.appendChild(make("polygon", {
        points: polygonPoints(function () { return (R * level) / 100; }),
        class: "radar-ring"
      }));
    });

    // garis sumbu
    traits.forEach(function (t, i) {
      const p = point(i, R);
      svg.appendChild(make("line", { x1: CX, y1: CY, x2: p[0], y2: p[1], class: "radar-axis" }));
    });

    // area data
    svg.appendChild(make("polygon", {
      points: polygonPoints(function (t) { return (R * t.percent) / 100; }),
      class: "radar-area"
    }));

    // titik data
    traits.forEach(function (t, i) {
      const p = point(i, (R * t.percent) / 100);
      svg.appendChild(make("circle", { cx: p[0], cy: p[1], r: 4.5, class: "radar-dot" }));
    });

    // label: nama trait + persentase
    traits.forEach(function (t, i) {
      const cos = Math.cos(angle(i));
      const sin = Math.sin(angle(i));
      const p = point(i, R + 22);
      const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
      const y = sin < -0.5 ? p[1] - 14 : sin > 0.5 ? p[1] + 10 : p[1] - 4;

      const text = make("text", { x: p[0], y: y, "text-anchor": anchor, class: "radar-label" });
      const name = make("tspan", { x: p[0], class: "radar-name" });
      name.textContent = t.name;
      const value = make("tspan", { x: p[0], dy: 16, class: "radar-value" });
      value.textContent = t.percentage + "%";
      text.append(name, value);
      svg.appendChild(text);
    });

    container.innerHTML = "";
    container.appendChild(svg);
  }
};