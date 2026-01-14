# 評価ページ API仕様書

生成日: 2026-01-10
対象ページ: P-001 評価ページ (`/`)
収集元: frontend/src/pages/EvaluationPage.tsx

## エンドポイント一覧

### 1. 部署一覧取得

- **エンドポイント**: `GET /api/departments`
- **APIパス定数**: `API_PATHS.DEPARTMENTS`
- **Request**: なし
- **Response**: `Department[]`

```typescript
interface Department {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
```

**用途**: イントロ画面で部署数を表示、評価画面で部署情報を表示

---

### 2. 評価項目一覧取得

- **エンドポイント**: `GET /api/criteria`
- **APIパス定数**: `API_PATHS.CRITERIA`
- **Request**: なし
- **Response**: `EvaluationCriteria[]`

```typescript
interface EvaluationCriteria {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

**用途**: イントロ画面で評価項目を説明、評価画面で項目ごとのスコア入力

---

### 3. 評価送信

- **エンドポイント**: `POST /api/vote`
- **APIパス定数**: `API_PATHS.VOTE`
- **Request**: `VoteRequest`
- **Response**: `VoteResponse`

```typescript
// Request
interface VoteRequest {
  evaluations: EvaluationInput[];
  fingerprint: string;
  eventYear: number;
}

interface EvaluationInput {
  departmentId: string;
  criteriaId: string;
  score: number; // 1〜10
}

// Response
interface VoteResponse {
  success: boolean;
  message: string;
}
```

**用途**: 確認画面で「評価を送信」ボタン押下時に全評価データを一括送信

---

## バリデーションルール

| フィールド | ルール |
|-----------|--------|
| `score` | 1〜10の整数 |
| `fingerprint` | 必須、同一fingerprint + eventYearの組み合わせで二重投票防止 |
| `departmentId` | 存在する部署IDであること |
| `criteriaId` | 存在する有効な評価項目IDであること |

---

## 二重投票防止

### フロントエンド側
- FingerprintJS でデバイス識別子を取得
- localStorage に投票済みフラグを保存
- 投票済みの場合は完了画面を表示

### バックエンド側（実装必要）
- fingerprint + eventYear の組み合わせでユニーク制約
- 既存の評価があれば 409 Conflict を返す

---

## モックサービス参照

実装時は以下のファイルを参考:
- `frontend/src/services/api/evaluationApi.ts`
- `frontend/src/types/index.ts`

---

## 初期データ要件

### 部署データ（5件）
| 表示順 | 部署名 |
|--------|--------|
| 1 | コンシューマーカンパニー |
| 2 | コーポレートセールスカンパニー |
| 3 | SSDカンパニー |
| 4 | BBC |
| 5 | Unneon |

### 評価項目データ（3件）
| 表示順 | 評価項目名 |
|--------|-----------|
| 1 | 文化・制度の魅力度 |
| 2 | 未来への期待値（ワクワクしたか） |
| 3 | そのカンパニーに所属しているヒトの魅力を感じれたか |
