import pandas as pd
import random
from neo4j import GraphDatabase
import os

def generateRECIBE():
    # Cargar datos
    almacenes_df = pd.read_csv('scripts/Almacen.csv')
    ordenes_df = pd.read_csv('scripts/OrdenDeCompra.csv')
    
    # Asumir que hay solo un almacén
    almacen_id = almacenes_df['id'].iloc[0]  # Obtener el ID del único almacén
    
    # Lista para guardar las relaciones
    relaciones = []
    
    # Asignar el único almacen a cada orden de compra
    for orden_id in ordenes_df['id']:
        prioridad = random.choice(["alta", "media", "baja"])
        tiempo_estimado = random.randint(1, 20)
        peso = random.randint(0, 800)
        
        relaciones.append({
            "id_almacen": almacen_id,
            "id_orden": orden_id,
            "prioridad": prioridad,
            "tiempo_estimado": tiempo_estimado,
            "peso": peso
        })
    
    # Convertir lista de relaciones a DataFrame
    relaciones_df = pd.DataFrame(relaciones)
    
    # Guardar las relaciones en un archivo CSV
    relaciones_df.to_csv('scripts/Relaciones_Recibe.csv', index=False)
    print("Archivo 'Relaciones_RECIBE.csv' creado con éxito.")

def loadRECIBE(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_relaciones(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            headers = [header.strip().replace('"', '') for header in headers]
            for line in lines[1:]:
                data = line.strip().split(',')
                data = [element.strip().replace('"', '') for element in data]
                properties = {header: value for header, value in zip(headers, data)}
                # Crear la relación con sus propiedades
                query = """
                MATCH (a:Almacen {id: $id_almacen})
                MATCH (o:OrdenDeCompra {id: $id_orden})
                MERGE (a)-[r:RECIBE]->(o)
                SET r.prioridad = $prioridad,
                    r.tiempo_estimado = toInteger($tiempo_estimado),
                    r.peso = toInteger($peso)
                """
                session.run(query, properties)

        print("Todas las relaciones fueron importadas.")

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = 'scripts/Relaciones_Recibe.csv'
    with driver.session() as session:
        importar_relaciones(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")

