import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Proveedores.module.css'


function ProveedorComponent() {
  const [proveedores, setProveedores] = useState([])
  const [id, setId] = useState(0)
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [tipo_de_producto, setTipo_de_producto] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    axios.get('http://127.0.0.1:8001/nodes/Proveedor')
      .then(response => {
        setProveedores(response.data.response);
        setId(0)
        setNombre('')
        setDireccion('')
        setTelefono('')
        setEmail('')
        setTipo_de_producto('')
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
      axios.post("http://127.0.0.1:8001/create_proveedor", {
        nombre,
        direccion,
        telefono,
        email,
        tipo_de_producto
      }).then(() => {
        fetchData()
        setNombre('')
        setDireccion('')
        setTelefono('')
        setEmail('')
        setTipo_de_producto('')
      })
    } else {
      axios.put(`http://127.0.0.1:8001/update_proveedor/${id}`, {
        nombre,
        direccion,
        telefono,
        email,
        tipo_de_producto
      }).then(() => {
        fetchData()
        setNombre('')
        setDireccion('')
        setTelefono('')
        setEmail('')
        setTipo_de_producto('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`http://127.0.0.1:8001/delete_proveedor/${id}`)
      .then(() => {
        fetchData()
      })
  }



  const fetchData = (limit) => {
  
    const parsedLimit = parseInt(limit)
    const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = isLimitInteger
      ? `https://frail-maryanne-uvg.koyeb.app/?limit=${limit}`
      : 'https://frail-maryanne-uvg.koyeb.app/'
  
    axios.get(url)
      .then((res) => {
        setProveedores(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }

  const renderTable = () => {
    switch (selectedOption) {
      case 'verUsuarios':
        return (
          <div>
            <div className='col lg-6 mt-5'>
            <h3>Añadir proveedor:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre del proveedor' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" placeholder='Direccion' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder='Telefono' type='tel'
                    />
                </div>
              </div>
              <div className={inputContainer}>
                    <input className={inputText} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' />
              </div>
              <div className={inputContainer}>
                    <input className={inputText} value={tipo_de_producto} onChange={(e) => setTipo_de_producto(e.target.value)} type="text" placeholder='Tipo de Producto' />
              </div>
            </form>
          </div>        
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Tipo de producto</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {proveedores.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre}</td>
                        <td>{rest.direccion}</td>
                        <td>{rest.telefono}</td>
                        <td>{rest.email}</td>
                        <td>{rest.tipo_de_producto}</td>
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

export default ProveedorComponent
