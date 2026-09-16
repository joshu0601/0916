# 0916 — Joshu's Personal Space & Real-Time Clock

![Website Preview](image.png)

A modern personal website featuring live local time, dynamic time-of-day greetings, interactive profile customization, core technical skills, featured projects showcase, and multiple visual themes.

🌐 **線上網站 (Live Demo)**: [https://joshu0601.github.io/0916/](https://joshu0601.github.io/0916/)

---

## 📋 本作業 5 大核心功能檢驗表 (Requirements Checklist)

| 序號 | 項目 (Feature) | 頁面呈現與實作說明 (Implementation Details) |
|:---:|:---|:---|
| **👤 1** | **Profile (個人介紹)** | • **姓名**：Joshu<br>• **個人頭像**：自定義 3D 幾何賽博美學 Avatar（支援自訂網址）<br>• **科系**：資訊工程學系 (Computer Science & Information Engineering)<br>• **專長**：Web Dev · AI/ML · IoT · 系統設計<br>• **自我介紹**：熱愛探索前沿軟體架構、人機互動介面與人工智慧應用，致力於打造高效能、具直覺美感與流暢互動體驗的現代化數位產品。 |
| **🛠 2** | **Skills (核心技能)** | 至少列出 3 項技能，本專案完整呈現 6 大領域：<br>1. **Python**：數據分析、ML 模型推論與後端服務<br>2. **C / C++**：演算法、底層資料結構與嵌入式開發<br>3. **Web Development**：HTML5, Modern CSS (Glassmorphism), Vanilla JS<br>4. **Machine Learning & AI**：預測模型、神經網路與邊緣運算<br>5. **IoT (物聯網應用)**：微控制器整合、MQTT 輕量級協議<br>6. **Data Analysis**：數據清洗、統計分析與 Pandas/NumPy 視覺化 |
| **🚀 3** | **Projects (專案作品)** | • **專案 1 (現正上線)**：`0916 — Personal Web & Live Clock`<br>  - 技術：HTML5, Modern CSS, Vanilla JS, Web Audio API, GitHub Actions<br>  - 連結：[GitHub Repo](https://github.com/joshu0601/0916) · [Live Demo](https://joshu0601.github.io/0916/)<br>• **專案 2 (本學期預計完成)**：`Smart Edge AI & IoT Assistant`<br>  - 說明：微控制器與輕量化 ML 之智慧環境監測系統，微秒級低延遲感測與雲端告警<br>  - 技術：Python, C/C++, IoT, Machine Learning, MQTT |
| **🕐 4** | **Live Clock (即時時鐘)** | • **即時時間更新**：使用 JavaScript `requestAnimationFrame` 與系統時鐘同步，精確顯示 `HH : MM : SS`<br>• **功能亮點**：AM/PM 指示、秒數進度條 (0-60s)、即時指針鐘 (Analog) 雙視圖切換、本地時區自動偵測 (`Intl.DateTimeFormat`) 與 UTC 時差計算、今日時間流逝百分比 |
| **🎨 5** | **Personal Design (個人風格)** | • **視覺美學**：極致毛玻璃擬態 (Glassmorphism) 與動態漂浮光暈背景 (Floating Mesh Glow)<br>• **4 款主題即時切換**：Midnight Obsidian (暗黑星系)、Aurora Borealis (極光翡翠)、Sunset Horizon (日落暖霞)、Daylight Minimal (極簡白日)<br>• **字型搭配**：Google Fonts（Plus Jakarta Sans、Space Grotesk、JetBrains Mono、Noto Sans TC）<br>• **微互動**：卡片 Hover 上浮懸停、Web Audio API 擬真音效開關、自訂資料 Modal 與 localStorage 本地持久化 |

---

## 🔄 專案架構與工作流程 (Workflows)

### 1. 前端客戶端資料流 (Client Runtime Data Flow)

```mermaid
flowchart TD
    subgraph Client ["客戶端瀏覽器 (Browser Runtime)"]
        subgraph Engine ["時鐘與動態引擎 (Clock Engine)"]
            Clock["系統時鐘 (Date API)"] --> Loop["requestAnimationFrame Loop (60 FPS)"]
            Loop --> Digital["數位時鐘 (HH : MM : SS + AM/PM)"]
            Loop --> Bar["動態秒數進度條 (0% - 100%)"]
            Loop --> Analog["指針時鐘 (時/分/秒針角度旋轉)"]
            Loop --> Meta["今日時間進度 / 年內天數與週數"]
        end

        subgraph Atmosphere ["環境感知 (Atmosphere)"]
            TZ["Intl.DateTimeFormat"] --> DetectTZ["本地時區與 UTC 時差計算"]
            HourCheck["小時判斷 (00:00 - 23:59)"] --> Greet["動態時段問候與天氣圖示"]
            TZ --> World["世界時鐘 (紐約, 倫敦, 東京, 雪梨)"]
        end

        subgraph UserState ["狀態管理 (User State)"]
            EditModal["個人檔案編輯彈窗"] <--> LocalStorage[("瀏覽器 localStorage")]
            ThemeSwitch["4 種色彩主題切換"] <--> LocalStorage
            FocusCard["今日目標清單"] <--> LocalStorage
            SoundToggle["音效合成器"] --> WebAudio["Web Audio API 音效振盪器"]
        end
    end
```

### 2. GitHub Pages CI/CD 自動化部署流程

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 開發者 (Joshu)
    participant Git as 本地 Git 倉庫
    participant GH as GitHub (main 分支)
    participant GHA as GitHub Actions (.github/workflows/deploy.yml)
    participant Pages as GitHub Pages CDN

    Dev->>Git: git commit (HTML, CSS, JS, Assets)
    Dev->>GH: git push origin main
    GH->>GHA: 觸發自動部署工作流程
    activate GHA
    GHA->>GHA: 檢出程式碼 (actions/checkout@v4)
    GHA->>GHA: 打包乾淨靜態檔案至 _site 並加入 .nojekyll
    GHA->>GHA: 上傳靜態製品 (actions/upload-pages-artifact@v3)
    GHA->>Pages: 部署至 GitHub Pages (actions/deploy-pages@v4)
    GHA->>GH: 同步推播至 gh-pages 分支 (Fallback)
    deactivate GHA
    Pages-->>Dev: 網站成功發布至 https://joshu0601.github.io/0916/
```

---

## 💻 本地端運行方式 (Local Development)

1. 複製倉庫至本機：
   ```bash
   git clone https://github.com/joshu0601/0916.git
   cd 0916
   ```

2. 啟動輕量靜態伺服器：
   ```bash
   python -m http.server 8000
   ```

3. 於瀏覽器開啟 `http://localhost:8000` 即可檢視完整動態效果。

---

## 🛠️ 技術棧 (Built With)

- **HTML5**：語意化結構、完整 SEO 與社群分享標籤。
- **Modern CSS**：自定義 CSS 變數、進階玻璃態擬物美學（Glassmorphism）、流暢 60FPS CSS Keyframe 動畫。
- **Vanilla JavaScript**：純原生 JavaScript、零外部打包工具相依、高效能 `requestAnimationFrame` 即時運算。
- **Web Audio API**：原生音訊合成器（Oscillator）實作報時點擊音效。
- **GitHub Actions & Pages**：自動化持續整合與靜態網頁託管。
- **Google Fonts & FontAwesome**：Plus Jakarta Sans、Space Grotesk、JetBrains Mono、Noto Sans TC 與現代向量圖示。

---

## 📄 License

MIT © [Joshu](https://github.com/joshu0601)
