const clipStages = [1, 2, 4, 7, 11, 16];
const maxClipLength = clipStages.at(-1);
const songs = window.VOCALOID_HEARDLE_SONGS || [];
const statsKey = "vocaloid-heardle-stats";
const unlimitedStatsKey = "vocaloid-heardle-unlimited-stats";

const state = {
  mode: "daily",
  attempt: 1,
  clipStage: 0,
  guesses: [],
  puzzle: null,
  isComplete: false,
  lastResult: null,
  lastUnlimitedTitle: "",
  unlimitedQueue: [],
  statsMode: "daily",
};

const gamePanel = document.querySelector("#game-panel");
const puzzleDate = document.querySelector("#puzzle-date");
const attemptCount = document.querySelector("#attempt-count");
const clipLength = document.querySelector("#clip-length");
const playButton = document.querySelector("#play-button");
const skipButton = document.querySelector("#skip-button");
const guessForm = document.querySelector("#guess-form");
const guessInput = document.querySelector("#guess-input");
const guessList = document.querySelector("#guess-list");
const suggestionList = document.querySelector("#suggestion-list");
const scheduleMessage = document.querySelector("#schedule-message");
const modeEyebrow = document.querySelector("#mode-eyebrow");
const dailyModeButton = document.querySelector("#daily-mode-button");
const unlimitedModeButton = document.querySelector("#unlimited-mode-button");
const nextButton = document.querySelector("#next-button");
const shareButton = document.querySelector("#share-button");
const shareOutput = document.querySelector("#share-output");
const coverImage = document.querySelector("#cover-image");
const coverFallback = document.querySelector("#cover-fallback");
const coverPlaceholderMark = document.querySelector("#cover-placeholder-mark");
const coverCaption = document.querySelector("#cover-caption");
const answerLink = document.querySelector("#answer-link");
const statPlayed = document.querySelector("#stat-played");
const statWon = document.querySelector("#stat-won");
const statWinRate = document.querySelector("#stat-win-rate");
const statCurrentStreak = document.querySelector("#stat-current-streak");
const statMaxStreak = document.querySelector("#stat-max-streak");
const distributionItems = document.querySelectorAll("[data-distribution]");
const statsDailyButton = document.querySelector("#stats-daily-button");
const statsUnlimitedButton = document.querySelector("#stats-unlimited-button");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalButtons = document.querySelectorAll("[data-modal-target]");
const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-action");
let activeModal = null;
let currentAudio = null;
let clipTimer = null;
let progressFrame = null;
let activeSuggestionIndex = -1;

function getDefaultStats() {
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      fail: 0,
    },
    results: {},
  };
}

function loadStats() {
  try {
    const parsedStats = JSON.parse(localStorage.getItem(statsKey)) || {};
    const defaultStats = getDefaultStats();

    return {
      ...defaultStats,
      ...parsedStats,
      distribution: {
        ...defaultStats.distribution,
        ...(parsedStats.distribution || {}),
      },
      results: {
        ...defaultStats.results,
        ...(parsedStats.results || {}),
      },
    };
  } catch {
    return getDefaultStats();
  }
}

function saveStats(stats) {
  localStorage.setItem(statsKey, JSON.stringify(stats));
}

function loadUnlimitedStats() {
  try {
    return {
      ...getDefaultStats(),
      ...(JSON.parse(localStorage.getItem(unlimitedStatsKey)) || {}),
      results: {},
    };
  } catch {
    return getDefaultStats();
  }
}

function saveUnlimitedStats(stats) {
  localStorage.setItem(unlimitedStatsKey, JSON.stringify(stats));
}

