export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateOrEmpty(
  isoDate: string | null,
  emptyLabel = "No sessions yet"
): string {
  if (!isoDate) return emptyLabel
  return formatDate(isoDate)
}
