const KEY = "kenori_calm_points";

export function getCalmPoints(): number {
  return Number.parseInt(localStorage.getItem(KEY) || "0", 10);
}

export function incrementCalmPoints(): number {
  const next = getCalmPoints() + 1;
  localStorage.setItem(KEY, String(next));
  window.dispatchEvent(new Event("calmpoints"));
  return next;
}