function renderStats() {
  const stats = state.statsMode === "daily" ? loadStats() : loadUnlimitedStats();
  const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDistribution = Math.max(...Object.values(stats.distribution), 1);

  statPlayed.textContent = stats.played;
  statWon.textContent = stats.won;
  statWinRate.textContent = `${winRate}%`;
  statCurrentStreak.textContent = stats.currentStreak;
  statMaxStreak.textContent = stats.maxStreak;

  distributionItems.forEach((item) => {
    const key = item.dataset.distribution;
    const value = stats.distribution[key] || 0;
    const barHeight = Math.max((value / maxDistribution) * 100, value > 0 ? 10 : 4);
    const wrapper = item.closest("div");
    const bar = wrapper.querySelector(".guess-bar");

    item.textContent = value;
    bar.style.height = `${barHeight}%`;
    bar.style.opacity = value > 0 ? "1" : "0.45";
  });

  statsDailyButton.classList.toggle("is-active", state.statsMode === "daily");
  statsUnlimitedButton.classList.toggle("is-active", state.statsMode === "unlimited");

  // sync sidebar stats
  const sbMode = state.mode === "daily" ? loadStats() : loadUnlimitedStats();
  const sbWinRate = sbMode.played > 0 ? Math.round((sbMode.won / sbMode.played) * 100) : 0;
  const sbPlayed = document.querySelector("#sb-played");
  const sbWon = document.querySelector("#sb-won");
  const sbRate = document.querySelector("#sb-rate");
  const sbStreak = document.querySelector("#sb-streak");
  const sbBest = document.querySelector("#sb-best");
  if (sbPlayed) sbPlayed.textContent = sbMode.played;
  if (sbWon) sbWon.textContent = sbMode.won;
  if (sbRate) {
    sbRate.textContent = `${sbWinRate}%`;
    const bar = document.querySelector("#sb-winrate-bar");
    if (bar) bar.style.width = `${sbWinRate}%`;
  }
  if (sbStreak) {
    sbStreak.textContent = sbMode.currentStreak;
    const streakRow = document.querySelector("#streak-row");
    if (streakRow) streakRow.classList.toggle("streak-hot", sbMode.currentStreak >= 5);
  }
  if (sbBest) sbBest.textContent = sbMode.maxStreak;

  const totalEl = document.querySelector("#sb-total-songs");
  if (totalEl) totalEl.textContent = songs.length.toLocaleString();

  // update sidebar label
  const sbLabel = document.querySelector("#sb-mode-label");
  if (sbLabel) sbLabel.textContent = state.mode === "daily" ? "Daily Stats" : "Unlimited Stats";
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) {
    return;
  }

  closeModal();
  activeModal = modal;
  modal.hidden = false;
  modalBackdrop.hidden = false;
}

function closeModal() {
  if (activeModal) {
    activeModal.hidden = true;
    activeModal = null;
  }

  modalBackdrop.hidden = true;
}

function formatToday() {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeGuess(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getSongSearchValues(song) {
  return [
    song.title,
    song.artist,
    song.artistString,
    song.displayArtist,
    song.suggestionArtistString,
    song.vocadbName,
    ...(song.acceptedTitles || []),
    ...(song.producerNames || []),
    ...(song.singerNames || []),
    ...(song.artistSearchNames || []),
  ].filter(Boolean);
}

function getSuggestionArtist(song) {
  return song.suggestionArtistString || song.displayArtist || song.artistString || song.artist || "";
}

function getMatchingSongs(value) {
  const query = normalizeGuess(value);

  if (!query) {
    return [];
  }

  const matches = [];

  songs.forEach((song) => {
    const searchableValues = getSongSearchValues(song).map(normalizeGuess);

    if (searchableValues.some((value) => value.includes(query))) {
      matches.push(song);
    }
  });

  return matches.slice(0, 12);
}

function getDailyPuzzle() {
  return songs.find((song) => song.date === getDateKey()) || null;
}

function getRandomIndex(length) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }

  return Math.floor(Math.random() * length);
}

function shuffleSongs(playableSongs) {
  const shuffledSongs = [...playableSongs];

  for (let index = shuffledSongs.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [shuffledSongs[index], shuffledSongs[swapIndex]] = [shuffledSongs[swapIndex], shuffledSongs[index]];
  }

  return shuffledSongs;
}

