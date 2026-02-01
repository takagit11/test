"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Slot } from "@/lib/slots";

export type BookingClientProps = {
  shopId: string;
  dateValue: string;
  slots: Slot[];
  reservedStartAt: string[];
};

type ReservationResponse =
  | { ok: true }
  | { ok: false; message: string };

export default function BookingClient({
  shopId,
  dateValue,
  slots,
  reservedStartAt
}: BookingClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const reservedSet = useMemo(() => new Set(reservedStartAt), [reservedStartAt]);
  const selectedLabel = selected
    ? new Date(selected).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "未選択";

  const handleSubmit = async () => {
    if (!selected) {
      setMessage("予約する時間を選択してください。");
      return;
    }
    if (!name.trim() || !contact.trim()) {
      setMessage("お名前と連絡先を入力してください。");
      return;
    }
    setMessage(null);
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId,
        startAt: selected,
        name: name.trim(),
        contact: contact.trim()
      })
    });
    const data = (await response.json()) as ReservationResponse;
    if (!data.ok) {
      setMessage(data.message);
      return;
    }
    setName("");
    setContact("");
    setSelected(null);
    setMessage("予約が完了しました！");
    startTransition(() => router.refresh());
  };

  return (
    <div className="grid two">
      <div className="card">
        <h2>空き枠一覧</h2>
        <p>
          <small>営業時間 10:00-18:00 / 30分枠</small>
        </p>
        <div className="slot-list">
          {slots.map((slot) => {
            const isReserved = reservedSet.has(slot.startAt);
            return (
              <div key={slot.startAt} className="slot">
                <span>{slot.label}</span>
                <button
                  type="button"
                  onClick={() => setSelected(slot.startAt)}
                  disabled={isReserved}
                >
                  {isReserved ? "予約済" : "選択"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h2>予約フォーム</h2>
        <p>
          <small>選択日: {dateValue}</small>
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label htmlFor="name">お名前</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="山田 太郎"
            />
          </div>
          <div>
            <label htmlFor="contact">連絡先</label>
            <input
              id="contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label>予約時間</label>
            <input value={selectedLabel} readOnly />
          </div>
          {message && (
            <div className={`notice ${message.includes("完了") ? "" : "error"}`}>
              {message}
            </div>
          )}
          <button className="primary" type="submit" disabled={isPending}>
            予約する
          </button>
        </form>
      </div>
    </div>
  );
}
