export default function StatusPill({ active, onClick, labelOn, labelOff, colorOn = 'plantacao' }) {
  const colorMap = {
    plantacao: active ? 'bg-plantacao text-kraft border-plantacao' : '',
    dourado: active ? 'bg-dourado text-torrado border-dourado' : '',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? colorMap[colorOn]
          : 'bg-transparent text-torrado/50 border-torrado/25 border-dashed'
      }`}
    >
      {active ? labelOn : labelOff}
    </button>
  )
}
