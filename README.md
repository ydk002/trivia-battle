# 🎮 Trivia Battle – Interaktív Kvízjáték

Egy modern, reszponzív és látványos webes kvízjáték, amely valós idejű kérdéseket kér le az [Open Trivia Database (OpenTDB)](https://opentdb.com/) nyilvános API-jából.

Készült a **Trivia Battle** mini projektfeladat specifikációja alapján, React 19 és Vite technológiákkal.

---

## ✨ Főbb Funkciók és Képességek

### 1️⃣ Open Trivia Database API Integráció
- Kérdések dinamikus lekérése kategóriák és nehézségi szintek szerint.
- Automatikus **HTML entity dekódolás** (pl. `&quot;`, `&#039;`, `&amp;`), tiszta szöveges megjelenítés.
- Válaszlehetőségek intelligens megkeverése (Fisher–Yates shuffle).
- **Intelligens Fallback rendszer**: Hálózati hiba vagy OpenTDB rate-limit (429) esetén az alkalmazás automatikusan átvált egy beépített kérdésgyűjteményre, így a játék offline és korlátozások nélkül is működőképes marad.

### 2️⃣ Játékmenet és Értékelés
- Kérdésenkénti interaktív válaszadás.
- **Színkódolt azonnali visszajelzés**: 
  - Helyes válasz: 🟩 **Zöld** kiemelés és fényhatás.
  - Helytelen válasz: 🟥 **Piros** kiemelés a választott opción, miközben a helyes megoldás zölden felvillan.
- Összesített eredménykijelző a játék végén (pl. `4 / 5`, százalékos mutató és szöveges értékelés).
- **Konfetti animáció** (`canvas-confetti`) és győzelmi dallam 60% feletti teljesítménynél.
- „Új játék” gomb a játék újbóli indításához.

### 3️⃣ Időzítő & Animációk
- **Dinamikus visszaszámláló** kérdésenként (10 mp, 15 mp vagy 20 mp beállítástól függően).
- Vizuális figyelmeztetés: az utolsó 3 másodpercben pulzáló piros jelzés.
- Időtúllépés kezelése: automatikus zárolás és a helyes válasz felfedése.
- **Folyamatjelző sáv (Progress bar)** sima animált átmenetekkel.

### 4️⃣ Top 5 Ponttáblázat (Leaderboard)
- A játék végén a játékos megadhatja a nevét és elmentheti az eredményét.
- Helyi tárolás **`localStorage`** segítségével (megmarad oldalújratöltés után is).
- Rendezett **Top 5** toplista modal ablakban: érmekkel (🥇, 🥈, 🥉), névvel, nehézségi címkével és dátummal.
- Egykattintásos lista-törlési lehetőség.

### 5️⃣ Beépített Audio Szintetizátor (Web Audio API)
- Külső hangfájlok és MP3 függőségek nélkül közvetlenül a böngészőben szintetizált hangok:
  - Helyes válasz dallam
  - Hibás válasz / buzzer hang
  - Időlejárat jelzés
  - Győzelmi fanfár
- Egykattintásos **némítás/hang bekapcsolás** a fejlécben.

---

## 🛠️ Alkalmazott Technológiai Stack

- **Frontend keretrendszer:** [React 19](https://react.dev/)
- **Build eszköz:** [Vite 8](https://vitejs.dev/)
- **Ikonkészlet:** [Lucide React](https://lucide.dev/)
- **Animációk:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) & CSS Keyframe Transitions
- **Stílusok:** Modern Glassmorphism Cyber-Arcade Dark UI (egyedi, reszponzív CSS)
- **API forrás:** [Open Trivia DB API](https://opentdb.com/)
- **Adattárolás:** Browser LocalStorage

---

## 🚀 Telepítés és Futtatás Helyi Környezetben

### Előfeltételek:
- [Node.js](https://nodejs.org/) (v18 vagy újabb ajánlott)
- npm vagy yarn / pnpm

### Lépések:

1. **Klónozd vagy töltsd le a tárolót:**
   ```bash
   git clone <repo-url>
   cd trivia-battle
   ```

2. **Függőségek telepítése:**
   ```bash
   npm install
   ```

3. **Fejlesztői szerver indítása:**
   ```bash
   npm run dev
   ```
   Az alkalmazás elérhető lesz a böngészőben a kiírt címen (alapértelmezetten: `http://localhost:5173`).

4. **Production build készítése:**
   ```bash
   npm run build
   ```
   A statikus fájlok a `dist/` könyvtárba kerülnek, amelyek bármilyen statikus tárhelyen (pl. GitHub Pages, Vercel, Netlify) futtathatók.

---

## 📂 Fájl- és Mappastruktúra

```
trivia-battle/
├── index.html                   # HTML belépési pont
├── package.json                 # Függőségek és scriptek
├── vite.config.js               # Vite konfiguráció
├── src/
│   ├── main.jsx                 # React root renderelés
│   ├── App.jsx                  # Fő vezérlő komponens és játék állapotgép
│   ├── index.css                # Téma stílusok, animációk, változók
│   ├── components/
│   │   ├── Navbar.jsx           # Fejléc, hangkapcsoló, toplista gomb
│   │   ├── StartScreen.jsx      # Kategória, nehézség és játékbeállítások
│   │   ├── QuizScreen.jsx       # Kérdéskártya, időzítő, színkódos gombok
│   │   ├── ResultScreen.jsx     # Összesítés, névmegadás és mentés
│   │   └── LeaderboardModal.jsx # Top 5 ranglista felugró ablak
│   ├── services/
│   │   └── triviaApi.js         # OpenTDB API hívás, HTML decode, fallback
│   └── utils/
│       ├── audio.js             # Web Audio API hangszintetizátor
│       └── leaderboard.js       # LocalStorage ranglista logika
└── README.md                    # Projekt dokumentáció
```

---

## 📤 Projekt mentése GitHubra

A helyi git tároló már elő van készítve. A GitHubra való feltöltéshez kövesd az alábbi lépéseket:

1. Hozz létre egy új repository-t a GitHubon: [github.com/new](https://github.com/new) (pl. `trivia-battle` néven).
2. Kapcsold össze a helyi tárolóval és töltsd fel a kódot a terminálban:
   ```bash
   git remote add origin https://github.com/<felhasznaloneved>/trivia-battle.git
   git branch -M main
   git push -u origin main
   ```

---

## 📝 Licenc
Ez a projekt nyílt forráskódú, MIT licenc alatt érhető el.
