import { useState, useEffect } from 'react';
import axios from 'axios';

import { buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable,
  formGrid, centeredDiv,
} from './Proveedores.module.css'
import { Loading } from '../../components';

 const Proveedor = () => {
  const [proveedores, setProveedores] = useState([])
  const [id, setId] = useState(0)
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [tipo_de_producto, setTipo_de_producto] = useState('')
  const [selectedOption, ] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)
  const [providerId, setProviderId] = useState('');
  const [providerData, setProviderData] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchProviderInfo = async () => {
    if (!providerId) return; // Si no hay ID, no hacer nada
    setIsLoadingSearch(true);
    axios.get(`https://frail-maryanne-uvg.koyeb.app/nodes/Proveedor/${providerId}`)
    .then(response => {
      setProviderData(response.data.response);
    })
    .catch((error) => {
      setError("No se encontró información para ese proveedor")
      console.error('Error fetching data:', error)
    }).finally(() => {
      setIsLoadingSearch(false)
      if (providerData !== null) {
        if (providerData.length===0) {
          setError("No se encontró información para ese proveedor")
  
        } else{
          setError('')
        }
      }

    })
  };

  const emptyProduct = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    tipo_de_producto: ''
};
  const [products, setProducts] = useState([emptyProduct]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (e) => {
      const newProducts = [...products];
      newProducts[currentIndex][e.target.name] = e.target.value;
      setProducts(newProducts);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Enviando productos:', products);
  };

  const addProduct = () => {
      const newProducts = [...products, emptyProduct];
      setProducts(newProducts);
      setCurrentIndex(newProducts.length - 1); // Mover al nuevo producto
  };

  const goToNextProduct = () => {
      if (currentIndex < products.length - 1) {
          setCurrentIndex(currentIndex + 1);
      }
  };

  const goToPreviousProduct = () => {
      if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
      }
  };



  // Paginacion
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; 
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const productosSeguros = proveedores ?? [];
  const currentData = productosSeguros.slice(startIndex, endIndex);
  const pageCount = Math.ceil(productosSeguros.length / pageSize);
  const nextPage = () => { setCurrentPage(current => (current + 1 < pageCount) ? current + 1 : current); };
  const prevPage = () => { setCurrentPage(current => (current - 1 >= 0) ? current - 1 : current);};
  
  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Proveedor')
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
      axios.post("https://frail-maryanne-uvg.koyeb.app/create_proveedor", {
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
      axios.put(`https://frail-maryanne-uvg.koyeb.app/update_proveedor/${id}`, {
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
    axios.delete(`https://frail-maryanne-uvg.koyeb.app/delete_proveedor/${id}`)
      .then(() => {
        fetchData()
      })
  }



  const fetchData = () => {
  
    setLoading(true)

    //const parsedLimit = parseInt(limit)
    //const isLimitInteger = !isNaN(parsedLimit) && Number.isInteger(parsedLimit)    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Producto'
    const url = 'https://frail-maryanne-uvg.koyeb.app/nodes/Proveedor'
  
    axios.get(url)
      .then((res) => {
        setProveedores(res.data.response)
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
      console.log("info", proveedores)
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
            <h3 style={{ borderBottom: '3px solid #000000'}}>Añadir proveedor:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              {console.log("Informacion de productos", products)}
              <div className={formGrid}>
                <div className={inputContainer}>
                    <input className={inputText} name="nombre" value={products[currentIndex].nombre} onChange={handleChange} type="text" 
                      placeholder='Nombre del proveedor' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} name="direccion" value={products[currentIndex].direccion} onChange={handleChange} type="text" placeholder='Direccion' />
                </div>
                <div className={inputContainer}>
                    <input 
                      className={inputText} name="telefono" value={products[currentIndex].telefono} onChange={handleChange} placeholder='Telefono' type='tel'
                    />
                </div>
              </div>
              <div className={formGrid}>
                <div className={inputContainer}>
                      <input className={inputText} name="email" value={products[currentIndex].email} onChange={handleChange} placeholder='Email' type='email' />
                </div>
                <div className={inputContainer}>
                    <input className={inputText} name="tipo_de_producto" value={products[currentIndex].tipo_de_producto} onChange={handleChange} type="text" placeholder='Tipo de Producto' />
                    <div className={buttonContainer}>
                      <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"> Enviar  
                      <i className="material-icons right"> send</i>
                      </button>
                    </div>
                </div>
              </div>
              <div className={formGrid} style={{marginBottom: "1vh"}}>
                <button type="button" onClick={goToPreviousProduct} disabled={currentIndex === 0}>
                    Anterior
                </button>
                <button type="button" onClick={goToNextProduct} disabled={currentIndex === products.length - 1}>
                    Siguiente
                </button>
                <button type="button" onClick={addProduct}>Añadir Producto</button>
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
                <th>Eliminar</th>
              </thead>
              <tbody>
                {currentData.map(rest =>
                      <tr key={rest.id}>
                        <td className={leftAligned}>{rest.nombre}</td>
                        <td>{rest.direccion}</td>
                        <td>{rest.telefono}</td>
                        <td>{rest.email}</td>
                        <td>{rest.tipo_de_producto}</td>
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
          <div className={inputContainer}>
            <input 
              type="text"
              className={inputText}
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              placeholder="Ingrese el ID del proveedor"
            />
            <button onClick={fetchProviderInfo} disabled={isLoadingSearch} style={{backgroundColor:"transparent", padding: "0", marginLeft: '-1.5vw'}}>
              🔎
            </button>
          </div>
        </div>      
        {isLoadingSearch && <Loading />}
        {console.log("p", providerData)}
        {error && <p style={{backgroundColor: "white", borderRadius: "5px", color: 'red', display:"inline", padding: "0.5vh", marginLeft:"0.5vw", fontWeight:"bolder", }}>{error}</p>}
        {providerData && providerData.length > 0 ? (
          <div style={{backgroundColor: "white", borderRadius: "5px", display: "inline-block", position: 'absolute', top: '81vh', left: '39vw', padding: "0.5vh", zIndex: "5"}}>
            <p style={{padding: "0vh", margin:"0"}}><strong>Nombre:</strong> {providerData[0].nombre}</p>
            <p style={{padding: "0vh", margin:"0"}}><strong>Email:</strong> {providerData[0].email}</p>
            <p style={{padding: "0vh", margin:"0"}}><strong>Telefono:</strong> {providerData[0].telefono}</p>
            <p style={{padding: "0vh", margin:"0"}}><strong>Dirección:</strong> {providerData[0].direccion}</p>
            <p style={{padding: "0vh", margin:"0"}}><strong>Tipo de producto:</strong> {providerData[0].tipo_de_producto}</p>
          </div>
        ) : null}
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

export default Proveedor