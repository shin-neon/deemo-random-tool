const STORAGE_KEY = "deemoRandomToolSettings.v2";
const DIFFICULTIES = ["Easy", "Normal", "Hard"];

const appTitle = document.getElementById("appTitle");
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-button");
const packModeRadios = document.querySelectorAll('input[name="packMode"]');
const difficultyModeRadios = document.querySelectorAll('input[name="difficultyMode"]');
const packCheckboxArea = document.getElementById("packCheckboxArea");
const difficultyCheckboxArea = document.getElementById("difficultyCheckboxArea");
const minLevelInput = document.getElementById("minLevelInput");
const maxLevelInput = document.getElementById("maxLevelInput");
const randomButton = document.getElementById("randomButton");
const resultCard = document.getElementById("resultCard");
const copyButton = document.getElementById("copyButton");
const searchInput = document.getElementById("searchInput");
const listPackSelect = document.getElementById("listPackSelect");
const songCount = document.getElementById("songCount");
const songList = document.getElementById("songList");

const packMap = new Map(packs.map((pack) => [pack.name, pack]));
let latestResultText = "";

const defaultSettings = {
  packMode: "all",
  selectedPacks: packs.map((pack) => pack.name),
  difficultyMode: "all",
  selectedDifficulties: [...DIFFICULTIES],
  minLevel: 1,
  maxLevel: 11,
  listPack: "all"
};

function initialize() {
  buildPackCheckboxes();
  buildListPackOptions();
  loadSettings();
  refreshConditionalAreas();
  renderSongList();
  bindEvents();
}

function bindEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  [...packModeRadios, ...difficultyModeRadios].forEach((input) => {
    input.addEventListener("change", () => {
      refreshConditionalAreas();
      saveSettings();
    });
  });

  document.querySelectorAll("#packCheckboxArea input, #difficultyCheckboxArea input").forEach((input) => {
    input.addEventListener("change", saveSettings);
  });

  minLevelInput.addEventListener("change", normalizeLevelsAndSave);
  maxLevelInput.addEventListener("change", normalizeLevelsAndSave);
  randomButton.addEventListener("click", handleRandomSelect);
  copyButton.addEventListener("click", handleCopyResult);
  searchInput.addEventListener("input", renderSongList);
  listPackSelect.addEventListener("change", () => {
    renderSongList();
    saveSettings();
  });
}

