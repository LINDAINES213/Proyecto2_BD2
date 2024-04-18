import { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, centerAligned, editButton, scrollableTable, listaFlotante,
  formGrid, centeredDiv
 } from './RelacionTiene.module.css'
import { Loading } from '../../components';

 const RelacionTiene = () => {
  const [tiene, setTiene] = useState([])
  const [id, setId] = useState(0)
  const [codigo_producto, setCodigo_producto] = useState([])
  const [cantidad, setCantidad] = useState([])
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [codigoProducto, setCodigoProducto] = useState(''); // Para el input actual
  const [disponibilidad, setDisponibilidad] = useState('');
  const [tipo_de_producto, setTipoDeProducto] = useState('');
  const [fecha_de_produccion, setFechaDeProduccion] = useState('');
  const [producto_id, setProductoId] = useState('');
  const [proveedor_id, setProveedorId] = useState('')
  const [productosList, setProductosList] = useState([]);
  const [proveedorList, setProveedorList] = useState([]);
  const [cant, setCant] = useState('')
  const [proveedor_delete, setProveedorDelete] = useState('');
  const [productos, setproductos] = useState([]);

  const toggleProductSelection = (productId) => {
    if (productos.includes(productId)) {
      setproductos(productos.filter(id => id !== productId));
    } else {
      setproductos([...productos, productId]);
    }
  };

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

  const handleProductChange = (event) => {
    setProductoId(event.target.value); // Actualiza el estado con el nuevo ID de cliente seleccionado
  };

  const handleProveedorChange = (event) => {
    setProveedorId(event.target.value); // Actualiza el estado con el nuevo ID de cliente seleccionado
  };
  
  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  console.log("tiene", tiene)
  const productosSeguros = tiene ?? [];
  const currentData = productosSeguros.slice(startIndex, endIndex);
  console.log(startIndex,endIndex,currentData)

  const pageCount = Math.ceil(productosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/relation/Tiene')
      .then(response => {
        setTiene(response.data.response);
        setId(0)
        setDisponibilidad('')
        setFechaDeProduccion('')
        setTipoDeProducto('')
        setProductoId('')
        setProveedorId('')
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

        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Proveedor')
        .then(response => {
          setProveedorList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      })
  }, [])


  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/relation/create_tiene_relation", {
        productos, 
        proveedor_id, 
        disponibilidad, 
        tipo_de_producto,
        fecha_de_produccion,
      }).then(() => {
        fetchData()
        setDisponibilidad('')
        setFechaDeProduccion('')
        setTipoDeProducto('')
        setProductoId('')
        setProveedorId('')
        setproductos([])
      })
    }   
  }

  const editTiene = () => {
    console.log("productos", productos)
    axios.put(`https://frail-maryanne-uvg.koyeb.app/relation/update_tiene_relation`, {
      productos, 
      proveedor_id, 
      disponibilidad, 
      tipo_de_producto,
      fecha_de_produccion,
    }).then(() => {
      fetchData()
      setDisponibilidad('')
      setFechaDeProduccion('')
      setTipoDeProducto('')
      setProductoId('')
      setProveedorId('')
      setproductos([])
    })
  }
  
  const deleteData = (id) => {
    console.log("id",id)
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_tiene_relation/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const deleteAll = (id) => {
    console.log("id",id)
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_tiene_relations/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/relation/Tiene'
  
    axios.get(url)
      .then((res) => {
        setTiene(res.data.response)
        setDisponibilidad('')
        setFechaDeProduccion('')
        setTipoDeProducto('')
        setProductoId('')
        setProveedorId('')
        setproductos([])
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

  const [isListVisible, setIsListVisible] = useState(false);

  const renderTable = () => {
    if (loading) {
      console.log("info", tiene)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir relacion tiene:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <select
                      className={inputText}
                      value={proveedor_id} // Aquí se almacena el ID del cliente seleccionado
                      onChange={handleProveedorChange} // Esta función se ejecuta cuando se selecciona un cliente
                      placeholder='Seleccione un proveedor'
                    >
                      {/* Opción por defecto */}
                      <option value="">Seleccione un proveedor</option>
                      {proveedorList.map((proveedor, index) => (
                        <option key={index} value={proveedor.id}>
                          ID: {proveedor.id} {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                <div className={inputContainer}>
                  <button  type="button" style={{marginBottom: '-2vh', width:"20vw", marginLeft: "1.5vw", padding: "0.4vh", backgroundColor: "white", color: "black"}} onClick={() => setIsListVisible(!isListVisible)}>
                    {isListVisible ? 'Ocultar opciones' : 'Seleccionar productos'}
                  </button>
                  {isListVisible && (
                    <div className={listaFlotante}>
                      {productosList.map((producto, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleProductSelection(producto.id)}
                          className={`btn ${productos.includes(producto.id) ? 'btn-success' : 'btn-secondary'}`}
                          style={{backgroundColor:'white'}}
                        >
                          ID: {producto.id} - {producto.nombre}
                          {productos.includes(producto.id) ? ' (Seleccionado)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                <div className={inputContainer}>
                  <input className={inputText} value={fecha_de_produccion} onChange={(e) => setFechaDeProduccion(e.target.value)} type="date" placeholder='Fecha de produccion' />
                  <div className={buttonContainer}>
                    <button onClick={() => editTiene()} className=" btn btn-sm btn-primary waves-effect waves-light right" style={{padding: "0.5vh"}} type="button" name="action"> Editar varios 
                    </button>
                  </div>
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)} type="text" placeholder='Disponibilidad' />
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={tipo_de_producto} onChange={(e) => setTipoDeProducto(e.target.value)} type="text" placeholder='Tipo de producto' />
                  <div className={buttonContainer}>
                    <button className=" btn btn-sm btn-primary waves-effect waves-light right" style={{padding: "0.5vh"}} type="submit" name="action"> Enviar  
                    <i className="material-icons right"> send</i>
                    </button>
                  </div>
                </div>
                <div className={inputContainer}>
                  <input 
                    type="text"
                    className={inputText}
                    value={proveedor_delete}
                    style={{width: "21vw"}}
                    onChange={(e) => setProveedorDelete(e.target.value)}
                    placeholder="Ingrese el ID del proveedor para eliminar todas sus relaciones"
                  />
                  <button onClick={() => deleteAll(proveedor_delete)}  type="button" style={{backgroundColor:"transparent", padding: "0", marginLeft: '-1.5vw'}}>
                    ❌
                  </button>
                </div>
              </div>
              </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>ID Producto</th>
                <th>Disponibilidad</th>
                <th>Tipo de producto</th>
                <th>Fecha de produccion</th>
                <th>ID Proveedor</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {console.log("dddd", currentData)}
                {currentData.filter(rest => rest.TIENE && Object.keys(rest.TIENE).length > 0).map((rest, index) =>
                  <tr key={index}>
                    <td>{rest.Producto.id}</td>
                    <td>{rest.TIENE.disponibilidad ? 'Disponible' : 'No disponible'}</td>
                    <td>{rest.TIENE.tipo_de_producto}</td>
                    <td>{formatDate(rest.TIENE.fecha_de_produccion)}</td>
                    <td>{rest.Proveedor.id}</td>
                    <td>
                      <button onClick={() => submit()} className={editButton} type="submit" name="action">
                        <i className="material-icons ">edit</i>
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteData(rest.TIENE.id)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
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

export default RelacionTiene