import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2, PlusCircle } from 'lucide-react'
import Header from '../components/Header.jsx'
import { getProducts, getOrders, saveOrder, uid } from '../data/storage.js'

// Pesos "redondos" disponíveis pra venda, em GRAMAS
const WEIGHT_OPTIONS = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000]

function formatWeight(grams) {
  if (grams < 1000) return `${grams}g`
  const kg = grams / 1000
  const kgStr = Number.isInteger(kg) ? String(kg) : kg.toFixed(1).replace('.', ',')
  return `${kgStr}kg`
}

function emptyItem(products) {
  const p = products[0]
  return {
    key: uid(),
    productId: p ? p.id : '',
    qty: WEIGHT_OPTIONS[1], // 500g como padrão
  }
}

export default function NovaVenda() {
  const { id } = useParams()
  const navigate = useNavigate()
  const products = getProducts()

  const [client, setClient] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [items, setItems] = useState([emptyItem(products)])
  const [delivered, setDelivered] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (id) {
      const order = getOrders().find((o) => o.id === id)
      if (order) {
        setClient(order.client)
        setPaymentDate(order.paymentDate)
        setDelivered(order.delivered)
        setPaid(order.paid)
        setItems(
          order.items.map((it) => ({
            key: uid(),
            productId: it.productId,
            // venda antiga guarda qty em kg (float); convertemos pra gramas
            qty: Math.round((it.qty || 0) * 1000),
          }))
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function updateItem(key, field, value) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem(products)])
  }

  function removeItem(key) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.key !== key) : prev))
  }

  function productById(pid) {
    return products.find((p) => p.id === pid)
  }

  // gera a lista de opções do dropdown, garantindo que o valor atual do item
  // sempre apareça (mesmo que seja um peso "antigo" que não é redondo)
  function optionsFor(qty) {
    if (WEIGHT_OPTIONS.includes(qty)) return WEIGHT_OPTIONS
    return [...WEIGHT_OPTIONS, qty].sort((a, b) => a - b)
  }

  const builtItems = items
    .map((it) => {
      const product = productById(it.productId)
      const qtyGrams = it.qty || 0
      const qtyKg = qtyGrams / 1000
      const subtotal = product ? qtyKg * product.salePrice : 0
      return {
        productId: it.productId,
        productName: product ? product.name : '',
        qty: qtyKg,
        unitPrice: product ? product.salePrice : 0,
        subtotal,
      }
    })
    .filter((it) => it.productId && it.qty > 0)

  const total = builtItems.reduce((s, it) => s + it.subtotal, 0)

  function handleSubmit(e) {
    e.preventDefault()
    if (!client.trim()) {
      alert('Informe o nome do cliente.')
      return
    }
    if (builtItems.length === 0) {
      alert('Adicione ao menos um alimento com quantidade.')
      return
    }
    saveOrder({
      id: id || undefined,
      client: client.trim(),
      items: builtItems,
      total,
      paymentDate,
      delivered,
      paid,
    })
    navigate('/')
  }

  if (products.length === 0) {
    return (
      <div>
        <Header title={id ? 'Editar Venda' : 'Nova Venda'} />
        <div className="px-5 mt-8 text-center text-torrado/60">
          <p>Cadastre um produto antes de lançar uma venda.</p>
          <button
            onClick={() => navigate('/produtos')}
            className="mt-4 bg-torrado text-kraft px-4 py-2 rounded-full text-sm font-semibold"
          >
            Ir para Produtos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title={id ? 'Editar Venda' : 'Nova Venda'} subtitle="Lance uma encomenda" />

      <form onSubmit={handleSubmit} className="px-5 mt-5 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
            Cliente
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado placeholder:text-torrado/35"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide">
              Alimentos encomendados
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-dourado-dark text-xs font-semibold"
            >
              <PlusCircle size={15} /> adicionar
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((it) => {
              const product = productById(it.productId)
              const qtyGrams = it.qty || 0
              const qtyKg = qtyGrams / 1000
              return (
                <div key={it.key} className="bg-kraft-card stitch-border rounded-xl p-3">
                  <div className="flex gap-2">
                    <select
                      value={it.productId}
                      onChange={(e) => updateItem(it.key, 'productId', e.target.value)}
                      className="flex-1 bg-transparent border-b border-torrado/20 py-1.5 text-sm text-torrado"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={it.qty}
                      onChange={(e) => updateItem(it.key, 'qty', Number(e.target.value))}
                      className="w-24 bg-transparent border-b border-torrado/20 py-1.5 text-sm text-torrado text-right font-mono"
                    >
                      {optionsFor(it.qty).map((g) => (
                        <option key={g} value={g}>
                          {formatWeight(g)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeItem(it.key)}
                      className="text-vermelho/50 px-1"
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {product && qtyGrams > 0 && (
                    <p className="text-right text-xs font-mono text-torrado/55 mt-1.5">
                      {formatWeight(qtyGrams)} × R$ {product.salePrice.toFixed(2)}/kg ={' '}
                      <span className="text-torrado font-semibold">
                        R$ {(qtyKg * product.salePrice).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
            Dia do pagamento
          </label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado"
          />
        </div>

        <div className="flex gap-3">
          <label className="flex-1 flex items-center gap-2 bg-kraft-card stitch-border rounded-xl px-3 py-3">
            <input
              type="checkbox"
              checked={delivered}
              onChange={(e) => setDelivered(e.target.checked)}
              className="h-4 w-4 accent-dourado"
            />
            <span className="text-sm text-torrado">Já entreguei</span>
          </label>
          <label className="flex-1 flex items-center gap-2 bg-kraft-card stitch-border rounded-xl px-3 py-3">
            <input
              type="checkbox"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
              className="h-4 w-4 accent-plantacao"
            />
            <span className="text-sm text-torrado">Já pagou</span>
          </label>
        </div>

        <div className="bg-torrado text-kraft rounded-2xl px-4 py-3.5 flex items-center justify-between">
          <span className="text-sm text-kraft/70">Total da encomenda</span>
          <span className="font-mono text-xl font-semibold">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-vermelho text-kraft font-semibold py-3.5 rounded-full shadow-stamp active:scale-[0.98] transition-transform"
        >
          {id ? 'Salvar alterações' : 'Lançar venda'}
        </button>
      </form>
    </div>
  )
}
