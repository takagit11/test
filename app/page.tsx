export default function HomePage() {
  return (
    <section className="grid two">
      <div className="card">
        <h1>最小の予約システムデモ</h1>
        <p>
          Next.js (App Router) + Supabase を想定した予約フローを体験できます。
        </p>
        <div className="badge">店舗ページ</div>
        <p>
          <a href="/shop/demo">/shop/demo</a> にアクセスして枠を選び、予約を作成します。
        </p>
      </div>
      <div className="card">
        <h2>管理ページ</h2>
        <p>日付別の予約一覧を確認できます。</p>
        <div className="badge">/admin</div>
      </div>
    </section>
  );
}
