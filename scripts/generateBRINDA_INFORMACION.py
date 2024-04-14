import pandas as pd
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generateBRINDA_INFORMACION():
    almacen_df = pd.read_csv('scripts/Almacen.csv')
    publicidad_df = pd.read_csv('scripts/Publicidad.csv')

    relaciones = []

    almacen_ids = almacen_df['id'].tolist()
    publicidad_ids = publicidad_df['id'].tolist()

    random.shuffle(almacen_ids)
    random.shuffle(publicidad_ids)

    min_length = min(len(almacen_ids), len(publicidad_ids))
    
    for i in range(min_length):
        fecha_brindada = random_date()
        presupuesto = round(random.uniform(1000.0, 50000.0), 2)
        solicitud = fake.text(max_nb_chars=30).replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", "")       
        
        relaciones.append({
            "id_almacen": almacen_ids[i],
            "id_publicidad": publicidad_ids[i],
            "fecha_brindada": fecha_brindada,
            "presupuesto": presupuesto,
            "solicitud": solicitud
        })

    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_BRINDA_INFORMACION.csv', index=False)
    print("Archivo 'Relaciones_BRINDA_INFORMACION.csv' creado con éxito.")

### Modificación del script para cargar la relación "BRINDA_INFORMACION" en Neo4j

from neo4j import GraphDatabase

def loadBRINDA_INFORMACION(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                
                # Convertir el presupuesto a float
                properties['presupuesto'] = float(properties['presupuesto'])
                print("Datos crudos limpios:", properties)    
                query = """
                MATCH (a:Almacen {id: $id_almacen})
                MATCH (p:Publicidad {id: $id_publicidad})
                MERGE (a)-[r:BRINDA_INFORMACION]->(p)
                SET r.fecha_brindada = date($fecha_brindada),
                    r.presupuesto = $presupuesto,
                    r.solicitud = $solicitud
                """
                session.run(query, properties)

        print("Todas las relaciones han sido importadas.")


    with driver.session() as session:
        csv_path = 'scripts/Relaciones_BRINDA_INFORMACION.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones cargadas exitosamente.")

