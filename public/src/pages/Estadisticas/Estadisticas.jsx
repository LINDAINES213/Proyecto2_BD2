import { useState, useEffect } from 'react';
import axios from 'axios';
import { crud, leftAligned, scrollableTable,
  centeredDiv,
 } from './Estadisticas.module.css'
import { Loading } from '../../components';

 const Estadisticas = () => {
  const [estadistica, setEstadistica] = useState([])
  const [selectedOption, setSelectedOption] = useState('ordenDeCompra')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/sumatoria_total_ordenes')
      .then(response => {
        console.log("p",response)
        setEstadistica(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const changeView = (newView) => {
    setSelectedOption(newView);

    if (newView==='ordenDeCompra') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/sumatoria_total_ordenes')
        .then(response => {
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }
    if (newView==='vehiculos') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/vehiculos_por_modelo_anio')
        .then(response => {
          console.log("vehiculos", response)
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }

    if (newView==='productosPorProveedor') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/productos_por_proveedor')
        .then(response => {
          console.log("vehiculos", response)
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }
  }
  


  const renderTable = () => {
    if (loading) {
      return (
        <div className={centeredDiv}>
          <Loading />
        </div>
      )
    }
    switch (selectedOption) {
      case 'ordenDeCompra':
        return (
          <div>     
            <div className={scrollableTable}>
              <table className='table'>
                <thead>
                  <th>Descripcion</th>
                  <th>Sumatoria del total de ventas</th>
                </thead>
                <tbody>
                  <tr >
                    <td className={leftAligned}>Resultado de sumar el total de todas las ordenes de compra.</td>
                    <td>{estadistica.total_ordenes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'vehiculos':
        return (
          <div className={scrollableTable}>
          <table className='table'>
            <thead>
              <th>Modelo del vehiculo</th>
              <th>Cantidad total de vehiculos</th>
            </thead>
            <tbody>
              {console.log(estadistica.vehiculos_por_modelo_anio)}
              {estadistica && estadistica.vehiculos_por_modelo_anio && estadistica.vehiculos_por_modelo_anio.length > 0 &&
                estadistica.vehiculos_por_modelo_anio.map((res, index) => (
                  <tr key={index}>
                    <td >{res.modelo}</td>
                    <td>{res.cantidad}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        );
      case 'productosPorProveedor':
        return (
          <div className={scrollableTable}>
          <table className='table'>
            <thead>
              <th>Proveedor</th>
              <th>Cantidad productos distintos</th>
            </thead>
            <tbody>
              {estadistica && estadistica.productos_proveedores && estadistica.productos_proveedores.length > 0 &&
                estadistica.productos_proveedores.map((res, index) => (
                  <tr key={index}>
                    <td >{res.nombre}</td>
                    <td>{res.cantidad_productos}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        );
      default:
        return null
    }
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button className="btn btn-primary" onClick={() => changeView('ordenDeCompra')}>
          Total ordenes de compra
        </button>
        <button className="btn btn-primary" onClick={() => changeView('vehiculos')}>
          Cantidad de vehiculos por modelo
        </button>
        <button className="btn btn-primary" onClick={() => changeView('productosPorProveedor')}>
          Cantidad de productos por proveedor
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Estadisticas