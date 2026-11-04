export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="spinner"
      role="status"
      aria-label="Chargement…"
    />
  )
}