function refillUnlimitedQueue(playableSongs) {
  state.unlimitedQueue = shuffleSongs(playableSongs);

  if (state.unlimitedQueue.length <= 1 || state.unlimitedQueue[0].title !== state.lastUnlimitedTitle) {
    return;
  }

  const swapIndex = 1 + getRandomIndex(state.unlimitedQueue.length - 1);
  [state.unlimitedQueue[0], state.unlimitedQueue[swapIndex]] = [
    state.unlimitedQueue[swapIndex],
    state.unlimitedQueue[0],
  ];
}

function getUnlimitedPuzzle() {
  const playableSongs = songs.filter((song) => song.audioClip);

  if (playableSongs.length === 0) {
    return null;
  }

  if (state.unlimitedQueue.length === 0) {
    refillUnlimitedQueue(playableSongs);
  }

  return state.unlimitedQueue.shift() || null;
}

function resetRound() {
  stopClip();
  state.attempt = 1;
  state.clipStage = 0;
  state.guesses = [];
  state.isComplete = false;
  state.lastResult = null;
  currentAudio = null;
  clipTimer = null;
  guessForm.reset();
  hideSuggestions();
  gamePanel.classList.remove("is-loss");
  coverPlaceholderMark.hidden = false;
  coverImage.hidden = true;
  coverImage.removeAttribute("src");
  coverImage.alt = "";
  coverFallback.hidden = true;
  coverFallback.innerHTML = "";
  coverCaption.textContent = "cover art appears after the answer";
  answerLink.hidden = true;
  answerLink.href = "#";
  scheduleMessage.hidden = true;
  nextButton.hidden = true;
  shareButton.hidden = true;
  shareButton.textContent = "Copy Result";
  shareOutput.hidden = true;
  shareOutput.value = "";
  playButton.disabled = false;
  skipButton.disabled = false;
  guessInput.disabled = false;
}

function loadPuzzle() {
  resetRound();
  state.puzzle = state.mode === "daily" ? getDailyPuzzle() : getUnlimitedPuzzle();

  if (!state.puzzle) {
    scheduleMessage.hidden = false;
    scheduleMessage.textContent = "No puzzle is scheduled for today yet.";
    playButton.disabled = true;
    skipButton.disabled = true;
    guessInput.disabled = true;
    return;
  }

  scheduleMessage.hidden = true;
  currentAudio = new Audio(state.puzzle.audioClip);
  currentAudio.preload = "auto";
  currentAudio.addEventListener("ended", resetPlayButton);

  if (state.mode === "unlimited") {
    state.lastUnlimitedTitle = state.puzzle.title;
    render();
    guessInput.focus();
    pulsePlayButton();
    return;
  }
  const completedResult = loadStats().results[getDateKey()];

  if (completedResult) {
    state.isComplete = true;
    state.lastResult = completedResult;
    state.clipStage = clipStages.length - 1;
    state.guesses = completedResult.guesses || [
      {
        label: state.puzzle.title,
        result: completedResult.won ? "Correct" : "Answer",
      },
    ];
    revealAnswer();
    playButton.disabled = false;
    playButton.setAttribute("aria-label", "Play full clip");
    skipButton.disabled = true;
    guessInput.disabled = true;
  }

  if (!completedResult) {
    guessInput.focus();
    pulsePlayButton();
  }

  render();
}

function recordResult(won) {
  const isDaily = state.mode === "daily";
  const todayKey = getDateKey();
  const stats = isDaily ? loadStats() : loadUnlimitedStats();

  if (isDaily && stats.results[todayKey]) {
    renderStats();
    return stats.results[todayKey];
  }

  stats.played += 1;
  const result = {
    won,
    attempts: won ? state.attempt : null,
    title: state.puzzle.title,
    guesses: state.guesses,
  };

  if (isDaily) {
    stats.results[todayKey] = result;
  }

  if (won) {
    stats.won += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[state.attempt] += 1;
  } else {
    stats.currentStreak = 0;
    stats.distribution.fail += 1;
  }

  if (isDaily) {
    saveStats(stats);
  } else {
    saveUnlimitedStats(stats);
  }

  renderStats();
  return result;
}

