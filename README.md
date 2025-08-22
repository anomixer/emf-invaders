# emf-emulator-arcade_invaders

An emulator built with the EMF system, which aims to significantly lower the barrier to entry for emulation developers, and would-be emulation developers.

It does this by removing the complex code, providing instead a domain-specific language which describes the entire computer system, in XML. A builder program then translates this XML into source code, generating an emulator, assembler, and disassembler - all from the same originating file.

See em.ulat.es for a full explanation and demo.

---

## 繁體中文說明

這是一個使用 EMF 系統建構的模擬器，旨在顯著降低模擬器開發者和潛在模擬器開發者的入門門檻。

它通過移除複雜的程式碼，改為提供一種領域特定語言來描述整個電腦系統，以 XML 格式呈現。然後，建構程式會將此 XML 轉換為原始碼，從同一個原始檔案生成模擬器、組譯器和反組譯器。

### 功能特色

- **多語言支援**：支援英文和繁體中文介面
- **語言切換**：所有頁面都提供 en/tw 語言切換按鈕
- **音效系統**：修復的音效播放功能，支援本地音效備用
- **完整模擬**：包含 Space Invaders 街機遊戲的完整模擬
- **開發工具**：提供組譯器、反組譯器和除錯工具

### 使用方式

1. 在瀏覽器中開啟 `index.html` 開始遊戲
2. 使用語言切換按鈕在英文和繁體中文之間切換
3. 按 `C` 鍵投幣，按 `1` 或 `2` 開始遊戲
4. 使用方向鍵移動，發射鍵攻擊外星人

### 技術架構

- 基於 EMF (Emulator Framework) 系統
- 使用 JavaScript 實現
- 支援 HTML5 Canvas 和 Web Audio API
- 響應式設計，支援各種螢幕尺寸

詳見 [em.ulat.es](http://em.ulat.es) 獲取完整說明和演示。
