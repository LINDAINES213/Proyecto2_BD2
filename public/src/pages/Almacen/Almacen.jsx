import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Almacen.module.css'


const Almacen = () => {
  const [almacen, setAlmacen] = useState([])
  const [id, setId] = useState(0)
  const [fecha_de_inauguracion, setFecha_de_inauguracion] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [capacidad_vehiculos, setCapacidad_vehiculos] = useState('')
  const [capacidad_total, setCapacidad_total] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Almacen')
      .then(response => {
        setAlmacen(response.data.response);
        setId(0)
        setFecha_de_inauguracion('')
        setPresupuesto('')
        setDireccion('')
        setCapacidad_vehiculos('')
        setCapacidad_total('')
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
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_almacen", {
        fecha_de_inauguracion,
        presupuesto,
        direccion,
        capacidad_vehiculos,
        capacidad_total
      }).then(() => {
        fetchData()
        setFecha_de_inauguracion('')
        setPresupuesto('')
        setDireccion('')
        setCapacidad_vehiculos('')
        setCapacidad_total('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_almacen/${id}`, {
        fecha_de_inauguracion,
        presupuesto,
        direccion,
        capacidad_vehiculos,
        capacidad_total
      }).then(() => {
        fetchData()
        setFecha_de_inauguracion('')
        setPresupuesto('')
        setDireccion('')
        setCapacidad_vehiculos('')
        setCapacidad_total('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_almacen/${id}`)
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
        setAlmacen(res.data)
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
      console.log("info", almacen)
      return (
        <div className={centeredDiv}>
          Loading
        </div>
      )
    }
    switch (selectedOption) {
      case 'verUsuarios':
        return (
          <div>
            <div className='col lg-6 mt-5'>
            <h3>Añadir Almacen:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={fecha_de_inauguracion} onChange={(e) => setFecha_de_inauguracion(e.target.value)} type="date" 
                      placeholder='Fecha de Inauguracion (YY-MM-DD)' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} type="number" placeholder='Presupuesto' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" placeholder='Direccion' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={capacidad_vehiculos} onChange={(e) => setCapacidad_vehiculos(e.target.value)} type="number" placeholder='Capacidad de Vehiculos' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={capacidad_total} onChange={(e) => setCapacidad_total(e.target.value)} placeholder='Capacidad total' type='number'
                    />
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
                <th>ID</th>
                <th>Fecha de Inauguracion</th>
                <th>Presupuesto</th>
                <th>Direccion</th>
                <th>Capacidad Vehiculod</th>
                <th>Capacidad total</th>
                <th>Editar</th>
                <th>Eliminar</th>

              </thead>
              <tbody>
                {almacen.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.id}</td>
                        <td>{rest.fecha_de_inauguracion}</td>
                        <td>{rest.presupuesto}</td>
                        <td>{rest.direccion}</td>
                        <td>{rest.capacidad_vehiculos}</td>
                        <td>{rest.capacidad_total}</td>
                        <td>
                          hola
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

export default Almacen