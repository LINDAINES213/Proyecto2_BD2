// import React from 'react'
import PropTypes from 'prop-types'
import { sidebar } from './Sidebar.module.css'

// Componente para el menú lateral
const Sidebar = ({ onSelect, cambio, setCambio }) => {
  const menuItems = ['📦 Almacen', '🚚 Proveedores', '📝 Productos', '👷‍♂️ Personal', '💆 Clientes', '🌏 Estadísticas', '👀 Perfiles','📊 Publicidad', '💵 Orden de Compra ⬇️ Por Menor', '💵 Orden de Compra ⬆️ Por Mayor', '🚗 Vehiculos','Factura']
  const menuRelaciones = ['Relacion Brinda Informacion', 'Relacion Promociona Publicidad', 'Relacion Reabastece', 'Relacion Tiene']


  const handleSidebarButtonClick = () => {
    setCambio(!cambio);
  };

  return (
    <div className={sidebar}>
      <button onClick={handleSidebarButtonClick} style={{marginTop: '3vh'}}>
        Relaciones/Nodos
      </button>
      {cambio ? (
      <>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => onSelect(item)}>
            {item}
          </li>
        ))}
      </ul>
      </>
    ) : (
    <>
    <ul>
    {menuRelaciones.map((item, index) => (
      <li key={index} onClick={() => onSelect(item)}>
        {item}
      </li>
    ))}
  </ul>
  </>) }
    </div>
  )
}

// Definir PropTypes para el componente Sidebar
Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

export default Sidebar
