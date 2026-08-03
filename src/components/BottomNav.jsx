import { NavLink } from 'react-router-dom'
import { ClipboardList, Plus, Package, PiggyBank } from 'lucide-react'

const linkBase =
  'flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-medium transition-colors'

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 inset-x-0 z-30 bg-torrado text-kraft/60 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 rounded-t-[28px] shadow-[0_-4px_16px_rgba(43,27,18,0.25)]">
      <div className="flex items-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${linkBase} ${isActive ? 'text-dourado' : ''}`}
        >
          <ClipboardList size={20} strokeWidth={2} />
          Vendas
        </NavLink>

        <NavLink to="/nova" className="flex-1 flex justify-center">
          {({ isActive }) => (
            <span
              className={`-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-kraft shadow-card transition-colors ${
                isActive ? 'bg-dourado' : 'bg-vermelho'
              }`}
            >
              <Plus size={26} color="#F7EFE1" strokeWidth={2.5} />
            </span>
          )}
        </NavLink>

        <NavLink
          to="/produtos"
          className={({ isActive }) => `${linkBase} ${isActive ? 'text-dourado' : ''}`}
        >
          <Package size={20} strokeWidth={2} />
          Produtos
        </NavLink>

        <NavLink
          to="/custos"
          className={({ isActive }) => `${linkBase} ${isActive ? 'text-dourado' : ''}`}
        >
          <PiggyBank size={20} strokeWidth={2} />
          Custos
        </NavLink>
      </div>
    </nav>
  )
}
