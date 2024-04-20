import { useState, useEffect } from 'react';
import axios from 'axios';
import { crud, leftAligned, editButton, scrollableTable, listaFlotante, inputContainer,
  formGrid, centeredDiv,
 } from './Estadisticas.module.css'
import { Loading } from '../../components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Estadisticas = () => {

  const [isListVisible, setIsListVisible] = useState(false);
  const [estadistica, setEstadistica] = useState([])
  const [selectedOption, setSelectedOption] = useState('ordenDeCompra')
  const [loading, setLoading] = useState(false)
  const [productos, setproductos] = useState([]);
  const [productosList, setProductosList] = useState([]);


  const toggleProductSelection = (productId) => {
    if (productos.includes(productId)) {
      setproductos(productos.filter(id => id !== productId));
    } else {
      setproductos([...productos, productId]);
    }
  };


  useEffect(() => {
    setLoading(true)
    axios.get('https://frail-maryanne-uvg.koyeb.app/sumatoria_total_ordenes')
      .then(response => {
        console.log("p",response)
        setEstadistica(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      }).finally(() => {
        setLoading(false)
        axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Producto')
        .then(response => {
          setProductosList(response.data.response);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      })
  }, [])

  const changeView = (newView) => {
    setSelectedOption(newView);

    if (newView==='ordenDeCompra') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/sumatoria_total_ordenes')
        .then(response => {
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }
    if (newView==='vehiculos') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/vehiculos_por_modelo_anio')
        .then(response => {
          console.log("vehiculos", response)
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }

    if (newView==='productosPorProveedor') {
      setLoading(true)
      axios.get('https://frail-maryanne-uvg.koyeb.app/productos_por_proveedor')
        .then(response => {
          console.log("vehiculos", response)
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  
    }
  }
  
  const handleConsultar = (id) => {
    axios.get('https://frail-maryanne-uvg.koyeb.app/get_similares/{}')
        .then(response => {
          console.log("vehiculos", response)
          setEstadistica(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        }).finally(() => {
          setLoading(false)
        })
  }
  const ProveedorChart = ({ estadistica }) => {
    if (!estadistica || !estadistica.productos_proveedores || estadistica.productos_proveedores.length === 0) {
      return <p>No hay datos disponibles para mostrar.</p>;
    }
  
    const data = {
      labels: estadistica.productos_proveedores.map(item => item.nombre),
      datasets: [
        {
          label: 'Cantidad de Productos Distintos',
          data: estadistica.productos_proveedores.map(item => item.cantidad_productos),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'white', // Cambiar el color de los ticks de la escala y
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)' // Cambiar el color de las líneas de la cuadrícula
          }
        },
        x: {
          ticks: {
            color: 'white', // Cambiar el color de los ticks de la escala x
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)' // Cambiar el color de las líneas de la cuadrícula
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white' // Cambiar el color del texto de la leyenda
          }
        },
        title: {
          display: true,
          text: 'Cantidad de Productos por Proveedor',
          color: 'white' // Cambiar el color del título
        },
        tooltip: {
          titleColor: 'white', // Cambiar el color del título del tooltip
          bodyColor: 'white', // Cambiar el color del cuerpo del tooltip
          backgroundColor: 'rgba(0, 0, 0, 0.7)' // Cambiar el color de fondo del tooltip
        }
      }
    };
  
    return <Bar data={data} options={options} />;
  }

  const ModeloVehiculoChart = ({ estadistica }) => {
    if (!estadistica || !estadistica.vehiculos_por_modelo_anio || estadistica.vehiculos_por_modelo_anio.length === 0) {
      return <p>No hay datos disponibles para mostrar.</p>;
    }
  
    const data = {
      labels: estadistica.vehiculos_por_modelo_anio.map(item => item.modelo),
      datasets: [
        {
          label: 'Cantidad Total de Vehículos',
          data: estadistica.vehiculos_por_modelo_anio.map(item => item.cantidad),
          backgroundColor: 'rgba(75, 192, 192, 0.8)', // Un verde suave para el fondo
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        },
        title: {
          display: true,
          text: 'Cantidad Total de Vehículos por Modelo',
          color: 'white'
        },
        tooltip: {
          titleColor: 'white',
          bodyColor: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }
      }
    };
  
    return <Bar data={data} options={options} />;
  }

  
  const TotalVentasChart = ({ estadistica }) => {
    if (!estadistica || estadistica.total_ordenes === undefined) {
      return <p>No hay datos disponibles para mostrar.</p>;
    }
  
    const data = {
      labels: ['Total de Ventas'],
      datasets: [
        {
          label: 'Sumatoria del Total de Ventas',
          data: [estadistica.total_ordenes],
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        }
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        },
        title: {
          display: true,
          text: 'Sumatoria del Total de Ventas',
          color: 'white'
        },
        tooltip: {
          titleColor: 'white',
          bodyColor: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }
      }
    };
  
    return <Bar data={data} options={options} />;
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
      case 'ordenDeCompra':
        return (
          <TotalVentasChart estadistica={estadistica} />
        );
      case 'vehiculos':
        return (
          <ModeloVehiculoChart estadistica={estadistica} />
        );
      case 'productosPorProveedor':
        return (
          <ProveedorChart estadistica={estadistica} />
        );
      case 'algoritmo':
        return (
          <div>
            <div className={formGrid}>
              <div className={inputContainer}>
                  <button  type="button" style={{marginBottom: '-2vh', width:"20vw", marginLeft: "1.5vw", padding: "0.4vh", backgroundColor: "white", color: "black"}} onClick={() => setIsListVisible(!isListVisible)}>
                    {isListVisible ? 'Ocultar opciones' : 'Seleccionar productos'}
                  </button>
                  {isListVisible && (
                    <div className={listaFlotante}>
                      {productosList.map((producto, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleProductSelection(producto.id)}
                          className={`btn ${productos.includes(producto.id) ? 'btn-success' : 'btn-secondary'}`}
                          style={{backgroundColor:'white'}}
                        >
                          ID: {producto.id} - {producto.nombre}
                          {productos.includes(producto.id) ? ' (Seleccionado)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                  <button  type="button" style={{marginBottom: '-2vh', width:"20vw", marginLeft: "1.5vw", padding: "0.4vh", backgroundColor: "white", color: "black"}} onClick={() => setIsListVisible(!isListVisible)}>
                    {isListVisible ? 'Ocultar opciones' : 'Seleccionar productos'}
                  </button>
                </div>
                
            </div>
          </div>
        );
      default:
        return null
    }
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button className="btn btn-primary" onClick={() => changeView('ordenDeCompra')}>
          Total ordenes de compra
        </button>
        <button className="btn btn-primary" onClick={() => changeView('vehiculos')}>
          Cantidad de vehiculos por modelo
        </button>
        <button className="btn btn-primary" onClick={() => changeView('productosPorProveedor')}>
          Cantidad de productos por proveedor
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default Estadisticas