import pandas as pd
import random
import datetime
from datetime import timedelta
from neo4j import GraphDatabase
import os

def random_date():
    """Genera una fecha aleatoria dentro de los últimos 3 años."""
    start_date = datetime.date.today() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return start_date + timedelta(days=random_days)

def generateREABASTECE():
    # Cargar datos
    proveedores_df = pd.read_csv('scripts/Proveedor.csv')
    almacenes_df = pd.read_csv('scripts/Almacen.csv')
    
    # Asumimos que solo hay un almacén, tomamos su ID
    id_unico_almacen = almacenes_df['id'].iloc[0]
    
    # Lista para guardar las relaciones
    relaciones = []
    
    # Asignar el único ID de almacén a todos los proveedores
    proveedores_ids = proveedores_df['id'].tolist()
    
    for proveedor_id in proveedores_ids:
        relaciones.append({
            "id_proveedor": proveedor_id,
            "id_almacen": id_unico_almacen,
            "fecha_de_reabastecimiento": random_date().isoformat(),
            "calidad_del_producto": random.randint(1, 10),
            "monto": round(random.uniform(4000, 7000), 2)
        })
    
    # Convertir lista de relaciones a DataFrame
    relaciones_df = pd.DataFrame(relaciones)
    
    # Guardar las relaciones en un archivo CSV
    relaciones_df.to_csv('scripts/Relaciones_Reabastece.csv', index=False)
    print("Archivo 'Relaciones_Reabastece.csv' creado con éxito.")


def loadREABASTECE(uri, usuario, contraseña):
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

                # Convertir a los tipos adecuados
                properties['calidad_del_producto'] = int(properties['calidad_del_producto'])
                properties['monto'] = float(properties['monto'])
                print("Datos crudos limpios:", properties)

                # Crear la relación con sus propiedades
                query = """
                MATCH (p:Proveedor {id: $id_proveedor})
                MATCH (a:Almacen {id: $id_almacen})
                MERGE (p)-[r:REABASTECE]->(a)
                SET r.fecha_de_reabastecimiento = date($fecha_de_reabastecimiento),
                    r.calidad_del_producto = $calidad_del_producto,
                    r.monto = $monto
                """
                session.run(query, properties)

        print("Todas las relaciones fueron importadas.")

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = 'scripts/Relaciones_Reabastece.csv'
    with driver.session() as session:
        importar_relaciones(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")