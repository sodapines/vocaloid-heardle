const clipStages = [1, 2, 4, 7, 11, 16];
const maxClipLength = clipStages.at(-1);
const songs = window.VOCALOID_HEARDLE_SONGS || [];
const statsKey = "vocaloid-heardle-stats";
const unlimitedStatsKey = "vocaloid-heardle-unlimited-stats";

// ── i18n ──
const STRINGS = {
  en: {
    dailyPuzzle: "daily puzzle",
    unlimitedPuzzle: "unlimited puzzle",
    daily: "Daily",
    unlimited: "Unlimited",
    attempt: (n, total) => `Attempt ${n} of ${total}`,
    coverCaption: "cover art appears after the answer",
    noSchedule: "No puzzle is scheduled for today yet.",
    songTitle: "Song Title",
    submit: "Submit",
    skip: "Skip",
    giveUp: "Give Up",
    nextSong: "Next Song",
    copyResult: "Copy Result",
    pastGuesses: "Past Guesses",
    noGuesses: "No guesses yet",
    correct: "Correct",
    wrong: "Wrong",
    skipped: "Skipped",
    answer: "Answer",
    gaveUp: "Gave up",
    viewVocaDB: "View on VocaDB",
    dailyStats: "Daily Stats",
    unlimitedStats: "Unlimited Stats",
    played: "Played",
    won: "Won",
    winRate: "Win Rate",
    streak: "Streak",
    bestStreak: "Best Streak",
    songsInPool: "Songs in pool",
    viewFullStats: "View full stats →",
    howToPlay: "How to Play",
    hallOfMyths: "Hall of Myths",
    links: "Links",
    toastCorrect: (title) => `Correct! — ${title}`,
    toastAnswer: (title) => `The answer was: ${title}`,
    toastCopied: "Result copied to clipboard",
    toastStatsReset: "Stats have been reset",
    heardleDaily: "VOCALOID Heardle Daily",
    heardleUnlimited: "VOCALOID Heardle Unlimited",
    placeholder: "type your guess...",
    disclaimer: "Some songs may not begin playing within the first second.",
    marquee: "A new daily puzzle is available each day ★ Use unlimited mode to practice anytime ★ Guess the VOCALOID song from the opening clip in 6 tries or less ★ Share your score with friends! ★ Songs sourced from VocaDB ★",
    introCopy: "Guess the VOCALOID song from the opening clip.",
    breadcrumb: "Games › Music › VOCALOID › Heardle",
    footerText: "VOCALOID Heardle: fan-made daily guessing game © 2026 | Not affiliated with Crypton Future Media or NicoNico | Song data from",
    howToPlayStep1: "Press ▶ to hear the opening clip",
    howToPlayStep2: "Type the song title and submit",
    howToPlayStep3: "Wrong or skipped? More clip unlocks",
    howToPlayStep4: "Guess correctly in 6 tries to win",
    howToPlayStep5: "Share your score when done!",
    hofNote: "Most viewed VOCALOID songs on NicoNico",
    modalHowToPlayTitle: "How to Play",
    modalHowToPlayP1: "Listen to the intro, then find the correct VOCALOID song.",
    modalHowToPlayP2: "Skipped or incorrect attempts unlock more of the clip.",
    modalHowToPlayP3: "Guess in as few tries as possible and share your score.",
    modalHowToPlayPlay: "Play",
    modalAboutTitle: "About",
    modalAboutP1: "VOCALOID Heardle is a daily song guessing game built around VOCALOID and vocal synth music.",
    modalAboutP2: "Each puzzle reveals a little more of the intro after every wrong guess or skip. Song details and VocaDB links appear after the answer.",
    modalSupportTitle: "Support",
    modalSupportP1: "VOCALOID Heardle is maintained by sodapines as a small fan-made music puzzle project.",
    modalSupportP2: "For bugs, song corrections, or suggestions, email",
    modalStatsTitle: "Stats",
    modalStatsDailyBtn: "Daily",
    modalStatsUnlimitedBtn: "Unlimited",
    statsPlayed: "Played",
    statsWon: "Won",
    statsWinRate: "Win rate",
    statsCurrentStreak: "Current streak",
    statsMaxStreak: "Max streak",
    settingsTitle: "Settings",
    settingDarkMode: "Dark Mode",
    settingDarkModeDesc: "Switch between light and dark theme",
    settingBulletComments: "Bullet Comments",
    settingBulletCommentsDesc: "Scrolling danmaku overlay on cover art",
    settingCommentSpeed: "Comment Speed",
    settingCommentSpeedDesc: "How fast bullet comments scroll",
    settingSpeedSlow: "Slow",
    settingSpeedNormal: "Normal",
    settingSpeedFast: "Fast",
    settingCompactMode: "Compact Mode",
    settingCompactModeDesc: "Hides marquee, tags, and sidebar at once",
    settingMarqueeBar: "Marquee Bar",
    settingMarqueeBarDesc: "Scrolling announcement at the top",
    settingSidebar: "Sidebar",
    settingSidebarDesc: "Stats and info panel on the right",
    settingAutocomplete: "Autocomplete",
    settingAutocompleteDesc: "Show song suggestions while typing",
    settingDensity: "Bullet Comment Density",
    settingDensityDesc: "How many comments appear on screen",
    settingDensityFew: "Few",
    settingDensityMedium: "Medium",
    settingDensityMany: "Many",
    settingVolume: "Volume",
    settingVolumeDesc: "Clip playback volume",
    settingTitleDisplay: "Song Title Display",
    settingTitleDisplayDesc: "How song titles appear in suggestions and history",
    settingClearInput: "Clear Input on Wrong",
    settingClearInputDesc: "Clears the guess field after a wrong answer",
    settingResetStats: "Reset Stats",
    settingResetStatsDesc: "Permanently clear all your stats",
    settingResetBtn: "Reset",
    settingResetConfirm: "Are you sure? This cannot be undone.",
    settingResetYes: "Yes, reset",
    settingResetNo: "Cancel",
    infoLabel: "[INFO]",
    metaViews: "▶ Views:",
    metaCategory: "Category:",
    metaSource: "Source:",
    navAbout: "About",
    navSupport: "Support",
    navSettings: "Settings",
    hofSong1: "Senbonzakura",
    hofSong2: "I'll Make You Do the Miku Miku",
    hofSong3: "Melt",
    hofSong4: "World's End Dancehall",
    hofSong5: "Matryoshka",
    hofArtist1: "Kurousa",
    hofArtist2: "ika",
    hofArtist3: "ryo",
    hofArtist4: "wowaka",
    hofArtist5: "hachi",
    linkVocaDB: "VocaDB ↗",
    linkNicoNico: "NicoNico ↗",
    linkAbout: "About this site",
    linkContact: "Contact / Support",
    rankingsHeader: "Global Rankings",
    rankingsTabPlays: "Popular",
    rankingsTabHardest: "Hardest",
    rankingsTabEasiest: "Easiest",
    rankingsSeeAll: "See all →",
    rankingsNote: "Based on unlimited mode plays only. Songs with fewer than 5 plays are excluded.",
    rankingsModalTitle: "Global Rankings",
    rankingsPlays: (n) => `${n} plays`,
    rankingsWin: (n) => `${n}%`,
    rankingsAvgAttempts: (n) => `${n} avg attempts`,
    rankingsNoData: "No data yet.",
    rankingsNoDataModal: "No data yet, play some unlimited songs first!",
    rankingsLoading: "Loading...",
    introCopy: "Guess the VOCALOID song from the opening clip.",
    breadcrumb: "Games › Music › VOCALOID › Heardle",
    footerText: "VOCALOID Heardle: fan-made daily guessing game © 2026 | Not affiliated with Crypton Future Media or NicoNico | Song data from",
    howToPlayStep1: "Press ▶ to hear the opening clip",
    howToPlayStep2: "Type the song title and submit",
    howToPlayStep3: "Wrong or skipped? More clip unlocks",
    howToPlayStep4: "Guess correctly in 6 tries to win",
    howToPlayStep5: "Share your score when done!",
    hofNote: "Most viewed VOCALOID songs on NicoNico",
  },
  jp: {
    dailyPuzzle: "毎日のパズル",
    unlimitedPuzzle: "無制限モード",
    daily: "毎日",
    unlimited: "無制限",
    attempt: (n, total) => `挑戦 ${n} / ${total}`,
    coverCaption: "正解後にジャケット画像が表示されます",
    noSchedule: "本日のパズルはまだ準備されていません。",
    songTitle: "曲名",
    submit: "送信",
    skip: "スキップ",
    giveUp: "ギブアップ",
    nextSong: "次の曲",
    copyResult: "結果をコピー",
    pastGuesses: "過去の回答",
    noGuesses: "まだ回答がありません",
    correct: "正解",
    wrong: "不正解",
    skipped: "スキップ",
    answer: "答え",
    gaveUp: "ギブアップ",
    viewVocaDB: "VocaDBで見る",
    dailyStats: "毎日の統計",
    unlimitedStats: "無制限の統計",
    played: "プレイ数",
    won: "正解数",
    winRate: "正解率",
    streak: "連続正解",
    bestStreak: "最高連続正解",
    songsInPool: "曲数",
    viewFullStats: "全統計を見る →",
    howToPlay: "遊び方",
    hallOfMyths: "殿堂入り",
    links: "リンク",
    toastCorrect: (title) => `正解！— ${title}`,
    toastAnswer: (title) => `正解は：${title}`,
    toastCopied: "結果をコピーしました",
    toastStatsReset: "統計をリセットしました",
    heardleDaily: "VOCALOID Heardle 毎日",
    heardleUnlimited: "VOCALOID Heardle 無制限",
    placeholder: "曲名を入力...",
    disclaimer: "曲によっては最初の1秒で再生が始まらない場合があります。",
    marquee: "毎日新しいパズルが更新されます ★ 無制限モードでいつでも練習できます ★ 6回以内にVOCALOID曲を当てよう ★ 結果をシェアしよう！ ★ 楽曲データはVocaDBより ★",
    introCopy: "イントロを聴いてVOCALOID曲を当てよう。",
    breadcrumb: "ゲーム › 音楽 › VOCALOID › Heardle",
    footerText: "VOCALOID Heardle：ファンメイドの毎日クイズゲーム © 2026 | クリプトン・フューチャー・メディア及びニコニコと無関係 | 楽曲データ：",
    howToPlayStep1: "▶ を押してイントロを聴く",
    howToPlayStep2: "曲名を入力して送信する",
    howToPlayStep3: "不正解・スキップでより長いクリップが解放される",
    howToPlayStep4: "6回以内に正解する",
    howToPlayStep5: "結果をシェアしよう！",
    hofNote: "ニコニコ動画で最も再生されたVOCALOID曲",
    modalHowToPlayTitle: "遊び方",
    modalHowToPlayP1: "イントロを聴いて、正しいVOCALOID曲を見つけよう。",
    modalHowToPlayP2: "スキップまたは不正解でクリップがより長く解放される。",
    modalHowToPlayP3: "なるべく少ない回数で正解してスコアをシェアしよう。",
    modalHowToPlayPlay: "プレイ",
    modalAboutTitle: "について",
    modalAboutP1: "VOCALOID HeardleはVOCALOIDとボーカル合成音楽をテーマにした毎日の曲当てゲームです。",
    modalAboutP2: "不正解やスキップのたびにイントロが少しずつ解放されます。正解後に曲の詳細とVocaDBリンクが表示されます。",
    modalSupportTitle: "サポート",
    modalSupportP1: "VOCALOID Heardleはsodapinesが運営するファンメイドの音楽パズルプロジェクトです。",
    modalSupportP2: "バグ・曲の修正・ご提案はこちらまで：",
    modalStatsTitle: "統計",
    modalStatsDailyBtn: "毎日",
    modalStatsUnlimitedBtn: "無制限",
    statsPlayed: "プレイ数",
    statsWon: "正解数",
    statsWinRate: "正解率",
    statsCurrentStreak: "現在の連続正解",
    statsMaxStreak: "最高連続正解",
    settingsTitle: "設定",
    settingDarkMode: "ダークモード",
    settingDarkModeDesc: "ライト・ダークテーマの切り替え",
    settingBulletComments: "弾幕コメント",
    settingBulletCommentsDesc: "カバー画像上にスクロールするコメント",
    settingCommentSpeed: "コメント速度",
    settingCommentSpeedDesc: "コメントのスクロール速度",
    settingSpeedSlow: "遅い",
    settingSpeedNormal: "普通",
    settingSpeedFast: "速い",
    settingCompactMode: "コンパクトモード",
    settingCompactModeDesc: "マーキー・タグ・サイドバーを一括非表示",
    settingMarqueeBar: "マーキーバー",
    settingMarqueeBarDesc: "上部のスクロールアナウンス",
    settingSidebar: "サイドバー",
    settingSidebarDesc: "右側の統計・情報パネル",
    settingAutocomplete: "オートコンプリート",
    settingAutocompleteDesc: "入力中に曲名の候補を表示",
    settingDensity: "弾幕コメント密度",
    settingDensityDesc: "画面に表示されるコメント数",
    settingDensityFew: "少ない",
    settingDensityMedium: "普通",
    settingDensityMany: "多い",
    settingVolume: "音量",
    settingVolumeDesc: "クリップの再生音量",
    settingTitleDisplay: "曲名表示",
    settingTitleDisplayDesc: "候補・履歴での曲名の表示方法",
    settingClearInput: "不正解時に入力をクリア",
    settingClearInputDesc: "不正解後に入力欄を自動クリア",
    settingResetStats: "統計のリセット",
    settingResetStatsDesc: "すべての統計を完全に削除",
    settingResetBtn: "リセット",
    settingResetConfirm: "本当によろしいですか？元に戻せません。",
    settingResetYes: "はい、リセット",
    settingResetNo: "キャンセル",
    infoLabel: "【情報】",
    metaViews: "▶ 再生数：",
    metaCategory: "カテゴリ：",
    metaSource: "ソース：",
    navAbout: "サイトについて",
    navSupport: "サポート",
    navSettings: "設定",
    hofSong1: "千本桜",
    hofSong2: "みくみくにしてあげる♪",
    hofSong3: "メルト",
    hofSong4: "ワールズエンド・ダンスホール",
    hofSong5: "マトリョシカ",
    hofArtist1: "黒うさ",
    hofArtist2: "ika",
    hofArtist3: "ryo",
    hofArtist4: "wowaka",
    hofArtist5: "ハチ",
    linkVocaDB: "VocaDB ↗",
    linkNicoNico: "ニコニコ動画 ↗",
    linkAbout: "このサイトについて",
    linkContact: "お問い合わせ",
    rankingsHeader: "グローバルランキング",
    rankingsTabPlays: "再生数",
    rankingsTabHardest: "難しい",
    rankingsTabEasiest: "簡単",
    rankingsSeeAll: "すべて見る →",
    rankingsNote: "無制限モードのプレイのみ対象。5回未満のプレイは除外されます。",
    rankingsModalTitle: "グローバルランキング",
    rankingsPlays: (n) => `${n}回再生`,
    rankingsWin: (n) => `正解率${n}%`,
    rankingsAvgAttempts: (n) => `${n} 平均挑戦数`,
    rankingsNoData: "データがまだありません。",
    rankingsNoDataModal: "データがまだありません — 無制限モードで曲を当ててみよう！",
    rankingsLoading: "読み込み中...",
    introCopy: "イントロを聴いてVOCALOID曲を当てよう。",
    breadcrumb: "ゲーム › 音楽 › VOCALOID › Heardle",
    footerText: "VOCALOID Heardle：ファンメイドの毎日クイズゲーム © 2026 | クリプトン・フューチャー・メディア及びニコニコと無関係 | 楽曲データ：",
    howToPlayStep1: "▶ を押してイントロを聴く",
    howToPlayStep2: "曲名を入力して送信する",
    howToPlayStep3: "不正解・スキップでより長いクリップが解放される",
    howToPlayStep4: "6回以内に正解する",
    howToPlayStep5: "結果をシェアしよう！",
    hofNote: "ニコニコ動画で最も再生されたVOCALOID曲",
  },
};

