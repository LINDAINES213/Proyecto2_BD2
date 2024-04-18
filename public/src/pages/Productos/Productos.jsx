import { useState, useEffect } from 'react';
import axios from 'axios';
import { buttonContainer, inputContainer, inputText, crud, leftAligned, scrollableTable, floatingWindow, productList, productItem, productButton, listaFlotante,
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
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [isListVisible, setIsListVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listCategories, ] = useState(['nombre','descripcion','categoria','precio','precio_al_por_mayor'])
  const [listIds, setListIds] = useState([]);
  const [valId, setValId] = useState('')

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

  const handleInputChangeId = (e) => {
    setValId(e.target.value);
  };

  const handleAddId = () => {
    setListIds([...listIds, valId]); // Añade el entero al array
    setValId(''); // Limpia el input
  };  

  const handleDeleteId = (codigo) => {
    setListIds(listIds.filter(c => c !== codigo)); // Elimina el código del array
  };

  const toggleCategoriesSelection = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(id => id !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const deleteProperties = () => {
    console.log("jeje", listIds, categories);

    axios.put('https://frail-maryanne-uvg.koyeb.app/node/remove_properties/Producto', {
        listIds: listIds,
        properties_to_remove: categories
    })
    .then(() => {
        fetchData();
        setListIds([]);
        setCategories([]);
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir producto:</h3>
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
                <th>Codigo Producto</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Precio al por mayor</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td>{rest.id || "sin datos"}</td>
                        <td className={leftAligned}>{rest.nombre || "sin datos"}</td>
                        <td>{rest.descripcion || "sin datos"}</td>
                        <td>{rest.categoria || "sin datos"}</td>
                        <td>{rest.precio ? `$${rest.precio}` : "sin datos"}</td>
                        <td>{rest.precio_al_por_mayor ? `$${rest.precio_al_por_mayor}` : "sin datos"}</td>
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
          <div style={{ marginTop: '20px' }}>
            <div className={formGrid}>
              <div className={inputContainer}>
                <button style={{marginBottom: '-2vh', marginTop:'-2vh', width:"20vw", marginLeft: "1.5vw", padding: "0.4vh", backgroundColor: "white", color: "black"}} onClick={() => setIsListVisible(!isListVisible)}>
                  {isListVisible ? 'Ocultar opciones' : 'Seleccionar categoria/s a eliminar'}
                </button>
                {isListVisible && (
                  <div className={listaFlotante}>
                    {listCategories.map((cat, index) => (
                      <button
                        key={index}
                        onClick={() => toggleCategoriesSelection(cat)}
                        className={`btn ${categories.includes(cat) ? 'btn-success' : 'btn-secondary'}`}
                        style={{backgroundColor:'white'}}
                      >
                        Categoria: {cat}
                        {categories.includes(cat) ? ' (Seleccionado)' : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={inputContainer}>
                <input
                  className={inputText}
                  value={valId}
                  onChange={handleInputChangeId}
                  placeholder='Ingrese un ID'
                  type='text'
                />
                <button type="button" style={{padding: "1vh", paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw'}} onClick={handleAddId}>Añadir+</button>
                {console.log("codigo", listIds)}
                {listIds.length > 0 ? (
                  <div className={floatingWindow} style={{right: "39vw", top: "84vh", width: "19vw"}}>
                    <ul className={productList}>
                      {listIds.map((codigo, index) => (
                        <li key={index} className={productItem}>
                          Relacion {index} con ID ➡️ {codigo}
                          <button type="button" className={productButton} style={{ backgroundColor: "transparent"}} onClick={() => handleDeleteId(codigo)}>
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  null
                )}
                <button type="button" style={{padding: "1vh", paddingBottom: "0.4vh", paddingTop: "0.4vh", marginLeft: '1vw', width: "10vw", backgroundColor: "green"}} onClick={deleteProperties}>Eliminar propiedad/es</button>
              </div>
            </div>
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