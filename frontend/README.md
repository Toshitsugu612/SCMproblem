# SCM Problem - Frontend

Fleetbaseを使用した輸送ルート最適化UIのフロントエンド実装です。

## 🚀 セットアップ

### 前提条件
- Node.js >= 16
- npm または yarn

### インストール

```bash
cd frontend
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### ビルド

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 📁 プロジェクト構造

```
frontend/
├── src/
│   ├── components/       # Reactコンポーネント
│   │   ├── Layout.jsx
│   │   ├── Navigation.jsx
│   │   ├── RouteCard.jsx
│   │   └── RouteMap.jsx
│   ├── pages/            # ページコンポーネント
│   │   ├── Dashboard.jsx
│   │   ├── RouteOptimization.jsx
│   │   └── RouteDetail.jsx
│   ├── services/         # API呼び出し
│   │   └── api.js
│   ├── store/            # 状態管理 (Zustand)
│   │   └── routeStore.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 主な機能

### 1. ダッシュボード
- 最適化されたルート一覧を表示
- ルートカードで簡単な統計情報を表示
- ルート詳細ページへのリンク

### 2. ルート最適化ページ
- 配送地点を入力（住所・緯度・経度）
- 車両情報の設定
- 最適化方法の選択（距離・時間・コスト）
- リアルタイムで地図上にマーカー表示
- 最適化結果をマップで表示

### 3. ルート詳細ページ
- 特定のルートの詳細情報表示
- ルート上の配送地点と順序を表示
- 統計情報（距離・時間・コスト）

## 🔧 使用技術

- **React 18.2** - UIライブラリ
- **Vite 4.3** - ビルドツール
- **React Router 6.14** - ルーティング
- **Zustand 4.3** - 状態管理
- **Material-UI 5.13** - UIコンポーネント
- **Leaflet 1.9.4** - 地図表示
- **Axios 1.4** - HTTP クライアント

## 🌍 API統合

バックエンドAPI（localhost:3000）と連携します。
Viteの開発サーバーは自動的にAPI呼び出しをプロキシします。

**主なエンドポイント:**
- `POST /api/routes/optimize` - ルート最適化
- `GET /api/routes` - ルート一覧取得
- `GET /api/routes/{id}` - ルート詳細取得
- `DELETE /api/routes/{id}` - ルート削除
- `PUT /api/routes/{id}` - ルート更新

## 📝 環境変数

`.env.local` ファイルで以下を設定できます：

```env
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=false
```

## 🐛 トラブルシューティング

### ポート 5173 が既に使用されている場合

```bash
npm run dev -- --port 5174
```

### APIへの接続ができない場合

1. バックエンドサーバーが起動していることを確認
2. `VITE_API_URL` の設定を確認
3. CORS設定がバックエンドで有効になっていることを確認

## 📚 関連ドキュメント

- [Architecture.md](../docs/ARCHITECTURE.md) - システムアーキテクチャ
- [Fleetbase Integration](../docs/FLEETBASE_INTEGRATION.md) - Fleetbase統合ガイド
