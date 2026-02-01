export type Slot = {
  label: string;
  startAt: string;
};

export function getNextSevenDays(): { label: string; value: string }[] {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const value = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      weekday: "short"
    });
    return { label, value };
  });
}

export function buildSlots(dateValue: string): Slot[] {
  const slots: Slot[] = [];
  for (let hour = 10; hour < 18; hour += 1) {
    for (const minute of [0, 30]) {
      const date = new Date(`${dateValue}T${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}:00`);
      if (date.getHours() === 18) {
        continue;
      }
      const label = `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
      slots.push({ label, startAt: date.toISOString() });
    }
  }
  return slots;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
