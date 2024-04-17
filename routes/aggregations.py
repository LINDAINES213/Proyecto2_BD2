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
