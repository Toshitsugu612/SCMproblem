# SCM Problem - Transportation Route Optimization UI

Fleetbaseを使用した効率的な輸送ルート最適化UIの開発プロジェクトです。

## 📋 プロジェクト概要

供給チェーン管理（SCM）における最適な輸送ルート選択を実現するWebアプリケーション。
Fleetbaseのルート最適化エンジンを活用し、複数の配送地点への効率的なルート計画を提供します。

## 🎯 主な機能

- **ルート最適化**: 複数の配送地点に対する最適ルート計算
- **リアルタイム追跡**: 配送状況のリアルタイム表示
- **マップ表示**: 地図上でのルート可視化
- **コスト分析**: 燃料費、距離、時間などの詳細分析
- **複数配送方法対応**: 複数の車両・方法によるルート提案

## 🏗️ プロジェクト構成

```
SCMproblem/
├── frontend/           # フロントエンド (React/Vue)
├── backend/            # バックエンド (Node.js/Python)
├── fleetbase-integration/  # Fleetbase統合
├── tests/              # テスト
├── docs/               # ドキュメント
├── package.json
└── README.md
```

## 🚀 技術スタック

### フロントエンド
- **フレームワーク**: React / Vue.js
- **地図表示**: Leaflet / Mapbox GL JS
- **UI コンポーネント**: Material-UI / Ant Design
- **状態管理**: Redux / Vuex

### バックエンド
- **ランタイム**: Node.js
- **フレームワーク**: Express.js / Fastify
- **API**: REST API

### Fleetbase統合
- **ルート最適化エンジン**: Fleetbase VRP Solver
- **API**: Fleetbase REST API
- **Authentication**: API キーベース認証

## 📦 依存関係

### Fleetbaseの主要モジュール
- `@fleetbase/fleetbase-js` - JavaScript SDK
- `@fleetbase/ui` - UIコンポーネント
- `@fleetbase/models` - データモデル

## 🔧 セットアップ

### 前提条件
- Node.js >= 16
- npm または yarn
- Fleetbaseアカウント

### インストール

```bash
# リポジトリクローン
git clone https://github.com/Toshitsugu612/SCMproblem.git
cd SCMproblem

# フロントエンドのセットアップ
cd frontend
npm install

# バックエンドのセットアップ
cd ../backend
npm install
```

### 環境設定

`.env`ファイルを作成して以下を設定:

```env
# Fleetbase
FLEETBASE_API_KEY=your_api_key
FLEETBASE_API_HOST=https://api.fleetbase.io

# Backend
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

## 📝 開発

### フロントエンド開発サーバー

```bash
cd frontend
npm run dev
```

### バックエンド開発サーバー

```bash
cd backend
npm run dev
```

## 🧪 テスト

```bash
# ユニットテスト
npm test

# E2Eテスト
npm run test:e2e
```

## 📚 Fleetbaseドキュメント

- [Fleetbase公式ドキュメント](https://docs.fleetbase.io)
- [ルート最適化API](https://docs.fleetbase.io/guides/routing)
- [JavaScript SDK](https://github.com/fleetbase/fleetbase-js)

## 🎓 参考リポジトリ

- [Fleetbase](https://github.com/fleetbase/fleetbase) - メインプロジェクト
- [Fleetbase Console](https://github.com/fleetbase/console) - ダッシュボードUI
- [Fleetbase API](https://github.com/fleetbase/api) - バックエンドAPI

## 📄 ライセンス

MIT License

## 👤 作成者

Toshitsugu612

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
