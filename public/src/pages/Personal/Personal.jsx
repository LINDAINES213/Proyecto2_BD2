import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit, inputTextSlider
 } from './Personal.module.css'


 const Personal = () => {
  const [productos, setProductos] = useState([])
  const [id, setId] = useState(0)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precio, setPrecio] = useState('')
  const [precio_al_por_mayor, setPrecio_al_por_mayor] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Producto')
      .then(response => {
        setProductos(response.data.response);
        setId(0)
        setNombre('')
        setDescripcion('')
        setCategoria('')
        setPrecio('')
        setPrecio_al_por_mayor('')
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
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_producto", {
        nombre,
        descripcion,
        categoria,
        precio,
        precio_al_por_mayor
      }).then(() => {
        fetchData()
        setNombre('')
        setDescripcion('')
        setCategoria('')
        setPrecio('')
        setPrecio_al_por_mayor('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_producto/${id}`, {
        nombre,
        descripcion,
        categoria,
        precio,
        precio_al_por_mayor
      }).then(() => {
        fetchData()
        setNombre('')
        setDescripcion('')
        setCategoria('')
        setPrecio('')
        setPrecio_al_por_mayor('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_producto/${id}`)
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
        setProductos(res.data)
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
      console.log("info", productos)
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
            <h3>Añadir producto:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" 
                      placeholder='Nombre del producto' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} type="text" placeholder='Descripcion' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} value={categoria} onChange={(e) => setCategoria(e.target.value)} type="text" placeholder='Categoria' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder='Precio' type='number'
                    />
                </div>
              </div>
              <div className={inputContainer}>
                    <input className={inputText} value={precio_al_por_mayor} onChange={(e) => setPrecio_al_por_mayor(e.target.value)} placeholder='Precio al por mayor' type='number' />
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
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Precio al por mayor</th>
                <th>Editar</th>
                <th>Eliminar</th>

              </thead>
              <tbody>
                {productos.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre}</td>
                        <td>{rest.descripcion}</td>
                        <td>{rest.categoria}</td>
                        <td>{rest.precio}</td>
                        <td>{rest.precio_al_por_mayor}</td>
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

export default Personal