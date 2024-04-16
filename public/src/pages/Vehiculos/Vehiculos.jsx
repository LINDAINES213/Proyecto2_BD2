import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, scrollableTable,
  formGrid, centeredDiv, btnSend
 } from './Vehiculos.module.css'
import Loading from '../../components/Loading';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [id, setId] = useState(0)
  const [marca, setMarca] = useState('')
  const [placa, setPlaca] = useState('')
  const [consumo, setConsumo] = useState(0)
  const [modelo, setModelo] = useState(0)
  const [peso_limite, setPeso_limite] = useState(0)
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const vehiculosSeguros = vehiculos ?? [];
  const currentData = vehiculosSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(vehiculosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/VehiculoTransporteLigero')
      .then(response => {
        setVehiculos(response.data.response);
        setId(0)
        setMarca('')
        setPlaca('')
        setConsumo(0)
        setModelo(0)
        setPeso_limite(0)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        console.log("data", vehiculos)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/VehiculoTransportePesado')
      .then(response => {
        setVehiculos(response.data.response);
        setId(0)
        setMarca('')
        setPlaca('')
        setConsumo(0)
        setModelo(0)
        setPeso_limite(0)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        console.log("data", vehiculos)
        setLoading(false)
      })
  }, [])


  const submit = (event, id) => {
    if (peso_limite >= 6 ) {
      event.preventDefault()
      if (id === 0) {
        axios.post("https://frail-maryanne-uvg.koyeb.app/create_vehiculo_transporte_ligero", {
          marca,
          placa,
          consumo,
          modelo,
          peso_limite
        }).then(() => {
          fetchData()
          setMarca('')
          setPlaca('')
          setConsumo(0)
          setModelo(0)
          setPeso_limite(0)
        })
      } else {
        axios.put(`https://frail-maryanne-uvg.koyeb.app/update_vehiculo_transporte_ligero/${id}`, {
          marca,
          placa,
          consumo,
          modelo,
          peso_limite
        }).then(() => {
          fetchData()
          setMarca('')
          setPlaca('')
          setConsumo(0)
          setModelo(0)
          setPeso_limite(0)
        })
      }
    } else {
      event.preventDefault()
      if (id === 0) {
        axios.post("https://frail-maryanne-uvg.koyeb.app/create_vehiculo_transporte_pesado", {
          marca,
          placa,
          consumo,
          modelo,
          peso_limite
        }).then(() => {
          fetchData()
          setMarca('')
          setPlaca('')
          setConsumo(0)
          setModelo(0)
          setPeso_limite(0)
        })
      } else {
        axios.put(`https://frail-maryanne-uvg.koyeb.app/update_vehiculo_transporte_pesado/${id}`, {
          marca,
          placa,
          consumo,
          modelo,
          peso_limite
        }).then(() => {
          fetchData()
          setMarca('')
          setPlaca('')
          setConsumo(0)
          setModelo(0)
          setPeso_limite(0)
        })
      }
    }
  }
  

  
  const deleteData = (id) => {
    if (peso_limite >= 6){
      axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_vehiculo_transporte_ligero/${id}`)
      .then(() => {
        fetchData()
      })
    } else {
      axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_vehiculo_transporte_pesado/${id}`)
      .then(() => {
        fetchData()
      })
    }
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
      console.log("info", vehiculos)
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
            <h3>Añadir Vehiculos:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
              <div className={inputContainer}>
                    <input className={inputText} value={marca} onChange={(e) => setMarca(e.target.value)} type="text" 
                      placeholder='Marca' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={placa} onChange={(e) => setPlaca(e.target.value)} type="text" 
                      placeholder='Placa' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={consumo} onChange={(e) => setConsumo(e.target.value)} type="number" placeholder='Consumo' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={modelo} onChange={(e) => setModelo(e.target.value)} type="number" placeholder='Modelo' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={peso_limite} onChange={(e) => setPeso_limite(e.target.value)} type="number" placeholder='Peso_limite' />
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
                  <th>Marca</th>
                  <th>Placa</th>
                  <th>Consumo</th>
                  <th>Modelo</th>
                  <th>Peso_limite</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map(rest => (
                  <tr key={rest.id}>
                    <td className={leftAligned}>{rest.marca}</td>
                    <td>{rest.placa}</td>
                    <td>{rest.consumo}</td>
                    <td>{rest.modelo}</td>
                    <td>{rest.peso_limite}</td>
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

export default Vehiculos