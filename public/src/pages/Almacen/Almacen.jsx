import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { container, header, detail, buttonContainer, inputContainer, inputText, crud, leftAligned, editButton, scrollableTable, backgroundContainer,
  formGrid, centeredDiv, } from './Almacen.module.css';
import { Loading } from '../../components';

const Almacen = () => {
  const [almacen, setAlmacen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0)

  useEffect(() => {
    setLoading(true);
    axios.get('https://frail-maryanne-uvg.koyeb.app/nodes/Almacen')
      .then(response => {
        // Asumiendo que la API devuelve un solo objeto de almacen
        setAlmacen(response.data.response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
  
   if (loading) {
    return <div className={centeredDiv}><Loading /></div>;
  }

  if (!almacen) {
    return <div className={centeredDiv}>No hay datos disponibles.</div>;
  }

  const formatDate = (date) => {
    // Assuming date._Date__month is zero-indexed
    const formattedDate = `${date._Date__day}/${date._Date__month + 1}/${date._Date__year}`;
    return formattedDate;
  }
  

  return (
    <div className={backgroundContainer}>
      <div className={container}>
        <div className={header}>
          <h3 style={{borderBottom: "0", margin: "0", color: "#000000"}}>Información del Almacén:</h3>
        </div>
        <p className={detail} ><strong>ID:</strong> {almacen[0].id}</p>
        <p className={detail}><strong>Fecha de Inauguración:</strong> {formatDate(almacen[0].fecha_de_inauguracion)}</p>
        <p className={detail}><strong>Presupuesto:</strong> ${almacen[0].presupuesto}</p>
        <p className={detail}><strong>Dirección:</strong> {almacen[0].direccion}</p>
        <p className={detail}><strong>Capacidad de Vehículos:</strong> {almacen[0].capacidad_vehiculos}</p>
        <p className={detail}><strong>Capacidad Total:</strong> {almacen[0].capacidad_total}</p>
      </div>
    </div>
  );
}

export default Almacen;
