import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, scrollableTable,
  formGrid, centeredDiv, editButton
 } from './Personal.module.css'
import Loading from '../../components/Loading';

const Personal = () => {
  const [personal, setPersonal] = useState([])
  const [id, setId] = useState(0)
  const [DPI, setDPI] = useState('')
  const [nombre, setNombre] = useState('')
  const [Edad, setEdad] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [Tipo_de_licencia, setTipo_de_licencia] = useState('')
  const [estado, setEstado] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const personalSeguros = personal ?? [];
  const currentData = personalSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(personalSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Personal')
      .then(response => {
        setPersonal(response.data.response);
        setId(0)
        setDPI('')
        setNombre('')
        setEdad('')
        setEmail('')
        setTelefono('')
        setEstado('')
        setTipo_de_licencia('')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        console.log("data", personal)
        setLoading(false)
      })
  }, [])

  const submit = (event, id) => {
    event.preventDefault()
    if (id === 0) {
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_personal", {
        DPI,
        nombre,
        Edad,
        email,
        telefono,
        estado,
        Tipo_de_licencia
      }).then(() => {
        fetchData()
        setDPI('')
        setNombre('')
        setEdad('')
        setEmail('')
        setTelefono('')
        setEstado('')
        setTipo_de_licencia('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_personal/${DPI}`, {
        DPI,
        nombre,
        Edad,
        email,
        estado,
        telefono,
        Tipo_de_licencia
      }).then(() => {
        fetchData()
        setDPI('')
        setNombre('')
        setEdad('')
        setEstado('')
        setEmail('')
        setTelefono('')
        setTipo_de_licencia('')
      })
    }
  }
  
  const deleteData = (DPI) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_personal/${DPI}`)
      .then(() => {
        fetchData()
      })
  }

  const deleteAll = (id) => {
    console.log("id",id)
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_personal_nodes`)
      .then(() => {
        fetchData()
      })
  }


  const fetchData = () => {
  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Personal'
    axios.get(url)
      .then((res) => {
        setPersonal(res.data.response)
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
      console.log("info", personal)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir Personal:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={DPI} onChange={(e) => setDPI(e.target.value)} type="number" 
                      placeholder='DPI' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={Edad} onChange={(e) => setEdad(e.target.value)} type="number" placeholder='Edad' />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={estado} onChange={(e) => setEstado(e.target.value)} type="text" placeholder='Estado' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={telefono} onChange={(e) => setTelefono(e.target.value)} type="number" placeholder='Telefono' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='text'
                    />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={Tipo_de_licencia} onChange={(e) => setTipo_de_licencia(e.target.value)} placeholder='Tipo de Licencia' type='text' />
                    <div className={buttonContainer}>
                      <button className="btn btn-primary" type="submit" name="action"> Enviar  
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
                <tr>
                  <th>DPI</th>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Telefono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Tipo de Licencia</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map(rest => (
                  <tr key={rest.id}>
                    <td className={leftAligned}>{rest.DPI}</td>
                    <td>{rest.nombre}</td>
                    <td>{rest.Edad}</td>
                    <td>{rest.telefono}</td>
                    <td>{rest.email}</td>
                    <td>{rest.estado ? 'Activo' : 'Inactivo'}</td>
                    <td>{rest.Tipo_de_licencia}</td>
                    <td>
                      <button onClick={() => submit()} className={editButton} type="submit" name="action">
                        <i className="material-icons ">edit</i>
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteData(rest.DPI)} className="btn btn-sm btn-danger waves-light" type="submit" name="action">
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
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

export default Personal