# アーキテクチャドキュメント

## システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    クライアント層 (Frontend)                   │
│  React/Vue Components │ Map Display │ Route Visualization  │
└──────────────────┬────────────────────────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────▼────────────────────────────────────────┐
│                  API層 (Backend)                          │
│  Express.js │ Route Handlers │ Data Validation           │
└──────────────────┬────────────────────────────────────────┘
                   │ Fleetbase API Calls
┌──────────────────▼────────────────────────────────────────┐
│              Fleetbase統合層                               │
│  VRP Solver │ Route Optimization │ Fleet Management       │
└──────────────────┬────────────────────────────────────────┘
                   │ REST API
┌──────────────────▼────────────────────────────────────────┐
│              Fleetbaseサーバー                             │
│  ルート最適化エンジン │ データベース │ 外部API連携         │
└─────────────────────────────────────────────────────────────┘
```

## データフロー

### 1. ルート最適化リクエストフロー

```
ユーザー入力
    ↓
フロントエンド (ルート入力フォーム)
    ↓
バックエンド (リクエスト検証)
    ↓
Fleetbase API (VRP計算)
    ↓
最適ルート結果
    ↓
フロントエンド (地図表示)
    ↓
ユーザー確認
```

## モジュール構成

### Frontend
- `components/` - React/Vue コンポーネント
- `pages/` - ページコンポーネント
- `services/` - API呼び出し層
- `store/` - 状態管理
- `utils/` - ユーティリティ関数
- `types/` - TypeScript型定義

### Backend
- `routes/` - APIエンドポイント
- `controllers/` - ビジネスロジック
- `services/` - Fleetbase統合
- `middleware/` - ミドルウェア
- `models/` - データモデル
- `utils/` - ユーティリティ

### Fleetbase Integration
- `config/` - Fleetbase設定
- `services/` - ルート最適化サービス
- `models/` - Fleetbaseモデル
- `adapters/` - データ変換

## API仕様

### ルート最適化エンドポイント

```
POST /api/routes/optimize

リクエスト:
{
  "stops": [
    { "id": "1", "lat": 10.123, "lng": 20.456, "address": "Address 1" },
    { "id": "2", "lat": 10.234, "lng": 20.567, "address": "Address 2" }
  ],
  "vehicles": [
    { "id": "v1", "capacity": 1000, "startLat": 10.000, "startLng": 20.000 }
  ],
  "options": {
    "optimize": "distance", // distance, time, cost
    "timeWindow": true
  }
}

レスポンス:
{
  "routes": [
    {
      "id": "route-1",
      "vehicleId": "v1",
      "stops": [ "1", "2" ],
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

## Fleetbase統合ポイント

### 1. 認証
- API Keyベースの認証
- リクエストヘッダーに `Authorization: Bearer <API_KEY>` を含める

### 2. ルート最適化
- `/v1/routing/optimize` エンドポイントを使用
- VRP（Vehicle Routing Problem）アルゴリズム
- 複数の最適化条件に対応

### 3. マップデータ
- OpenStreetMap統合
- ジオコーディング機能
- リアルタイム位置更新

## 処理フロー詳細

### ルート最適化処理

1. **入力検証**
   - 配送地点数チェック
   - 座標形式チェック
   - 車両情報検証

2. **データ変換**
   - Fleetbase形式へのデータ変換
   - 必須フィールドの確認

3. **API呼び出し**
   - Fleetbase VRP APIへのリクエスト
   - タイムアウト処理
   - エラーハンドリング

4. **結果処理**
   - 最適ルート結果の取得
   - フロントエンド形式への変換
   - キャッシング

5. **レスポンス返却**
   - JSON形式での返却
   - メタデータの追加

## セキュリティ考慮事項

- API Key管理（環境変数で隠蔽）
- CORS設定
- リクエスト検証
- レート制限
- ログ管理（機密情報の除外）