function getLang() {
  return localStorage.getItem("vh-lang") || "en";
}

function t(key, ...args) {
  const lang = getLang();
  const val = STRINGS[lang]?.[key] ?? STRINGS.en[key];
  return typeof val === "function" ? val(...args) : val;
}

function hasJapanese(str) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(str);
}

function getJpTitle(song) {
  const jpTitle = (song.acceptedTitles || []).find(hasJapanese);
  return jpTitle || song.title;
}

function getDisplayTitle(song) {
  const titleMode = localStorage.getItem("vh-title-mode") || "en";
  if (titleMode === "jp") return getJpTitle(song);
  if (titleMode === "romaji") {
    const titles = song.acceptedTitles || [];
    const romaji = titles.find(t => !hasJapanese(t) && t !== song.title && /^[a-zA-Z]/.test(t));
    return romaji || song.title;
  }
  if (titleMode === "en") {
    // if en mode but lang is jp, still show EN title
    return song.title;
  }
  // fallback: if no explicit mode, follow language
  if (getLang() === "jp") return getJpTitle(song);
  return song.title;
}

function refreshTitleSurfaces() {
  Object.keys(rankingsCache).forEach((key) => {
    rankingsCache[key] = null;
  });

  render();

  if (state.isComplete) {
    revealAnswer();
  }

  if (!suggestionList.hidden && guessInput.value.trim()) {
    renderSuggestions();
  }

  loadSidebarRankings(currentSbTab);
  if (activeModal?.id === "rankings") {
    loadModalRankings(currentModalTab);
  }
}

