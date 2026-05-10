const clipStages = [1, 2, 4, 7, 11, 16];
const maxClipLength = clipStages.at(-1);
const songs = window.VOCALOID_HEARDLE_SONGS || [];
const statsKey = "vocaloid-heardle-stats";
const unlimitedStatsKey = "vocaloid-heardle-unlimited-stats";
const archiveResultsKey = "vocaloid-heardle-archive-results";
const contactEmail = "kzen@sodapines.dev";

// ── i18n ──
const STRINGS = {
  en: {
    dailyPuzzle: "daily puzzle",
    unlimitedPuzzle: "unlimited puzzle",
    daily: "Daily",
    unlimited: "Unlimited",
    archive: "Archive",
    archivePuzzle: "archive puzzle",
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
    toastAlreadyGuessed: "Already guessed.",
    toastSelectSong: "Select a song from the list.",
    heardleDaily: "VOCALOID Heardle Daily",
    heardleUnlimited: "VOCALOID Heardle Unlimited",
    placeholder: "type your guess...",
    disclaimer: "Some songs may not begin playing within the first second.",
    marquee: "★ A new daily puzzle is available each day ★ Use unlimited mode to practice anytime ★ Guess the VOCALOID song from the opening clip in 6 tries or less ★ Share your score with friends! ★ Songs sourced from VocaDB ★",
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
    modalSupportP3: "Hosting and the stats backend cost a bit each month to keep running. If you've enjoyed the game and want to chip in, even a one-time tip helps cover those costs.",
    modalReleaseTitle: "Release Notes",
    modalReleaseVersion: "Official Release v1.0",
    modalReleaseIntro: "This release collects the major updates being prepared for the public site.",
    modalReleaseArchive: "Daily Archive with playable past puzzles, monthly completion summaries, and hardest/easiest daily notes.",
    modalReleaseRandom: "Random Archive Puzzle for jumping into older dailies without picking a date.",
    modalReleaseStats: "Global song stats, solve rates, average attempts, and expanded rankings with Lowest/Highest Avg tabs.",
    modalReleasePool: "Song Pool credits, VocaDB source information, and clearer project disclaimers.",
    modalReleaseCommunity: "Suggest a Song, Report Issue forms, and Community Suggested tags for future additions.",
    modalReleaseLanguage: "English/Japanese interface support with song title display options.",
    modalReleasePolish: "Retro NicoNico-inspired layout polish, improved autocomplete, and Cloudflare-hosted audio support.",
    modalSongPoolTitle: "Song Pool",
    modalSongPoolSummary: "Songs are sourced from VocaDB. Daily puzzles are selected from a curated VOCALOID/music database.",
    modalSongPoolTotal: "Total songs in pool",
    modalSongPoolSources: "Sources used",
    modalSongPoolSourcesValue: "VocaDB, YouTube, NicoNico, Cloudflare R2 audio hosting",
    modalSongPoolCredit: "Song data credit",
    modalSongPoolDisclaimer: "VOCALOID Heardle is a fan-made project and is not affiliated with Crypton Future Media, NicoNico, VocaDB, or the artists represented in the song pool.",
    modalSuggestTitle: "Suggest a Song",
    modalSuggestIntro: "Send a song for future puzzle consideration. Suggestions are not guaranteed, but they help improve the pool.",
    modalSuggestLabelTitle: "Song title",
    modalSuggestLabelProducer: "Producer",
    modalSuggestLabelVocal: "Vocal synth",
    modalSuggestLabelVocadb: "VocaDB link",
    modalSuggestLabelSource: "YouTube/NicoNico link",
    modalSuggestLabelReason: "Why should this be included?",
    modalSuggestSubmit: "Email Suggestion",
    modalReportTitle: "Report Issue",
    modalReportIntro: "Use this form to report a problem with the current puzzle.",
    modalReportLabelReason: "Reason",
    modalReportLabelDetails: "Details",
    modalReportDetailPlaceholder: "What happened?",
    modalReportSubmit: "Email Report",
    modalReportOptMetadata: "Wrong song metadata",
    modalReportOptAudio: "Audio does not play",
    modalReportOptSource: "Wrong source",
    modalReportOptDuplicate: "Duplicate song",
    modalReportOptStartpoint: "Bad starting point",
    modalReportOptAnswer: "Answer not accepted",
    modalReportOptOther: "Other",
    reportIssue: "Report issue",
    modalStatsTitle: "Stats",
    modalStatsDailyBtn: "Daily",
    modalStatsUnlimitedBtn: "Unlimited",
    statsPlayed: "Played",
    statsWon: "Won",
    statsWinRate: "Win rate",
    statsCurrentStreak: "Current streak",
    statsMaxStreak: "Max streak",
    statsAvgAttempts: "Avg winning attempts",
    sbAvgAttempts: "Avg Attempts",
    nextDailyCountdown: (h, m, s) => `Next puzzle in <strong>${h}h ${m}m ${s}s</strong>`,
    nextDailyReady: "A new daily puzzle is available!",
    archiveSolved: "Solved",
    archiveFailed: "Open",
    archiveUnplayed: "Available",
    archiveSummaryOpened: "Played",
    archiveSummarySolved: "Solved",
    archiveSummaryRevealed: "Revealed",
    archiveSummaryComplete: "Complete",
    archiveMonthBadge: (solved, total, rate) => `${solved}/${total} solved · ${rate}%`,
    archiveHardest: "Hardest daily",
    archiveEasiest: "Easiest daily",
    archiveInsightsLoading: "Loading month difficulty...",
    archiveInsightsEmpty: "Month difficulty appears after you open archive puzzles.",
    archiveRandom: "Random Archive Puzzle",
    archiveRandomEmpty: "No archive puzzles are available yet.",
    tagCommunitySuggested: "Community suggested",
    tagSpecialTest: "Special test label",
    kofiNudgeText: "Enjoying the project? Tips help keep it running.",
    kofiNudgeLink: "Support on Ko-fi →",
    statHardestLabel: "Hardest solved",
    statHardestEmpty: "Hardest solved: solve a song to set this!",
    statHardestLine: (title, rate) => `<span class="sh-label">Hardest solved:</span> <span class="sh-title">${title}</span> — <span class="sh-rate">${rate}% global solve</span>`,
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
    settingReportIssue: "Report Issue",
    settingReportIssueDesc: "Send metadata, audio, duplicate, or answer problems",
    settingReportIssueBtn: "Report",
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
    navUpdates: "Updates",
    linkReleaseNotes: "Release Notes",
    linkReleaseVersion: "Release v1.0",
    linkSongPool: "Song Pool",
    linkSuggestSong: "Suggest a Song",
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
    rankingsTabAvgLow: "Lowest Avg",
    rankingsTabAvgHigh: "Highest Avg",
    rankingsSeeAll: "See all →",
    rankingsNote: "Based on unlimited mode plays only. Songs with fewer than 5 plays are excluded.",
    rankingsModalTitle: "Global Rankings",
    rankingsPlays: (n) => `${n} plays`,
    rankingsWin: (n) => `${n}%`,
    rankingsAvgAttempts: (n) => `${n} avg attempts`,
    rankingsNoData: "No data yet.",
    rankingsNoDataModal: "No data yet, play some unlimited songs first!",
    rankingsLoading: "Loading...",
    archiveTitle: "Daily Archive",
    archiveNote: "Play previous daily puzzles. New completed dailies appear here automatically.",
    archiveEmpty: "No puzzle",
    globalStats: (rate, avg, plays) => `Global solve rate: <span class="gs-rate${rate < 30 ? ' gs-hard' : ''}">${rate}%</span> · Avg winning attempts: <span class="gs-rate">${avg}/6</span> · ${plays.toLocaleString()} plays`,
    globalStatsNoWins: (rate, plays) => `Global solve rate: <span class="gs-rate gs-hard">${rate}%</span> · ${plays.toLocaleString()} plays`,
    globalStatsNone: "",
    difficultyLabel: (label) => `Difficulty: ${label}`,
    difficultyFree: "Free",
    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    difficultyUnknown: "what is this song???",
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
    archive: "アーカイブ",
    archivePuzzle: "アーカイブ問題",
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
    toastAlreadyGuessed: "すでに回答済みです。",
    toastSelectSong: "リストから曲を選んでください。",
    heardleDaily: "VOCALOID Heardle 毎日",
    heardleUnlimited: "VOCALOID Heardle 無制限",
    placeholder: "曲名を入力...",
    disclaimer: "曲によっては最初の1秒で再生が始まらない場合があります。",
    marquee: "★ 毎日新しいパズルが更新されます ★ 無制限モードでいつでも練習できます ★ 6回以内にVOCALOID曲を当てよう ★ 結果をシェアしよう！ ★ 楽曲データはVocaDBより ★",
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
    modalSupportP3: "サーバーと統計バックエンドの維持には毎月少し費用がかかります。気に入っていただけたら、1回限りの寄付でも運営の助けになります。",
    modalSongPoolTitle: "曲プール",
    modalSongPoolSummary: "楽曲はVocaDBから取得しています。デイリーパズルはVOCALOID/音楽データベースからキュレーションされた曲から選ばれます。",
    modalSongPoolTotal: "プールの総曲数",
    modalSongPoolSources: "使用ソース",
    modalSongPoolSourcesValue: "VocaDB・YouTube・ニコニコ動画・Cloudflare R2 音声ホスティング",
    modalSongPoolCredit: "楽曲データ提供",
    modalSongPoolDisclaimer: "VOCALOID Heardleはファンメイドのプロジェクトであり、クリプトン・フューチャー・メディア、ニコニコ動画、VocaDB、および曲プールに含まれるアーティストとは無関係です。",
    modalSuggestTitle: "曲を提案する",
    modalSuggestIntro: "今後のパズル候補として曲を送ってください。採用は保証されませんが、プール改善に役立ちます。",
    modalSuggestLabelTitle: "曲名",
    modalSuggestLabelProducer: "プロデューサー",
    modalSuggestLabelVocal: "ボーカル合成",
    modalSuggestLabelVocadb: "VocaDBリンク",
    modalSuggestLabelSource: "YouTube/ニコニコリンク",
    modalSuggestLabelReason: "なぜ追加すべきですか？",
    modalSuggestSubmit: "メールで提案",
    modalReportTitle: "問題を報告",
    modalReportIntro: "現在のパズルの問題をこのフォームで報告してください。",
    modalReportLabelReason: "理由",
    modalReportLabelDetails: "詳細",
    modalReportDetailPlaceholder: "何が起きましたか？",
    modalReportSubmit: "メールで報告",
    modalReportOptMetadata: "曲のメタデータが間違っている",
    modalReportOptAudio: "音声が再生されない",
    modalReportOptSource: "ソースが違う",
    modalReportOptDuplicate: "曲が重複している",
    modalReportOptStartpoint: "再生開始位置が悪い",
    modalReportOptAnswer: "正解が受け付けられない",
    modalReportOptOther: "その他",
    reportIssue: "問題を報告",
    linkSongPool: "曲プール",
    linkSuggestSong: "曲を提案する",
    modalStatsTitle: "統計",
    modalStatsDailyBtn: "毎日",
    modalStatsUnlimitedBtn: "無制限",
    statsPlayed: "プレイ数",
    statsWon: "正解数",
    statsWinRate: "正解率",
    statsCurrentStreak: "現在の連続正解",
    statsMaxStreak: "最高連続正解",
    statsAvgAttempts: "平均挑戦回数",
    sbAvgAttempts: "平均挑戦",
    nextDailyCountdown: (h, m, s) => `次の問題まで <strong>${h}時間${m}分${s}秒</strong>`,
    nextDailyReady: "新しい問題が利用可能です！",
    archiveSolved: "解放済み",
    archiveFailed: "開封",
    archiveUnplayed: "プレイ可能",
    archiveSummaryOpened: "プレイ",
    archiveSummarySolved: "正解",
    archiveSummaryRevealed: "開封",
    archiveSummaryComplete: "達成率",
    archiveMonthBadge: (solved, total, rate) => `${solved}/${total} 正解 · ${rate}%`,
    archiveHardest: "最難関デイリー",
    archiveEasiest: "最易デイリー",
    archiveInsightsLoading: "月間難易度を読み込み中...",
    archiveInsightsEmpty: "アーカイブ問題を開くと月間難易度が表示されます。",
    archiveRandom: "ランダムアーカイブ",
    archiveRandomEmpty: "利用できるアーカイブ問題はまだありません。",
    tagCommunitySuggested: "コミュニティ推薦",
    tagSpecialTest: "特別テストラベル",
    kofiNudgeText: "楽しんでいただけましたか？支援は運営の助けになります。",
    kofiNudgeLink: "Ko-fiで支援する →",
    statHardestLabel: "最難関の正解",
    statHardestEmpty: "最難関の正解：曲を1つ正解すると記録されます！",
    statHardestLine: (title, rate) => `<span class="sh-label">最難関の正解:</span> <span class="sh-title">${title}</span> — <span class="sh-rate">グローバル正解率${rate}%</span>`,
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
    rankingsTabAvgLow: "低平均",
    rankingsTabAvgHigh: "高平均",
    rankingsSeeAll: "すべて見る →",
    rankingsNote: "無制限モードのプレイのみ対象。5回未満のプレイは除外されます。",
    rankingsModalTitle: "グローバルランキング",
    rankingsPlays: (n) => `${n}回再生`,
    rankingsWin: (n) => `正解率${n}%`,
    rankingsAvgAttempts: (n) => `${n} 平均挑戦数`,
    rankingsNoData: "データがまだありません。",
    rankingsNoDataModal: "データがまだありません — 無制限モードで曲を当ててみよう！",
    rankingsLoading: "読み込み中...",
    archiveTitle: "アーカイブ",
    archiveNote: "過去のデイリーパズルをプレイできます。終了したデイリーは自動的に追加されます。",
    archiveEmpty: "パズルなし",
    globalStats: (rate, avg, plays) => `グローバル正解率: <span class="gs-rate${rate < 30 ? ' gs-hard' : ''}">${rate}%</span> · 平均挑戦回数: <span class="gs-rate">${avg}/6</span> · ${plays.toLocaleString()}回`,
    globalStatsNoWins: (rate, plays) => `グローバル正解率: <span class="gs-rate gs-hard">${rate}%</span> · ${plays.toLocaleString()}回`,
    globalStatsNone: "",
    difficultyLabel: (label) => `難易度: ${label}`,
    difficultyFree: "サービス",
    difficultyEasy: "簡単",
    difficultyMedium: "普通",
    difficultyHard: "難しい",
    difficultyUnknown: "なんの曲？？？",
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

Object.assign(STRINGS.jp, {
  modalReleaseTitle: "更新情報",
  modalReleaseVersion: "正式リリース v1.0",
  modalReleaseIntro: "このリリースでは、公開版サイトに向けた主な更新をまとめています。",
  modalReleaseArchive: "過去のデイリーパズルを遊べるアーカイブ、達成率、月ごとの難易度メモを追加。",
  modalReleaseStats: "グローバル楽曲統計、正解率、平均挑戦回数、ランキングを追加。",
  modalReleasePool: "曲プールのクレジット、VocaDBソース情報、プロジェクトの免責表記を整理。",
  modalReleaseCommunity: "曲の提案フォームと問題報告フォームでコミュニティからのフィードバックに対応。",
  modalReleaseLanguage: "英語/日本語インターフェースと曲名表示オプションに対応。",
  modalReleasePolish: "ニコニコ風レトロUIの調整、オートコンプリート改善、Cloudflare配信音声への対応。",
  navUpdates: "更新情報",
  linkReleaseNotes: "更新情報",
  linkReleaseVersion: "リリース v1.0",
});

Object.assign(STRINGS.jp, {
  modalReleaseArchive: "過去のデイリーパズル、月ごとの達成サマリー、最難関/最易デイリーのメモを追加。",
  modalReleaseRandom: "日付を選ばず過去のデイリーに飛べるランダムアーカイブ問題を追加。",
  modalReleaseStats: "グローバル楽曲統計、正解率、平均挑戦回数、低平均/高平均タブ付きランキングを追加。",
  modalReleaseCommunity: "曲の提案、問題報告フォーム、今後の追加曲向けコミュニティ推薦タグに対応。",
});

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

// Truncate long titles with ellipsis to keep layouts from breaking.
// Used at render sites where overflow causes visual problems (rankings, toasts).
// NOT applied to autocomplete or guess matching — those need full titles.
function truncateTitle(title, max = 40) {
  if (!title) return "";
  return title.length > max ? title.slice(0, max - 1).trimEnd() + "…" : title;
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
  set(".sb-avg-label", "sbAvgAttempts");
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
  const archive = document.querySelector("#archive-mode-button");
  if (daily) daily.childNodes[0].textContent = t("daily") + " ";
  if (unlimited) unlimited.textContent = t("unlimited");
  if (archive) archive.textContent = t("archive");

  // input placeholder
  if (guessInput) guessInput.placeholder = t("placeholder");

  // cover caption if not complete
  if (!state.isComplete) {
    if (coverCaption) coverCaption.textContent = t("coverCaption");
  }
  renderSourceTags();

  // modals
  set("#how-to-play-title", "modalHowToPlayTitle");
  set("#about-title", "modalAboutTitle");
  set("#support-title", "modalSupportTitle");
  set("#release-notes-title", "modalReleaseTitle");
  set("#release-version", "modalReleaseVersion");
  set("#release-intro", "modalReleaseIntro");
  set("#release-item-archive", "modalReleaseArchive");
  set("#release-item-random", "modalReleaseRandom");
  set("#release-item-stats", "modalReleaseStats");
  set("#release-item-pool", "modalReleasePool");
  set("#release-item-community", "modalReleaseCommunity");
  set("#release-item-language", "modalReleaseLanguage");
  set("#release-item-polish", "modalReleasePolish");
  set("#song-pool-title", "modalSongPoolTitle");
  set("#suggest-song-title", "modalSuggestTitle");
  set("#report-issue-title", "modalReportTitle");
  set("#stats-title", "modalStatsTitle");
  set("#settings-title", "settingsTitle");
  set("#stats-daily-button", "modalStatsDailyBtn");
  set("#stats-unlimited-button", "modalStatsUnlimitedBtn");

  // stats modal grid labels
  const statLabels = document.querySelectorAll(".stats-grid span");
  const statLabelKeys = ["statsPlayed","statsWon","statsWinRate","statsCurrentStreak","statsMaxStreak","statsAvgAttempts"];
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
  if (supportPs[2]) supportPs[2].textContent = t("modalSupportP3");
  // song pool / contribution modals
  const songPoolSummary = document.querySelector("#song-pool-summary");
  if (songPoolSummary) songPoolSummary.textContent = t("modalSongPoolSummary");
  const songPoolCount = document.querySelector("#song-pool-count");
  if (songPoolCount) songPoolCount.textContent = songs.length.toLocaleString();
  const infoLabels = document.querySelectorAll("#song-pool dt");
  const infoValues = document.querySelectorAll("#song-pool dd");
  const infoLabelKeys = ["modalSongPoolTotal", "modalSongPoolSources", "modalSongPoolCredit"];
  infoLabels.forEach((el, i) => { if (infoLabelKeys[i]) el.textContent = t(infoLabelKeys[i]); });
  if (infoValues[1]) infoValues[1].textContent = t("modalSongPoolSourcesValue");
  const songPoolFinePrint = document.querySelector("#song-pool .fine-print");
  if (songPoolFinePrint) songPoolFinePrint.textContent = t("modalSongPoolDisclaimer");
  const suggestIntro = document.querySelector("#suggest-song > p");
  if (suggestIntro) suggestIntro.textContent = t("modalSuggestIntro");
  // suggest-song form labels
  const sLabelTitle = document.querySelector("#suggest-label-title");
  if (sLabelTitle) { sLabelTitle.firstChild.textContent = t("modalSuggestLabelTitle") + " "; }
  const sLabelProducer = document.querySelector("#suggest-label-producer");
  if (sLabelProducer) { sLabelProducer.firstChild.textContent = t("modalSuggestLabelProducer") + " "; }
  const sLabelVocal = document.querySelector("#suggest-label-vocal");
  if (sLabelVocal) { sLabelVocal.firstChild.textContent = t("modalSuggestLabelVocal") + " "; }
  const sLabelVocadb = document.querySelector("#suggest-label-vocadb");
  if (sLabelVocadb) { sLabelVocadb.firstChild.textContent = t("modalSuggestLabelVocadb") + " "; }
  const sLabelSource = document.querySelector("#suggest-label-source");
  if (sLabelSource) { sLabelSource.firstChild.textContent = t("modalSuggestLabelSource") + " "; }
  const sLabelReason = document.querySelector("#suggest-label-reason");
  if (sLabelReason) { sLabelReason.firstChild.textContent = t("modalSuggestLabelReason") + " "; }
  const sSubmitBtn = document.querySelector("#suggest-submit-btn");
  if (sSubmitBtn) sSubmitBtn.textContent = t("modalSuggestSubmit");
  const reportIntro = document.querySelector("#report-context");
  if (reportIntro && !state.puzzle) reportIntro.textContent = t("modalReportIntro");
  // report-issue form labels and options
  const rLabelReason = document.querySelector("#report-label-reason");
  if (rLabelReason) { rLabelReason.firstChild.textContent = t("modalReportLabelReason") + "\n          "; }
  const rLabelDetails = document.querySelector("#report-label-details");
  if (rLabelDetails) { rLabelDetails.firstChild.textContent = t("modalReportLabelDetails") + " "; }
  const reportDetails = document.querySelector("#report-details");
  if (reportDetails) reportDetails.placeholder = t("modalReportDetailPlaceholder");
  const rSubmitBtn = document.querySelector("#report-submit-btn");
  if (rSubmitBtn) rSubmitBtn.textContent = t("modalReportSubmit");
  const reportOptIds = [
    ["report-opt-metadata", "modalReportOptMetadata"],
    ["report-opt-audio",    "modalReportOptAudio"],
    ["report-opt-source",   "modalReportOptSource"],
    ["report-opt-duplicate","modalReportOptDuplicate"],
    ["report-opt-startpoint","modalReportOptStartpoint"],
    ["report-opt-answer",   "modalReportOptAnswer"],
    ["report-opt-other",    "modalReportOptOther"],
  ];
  reportOptIds.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const reportLink = document.querySelector("#report-issue-link");
  if (reportLink) reportLink.textContent = t("reportIssue");

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
    if (target === "release-notes") a.textContent = t("navUpdates");
    if (target === "settings") a.textContent = t("navSettings");
    if (target === "song-pool") a.textContent = t("linkSongPool");
    if (target === "suggest-song") a.textContent = t("linkSuggestSong");
  });
  document.querySelectorAll(".nnd-mobile-settings a").forEach(a => {
    const target = a.dataset.modalTarget;
    if (target === "about") a.textContent = t("navAbout");
    if (target === "support") a.textContent = t("navSupport");
    if (target === "release-notes") a.textContent = t("navUpdates");
    if (target === "settings") a.textContent = "⚙ " + t("navSettings");
    // Ko-fi link has no data-modal-target — leave its text alone.
  });

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
    else if (target === "song-pool") a.textContent = t("linkSongPool");
    else if (target === "suggest-song") a.textContent = t("linkSuggestSong");
    else if (target === "release-notes") a.textContent = t("linkReleaseNotes");
    else if (target === "about") a.textContent = t("linkAbout");
    else if (target === "support") a.textContent = t("linkContact");
  });

  // footer links
  document.querySelectorAll(".site-footer a[data-modal-target]").forEach(a => {
    const target = a.dataset.modalTarget;
    if (target === "song-pool") a.textContent = t("linkSongPool");
    else if (target === "suggest-song") a.textContent = t("linkSuggestSong");
    else if (target === "release-notes") a.textContent = t("linkReleaseVersion");
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
  const modalTabKeys = ["rankingsTabPlays", "rankingsTabHardest", "rankingsTabEasiest", "rankingsTabAvgLow", "rankingsTabAvgHigh"];
  modalTabs.forEach((btn, i) => { if (modalTabKeys[i]) btn.textContent = t(modalTabKeys[i]); });

  set("#archive-title", "archiveTitle");
  const archiveNote = document.querySelector(".archive-note");
  if (archiveNote) archiveNote.textContent = t("archiveNote");
  set("#archive-random-button", "archiveRandom");
  renderArchiveCalendar();

  // re-render rankings with new language
  loadSidebarRankings(currentSbTab);

  // re-render guesses and update sidebar stats label
  renderGuesses();
  if (typeof renderStats === "function") renderStats();

  // re-render the cached global win rate line so it switches language too
  renderGlobalStats();

  // translate Ko-fi nudge under the result area
  const kofiNudgeText = document.querySelector(".kofi-nudge-text");
  if (kofiNudgeText) kofiNudgeText.textContent = t("kofiNudgeText");
  const kofiNudgeLink = document.querySelector(".kofi-nudge-link");
  if (kofiNudgeLink) kofiNudgeLink.textContent = t("kofiNudgeLink");

  // re-tick countdown so the unit labels (h/m/s vs 時間/分/秒) update right away
  if (typeof renderCountdownTick === "function" && nextDailyCountdownEl && !nextDailyCountdownEl.hidden) {
    renderCountdownTick();
  }
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
  archiveDate: null,
  archiveMonth: null,
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
const archiveModeButton = document.querySelector("#archive-mode-button");
const nextButton = document.querySelector("#next-button");
const shareButton = document.querySelector("#share-button");
const shareOutput = document.querySelector("#share-output");
const coverImage = document.querySelector("#cover-image");
const coverFallback = document.querySelector("#cover-fallback");
const coverPlaceholderMark = document.querySelector("#cover-placeholder-mark");
const coverCaption = document.querySelector("#cover-caption");
const sourceTags = document.querySelector("#source-tags");
const sourceLink = document.querySelector("#source-link");
const globalStatsEl = document.querySelector("#global-stats");
const resultTools = document.querySelector("#result-tools");
const reportIssueNudge = document.querySelector("#report-issue-nudge");
const statPlayed = document.querySelector("#stat-played");
const statWon = document.querySelector("#stat-won");
const statWinRate = document.querySelector("#stat-win-rate");
const statCurrentStreak = document.querySelector("#stat-current-streak");
const statMaxStreak = document.querySelector("#stat-max-streak");
const statAvgAttempts = document.querySelector("#stat-avg-attempts");
const statHardest = document.querySelector("#stat-hardest");
const nextDailyCountdownEl = document.querySelector("#next-daily-countdown");
const kofiNudgeEl = document.querySelector("#kofi-nudge");
const distributionItems = document.querySelectorAll("[data-distribution]");
const statsDailyButton = document.querySelector("#stats-daily-button");
const statsUnlimitedButton = document.querySelector("#stats-unlimited-button");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalButtons = document.querySelectorAll("[data-modal-target]");
const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-action");
const archiveGrid = document.querySelector("#archive-grid");
const archiveMonthLabel = document.querySelector("#archive-month-label");
const archiveSummary = document.querySelector("#archive-summary");
const archiveInsights = document.querySelector("#archive-insights");
const archiveRandomButton = document.querySelector("#archive-random-button");
const archivePrevMonth = document.querySelector("#archive-prev-month");
const archiveNextMonth = document.querySelector("#archive-next-month");
const suggestSongForm = document.querySelector("#suggest-song-form");
const reportIssueForm = document.querySelector("#report-issue-form");
const reportContext = document.querySelector("#report-context");
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

function loadArchiveResults() {
  try {
    return JSON.parse(localStorage.getItem(archiveResultsKey)) || {};
  } catch {
    return {};
  }
}

function saveArchiveResults(results) {
  localStorage.setItem(archiveResultsKey, JSON.stringify(results));
}

function saveArchiveResult(dateKey, result) {
  if (!dateKey) return;
  const results = loadArchiveResults();
  results[dateKey] = result;
  saveArchiveResults(results);
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

  // Personal avg attempts — weighted average of solve buckets 1–6.
  // "—" if no successful solves yet, since 0 average is misleading.
  if (statAvgAttempts) {
    const personalAvg = computePersonalAvg(stats.distribution);
    statAvgAttempts.textContent = personalAvg === null ? "—" : personalAvg.toFixed(1);
  }

  // Hardest solved — read from stats.hardestSolved if present.
  if (statHardest) {
    const hardest = stats.hardestSolved;
    if (hardest && hardest.title) {
      statHardest.innerHTML = t("statHardestLine", escapeHtml(hardest.title), hardest.rate);
      statHardest.hidden = false;
    } else {
      statHardest.textContent = t("statHardestEmpty");
      statHardest.hidden = false;
    }
  }

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
  const sbMode = state.mode === "unlimited" ? loadUnlimitedStats() : loadStats();
  const sbWinRate = sbMode.played > 0 ? Math.round((sbMode.won / sbMode.played) * 100) : 0;
  const sbPlayed = document.querySelector("#sb-played");
  const sbWon = document.querySelector("#sb-won");
  const sbRate = document.querySelector("#sb-rate");
  const sbStreak = document.querySelector("#sb-streak");
  const sbBest = document.querySelector("#sb-best");
  const sbAvg = document.querySelector("#sb-avg");
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
  if (sbAvg) {
    const sbPersonalAvg = computePersonalAvg(sbMode.distribution);
    sbAvg.textContent = sbPersonalAvg === null ? "—" : sbPersonalAvg.toFixed(1);
  }

  const totalEl = document.querySelector("#sb-total-songs");
  if (totalEl) totalEl.textContent = songs.length.toLocaleString();

  // update sidebar label
  const sbLabel = document.querySelector("#sb-mode-label");
  if (sbLabel) sbLabel.textContent = state.mode === "unlimited" ? t("unlimitedStats") : t("dailyStats");
}

// Weighted average of solve attempts 1–6. Returns null if no solves recorded.
function computePersonalAvg(distribution) {
  if (!distribution) return null;
  let total = 0;
  let weighted = 0;
  for (let i = 1; i <= 6; i++) {
    const c = Number(distribution[i]) || 0;
    total += c;
    weighted += i * c;
  }
  return total > 0 ? weighted / total : null;
}

// Countdown to the next local midnight, when a new daily puzzle becomes available.
// Only ticks while the daily round is complete (saves cycles when not visible).
let countdownTimer = null;
function updateNextDailyCountdown() {
  if (!nextDailyCountdownEl) return;
  // Show only when a daily round is finished. Hidden in unlimited mode entirely.
  const shouldShow = state.mode === "daily" && state.isComplete;
  if (!shouldShow) {
    nextDailyCountdownEl.hidden = true;
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    return;
  }
  renderCountdownTick();
  if (!countdownTimer) {
    countdownTimer = setInterval(renderCountdownTick, 1000);
  }
}

function renderCountdownTick() {
  if (!nextDailyCountdownEl) return;
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const ms = tomorrow - now;
  if (ms <= 0) {
    nextDailyCountdownEl.innerHTML = `<strong>${t("nextDailyReady")}</strong>`;
    nextDailyCountdownEl.hidden = false;
    return;
  }
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  nextDailyCountdownEl.innerHTML = t("nextDailyCountdown", h, m, s);
  nextDailyCountdownEl.hidden = false;
}

function getArchiveSongs() {
  const todayKey = getDateKey();
  return songs
    .filter((song) => song.date && song.audioClip && song.date <= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getArchiveSongMap() {
  return new Map(getArchiveSongs().map((song) => [song.date, song]));
}

function getMinArchiveMonth() {
  return new Date(2026, 4, 1);
}

function getMaxArchiveMonth() {
  const archiveSongs = getArchiveSongs();
  const latestDate = archiveSongs.at(-1)?.date || getDateKey();
  const latest = parseDateKey(latestDate);
  return new Date(latest.getFullYear(), latest.getMonth(), 1);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function clampArchiveMonth(date) {
  const min = getMinArchiveMonth();
  const max = getMaxArchiveMonth();
  if (date < min) return min;
  if (date > max) return max;
  return date;
}

function ensureArchiveMonth() {
  if (state.archiveMonth) return;
  state.archiveMonth = getMaxArchiveMonth();
}

function shiftArchiveMonth(offset) {
  ensureArchiveMonth();
  state.archiveMonth = clampArchiveMonth(new Date(
    state.archiveMonth.getFullYear(),
    state.archiveMonth.getMonth() + offset,
    1
  ));
  renderArchiveCalendar();
}

function getRandomArchiveSong() {
  const archiveSongList = getArchiveSongs();
  if (archiveSongList.length === 0) return null;

  const dailyResults = loadStats().results || {};
  const archiveResults = loadArchiveResults();
  const unopened = archiveSongList.filter((song) => !archiveResults[song.date] && !dailyResults[song.date]);
  const pool = unopened.length > 0 ? unopened : archiveSongList;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

function renderArchiveCalendar() {
  if (!archiveGrid || !archiveMonthLabel) return;
  ensureArchiveMonth();
  state.archiveMonth = clampArchiveMonth(state.archiveMonth);

  const lang = getLang();
  const archiveSongList = getArchiveSongs();
  const archiveSongs = new Map(archiveSongList.map((song) => [song.date, song]));
  const dailyResults = loadStats().results || {};
  const archiveResults = loadArchiveResults();
  const todayKey = getDateKey();
  const monthStart = state.archiveMonth;
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = new Intl.DateTimeFormat(lang === "jp" ? "ja-JP" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(monthStart);
  archiveMonthLabel.textContent = monthLabel;

  if (archivePrevMonth) archivePrevMonth.disabled = monthKey(monthStart) <= monthKey(getMinArchiveMonth());
  if (archiveNextMonth) archiveNextMonth.disabled = monthKey(monthStart) >= monthKey(getMaxArchiveMonth());
  if (archiveSummary) {
    const monthSongList = archiveSongList.filter((song) => {
      const songDate = parseDateKey(song.date);
      return songDate.getFullYear() === year && songDate.getMonth() === month;
    });
    const monthResultEntries = monthSongList
      .map((song) => archiveResults[song.date] || dailyResults[song.date] || null)
      .filter(Boolean);
    const monthSolvedCount = monthResultEntries.filter((result) => result.won).length;
    const monthSolveRate = monthSongList.length > 0
      ? Math.round((monthSolvedCount / monthSongList.length) * 100)
      : 0;
    archiveMonthLabel.innerHTML = `
      <span>${escapeHtml(monthLabel)}</span>
      <span class="archive-month-badge">${escapeHtml(t("archiveMonthBadge", monthSolvedCount, monthSongList.length, monthSolveRate))}</span>
    `;

    const resultEntries = monthSongList
      .map((song) => archiveResults[song.date] || dailyResults[song.date] || null)
      .filter(Boolean);
    const openedCount = resultEntries.length;
    const solvedCount = resultEntries.filter((result) => result.won).length;
    const revealedCount = openedCount - solvedCount;
    const completionRate = monthSongList.length > 0
      ? Math.round((openedCount / monthSongList.length) * 100)
      : 0;

    archiveSummary.innerHTML = [
      [t("archiveSummaryOpened"), openedCount],
      [t("archiveSummarySolved"), solvedCount],
      [t("archiveSummaryRevealed"), revealedCount],
      [t("archiveSummaryComplete"), `${completionRate}%`],
    ].map(([label, value]) => `
      <span class="archive-summary-item">
        <strong>${escapeHtml(String(value))}</strong>
        <span>${escapeHtml(label)}</span>
      </span>
    `).join("");
  }
  renderArchiveInsights(year, month, archiveSongList);

  const cells = [];
  for (let i = 0; i < firstDay.getDay(); i++) {
    cells.push(`<span class="archive-day is-empty" aria-hidden="true"></span>`);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const song = archiveSongs.get(key);
    const disabled = !song || key > todayKey;
    const selected = key === state.archiveDate;
    const result = archiveResults[key] || dailyResults[key] || null;
    const completed = Boolean(result);
    const title = !song ? t("archiveEmpty") : completed ? getDisplayTitle(song) : t("archiveUnplayed");
    const visibleTitle = !song ? title : truncateTitle(title, window.matchMedia("(max-width: 680px)").matches ? 28 : 14);
    const status = result ? (result.won ? t("archiveSolved") : t("archiveFailed")) : "";
    const cellClass = [
      "archive-day",
      selected ? "is-selected" : "",
      completed ? "is-complete" : "",
      result?.won ? "is-solved" : "",
      result && !result.won ? "is-failed" : "",
      !song ? "is-no-puzzle" : "",
      song && !completed ? "is-locked" : "",
    ].filter(Boolean).join(" ");

    cells.push(`
      <button
        class="${cellClass}"
        type="button"
        data-archive-date="${key}"
        ${disabled ? "disabled" : ""}
        title="${escapeHtml(title)}"
      >
        <span class="archive-day-number">${day}</span>
        <span class="archive-day-title">${escapeHtml(visibleTitle)}</span>
        ${status ? `<span class="archive-day-status">${escapeHtml(status)}</span>` : ""}
      </button>
    `);
  }

  archiveGrid.innerHTML = cells.join("");
}

const archiveGlobalStatsCache = new Map();

async function getSongGlobalStats(songId) {
  if (!songId) return null;
  const key = String(songId);
  if (archiveGlobalStatsCache.has(key)) return archiveGlobalStatsCache.get(key);

  try {
    const res = await fetch(`${WORKER_URL}/stats?songId=${encodeURIComponent(key)}`);
    if (!res.ok) {
      archiveGlobalStatsCache.set(key, null);
      return null;
    }
    const data = await res.json();
    const plays = data.plays || 0;
    if (plays < 1) {
      archiveGlobalStatsCache.set(key, null);
      return null;
    }
    const wins = data.wins || 0;
    const rate = Math.round((wins / plays) * 100);
    const buckets = data.attempts || {};
    let totalSolves = 0;
    let weightedSum = 0;
    for (const [attempt, count] of Object.entries(buckets)) {
      const n = parseInt(attempt, 10);
      const c = Number(count) || 0;
      if (Number.isFinite(n) && n >= 1 && n <= 6) {
        totalSolves += c;
        weightedSum += n * c;
      }
    }
    const avg = totalSolves > 0 ? weightedSum / totalSolves : null;
    const stats = { plays, wins, rate, avg };
    archiveGlobalStatsCache.set(key, stats);
    return stats;
  } catch {
    archiveGlobalStatsCache.set(key, null);
    return null;
  }
}

async function renderArchiveInsights(year, month, archiveSongList) {
  if (!archiveInsights) return;
  const requestedMonth = monthKey(new Date(year, month, 1));
  const dailyResults = loadStats().results || {};
  const archiveResults = loadArchiveResults();
  const monthSongs = archiveSongList.filter((song) => {
    const songDate = parseDateKey(song.date);
    return songDate.getFullYear() === year && songDate.getMonth() === month;
  }).filter((song) => archiveResults[song.date] || dailyResults[song.date]);

  if (monthSongs.length === 0) {
    archiveInsights.innerHTML = `<p>${escapeHtml(t("archiveInsightsEmpty"))}</p>`;
    return;
  }

  archiveInsights.innerHTML = `<p>${escapeHtml(t("archiveInsightsLoading"))}</p>`;
  const rows = (await Promise.all(monthSongs.map(async (song) => {
    const stats = await getSongGlobalStats(song.vocadbId);
    return stats ? { song, ...stats } : null;
  }))).filter(Boolean);

  if (requestedMonth !== monthKey(state.archiveMonth)) return;
  if (rows.length === 0) {
    archiveInsights.innerHTML = `<p>${escapeHtml(t("archiveInsightsEmpty"))}</p>`;
    return;
  }

  const hardest = [...rows].sort((a, b) =>
    a.rate - b.rate ||
    (b.avg ?? 0) - (a.avg ?? 0) ||
    b.plays - a.plays
  )[0];
  const easiest = [...rows].sort((a, b) =>
    b.rate - a.rate ||
    (a.avg ?? 7) - (b.avg ?? 7) ||
    b.plays - a.plays
  )[0];
  const renderRow = (label, entry) => `
    <span class="archive-insight-row">
      <strong>${escapeHtml(label)}:</strong>
      <span>${escapeHtml(truncateTitle(getDisplayTitle(entry.song), 32))}</span>
      <em>${entry.rate}%</em>
    </span>
  `;

  archiveInsights.innerHTML = [
    renderRow(t("archiveHardest"), hardest),
    renderRow(t("archiveEasiest"), easiest),
  ].join("");
}

function makeMailto(subject, body) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getPuzzleContextLines() {
  const puzzle = state.puzzle;
  return [
    `Mode: ${state.mode}`,
    `Date: ${state.archiveDate || getDateKey()}`,
    `Song: ${puzzle ? getDisplayTitle(puzzle) : "Unknown"}`,
    `Artist: ${puzzle ? getSuggestionArtist(puzzle) : "Unknown"}`,
    `VocaDB ID: ${puzzle?.vocadbId || "Unknown"}`,
    `VocaDB URL: ${puzzle?.vocadbUrl || "Unknown"}`,
    `Audio URL: ${puzzle?.audioClip || "Unknown"}`,
  ];
}

function updateReportContext() {
  if (!reportContext) return;
  if (!state.puzzle) {
    reportContext.textContent = t("modalReportIntro");
    return;
  }
  reportContext.textContent = `Reporting: ${getDisplayTitle(state.puzzle)} - ${getSuggestionArtist(state.puzzle)}`;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) {
    return;
  }

  closeModal();
  activeModal = modal;
  if (modalId === "report-issue") updateReportContext();
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
  if (!query) return [];

  // For single CJK characters, only match if it's an exact title/acceptedTitle match
  // to prevent "ガ" from flooding results with everything containing that kana.
  const isSingleCJK = query.length === 1 && /[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/.test(query);

  const scored = [];

  songs.forEach((song) => {
    const titles = [song.title, song.vocadbName, ...(song.acceptedTitles || [])].filter(Boolean).map(normalizeGuess);
    const artistFields = [
      song.artist,
      song.artistString,
      song.displayArtist,
      song.suggestionArtistString,
      ...(song.producerNames || []),
      ...(song.singerNames || []),
      ...(song.artistSearchNames || []),
    ].filter(Boolean).map(normalizeGuess);

    if (isSingleCJK) {
      // Only surface if query is an exact match against a title or accepted title
      if (titles.some((t) => t === query)) {
        scored.push({ song, score: 100 });
      }
      return;
    }

    let score = 0;

    // ── Title scoring ──
    if (titles.some((t) => t === query)) {
      score = Math.max(score, 100);                          // exact title
    } else if (titles.some((t) => t.startsWith(query + " ") || t.startsWith(query + "-") || t.startsWith(query + ":"))) {
      score = Math.max(score, 80);                           // title starts with query as full word
    } else if (titles.some((t) => t.startsWith(query))) {
      score = Math.max(score, 70);                           // title prefix (e.g. "moth" → "Moth...")
    } else if (titles.some((t) => wordBoundaryMatch(t, query))) {
      score = Math.max(score, 50);                           // word inside title
    } else if (titles.some((t) => t.includes(query))) {
      score = Math.max(score, 30);                           // substring in title
    }

    // ── Artist scoring (lower ceiling so title matches always win) ──
    if (score === 0) {
      if (artistFields.some((a) => a === query)) {
        score = Math.max(score, 60);                         // exact artist name
      } else if (artistFields.some((a) => a.startsWith(query))) {
        score = Math.max(score, 45);                         // artist prefix
      } else if (artistFields.some((a) => wordBoundaryMatch(a, query))) {
        score = Math.max(score, 35);                         // word in artist
      } else if (artistFields.some((a) => a.includes(query))) {
        score = Math.max(score, 20);                         // substring in artist
      }
    } else {
      // Even when we already have a title match, boost if artist also matches
      // so "utsu-p moth" surfaces more precisely
      if (artistFields.some((a) => a.includes(query))) {
        score += 5;
      }
    }

    if (score > 0) scored.push({ song, score });
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12).map((s) => s.song);
}

// Returns true if `query` appears at a word boundary inside `text`
function wordBoundaryMatch(text, query) {
  if (!text.includes(query)) return false;
  const idx = text.indexOf(query);
  const before = idx === 0 || /[\s\-:(,]/.test(text[idx - 1]);
  const after = idx + query.length >= text.length || /[\s\-:),]/.test(text[idx + query.length]);
  return before && after;
}

function getDailyPuzzle() {
  return songs.find((song) => song.date === getDateKey()) || null;
}

function getArchivePuzzle() {
  if (!state.archiveDate) {
    return null;
  }

  return songs.find((song) => song.date === state.archiveDate) || null;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatArchiveDate(dateKey) {
  const date = parseDateKey(dateKey);
  const lang = getLang();
  return new Intl.DateTimeFormat(lang === "jp" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isArchiveDatePlayable(dateKey) {
  if (!dateKey || dateKey > getDateKey()) return false;
  return songs.some((song) => song.date === dateKey && song.audioClip);
}

function getArchiveDateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const queryDate = params.get("archive");
  const hashMatch = window.location.hash.match(/^#archive(?:=|\/)(\d{4}-\d{2}-\d{2})$/);
  const dateKey = queryDate || hashMatch?.[1] || "";
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : "";
}

function setArchiveUrl(dateKey, replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.set("archive", dateKey);
  url.hash = "";
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
}

function clearArchiveUrl(replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.delete("archive");
  url.hash = "";
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
}

function loadArchiveDate(dateKey, replaceUrl = false) {
  if (!isArchiveDatePlayable(dateKey)) return false;
  state.mode = "archive";
  state.archiveDate = dateKey;
  state.archiveMonth = new Date(parseDateKey(dateKey).getFullYear(), parseDateKey(dateKey).getMonth(), 1);
  setArchiveUrl(dateKey, replaceUrl);
  document.title = `VOCALOID Heardle - ${formatArchiveDate(dateKey)}`;
  loadPuzzle();
  renderStats();
  renderArchiveCalendar();
  return true;
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

function getPuzzleForCurrentMode() {
  if (state.mode === "archive") return getArchivePuzzle();
  if (state.mode === "unlimited") return getUnlimitedPuzzle();
  return getDailyPuzzle();
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
  if (sourceTags) {
    sourceTags.hidden = true;
    sourceTags.innerHTML = "";
  }
  if (sourceLink) {
    sourceLink.href = "https://vocadb.net";
    sourceLink.textContent = "VocaDB";
  }
  if (globalStatsEl) {
    globalStatsEl.hidden = true;
    globalStatsEl.innerHTML = "";
  }
  lastGlobalStats = null;
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
  state.puzzle = getPuzzleForCurrentMode();

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
  const savedDailyResults = loadStats().results || {};
  const savedArchiveResults = loadArchiveResults();
  const completedResult = state.mode === "daily"
    ? savedDailyResults[getDateKey()]
    : state.mode === "archive" && state.archiveDate
      ? savedArchiveResults[state.archiveDate] || savedDailyResults[state.archiveDate]
      : null;

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
  const isUnlimited = state.mode === "unlimited";
  const isArchive = state.mode === "archive";
  const todayKey = getDateKey();
  const resultKey = isArchive ? state.archiveDate : todayKey;

  const result = {
    won,
    attempts: won ? state.attempt : null,
    title: state.puzzle.title,
    guesses: state.guesses,
  };

  if (!isDaily && !isUnlimited) {
    if (isArchive && resultKey) {
      saveArchiveResult(resultKey, result);
      renderArchiveCalendar();
    }
    renderStats();
    return result;
  }

  const stats = isDaily ? loadStats() : loadUnlimitedStats();
  if (isDaily && stats.results[resultKey]) {
    renderStats();
    return stats.results[resultKey];
  }

  stats.played += 1;

  if (isDaily) {
    stats.results[resultKey] = result;
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
  coverCaption.textContent = `${truncateTitle(getDisplayTitle(state.puzzle), 60)} - ${getSuggestionArtist(state.puzzle)}`;
  if (sourceLink) {
    sourceLink.href = state.puzzle.vocadbUrl || "https://vocadb.net";
    sourceLink.textContent = "VocaDB";
  }
  renderSourceTags();

  loadGlobalStats(state.puzzle.vocadbId, {
    mode: state.mode,
    puzzle: state.puzzle,
    result: state.lastResult,
  });

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

function hasSourceTag(song, tag) {
  return Array.isArray(song?.sourceTags) && song.sourceTags.includes(tag);
}

function renderSourceTags() {
  if (!sourceTags) return;
  const labels = [
    hasSourceTag(state.puzzle, "community") ? t("tagCommunitySuggested") : "",
    hasSourceTag(state.puzzle, "special-test") ? t("tagSpecialTest") : "",
  ].filter(Boolean);

  if (!state.isComplete || labels.length === 0) {
    sourceTags.hidden = true;
    sourceTags.innerHTML = "";
    return;
  }

  sourceTags.innerHTML = labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  sourceTags.hidden = false;
}

// Cached after a successful loadGlobalStats so we can re-render on language switch
// without making another KV read.
let lastGlobalStats = null;

// Bucket the global solve rate into a difficulty tier.
// Returns one of: "free" | "easy" | "medium" | "hard" | "unknown"
// Also exposes the threshold logic in one place so labels and color stay in sync.
function getDifficultyKey(rate) {
  if (rate >= 90) return "free";
  if (rate >= 70) return "easy";
  if (rate >= 40) return "medium";
  if (rate >= 15) return "hard";
  return "unknown";
}

// Fetch and render the global solve stats for the answered song.
// Hidden if the song has no plays or the request fails — failure is silent
// because this is a cosmetic addition, not core gameplay.
async function loadGlobalStats(songId, context = {}) {
  if (!globalStatsEl || !songId) return;
  globalStatsEl.hidden = true;
  globalStatsEl.innerHTML = "";
  lastGlobalStats = null;
  try {
    const res = await fetch(`${WORKER_URL}/stats?songId=${encodeURIComponent(songId)}`);
    if (!res.ok) return;
    const data = await res.json();
    const plays = data.plays || 0;
    if (plays < 1) return;
    const wins = data.wins || 0;
    const rate = Math.round((wins / plays) * 100);

    // Compute avg attempts from the per-attempt buckets recorded in /record.
    // The buckets only count successful solves, so this is "avg attempts among solvers".
    const buckets = data.attempts || {};
    let totalSolves = 0;
    let weightedSum = 0;
    for (const [k, v] of Object.entries(buckets)) {
      const n = parseInt(k, 10);
      const c = Number(v) || 0;
      if (Number.isFinite(n) && n >= 1 && n <= 6) {
        totalSolves += c;
        weightedSum += n * c;
      }
    }
    const avg = totalSolves > 0 ? (weightedSum / totalSolves) : null;

    lastGlobalStats = { rate, plays, avg };
    renderGlobalStats();
    maybeUpdateHardestSolved(rate, context);
  } catch {
    // silent — stats backend hiccup shouldn't break the answer reveal
  }
}

// If the player just solved this song AND its global solve rate is lower than
// their previous "hardest solved" record (or they have none), update the record.
// Stored in the same stats blob as everything else, per mode.
function maybeUpdateHardestSolved(globalRate, context = {}) {
  const mode = context.mode || state.mode;
  const puzzle = context.puzzle || state.puzzle;
  const result = context.result || state.lastResult;
  if (mode !== "daily" && mode !== "unlimited") return;
  if (!puzzle || !result || !result.won) return;
  const isDaily = mode === "daily";
  const stats = isDaily ? loadStats() : loadUnlimitedStats();
  const prev = stats.hardestSolved;
  if (prev && typeof prev.rate === "number" && prev.rate <= globalRate) return;

  stats.hardestSolved = {
    vocadbId: puzzle.vocadbId,
    title: getDisplayTitle(puzzle),
    rate: globalRate,
    solvedAt: Date.now(),
  };
  if (isDaily) saveStats(stats); else saveUnlimitedStats(stats);
  // Refresh modal in case it's open right now.
  if (typeof renderStats === "function") renderStats();
}

function renderGlobalStats() {
  if (!globalStatsEl || !lastGlobalStats) return;
  const { rate, plays, avg } = lastGlobalStats;
  const statsLine = avg === null
    ? t("globalStatsNoWins", rate, plays)
    : t("globalStats", rate, avg.toFixed(1), plays);

  const diffKey = getDifficultyKey(rate);
  const diffLabel = t("difficulty" + diffKey.charAt(0).toUpperCase() + diffKey.slice(1));
  const diffLine = `<span class="gs-difficulty gs-diff-${diffKey}">${t("difficultyLabel", diffLabel)}</span>`;

  globalStatsEl.innerHTML = `${statsLine}<br>${diffLine}`;
  globalStatsEl.hidden = false;
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
  state.lastResult = recordResult(won) || {
    won,
    attempts: won ? state.attempt : null,
    title: state.puzzle.title,
  };
  revealAnswer();
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
  puzzleDate.textContent = state.mode === "daily"
    ? formatToday()
    : state.mode === "archive" && state.archiveDate
      ? formatArchiveDate(state.archiveDate)
      : t("unlimited");
  attemptCount.textContent = t("attempt", state.attempt, clipStages.length);
  clipLength.textContent = `${clipStages[state.clipStage]}s`;
  modeEyebrow.textContent = state.mode === "daily"
    ? t("dailyPuzzle")
    : state.mode === "archive"
      ? t("archivePuzzle")
      : t("unlimitedPuzzle");
  if (sourceLink) {
    sourceLink.href = state.isComplete && state.puzzle?.vocadbUrl ? state.puzzle.vocadbUrl : "https://vocadb.net";
    sourceLink.textContent = "VocaDB";
  }
  nextButton.hidden = !state.isComplete;
  shareButton.hidden = !state.isComplete;
  shareOutput.value = state.isComplete ? buildShareText() : "";
  if (resultTools) resultTools.hidden = !state.isComplete;
  if (kofiNudgeEl) kofiNudgeEl.hidden = !state.isComplete;
  if (reportIssueNudge) reportIssueNudge.hidden = !state.isComplete;
  dailyModeButton.classList.toggle("is-active", state.mode === "daily");
  unlimitedModeButton.classList.toggle("is-active", state.mode === "unlimited");
  if (archiveModeButton) archiveModeButton.classList.toggle("is-active", state.mode === "archive");
  updateProgress(0);
  updateGiveUpVisibility();
  updateAttemptDots();
  renderGuesses();
  updateNextDailyCountdown();
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

// Tracks whether the current input value was explicitly chosen from the suggestion list
let suggestionWasSelected = false;

function renderSuggestions() {
  const query = guessInput.value;
  const matches = getMatchingSongs(query);
  const normalizedQuery = normalizeGuess(query);

  // Remember what title is currently highlighted so we can restore it after re-render
  const previousActiveTitle = activeSuggestionIndex >= 0
    ? suggestionList.querySelectorAll("li")[activeSuggestionIndex]?.dataset.title
    : null;

  activeSuggestionIndex = -1;

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

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

  // Restore highlighted selection by title rather than by index so fast typing
  // doesn't silently shift what's highlighted when results reorder
  if (previousActiveTitle) {
    const items = Array.from(suggestionList.querySelectorAll("li"));
    const restored = items.findIndex((li) => li.dataset.title === previousActiveTitle);
    if (restored >= 0) {
      activeSuggestionIndex = restored;
      items[restored].classList.add("is-active");
    }
  }
}

// Debounced wrapper — fires renderSuggestions after 80 ms of quiet typing.
// Short enough not to feel laggy; long enough to skip intermediate keystrokes.
let _suggestionDebounceTimer = null;
function renderSuggestionsDebounced() {
  suggestionWasSelected = false;
  clearTimeout(_suggestionDebounceTimer);
  _suggestionDebounceTimer = setTimeout(renderSuggestions, 80);
}

function hideSuggestions() {
  suggestionList.hidden = true;
  suggestionList.innerHTML = "";
  guessInput.setAttribute("aria-expanded", "false");
}

function selectSuggestion(title) {
  guessInput.value = title;
  suggestionWasSelected = true;
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

  const modeLabel = state.mode === "daily" ? "Daily" : state.mode === "archive" ? "Archive" : "Unlimited";
  const score = state.lastResult.won ? `${state.lastResult.attempts}/${clipStages.length}` : `X/${clipStages.length}`;
  const context = state.mode === "daily"
    ? formatToday()
    : state.mode === "archive" && state.archiveDate
      ? formatArchiveDate(state.archiveDate)
      : getDisplayTitle(state.puzzle);

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

  // Stats line — only included if we have global data cached from loadGlobalStats.
  // Race-safe: if the player copies before the fetch resolves (or fetch failed),
  // we just omit the line rather than showing placeholder text.
  const lines = [
    `VOCALOID Heardle ${modeLabel}`,
    `${score} · ${context}`,
  ];
  if (lastGlobalStats) {
    const { rate, avg } = lastGlobalStats;
    const avgPart = avg !== null ? ` · ${avg.toFixed(1)}/6 avg` : "";
    lines.push(`${rate}% solve${avgPart}`);
  }
  lines.push("");
  lines.push(`🔊 ${squares}`);

  return lines.join("\n");
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
    const isAvgSort = sort === "avg-low" || sort === "avg-high";
    let data;
    if (isAvgSort) {
      const responses = await Promise.all([
        fetch(`${WORKER_URL}/leaderboard?sort=plays&limit=1000`),
        fetch(`${WORKER_URL}/leaderboard?sort=hardest&limit=1000`),
        fetch(`${WORKER_URL}/leaderboard?sort=easiest&limit=1000`),
      ]);
      const payloads = await Promise.all(responses.map((res) => res.json()));
      const merged = new Map();
      payloads.flat().forEach((entry) => {
        if (entry?.songId) merged.set(String(entry.songId), entry);
      });
      data = Array.from(merged.values());
    } else {
      const res = await fetch(`${WORKER_URL}/leaderboard?sort=${sort}&limit=50`);
      data = await res.json();
    }
    if (isAvgSort) {
      data = data
        .sort((a, b) => {
          const avgA = getAvgSortValue(a, sort);
          const avgB = getAvgSortValue(b, sort);
          const diff = avgA - avgB;
          if (diff !== 0) return sort === "avg-low" ? diff : -diff;
          const winDiff = (a.winRate || 0) - (b.winRate || 0);
          if (winDiff !== 0) return sort === "avg-low" ? winDiff : -winDiff;
          return (b.plays || 0) - (a.plays || 0);
        })
        .slice(0, 50);
    }
    rankingsCache[sort] = data;
    return data;
  } catch {
    return null;
  }
}

function getAvgSortValue(entry, sort) {
  const avg = Number(entry?.avgAttempts);
  if (Number.isFinite(avg)) return avg;
  return sort === "avg-low" ? 0 : -1;
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
    const title = song ? truncateTitle(getDisplayTitle(song), 28) : `Song #${entry.songId}`;
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
    const title = song ? truncateTitle(getDisplayTitle(song), 40) : `Song #${entry.songId}`;
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

  // ── Duplicate guess protection ──
  const normalizedGuess = normalizeGuess(guess);
  const alreadyGuessed = state.guesses.some(
    (g) => g.result === "Wrong" && normalizeGuess(g.label) === normalizedGuess,
  );
  if (alreadyGuessed) {
    showLossToast(t("toastAlreadyGuessed"));
    return;
  }

  // ── Producer-only guard ──
  // If what was typed doesn't match any song title (only artist fields), and the
  // user didn't explicitly pick from the suggestion list, block the submission.
  // This prevents a bare producer name like "maretu" from burning an attempt.
  const matchesTitleDirectly = songs.some((song) => {
    const titles = [song.title, song.vocadbName, ...(song.acceptedTitles || [])].filter(Boolean);
    return titles.some((t) => normalizeGuess(t) === normalizedGuess);
  });

  if (!matchesTitleDirectly && !suggestionWasSelected) {
    // Show the suggestions (in case debounce hasn't fired yet) and warn
    clearTimeout(_suggestionDebounceTimer);
    renderSuggestions();
    showLossToast(t("toastSelectSong"));
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
  suggestionWasSelected = false;
  render();
});

guessInput.addEventListener("input", renderSuggestionsDebounced);

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
    localStorage.removeItem(archiveResultsKey);
    renderStats();
    renderArchiveCalendar();
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
  state.archiveDate = null;
  clearArchiveUrl();
  document.title = "VOCALOID Heardle — Daily";
  loadPuzzle();
  renderStats();
});

if (archiveModeButton) {
  archiveModeButton.addEventListener("click", () => {
    renderArchiveCalendar();
  });
}

unlimitedModeButton.addEventListener("click", () => {
  state.mode = "unlimited";
  state.statsMode = "unlimited";
  state.archiveDate = null;
  state.unlimitedQueue = [];
  clearArchiveUrl();
  document.title = "VOCALOID Heardle — Unlimited";
  loadPuzzle();
  renderStats();
});

nextButton.addEventListener("click", () => {
  state.mode = "unlimited";
  state.archiveDate = null;
  clearArchiveUrl();
  loadPuzzle();
});

if (archivePrevMonth) {
  archivePrevMonth.addEventListener("click", () => shiftArchiveMonth(-1));
}

if (archiveNextMonth) {
  archiveNextMonth.addEventListener("click", () => shiftArchiveMonth(1));
}

if (archiveRandomButton) {
  archiveRandomButton.addEventListener("click", () => {
    const song = getRandomArchiveSong();
    if (!song) {
      showToast(t("archiveRandomEmpty"));
      return;
    }
    loadArchiveDate(song.date);
    document.title = `VOCALOID Heardle — ${formatArchiveDate(state.archiveDate)}`;
    closeModal();
  });
}

if (archiveGrid) {
  archiveGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-archive-date]");
    if (!button || button.disabled) return;
    loadArchiveDate(button.dataset.archiveDate);
    document.title = `VOCALOID Heardle — ${formatArchiveDate(state.archiveDate)}`;
    closeModal();
  });
}

window.addEventListener("popstate", () => {
  const archiveDate = getArchiveDateFromUrl();
  if (archiveDate && loadArchiveDate(archiveDate, true)) return;
  state.mode = "daily";
  state.archiveDate = null;
  loadPuzzle();
  renderStats();
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

if (suggestSongForm) {
  suggestSongForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = [
      "Song suggestion for VOCALOID Heardle",
      "",
      `Song title: ${document.querySelector("#suggest-title")?.value || ""}`,
      `Producer: ${document.querySelector("#suggest-producer")?.value || ""}`,
      `Vocal synth: ${document.querySelector("#suggest-vocal")?.value || ""}`,
      `VocaDB link: ${document.querySelector("#suggest-vocadb")?.value || ""}`,
      `YouTube/NicoNico link: ${document.querySelector("#suggest-source")?.value || ""}`,
      "",
      "Why should this be included?",
      document.querySelector("#suggest-reason")?.value || "",
      "",
      "Note: suggestions are not guaranteed.",
    ].join("\n");
    window.location.href = makeMailto("VOCALOID Heardle song suggestion", body);
  });
}

if (reportIssueForm) {
  reportIssueForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const reason = document.querySelector("#report-reason")?.value || "Issue report";
    const details = document.querySelector("#report-details")?.value || "";
    const body = [
      "VOCALOID Heardle issue report",
      "",
      `Reason: ${reason}`,
      "",
      "Puzzle context:",
      ...getPuzzleContextLines(),
      "",
      "Details:",
      details,
    ].join("\n");
    window.location.href = makeMailto(`VOCALOID Heardle issue: ${reason}`, body);
  });
}

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

const initialArchiveDate = getArchiveDateFromUrl();
if (!initialArchiveDate || !loadArchiveDate(initialArchiveDate, true)) {
  if (initialArchiveDate) clearArchiveUrl(true);
  loadPuzzle();
}
renderStats();
checkNewBadge();
applyLanguage();
initTitleMode();
