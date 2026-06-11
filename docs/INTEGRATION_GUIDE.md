# 統合ガイド

## 🚀 セットアップ

### Step 1: 両プロジェクトをクローン

```bash
git clone https://github.com/Toshitsugu612/SCMproblem.git
cd SCMproblem
```

### Step 2: 両プロジェクトの依存パッケージをインストール

```bash
# フロントエンド
(cd frontend && npm install)

# バックエンド
(cd backend && npm install)
```

### Step 3: 両プロジェクトの環境変数を設定

**backend/.env:**

```env
PORT=3000
NODE_ENV=development
FLEETBASE_API_KEY=your_actual_api_key
FLEETBASE_API_HOST=https://api.fleetbase.io
FLEETBASE_ORGANIZATION_SLUG=your_organization_slug
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**frontend/.env.local:**

```env
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=false
```

---

## 🚀 開発サーバー起動

### 方法 1: 手動起動

2つのターミナルを開いて以下を実行してください：

**ターミナル 1 (フロントエンド):**

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

**ターミナル 2 (バックエンド):**

```bash
cd backend
npm run dev
```

ターミナルを確認して、以下のようなメッセージが表示されれば正常です：

```
🚀 Server running on http://localhost:3000
```

---

## 🧪 API 統合テスト

### 1. ヘルスチェック

```bash
curl http://localhost:3000/health
```

**期待されるレスポンス:**

```json
{
  "status": "ok",
  "timestamp": "2026-06-11T06:30:00.000Z",
  "version": "0.1.0"
}
```

### 2. Ready チェック

```bash
curl http://localhost:3000/health/ready
```

**期待されるレスポンス:**

```json
{
  "ready": true,
  "timestamp": "2026-06-11T06:30:00.000Z"
}
```

### 3. ルート最適化 API

```bash
curl -X POST http://localhost:3000/api/routes/optimize \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

正式的な実装では、以下のようなレスポンスが返るいいです:

```json
{
  "success": true,
  "cached": false,
  "routes": [
    {
      "id": "route-uuid",
      "vehicle_id": "v1",
      "stops": [
        {
          "sequence": 1,
          "destination_id": "1",
          "latitude": 35.6762,
          "longitude": 139.6503
        },
        {
          "sequence": 2,
          "destination_id": "2",
          "latitude": 34.6937,
          "longitude": 135.5023
        }
      ],
      "distance": 407.5,
      "duration": 14580,
      "cost": 2437.5
    }
  ],
  "totalDistance": 407.5,
  "totalDuration": 14580,
  "totalCost": 2437.5
}
```

---

## 📋 トラブルシューティング

### CORS エラー

```
Access to XMLHttpRequest at 'http://localhost:3000/api/routes/optimize' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**解決策:**

backend/.env で `CORS_ORIGIN` が正しく設定されていることを確認してください：

```env
CORS_ORIGIN=http://localhost:5173
```

### Fleetbase API Key エラー

```
Error: FLEETBASE_API_KEY is not set
```

**解決策:**

Fleetbase アカウントを作成し、API Key を取得して `.env` を更新してください：

```env
FLEETBASE_API_KEY=your_actual_api_key
FLEETBASE_ORGANIZATION_SLUG=your_organization_slug
```

### ポートが既に使用中

```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決策:**

```bash
# ポート 3000 を使用しているプロセスを終める
kill -9 $(lsof -i :3000 -t)

# または別ポートを指定
PORT=3001 npm run dev
```

---

## 📚 統合テストチェックリスト

- [ ] バックエンドが http://localhost:3000 で稼動している
- [ ] フロントエンドが http://localhost:5173 で稼動している
- [ ] `GET /health` が 200 を返す
- [ ] `GET /health/ready` が 200 を返す
- [ ] `POST /api/routes/optimize` がリクエストを受け付ける
- [ ] CORS が正しく設定されている
- [ ] Fleetbase API Key が正式的に機能している

---

## 📖 参考リソース

- [Frontend README](../../frontend/README.md)
- [Backend README](../README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [Fleetbase Official Docs](https://docs.fleetbase.io)
