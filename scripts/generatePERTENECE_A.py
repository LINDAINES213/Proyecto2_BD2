import pandas as pd
import random
from datetime import datetime, timedelta
from neo4j import GraphDatabase

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generatePERTENECE_A():
    # Cargar los CSV
    vehiculo_df = pd.read_csv('scripts/Vehiculos.csv')
    almacen_df = pd.read_csv('scripts/Almacen.csv')

    relaciones = []

    # Asegurar al menos una relación para cada Vehiculo, mientras haya almacenes disponibles
    almacen_ids = almacen_df['id'].tolist()
    vehiculo_ids = vehiculo_df['id'].tolist()

    random.shuffle(vehiculo_ids)

    for vehiculo_id in vehiculo_ids:
        if not almacen_ids:
            break  # No hay más almacenes disponibles
        almacen_id = random.choice(almacen_ids)
        almacen_ids.remove(almacen_id)  # Remover el almacén elegido de la lista disponible

        fecha_adquisicion = random_date()
        estado = True  # Predominantemente true
        mantenimiento = bool(random.getrandbits(1))
        
        relaciones.append({
            "id_vehiculo": vehiculo_id,
            "id_almacen": almacen_id,
            "fecha_adquisicion": fecha_adquisicion,
            "estado": estado,
            "mantenimiento": mantenimiento
        })

    # Convertir a DataFrame y guardar en CSV
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_PERTENECE_A.csv', index=False)
    print("Archivo 'Relaciones_PERTENECE_A.csv' creado con éxito.")

def loadPERTENECE_A(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                
                properties['estado'] = properties['estado'] == 'True'
                properties['mantenimiento'] = properties['mantenimiento'] == 'True'
                
                print("Datos crudos limpios:", properties)
                query = """
                MATCH (v:Vehiculo {id: $id_vehiculo})
                MATCH (a:Almacen {id: $id_almacen})
                MERGE (v)-[r:PERTENECE_A]->(a)
                SET r.fecha_adquisicion = date($fecha_adquisicion),
                    r.estado = $estado,
                    r.mantenimiento = $mantenimiento
                """
                session.run(query, properties)

        print("Todas las relaciones han sido importadas.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_PERTENECE_A.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")
