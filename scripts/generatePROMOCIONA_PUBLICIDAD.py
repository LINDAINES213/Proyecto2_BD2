import pandas as pd
import random
from datetime import datetime, timedelta
from neo4j import GraphDatabase
from faker import Faker

fake = Faker()

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generatePROMOCIONA_PUBLICIDAD():
    # Carga de los CSV
    personal_df = pd.read_csv('scripts/Personal.csv')
    publicidad_df = pd.read_csv('scripts/Publicidad.csv')

    relaciones = []

    # Asegurar al menos una relación para cada Personal y Publicidad
    personal_ids = personal_df['id'].tolist()
    publicidad_ids = publicidad_df['id'].tolist()

    random.shuffle(personal_ids)
    random.shuffle(publicidad_ids)

    min_length = min(len(personal_ids), len(publicidad_ids))
    
    for i in range(min_length):
        fecha_asignado = random_date()
        tiempo_asignado = random.randint(1, 24)  # tiempo en meses
        trabajo_a_realizar = fake.text(max_nb_chars=50).replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", "")        
        relaciones.append({
            "id_personal": personal_ids[i],
            "id_publicidad": publicidad_ids[i],
            "fecha_asignado": fecha_asignado,
            "tiempo_asignado": tiempo_asignado,
            "trabajo_a_realizar": trabajo_a_realizar
        })

    # Convertir a DataFrame y guardar en CSV
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_PROMOCIONA_PUBLICIDAD.csv', index=False)
    print("Archivo 'Relaciones_PROMOCIONA_PUBLICIDAD.csv' creado con éxito.")

def loadPROMOCIONA_PUBLICIDAD(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                
                # Asegurar que los tipos de datos sean los correctos para Neo4j
                properties['tiempo_asignado'] = int(properties['tiempo_asignado'])
                properties['fecha_asignado'] = properties['fecha_asignado']  # ya es string adecuado para Neo4j
                query = """
                MATCH (p:Personal {id: $id_personal})
                MATCH (a:Publicidad {id: $id_publicidad})
                MERGE (p)-[r:PROMOCIONA_PUBLICIDAD]->(a)
                SET r.fecha_asignado = date($fecha_asignado),
                    r.tiempo_asignado = $tiempo_asignado,
                    r.trabajo_a_realizar = $trabajo_a_realizar
                """
                session.run(query, properties)

        print("Todas las relaciones han sido importadas.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_PROMOCIONA_PUBLICIDAD.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")

