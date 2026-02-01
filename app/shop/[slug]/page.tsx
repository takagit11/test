import BookingClient from "./BookingClient";
import { supabase } from "@/lib/supabase";
import { buildSlots, getNextSevenDays } from "@/lib/slots";

export const dynamic = "force-dynamic";

const dateList = getNextSevenDays();

export default async function ShopPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { date?: string };
}) {
  const { slug } = params;
  const { data: shop, error } = await supabase
    .from("shops")
    .select("id,name,slug")
    .eq("slug", slug)
    .single();

  if (error || !shop) {
    return (
      <div className="card">
        <h1>店舗が見つかりません</h1>
        <p>Supabase に shops テーブルを作成してください。</p>
      </div>
    );
  }

  const selectedDate =
    searchParams?.date && dateList.some((item) => item.value === searchParams.date)
      ? searchParams.date
      : dateList[0]?.value;

  if (!selectedDate) {
    return null;
  }

  const start = new Date(`${selectedDate}T00:00:00`);
  const end = new Date(`${selectedDate}T23:59:59`);
  const { data: reservations } = await supabase
    .from("reservations")
    .select("id,start_at")
    .eq("shop_id", shop.id)
    .gte("start_at", start.toISOString())
    .lte("start_at", end.toISOString());

  const reservedStartAt =
    reservations?.map((item) => new Date(item.start_at).toISOString()) ?? [];

  return (
    <section className="grid">
      <div className="card">
        <span className="badge">{shop.name}</span>
        <h1>{shop.name} の予約</h1>
        <p>直近7日から日付を選び、空き枠を予約してください。</p>
        <div className="date-list">
          {dateList.map((date) => (
            <a
              key={date.value}
              href={`/shop/${shop.slug}?date=${date.value}`}
              className={date.value === selectedDate ? "active" : ""}
            >
              {date.label}
            </a>
          ))}
        </div>
      </div>
      <BookingClient
        shopId={shop.id}
        dateValue={selectedDate}
        slots={buildSlots(selectedDate)}
        reservedStartAt={reservedStartAt}
      />
    </section>
  );
}
