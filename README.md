# 最小の予約システム（デモ）

Next.js (App Router) と Supabase を使った最小構成の予約デモです。

## セットアップ

1. Supabase プロジェクトを作成します。
2. Supabase の SQL Editor で `/supabase/schema.sql` を実行します。
3. 店舗データを追加します。

```sql
insert into shops (name, slug) values ('デモ店舗', 'demo');
```

4. `.env.example` を参考に環境変数を設定します。

```bash
cp .env.example .env.local
```

5. 依存関係をインストールして開発サーバーを起動します。

```bash
npm install
npm run dev
```

- 店舗ページ: `http://localhost:3000/shop/demo`
- 管理ページ: `http://localhost:3000/admin`

## 予約フロー

- 店舗ページで直近7日分の枠を表示します（10:00-18:00 / 30分枠）。
- 枠を選んで「名前 / 連絡先」を入力すると予約が確定し、同じ枠は埋まります。
- 管理ページでは環境変数 `ADMIN_PASSWORD` を入力すると日付別の予約一覧が表示されます。

## Vercel へのデプロイ

1. Vercel にリポジトリを接続します。
2. プロジェクトの環境変数に `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD` を設定します。
3. `supabase/schema.sql` を Supabase 側で適用しておきます。
4. Vercel でデプロイを実行します。

