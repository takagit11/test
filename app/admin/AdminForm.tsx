"use client";

import { useFormState } from "react-dom";
import type { AdminState } from "./actions";
import { fetchReservations } from "./actions";
import { formatDate } from "@/lib/slots";

const initialState: AdminState = {};

export default function AdminForm() {
  const [state, formAction] = useFormState(fetchReservations, initialState);

  return (
    <div className="grid">
      <div className="card">
        <h1>管理ページ</h1>
        <p>環境変数 ADMIN_PASSWORD を入力すると予約一覧を確認できます。</p>
        <form action={formAction}>
          <div>
            <label htmlFor="password">パスワード</label>
            <input id="password" name="password" type="password" required />
          </div>
          <div>
            <label htmlFor="date">日付</label>
            <input id="date" name="date" type="date" required />
          </div>
          {state.error && <div className="notice error">{state.error}</div>}
          <button className="primary" type="submit">
            予約を表示
          </button>
        </form>
      </div>
      <div className="card">
        <h2>予約一覧</h2>
        {state.reservations && state.reservations.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>時間</th>
                <th>店舗</th>
                <th>予約者</th>
                <th>連絡先</th>
              </tr>
            </thead>
            <tbody>
              {state.reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{formatDate(reservation.start_at)}</td>
                  <td>{reservation.shop?.name ?? "-"}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            <small>日付を指定すると予約一覧が表示されます。</small>
          </p>
        )}
      </div>
    </div>
  );
}
