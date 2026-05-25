const packs = [
  { name: "Aioi Collection", image: "pack_image/Aioi Collection.png" },
  { name: "Cytus Selection vol.1", image: "pack_image/Cytus Selection vol.1.webp" },
  { name: "Cytus Selection vol.2", image: "pack_image/Cytus Selection vol.2.png" },
  { name: "EGOIST Special Selection", image: "pack_image/EGOIST Special Selection.webp" },
  { name: "Knight Iris Collection", image: "pack_image/Knight Iris Collection.webp" },
  { name: "MILI collection", image: "pack_image/MILI collection.webp" },
  { name: "N.M.S.T. Collection", image: "pack_image/N.M.S.T. Collection.png" },
  { name: "Rayark Selection vol.3", image: "pack_image/Rayark Selection vol.3.png" }
];

const songs = [
  { pack: "Cytus Selection vol.1", title: "DRG", artist: "Ani", difficulties: { Easy: 4, Normal: 7, Hard: 9 } },
  { pack: "Cytus Selection vol.1", title: "Libera me", artist: "Cranky", difficulties: { Easy: 3, Normal: 8, Hard: 10 } },
  { pack: "Cytus Selection vol.1", title: "Precipitation", artist: "Ice", difficulties: { Easy: 5, Normal: 7, Hard: 10 } },
  { pack: "Cytus Selection vol.1", title: "Sacred", artist: "Rabpit", difficulties: { Easy: 3, Normal: 5, Hard: 9 } },
  { pack: "Cytus Selection vol.1", title: "The Black Case", artist: "KillerBlood", difficulties: { Easy: 3, Normal: 5, Hard: 7 } },

  { pack: "MILI collection", title: "Fable", artist: "Mili", difficulties: { Easy: 5, Normal: 7, Hard: 9 } },
  { pack: "MILI collection", title: "Past the Stargazing Season", artist: "H△G / Remixed by Mili", difficulties: { Easy: 3, Normal: 6, Hard: 8 } },
  { pack: "MILI collection", title: "Ephemeral", artist: "Mili", difficulties: { Easy: 3, Normal: 5, Hard: 8 } },
  { pack: "MILI collection", title: "Rosetta", artist: "Mili", difficulties: { Easy: 4, Normal: 7, Hard: 9 } },
  { pack: "MILI collection", title: "Witch's Invitation", artist: "Mili", difficulties: { Easy: 3, Normal: 7, Hard: 9 } },

  { pack: "Cytus Selection vol.2", title: "Future World", artist: "Killerblood", difficulties: { Easy: 4, Normal: 6, Hard: 8 } },
  { pack: "Cytus Selection vol.2", title: "Holy Knight", artist: "Eyemedia", difficulties: { Easy: 3, Normal: 7, Hard: 10 } },
  { pack: "Cytus Selection vol.2", title: "Niflheimr", artist: "xi", difficulties: { Easy: 2, Normal: 7, Hard: 10 } },
  { pack: "Cytus Selection vol.2", title: "Parousia", artist: "xi", difficulties: { Easy: 4, Normal: 8, Hard: 10 } },
  { pack: "Cytus Selection vol.2", title: "Recollections", artist: "Yamajet", difficulties: { Easy: 3, Normal: 7, Hard: 9 } },

  { pack: "N.M.S.T. Collection", title: "Farewell", artist: "3R2", difficulties: { Easy: 1, Normal: 4, Hard: 6 } },
  { pack: "N.M.S.T. Collection", title: "Winter", artist: "3R2", difficulties: { Easy: 3, Normal: 5, Hard: 7 } },
  { pack: "N.M.S.T. Collection", title: "Fluffie Partie", artist: "N.M.S.T.", difficulties: { Easy: 3, Normal: 6, Hard: 8 } },
  { pack: "N.M.S.T. Collection", title: "Snowflakes", artist: "N.M.S.T.", difficulties: { Easy: 3, Normal: 7, Hard: 9 } },
  { pack: "N.M.S.T. Collection", title: "kouyou", artist: "Ice", difficulties: { Easy: 6, Normal: 9, Hard: 10 } },

  { pack: "Aioi Collection", title: "CREAM STEW (Deemo Ver.)", artist: "aioi feat. KAMATA JUNKO", difficulties: { Easy: 3, Normal: 6, Hard: 9 } },
  { pack: "Aioi Collection", title: "I can not say (Deemo Ver.)", artist: "aioi feat. KAMATA JUNKO", difficulties: { Easy: 3, Normal: 5, Hard: 6 } },
  { pack: "Aioi Collection", title: "Image (Deemo Ver.)", artist: "aioi feat. KAMATA JUNKO", difficulties: { Easy: 2, Normal: 5, Hard: 7 } },
  { pack: "Aioi Collection", title: "kireigoto (Deemo Ver.)", artist: "aioi feat. KAMATA JUNKO", difficulties: { Easy: 2, Normal: 5, Hard: 7 } },
  { pack: "Aioi Collection", title: "NEW WORLD (Deemo Ver.)", artist: "aioi feat. KAMATA JUNKO", difficulties: { Easy: 4, Normal: 6, Hard: 8 } },

  { pack: "Rayark Selection vol.3", title: "Little Corgi's Dream", artist: "KillerBlood", difficulties: { Easy: 2, Normal: 5, Hard: 7 } },
  { pack: "Rayark Selection vol.3", title: "Morning Drops", artist: "KIVA", difficulties: { Easy: 3, Normal: 5, Hard: 8 } },
  { pack: "Rayark Selection vol.3", title: "The Letter", artist: "KIVA", difficulties: { Easy: 4, Normal: 6, Hard: 7 } },
  { pack: "Rayark Selection vol.3", title: "Waltz in Devil's Playground", artist: "Ramenbot Jr.", difficulties: { Easy: 3, Normal: 6, Hard: 9 } },
  { pack: "Rayark Selection vol.3", title: "Veritas", artist: "Presti", difficulties: { Easy: 3, Normal: 7, Hard: 10 } },

  { pack: "Knight Iris Collection", title: "The Way We Were", artist: "NICODE", difficulties: { Easy: 4, Normal: 6, Hard: 8 } },
  { pack: "Knight Iris Collection", title: "The Sanctuary", artist: "Eye AC", difficulties: { Easy: 3, Normal: 5, Hard: 7 } },
  { pack: "Knight Iris Collection", title: "The Red Coronation", artist: "Eye RH", difficulties: { Easy: 2, Normal: 6, Hard: 9 } },
  { pack: "Knight Iris Collection", title: "Forbidden Codex", artist: "Hoskey", difficulties: { Easy: 3, Normal: 6, Hard: 10 } },
  { pack: "Knight Iris Collection", title: "Knight Of Firmament", artist: "Eye XY", difficulties: { Easy: 2, Normal: 7, Hard: 8 } },

  { pack: "EGOIST Special Selection", title: "All Alone With You", artist: "EGOIST", difficulties: { Easy: 3, Normal: 5, Hard: 8 } },
  { pack: "EGOIST Special Selection", title: "Planetes", artist: "EGOIST", difficulties: { Easy: 1, Normal: 3, Hard: 7 } },
  { pack: "EGOIST Special Selection", title: "キミソラキセキ", artist: "EGOIST", difficulties: { Easy: 2, Normal: 4, Hard: 7 } },
  { pack: "EGOIST Special Selection", title: "Ghost of a smile", artist: "EGOIST", difficulties: { Easy: 1, Normal: 3, Hard: 6 } },
  { pack: "EGOIST Special Selection", title: "Departures ～あなたにおくるアイの歌～", artist: "EGOIST", difficulties: { Easy: 2, Normal: 5, Hard: 7 } }
];
