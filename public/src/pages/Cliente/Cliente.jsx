import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Cliente.module.css'
import { Loading } from '../../components';

 const Cliente = () => {
  const [cliente, setCliente] = useState([])
  const [id, setId] = useState(0)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [NIT, setNIT] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const productosSeguros = cliente ?? [];
  const currentData = productosSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(productosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};
  


  const editCliente = (id) => {
    console.log("id",id)
    axios.get(`https://frail-maryanne-uvg.koyeb.app/get_cliente/${id}`)
      .then((res) => {
        console.log("p",res)
        setId(res.data.id)
        setNombre(res.data.nombre)
        setCorreo(res.data.correo)
        setDireccion(res.data.direccion)
        setTelefono(res.data.telefono)
        setNIT(res.data.nit)
      })
  }

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Cliente')
      .then(response => {
        setCliente(response.data.response);
        setId(0)
        setNombre('')
        setCorreo('')
        setDireccion('')
        setTelefono('')
        setNIT('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    console.log("edi",id)
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_cliente", {
        nombre,
        correo,
        direccion,
        telefono,
        NIT
      }).then(() => {
        fetchData()
        setNombre('')
        setCorreo('')
        setDireccion('')
        setTelefono('')
        setNIT('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_cliente/${id}`, {
        nombre,
        correo,
        direccion,
        telefono,
        NIT
      }).then(() => {
        console.log("edicio", id)
        fetchData()
        setNombre('')
        setCorreo('')
        setDireccion('')
        setTelefono('')
        setNIT('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_cliente/${id}`)
      .then(() => {
        fetchData()
      })
  }


  const deleteAll = (id) => {
    console.log("id",id)
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_clientes_nodes`)
      .then(() => {
        fetchData()
      })
  }



  const fetchData = () => {
  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Cliente'
  
    axios.get(url)
      .then((res) => {
        setCliente(res.data.response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }

  const renderTable = () => {
    if (loading) {
      console.log("info", cliente)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir Cliente:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={correo} onChange={(e) => setCorreo(e.target.value)} type="Email" placeholder='Correo' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" placeholder='Direccion' />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={telefono} onChange={(e) => setTelefono(e.target.value)} type="text" placeholder='Telefono' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={NIT} onChange={(e) => setNIT(e.target.value)} placeholder='NIT' type='number'
                    />
                    <div className={buttonContainer}>
                      <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"> Enviar  
                      <i className="material-icons right"> send</i>
                      </button>
                    </div>
                </div>
                <div className={inputContainer}>
                  <div className={buttonContainer}>
                    <button className=" btn btn-sm btn-primary waves-effect waves-light right" onClick={() => deleteAll()}  style={{backgroundColor: "red"}}type="button" name="action">Eliminar primeros 5 nodos</button>
                  </div>
                </div>
              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th>NIT</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre}</td>
                        <td>{rest.correo}</td>
                        <td>{rest.telefono}</td>
                        <td>{rest.direccion}</td>
                        <td>{rest.NIT}</td>
                        <td>
                          <button onClick={() => editCliente(rest.id)} className={editButton} type="submit" name="action">
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

export default Cliente