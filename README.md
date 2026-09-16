# 0916 — Personal Web & Real-Time Clock

![Website Preview](image.png)

A modern personal website featuring live local time, dynamic time-of-day greetings, interactive profile customization, global world clocks, and multiple visual themes.

🌐 **Live Demo**: [https://joshu0601.github.io/0916/](https://joshu0601.github.io/0916/)

---

## 🔄 Project Architecture & Workflow

### 1. Application Runtime Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Browser Runtime"]
        subgraph Engine ["Time & Animation Engine"]
            Clock["System Clock (Date API)"] --> Loop["requestAnimationFrame Loop (60 FPS)"]
            Loop --> Digital["Digital Clock (HH:MM:SS + AM/PM)"]
            Loop --> Bar["Seconds Progress Fill (0% - 100%)"]
            Loop --> Analog["Analog Hands (Deg Rotation)"]
            Loop --> Meta["Day Progress / Day of Year / Week"]
        end

        subgraph Atmosphere ["Context Awareness"]
            TZ["Intl.DateTimeFormat"] --> DetectTZ["Timezone & UTC Offset Calc"]
            HourCheck["Hour Evaluation (00:00 - 23:59)"] --> Greet["Dynamic Greetings & Icons"]
            TZ --> World["World Clocks (NY, London, Tokyo, Sydney)"]
        end

        subgraph UserState ["User State & Storage"]
            EditModal["Profile Customizer Modal"] <--> LocalStorage[("Browser localStorage")]
            ThemeSwitch["Theme Switcher (4 Palettes)"] <--> LocalStorage
            FocusCard["Daily Focus & Goals Tracker"] <--> LocalStorage
            SoundToggle["Audio Synthesizer"] --> WebAudio["Web Audio API Oscillator"]
        end
    end
```

### 2. GitHub Pages CI/CD Deployment Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer (Joshua)
    participant Git as Local Git Repo
    participant GH as GitHub (Remote: main)
    participant GHA as GitHub Actions (deploy.yml)
    participant Pages as GitHub Pages Host

    Dev->>Git: git commit (HTML, CSS, JS, assets)
    Dev->>GH: git push origin main
    GH->>GHA: Trigger "Deploy to GitHub Pages" workflow
    activate GHA
    GHA->>GHA: actions/checkout@v4
    GHA->>GHA: actions/configure-pages@v5
    GHA->>GHA: actions/upload-pages-artifact@v3
    GHA->>Pages: actions/deploy-pages@v4
    deactivate GHA
    Pages-->>Dev: Live Website deployed at https://joshu0601.github.io/0916/
```

---

## 🚀 How to Enable GitHub Pages Deployment

This repository includes an automated GitHub Actions deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Follow these simple steps to activate your live site:

1. **Open Repository Settings**:
   - Go to [https://github.com/joshu0601/0916/settings/pages](https://github.com/joshu0601/0916/settings/pages).
2. **Set Build and Deployment Source**:
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Trigger Deployment**:
   - Every push to the `main` branch automatically builds and deploys the site.
   - You can also trigger it manually under the **Actions** tab by selecting **Deploy to GitHub Pages** > **Run workflow**.
4. **Access Your Live Website**:
   - Your site will be published at: **[https://joshu0601.github.io/0916/](https://joshu0601.github.io/0916/)**

---

## ✨ Features

- ⏱️ **Real-Time Local Clock**:
  - Millisecond-accurate rendering with live ticking seconds and seconds progression bar.
  - Dual view modes: **Digital Precision** and **Minimalist Analog Clock**.
  - Local timezone auto-detection (`Intl.DateTimeFormat`) and UTC offset display.
  - Day progress percentage, day-of-year, and week-of-year tracking.
- 🌅 **Dynamic Greetings**: Automatically adapts greetings and icons based on the user's local hour (morning, afternoon, evening, and night).
- 🎨 **Multi-Theme Switcher**:
  - **Midnight Obsidian**: Deep space dark mode with electric cyan & neon purple accents.
  - **Aurora Borealis**: Mystic emerald & teal illumination.
  - **Sunset Horizon**: Twilight plum with warm amber & coral glow.
  - **Daylight Minimal**: Crisp, frosted glass with clean slate & ocean blue.
- 👤 **Interactive Profile Editor**:
  - Inline editing for name, title, bio, email, and status.
  - State persisted locally using `localStorage`.
- 🌍 **Global World Clocks**: Real-time relative clock comparisons for New York, London, Tokyo, and Sydney.
- 🎯 **Daily Focus & Productivity**: Interactive checklist for daily goals with local persistence.
- 🔊 **Audio Chime Toggle**: Subtle synthesized audio feedback via Web Audio API.

---

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/joshu0601/0916.git
   cd 0916
   ```

2. Run a lightweight local HTTP server:
   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in your web browser.

---

## 🛠️ Built With

- **HTML5**: Semantic, accessible document structure.
- **Modern CSS**: Vanilla CSS with custom properties, backdrop blur glassmorphism, and responsive grid.
- **Vanilla JavaScript**: Pure zero-dependency modern JS for real-time engine and state management.
- **GitHub Actions**: Automated CI/CD deployment pipeline for GitHub Pages.
- **Google Fonts**: Plus Jakarta Sans, Space Grotesk, and JetBrains Mono.
- **FontAwesome**: Crisp modern vector icons.

---

## 📄 License

MIT © [Joshua](https://github.com/joshu0601)