function revealAnswer() {
  if (!state.puzzle) {
    return;
  }

  coverPlaceholderMark.hidden = true;
  coverCaption.textContent = `${state.puzzle.title} - ${getSuggestionArtist(state.puzzle)}`;
  answerLink.hidden = !state.puzzle.vocadbUrl;
  answerLink.href = state.puzzle.vocadbUrl || "#";

  const coverArts = getCoverArts(state.puzzle);

  if (coverArts.length > 0) {
    showCoverArt(0);
    coverImage.alt = `${state.puzzle.title} cover art`;
    coverImage.hidden = false;
    coverFallback.hidden = true;
    return;
  }

  coverImage.hidden = true;
  coverFallback.innerHTML = `
    <strong>${escapeHtml(state.puzzle.title)}</strong>
    <span>${escapeHtml(state.puzzle.artistString || state.puzzle.artist)}</span>
  `;
  coverFallback.hidden = false;
}

function getYouTubeImageVideoId(url) {
  const match = url.match(/(?:i\d?\.ytimg\.com\/vi\/|img\.youtube\.com\/vi\/)([^/]+)/);
  return match?.[1] || "";
}

function getExpandedCoverArtUrls(url) {
  const videoId = getYouTubeImageVideoId(url);

  if (!videoId) {
    return [url];
  }

  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
  ];
}

function getCoverArtScore(url) {
  if (url.includes("/maxresdefault.jpg")) {
    return 100;
  }

  if (url.includes("/sddefault.jpg")) {
    return 90;
  }

  if (url.includes("nicovideo.cdn.nimg.jp")) {
    return 85;
  }

  if (!url.includes("ytimg.com")) {
    return 75;
  }

  if (url.includes("/hqdefault.jpg")) {
    return 80;
  }

  if (url.includes("/mqdefault.jpg")) {
    return 60;
  }

  if (url.includes("/default.jpg")) {
    return 20;
  }

  if (url.includes("ytimg.com")) {
    return 45;
  }

  return 50;
}

function getCoverArts(song) {
  const coverArts = [...(song.coverArts || []), song.coverArt].filter(Boolean);
  const expandedCoverArts = coverArts.flatMap(getExpandedCoverArtUrls);
  const uniqueCoverArts = [...new Set(expandedCoverArts)];

  return uniqueCoverArts.sort((firstUrl, secondUrl) => getCoverArtScore(secondUrl) - getCoverArtScore(firstUrl));
}

function showCoverArt(index) {
  const coverArts = getCoverArts(state.puzzle);
  coverImage.dataset.coverIndex = String(index);
  coverImage.src = coverArts[index];
}

function showNextCoverArt() {
  const nextIndex = Number(coverImage.dataset.coverIndex || 0) + 1;
  const coverArts = getCoverArts(state.puzzle || {});

  if (nextIndex < coverArts.length) {
    showCoverArt(nextIndex);
    return true;
  }

  coverImage.hidden = true;
  coverFallback.innerHTML = `
    <strong>${escapeHtml(state.puzzle.title)}</strong>
    <span>${escapeHtml(state.puzzle.artistString || state.puzzle.artist)}</span>
  `;
  coverFallback.hidden = false;
  return false;
}

function isLowQualityYouTubePlaceholder() {
  const imageUrl = coverImage.currentSrc || coverImage.src;

  if (!imageUrl.includes("ytimg.com")) {
    return false;
  }

  if (coverImage.naturalWidth <= 320 || coverImage.naturalHeight <= 180) {
    return true;
  }

  return imageUrl.includes("/maxresdefault.jpg") && coverImage.naturalWidth < 1000;
}

