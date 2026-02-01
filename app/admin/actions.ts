"use server";

import { supabase } from "@/lib/supabase";

type Shop = { name: string; slug: string };

export type ReservationItem = {
  id: string;
  start_at: string;
  name: string;
  contact: string;
  shop: Shop | null; // 画面側は「単体 or null」で扱う
};

export type AdminState = {
  error?: string;
  date?: string;
  reservations?: ReservationItem[];
};

// Supabaseのネスト取得は、関係の推論によって shop が「配列」で返ることがあります。
// その場合でもビルドが通るように、ここで吸収します。
type ReservationRowFromDb = {
  id: string;
  start_at: string;
  name: string;
  contact: string;
  shop: Shop | Shop[] | null;
};

export async function fetchReservations(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const password = String(formData.get("password") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!password || !date) {
    return { error: "パスワードと日付を入力してください。" };
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "パスワードが一致しません。" };
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  const { data, error } = await supabase
    .from("reservations")
    .select("id,start_at,name,contact,shop:shops(name,slug)")
    .gte("start_at", start.toISOString())
    .lte("start_at", end.toISOString())
    .order("start_at", { ascending: true });

  if (error) {
    return { error: "予約データの取得に失敗しました。" };
  }

  const rows = (data ?? []) as unknown as ReservationRowFromDb[];

  // shop が配列で返ってきても、先頭1件を取って単体に正規化する
  const reservations: ReservationItem[] = rows.map((r) => ({
    id: r.id,
    start_at: r.start_at,
    name: r.name,
    contact: r.contact,
    shop: Array.isArray(r.shop) ? (r.shop[0] ?? null) : (r.shop ?? null),
  }));

  return { reservations, date };
}