function applyLanguage() {
  const lang = getLang();
  document.documentElement.lang = lang === "jp" ? "ja" : "en";

  // flag buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  const set = (sel, key, ...args) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = t(key, ...args);
  };

  // game UI
  set("#guess-input-label", "songTitle");
  set("#submit-button-text", "submit");
  set("#skip-button", "skip");
  set("#give-up-button", "giveUp");
  set("#next-button", "nextSong");
  set("#share-button-text", "copyResult");
  set(".guess-history h3", "pastGuesses");
  set(".nnd-marquee-inner", "marquee");
  set(".intro-copy", "introCopy");
  const clipNote = document.querySelector(".clip-note");
  if (clipNote) clipNote.textContent = t("disclaimer");

  // breadcrumb
  const breadcrumb = document.querySelector(".nnd-breadcrumb");
  if (breadcrumb) breadcrumb.textContent = t("breadcrumb");

  // sidebar
  set(".sb-played-label", "played");
  set(".sb-won-label", "won");
  set(".sb-winrate-label", "winRate");
  set(".sb-streak-label", "streak");
  set(".sb-best-label", "bestStreak");
  set(".sb-total-label", "songsInPool");
  set(".sidebar-link.full-stats", "viewFullStats");
  set(".sb-howtoplay-header", "howToPlay");
  set(".sb-hallofmyths-header", "hallOfMyths");
  set(".sb-links-header", "links");
  set(".sidebar-hof-note", "hofNote");

  // sidebar how to play steps
  const steps = document.querySelectorAll(".nnd-sidebar-howto p");
  const stepKeys = ["howToPlayStep1","howToPlayStep2","howToPlayStep3","howToPlayStep4","howToPlayStep5"];
  steps.forEach((p, i) => {
    if (stepKeys[i]) {
      const num = p.querySelector(".how-num");
      p.textContent = t(stepKeys[i]);
      if (num) p.prepend(num);
    }
  });

  // mode buttons
  const daily = document.querySelector("#daily-mode-button");
  const unlimited = document.querySelector("#unlimited-mode-button");
  if (daily) daily.childNodes[0].textContent = t("daily") + " ";
  if (unlimited) unlimited.textContent = t("unlimited");

  // input placeholder
  if (guessInput) guessInput.placeholder = t("placeholder");

  // cover caption if not complete
  if (!state.isComplete) {
    if (coverCaption) coverCaption.textContent = t("coverCaption");
  }

  // modals
  set("#how-to-play-title", "modalHowToPlayTitle");
  set("#about-title", "modalAboutTitle");
  set("#support-title", "modalSupportTitle");
  set("#stats-title", "modalStatsTitle");
  set("#settings-title", "settingsTitle");
  set("#stats-daily-button", "modalStatsDailyBtn");
  set("#stats-unlimited-button", "modalStatsUnlimitedBtn");

  // stats modal grid labels
  const statLabels = document.querySelectorAll(".stats-grid span");
  const statLabelKeys = ["statsPlayed","statsWon","statsWinRate","statsCurrentStreak","statsMaxStreak"];
  statLabels.forEach((el, i) => { if (statLabelKeys[i]) el.textContent = t(statLabelKeys[i]); });

  // how to play modal
  const htpPs = document.querySelectorAll("#how-to-play .instruction-list p");
  if (htpPs[0]) htpPs[0].lastChild.textContent = t("modalHowToPlayP1");
  if (htpPs[1]) htpPs[1].lastChild.textContent = t("modalHowToPlayP2");
  if (htpPs[2]) htpPs[2].lastChild.textContent = t("modalHowToPlayP3");
  const htpPlay = document.querySelector("#how-to-play .modal-action");
  if (htpPlay) htpPlay.textContent = t("modalHowToPlayPlay");

  // about modal
  const aboutPs = document.querySelectorAll("#about p");
  if (aboutPs[0]) aboutPs[0].textContent = t("modalAboutP1");
  if (aboutPs[1]) aboutPs[1].textContent = t("modalAboutP2");

  // support modal
  const supportPs = document.querySelectorAll("#support p");
  if (supportPs[0]) supportPs[0].textContent = t("modalSupportP1");
  if (supportPs[1]) {
    supportPs[1].textContent = t("modalSupportP2") + " ";
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:kzen@sodapines.dev";
    emailLink.textContent = "kzen@sodapines.dev";
    supportPs[1].appendChild(emailLink);
  }

  // settings modal
  set("#settings-title", "settingsTitle");
  const settingRows = [
    ["[id='setting-darkmode']", "settingDarkMode", "settingDarkModeDesc"],
    ["[id='setting-danmaku']", "settingBulletComments", "settingBulletCommentsDesc"],
    ["[id='setting-compact']", "settingCompactMode", "settingCompactModeDesc"],
    ["[id='setting-marquee']", "settingMarqueeBar", "settingMarqueeBarDesc"],
    ["[id='setting-sidebar']", "settingSidebar", "settingSidebarDesc"],
    ["[id='setting-autocomplete']", "settingAutocomplete", "settingAutocompleteDesc"],
    ["[id='setting-clearwrong']", "settingClearInput", "settingClearInputDesc"],
    ["[id='reset-stats-button']", "settingResetStats", "settingResetStatsDesc"],
  ];
  settingRows.forEach(([btnSel, labelKey, descKey]) => {
    const btn = document.querySelector(btnSel);
    if (!btn) return;
    const row = btn.closest(".settings-row");
    if (!row) return;
    const label = row.querySelector(".settings-label");
    const desc = row.querySelector(".settings-desc");
    if (label) label.textContent = t(labelKey);
    if (desc) desc.textContent = t(descKey);
  });

  // comment speed label/desc — separate from its buttons
  const speedRow = document.querySelector("[data-setting='danmaku-speed']")?.closest(".settings-row");
  if (speedRow) {
    const lbl = speedRow.querySelector(".settings-label");
    const dsc = speedRow.querySelector(".settings-desc");
    if (lbl) lbl.textContent = t("settingCommentSpeed");
    if (dsc) dsc.textContent = t("settingCommentSpeedDesc");
  }

  // comment speed buttons
  const speedBtns = document.querySelectorAll("[data-setting='danmaku-speed']");
  const speedKeys = ["settingSpeedSlow","settingSpeedNormal","settingSpeedFast"];
  speedBtns.forEach((btn, i) => { if (speedKeys[i]) btn.textContent = t(speedKeys[i]); });

  // density label/desc
  const densityRow = document.querySelector("[data-setting='danmaku-density']")?.closest(".settings-row");
  if (densityRow) {
    const lbl = densityRow.querySelector(".settings-label");
    const dsc = densityRow.querySelector(".settings-desc");
    if (lbl) lbl.textContent = t("settingDensity");
    if (dsc) dsc.textContent = t("settingDensityDesc");
  }
  const densityBtns = document.querySelectorAll("[data-setting='danmaku-density']");
  const densityKeys = ["settingDensityFew","settingDensityMedium","settingDensityMany"];
  densityBtns.forEach((btn, i) => { if (densityKeys[i]) btn.textContent = t(densityKeys[i]); });

  // volume label/desc
  const volInput = document.querySelector("#setting-volume");
  if (volInput) {
    const row = volInput.closest(".settings-row");
    if (row) {
      const lbl = row.querySelector(".settings-label");
      const dsc = row.querySelector(".settings-desc");
      if (lbl) lbl.textContent = t("settingVolume");
      if (dsc) dsc.textContent = t("settingVolumeDesc");
    }
  }

  // title mode row — always visible, overrides language for song titles
  const titleModeRow = document.querySelector("#title-mode-row");
  if (titleModeRow) {
    titleModeRow.hidden = false;
    const lbl = titleModeRow.querySelector(".settings-label");
    const dsc = titleModeRow.querySelector(".settings-desc");
    if (lbl) lbl.textContent = t("settingTitleDisplay");
    if (dsc) dsc.textContent = t("settingTitleDisplayDesc");
  }

  // reset stats confirm
  const resetConfirmText = document.querySelector("#reset-stats-confirm > span");
  if (resetConfirmText) resetConfirmText.textContent = t("settingResetConfirm");
  const resetBtn = document.querySelector("#reset-stats-button");
  if (resetBtn) resetBtn.textContent = t("settingResetBtn");
  const resetYes = document.querySelector("#reset-stats-yes");
  if (resetYes) resetYes.textContent = t("settingResetYes");
  const resetNo = document.querySelector("#reset-stats-no");
  if (resetNo) resetNo.textContent = t("settingResetNo");

  // topbar date
  const dateEl = document.querySelector("#nnd-date");
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = lang === "jp"
      ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(d)
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  // [INFO] marquee label
  const marqueeLabel = document.querySelector(".nnd-marquee-label");
  if (marqueeLabel) marqueeLabel.textContent = t("infoLabel");

  // meta row labels
  const metaLabels = document.querySelectorAll(".nnd-meta-label");
  if (metaLabels[0]) metaLabels[0].textContent = t("metaViews");
  if (metaLabels[1]) metaLabels[1].textContent = t("metaCategory");
  if (metaLabels[2]) metaLabels[2].textContent = t("metaSource");

  // top-right nav
  document.querySelectorAll(".nnd-header-links a").forEach(a => {
    const target = a.dataset.modalTarget;
    if (target === "about") a.textContent = t("navAbout");
    if (target === "support") a.textContent = t("navSupport");
    if (target === "settings") a.textContent = t("navSettings");
  });
  const mobileSettings = document.querySelector(".nnd-mobile-settings a");
  if (mobileSettings) mobileSettings.textContent = "⚙ " + t("navSettings");

  // Hall of Myths songs and artists
  const hofSongs = document.querySelectorAll(".hof-song");
  const hofArtists = document.querySelectorAll(".hof-artist");
  const hofSongKeys = ["hofSong1","hofSong2","hofSong3","hofSong4","hofSong5"];
  const hofArtistKeys = ["hofArtist1","hofArtist2","hofArtist3","hofArtist4","hofArtist5"];
  hofSongs.forEach((el, i) => { if (hofSongKeys[i]) el.textContent = t(hofSongKeys[i]); });
  hofArtists.forEach((el, i) => { if (hofArtistKeys[i]) el.textContent = t(hofArtistKeys[i]); });

  // sidebar links
  document.querySelectorAll(".nnd-sidebar .sidebar-link:not(.full-stats)").forEach(a => {
    const href = a.getAttribute("href") || "";
    const target = a.dataset.modalTarget;
    if (href.includes("vocadb.net")) a.textContent = t("linkVocaDB");
    else if (href.includes("nicovideo.jp")) a.textContent = t("linkNicoNico");
    else if (target === "about") a.textContent = t("linkAbout");
    else if (target === "support") a.textContent = t("linkContact");
  });

  // sidebar rankings
  set(".sb-rankings-header", "rankingsHeader");
  set("#sb-rankings-see-all", "rankingsSeeAll");
  const sbTabs = document.querySelectorAll(".sb-rankings-tab");
  const sbTabKeys = ["rankingsTabPlays", "rankingsTabHardest", "rankingsTabEasiest"];
  sbTabs.forEach((btn, i) => { if (sbTabKeys[i]) btn.textContent = t(sbTabKeys[i]); });

  // rankings modal
  set("#rankings-title", "rankingsModalTitle");
  const rankingsNote = document.querySelector(".rankings-note");
  if (rankingsNote) rankingsNote.textContent = t("rankingsNote");
  const modalTabs = document.querySelectorAll(".rankings-tab");
  const modalTabKeys = ["rankingsTabPlays", "rankingsTabHardest", "rankingsTabEasiest"];
  modalTabs.forEach((btn, i) => { if (modalTabKeys[i]) btn.textContent = t(modalTabKeys[i]); });

  // re-render rankings with new language
  loadSidebarRankings(currentSbTab);

  // re-render guesses and update sidebar stats label
  renderGuesses();
  if (typeof renderStats === "function") renderStats();
}

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
  if (sbLabel) sbLabel.textContent = state.mode === "daily" ? t("dailyStats") : t("unlimitedStats");
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
  const lang = getLang();
  const today = new Date();
  if (lang === "jp") {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(today);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(today);
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

const JP_NAME_MAP = {
  // ── Vocaloid / Synth singers ──
  "Hatsune Miku": "初音ミク",
  "Kagamine Rin": "鏡音リン",
  "Kagamine Len": "鏡音レン",
  "Megurine Luka": "巡音ルカ",
  "KAITO": "KAITO",
  "MEIKO": "MEIKO",
  "Gumi": "GUMI",
  "IA": "IA",
  "Kaai Yuki": "歌愛ユキ",
  "Kasane Teto": "重音テト",
  "Yuzuki Yukari": "結月ゆかり",
  "Tohoku Zunko": "東北ずん子",
  "Kizuna Akari": "紲星あかり",
  "Tone Rion": "音街ウナ",
  "Una": "音街ウナ",
  "Nekomura Iroha": "猫村いろは",
  "SF-A2 miki": "SF-A2 miki",
  "CUL": "CUL",
  "VY1": "VY1",
  "VY2": "VY2",
  "Lily": "Lily",
  "Macne Nana": "マクネナナ",
  "Kokone": "ここね",
  "Mayu": "MAYU",
  "Azuki": "小豆",
  "Merli": "メルリ",
  "Galaco": "GALACO",
  "Rana": "ラナ",
  "Ring Suzune": "鈴音リン",
  "Fukase": "FUKASE",
  "Tsurumaki Maki": "弦巻マキ",
  "Tohoku Kiritan": "東北きりたん",
  "Tohoku Itako": "東北イタコ",
  "Shizuku Otonase": "音瀬しずく",
  "Akane Lino": "燐音アカネ",
  "Various artists": "Various artists",
  // ── Producers ──
  "PinocchioP": "ピノキオピー",
  "DECO*27": "DECO*27",
  "wowaka": "wowaka",
  "ryo": "ryo",
  "supercell": "supercell",
  "kemu": "kemu",
  "cosMo@BousouP": "cosMo@暴走P",
  "HachioujiP": "八王子P",
  "MikuP": "ミクP",
  "MikitoP": "みきとP",
  "UtataP": "うたたP",
  "UtsuP": "うつP",
  "Utsu-P": "うつP",
  "LamazeP": "ラマーズP",
  "GomP": "GomP",
  "Gom": "Gom",
  "NayutalieN": "ナユタン星人",
  "Orangestar": "Orangestar",
  "n-buna": "n-buna",
  "doriko": "doriko",
  "halyosy": "halyosy",
  "baker": "baker",
  "kz": "kz",
  "livetune": "livetune",
  "samfree": "samfree",
  "sasakure.UK": "さつき が てんこもり",
  "Satsuki ga Tenkomori": "さつき が てんこもり",
  "syudou": "しゅーず",
  "inabakumori": "稲葉曇",
  "Yoasobi": "YOASOBI",
  "Eve": "Eve",
  "Reol": "Reol",
  "iroha(sasaki)": "iroha(sasaki)",
  "mothy": "悪ノP",
  "Hitoshizuku": "一粒",
  "HitoshizukuP": "一粒P",
  "KurousaP": "黒うさP",
  "Last Note.": "LastNote.",
  "Nem": "Nem",
  "Neru": "Neru",
  "Kikuo": "きくお",
  "Kanaria": "カナリア",
  "Omoi": "Omoi",
  "MARETU": "MARETU",
  "Mitchie M": "Mitchie M",
  "Junky": "Junky",
  "Scop": "scop",
  "scop": "scop",
  "tilt-six": "tilt-six",
  "Giga": "Giga",
  "otetsu": "otetsu",
  "Hitorie": "ヒトリエ",
  "JIN": "じん",
  "Kairiki bear": "カイリキーベア",
  "Chinozo": "チノゾ",
  "Yuuyu": "ゆうゆ",
  "Yuyoyuppe": "ゆよゆっぺ",
  "HoneyWorks": "HoneyWorks",
  "Toraboruta": "とらぼるた",
  "OSTER project": "OSTER project",
  "EasyPop": "EasyPop",
  "Machigerita": "まちゲリータ",
  "Suzumu": "鈴木",
  "Tsumiki": "ツミキ",
  "Teniwoha": "てにをは",
  "Hiiragi Kirai": "柊キライ",
  "Harumaki Gohan": "春巻飯",
  "Koronba": "コロンバ",
  "Nanou": "なのう",
  "nanou": "なのう",
  "balloon": "balloon",
  "niki": "niki",
  "keeno": "keeno",
  "Iyowa": "イヨワ",
  "iyowa": "イヨワ",
  "koyori": "こより",
  "Yurry Canon": "ゆるりかのん",
  "YurryCanon": "ゆるりかのん",
  "Mafumafu": "まふまふ",
  "Siinamota": "椎名もた",
  "siinamota": "椎名もた",
  "Owata P": "おわたP",
  "OwataP": "おわたP",
  "Polyphonicbranch": "ポリフォニックブランチ",
  "PolyphonicBranch": "ポリフォニックブランチ",
  "Rerulili": "れるりり",
  "rerulili": "れるりり",
  "Shikata Akiko": "志方あきこ",
  "Nasimoto Ui": "なしもとうい",
  "NashimotoUi": "なしもとうい",
  "Nashimoto Ui": "なしもとうい",
  "1640mP": "1640mP",
  "HACHI": "ハチ",
  "WADATAKEAKI": "WADATAKEAKI",
  "Daniwell": "daniwell",
  "daniwell": "daniwell",
  "Chouchou P": "ちょうちょP",
  "ChouchouP": "ちょうちょP",
  "CircusP": "サーカスP",
  "Circus P": "サーカスP",
  "Ginsaku": "銀咲",
  "Yukopi": "ゆこぴ",
  "Camellia": "かめりあ",
  "Toa": "toa",
  "Storyteller": "Storyteller",
  "Minato": "湊",
  "Minato Takahiro": "湊貴広",
  "n.k": "n.k",
  "Dios/SignalP": "DIOS/シグナルP",
  "Sasanomaly": "笹野末莉",
  "Neru": "Neru",
  "Yama": "yama",
  "yama△": "yama△",
  "Sohta": "そうた",
  "Noripy": "のりぴ",
  "noripy": "のりぴ",
};


function jpifyArtist(artistStr) {
  if (!artistStr) return artistStr;
  let result = artistStr;
  for (const [en, jp] of Object.entries(JP_NAME_MAP)) {
    result = result.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), jp);
  }
  return result;
}

