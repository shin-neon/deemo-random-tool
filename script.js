const packSelect = document.getElementById("packSelect");
const difficultySelect = document.getElementById("difficultySelect");
const minLevelInput = document.getElementById("minLevelInput");
const maxLevelInput = document.getElementById("maxLevelInput");
const randomButton = document.getElementById("randomButton");
const copyButton = document.getElementById("copyButton");
const resultBox = document.getElementById("resultBox");
const searchInput = document.getElementById("searchInput");
const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");

let latestResultText = "";

function initialize() {
  setupPackOptions();
  renderSongList();

  randomButton.addEventListener("click", handleRandomSelect);
  copyButton.addEventListener("click", handleCopyResult);
  searchInput.addEventListener("input", renderSongList);
}

function setupPackOptions() {
  const packs = [...new Set(songs.map((song) => song.pack))].sort();

  packs.forEach((pack) => {
    const option = document.createElement("option");
    option.value = pack;
    option.textContent = pack;
    packSelect.appendChild(option);
  });
}

function getCandidateCharts() {
  const selectedPack = packSelect.value;
  const selectedDifficulty = difficultySelect.value;
  const minLevel = Number(minLevelInput.value);
  const maxLevel = Number(maxLevelInput.value);

  const candidates = [];

  songs.forEach((song) => {
    if (selectedPack !== "all" && song.pack !== selectedPack) {
      return;
    }

    Object.entries(song.difficulties).forEach(([difficulty, level]) => {
      if (selectedDifficulty !== "all" && difficulty !== selectedDifficulty) {
        return;
      }

      if (level < minLevel || level > maxLevel) {
        return;
      }

      candidates.push({
        pack: song.pack,
        title: song.title,
        artist: song.artist,
        difficulty,
        level
      });
    });
  });

  return candidates;
}

function handleRandomSelect() {
  const minLevel = Number(minLevelInput.value);
  const maxLevel = Number(maxLevelInput.value);

  if (minLevel > maxLevel) {
    resultBox.innerHTML = `<div class="result-placeholder">最小Lvは最大Lv以下にしてください。</div>`;
    copyButton.disabled = true;
    latestResultText = "";
    return;
  }

  const candidates = getCandidateCharts();

  if (candidates.length === 0) {
    resultBox.innerHTML = `<div class="result-placeholder">条件に合う曲がありません。</div>`;
    copyButton.disabled = true;
    latestResultText = "";
    return;
  }

  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  latestResultText =
    `DEEMO ランセレ結果\n` +
    `${selected.title}\n` +
    `${selected.pack}\n` +
    `${selected.difficulty} Lv${selected.level}\n` +
    `${selected.artist}`;

  resultBox.innerHTML = `
    <div class="result-title">${escapeHtml(selected.title)}</div>
    <div class="result-meta">
      パック：${escapeHtml(selected.pack)}<br>
      難易度：${escapeHtml(selected.difficulty)} Lv${selected.level}<br>
      アーティスト：${escapeHtml(selected.artist)}
    </div>
  `;

  copyButton.disabled = false;
}

async function handleCopyResult() {
  if (!latestResultText) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestResultText);
    copyButton.textContent = "コピーしました";
    setTimeout(() => {
      copyButton.textContent = "結果をコピー";
    }, 1200);
  } catch (error) {
    alert("コピーに失敗しました。手動で結果を選択してください。");
  }
}

function renderSongList() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredSongs = songs.filter((song) => {
    const targetText = `${song.title} ${song.artist} ${song.pack}`.toLowerCase();
    return targetText.includes(keyword);
  });

  songCount.textContent = `${filteredSongs.length}曲表示中`;

  songList.innerHTML = "";

  filteredSongs.forEach((song) => {
    const difficultyText = Object.entries(song.difficulties)
      .map(([difficulty, level]) => `${difficulty}: Lv${level}`)
      .join(" / ");

    const item = document.createElement("div");
    item.className = "song-item";
    item.innerHTML = `
      <div class="song-title">${escapeHtml(song.title)}</div>
      <div class="song-meta">
        パック：${escapeHtml(song.pack)}<br>
        アーティスト：${escapeHtml(song.artist)}<br>
        ${escapeHtml(difficultyText)}
      </div>
    `;

    songList.appendChild(item);
  });
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