// Camada de persistência 100% local, usando o localStorage do navegador.
// Nada sai do celular: os dados ficam salvos ali até você limpar o app ou o cache.

const KEYS = {
  products: 'toninho_products',
  orders: 'toninho_orders',
  periods: 'toninho_periods',
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const DEFAULT_PRODUCTS = [
  { id: uid(), name: 'Feijão Preto', unit: 'kg', costPrice: 6.5, salePrice: 9.0 },
  { id: uid(), name: 'Feijão Vermelho', unit: 'kg', costPrice: 7.0, salePrice: 9.5 },
  { id: uid(), name: 'Café', unit: 'kg', costPrice: 18.0, salePrice: 25.0 },
]

export function ensureSeed() {
  const products = read(KEYS.products, null)
  if (!products) {
    write(KEYS.products, DEFAULT_PRODUCTS)
  }
  const orders = read(KEYS.orders, null)
  if (!orders) {
    write(KEYS.orders, [])
  }
  const periods = read(KEYS.periods, null)
  if (!periods) {
    write(KEYS.periods, [])
  }
}

// ---------- Produtos ----------

export function getProducts() {
  return read(KEYS.products, [])
}

export function saveProduct(product) {
  const products = getProducts()
  if (product.id) {
    const idx = products.findIndex((p) => p.id === product.id)
    if (idx >= 0) products[idx] = product
  } else {
    product.id = uid()
    products.push(product)
  }
  write(KEYS.products, products)
  return product
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id)
  write(KEYS.products, products)
}

// ---------- Encomendas / Vendas ----------

export function getOrders() {
  return read(KEYS.orders, []).sort((a, b) => b.createdAt - a.createdAt)
}

export function saveOrder(order) {
  const orders = read(KEYS.orders, [])
  if (order.id) {
    const idx = orders.findIndex((o) => o.id === order.id)
    if (idx >= 0) orders[idx] = order
  } else {
    order.id = uid()
    order.createdAt = Date.now()
    orders.push(order)
  }
  write(KEYS.orders, orders)
  return order
}

export function deleteOrder(id) {
  const orders = read(KEYS.orders, []).filter((o) => o.id !== id)
  write(KEYS.orders, orders)
}

export function toggleField(id, field) {
  const orders = read(KEYS.orders, [])
  const idx = orders.findIndex((o) => o.id === id)
  if (idx >= 0) {
    orders[idx][field] = !orders[idx][field]
    write(KEYS.orders, orders)
  }
  return orders
}

// ---------- Períodos de custo ----------
// Cada vez que o estoque acaba e você compra de novo (às vezes por um preço
// diferente), você abre um "período" novo com a data e o custo/kg de cada
// alimento a partir dali. O cálculo de lucro usa o período certo pra cada
// venda, de acordo com a data em que ela foi lançada.

export function getPeriods() {
  return read(KEYS.periods, []).sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function addPeriod(period) {
  const periods = read(KEYS.periods, [])
  period.id = uid()
  period.createdAt = Date.now()
  periods.push(period)
  write(KEYS.periods, periods)
  return period
}

export function deletePeriod(id) {
  const periods = read(KEYS.periods, []).filter((p) => p.id !== id)
  write(KEYS.periods, periods)
}

// Retorna o custo/kg de um produto válido para uma data específica (formato
// 'YYYY-MM-DD'), olhando o período mais recente que já tinha começado
// naquela data. Se nenhum período cobrir a data, usa o custo cadastrado
// no produto como padrão.
export function costPriceOnDate(productId, dateStr, products) {
  const periods = getPeriods()
  let value = null
  for (const period of periods) {
    if (period.startDate <= dateStr && period.costs && period.costs[productId] !== undefined) {
      value = period.costs[productId]
    }
  }
  if (value !== null) return value
  const product = products.find((p) => p.id === productId)
  return product ? product.costPrice : 0
}

export { uid }
