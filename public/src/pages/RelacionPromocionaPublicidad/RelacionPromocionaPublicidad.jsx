import { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, editButton, scrollableTable,
  formGrid, centeredDiv
 } from './RelacionPromocionaPublicidad.module.css'
import { Loading } from '../../components';

 const RelacionPromocionaPublicidad = () => {
  const [promocionaPublicidad, setPromocionaPublicidad] = useState([])
  const [id, setId] = useState(0)
  const [codigo_producto, setCodigo_producto] = useState([])
  const [cantidad, setCantidad] = useState([])
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [codigoProducto, setCodigoProducto] = useState(''); // Para el input actual

  const [fecha_asignado, setFecha_asignado] = useState('');
  const [tiempo_asignado, setTiempo_asignado] = useState(0);
  const [trabajo_a_realizar, setTrabajo_a_realizar] = useState('');

  const [personal_id, setPersonalId] = useState('');
  const [publicidad_id, setPublicidadId] = useState('')
  const [publicidadList, setPublicidadList] = useState([]);
  const [personalList, setPersonalList] = useState([]);
  const [cant, setCant] = useState('')
  const [publicidad_delete, setPublicidadDelete] = useState('');

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
  console.log("Brinda Informacion", promocionaPublicidad)
  const promocionaPublicidadSeguros = promocionaPublicidad ?? [];
  const currentData = promocionaPublicidadSeguros.slice(startIndex, endIndex);
  console.log(startIndex,endIndex,currentData)

  const pageCount = Math.ceil(promocionaPublicidadSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/relation/PromocionaPublicidad')
      .then(response => {
        setPromocionaPublicidad(response.data.response);
        setId(0)
        setFecha_asignado('')
        setTiempo_asignado(0)
        setTrabajo_a_realizar('')
        setPersonalId('')
        setPublicidadId('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Publicidad')
        .then(response => {
          setPublicidadList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })

        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Personal')
        .then(response => {
          setPersonalList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      })
  }, [])


  const submit = (event, id) => {
    event.preventDefault()
    console.log("fecha", fecha_asignado)
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/relation/create_promocionar_publicidad_relation", {
        publicidad_id, 
        personal_id, 
        trabajo_a_realizar, 
        tiempo_asignado,
        fecha_asignado,
      }).then(() => {
        fetchData()
        setFecha_asignado('')
        setTiempo_asignado(0)
        setTrabajo_a_realizar('')
        setPersonalId('')
        setPublicidadId('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_Publicidad/${id}`, {
        almacen_id, 
        proveedor_id, 
        disponibilidad, 
        tipo_de_producto,
        fecha_de_produccion,
      }).then(() => {
        fetchData()
        setFecha_asignado('')
        setTiempo_asignado(0)
        setTrabajo_a_realizar('')
        setPersonalId('')
        setPublicidadId('')
      })
    }
  }
  
  const deleteData = (id) => {
    console.log("id",id)
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_promocionar_publicidad_relation/${id}`)
      .then(() => {
        fetchData()
      })
  }


  const fetchData = () => {  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/relation/PromocionaPublicidad'
  
    axios.get(url)
      .then((res) => {
        setBrindaInformacion(res.data.response)
        setFecha_asignado('')
        setTiempo_asignado(0)
        setTrabajo_a_realizar('')
        setPersonalId('')
        setPublicidadId('')
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
      console.log("info", promocionaPublicidad)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir relacion Promociona Publicidad:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <select
                    className={inputText}
                    value={personal_id} // Aquí se almacena el ID del cliente seleccionado
                    onChange={handleAlmacenChange} // Esta función se ejecuta cuando se selecciona un cliente
                    placeholder='Seleccione una Persona'
                  >
                    {/* Opción por defecto */}
                    <option value="">Seleccione una persona</option>
                    {personalList.map((personal, index) => (
                      <option key={index} value={personal.id}>
                        ID: {personal.id} {personal.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={inputContainer}>
                  <select
                      className={inputText}
                      value={publicidad_id} // Aquí se almacena el ID del cliente seleccionado
                      onChange={handleProveedorChange} // Esta función se ejecuta cuando se selecciona un cliente
                      placeholder='Seleccione una Publicidad'
                    >
                      {/* Opción por defecto */}
                      <option value="">Seleccione una Publicidad</option>
                      {publicidadList.map((publicidad, index) => (
                        <option key={index} value={publicidad.id}>
                          ID: {publicidad.id} {publicidad.nombre}
                        </option>
                      ))}
                    </select>
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={tiempo_asignado} onChange={(e) => setTiempo_asignado(e.target.value)} type="number" placeholder='tiempo_asignado' />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={trabajo_a_realizar} onChange={(e) => setTrabajo_a_realizar(e.target.value)} type="text" placeholder='trabajo_a_realizar' />
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={fecha_asignado} onChange={(e) => setFecha_asignado(e.target.value)} type="date" placeholder='Fecha brindada' />
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
                <th>ID Persona</th>
                <th>tiempo_asignado</th>
                <th>trabajo_a_realizar</th>
                <th>fecha_asignado</th>
                <th>ID Publicidad</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {console.log("dddd", currentData)}
                {currentData.filter(rest => rest.PROMOCIONAPUBLICIDAD && Object.keys(rest.PROMOCIONAPUBLICIDAD).length > 0).map((rest) =>
                  <tr key={rest.PROMOCIONAPUBLICIDAD.id}>
                    <td>{rest.PERSONAL.id}</td>
                    <td>{rest.PROMOCIONAPUBLICIDAD.tiempo_asignado}</td>
                    <td>{rest.PROMOCIONAPUBLICIDAD.trabajo_a_realizar}</td>
                    {console.log("dddd", rest.PROMOCIONAPUBLICIDAD.fecha_asignado)}
                    <td>{rest.PROMOCIONAPUBLICIDAD.fecha_asignado ? formatDate(rest.PROMOCIONAPUBLICIDAD.fecha_asignado) : 'No disponible'}</td>
                    <td>{rest.PUBLICIDAD.id}</td>
                    <td>
                      <button onClick={() => submit()} className={editButton} type="submit" name="action">
                        <i className="material-icons ">edit</i>
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteData(rest.PROMOCIONAPUBLICIDAD.id)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
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

export default RelacionPromocionaPublicidad