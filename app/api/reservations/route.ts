import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    shopId?: string;
    startAt?: string;
    name?: string;
    contact?: string;
  };

  const name = body.name?.trim();
  const contact = body.contact?.trim();

  if (!body.shopId || !body.startAt || !name || !contact) {
    return NextResponse.json(
      { ok: false, message: "必須項目が不足しています。" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("reservations").insert({
    shop_id: body.shopId,
    start_at: body.startAt,
    name,
    contact
  });

  if (error) {
    const message =
      error.code === "23505"
        ? "この時間枠はすでに予約されています。"
        : "予約の作成に失敗しました。";
    return NextResponse.json({ ok: false, message }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
