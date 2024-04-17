import uuid
from fastapi import APIRouter
from database.db import connection

# Definir un enrutador de API para la sección de usuarios
aggregations = APIRouter()

@aggregations.get("/sumatoria_total_ordenes")
def sumatoria_total_ordenes():
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (o:OrdenDeCompra)
    RETURN SUM(o.total) AS total_ordenes
    '''

    result = session.run(query)
    total_ordenes = result.single()["total_ordenes"]

    return {"total_ordenes": total_ordenes}

@aggregations.get("/vehiculos_por_modelo_anio")
def vehiculos_por_modelo_anio():
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (v:Vehiculo)
    RETURN v.modelo AS modelo, COUNT(v) AS cantidad
    ORDER BY cantidad DESC
    '''

    result = session.run(query)

    vehiculos_por_modelo_anio = []
    for record in result:
        vehiculos_por_modelo_anio.append({
            "modelo": record["modelo"],
            "cantidad": record["cantidad"]
        })

    return {"vehiculos_por_modelo_anio": vehiculos_por_modelo_anio}

