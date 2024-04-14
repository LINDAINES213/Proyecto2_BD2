import pandas as pd
import random
from datetime import datetime, timedelta
from neo4j import GraphDatabase

def random_time():
    return datetime.now().replace(hour=random.randint(0, 23), minute=random.randint(0, 59), second=random.randint(0, 59)).time()

def generateENTREGA():
    vehiculo_df = pd.read_csv('scripts/Vehiculos.csv')
    cliente_df = pd.read_csv('scripts/Cliente.csv')

    relaciones = []
    vehiculo_ids = vehiculo_df['id'].tolist()
    cliente_ids = cliente_df['id'].tolist()

    random.shuffle(vehiculo_ids)
    random.shuffle(cliente_ids)

    estados = ["Buen estado", "Mal estado", "Estado intermedio"]
    min_length = min(len(vehiculo_ids), len(cliente_ids))

    for i in range(min_length):
        hora_de_entrega = random_time()
        estado_de_la_entrega = random.choice(estados)
        calificacion = random.randint(1, 5)
        
        relaciones.append({
            "id_vehiculo": vehiculo_ids[i],
            "id_cliente": cliente_ids[i],
            "hora_de_entrega": hora_de_entrega.strftime('%H:%M:%S'),
            "estado_de_la_entrega": estado_de_la_entrega,
            "calificacion": calificacion
        })

    # Convertir a DataFrame y guardar en CSV
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_ENTREGA.csv', index=False)
    print("Archivo 'Relaciones_ENTREGA.csv' creado con éxito.")

def loadENTREGA(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}

                # Convertimos explícitamente la calificación a entero.
                properties['calificacion'] = int(properties['calificacion'])
                print("Datos crudos limpios:", properties)
                query = """
                MATCH (v:Vehiculo {id: $id_vehiculo})
                MATCH (c:Cliente {id: $id_cliente})
                MERGE (v)-[r:ENTREGA]->(c)
                SET r.hora_de_entrega = time($hora_de_entrega),
                    r.estado_de_la_entrega = $estado_de_la_entrega,
                    r.calificacion = $calificacion
                """
                session.run(query, properties)

        print("Todas las relaciones han sido importadas.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_ENTREGA.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")
