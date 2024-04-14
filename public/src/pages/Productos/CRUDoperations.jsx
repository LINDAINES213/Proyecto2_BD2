import { useEffect, useState } from 'react'
import { buttonContainer, inputContainer, inputText, selectText, crud, leftAligned, editButton, scrollableTable,
  formGrid, buttonContainerOptions, centeredDiv, inputTextSmall, buttonContainerOptionsLimit
 } from './CRUDoperations.module.css'
import { Loading } from '../../components'
import axios from 'axios'

const CRUDoperations = () => {
  const [users, setUsers] = useState([])
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState()
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [limit, setLimit] = useState()
  const [selectedOption, setSelectedOption] = useState('verUsuarios')
  const [loading, setLoading] = useState(false)

  const handleButtonClick = (option) => {
    setSelectedOption(option)
    switch (option) {
      case 'verUsuarios':
        fetchData()
        setLimit()
        break
      case 'agruparPorPais':
        fetchDataPerCountry()
        break
      case 'edadPromedioPorGenero':
        fetchDataAvgAgePerGender()
        break
      default:
        console.log("Error fetching data")
    }
  }

  useEffect(() => {
    setLoading(true)
    axios.get("https://frail-maryanne-uvg.koyeb.app/")
      .then((res) => {
        setUsers(res.data)
        setId(0)
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setEmail('')
        setPhone('')
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
      axios.post("https://frail-maryanne-uvg.koyeb.app/", {
        name,
        age,
        gender,
        country,
        contact: {
          email,
          phone
        }
      }).then(() => {
        fetchData()
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setEmail('')
        setPhone('')
      })
    } else {
      axios.put(`https://frail-maryanne-uvg.koyeb.app//${id}`, {
        name,
        age,
        gender,
        country,
        contact: {
          email,
          phone
        }
      }).then(() => {
        fetchData()
        setName('')
        setAge('')
        setGender('')
        setCountry('')
        setEmail('')
        setPhone('')
      })
    }
  }
  
  const deleteData = (id) => {
    axios.delete(`https://frail-maryanne-uvg.koyeb.app//${id}`)
      .then(() => {
        fetchData()
      })
  }

  const editusers = (id) => {
    axios.get(`https://proyecto-basesdatos2-uvg.koyeb.app/editusers/${id}`)
      .then((res) => {
        setName(res.data.name),
        setAge(res.data.age),
        setGender(res.data.gender),
        setCountry(res.data.country),
        setEmail(res.data.contact.email),
        setPhone(res.data.contact.phone),
        setId(res.data._ID)
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
        setUsers(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })  
  }
  
  
  const fetchDataPerCountry = () => {
    setLoading(true)
    axios.get("https://frail-maryanne-uvg.koyeb.app/_per_country")
      .then((res) => {
        setUsers(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchDataAvgAgePerGender = () => {
    setLoading(true)
    axios.get("https://proyecto-basesdatos2-uvg.koyeb.app/age_average_per_gender")
      .then((res) => {
        console.log("res",res)
        setUsers(res.data)
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
            <h3>Añadir usuario:</h3>
            <form onSubmit={(e) => submit(e, id)}>
              <div className={formGrid}>
                <div className={inputContainer}>
                    <i className="material-icons prefix">person</i>
                    <input className={inputText} value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Nombre' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">cake</i>
                    <input className={inputText} value={age} onChange={(e) => setAge(parseInt(e.target.value,10))} type="number" placeholder='Edad' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">wc</i>
                    <select className={selectText} value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="" disabled>Seleccionar género</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">location_on</i>
                    <input className={inputText} value={country} onChange={(e) => setCountry(e.target.value)} type="text" placeholder='País' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">mail</i>
                    <input className={inputText} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Correo' />
                </div>
                <div className={inputContainer}>
                    <i className="material-icons prefix">contact_phone</i>
                    <input className={inputText} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
                        placeholder='Teléfono' />
                    <div className={buttonContainer}>
                        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action">Enviar 
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>
              </div>
            </form>
          </div>
          <h4>Limitar cantidad de usuarios a mostrar:</h4>
          <div className={buttonContainerOptionsLimit}>
              <input className={inputTextSmall} value={limit} onChange={(e) => setLimit(e.target.value)} 
                type="number" placeholder='Cantidad:' />
              <div className={buttonContainer}>
                  <button className=" btn btn-sm btn-primary waves-effect waves-light right" name="action" 
                  onClick={() => fetchData(limit)}>Limitar 
                    <i className="material-icons prefix" style={{marginLeft: "0.3vw"}}>remove_circle_outline</i>
                  </button>
              </div>
          </div>
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Género</th>
                <th>País</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </thead>
              <tbody>
                {users.map(user =>
                      <tr key={user._ID}>
                        <td className={leftAligned}>{user.name}</td>
                        <td>{user.age}</td>
                        <td>{user.gender}</td>
                        <td>{user.country}</td>
                        <td>{user.contact.email}</td>
                        <td>{user.contact.phone}</td>
                        <td>
                          <button onClick={() => editusers(user._ID)} className={editButton} type="submit" name="action">
                            <i className="material-icons ">edit</i>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => deleteData(user._ID)} className="btn btn-sm btn-danger waves-light " type="submit" name="action">
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
      case 'agruparPorPais':
        return (
          <div className={scrollableTable}>
            <table className='table'>
              <thead>
                <th>País</th>
                <th>Cantidad de personas</th>
              </thead>
              <tbody>
                {users.map(user =>
                      <tr key={user._id}>
                        <td className={leftAligned}>{user._id}</td>
                        <td>{user.total}</td>
                      </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      case 'edadPromedioPorGenero':
        return (
          <div className={scrollableTable}>
          <table className='table'>
            <thead>
              <th>Género</th>
              <th>Edad promedio</th>
            </thead>
            <tbody>
              {users.map(user =>
                    <tr key={user._id}>
                      <td className={leftAligned}>{user._id}</td>
                      <td>{user.average_age}</td>
                    </tr>
              )}
            </tbody>
          </table>
        </div>
        )
      default:
        return null
    }
  }

  return (
  <div className={crud}>
    <div className='row mt-5'>
      <div className={buttonContainerOptions}>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('verUsuarios')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>person</i> Ver usuarios
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('agruparPorPais')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>location_city</i> 10 países con más usuarios
        </button>
        <button className=" btn btn-sm btn-primary waves-effect waves-light right" type="submit" name="action"
          onClick={() => handleButtonClick('edadPromedioPorGenero')}>
            <i className="material-icons right" style={{marginRight: "1vh"}}>cake</i> Edad promedio por género
        </button>
      </div>
      {renderTable()}
    </div>
  </div>  
  )
}

export default CRUDoperations
