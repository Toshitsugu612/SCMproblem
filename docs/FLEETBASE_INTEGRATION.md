# Fleetbase統合ガイド

## 概要

このドキュメントはFleetbaseをSCMproblemに統合するための詳細なガイドです。

## Fleetbaseとは

Fleetbaseは、ロジスティクスと供給チェーン管理のための包括的なオープンソースプラットフォームです。
以下の主要機能を提供します：

- **ルート最適化**: VRP（Vehicle Routing Problem）ソルバー
- **フリート管理**: 車両とドライバーの管理
- **倉庫管理**: インベントリと倉庫操作
- **注文管理**: 配送注文の管理
- **リアルタイム追跡**: GPS追跡とリアルタイム更新

## セットアップ

### 1. Fleetbaseアカウント作成

1. [Fleetbase](https://www.fleetbase.io)にアクセス
2. アカウントを作成
3. API Keyを取得

### 2. JavaScript SDKのインストール

```bash
npm install @fleetbase/fleetbase-js
```

### 3. 環境変数設定

`.env`に以下を追加：

```env
FLEETBASE_API_KEY=your_api_key_here
FLEETBASE_API_HOST=https://api.fleetbase.io
FLEETBASE_ORGANIZATION_SLUG=your_organization_slug
```

## 基本的な使用方法

### Fleetbaseクライアント初期化

```javascript
import Fleetbase from '@fleetbase/fleetbase-js';

const fleetbase = new Fleetbase({
  key: process.env.FLEETBASE_API_KEY,
  host: process.env.FLEETBASE_API_HOST,
});
```

### ルート最適化の実装例

```javascript
// 配送地点の定義
const destinations = [
  {
    id: 'dest-1',
    latitude: 10.123,
    longitude: 20.456,
    address: 'Tokyo, Japan',
    delivery_notes: 'Handle with care',
  },
  {
    id: 'dest-2',
    latitude: 10.234,
    longitude: 20.567,
    address: 'Osaka, Japan',
  },
];

// 車両の定義
const vehicles = [
  {
    id: 'vehicle-1',
    capacity: 1000, // kg
    latitude: 10.000,
    longitude: 20.000,
    max_time: 28800, // 8 hours in seconds
  },
];

// ルート最適化リクエスト
const optimizationRequest = {
  destinations,
  vehicles,
  optimize: 'distance', // 'distance', 'time', 'cost'
  time_windows: true,
  polylines: true, // 詳細ルート情報を含める
};

try {
  const result = await fleetbase.routing.optimize(optimizationRequest);
  console.log('最適化結果:', result);
  // 結果の処理
} catch (error) {
  console.error('ルート最適化エラー:', error);
}
```

## API リファレンス

### routing.optimize()

配送地点に対する最適ルートを計算します。

**パラメータ:**

| パラメータ | 型 | 説明 | 必須 |
|-----------|----|----|-----|
| destinations | Array | 配送地点のリスト | ✓ |
| vehicles | Array | 配送車両のリスト | ✓ |
| optimize | String | 最適化目標 ('distance'\|'time'\|'cost') | ✓ |
| time_windows | Boolean | 時間窓制約を有効化 | - |
| polylines | Boolean | 詳細ルート情報を含める | - |
| roundtrip | Boolean | ラウンドトリップ（往復）最適化 | - |

**レスポンス:**

```javascript
{
  routes: [
    {
      id: 'route-uuid',
      vehicle_id: 'vehicle-1',
      stops: [
        {
          sequence: 1,
          destination_id: 'dest-1',
          latitude: 10.123,
          longitude: 20.456,
          arrival_time: 1623456789,
          departure_time: 1623456900,
        },
        // その他の停止地点
      ],
      distance: 45.67, // km
      duration: 3600, // seconds
      cost: 125.50, // Currency unit
      polyline: 'encoded_polyline_string',
    },
  ],
  unrouted: [], // ルート割り当てできなかった地点
  total_distance: 45.67,
  total_duration: 3600,
  total_cost: 125.50,
}
```

## 高度な機能

### 時間窓制約

配送時間を制限する場合：

```javascript
const destinations = [
  {
    id: 'dest-1',
    latitude: 10.123,
    longitude: 20.456,
    time_window_start: 1623456000, // Unix timestamp
    time_window_end: 1623459600,   // Unix timestamp
  },
];
```

### 複数のスキル/要件

車両が特定のスキルを必要とする場合：

```javascript
const destinations = [
  {
    id: 'dest-1',
    latitude: 10.123,
    longitude: 20.456,
    required_skills: ['refrigerated', 'hazmat'],
  },
];

const vehicles = [
  {
    id: 'vehicle-1',
    capacity: 1000,
    skills: ['refrigerated', 'hazmat', 'fragile'],
  },
];
```

### ピックアップ＆デリバリー

```javascript
const destinations = [
  {
    id: 'pickup-1',
    latitude: 10.123,
    longitude: 20.456,
    type: 'pickup', // 'delivery' or 'pickup'
    weight: 100,
  },
  {
    id: 'delivery-1',
    latitude: 10.234,
    longitude: 20.567,
    type: 'delivery',
    weight: 100,
  },
];
```

## 実装ベストプラクティス

### 1. エラーハンドリング

```javascript
try {
  const result = await fleetbase.routing.optimize(request);
} catch (error) {
  if (error.statusCode === 400) {
    // 入力検証エラー
  } else if (error.statusCode === 429) {
    // レート制限エラー
  } else if (error.statusCode === 500) {
    // サーバーエラー
  }
}
```

### 2. キャッシング

同じリクエストへの複数呼び出しを避けるためキャッシングを実装：

```javascript
const cacheKey = hashRequest(request);
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
const result = await fleetbase.routing.optimize(request);
cache.set(cacheKey, result);
```

### 3. レート制限への対応

```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let retries = 0;
const maxRetries = 3;

while (retries < maxRetries) {
  try {
    return await fleetbase.routing.optimize(request);
  } catch (error) {
    if (error.statusCode === 429) {
      retries++;
      await delay(Math.pow(2, retries) * 1000); // Exponential backoff
    } else {
      throw error;
    }
  }
}
```

## トラブルシューティング

### API Key が無効

```
Error: Unauthorized
```

**解決策:**
- API Keyが正しく設定されているか確認
- .env ファイルに正しい Key が記載されているか確認
- Fleetbaseダッシュボードでキーをリセット

### ルート計算失敗

```
Error: No feasible solution found
```

**解決策:**
- 車両の容量が十分か確認
- 時間窓が現実的か確認
- 配送地点が到達可能か確認

## 参考資料

- [Fleetbaseドキュメント](https://docs.fleetbase.io)
- [JavaScript SDK GitHub](https://github.com/fleetbase/fleetbase-js)
- [ルーティングAPI仕様](https://docs.fleetbase.io/guides/routing)
