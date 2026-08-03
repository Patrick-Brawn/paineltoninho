import { useEffect, useState } from 'react'
import { PlusCircle, X, CalendarRange, Trash2 } from 'lucide-react'
import Header from '../components/Header.jsx'
import {
  getProducts,
  getOrders,
  getPeriods,
  addPeriod,
  deletePeriod,
  costPriceOnDate,
} from '../data/storage.js'

function formatMoney(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function todayStr() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function orderDateStr(order) {
  // usa a data em que a venda foi lançada, no formato YYYY-MM-DD
  const d = new Date(order.createdAt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function Custos() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [periods, setPeriods] = useState([])
  const [onlyPaid, setOnlyPaid] = useState(false)
  const [showPeriodForm, setShowPeriodForm] = useState(false)
  const [periodLabel, setPeriodLabel] = useState('')
  const [periodDate, setPeriodDate] = useState(todayStr())
  const [periodCosts, setPeriodCosts] = useState({})

  function reload() {
    const p = getProducts()
    setProducts(p)
    setOrders(getOrders())
    setPeriods(getPeriods())
    return p
  }

  useEffect(() => {
    reload()
  }, [])

  function openPeriodForm() {
    const currentProducts = reload()
    const today = todayStr()
    const prefilled = {}
    currentProducts.forEach((p) => {
      prefilled[p.id] = String(costPriceOnDate(p.id, today, currentProducts))
    })
    setPeriodCosts(prefilled)
    setPeriodLabel('')
    setPeriodDate(today)
    setShowPeriodForm(true)
  }

  function handleSavePeriod(e) {
    e.preventDefault()
    const costs = {}
    for (const p of products) {
      const raw = (periodCosts[p.id] ?? '').toString().replace(',', '.')
      const value = parseFloat(raw)
      if (!isNaN(value)) costs[p.id] = value
    }
    if (Object.keys(costs).length === 0) {
      alert('Informe o custo de ao menos um alimento.')
      return
    }
    addPeriod({
      label: periodLabel.trim() || `Período de ${formatDate(periodDate)}`,
      startDate: periodDate,
      costs,
    })
    setShowPeriodForm(false)
    reload()
  }

  function handleDeletePeriod(id) {
    if (confirm('Excluir este período? As vendas voltam a usar o período anterior (ou o custo padrão do produto).')) {
      deletePeriod(id)
      reload()
    }
  }

  const consideredOrders = onlyPaid ? orders.filter((o) => o.paid) : orders

  // soma kg vendidos, receita e custo (usando o período certo pra cada venda) por produto
  const productStats = products.map((p) => {
    let kg = 0
    let receita = 0
    let custoTotal = 0
    consideredOrders.forEach((o) => {
      const dateStr = orderDateStr(o)
      o.items.forEach((it) => {
        if (it.productId === p.id) {
          kg += it.qty
          receita += it.subtotal
          custoTotal += it.qty * costPriceOnDate(p.id, dateStr, products)
        }
      })
    })
    const lucro = receita - custoTotal
    return { ...p, kg, receita, custoTotal, lucro }
  })

  const totalReceita = productStats.reduce((s, p) => s + p.receita, 0)
  const totalCusto = productStats.reduce((s, p) => s + p.custoTotal, 0)
  const totalLucro = totalReceita - totalCusto

  const periodsDesc = [...periods].reverse()

  return (
    <div>
      <Header title="Custos & Lucro" subtitle="Quanto entrou e quanto sobrou" />

      <div className="px-5 mt-5">
        <label className="flex items-center gap-2 text-sm text-torrado/70 mb-4">
          <input
            type="checkbox"
            checked={onlyPaid}
            onChange={(e) => setOnlyPaid(e.target.checked)}
            className="h-4 w-4 accent-plantacao"
          />
          Considerar apenas vendas já pagas
        </label>

        <div className="bg-torrado text-kraft rounded-2xl p-5 shadow-card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-kraft/60 uppercase tracking-wide font-medium">Receita total</p>
              <p className="font-mono text-xl font-semibold mt-1">{formatMoney(totalReceita)}</p>
            </div>
            <div>
              <p className="text-[11px] text-kraft/60 uppercase tracking-wide font-medium">Custo total</p>
              <p className="font-mono text-xl font-semibold mt-1 text-vermelho-light">
                {formatMoney(totalCusto)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-kraft/15 flex items-center justify-between">
            <p className="text-sm text-kraft/70">Lucro</p>
            <p className="font-mono text-2xl font-bold text-dourado">{formatMoney(totalLucro)}</p>
          </div>
        </div>

        <h2 className="font-display text-lg text-torrado mt-6 mb-3">Por produto</h2>

        <div className="space-y-3">
          {productStats.map((p) => (
            <div key={p.id} className="bg-kraft-card stitch-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-torrado">{p.name}</h3>
                <span className="font-mono text-xs text-torrado/50">{p.kg}kg vendidos</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-kraft rounded-xl py-2">
                  <p className="text-[10px] text-torrado/50 uppercase font-medium">Custo total</p>
                  <p className="font-mono text-sm font-semibold text-torrado">
                    {formatMoney(p.custoTotal)}
                  </p>
                </div>
                <div className="bg-kraft rounded-xl py-2">
                  <p className="text-[10px] text-torrado/50 uppercase font-medium">Receita</p>
                  <p className="font-mono text-sm font-semibold text-torrado">
                    {formatMoney(p.receita)}
                  </p>
                </div>
                <div className="bg-plantacao/10 rounded-xl py-2">
                  <p className="text-[10px] text-plantacao uppercase font-medium">Lucro</p>
                  <p className="font-mono text-sm font-semibold text-plantacao">
                    {formatMoney(p.lucro)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {productStats.length === 0 && (
            <p className="text-center text-torrado/50 py-10">Cadastre produtos para ver os custos.</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-7 mb-3">
          <h2 className="font-display text-lg text-torrado">Períodos de custo</h2>
        </div>
        <p className="text-xs text-torrado/55 -mt-2 mb-3">
          Quando seu estoque acabar e você comprar de novo por um preço diferente, abra um período
          novo. As vendas passam a usar o custo certo automaticamente, de acordo com a data.
        </p>

        <div className="space-y-2.5">
          {periodsDesc.map((period) => (
            <div key={period.id} className="bg-kraft-card stitch-border rounded-2xl p-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 text-torrado">
                  <CalendarRange size={14} className="text-dourado-dark shrink-0" />
                  <div>
                    <p className="font-display text-sm">{period.label}</p>
                    <p className="text-[11px] text-torrado/50 font-mono">
                      desde {formatDate(period.startDate)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePeriod(period.id)}
                  className="p-1.5 text-vermelho/50 hover:text-vermelho shrink-0"
                  aria-label="Excluir período"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(period.costs || {}).map(([pid, value]) => {
                  const prod = products.find((p) => p.id === pid)
                  if (!prod) return null
                  return (
                    <span
                      key={pid}
                      className="text-[11px] font-mono bg-kraft rounded-full px-2.5 py-1 text-torrado/75"
                    >
                      {prod.name}: R$ {Number(value).toFixed(2)}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}

          {periods.length === 0 && (
            <p className="text-center text-torrado/45 text-sm py-6">
              Nenhum período aberto ainda. O custo cadastrado em cada produto está sendo usado.
            </p>
          )}

          <button
            onClick={openPeriodForm}
            disabled={products.length === 0}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-torrado/25 text-torrado/60 rounded-2xl py-3.5 font-semibold disabled:opacity-40"
          >
            <PlusCircle size={18} /> Abrir novo período
          </button>
        </div>
      </div>

      {showPeriodForm && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-torrado/50">
          <div className="app-shell w-full">
            <div className="bg-kraft rounded-t-[28px] px-5 pt-5 pb-8 shadow-card max-h-[85dvh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-torrado">Novo período de custo</h2>
                <button onClick={() => setShowPeriodForm(false)} className="p-1 text-torrado/50">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePeriod} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
                    Nome do período (opcional)
                  </label>
                  <input
                    type="text"
                    value={periodLabel}
                    onChange={(e) => setPeriodLabel(e.target.value)}
                    placeholder="Ex: Compra de agosto"
                    className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado placeholder:text-torrado/35"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
                    A partir de quando
                  </label>
                  <input
                    type="date"
                    value={periodDate}
                    onChange={(e) => setPeriodDate(e.target.value)}
                    className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-2">
                    Novo custo por kg de cada alimento
                  </label>
                  <div className="space-y-2.5">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-kraft-card stitch-border rounded-xl px-4 py-2.5"
                      >
                        <span className="text-sm text-torrado">{p.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-torrado/50 text-sm">R$</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={periodCosts[p.id] ?? ''}
                            onChange={(e) =>
                              setPeriodCosts({ ...periodCosts, [p.id]: e.target.value })
                            }
                            className="w-20 bg-transparent border-b border-torrado/20 py-1 text-sm text-torrado text-right font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-torrado text-kraft font-semibold py-3.5 rounded-full mt-2"
                >
                  Abrir período
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
