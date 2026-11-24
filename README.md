# Reel To Real Map

請幫我開發一個名為「CLIP2MAP // 社群靈感瞬移地圖」的高質感 Web App，這是一款能將 Instagram Reels、TikTok 短影音或隨手截圖，透過多模態 AI 空間推理自動識別真實地點並同步至個人互動地圖的 AI-Native 工具。

【視覺與 UI 設計規範（Spatial Intelligence & Dark Map Studio）】

- **色彩系統**：深邃黑曜石基底（#0B0E14）、半透明毛玻璃浮動面板（#151A23 / 85% 透明度 + 細微光澤邊框）、主強調色為衛星雷達青（#06B6D4）與地點釘選琥珀金（#F59E0B）。

- **版面配置（Split-Screen Spatial Workbench）**：

  - **左側邊欄（35% 寬度）**：AI 靈感捕捉器與珍藏地點清單（Saved Places Feed）。

  - **右側主視窗（65% 寬度）**：全螢幕深色科技風格互動地圖（可使用 Leaflet / OpenStreetMap 暗色圖磚或高質感互動地圖畫布），支援縮放、分類篩選與點擊圖釘展開卡片。

【核心功能與互動流程】

1. **一鍵靈感捕捉器（Quick Capture Bar）**：

   - 頂部設有極簡輸入框，支援「貼上 IG Reels / TikTok 連結」或「拖曳上傳影片截圖」。

   - 提供 2 個「一鍵測試範例按鈕」（例如：`[測試範例 1：無店名神祕拉麵 Reel]`、`[測試範例 2：洛杉磯隱蔽藝廊截圖]`），讓用戶不用找連結也能立刻體驗完整 AI 推理流程。

2. **多模態 AI 空間推理終端（Live AI Detective Reasoning Pipeline）**：

   - 當用戶點擊「解析並瞬移至地圖」後，畫面會彈出一個極具科技感的動態推理過程視窗（依序在 3 秒內逐步亮起完成打勾動畫），具體呈現以下四階段推理：

     * **Step 1 [視覺微線索 OCR]**：掃描關鍵影格，提取畫面角落線索（例如：`偵測到杯套字樣 / 拱形紅磚牆裝潢特徵`）。

     * **Step 2 [語音與文案錨點]**：分析創作者口白與 Hashtags（例如：`提取口語線索「Culver City 地鐵站步行 3 分鐘」`）。

     * **Step 3 [空間拓撲交叉比對]**：結合周邊地標相對位置（例如：`比對半徑 400m 內商家

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://reel-to-real-map.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f58a6b2a-f426-43fc-b4fd-2b68a013ca19).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
