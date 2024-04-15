import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, centeredDiv,
 } from './Productos.module.css'
import Loading from '../../components/Loading';

const Productos = () => {
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

  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const productosSeguros = productos ?? [];
  const currentData = productosSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(productosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};
  

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
        setCurrentPage(0)
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
        console.log("productos",productos)
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


  const fetchData = () => {
  
    setLoading(true)
    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)  
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
  
    axios.get(url)
      .then((res) => {
        setProductos(res.data.response)
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
            <h3 style={{ borderBottom: '3px solid #0004ff'}}>Añadir producto:</h3>
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
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                  <input className={inputText} value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder='Precio' type='number'/>
                </div>
                <div className={inputContainer}>
                  <input className={inputText} value={precio_al_por_mayor} onChange={(e) => setPrecio_al_por_mayor(e.target.value)} placeholder='Precio al por mayor' type='number' />
                  <div className={buttonContainer}>
                    <button type="submit" name="action"> Enviar  
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
                <th>Descripcion</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Precio al por mayor</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre || "sin datos"}</td>
                        <td>{rest.descripcion || "sin datos"}</td>
                        <td>{rest.categoria || "sin datos"}</td>
                        <td>{rest.precio ? `$${rest.precio}` : "sin datos"}</td>
                        <td>{rest.precio_al_por_mayor ? `$${rest.precio_al_por_mayor}` : "sin datos"}</td>
                        <td>
                          <button onClick={() => submit()} className={editButton} type="submit" name="action">
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

export default Productos