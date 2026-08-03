import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ensureSeed } from './data/storage.js'
import BottomNav from './components/BottomNav.jsx'
import Vendas from './pages/Vendas.jsx'
import NovaVenda from './pages/NovaVenda.jsx'
import Produtos from './pages/Produtos.jsx'
import Custos from './pages/Custos.jsx'

export default function App() {
  useEffect(() => {
    ensureSeed()
  }, [])

  return (
    <div className="app-shell flex flex-col">
      <div className="flex-1 pb-28">
        <Routes>
          <Route path="/" element={<Vendas />} />
          <Route path="/nova" element={<NovaVenda />} />
          <Route path="/editar/:id" element={<NovaVenda />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/custos" element={<Custos />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