function getSuggestionArtist(song) {
  const base = song.suggestionArtistString || song.displayArtist || song.artistString || song.artist || "";
  if (getLang() === "jp") return jpifyArtist(base);
  return base;
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
  coverCaption.textContent = t("coverCaption");
  answerLink.hidden = true;
  answerLink.href = "#";
  scheduleMessage.hidden = true;
  nextButton.hidden = true;
  shareButton.hidden = true;
  shareButton.innerHTML = `<span id="share-button-text">${t("copyResult")}</span>`;
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
    scheduleMessage.textContent = t("noSchedule");
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
  coverCaption.textContent = `${getDisplayTitle(state.puzzle)} - ${getSuggestionArtist(state.puzzle)}`;
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
    showToast(t("toastCorrect", getDisplayTitle(state.puzzle)));
    gamePanel.classList.remove("is-loss");
  } else {
    showLossToast(t("toastAnswer", getDisplayTitle(state.puzzle)));
    gamePanel.classList.add("is-loss");
  }
  // record to global stats — unlimited only, never daily
  if (state.mode === "unlimited") {
    fetch("https://vocaloidle-stats.sodapines.workers.dev/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId: state.puzzle.vocadbId,
        won,
        attempts: won ? state.attempt : null,
      }),
    }).catch(() => {});
  }
}

