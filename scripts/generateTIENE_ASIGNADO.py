import pandas as pd
import random
from datetime import datetime, timedelta
from neo4j import GraphDatabase

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generateTIENE_ASIGNADO():
    # Carga de los CSV
    personal_df = pd.read_csv('scripts/Personal.csv')
    vehiculo_df = pd.read_csv('scripts/Vehiculos.csv')

    relaciones = []

    # Asegurar al menos una relación para cada Personal y Vehiculo
    personal_ids = personal_df['id'].tolist()
    vehiculo_ids = vehiculo_df['id'].tolist()

    random.shuffle(personal_ids)
    random.shuffle(vehiculo_ids)

    min_length = min(len(personal_ids), len(vehiculo_ids))
    
    for i in range(min_length):
        km_recorridos = random.randint(0, 200000)
        fecha_de_asignacion = random_date()
        cantidad_entregas_realizadas = random.randint(0, 1000)
        
        relaciones.append({
            "id_personal": personal_ids[i],
            "id_vehiculo": vehiculo_ids[i],
            "km_recorridos": km_recorridos,
            "fecha_de_asignacion": fecha_de_asignacion,
            "cantidad_entregas_realizadas": cantidad_entregas_realizadas
        })

    # Convertir a DataFrame y guardar en CSV
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_TIENE_ASIGNADO.csv', index=False)
    print("Archivo 'Relaciones_TIENE_ASIGNADO.csv' creado con éxito.")

def loadTIENE_ASIGNADO(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                
                # Asegurar que los tipos de datos sean los correctos para Neo4j
                properties['km_recorridos'] = int(properties['km_recorridos'])
                properties['fecha_de_asignacion'] = properties['fecha_de_asignacion']  # ya es string adecuado para Neo4j
                properties['cantidad_entregas_realizadas'] = int(properties['cantidad_entregas_realizadas'])
                print("Datos crudos limpios:", properties)
                query = """
                MATCH (p:Personal {id: $id_personal})
                MATCH (v:Vehiculo {id: $id_vehiculo})
                MERGE (p)-[r:TIENE_ASIGNADO]->(v)
                SET r.km_recorridos = $km_recorridos,
                    r.fecha_de_asignacion = date($fecha_de_asignacion),
                    r.cantidad_entregas_realizadas = $cantidad_entregas_realizadas
                """
                session.run(query, properties)

        print("Todas las relaciones han sido importadas.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_TIENE_ASIGNADO.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")
