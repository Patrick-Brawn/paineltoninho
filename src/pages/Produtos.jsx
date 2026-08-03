import { useEffect, useState } from 'react'
import { Pencil, Trash2, PlusCircle, X } from 'lucide-react'
import Header from '../components/Header.jsx'
import { getProducts, saveProduct, deleteProduct } from '../data/storage.js'

const emptyForm = { id: null, name: '', costPrice: '', salePrice: '' }

export default function Produtos() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  function reload() {
    setProducts(getProducts())
  }

  useEffect(() => {
    reload()
  }, [])

  function openNew() {
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(p) {
    setForm({
      id: p.id,
      name: p.name,
      costPrice: String(p.costPrice),
      salePrice: String(p.salePrice),
    })
    setShowForm(true)
  }

  function handleDelete(id) {
    if (confirm('Excluir este produto?')) {
      deleteProduct(id)
      reload()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return alert('Informe o nome do produto.')
    const cost = parseFloat(form.costPrice.toString().replace(',', '.'))
    const sale = parseFloat(form.salePrice.toString().replace(',', '.'))
    if (isNaN(cost) || isNaN(sale)) return alert('Informe os valores de custo e venda.')

    saveProduct({
      id: form.id,
      name: form.name.trim(),
      unit: 'kg',
      costPrice: cost,
      salePrice: sale,
    })
    setShowForm(false)
    reload()
  }

  return (
    <div>
      <Header title="Produtos" subtitle="O que você vende, por kg" />

      <div className="px-5 mt-5 space-y-3">
        {products.map((p) => {
          const margem = p.salePrice - p.costPrice
          return (
            <div key={p.id} className="bg-kraft-card stitch-border rounded-2xl p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-torrado">{p.name}</h3>
                  <p className="text-xs text-torrado/50 mt-0.5">por kg</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2 text-torrado/50 hover:text-torrado">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-vermelho/60 hover:text-vermelho"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-kraft rounded-xl py-2">
                  <p className="text-[10px] text-torrado/50 uppercase font-medium">Custo</p>
                  <p className="font-mono text-sm font-semibold text-torrado">
                    R$ {p.costPrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-kraft rounded-xl py-2">
                  <p className="text-[10px] text-torrado/50 uppercase font-medium">Venda</p>
                  <p className="font-mono text-sm font-semibold text-torrado">
                    R$ {p.salePrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-plantacao/10 rounded-xl py-2">
                  <p className="text-[10px] text-plantacao uppercase font-medium">Lucro/kg</p>
                  <p className="font-mono text-sm font-semibold text-plantacao">
                    R$ {margem.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {products.length === 0 && (
          <div className="text-center py-16 text-torrado/50">
            <p className="font-display text-lg">Nenhum produto cadastrado</p>
          </div>
        )}

        <button
          onClick={openNew}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-torrado/25 text-torrado/60 rounded-2xl py-3.5 font-semibold"
        >
          <PlusCircle size={18} /> Novo produto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-torrado/50">
          <div className="app-shell w-full">
            <div className="bg-kraft rounded-t-[28px] px-5 pt-5 pb-8 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-torrado">
                  {form.id ? 'Editar produto' : 'Novo produto'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 text-torrado/50">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
                    Nome do produto
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Feijão Carioca"
                    className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado placeholder:text-torrado/35"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
                      Custo por kg
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.costPrice}
                      onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                      placeholder="0,00"
                      className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-torrado/60 uppercase tracking-wide mb-1.5">
                      Venda por kg
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.salePrice}
                      onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                      placeholder="0,00"
                      className="w-full bg-kraft-card stitch-border rounded-xl px-4 py-3 text-torrado font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-torrado text-kraft font-semibold py-3.5 rounded-full mt-2"
                >
                  Salvar produto
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