coverImage.addEventListener("load", () => {
  if (isLowQualityYouTubePlaceholder()) {
    showNextCoverArt();
  }
});

coverImage.addEventListener("error", () => {
  showNextCoverArt();
});

function completeRound(won) {
  state.isComplete = true;
  stopClip();
  revealAnswer();
  state.lastResult = recordResult(won) || {
    won,
    attempts: won ? state.attempt : null,
    title: state.puzzle.title,
  };
  playButton.disabled = false;
  playButton.setAttribute("aria-label", "Play full clip");
  state.clipStage = clipStages.length - 1;
  skipButton.disabled = true;
  guessInput.disabled = true;
  nextButton.hidden = false;
  shareButton.hidden = false;
  if (giveUpButton) giveUpButton.hidden = true;
  if (state.mode === "daily") {
    localStorage.setItem("vh-last-played-date", getDateKey());
    const badge = document.querySelector("#new-badge");
    if (badge) badge.hidden = true;
  }
  if (won) {
    showToast(`Correct! — ${state.puzzle.title}`);
    gamePanel.classList.remove("is-loss");
  } else {
    showLossToast(`The answer was: ${state.puzzle.title}`);
    gamePanel.classList.add("is-loss");
  }
}

function render() {
  gamePanel.classList.toggle("is-complete", state.isComplete);
  puzzleDate.textContent = state.mode === "daily" ? formatToday() : "Unlimited";
  attemptCount.textContent = `Attempt ${state.attempt} of ${clipStages.length}`;
  clipLength.textContent = `${clipStages[state.clipStage]}s`;
  modeEyebrow.textContent = state.mode === "daily" ? "daily puzzle" : "unlimited puzzle";
  answerLink.hidden = !state.isComplete || !state.puzzle?.vocadbUrl;
  nextButton.hidden = !state.isComplete;
  shareButton.hidden = !state.isComplete;
  shareOutput.value = state.isComplete ? buildShareText() : "";
  dailyModeButton.classList.toggle("is-active", state.mode === "daily");
  unlimitedModeButton.classList.toggle("is-active", state.mode === "unlimited");
  updateProgress(0);
  updateGiveUpVisibility();
  updateAttemptDots();
  renderGuesses();
}

function getResultIcon(result) {
  if (result === "Correct") return "✓";
  if (result === "Wrong") return "✗";
  if (result === "Skipped") return "→";
  if (result === "Answer") return "!";
  return "";
}

