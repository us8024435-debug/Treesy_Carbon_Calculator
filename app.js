// ═══════════════════════════════════════════════
// TREESY — Travel CO₂ Offset Calculator
// ═══════════════════════════════════════════════

// ─────────────────────────────────────────────
// ADMIN SETTINGS & EMISSION FACTORS
// ─────────────────────────────────────────────
const TRANSPORT_MODES = {
  flight: { label: "✈️  Flight", emoji: "✈️" },
  bus: { label: "🚌  Bus", emoji: "🚌" },
  car: { label: "🚗  Car", emoji: "🚗" },
  train: { label: "🚆  Train", emoji: "🚆" },
  ferry: { label: "⛴️  Ferry", emoji: "⛴️" },
};

const DEFAULT_CONFIG = {
  flight_short: 0.255, // < 1500 km
  flight_long: 0.195, // >= 1500 km
  bus: 0.089,
  car: 0.171,
  train: 0.041,
  ferry: 0.019,
  hotel: 30.9,
  tree: 100
};

let CONFIG = { ...DEFAULT_CONFIG };

function loadConfig() {
  const saved = localStorage.getItem('treesy_config');
  if (saved) {
    try {
      CONFIG = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch(e) {}
  }
}

function initAdminSettings() {
  document.getElementById('set-flight-short').value = CONFIG.flight_short;
  document.getElementById('set-flight-long').value = CONFIG.flight_long;
  document.getElementById('set-bus').value = CONFIG.bus;
  document.getElementById('set-car').value = CONFIG.car;
  document.getElementById('set-train').value = CONFIG.train;
  document.getElementById('set-ferry').value = CONFIG.ferry;
  document.getElementById('set-hotel').value = CONFIG.hotel;
  document.getElementById('set-tree').value = CONFIG.tree;
}

function openSettings() {
  initAdminSettings();
  document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function saveSettings() {
  const readNumberOrDefault = (inputId, fallback) => {
    const raw = document.getElementById(inputId)?.value;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  // Allow valid 0 values (do not use `||`).
  CONFIG.flight_short = readNumberOrDefault('set-flight-short', DEFAULT_CONFIG.flight_short);
  CONFIG.flight_long = readNumberOrDefault('set-flight-long', DEFAULT_CONFIG.flight_long);
  CONFIG.bus = readNumberOrDefault('set-bus', DEFAULT_CONFIG.bus);
  CONFIG.car = readNumberOrDefault('set-car', DEFAULT_CONFIG.car);
  CONFIG.train = readNumberOrDefault('set-train', DEFAULT_CONFIG.train);
  CONFIG.ferry = readNumberOrDefault('set-ferry', DEFAULT_CONFIG.ferry);
  CONFIG.hotel = readNumberOrDefault('set-hotel', DEFAULT_CONFIG.hotel);
  CONFIG.tree = readNumberOrDefault('set-tree', DEFAULT_CONFIG.tree);
  
  localStorage.setItem('treesy_config', JSON.stringify(CONFIG));
  closeSettings();
  recalculate();
}

function resetSettings() {
  CONFIG = { ...DEFAULT_CONFIG };
  localStorage.removeItem('treesy_config');
  initAdminSettings();
  saveSettings();
}

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
// AUTOCOMPLETE AND FETCH LOCATIONS
// ─────────────────────────────────────────────
let debounceTimer;
async function fetchLocations(query, dropdownEl, segmentIdx, fieldType) {
  if (!query || query.length < 2) {
    dropdownEl.classList.remove('active');
    return;
  }
  
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      dropdownEl.innerHTML = data.results.map(loc => `
        <div class="autocomplete-item" onclick="selectLocation(${segmentIdx}, '${fieldType}', '${loc.name.replace(/'/g, "\\'")}', ${loc.latitude}, ${loc.longitude}, '${(loc.admin1 ? (loc.admin1.replace(/'/g, "\\'") + ', ') : '') + loc.country.replace(/'/g, "\\'")}')">
          <div class="item-main">${loc.name}</div>
          <div class="item-sub">${(loc.admin1 ? loc.admin1 + ', ' : '') + loc.country}</div>
        </div>
      `).join('');
      dropdownEl.classList.add('active');
    } else {
      dropdownEl.innerHTML = `<div class="autocomplete-item"><div class="item-sub">No results found</div></div>`;
      dropdownEl.classList.add('active');
    }
  } catch (e) {
    console.error(e);
  }
}

function onLocationInput(inputEl, segmentIdx, fieldType) {
  const dropdownEl = inputEl.nextElementSibling;
  
  segments[segmentIdx][fieldType + 'Lat'] = null;
  segments[segmentIdx][fieldType + 'Lon'] = null;
  segments[segmentIdx][fieldType + 'Name'] = inputEl.value;
  recalculate();

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchLocations(inputEl.value, dropdownEl, segmentIdx, fieldType);
  }, 300);
}

