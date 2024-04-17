import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Factura.module.css'
import { Loading } from '../../components';

 const Factura = () => {
  const [factura, setFactura] = useState([])
  const [id, setId] = useState(0)
  const [no_serie, setNo_serie] = useState(0)
  const [no_factura, setNo_factura] = useState(0)
  const [fecha, setFecha] = useState('')
  const [nombre_del_cliente, setNombre_del_cliente] = useState('')
  const [NIT, setNIT] = useState(0)
  const [dirección, setDirección] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [productos, setProductos] = useState('')
  const [precio, setPrecio] = useState(0)
  const [descuento, setDescuento] = useState(0)
  const [envio, setEnvio] = useState(0)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)


  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const facturaSeguros = factura ?? [];
  const currentData = facturaSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(facturaSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};
  
  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Factura')
      .then(response => {
        setOrdenDeCompra(response.data.response);
        setId(0)
        setNo_serie(0)
        setNo_factura(0)
        setFecha('')
        setNombre_del_cliente('')
        setNIT(0)
        setDirección('')
        setCantidad(0)
        setProductos('')
        setPrecio(0)
        setDescuento(0)
        setEnvio(0)
        setTotal(0)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_factura", {
        no_serie, 
        no_factura, 
        fecha, 
        nombre_del_cliente,
        NIT,
        dirección,
        cantidad,
        productos,
        precio,
        descuento,
        envio,
        total
      }).then(() => {
        fetchData()
        setNo_serie(0)
        setNo_factura(0)
        setFecha('')
        setNombre_del_cliente('')
        setNIT(0)
        setDirección('')
        setCantidad(0)
        setProductos('')
        setPrecio(0)
        setDescuento(0)
        setEnvio(0)
        setTotal(0)
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_factura/${id}`, {
        no_serie, 
        no_factura, 
        fecha, 
        nombre_del_cliente,
        NIT,
        dirección,
        cantidad,
        productos,
        precio,
        descuento,
        envio,
        total
      }).then(() => {
        fetchData()
        setNo_serie(0)
        setNo_factura(0)
        setFecha('')
        setNombre_del_cliente('')
        setNIT(0)
        setDirección('')
        setCantidad(0)
        setProductos('')
        setPrecio(0)
        setDescuento(0)
        setEnvio(0)
        setTotal(0)
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_factura/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Factura'
  
    axios.get(url)
      .then((res) => {
        setOrdenDeCompra(res.data.response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }

  const formatDate = (date) => {
    // Assuming date._Date__month is zero-indexed
    const formattedDate = `${date._Date__day}/${date._Date__month + 1}/${date._Date__year}`;
    return formattedDate;
  }

  const renderTable = () => {
    if (loading) {
      console.log("info", ordenDeCompra)
      return (
        <div className={centeredDiv}>
          <Loading />
        </div>
      )
    }
    switch (selectedOption) {
      case 'verUsuarios':
        return (
          <div>
            <div className='col lg-6 mt-5'>
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir Factura:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={no_serie} onChange={(e) => setNo_serie(e.target.value)} type="number" 
                      placeholder='No. serie' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={no_factura} onChange={(e) => setNo_factura(e.target.value)} type="number" placeholder='No. factura' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={fecha} onChange={(e) => setFecha(e.target.value)} type="date" placeholder='Fecha' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre_del_cliente} onChange={(e) => setNombre_del_cliente(e.target.value)} type="text" placeholder='Nombre del cliente' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={NIT} onChange={(e) => setNIT(e.target.value)} type="number" placeholder='NIT' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={dirección} onChange={(e) => setDirección(e.target.value)} type="text" placeholder='Dirección' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={cantidad} onChange={(e) => setCantidad(e.target.value)} type="number" placeholder='Cantidad' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={productos} onChange={(e) => setProductos(e.target.value)} type="text" placeholder='Productos' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" placeholder='Precio' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={descuento} onChange={(e) => setDescuento(e.target.value)} type="number" placeholder='Descuento' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={envio} onChange={(e) => setEnvio(e.target.value)} type="number" placeholder='Envio' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={total} onChange={(e) => setTotal(e.target.value)} placeholder='Total' type='number'
                    />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <div className={buttonContainer}>
                      <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"> Enviar  
                      <i className="material-icons right"> send</i>
                      </button>
                    </div>
                </div>

              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>No_serie</th>
                <th>No_factura</th>
                <th>Fecha</th>
                <th>Nombre_del_cliente</th>
                <th>NIT</th>
                <th>Dirección</th>
                <th>Cantidad</th>
                <th>Productos</th>
                <th>Precio</th>
                <th>Envio</th>
                <th>Total</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td>{rest.no_serie}</td>
                        <td>{rest.no_factura}</td>
                        <td>{formatDate(rest.fecha)}</td>
                        <td>{rest.nombre_del_cliente}</td>
                        <td>{rest.NIT}</td>
                        <td>{rest.dirección}</td>
                        <td>{rest.cantidad}</td>
                        <td>{rest.productos}</td>
                        <td>{rest.precio}</td>
                        <td>{rest.envio}</td>
                        <td>{rest.total}</td>
                        <td>
                          <button onClick={() => submit()} className={editButton} type="submit" name="action">
                            <i className="material-icons ">edit</i>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => deleteData(rest.id)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
                            <i className="material-icons ">delete</i>
                          </button>
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0} className="btn btn-primary">
              Ir al inicio
            </button>
            <button onClick={prevPage} disabled={currentPage === 0} className="btn btn-primary">
              Anterior
            </button>
            <span style={{ margin: '0 15px' }}>
              Página {currentPage + 1} de {pageCount}
            </span>
            <button onClick={nextPage} disabled={currentPage + 1 >= pageCount} className="btn btn-primary">
              Siguiente
            </button>
            <button onClick={() => setCurrentPage(pageCount - 1)} disabled={currentPage + 1 >= pageCount} className="btn btn-primary">
              Ir al final
            </button>
          </div>
        </div>
        )
      default:
        return null
    }
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Factura