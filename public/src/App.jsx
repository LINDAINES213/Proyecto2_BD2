import { useState } from 'react'
import './App.css'
import { Proveedores, Productos, Personal, Cliente, Almacen } from './pages'
import { Content, Sidebar } from './components'

// eslint-disable-next-line react/function-component-definition
function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Inicio')

  const handleMenuSelect = (item) => {
    setSelectedMenuItem(item)
  }

  return (
    <div className="app">
      <Sidebar onSelect={handleMenuSelect} />
      <Content selectedMenuItem={selectedMenuItem}>
        {selectedMenuItem === 'Inicio' && <p>Contenido relacionado con Inicio.</p>}
        {selectedMenuItem === 'Proveedores' && <Proveedores /> }
        {selectedMenuItem === 'Productos' && <Productos /> }
        {selectedMenuItem === 'Personal' && <Personal /> }
        {selectedMenuItem === 'Clientes' && <Cliente /> }
        {selectedMenuItem === 'Almacen' && <Almacen /> }
        {selectedMenuItem !== 'Inicio' &&
         selectedMenuItem !== 'Proveedores' &&
         selectedMenuItem !== 'Productos' &&
         selectedMenuItem !== 'Personal' &&
         selectedMenuItem !== 'Clientes' &&
         selectedMenuItem !== 'Almacen' && 
         selectedMenuItem !== 'Estadísticas' && 
         selectedMenuItem !== 'Perfiles' && <p>Contenido no definido.</p>}
      </Content>
    </div>
  )
}

export default App
