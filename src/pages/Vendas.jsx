import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Pencil, CalendarDays } from 'lucide-react'
import Header from '../components/Header.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { getOrders, deleteOrder, toggleField } from '../data/storage.js'

function formatMoney(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function Vendas() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('todas')
  const navigate = useNavigate()

  function reload() {
    setOrders(getOrders())
  }

  useEffect(() => {
    reload()
  }, [])

  function handleToggle(id, field) {
    toggleField(id, field)
    reload()
  }

  function handleDelete(id) {
    if (confirm('Excluir esta encomenda?')) {
      deleteOrder(id)
      reload()
    }
  }

  const filtered = orders.filter((o) => {
    if (filter === 'todas') return true
    if (filter === 'pendentes') return !o.paid || !o.delivered
    if (filter === 'pagas') return o.paid
    if (filter === 'entregar') return !o.delivered
    return true
  })

  const totalPendente = orders.filter((o) => !o.paid).reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <Header title="Suas Vendas" subtitle="Encomendas de feijão e café" />

      <div className="px-5 -mt-3 relative z-10">
        <div className="bg-kraft-card stitch-border rounded-2xl px-4 py-3 shadow-card flex items-center justify-between">
          <div>
            <p className="text-[11px] text-torrado/60 uppercase tracking-wide font-medium">A receber</p>
            <p className="font-mono text-lg font-semibold text-vermelho">{formatMoney(totalPendente)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-torrado/60 uppercase tracking-wide font-medium">Encomendas</p>
            <p className="font-mono text-lg font-semibold text-torrado">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto pb-1">
        {[
          ['todas', 'Todas'],
          ['pendentes', 'Pendentes'],
          ['entregar', 'A entregar'],
          ['pagas', 'Pagas'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === key
                ? 'bg-torrado text-kraft border-torrado'
                : 'bg-transparent text-torrado/60 border-torrado/25'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-torrado/50">
            <p className="font-display text-lg">Nenhuma encomenda por aqui</p>
            <p className="text-sm mt-1">Toque no + para lançar uma nova venda.</p>
          </div>
        )}

        {filtered.map((order) => (
          <div key={order.id} className="bg-kraft-card stitch-border rounded-2xl p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-lg text-torrado truncate">{order.client}</h3>
                <div className="flex items-center gap-1 text-xs text-torrado/55 mt-0.5">
                  <CalendarDays size={13} />
                  <span>Pagamento: {formatDate(order.paymentDate)}</span>
                </div>
              </div>
              <p className="font-mono text-base font-semibold text-torrado shrink-0">
                {formatMoney(order.total)}
              </p>
            </div>

            <div className="mt-3 space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-torrado/75">
                  <span>
                    {item.productName} · {item.qty}kg
                  </span>
                  <span className="font-mono">{formatMoney(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <StatusPill
                  active={order.delivered}
                  onClick={() => handleToggle(order.id, 'delivered')}
                  labelOn="Entregue"
                  labelOff="Entregar"
                  colorOn="dourado"
                />
                <StatusPill
                  active={order.paid}
                  onClick={() => handleToggle(order.id, 'paid')}
                  labelOn="Pago"
                  labelOff="Pendente"
                  colorOn="plantacao"
                />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(`/editar/${order.id}`)}
                  className="p-2 text-torrado/50 hover:text-torrado"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="p-2 text-vermelho/60 hover:text-vermelho"
                  aria-label="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