function switchView(viewId) {
  views.forEach((view) => view.classList.toggle("is-active", view.id === viewId));
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === viewId));

  if (appTitle) {
    appTitle.textContent = viewId === "randomView"
      ? "🗳️抽選箱 |っ・ω・)╮=͟͟͞=͟͟͞＝=͟͟͞=͟͟͞ 💎5 ⛩️"
      : "🎵楽曲一覧🎵";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildPackCheckboxes() {
  packCheckboxArea.innerHTML = packs.map((pack) => `
    <label class="pack-check">
      <input type="checkbox" value="${escapeHtml(pack.name)}" />
      <span>${escapeHtml(pack.name)}</span>
    </label>
  `).join("");
}

function buildListPackOptions() {
  listPackSelect.innerHTML = `<option value="all">全てのパック</option>` + packs.map((pack) => (
    `<option value="${escapeHtml(pack.name)}">${escapeHtml(pack.name)}</option>`
  )).join("");
}

function loadSettings() {
  const saved = getSavedSettings();
  const settings = { ...defaultSettings, ...saved };

  setRadioValue("packMode", settings.packMode);
  setRadioValue("difficultyMode", settings.difficultyMode);
  setCheckedValues("packCheckboxArea", settings.selectedPacks);
  setCheckedValues("difficultyCheckboxArea", settings.selectedDifficulties);
  minLevelInput.value = settings.minLevel;
  maxLevelInput.value = settings.maxLevel;
  listPackSelect.value = settings.listPack;
}

function getSavedSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveSettings() {
  const settings = {
    packMode: getRadioValue("packMode"),
    selectedPacks: getCheckedValues("packCheckboxArea"),
    difficultyMode: getRadioValue("difficultyMode"),
    selectedDifficulties: getCheckedValues("difficultyCheckboxArea"),
    minLevel: clampLevel(Number(minLevelInput.value)),
    maxLevel: clampLevel(Number(maxLevelInput.value)),
    listPack: listPackSelect.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function refreshConditionalAreas() {
  packCheckboxArea.classList.toggle("is-hidden", getRadioValue("packMode") === "all");
  difficultyCheckboxArea.classList.toggle("is-hidden", getRadioValue("difficultyMode") === "all");
}

function normalizeLevelsAndSave() {
  minLevelInput.value = clampLevel(Number(minLevelInput.value));
  maxLevelInput.value = clampLevel(Number(maxLevelInput.value));
  saveSettings();
}

function getCandidateCharts() {
  const packMode = getRadioValue("packMode");
  const difficultyMode = getRadioValue("difficultyMode");
  const selectedPacks = getCheckedValues("packCheckboxArea");
  const selectedDifficulties = getCheckedValues("difficultyCheckboxArea");
  const minLevel = clampLevel(Number(minLevelInput.value));
  const maxLevel = clampLevel(Number(maxLevelInput.value));
  const candidates = [];

  songs.forEach((song) => {
    if (packMode === "custom" && !selectedPacks.includes(song.pack)) return;

    Object.entries(song.difficulties).forEach(([difficulty, level]) => {
      if (difficultyMode === "custom" && !selectedDifficulties.includes(difficulty)) return;
      if (level < minLevel || level > maxLevel) return;
      candidates.push({ ...song, difficulty, level, image: getPackImage(song.pack) });
    });
  });

  return candidates;
}

function handleRandomSelect() {
  normalizeLevelsAndSave();
  const minLevel = Number(minLevelInput.value);
  const maxLevel = Number(maxLevelInput.value);

  if (minLevel > maxLevel) {
    showMessage("最小Lvは最大Lv以下にしてください。", true);
    return;
  }

  if (getRadioValue("packMode") === "custom" && getCheckedValues("packCheckboxArea").length === 0) {
    showMessage("パックを1つ以上選択してください。", true);
    return;
  }

  if (getRadioValue("difficultyMode") === "custom" && getCheckedValues("difficultyCheckboxArea").length === 0) {
    showMessage("難易度を1つ以上選択してください。", true);
    return;
  }

  const candidates = getCandidateCharts();
  if (candidates.length === 0) {
    showMessage("条件に合う曲がありません。", true);
    return;
  }

  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  latestResultText = `[抽選結果] ${selected.title} / ${selected.artist} / ${selected.difficulty} Lv${selected.level}`;

  resultCard.classList.remove("is-empty");
  resultCard.innerHTML = `
    <div class="result-layout">
      <img class="result-image" src="${escapeHtml(selected.image)}" alt="${escapeHtml(selected.pack)}" />
      <div class="result-body">
        <span class="result-badge">${escapeHtml(selected.difficulty)} Lv${selected.level}</span>
        <h3 class="result-title">${escapeHtml(selected.title)}</h3>
        <p class="result-meta">${escapeHtml(selected.artist)}<br>${escapeHtml(selected.pack)}</p>
      </div>
    </div>
  `;
  copyButton.disabled = false;
}

function showMessage(message, isError = false) {
  resultCard.classList.add("is-empty");
  resultCard.innerHTML = `<p class="empty-text" style="color:${isError ? "var(--danger)" : "var(--muted)"}">${escapeHtml(message)}</p>`;
  copyButton.disabled = true;
  latestResultText = "";
}

async function handleCopyResult() {
  if (!latestResultText) return;

  try {
    await navigator.clipboard.writeText(latestResultText);
    showToast("楽曲情報をコピーしました。");
  } catch (error) {
    alert("コピーに失敗しました。結果テキストを長押しコピーしてください。");
  }
}

function renderSongList() {
  const keyword = normalizeText(searchInput.value);
  const selectedPack = listPackSelect.value;

  const filtered = songs.filter((song) => {
    if (selectedPack !== "all" && song.pack !== selectedPack) return false;
    const difficultyText = Object.entries(song.difficulties).map(([d, lv]) => `${d} Lv${lv} ${lv}`).join(" ");
    const target = normalizeText(`${song.title} ${song.artist} ${song.pack} ${difficultyText}`);
    return target.includes(keyword);
  });

  songCount.textContent = `${filtered.length}曲表示中`;
  songList.innerHTML = filtered.map((song) => renderSongCard(song)).join("");

  songList.querySelectorAll(".song-card").forEach((card, index) => {
    attachLongPressCopy(card, filtered[index]);
  });
}

function renderSongCard(song) {
  const diffHtml = Object.entries(song.difficulties).map(([difficulty, level]) => (
    `<span class="diff-pill">${escapeHtml(difficulty)} Lv${level}</span>`
  )).join("");

  return `
    <article class="song-card">
      <img class="song-thumb" src="${escapeHtml(getPackImage(song.pack))}" alt="${escapeHtml(song.pack)}" loading="lazy" />
      <div>
        <h3 class="song-title">${escapeHtml(song.title)}</h3>
        <p class="song-meta">${escapeHtml(song.artist)}<br>${escapeHtml(song.pack)}</p>
        <div class="diff-row">${diffHtml}</div>
      </div>
    </article>
  `;
}

function attachLongPressCopy(card, song) {
  let pressTimer = null;

  const startPress = () => {
    pressTimer = setTimeout(() => {
      copySongInfo(song);
    }, 650);
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  card.addEventListener("touchstart", startPress, { passive: true });
  card.addEventListener("touchend", cancelPress);
  card.addEventListener("touchmove", cancelPress);
  card.addEventListener("touchcancel", cancelPress);
  card.addEventListener("mousedown", startPress);
  card.addEventListener("mouseup", cancelPress);
  card.addEventListener("mouseleave", cancelPress);
  card.addEventListener("contextmenu", (event) => event.preventDefault());
}

async function copySongInfo(song) {
  const difficultyText = Object.entries(song.difficulties)
    .map(([difficulty, level]) => `${difficulty} Lv${level}`)
    .join(" / ");

  const text = `${song.title} / ${song.artist} / ${difficultyText}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("楽曲情報をコピーしました。");
  } catch (error) {
    alert("コピーに失敗しました。");
  }
}

function showToast(message) {
  let toast = document.getElementById("copyToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copyToast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "84px";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "999px";
    toast.style.background = "rgba(20, 20, 28, 0.92)";
    toast.style.color = "#ffffff";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "700";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.35)";
    toast.style.pointerEvents = "none";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.18s ease, transform 0.18s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(-6px)";

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 1200);
}

function getPackImage(packName) {
  return packMap.get(packName)?.image || "";
}

function getRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

function setRadioValue(name, value) {
  const target = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (target) target.checked = true;
}

function getCheckedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)].map((input) => input.value);
}

function setCheckedValues(containerId, values) {
  const valueSet = new Set(values);
  document.querySelectorAll(`#${containerId} input[type="checkbox"]`).forEach((input) => {
    input.checked = valueSet.has(input.value);
  });
}

function clampLevel(value) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(11, Math.max(1, Math.round(value)));
}

function normalizeText(value) {
  return String(value).trim().toLowerCase().normalize("NFKC");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initialize();