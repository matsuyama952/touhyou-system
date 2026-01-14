# 社員総会投票システム - プロジェクト設定

## 基本設定

```yaml
プロジェクト名: 社員総会投票システム
開始日: 2026-01-10
技術スタック:
  frontend: React 18 + TypeScript 5 + MUI v6 + Vite 5
  backend: Vercel Functions (Node.js)
  database: Neon (PostgreSQL) + Prisma
  storage: Cloudinary
```

## 開発環境

```yaml
ポート設定:
  frontend: 3248
  backend: Express Server (ローカル: 3002)

環境変数:
  設定ファイル: .env.local（ルートディレクトリ）
  必須項目:
    - DATABASE_URL (Neon接続文字列)
    - CLOUDINARY_CLOUD_NAME
    - CLOUDINARY_API_KEY
    - CLOUDINARY_API_SECRET
```

## テスト認証情報

```yaml
認証: なし（公開ページ）

外部サービス:
  Neon: 開発用プロジェクトを作成
  Cloudinary: 開発用アカウントを使用
```

## コーディング規約【厳守】

### ①命名規則（snake_case / camelCase 分離）

```yaml
【絶対ルール】DBはsnake_case、プログラムはcamelCase。混在禁止。

データベース（snake_case）:
  - テーブル名: 複数形 (例: departments, votes, event_configs)
  - カラム名: snake_case (例: department_id, created_at, image_url)

プログラム（camelCase）:
  - 変数: camelCase (例: departmentId, createdAt, imageUrl)
  - 関数: camelCase (例: getDepartments, submitVote)
  - 定数: UPPER_SNAKE_CASE (例: API_BASE_URL)
  - 型/インターフェース: PascalCase単数形 (例: Department, Vote)
  - 配列変数: camelCase複数形 (例: departments, votes)

ファイル名:
  - コンポーネント: PascalCase.tsx (例: VoteCard.tsx)
  - ユーティリティ: camelCase.ts (例: fingerprint.ts)
  - API: route.ts (Vercel規約)

Prismaでの変換:
  - @map() でDB側snake_case、コード側camelCaseを対応付け
```

### ②コンポーネント再利用の原則

```yaml
【絶対ルール】一度作ったコンポーネントは必ず使い回す

原則:
  - 同じUIパターンは1つのコンポーネントにまとめる
  - 1箇所変更で全体に反映される設計にする
  - コピペで類似コンポーネントを作らない

例:
  - VoteCard: 部署カード表示（全部署で共通使用）
  - ResultBar: 結果の棒グラフ（全部署で共通使用）
```

### ③実データ主義（ハードコード・ダミー禁止）

```yaml
【絶対ルール】ハードコード禁止、モックデータ禁止

禁止事項:
  - 固定値の直接記述（部署名、URL等）
  - ダミーデータでの実装
  - テスト用の仮データ埋め込み

必須事項:
  - 全データはDBから動的に取得
  - 設定値は環境変数から取得
  - 部署データもDBのdepartmentsテーブルから取得
```

### ④環境認識

```yaml
【絶対ルール】環境を明確に区別する

環境変数:
  - NODE_ENV: development / staging / production
  - NEXT_PUBLIC_ENV: 環境表示用（フロントエンド）

実装:
  - 開発環境では環境名を画面に表示
  - 本番以外ではデバッグ情報を出力可能に
```

### ⑤環境変数の変更禁止

```yaml
【絶対ルール】環境変数を勝手に変更しない

手順:
  1. 変更が必要な場合は事前に報告
  2. 理由と影響範囲を説明
  3. 許可を得てから変更
```

### コード品質

```yaml
必須ルール:
  - TypeScript: strictモード有効
  - 未使用の変数/import禁止
  - console.log本番環境禁止
  - エラーハンドリング必須
  - 関数行数: 100行以下
  - ファイル行数: 700行以下
  - 複雑度(McCabe): 10以下
  - 行長: 120文字

フォーマット:
  - インデント: スペース2つ
  - セミコロン: あり
  - クォート: シングル
```

---

## 修正時の必須ルール【厳守】

```yaml
【絶対ルール】問題を見つけても、いきなり修正しない

手順:
  1. 何が問題かを説明
  2. 修正方法の提案
  3. その修正により、どこにどのように影響するかを報告
  4. 許可をもらってから修正開始

禁止事項:
  - 勝手に修正を始めること
  - 報告なしでコードを変更すること
```

---

## データ形式統一ルール【厳守】

```yaml
【統一ルール】単数形・複数形の使い分け

DBテーブル名: 複数形 (departments, votes, event_configs)
DBカラム名: snake_case単数形 (department_id, vote_count)
型定義: PascalCase単数形 (Department, Vote, EventConfig)
配列変数: camelCase複数形 (departments, votes)
単一変数: camelCase単数形 (department, vote)

【対策】
- 一度決めたルールを守る
- 新規作成時は既存のものと合わせる
```

## プロジェクト固有ルール

### APIエンドポイント

```yaml
エンドポイント:
  - GET /api/departments: 部署一覧取得
  - POST /api/vote: 投票送信
  - GET /api/results: 投票結果取得
  - GET /api/health: ヘルスチェック
```

### 型定義

```yaml
配置:
  frontend: src/types/index.ts
  backend: api/types/index.ts (または共有)

同期ルール:
  - 両ファイルは常に同一内容を保つ
  - 片方を更新したら即座にもう片方も更新
```

### 部署データ

```yaml
初期データ（5部署）:
  1: コンシューマーカンパニー
  2: コーポレートセールスカンパニー
  3: SSDカンパニー
  4: BBC
  5: Unneon

変更方法: DB直接編集（管理画面なし）
```

## ディレクトリ構成

```
投票システム/
├── docs/
│   ├── requirements.md      # 要件定義書
│   └── SCOPE_PROGRESS.md    # 進捗管理表
├── src/
│   ├── components/          # Reactコンポーネント
│   ├── pages/               # ページコンポーネント
│   ├── types/               # 型定義
│   └── utils/               # ユーティリティ
├── api/
│   ├── departments.ts       # 部署一覧API
│   ├── vote.ts              # 投票API
│   ├── results.ts           # 結果API
│   └── health.ts            # ヘルスチェック
├── prisma/
│   └── schema.prisma        # DBスキーマ
├── CLAUDE.md                # このファイル
├── eslint.config.js         # ESLint設定
├── .prettierrc              # Prettier設定
└── .env.local               # 環境変数（gitignore）
```

## 最新技術情報（知識カットオフ対応）

```yaml
注意点:
  - Vercel Functions: 10秒タイムアウトのためSSE不可、ポーリングで代替
  - FingerprintJS: 無料版（@fingerprintjs/fingerprintjs）で十分
  - Neon: 非アクティブ時自動サスペンド（コールドスタート数秒）
```