function selectLocation(segmentIdx, fieldType, name, lat, lon, sub) {
  segments[segmentIdx][fieldType + 'Name'] = name + (sub ? ` (${sub.split(',').pop().trim()})` : '');
  segments[segmentIdx][fieldType + 'Lat'] = lat;
  segments[segmentIdx][fieldType + 'Lon'] = lon;
  
  // Close any open dropdowns
  document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.remove('active'));
  
  renderSegments();
  recalculate();
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.autocomplete-wrapper')) {
    document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.remove('active'));
  }
});

// ─────────────────────────────────────────────
// SEGMENT MANAGEMENT
// ─────────────────────────────────────────────
function addSegment() {
  segments.push({ fromName: "", fromLat: null, fromLon: null, toName: "", toLat: null, toLon: null, mode: "flight", stayNights: 0 });
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
      <div class="field-group autocomplete-wrapper">
        <label>From</label>
        <input type="text" placeholder="e.g. Copenhagen"
               value="${seg.fromName}"
               oninput="onLocationInput(this, ${i}, 'from')"
               autocomplete="off">
        <div class="autocomplete-dropdown"></div>
      </div>
      <div class="field-group autocomplete-wrapper">
        <label>To</label>
        <input type="text" placeholder="e.g. Nairobi"
               value="${seg.toName}"
               oninput="onLocationInput(this, ${i}, 'to')"
               autocomplete="off">
        <div class="autocomplete-dropdown"></div>
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
  let flightsCO2 = 0;
  let accommodationCO2 = 0;
  let groundCO2 = 0;
  const breakdownRows = [];
  let hasValidSegment = false;

  segments.forEach((seg, i) => {
    let transportCO2 = 0;
    let stayCO2 = 0;
    let distance = 0;
    let formula = [];

    if (seg.fromLat && seg.fromLon && seg.toLat && seg.toLon) {
      distance = haversine(seg.fromLat, seg.fromLon, seg.toLat, seg.toLon);

      // Flight routing multiplier (great-circle × 1.1)
      const effectiveDistance =
        seg.mode === "flight" ? distance * 1.1 : distance;

      let factor;
      let factorLabel;
      if (seg.mode === "flight") {
        factor =
          distance < 1500
            ? CONFIG.flight_short
            : CONFIG.flight_long;
        factorLabel = distance < 1500 ? "short-haul" : "long-haul";
      } else {
        factor = CONFIG[seg.mode] || 0;
        factorLabel = seg.mode;
      }

      transportCO2 = effectiveDistance * factor;
      if (seg.mode === "flight") {
        flightsCO2 += transportCO2;
      } else {
        groundCO2 += transportCO2;
      }

      // Build transport formula
      const distStr = Math.round(distance).toLocaleString();
      if (seg.mode === "flight") {
        formula.push(`${distStr} km × 1.1 × ${factor} kg/km = ${Math.round(transportCO2).toLocaleString()} kg`);
      } else {
        formula.push(`${distStr} km × ${factor} kg/km = ${Math.round(transportCO2).toLocaleString()} kg`);
      }

      hasValidSegment = true;
    }

    stayCO2 = (seg.stayNights || 0) * CONFIG.hotel;
    accommodationCO2 += stayCO2;

    // Build stay formula
    if (seg.stayNights > 0) {
      formula.push(`${seg.stayNights} night${seg.stayNights > 1 ? "s" : ""} × ${CONFIG.hotel} kg/night = ${Math.round(stayCO2).toLocaleString()} kg`);
    }

    const segmentTotal = transportCO2 + stayCO2;
    totalCO2 += segmentTotal;

    if (seg.fromLat && seg.fromLon && seg.toLat && seg.toLon) {
      breakdownRows.push({
        label: `${seg.fromName} → ${seg.toName}`,
        type: TRANSPORT_MODES[seg.mode]?.emoji || "—",
        distance: Math.round(distance),
        transportCO2: Math.round(transportCO2),
        stayCO2: Math.round(stayCO2),
        total: Math.round(segmentTotal),
        formula: formula,
      });
    } else if (seg.stayNights > 0) {
      breakdownRows.push({
        label: `${seg.fromName || "?"} → ${seg.toName || "?"}`,
        type: "🏨",
        distance: "—",
        transportCO2: 0,
        stayCO2: Math.round(stayCO2),
        total: Math.round(stayCO2),
        formula: formula,
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
      <td class="formula-cell">${r.formula.map(f => `<div class="formula-line">${f}</div>`).join("")}</td>
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

  // Category breakdown (does not affect calculations)
  const fmtKg = (v) => `${Math.round(v).toLocaleString()} kg CO₂e`;
  const elFlights = document.getElementById("cat-flights");
  const elAccommodation = document.getElementById("cat-accommodation");
  const elGround = document.getElementById("cat-ground");
  const elTotal = document.getElementById("cat-total");
  if (elFlights) elFlights.textContent = fmtKg(flightsCO2);
  if (elAccommodation) elAccommodation.textContent = fmtKg(accommodationCO2);
  if (elGround) elGround.textContent = fmtKg(groundCO2);
  if (elTotal) elTotal.innerHTML = `<strong>${fmtKg(totalCO2)}</strong>`;

  const offsetCO2 = totalCO2 * (offsetPercent / 100);
  const trees = Math.ceil(offsetCO2 / CONFIG.tree);

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
    const from = seg.fromName || "?";
    const to = seg.toName || "?";
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
// INITIALIZATION
// ─────────────────────────────────────────────
function init() {
  loadConfig();

  // Pre-load Charlie's example trip
  segments = [
    { fromName: "Copenhagen", fromLat: 55.6761, fromLon: 12.5683, toName: "Nairobi", toLat: -1.2921, toLon: 36.8219, mode: "flight", stayNights: 4 },
    { fromName: "Nairobi", fromLat: -1.2921, fromLon: 36.8219, toName: "Kilimanjaro", toLat: -3.4294, toLon: 37.0742, mode: "flight", stayNights: 2 },
    {
      fromName: "Kilimanjaro", fromLat: -3.4294, fromLon: 37.0742,
      toName: "Dar es Salaam", toLat: -6.7924, toLon: 39.2083,
      mode: "bus",
      stayNights: 4,
    },
    { fromName: "Dar es Salaam", fromLat: -6.7924, fromLon: 39.2083, toName: "Copenhagen", toLat: 55.6761, toLon: 12.5683, mode: "flight", stayNights: 0 },
  ];

  renderSegments();
  syncOffsetUI();
  recalculate();
}

init();

// ─────────────────────────────────────────────
// METHODOLOGY TOGGLE
// ─────────────────────────────────────────────
function toggleMethodology() {
  const btn = document.getElementById("methodology-toggle");
  const content = document.getElementById("methodology-content");
  if (!btn || !content) return;

  const isOpen = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", (!isOpen).toString());

  // Smooth open/close without external libs
  if (isOpen) {
    content.style.maxHeight = content.scrollHeight + "px";
    content.hidden = false;
    requestAnimationFrame(() => {
      content.style.maxHeight = "0px";
    });
    const onEnd = (e) => {
      if (e.propertyName !== "max-height") return;
      content.hidden = true;
      content.style.maxHeight = "";
      content.removeEventListener("transitionend", onEnd);
    };
    content.addEventListener("transitionend", onEnd);
  } else {
    content.hidden = false;
    content.style.maxHeight = "0px";
    requestAnimationFrame(() => {
      content.style.maxHeight = content.scrollHeight + "px";
    });
    const onEnd = (e) => {
      if (e.propertyName !== "max-height") return;
      // Keep an explicit max-height so CSS doesn't collapse it back to 0
      content.style.maxHeight = content.scrollHeight + "px";
      content.removeEventListener("transitionend", onEnd);
    };
    content.addEventListener("transitionend", onEnd);
  }
}