function render() {
  gamePanel.classList.toggle("is-complete", state.isComplete);
  puzzleDate.textContent = state.mode === "daily" ? formatToday() : t("unlimited");
  attemptCount.textContent = t("attempt", state.attempt, clipStages.length);
  clipLength.textContent = `${clipStages[state.clipStage]}s`;
  modeEyebrow.textContent = state.mode === "daily" ? t("dailyPuzzle") : t("unlimitedPuzzle");
  answerLink.hidden = !state.isComplete || !state.puzzle?.vocadbUrl;
  answerLink.textContent = t("viewVocaDB");
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

function getResultLabel(result) {
  if (result === "Correct") return t("correct");
  if (result === "Wrong") return t("wrong");
  if (result === "Skipped") return t("skipped");
  if (result === "Answer") return t("answer");
  return result;
}

function renderGuesses() {
  if (state.guesses.length === 0) {
    guessList.innerHTML = `<li class="empty-guess">${t("noGuesses")}</li>`;
    return;
  }

  const previousCount = guessList.querySelectorAll("li:not(.empty-guess)").length;

  guessList.innerHTML = state.guesses
    .map((guess, index) => {
      const resultClass = ` is-${normalizeGuess(guess.result).replace(/\s+/g, "-")}`;
      const guessSong = guess.songId ? getSongById(guess.songId) : null;
      const safeLabel = escapeHtml(guessSong ? getDisplayTitle(guessSong) : guess.label);
      const safeResult = escapeHtml(getResultLabel(guess.result));
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
        <li role="option" data-index="${index}" data-title="${escapeHtml(getDisplayTitle(song))}">
          <span class="suggestion-title">${highlightMatch(getDisplayTitle(song), normalizedQuery)}</span>
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

function addGuess(label, result, songId = null) {
  state.guesses.push({ label, result, songId });
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
  const context = state.mode === "daily" ? formatToday() : getDisplayTitle(state.puzzle);

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

// ── GLOBAL RANKINGS ──
const WORKER_URL = "https://vocaloidle-stats.sodapines.workers.dev";
const rankingsCache = {};
let currentSbTab = "plays";
let currentModalTab = "plays";

function getSongById(vocadbId) {
  return songs.find(s => String(s.vocadbId) === String(vocadbId)) || null;
}

async function fetchRankings(sort) {
  if (rankingsCache[sort]) return rankingsCache[sort];
  try {
    const res = await fetch(`${WORKER_URL}/leaderboard?sort=${sort}&limit=50`);
    const data = await res.json();
    rankingsCache[sort] = data;
    return data;
  } catch {
    return null;
  }
}

function formatAvgAttempts(value) {
  const attempts = Number(value);
  return Number.isFinite(attempts) ? attempts.toFixed(1) : "--";
}

async function loadSidebarRankings(sort) {
  const list = document.querySelector("#sb-rankings-list");
  if (!list) return;
  list.innerHTML = `<div class="sb-rankings-loading">${t("rankingsLoading")}</div>`;
  const data = await fetchRankings(sort);
  if (!data || data.length === 0) {
    list.innerHTML = `<div class="sb-rankings-loading">${t("rankingsNoData")}</div>`;
    return;
  }
  list.innerHTML = data.slice(0, 5).map((entry, index) => {
    const song = getSongById(entry.songId);
    const title = song ? getDisplayTitle(song) : `Song #${entry.songId}`;
    const winRate = Math.round((entry.winRate || 0) * 100);
    return `
      <div class="sb-rankings-row">
        <span class="sb-rankings-rank">${index + 1}</span>
        <span class="sb-rankings-song">${escapeHtml(title)}</span>
        <span class="sb-rankings-pct">${t("rankingsWin", winRate)}</span>
      </div>
    `;
  }).join("");
}

async function loadModalRankings(sort) {
  const content = document.querySelector("#rankings-content");
  if (!content) return;
  content.innerHTML = `<div class="rankings-loading">${t("rankingsLoading")}</div>`;
  const data = await fetchRankings(sort);
  if (!data || data.length === 0) {
    content.innerHTML = `<div class="rankings-loading">${t("rankingsNoDataModal")}</div>`;
    return;
  }
  content.innerHTML = data.map((entry, index) => {
    const song = getSongById(entry.songId);
    const title = song ? getDisplayTitle(song) : `Song #${entry.songId}`;
    const artist = song ? getSuggestionArtist(song) : "—";
    const winRate = Math.round((entry.winRate || 0) * 100);
    const plays = (entry.plays || 0).toLocaleString();
    const avgAttempts = formatAvgAttempts(entry.avgAttempts);
    return `
      <div class="rankings-row">
        <span class="rankings-rank">${index + 1}</span>
        <span class="rankings-title-col">
          <span class="rankings-song">${escapeHtml(title)}</span>
          <span class="rankings-artist">${escapeHtml(artist)}</span>
        </span>
        <span class="rankings-stats-col">
          <span class="rankings-plays">${t("rankingsPlays", plays)}</span>
          <span class="rankings-winrate">${t("rankingsWin", winRate)}</span>
          <span class="rankings-avg">${t("rankingsAvgAttempts", avgAttempts)}</span>
        </span>
      </div>
    `;
  }).join("");
}

document.querySelectorAll(".sb-rankings-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    currentSbTab = btn.dataset.rankingsTab;
    document.querySelectorAll(".sb-rankings-tab").forEach(b =>
      b.classList.toggle("is-active", b.dataset.rankingsTab === currentSbTab)
    );
    rankingsCache[currentSbTab] = null; // clear cache to refresh
    loadSidebarRankings(currentSbTab);
  });
});

document.querySelectorAll(".rankings-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    currentModalTab = btn.dataset.tab;
    document.querySelectorAll(".rankings-tab").forEach(b =>
      b.classList.toggle("is-active", b.dataset.tab === currentModalTab)
    );
    rankingsCache[currentModalTab] = null;
    loadModalRankings(currentModalTab);
  });
});

