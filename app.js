// ═══════════════════════════════════════════════
// TREESY — Travel CO₂ Offset Calculator
// ═══════════════════════════════════════════════

// ─────────────────────────────────────────────
// CITY COORDINATES DATABASE
// ─────────────────────────────────────────────
const CITIES = {
  copenhagen: { lat: 55.6761, lon: 12.5683, name: "Copenhagen" },
  nairobi: { lat: -1.2921, lon: 36.8219, name: "Nairobi" },
  jro: { lat: -3.4294, lon: 37.0742, name: "Kilimanjaro (JRO)" },
  kilimanjaro: { lat: -3.4294, lon: 37.0742, name: "Kilimanjaro (JRO)" },
  "dar es salaam": { lat: -6.7924, lon: 39.2083, name: "Dar es Salaam" },
  london: { lat: 51.5074, lon: -0.1278, name: "London" },
  "new york": { lat: 40.7128, lon: -74.006, name: "New York" },
  paris: { lat: 48.8566, lon: 2.3522, name: "Paris" },
  berlin: { lat: 52.52, lon: 13.405, name: "Berlin" },
  amsterdam: { lat: 52.3676, lon: 4.9041, name: "Amsterdam" },
  stockholm: { lat: 59.3293, lon: 18.0686, name: "Stockholm" },
  oslo: { lat: 59.9139, lon: 10.7522, name: "Oslo" },
  helsinki: { lat: 60.1699, lon: 24.9384, name: "Helsinki" },
  dubai: { lat: 25.2048, lon: 55.2708, name: "Dubai" },
  tokyo: { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
  singapore: { lat: 1.3521, lon: 103.8198, name: "Singapore" },
  bangkok: { lat: 13.7563, lon: 100.5018, name: "Bangkok" },
  sydney: { lat: -33.8688, lon: 151.2093, name: "Sydney" },
  "cape town": { lat: -33.9249, lon: 18.4241, name: "Cape Town" },
  cairo: { lat: 30.0444, lon: 31.2357, name: "Cairo" },
  "los angeles": { lat: 33.9425, lon: -118.4081, name: "Los Angeles" },
  "san francisco": { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
  miami: { lat: 25.7617, lon: -80.1918, name: "Miami" },
  toronto: { lat: 43.6532, lon: -79.3832, name: "Toronto" },
  "mexico city": { lat: 19.4326, lon: -99.1332, name: "Mexico City" },
  "são paulo": { lat: -23.5505, lon: -46.6333, name: "São Paulo" },
  "sao paulo": { lat: -23.5505, lon: -46.6333, name: "São Paulo" },
  "buenos aires": { lat: -34.6037, lon: -58.3816, name: "Buenos Aires" },
  "rio de janeiro": { lat: -22.9068, lon: -43.1729, name: "Rio de Janeiro" },
  lima: { lat: -12.0464, lon: -77.0428, name: "Lima" },
  bogota: { lat: 4.711, lon: -74.0721, name: "Bogotá" },
  rome: { lat: 41.9028, lon: 12.4964, name: "Rome" },
  madrid: { lat: 40.4168, lon: -3.7038, name: "Madrid" },
  lisbon: { lat: 38.7223, lon: -9.1393, name: "Lisbon" },
  vienna: { lat: 48.2082, lon: 16.3738, name: "Vienna" },
  prague: { lat: 50.0755, lon: 14.4378, name: "Prague" },
  warsaw: { lat: 52.2297, lon: 21.0122, name: "Warsaw" },
  budapest: { lat: 47.4979, lon: 19.0402, name: "Budapest" },
  zurich: { lat: 47.3769, lon: 8.5417, name: "Zurich" },
  munich: { lat: 48.1351, lon: 11.582, name: "Munich" },
  barcelona: { lat: 41.3851, lon: 2.1734, name: "Barcelona" },
  istanbul: { lat: 41.0082, lon: 28.9784, name: "Istanbul" },
  mumbai: { lat: 19.076, lon: 72.8777, name: "Mumbai" },
  delhi: { lat: 28.7041, lon: 77.1025, name: "Delhi" },
  beijing: { lat: 39.9042, lon: 116.4074, name: "Beijing" },
  shanghai: { lat: 31.2304, lon: 121.4737, name: "Shanghai" },
  "hong kong": { lat: 22.3193, lon: 114.1694, name: "Hong Kong" },
  seoul: { lat: 37.5665, lon: 126.978, name: "Seoul" },
  "kuala lumpur": { lat: 3.139, lon: 101.6869, name: "Kuala Lumpur" },
  jakarta: { lat: -6.2088, lon: 106.8456, name: "Jakarta" },
  "addis ababa": { lat: 9.025, lon: 38.7469, name: "Addis Ababa" },
  lagos: { lat: 6.5244, lon: 3.3792, name: "Lagos" },
  accra: { lat: 5.6037, lon: -0.187, name: "Accra" },
  johannesburg: { lat: -26.2041, lon: 28.0473, name: "Johannesburg" },
  casablanca: { lat: 33.5731, lon: -7.5898, name: "Casablanca" },
  zanzibar: { lat: -6.1659, lon: 39.1989, name: "Zanzibar" },
  mombasa: { lat: -4.0435, lon: 39.6682, name: "Mombasa" },
  arusha: { lat: -3.3869, lon: 36.683, name: "Arusha" },
  athens: { lat: 37.9838, lon: 23.7275, name: "Athens" },
  dublin: { lat: 53.3498, lon: -6.2603, name: "Dublin" },
  brussels: { lat: 50.8503, lon: 4.3517, name: "Brussels" },
  milan: { lat: 45.4642, lon: 9.19, name: "Milan" },
  doha: { lat: 25.2854, lon: 51.531, name: "Doha" },
  "abu dhabi": { lat: 24.4539, lon: 54.3773, name: "Abu Dhabi" },
  reykjavik: { lat: 64.1466, lon: -21.9426, name: "Reykjavik" },
  marrakech: { lat: 31.6295, lon: -7.9811, name: "Marrakech" },
  vancouver: { lat: 49.2827, lon: -123.1207, name: "Vancouver" },
  denver: { lat: 39.7392, lon: -104.9903, name: "Denver" },
  chicago: { lat: 41.8781, lon: -87.6298, name: "Chicago" },
  "washington dc": { lat: 38.9072, lon: -77.0369, name: "Washington DC" },
  boston: { lat: 42.3601, lon: -71.0589, name: "Boston" },
  seattle: { lat: 47.6062, lon: -122.3321, name: "Seattle" },
  honolulu: { lat: 21.3069, lon: -157.8583, name: "Honolulu" },
  bali: { lat: -8.3405, lon: 115.092, name: "Bali" },
  phuket: { lat: 7.8804, lon: 98.3923, name: "Phuket" },
  maldives: { lat: 3.2028, lon: 73.2207, name: "Maldives" },
  cancun: { lat: 21.1619, lon: -86.8515, name: "Cancún" },
  havana: { lat: 23.1136, lon: -82.3666, name: "Havana" },
  moscow: { lat: 55.7558, lon: 37.6173, name: "Moscow" },
  "st petersburg": { lat: 59.9343, lon: 30.3351, name: "St. Petersburg" },
  kampala: { lat: 0.3476, lon: 32.5825, name: "Kampala" },
  kigali: { lat: -1.9403, lon: 29.8739, name: "Kigali" },
  lusaka: { lat: -15.3875, lon: 28.3228, name: "Lusaka" },
  maputo: { lat: -25.9692, lon: 32.5732, name: "Maputo" },
  windhoek: { lat: -22.5609, lon: 17.0658, name: "Windhoek" },
  dakar: { lat: 14.7167, lon: -17.4677, name: "Dakar" },
  tunis: { lat: 36.8065, lon: 10.1815, name: "Tunis" },
  melbourne: { lat: -37.8136, lon: 144.9631, name: "Melbourne" },
  auckland: { lat: -36.8485, lon: 174.7633, name: "Auckland" },
  fiji: { lat: -17.7134, lon: 178.065, name: "Fiji" },
  colombo: { lat: 6.9271, lon: 79.8612, name: "Colombo" },
  kathmandu: { lat: 27.7172, lon: 85.324, name: "Kathmandu" },
};

// ─────────────────────────────────────────────
// EMISSION FACTORS
// ─────────────────────────────────────────────
const TRANSPORT_MODES = {
  flight: { label: "✈️  Flight", emoji: "✈️" },
  bus: { label: "🚌  Bus", emoji: "🚌" },
  car: { label: "🚗  Car", emoji: "🚗" },
  train: { label: "🚆  Train", emoji: "🚆" },
  ferry: { label: "⛴️  Ferry", emoji: "⛴️" },
};

const EMISSION_FACTORS = {
  flight_short: 0.255, // < 1500 km
  flight_long: 0.195, // >= 1500 km
  bus: 0.089,
  car: 0.171,
  train: 0.041,
  ferry: 0.019,
};

const HOTEL_CO2_PER_NIGHT = 30.9; // kg CO₂
const CO2_PER_TREE = 100; // kg CO₂ per tree

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let segments = [];
let offsetPercent = 100;

// ─────────────────────────────────────────────
// HAVERSINE DISTANCE (km)
// ─────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─────────────────────────────────────────────
// LOOKUP CITY (fuzzy prefix match)
// ─────────────────────────────────────────────
function lookupCity(input) {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  if (CITIES[key]) return CITIES[key];
  for (const [k, v] of Object.entries(CITIES)) {
    if (k.startsWith(key) || v.name.toLowerCase().startsWith(key)) return v;
  }
  return null;
}

// ─────────────────────────────────────────────
// SEGMENT MANAGEMENT
// ─────────────────────────────────────────────
function addSegment() {
  segments.push({ from: "", to: "", mode: "flight", stayNights: 0 });
  renderSegments();
  recalculate();
}

function removeSegment(idx) {
  segments.splice(idx, 1);
  renderSegments();
  recalculate();
}

function updateSegment(idx, field, value) {
  if (field === "stayNights") {
    segments[idx][field] = Math.max(0, parseInt(value) || 0);
  } else {
    segments[idx][field] = value;
  }
  recalculate();
}

// ─────────────────────────────────────────────
// RENDER SEGMENTS
// ─────────────────────────────────────────────
function renderSegments() {
  const list = document.getElementById("segments-list");

  list.innerHTML = segments
    .map(
      (seg, i) => `
    <div class="segment" data-index="${i}">
      <div class="field-group">
        <label>From</label>
        <input type="text" placeholder="e.g. Copenhagen"
               value="${seg.from}"
               oninput="updateSegment(${i}, 'from', this.value)"
               list="city-list" autocomplete="off">
      </div>
      <div class="field-group">
        <label>To</label>
        <input type="text" placeholder="e.g. Nairobi"
               value="${seg.to}"
               oninput="updateSegment(${i}, 'to', this.value)"
               list="city-list" autocomplete="off">
      </div>
      <div class="field-group">
        <label>Transport</label>
        <select onchange="updateSegment(${i}, 'mode', this.value)">
          ${Object.entries(TRANSPORT_MODES)
            .map(
              ([k, v]) =>
                `<option value="${k}" ${seg.mode === k ? "selected" : ""}>${v.label}</option>`,
            )
            .join("")}
        </select>
      </div>
      <div class="field-group">
        <label>Stay (nights)</label>
        <input type="number" min="0" max="365" placeholder="0"
               value="${seg.stayNights || ""}"
               oninput="updateSegment(${i}, 'stayNights', this.value)">
      </div>
      <button class="btn-remove" onclick="removeSegment(${i})" title="Remove segment">✕</button>
    </div>
  `,
    )
    .join("");
}

// ─────────────────────────────────────────────
// RECALCULATE EMISSIONS
// ─────────────────────────────────────────────
function recalculate() {
  let totalCO2 = 0;
  const breakdownRows = [];
  let hasValidSegment = false;

  segments.forEach((seg, i) => {
    const fromCity = lookupCity(seg.from);
    const toCity = lookupCity(seg.to);

    let transportCO2 = 0;
    let stayCO2 = 0;
    let distance = 0;

    if (fromCity && toCity) {
      distance = haversine(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon);

      // Flight routing multiplier (great-circle × 1.1)
      const effectiveDistance =
        seg.mode === "flight" ? distance * 1.1 : distance;

      let factor;
      if (seg.mode === "flight") {
        factor =
          distance < 1500
            ? EMISSION_FACTORS.flight_short
            : EMISSION_FACTORS.flight_long;
      } else {
        factor = EMISSION_FACTORS[seg.mode] || 0;
      }

      transportCO2 = effectiveDistance * factor;
      hasValidSegment = true;
    }

    stayCO2 = (seg.stayNights || 0) * HOTEL_CO2_PER_NIGHT;

    const segmentTotal = transportCO2 + stayCO2;
    totalCO2 += segmentTotal;

    if (fromCity && toCity) {
      breakdownRows.push({
        label: `${fromCity.name} → ${toCity.name}`,
        type: TRANSPORT_MODES[seg.mode]?.emoji || "—",
        distance: Math.round(distance),
        transportCO2: Math.round(transportCO2),
        stayCO2: Math.round(stayCO2),
        total: Math.round(segmentTotal),
      });
    } else if (seg.stayNights > 0) {
      breakdownRows.push({
        label: `${seg.from || "?"} → ${seg.to || "?"}`,
        type: "🏨",
        distance: "—",
        transportCO2: 0,
        stayCO2: Math.round(stayCO2),
        total: Math.round(stayCO2),
      });
      hasValidSegment = true;
    }
  });

  // Show / hide result cards
  const breakdownCard = document.getElementById("breakdown-card");
  const resultsCard = document.getElementById("results-card");

  if (hasValidSegment) {
    breakdownCard.style.display = "block";
    resultsCard.style.display = "block";
  } else {
    breakdownCard.style.display = "none";
    resultsCard.style.display = "none";
    return;
  }

  // Render breakdown table
  const tbody = document.getElementById("breakdown-body");
  tbody.innerHTML = breakdownRows
    .map(
      (r) => `
    <tr>
      <td>${r.label}</td>
      <td>${r.type}${r.stayCO2 > 0 ? " + 🏨" : ""}</td>
      <td>${typeof r.distance === "number" ? r.distance.toLocaleString() + " km" : r.distance}</td>
      <td class="co2-cell">${r.total.toLocaleString()} kg</td>
    </tr>
  `,
    )
    .join("");

  document.getElementById("breakdown-total").innerHTML =
    `<span>Total Emissions</span><span>${Math.round(totalCO2).toLocaleString()} kg CO₂</span>`;

  // Result tiles
  document.getElementById("total-kg").textContent =
    Math.round(totalCO2).toLocaleString();

  const offsetCO2 = totalCO2 * (offsetPercent / 100);
  const trees = Math.ceil(offsetCO2 / CO2_PER_TREE);

  document.getElementById("total-trees").textContent = trees.toLocaleString();

  // Carbon badge
  const badge = document.getElementById("carbon-badge");
  if (offsetPercent > 100) {
    badge.innerHTML = `<div class="badge-carbon-positive">🌟 Carbon Positive</div>`;
  } else if (offsetPercent === 100) {
    badge.innerHTML = `<div class="badge-carbon-positive">✅ Carbon Neutral</div>`;
  } else {
    badge.innerHTML = "";
  }

  // Tree visualization (cap at 50 icons)
  const visual = document.getElementById("trees-visual");
  const displayTrees = Math.min(trees, 50);
  visual.innerHTML =
    Array.from(
      { length: displayTrees },
      (_, i) =>
        `<span class="tree-icon" style="animation-delay:${i * 30}ms">🌳</span>`,
    ).join("") +
    (trees > 50
      ? `<span style="color:var(--text-muted);font-size:13px;margin-left:8px;">+${trees - 50} more</span>`
      : "");
}

// ─────────────────────────────────────────────
// OFFSET CONTROLS
// ─────────────────────────────────────────────
function onSliderChange(val) {
  offsetPercent = parseInt(val);
  syncOffsetUI();
  recalculate();
}

function onCustomPctChange(val) {
  const v = Math.max(0, parseInt(val) || 0);
  offsetPercent = v;
  document.getElementById("offset-slider").value = Math.min(v, 200);
  syncOffsetUI();
  recalculate();
}

function setOffset(pct) {
  offsetPercent = pct;
  document.getElementById("offset-slider").value = Math.min(pct, 200);
  document.getElementById("custom-pct").value = pct;
  syncOffsetUI();
  recalculate();
}

function syncOffsetUI() {
  document.getElementById("offset-pct-display").textContent =
    offsetPercent + "%";
  document.getElementById("custom-pct").value = offsetPercent;

  // Slider fill bar
  const fillPct = Math.min((offsetPercent / 200) * 100, 100);
  document.getElementById("slider-fill").style.width = fillPct + "%";

  // Active quick-select button
  document.querySelectorAll(".quick-btn").forEach((btn) => {
    const btnVal = parseInt(btn.textContent);
    btn.classList.toggle("active", btnVal === offsetPercent);
  });
}

// ─────────────────────────────────────────────
// COPY SUMMARY TO CLIPBOARD
// ─────────────────────────────────────────────
function copySummary() {
  const totalKg = document.getElementById("total-kg").textContent;
  const trees = document.getElementById("total-trees").textContent;

  let summary = `🌍 Travel CO₂ Offset Summary — Treesy\n`;
  summary += `${"─".repeat(44)}\n\n`;

  segments.forEach((seg, i) => {
    const fromCity = lookupCity(seg.from);
    const toCity = lookupCity(seg.to);
    const from = fromCity?.name || seg.from || "?";
    const to = toCity?.name || seg.to || "?";
    const mode = TRANSPORT_MODES[seg.mode]?.label || seg.mode;
    summary += `${i + 1}. ${from} → ${to} (${mode})`;
    if (seg.stayNights > 0)
      summary += ` + ${seg.stayNights} night${seg.stayNights > 1 ? "s" : ""} stay`;
    summary += `\n`;
  });

  summary += `\n📊 Total emissions: ${totalKg} kg CO₂\n`;
  summary += `🌳 Offset: ${offsetPercent}% = ${trees} trees via Treesy\n`;

  if (offsetPercent > 100) {
    summary += `🌟 This trip is Carbon Positive!\n`;
  } else if (offsetPercent === 100) {
    summary += `✅ This trip is Carbon Neutral!\n`;
  }

  summary += `\n─────────────────────────────────\n`;
  summary += `Powered by Treesy — treesy.earth\n`;

  navigator.clipboard.writeText(summary).then(() => {
    const btn = document.getElementById("btn-copy");
    btn.innerHTML = "✅ Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = "📋 Copy Summary to Clipboard";
      btn.classList.remove("copied");
    }, 2000);
  });
}

// ─────────────────────────────────────────────
// DATALIST FOR CITY AUTOCOMPLETE
// ─────────────────────────────────────────────
function createDatalist() {
  const dl = document.createElement("datalist");
  dl.id = "city-list";
  const seen = new Set();
  Object.values(CITIES).forEach((c) => {
    if (!seen.has(c.name)) {
      const opt = document.createElement("option");
      opt.value = c.name;
      dl.appendChild(opt);
      seen.add(c.name);
    }
  });
  document.body.appendChild(dl);
}

// ─────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────
function init() {
  createDatalist();

  // Pre-load Charlie's example trip
  segments = [
    { from: "Copenhagen", to: "Nairobi", mode: "flight", stayNights: 4 },
    { from: "Nairobi", to: "Kilimanjaro (JRO)", mode: "flight", stayNights: 2 },
    {
      from: "Kilimanjaro (JRO)",
      to: "Dar es Salaam",
      mode: "bus",
      stayNights: 4,
    },
    { from: "Dar es Salaam", to: "Copenhagen", mode: "flight", stayNights: 0 },
  ];

  renderSegments();
  syncOffsetUI();
  recalculate();
}

init();
