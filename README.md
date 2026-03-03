# 困難拉圖斯計時器（PWA 版）

這是可安裝至桌面的 PWA 版計時器。

## 本地測試
1. 直接以任何靜態伺服器開啟資料夾（例如 VS Code Live Server）。
2. 造訪 `http://localhost:xxxx/`，瀏覽器網址列會顯示可安裝的圖示。

## 發佈到 GitHub Pages
1. 建立一個新的 GitHub 儲存庫（Public）。
2. 將這些檔案全部推上去：`index.html`、`Papulatus_timer.html`、`service-worker.js`、`manifest.webmanifest`、`icons/` 目錄。
3. 進入 *Settings → Pages*，在 **Branch** 選擇 `main`，**Folder** 選 `/(root)`，按 **Save**。
4. 等待 1~2 分鐘，頁面會出現在 `https://<你的帳號>.github.io/<repo>/`。

若你日後修改檔案，重新 push 即可，PWA 會自動更新（有時需重新整理一次）。