document.querySelectorAll("[data-modal-target='rankings']").forEach(el => {
  el.addEventListener("click", () => loadModalRankings(currentModalTab));
});

loadSidebarRankings(currentSbTab);

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

  addGuess(`${t("skipped")} ${state.attempt}`, "Skipped");
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
    addGuess(state.puzzle.title, "Correct", state.puzzle.vocadbId);
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
    addGuess(t("gaveUp"), "Answer");
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
    showToast(t("toastStatsReset"));
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
    showToast(t("toastCopied"));
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

// ── LANGUAGE TOGGLE ──
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const newLang = btn.dataset.lang;
    localStorage.setItem("vh-lang", newLang);
    if (newLang === "jp") {
      localStorage.setItem("vh-title-mode", "jp");
    } else {
      localStorage.setItem("vh-title-mode", "en");
    }
    document.querySelectorAll("[data-title-mode]").forEach(b =>
      b.classList.toggle("is-active", b.dataset.titleMode === localStorage.getItem("vh-title-mode"))
    );
    applyLanguage();
    refreshTitleSurfaces();
  });
});

// ── TITLE MODE ──
document.querySelectorAll("[data-title-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    localStorage.setItem("vh-title-mode", btn.dataset.titleMode);
    document.querySelectorAll("[data-title-mode]").forEach(b =>
      b.classList.toggle("is-active", b.dataset.titleMode === btn.dataset.titleMode)
    );
    refreshTitleSurfaces();
  });
});

function initTitleMode() {
  const mode = localStorage.getItem("vh-title-mode") || "en";
  document.querySelectorAll("[data-title-mode]").forEach(btn =>
    btn.classList.toggle("is-active", btn.dataset.titleMode === mode)
  );
}

loadPuzzle();
renderStats();
checkNewBadge();
applyLanguage();
initTitleMode();
