import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Personal.module.css'


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
        setNombre('')
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
      console.log("info", personal)
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
            <h3>Añadir Personal:</h3>
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
              <div className={inputContainer}>
                    <input className={inputText} value={Tipo_de_licencia} onChange={(e) => setTipo_de_licencia(e.target.value)} placeholder='Tipo de Licencia' type='text' />
                    <div className={buttonContainer}>
                      <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"> Enviar  
                      <i className="material-icons right"> send</i>
                      </button>
              </div>
              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>DPI</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Tipo de Licencia</th>
                <th>Editar</th>
                <th>Eliminar</th>

              </thead>
              <tbody>
                {personal.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.DPI}</td>
                        <td>{rest.nombre}</td>
                        <td>{rest.Edad}</td>
                        <td>{rest.telefono}</td>
                        <td>{rest.email}</td>
                        <td>{rest.estado}</td>
                        <td>{rest.Tipo_de_licencia}</td>
                        <td>
                          hola
                        </td>
                        <td>
                          <button onClick={() => deleteData(rest.DPI)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
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

export default Personal