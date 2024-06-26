import { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, centerAligned, editButton, scrollableTable,
  formGrid, centeredDiv, productButton,productItem,productList,  floatingWindow
 } from './OrdenDeCompraPorMayor.module.css'
import { Loading } from '../../components';

 const OrdenDeCompraPorMayor = () => {
  const [ordenDeCompra, setOrdenDeCompra] = useState([])
  const [id, setId] = useState(0)
  const [envio, setEnvio] = useState('')
  const [fecha, setFecha] = useState('')
  const [id_cliente, setIDCliente] = useState('')
  const [codigo_producto, setCodigo_producto] = useState([])
  const [cantidad, setCantidad] = useState([])
  const [metodo_pago, setMetodo_pago] = useState('')
  const [total, setTotal] = useState('')
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [codigoProducto, setCodigoProducto] = useState(''); // Para el input actual
  const [productosList, setProductosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [cant, setCant] = useState('')

  const handleInputChange = (e) => {
    setCodigoProducto(e.target.value);
  };
  
  const handleAddCodigo = () => {
    if (codigoProducto !== '' && !codigo_producto.includes(codigoProducto)) {
      setCodigo_producto([...codigo_producto, codigoProducto]); // Añade el código al array
      setCodigoProducto(''); // Limpia el select
    }
  };
  
  const handleDeleteCodigo = (codigo) => {
    setCodigo_producto(codigo_producto.filter(c => c !== codigo)); // Elimina el código del array
  };
  
  const handleInputChangeCantidad = (e) => {
    setCant(e.target.value);
  };

  const handleAddCantidad = () => {
    const intCant = parseInt(cant, 10); // Convierte cant a un entero base 10
    if (!isNaN(intCant)) { // Asegura que intCant es un número
      setCantidad([...cantidad, intCant]); // Añade el entero al array
      setCant(''); // Limpia el input
    }
  };  

  const handleDeleteCantidad = (codigo) => {
    setCantidad(cantidad.filter(c => c !== codigo)); // Elimina el código del array
  };

  const handleClientChange = (event) => {
    setIDCliente(event.target.value); // Actualiza el estado con el nuevo ID de cliente seleccionado
  };
  

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
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/OrdenDeCompraPorMayor')
      .then(response => {
        setOrdenDeCompra(response.data.response);
        setId(0)
        setEnvio('')
        setFecha('')
        setTotal('')
        setIDCliente('')
        setCodigo_producto([])
        setCantidad('')
        setMetodo_pago('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Producto')
        .then(response => {
          setProductosList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })

        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Cliente')
        .then(response => {
          setClientesList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      })
  }, [])

    useEffect(() => {
      console.log("cant",cantidad)
      console.log("producCod",codigo_producto)
      if (cantidad.length === codigo_producto.length) {
        let sum = 0;
        for (let i = 0; i < cantidad.length; i++) {
          const producto = productosList.find(p => p.id === codigo_producto[i]);  // Encuentra el producto basado en el id

          if (producto) {
            sum += cantidad[i] * producto.precio_al_por_mayor;  // Calcula contribución al total
          }
        }
        setTotal(sum);
      }
    }, [cantidad, codigo_producto, productosList]);  // Recalcular cuando estos estados cambian


  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_orden_compra_por_mayor", {
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
        setCodigo_producto([])
        setCantidad([])
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
        setCodigo_producto([])
        setCantidad([ ])
        setMetodo_pago('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_orden_compra_por_mayor/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/OrdenDeCompraPorMayor'
  
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir orden de compra:</h3>
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
                  <select
                    className={inputText}
                    value={codigoProducto}
                    onChange={handleInputChange}
                    placeholder='Seleccione un producto'
                  >
                    {/* Opción por defecto */}
                    <option value="">Seleccione un producto</option>
                    {console.log("prd", productosList)}
                    {productosList.map((producto, index) => (
                      <option key={index} value={producto.id}>
                        ID: {producto.id} {producto.nombre} 
                      </option>
                    ))}
                  </select>
                  <button type="button" style={{paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw'}} onClick={handleAddCodigo}>Añadir +</button>
                  {codigo_producto.length > 0 && (
                    <div className={floatingWindow} style={{right: "1vw", top: "79vh"}}>
                      <ul className={productList}>
                        {codigo_producto.map((codigo, index) => (
                          <li key={index} className={productItem}>
                            {codigo}
                            <button type="button" className={productButton} style={{ backgroundColor: "transparent"}} onClick={() => handleDeleteCodigo(codigo)}>
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input
                    className={inputText}
                    value={cant}
                    onChange={handleInputChangeCantidad}
                    placeholder='Cantidad'
                    type='number'
                  />
                  <button type="button" style={{padding: "1vh", paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw'}} onClick={handleAddCantidad}>Añadir+</button>
                  {console.log("codigo", cantidad)}
                  {cantidad.length > 0 ? (
                    <div className={floatingWindow} style={{left: "16vw", top: "79vh"}}>
                      <ul className={productList}>
                        {cantidad.map((codigo, index) => (
                          <li key={index} className={productItem}>
                            Producto {index} ➡️ {codigo}

                            <button type="button" className={productButton} style={{ backgroundColor: "transparent"}} onClick={() => handleDeleteCantidad(codigo)}>
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    null
                  )}
                </div>
                <div className={inputContainer}>
                  <select
                    className={inputText}
                    value={id_cliente} // Aquí se almacena el ID del cliente seleccionado
                    onChange={handleClientChange} // Esta función se ejecuta cuando se selecciona un cliente
                    placeholder='Seleccione un cliente'
                  >
                    {/* Opción por defecto */}
                    <option value="">Seleccione un cliente</option>
                    {/* Mapeo de clientesList para generar las opciones */}
                    {clientesList.map((cliente, index) => (
                      <option key={index} value={cliente.id}>
                        ID: {cliente.id} {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={metodo_pago} onChange={(e) => setMetodo_pago(e.target.value)} type="text" placeholder='Metodo de pago' />
                  <div className={buttonContainer}>
                    <button className=" btn btn-sm btn-primary waves-effect waves-light right" style={{padding: "0.5vh"}} type="submit" name="action"> Enviar  
                    <i className="material-icons right"> send</i>
                    </button>
                  </div>
                </div>
                {(total !== undefined && total !== '' && !isNaN(total) && total >= 0) && (
                  <div className={inputContainer}>
                    <span style={{backgroundColor: 'white', borderRadius: "5px", color: "black", padding: '0.5vh', marginLeft: '0.5vw'}}>Total: ${total.toFixed(2)}</span>  {/* Muestra el total aquí */}
                  </div>
                )}
              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>ID Cliente</th>
                <th>Fecha</th>
                <th>Codigo Producto</th>
                <th>Cantidad</th>
                <th>Metodo de pago</th>
                <th>Envio</th>
                <th>Total</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td>{rest.id_cliente}</td>
                        {console.log("fff", rest.fecha)}
                        <td>{formatDate(rest.fecha)}</td>
                        <td>
                          <table>
                            <tbody>
                              {rest.codigo_producto.map(cod => 
                                <tr key={cod}><td className={centerAligned}>{cod}</td></tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                        <td>
                          <table>
                            <tbody>
                              {rest.cantidad.map(cod => 
                                <tr key={cod}><td className={centerAligned}>{cod}</td></tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                        <td>{rest.metodo_pago}</td>
                        <td>${rest.envio}</td>
                        <td>${rest.total.toFixed(2)}</td>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', color: 'white', fontWeight: 'bolder'}}>
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

export default OrdenDeCompraPorMayor