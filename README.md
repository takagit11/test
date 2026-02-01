# 最小の予約システム（デモ）

Next.js (App Router) と Supabase を使った最小構成の予約デモ。

## セットアップ

1. Supabase プロジェクトを作成する
2. Supabase の SQL Editor で `/supabase/schema.sql` を実行する
3. 店舗データを追加する

```sql
insert into shops (name, slug) values ('デモ店舗', 'demo');
````

4. `.env.example` を参考に環境変数を設定する

```bash
cp .env.example .env.local
```

5. 依存関係をインストールして開発サーバーを起動する

```bash
npm install
npm run dev
```

* 店舗ページ: `http://localhost:3000/shop/demo`
* 管理ページ: `http://localhost:3000/admin`

## 予約フロー

* 店舗ページで直近7日分の枠を表示する（10:00-18:00 / 30分枠）
* 枠を選んで「名前 / 連絡先」を入力すると予約が確定し、同じ枠は埋まる
* 管理ページでは環境変数 `ADMIN_PASSWORD` を入力すると日付別の予約一覧が表示される

## Vercel へのデプロイ

1. Vercel にリポジトリを接続する
2. プロジェクトの環境変数に `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD` を設定する
3. `supabase/schema.sql` を Supabase 側で適用しておく
4. Vercel でデプロイを実行する
