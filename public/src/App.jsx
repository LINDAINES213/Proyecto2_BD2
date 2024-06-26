import { useState } from 'react'
import './App.css'
import { Proveedores, Productos, Personal, Cliente, Almacen, Publicidad, OrdenDeCompraPorMenor, OrdenDeCompraPorMayor, Vehiculos, Factura, RelacionTiene, Estadisticas, RelacionReabastece, RelacionBrindaInformacion, RelacionPromocionaPublicidad} from './pages'
import { Content, Sidebar } from './components'

// eslint-disable-next-line react/function-component-definition
function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('📦 Almacen')
  const [cambio, setCambio] = useState(true)

  const handleMenuSelect = (item) => {
    setSelectedMenuItem(item)
  }

  return (
    <div className="app">
      <Sidebar onSelect={handleMenuSelect} cambio={cambio} setCambio={setCambio} />
      <Content selectedMenuItem={selectedMenuItem}>
        {cambio ? (
          <>
            {selectedMenuItem === '📦 Almacen' && <Almacen />}
            {selectedMenuItem === '🚚 Proveedores' && <Proveedores />}
            {selectedMenuItem === '📝 Productos' && <Productos />}
            {selectedMenuItem === '👷‍♂️ Personal' && <Personal />}
            {selectedMenuItem === '💆 Clientes' && <Cliente />}
            {selectedMenuItem === '🌏 Estadísticas' && <Estadisticas />}
            {selectedMenuItem === '📊 Publicidad' && <Publicidad />}
            {selectedMenuItem === '💵 Orden de Compra ⬇️ Por Menor' && <OrdenDeCompraPorMenor />}
            {selectedMenuItem === '💵 Orden de Compra ⬆️ Por Mayor' && <OrdenDeCompraPorMayor />}
            {selectedMenuItem === '📄 Factura' && <Factura />}
            {selectedMenuItem === '🚗 Vehiculos' && <Vehiculos />}
            {selectedMenuItem !== '📦 Almacen' &&
              selectedMenuItem !== '🚚 Proveedores' &&
              selectedMenuItem !== '📝 Productos' &&
              selectedMenuItem !== '👷‍♂️ Personal' &&
              selectedMenuItem !== '💆 Clientes' &&
              selectedMenuItem !== '📊 Publicidad' &&
              selectedMenuItem !== '📄 Factura' &&
              selectedMenuItem !== '🚗 Vehiculos' &&
              selectedMenuItem !== '🌏 Estadísticas' &&
              selectedMenuItem !== '💵 Orden de Compra ⬇️ Por Menor' &&
              selectedMenuItem !== '💵 Orden de Compra ⬆️ Por Mayor' &&
              selectedMenuItem !== '👀 Perfiles' && <p>Contenido no definido.</p>}
          </>
        ) : (
          <>
            {selectedMenuItem === '📝 Relacion Tiene' && <RelacionTiene />}
            {selectedMenuItem === '📝 Relacion Brinda Informacion' && <RelacionBrindaInformacion />}
            {selectedMenuItem === '📝 Relacion Promociona Publicidad' && <RelacionPromocionaPublicidad />}
            {selectedMenuItem === '📝 Relacion Reabastece' && <RelacionReabastece />}
            {selectedMenuItem !== '📝 Relacion Tiene' &&
              selectedMenuItem !== '📝 Relacion Brinda Informacion' &&
              selectedMenuItem !== '📝 Relacion Promociona Publicidad' &&
              selectedMenuItem !== '📝 Relacion Reabastece' &&
              selectedMenuItem !== '📝 Relacion Tiene' && <p>Contenido no definido.</p>}
          </>
        )}
      </Content>
    </div>
  );
}


export default App
