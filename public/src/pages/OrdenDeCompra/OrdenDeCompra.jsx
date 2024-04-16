import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './OrdenDeCompra.module.css'
import { Loading } from '../../components';

 const OrdenDeCompra = () => {
  const [ordenDeCompra, setOrdenDeCompra] = useState([])
  const [id, setId] = useState(0)
  const [envio, setEnvio] = useState('')
  const [fecha, setFecha] = useState('')
  const [id_cliente, setIDCliente] = useState('')
  const [codigo_producto, setCodigo_producto] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [metodo_pago, setMetodo_pago] = useState('')
  const [total, setTotal] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)


  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const productosSeguros = ordenDeCompra ?? [];
  const currentData = productosSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(productosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};
  
  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/OrdenDeCompra')
      .then(response => {
        setOrdenDeCompra(response.data.response);
        setId(0)
        setEnvio('')
        setFecha('')
        setTotal('')
        setIDCliente('')
        setCodigo_producto('')
        setCantidad('')
        setMetodo_pago('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    const PorMayor = "/create_vehiculo_transporte_ligero"
    const PorMenor = "/create_vehiculo_transporte_pesado"

    if (id === 0) {
      axios.post(url), {
        envio, 
        fecha, 
        total, 
        id_cliente,
        codigo_producto,
        cantidad,
        metodo_pago
      }).then(() => {
        fetchData()
        setEnvio('')
        setFecha('')
        setTotal('')
        setIDCliente('')
        setCodigo_producto('')
        setCantidad('')
        setMetodo_pago('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_proveedor/${id}`, {
        envio, 
        fecha, 
        total, 
        id_cliente,
        codigo_producto,
        cantidad,
        metodo_pago
      }).then(() => {
        fetchData()
        setEnvio('')
        setFecha('')
        setTotal('')
        setIDCliente('')
        setCodigo_producto('')
        setCantidad('')
        setMetodo_pago('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_proveedor/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/OrdenDeCompra'
  
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir proveedor:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={envio} onChange={(e) => setEnvio(e.target.value)} type="number" 
                      placeholder='Envio' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={fecha} onChange={(e) => setFecha(e.target.value)} type="date" placeholder='Fecha de emision' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={codigo_producto} onChange={(e) => setCodigo_producto(e.target.value)} placeholder='Codigo de producto' type='text'
                    />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                      <input className={inputText} value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Email' type='email' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={metodo_pago} onChange={(e) => setMetodo_pago(e.target.value)} type="text" placeholder='Metodo de pago' />
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
                <th>Envio</th>
                <th>Fecha</th>
                <th>ID Cliente</th>
                <th>Codigo Producto</th>
                <th>Cantidad</th>
                <th>Metodo de pago</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td>${rest.envio}</td>
                        <td>{formatDate(rest.fecha)}</td>
                        <td>{rest.id_cliente}</td>
                        <td><td>{rest.codigo_producto[0]}</td></td>
                        <td>{rest.cantidad}</td>
                        <td>{rest.metodo_pago}</td>
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

export default OrdenDeCompra