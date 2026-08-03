import Logo from './Logo.jsx'

export default function Header({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-20 bg-torrado text-kraft px-5 pt-6 pb-5 rounded-b-[28px] shadow-stamp">
      <div className="flex items-center gap-3">
        <Logo size={46} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.25em] text-dourado uppercase">
            Painel do Toninho
          </p>
          <h1 className="font-display text-2xl leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-kraft/70 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  )
}
