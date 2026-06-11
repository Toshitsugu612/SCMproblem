# SCM Problem - Backend

Fleetbase を使用したルート最適化 API サーバーです。

## 🚀 セットアップ

### 前提条件
- Node.js >= 16
- npm または yarn
- Fleetbase アカウント & API Key

### インストール

```bash
cd backend
npm install
```

### 環境設定

`.env` ファイルを作成し、`.env.example` を参考に設定してください：

```env
PORT=3000
NODE_ENV=development

# Fleetbase
FLEETBASE_API_KEY=your_api_key_here
FLEETBASE_API_HOST=https://api.fleetbase.io
FLEETBASE_ORGANIZATION_SLUG=your_organization_slug

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

## 🏃 実行

### 開発モード（ホットリロード）

```bash
npm run dev
```

### 本番モード

```bash
npm start
```

### テスト実行

```bash
npm test
```

## 📡 API エンドポイント

### ヘルスチェック

```
GET /health
GET /health/ready
```

### ルート最適化

```
POST /api/routes/optimize
```

**リクエスト例:**

```json
{
  "stops": [
    {
      "id": "1",
      "lat": 35.6762,
      "lng": 139.6503,
      "address": "東京都渋谷区"
    },
    {
      "id": "2",
      "lat": 34.6937,
      "lng": 135.5023,
      "address": "大阪府大阪市"
    }
  ],
  "vehicles": [
    {
      "id": "v1",
      "capacity": 1000,
      "startLat": 35.6762,
      "startLng": 139.6503
    }
  ],
  "options": {
    "optimize": "distance",
    "timeWindow": false
  }
}
```

**レスポンス例:**

```json
{
  "success": true,
  "cached": false,
  "routes": [
    {
      "id": "route-uuid",
      "vehicle_id": "v1",
      "stops": [...],
      "distance": 45.67,
      "duration": 3600,
      "cost": 125.50
    }
  ],
  "totalDistance": 45.67,
  "totalDuration": 3600,
  "totalCost": 125.50
}
```

### ルート一覧取得

```
GET /api/routes
```

### ルート詳細取得

```
GET /api/routes/:id
```

### ルート削除

```
DELETE /api/routes/:id
```

### ルート更新

```
PUT /api/routes/:id
```

## 📁 プロジェクト構造

```
backend/
├── src/
│   ├── server.js              # メインサーバー
│   ├── routes/
│   │   ├── health.js          # ヘルスチェック
│   │   └── routes.js          # ルート API
│   ├── services/
│   │   ├── fleetbaseService.js # Fleetbase 統合
│   │   └── cacheService.js     # キャッシング
│   ├── middleware/
│   │   ├── errorHandler.js    # エラーハンドリング
│   │   ├── requestLogger.js   # リクエストログ
│   │   └── validateRequest.js # リクエスト検証
│   ├── validators/
│   │   └── routeValidator.js  # ルート検証スキーマ
│   ├── utils/
│   │   └── logger.js          # ロギング
│   └── tests/
│       └── (テストファイル)
├── package.json
├── .env.example
└── README.md
```

## 🔧 主な機能

### 1. ルート最適化
- Fleetbase VRP Solver との統合
- 複数の最適化目標（距離・時間・コスト）
- 時間窓制約対応

### 2. キャッシング
- 同じリクエストへの高速レスポンス
- TTL ベースの自動削除
- メモリ効率的な実装

### 3. エラーハンドリング
- バリデーションエラー
- API エラーの適切な変換
- スタックトレース出力（開発モード）

### 4. ロギング
- Winston ベースの構造化ログ
- ファイル・コンソール出力
- レベル別フィルタリング

## 🚨 トラブルシューティング

### Fleetbase API キーが無効

```
Error: Unauthorized
```

**解決策:**
- `.env` で `FLEETBASE_API_KEY` が正しく設定されているか確認
- Fleetbase ダッシュボードで API キーをリセット

### ポート 3000 が既に使用されている

```bash
npm run dev -- --port 3001
```

### CORS エラー

`CORS_ORIGIN` 環境変数がフロントエンドのURLと一致しているか確認してください。

## 📚 関連ドキュメント

- [Architecture.md](../docs/ARCHITECTURE.md) - システムアーキテクチャ
- [Fleetbase Integration](../docs/FLEETBASE_INTEGRATION.md) - Fleetbase 統合ガイド
- [Fleetbase API Docs](https://docs.fleetbase.io) - 公式ドキュメント

## 📝 次のステップ

- [ ] データベース統合 (MongoDB/PostgreSQL)
- [ ] リアルタイム配送追跡 (WebSocket)
- [ ] ユーザー認証・認可
- [ ] メトリクス・ダッシュボード
- [ ] デプロイメント設定
