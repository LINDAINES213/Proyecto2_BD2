import { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, editButton, scrollableTable, listaFlotante, floatingWindow, productList, productItem, productButton,
  formGrid, centeredDiv
 } from './RelacionReabastece.module.css'
import { Loading } from '../../components';

 const RelacionReabastece = () => {
  const [reabastece, setReabastece] = useState([])
  const [id, setId] = useState(0)
  const [codigo_producto, setCodigo_producto] = useState([])
  const [cantidad, setCantidad] = useState([])
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [codigoProducto, setCodigoProducto] = useState(''); // Para el input actual
  const [monto, setMonto] = useState(0);
  const [calidad_del_producto, setCalidad_del_producto] = useState(0);
  const [fecha_de_reabastecimiento, setFecha_de_reabastecimiento] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [tipo_de_producto, setTipoDeProducto] = useState('');
  const [fecha_de_produccion, setFechaDeProduccion] = useState('');
  const [almacen_id, setAlmacenId] = useState('');
  const [proveedor_id, setProveedorId] = useState('')
  const [almacenList, setAlmacenList] = useState([]);
  const [proveedorList, setProveedorList] = useState([]);
  const [cant, setCant] = useState('')
  const [proveedor_delete, setProveedorDelete] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listCategories, setListCategories] = useState(['fecha_de_reabastecimiento', 'calidad_del_producto', 'monto'])
  const [listIds, setListIds] = useState([]);
  const [valId, setValId] = useState('')

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
  
  const handleInputChangeId = (e) => {
    setValId(e.target.value);
  };

  const handleAddId = () => {
    setListIds([...listIds, valId]); // Añade el entero al array
    setValId(''); // Limpia el input
  };  

  const handleDeleteId = (codigo) => {
    setListIds(listIds.filter(c => c !== codigo)); // Elimina el código del array
  };

  const handleAlmacenChange = (event) => {
    setAlmacenId(event.target.value); // Actualiza el estado con el nuevo ID de cliente seleccionado
  };

  const handleProveedorChange = (event) => {
    setProveedorId(event.target.value); // Actualiza el estado con el nuevo ID de cliente seleccionado
  };
  
  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  console.log("reabastece", reabastece)
  const reabasteceSeguros = reabastece ?? [];
  const currentData = reabasteceSeguros.slice(startIndex, endIndex);
  console.log(startIndex,endIndex,currentData)

  const pageCount = Math.ceil(reabasteceSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/relation/Reabastece')
      .then(response => {
        setReabastece(response.data.response);
        setId(0)
        setMonto(0)
        setCalidad_del_producto(0)
        setFecha_de_reabastecimiento('')
        setAlmacenId('')
        setProveedorId('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Proveedor')
        .then(response => {
          setProveedorList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })

        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Almacen')
        .then(response => {
          setAlmacenList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      })
  }, [])

  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/relation/Reabastece'
  
    axios.get(url)
      .then((res) => {
        setReabastece(res.data.response)
        setMonto(0)
        setCalidad_del_producto(0)
        setFecha_de_reabastecimiento('')
        setAlmacenId('')
        setProveedorId('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }

  
  const toggleCategoriesSelection = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(id => id !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  

  const submit = (event, id) => {
    event.preventDefault()
    console.log("fecha", fecha_de_reabastecimiento)
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/relation/create_reabastece_relation", {
        almacen_id, 
        proveedor_id, 
        monto, 
        calidad_del_producto,
        fecha_de_reabastecimiento,
      }).then(() => {
        fetchData()
        setMonto(0)
        setCalidad_del_producto(0)
        setFecha_de_reabastecimiento('')
        setAlmacenId('')
        setProveedorId('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/relation/update_reabastece_relation/${id}`, {
        almacen_id, 
        proveedor_id, 
        disponibilidad, 
        tipo_de_producto,
        fecha_de_produccion,
      }).then(() => {
        fetchData()
        setId('')
        setAlmacenId('')
        setProveedorId('')
        setFecha_de_reabastecimiento('')
        setMonto(0)
        setCalidad_del_producto(0)
      })
    }
  }

  function formatDateInfo(dateObject) {
    const { _Date__year, _Date__month, _Date__day } = dateObject;
  
    // Añade un cero adelante si el mes o el día son menores de 10 para asegurar el formato correcto
    const month = _Date__month < 10 ? `0${_Date__month}` : _Date__month;
    const day = _Date__day < 10 ? `0${_Date__day}` : _Date__day;
  
    return `${_Date__year}-${month}-${day}`;
  }
  
  const editReabastece = (id) => {
    console.log("id",id)
    axios.get(`https://frail-maryanne-uvg.koyeb.app/get_relation_reabastece/${id}`)
      .then((res) => {
        console.log("informacionnnnnnnnnn",res)
        setAlmacenId(res.data.almacen_id)
        setProveedorId(res.data.proveedor_id)
        setFecha_de_reabastecimiento(formatDateInfo(res.data.fecha_de_reabastecimiento))
        setMonto(res.data.monto)
        setCalidad_del_producto(res.data.calidad_del_producto)
      })
  }

  const deleteProperties = () => {
    console.log("jeje", listIds, categories);

    axios.put('https://frail-maryanne-uvg.koyeb.app/relation/remove_properties', {
        relation_ids: listIds,
        properties_to_remove: categories
    })
    .then(() => {
        fetchData();
        setListIds([]);
        setCategories([]);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }


  const formatDate = (date) => {
    // Assuming date._Date__month is zero-indexed
    const formattedDate = `${date._Date__day}/${date._Date__month + 1}/${date._Date__year}`;
    return formattedDate;
  }

  const renderTable = () => {
    if (loading) {
      console.log("info", reabastece)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir relacion reabastece:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <select
                    className={inputText}
                    value={almacen_id} // Aquí se almacena el ID del cliente seleccionado
                    onChange={handleAlmacenChange} // Esta función se ejecuta cuando se selecciona un cliente
                    placeholder='Seleccione un Almacen'
                  >
                    {/* Opción por defecto */}
                    <option value="">Seleccione un Almacen</option>
                    {almacenList.map((almacen, index) => (
                      <option key={index} value={almacen.id}>
                        ID: {almacen.id} {almacen.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={monto} onChange={(e) => setMonto(e.target.value)} type="number" placeholder='Monto' />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={calidad_del_producto} onChange={(e) => setCalidad_del_producto(e.target.value)} type="number" placeholder='Calidad del producto' />
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={fecha_de_reabastecimiento} onChange={(e) => setFecha_de_reabastecimiento(e.target.value)} type="date" placeholder='Fecha de reabastecimiento' />
                  <div className={buttonContainer}>
                    <button className=" btn btn-sm btn-primary waves-effect waves-light right" style={{padding: "0.5vh"}} type="submit" name="action"> Enviar  
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
                <th>ID Almacen</th>
                <th>ID REABASTECE</th>
                <th>Monto</th>
                <th>Calidad del producto</th>
                <th>Fecha de reabastecimiento</th>
                <th>ID Proveedor</th>
                <th>Editar</th>
              </thead>
              <tbody>
                {console.log("dddd", currentData)}
                {currentData.filter(rest => rest.REABASTECE && Object.keys(rest.REABASTECE).length > 0).map((rest) =>
                  <tr key={rest.REABASTECE.id}>
                    <td>{rest.ALMACEN.id}</td>
                    <td>{rest.REABASTECE.id}</td>
                    <td>{rest.REABASTECE.monto ? rest.REABASTECE.monto : 'Sin datos'}</td>
                    <td>{rest.REABASTECE.calidad_del_producto ? rest.REABASTECE.calidad_del_producto : 'Sin datos'}</td>
                    <td>{rest.REABASTECE.fecha_de_reabastecimiento ? formatDateInfo(rest.REABASTECE.fecha_de_reabastecimiento) : 'Sin datos'}</td>
                    <td>{rest.PROVEEDOR.id}</td>
                    <td>
                      <button onClick={() => editReabastece(rest.REABASTECE.id)} className={editButton} type="submit" name="action">
                        <i className="material-icons ">edit</i>
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
          <div style={{ marginTop: '20px' }}>
            <div className={formGrid}>
              <div className={inputContainer}>
                <button style={{marginBottom: '-2vh', marginTop:'-2vh', width:"20vw", marginLeft: "1.5vw", padding: "0.4vh", backgroundColor: "white", color: "black"}} onClick={() => setIsListVisible(!isListVisible)}>
                  {isListVisible ? 'Ocultar opciones' : 'Seleccionar propiedad/es a eliminar'}
                </button>
                {isListVisible && (
                  <div className={listaFlotante}>
                    {listCategories.map((cat, index) => (
                      <button
                        key={index}
                        onClick={() => toggleCategoriesSelection(cat)}
                        className={`btn ${categories.includes(cat) ? 'btn-success' : 'btn-secondary'}`}
                        style={{backgroundColor:'white'}}
                      >
                        Categoria: {cat}
                        {categories.includes(cat) ? ' (Seleccionado)' : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={inputContainer}>
                <input
                  className={inputText}
                  value={valId}
                  onChange={handleInputChangeId}
                  placeholder='Ingrese un ID'
                  type='text'
                />
                <button type="button" style={{padding: "1vh", paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw'}} onClick={handleAddId}>Añadir+</button>
                {console.log("codigo", listIds)}
                {listIds.length > 0 ? (
                  <div className={floatingWindow} style={{left: "39vw", top: "84vh", width: "19vw"}}>
                    <ul className={productList}>
                      {listIds.map((codigo, index) => (
                        <li key={index} className={productItem}>
                          Relacion {index} con ID ➡️ {codigo}
                          <button type="button" className={productButton} style={{ backgroundColor: "transparent"}} onClick={() => handleDeleteId(codigo)}>
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  null
                )}
                <button type="button" style={{padding: "1vh", paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw', width: "10vw", backgroundColor: "green"}} onClick={deleteProperties}>Eliminar propiedad/es</button>
              </div>
            </div>
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

export default RelacionReabastece