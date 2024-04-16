import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, scrollableTable,
  formGrid, centeredDiv, btnSend
 } from './Publicidad.module.css'
import Loading from '../../components/Loading';

const Publicidad = () => {
  const [publicidad, setPublicidad] = useState([])
  const [id, setId] = useState(0)
  const [alcance, setAlcance] = useState(0)
  const [nombre, setNombre] = useState('')
  const [costo, setCosto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [duracion, setDuracion] = useState(0)
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const publicidadSeguros = publicidad ?? [];
  const currentData = publicidadSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(publicidadSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Publicidad')
      .then(response => {
        setPublicidad(response.data.response);
        setId(0)
        setAlcance(0)
        setNombre('')
        setCosto('')
        setDescripcion('')
        setDuracion(0)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        console.log("data", publicidad)
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_publicidad", {
        alcance,
        nombre,
        costo,
        descripcion,
        duracion
      }).then(() => {
        fetchData()
        setAlcance(0)
        setNombre('')
        setCosto('')
        setDescripcion('')
        setDuracion(0)
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_publicidad/${id}`, {
        alcance,
        nombre,
        costo,
        descripcion,
        duracion
      }).then(() => {
        fetchData()
        setAlcance(0)
        setNombre('')
        setCosto('')
        setDescripcion('')
        setDuracion(0)
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_publicidad/${id}`)
      .then(() => {
        fetchData()
      })
  }

  const fetchData = (limit) => {
  
    setLoading(true)

    const parsedLimit = parseInt(limit)
    const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = isLimitInteger
      ? `https://frail-maryanne-uvg.koyeb.app/?limit=${limit}`
      : 'https://frail-maryanne-uvg.koyeb.app/'
  
    axios.get(url)
      .then((res) => {
        setPersonal(res.data)
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
      console.log("info", publicidad)
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
            <h3>Añadir Publicidad:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
              <div className={inputContainer}>
                    <input className={inputText} value={alcance} onChange={(e) => setAlcance(e.target.value)} type="number" 
                      placeholder='Alcance' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={costo} onChange={(e) => setCosto(e.target.value)} type="number" placeholder='Costo' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} type="text" placeholder='Descripcion' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={duracion} onChange={(e) => setDuracion(e.target.value)} type="number" placeholder='Duracion' />
                </div>
              </div>
              <div className={inputContainer}>
                <div className={buttonContainer}>
                  <button className="btn btn-primary" type="submit" name="action"> Enviar  
                    <i className="material-icons right"> send</i>
                  </button>
                </div>
              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <tr>
                  <th>Alcance</th>
                  <th>Nombre</th>
                  <th>Costo</th>
                  <th>Descripcion</th>
                  <th>Duracion</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map(rest => (
                  <tr key={rest.id}>
                    <td className={leftAligned}>{rest.alcance}</td>
                    <td>{rest.nombre}</td>
                    <td>{rest.costo}</td>
                    <td>{rest.descripcion}</td>
                    <td>{rest.duracion}</td>
                    <td>Editar</td>
                    <td>
                      <button onClick={() => deleteData(rest.id)} className="btn btn-sm btn-danger waves-light" type="submit" name="action">
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', color: 'white', fontWeight: 'bolder' }}>
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

export default Publicidad