function renderGuesses() {
  if (state.guesses.length === 0) {
    guessList.innerHTML = '<li class="empty-guess">No guesses yet</li>';
    return;
  }

  const previousCount = guessList.querySelectorAll("li:not(.empty-guess)").length;

  guessList.innerHTML = state.guesses
    .map((guess, index) => {
      const resultClass = ` is-${normalizeGuess(guess.result).replace(/\s+/g, "-")}`;
      const safeLabel = escapeHtml(guess.label);
      const safeResult = escapeHtml(guess.result);
      const icon = getResultIcon(guess.result);
      const isNew = index === state.guesses.length - 1 && state.guesses.length > previousCount;

      return `
        <li${isNew ? ' class="guess-flash"' : ""}>
          <span>${safeLabel}</span>
          <span class="guess-result${resultClass}"><span class="guess-icon">${icon}</span> ${safeResult}</span>
        </li>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(`(${escapedQuery})`, "gi"), "<mark>$1</mark>");
}

function renderSuggestions() {
  const query = guessInput.value;
  const matches = getMatchingSongs(query);
  activeSuggestionIndex = -1;

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

  const normalizedQuery = normalizeGuess(query);

  suggestionList.innerHTML = matches
    .map(
      (song, index) => `
        <li role="option" data-index="${index}" data-title="${escapeHtml(song.title)}">
          <span class="suggestion-title">${highlightMatch(song.title, normalizedQuery)}</span>
          <span class="suggestion-artist">${escapeHtml(getSuggestionArtist(song))}</span>
        </li>
      `,
    )
    .join("");
  suggestionList.hidden = false;
  guessInput.setAttribute("aria-expanded", "true");
}

function hideSuggestions() {
  suggestionList.hidden = true;
  suggestionList.innerHTML = "";
  guessInput.setAttribute("aria-expanded", "false");
}

function selectSuggestion(title) {
  guessInput.value = title;
  hideSuggestions();
  guessInput.focus();
}

function setActiveSuggestion(index) {
  const options = Array.from(suggestionList.querySelectorAll("li"));

  if (options.length === 0) {
    return;
  }

  activeSuggestionIndex = (index + options.length) % options.length;
  options.forEach((option, optionIndex) => {
    option.classList.toggle("is-active", optionIndex === activeSuggestionIndex);
  });
}

function addGuess(label, result) {
  state.guesses.push({ label, result });
}

function resetPlayButton() {
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Play clip");
}

function updateProgress(seconds = currentAudio?.currentTime || 0) {
  const unlockedLength = clipStages[state.clipStage] || clipStages[0];
  const visibleSeconds = Math.min(seconds, unlockedLength);
  const markerNudge = visibleSeconds > 0 ? 0.09 : 0;
  const percent = Math.max(0, Math.min(((visibleSeconds + markerNudge) / maxClipLength) * 100, 100));
  document.documentElement.style.setProperty("--clip-progress", `${percent}%`);
}

function stopProgressLoop() {
  if (progressFrame) {
    cancelAnimationFrame(progressFrame);
    progressFrame = null;
  }
}

function startProgressLoop() {
  stopProgressLoop();
  const tick = () => {
    updateProgress();
    progressFrame = requestAnimationFrame(tick);
  };
  tick();
}

function stopClip() {
  if (clipTimer) {
    clearTimeout(clipTimer);
    clipTimer = null;
  }

  stopProgressLoop();

  if (currentAudio) {
    currentAudio.pause();
  }

  resetPlayButton();
}

function getVolume() {
  const v = parseFloat(localStorage.getItem("vh-volume"));
  return isNaN(v) ? 0.5 : v;
}

function playClip() {
  if (!state.puzzle || !currentAudio) {
    return;
  }

  stopClip();
  currentAudio.currentTime = 0;
  currentAudio.volume = getVolume();
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Pause clip");
  updateProgress(0);

  const clipLength = clipStages[state.clipStage] * 1000;
  currentAudio.play().catch(() => {
    resetPlayButton();
  });
  startProgressLoop();

  clipTimer = setTimeout(() => {
    stopClip();
    currentAudio.currentTime = 0;
    updateProgress(0);
  }, clipLength);
}

function buildShareText() {
  if (!state.puzzle || !state.lastResult) {
    return "";
  }

  const modeLabel = state.mode === "daily" ? "Daily" : "Unlimited";
  const score = state.lastResult.won ? `${state.lastResult.attempts}/${clipStages.length}` : `X/${clipStages.length}`;
  const context = state.mode === "daily" ? formatToday() : state.puzzle.title;

  let gaveUp = false;
  const squares = clipStages
    .map((_, index) => {
      if (gaveUp) return null;
      const guess = state.guesses[index];
      if (guess?.result === "Answer") { gaveUp = true; return "\u2B1B"; }
      if (guess?.result === "Wrong") return "\uD83D\uDFE5";
      if (guess?.result === "Skipped") return "\u2B1B";
      if (guess?.result === "Correct") return "\uD83D\uDFE9";
      if (!state.lastResult.won) return "⬛";
      if (index + 1 < state.lastResult.attempts) return "⬛";
      if (index + 1 === state.lastResult.attempts) return "🟩";
      return "⬜";
    })
    .filter((s) => s !== null)
    .join(" ");

  return [
    `VOCALOID Heardle ${modeLabel}`,
    `${score} · ${context}`,
    "",
    `🔊 ${squares}`,
  ].join("\n");
}

function showToast(message) {
  const existing = document.querySelector("#nnd-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "nnd-toast";
  toast.innerHTML = `<span class="nnd-toast-label">[✓]</span><span class="nnd-toast-msg">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("nnd-toast-fade"), 1800);
  setTimeout(() => toast.remove(), 2400);
}

function showLossToast(message) {
  const existing = document.querySelector("#nnd-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "nnd-toast";
  toast.classList.add("nnd-toast-loss");
  toast.innerHTML = `<span class="nnd-toast-label">[!]</span><span class="nnd-toast-msg">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("nnd-toast-fade"), 2800);
  setTimeout(() => toast.remove(), 3400);
}

function pulsePlayButton() {
  playButton.classList.remove("pulse");
  void playButton.offsetWidth;
  playButton.classList.add("pulse");
  setTimeout(() => playButton.classList.remove("pulse"), 600);
}

function copyText(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    return Promise.reject(new Error("Copy failed"));
  }

  return Promise.resolve();
}

function isCorrectGuess(guess) {
  const acceptedTitles = state.puzzle.acceptedTitles || [state.puzzle.title];
  return acceptedTitles.some((title) => normalizeGuess(guess) === normalizeGuess(title));
}

function advanceAttempt() {
  if (state.isComplete || state.attempt >= clipStages.length) {
    state.isComplete = true;
    return;
  }

  state.attempt += 1;
  state.clipStage += 1;
  render();
}

playButton.addEventListener("click", () => {
  if (currentAudio && !currentAudio.paused) {
    stopClip();
    currentAudio.currentTime = 0;
    return;
  }

  playClip();
});

skipButton.addEventListener("click", () => {
  if (!state.puzzle || state.isComplete) {
    return;
  }

  addGuess(`Skipped attempt ${state.attempt}`, "Skipped");
  if (state.attempt >= clipStages.length) {
    completeRound(false);
  } else {
    advanceAttempt();
  }
  render();
});

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = guessInput.value.trim();

  if (!state.puzzle || state.isComplete || !guess) {
    return;
  }

  const isCorrect = isCorrectGuess(guess);

  if (isCorrect) {
    addGuess(guess, "Correct");
    completeRound(true);
    guessForm.reset();
    hideSuggestions();
  } else {
    addGuess(guess, "Wrong");
    const clearOnWrong = localStorage.getItem("vh-clearwrong") !== "false";
    if (clearOnWrong) {
      guessInput.value = "";
      hideSuggestions();
    }
    if (state.attempt >= clipStages.length) {
      completeRound(false);
    } else {
      advanceAttempt();
    }
  }
  render();
});

guessInput.addEventListener("input", renderSuggestions);

guessInput.addEventListener("keydown", (event) => {
  if (suggestionList.hidden) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveSuggestion(activeSuggestionIndex + 1);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveSuggestion(activeSuggestionIndex - 1);
  }

  if (event.key === "Enter" && activeSuggestionIndex >= 0) {
    event.preventDefault();
    const option = suggestionList.querySelectorAll("li")[activeSuggestionIndex];
    selectSuggestion(option.dataset.title);
  }

  if (event.key === "Escape") {
    hideSuggestions();
  }
});

const giveUpButton = document.querySelector("#give-up-button");
if (giveUpButton) {
  giveUpButton.addEventListener("click", () => {
    if (!state.puzzle || state.isComplete) return;
    addGuess("Gave up", "Answer");
    completeRound(false);
    render();
  });
}

function updateAttemptDots() {
  const container = document.querySelector("#sb-attempt-dots");
  if (!container) return;
  container.innerHTML = clipStages.map((_, i) => {
    const attemptNum = i + 1;
    const guess = state.guesses[i];
    let cls = "sb-attempt-dot";
    if (state.isComplete && state.lastResult?.won && attemptNum === state.lastResult.attempts) {
      cls += " is-correct";
    } else if (guess?.result === "Wrong" || guess?.result === "Answer") {
      cls += " is-used";
    } else if (guess?.result === "Skipped") {
      cls += " is-skipped";
    } else if (attemptNum === state.attempt && !state.isComplete) {
      cls += " is-current";
    }
    return `<span class="${cls}"></span>`;
  }).join("");
}

function updateGiveUpVisibility() {
  if (giveUpButton) {
    giveUpButton.hidden = state.isComplete || state.attempt < 3;
  }
}

function checkNewBadge() {
  const badge = document.querySelector("#new-badge");
  if (!badge) return;
  const lastPlayed = localStorage.getItem("vh-last-played-date");
  badge.hidden = lastPlayed === getDateKey();
}

const resetStatsButton = document.querySelector("#reset-stats-button");
const resetStatsConfirm = document.querySelector("#reset-stats-confirm");
const resetStatsYes = document.querySelector("#reset-stats-yes");
const resetStatsNo = document.querySelector("#reset-stats-no");

if (resetStatsButton) {
  resetStatsButton.addEventListener("click", () => {
    if (resetStatsConfirm) resetStatsConfirm.hidden = false;
    resetStatsButton.hidden = true;
  });
}
if (resetStatsYes) {
  resetStatsYes.addEventListener("click", () => {
    localStorage.removeItem(statsKey);
    localStorage.removeItem(unlimitedStatsKey);
    renderStats();
    showToast("Stats have been reset");
    if (resetStatsConfirm) resetStatsConfirm.hidden = true;
    if (resetStatsButton) resetStatsButton.hidden = false;
  });
}
if (resetStatsNo) {
  resetStatsNo.addEventListener("click", () => {
    if (resetStatsConfirm) resetStatsConfirm.hidden = true;
    if (resetStatsButton) resetStatsButton.hidden = false;
  });
}

suggestionList.addEventListener("mousedown", (event) => {
  const option = event.target.closest("li");
  if (!option) return;
  event.preventDefault();
  selectSuggestion(option.dataset.title);
});

dailyModeButton.addEventListener("click", () => {
  state.mode = "daily";
  state.statsMode = "daily";
  document.title = "VOCALOID Heardle — Daily";
  loadPuzzle();
  renderStats();
});

unlimitedModeButton.addEventListener("click", () => {
  state.mode = "unlimited";
  state.statsMode = "unlimited";
  state.unlimitedQueue = [];
  document.title = "VOCALOID Heardle — Unlimited";
  loadPuzzle();
  renderStats();
});

nextButton.addEventListener("click", () => {
  state.mode = "unlimited";
  loadPuzzle();
});

shareButton.addEventListener("click", async () => {
  const shareText = buildShareText();

  if (!shareText) {
    return;
  }

  try {
    await copyText(shareText);
    showToast("Result copied to clipboard");
    shareOutput.hidden = true;
  } catch {
    shareOutput.value = shareText;
    shareOutput.hidden = false;
    shareOutput.focus();
    shareOutput.select();
    shareButton.textContent = "Select Result";
  }
});

statsDailyButton.addEventListener("click", () => {
  state.statsMode = "daily";
  renderStats();
});

statsUnlimitedButton.addEventListener("click", () => {
  state.statsMode = "unlimited";
  renderStats();
});

modalButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (button.tagName === "A") {
      event.preventDefault();
    }

    if (button.dataset.modalTarget === "stats") {
      renderStats();
    }

    openModal(button.dataset.modalTarget);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    hideSuggestions();
  }
});

document.addEventListener("click", (event) => {
  if (!guessForm.contains(event.target)) {
    hideSuggestions();
  }
});

loadPuzzle();
renderStats();
checkNewBadge();