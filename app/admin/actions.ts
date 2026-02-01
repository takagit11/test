"use server";

import { supabase } from "@/lib/supabase";

export type ReservationItem = {
  id: string;
  start_at: string;
  name: string;
  contact: string;
  shop: { name: string; slug: string } | null;
};

export type AdminState = {
  error?: string;
  date?: string;
  reservations?: ReservationItem[];
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

  return { reservations: data ?? [], date };
}
