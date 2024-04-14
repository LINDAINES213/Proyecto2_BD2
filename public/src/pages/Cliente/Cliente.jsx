import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Cliente.module.css'


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
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_cliente/${DPI}`, {
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
    }
  }
  
  const deleteData = (DPI) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_cliente/${DPI}`)
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
        setCliente(res.data)
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
          Loading
        </div>
      )
    }
    switch (selectedOption) {
      case 'verUsuarios':
        return (
          <div>
            <div className='col lg-6 mt-5'>
            <h3>Añadir Cliente:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={correo} onChange={(e) => setCorreo(e.target.value)} type="number" placeholder='Correo' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" placeholder='Direccion' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={telefono} onChange={(e) => setTelefono(e.target.value)} type="number" placeholder='Telefono' />
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
                {cliente.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre}</td>
                        <td>{rest.correo}</td>
                        <td>{rest.telefono}</td>
                        <td>{rest.direccion}</td>
                        <td>{rest.NIT}</td>
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

export default Cliente