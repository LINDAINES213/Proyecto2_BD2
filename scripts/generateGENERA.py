import pandas as pd
import random
from neo4j import GraphDatabase
from datetime import datetime, timedelta
from faker import Faker

faker = Faker()

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generateGENERA():
    factura_df = pd.read_csv('scripts/Factura.csv')
    orden_compra_df = pd.read_csv('scripts/OrdenDeCompra.csv')
    
    min_length = min(len(factura_df), len(orden_compra_df))
    factura_df = factura_df.sample(min_length).reset_index(drop=True)
    orden_compra_df = orden_compra_df.sample(min_length).reset_index(drop=True)
    
    relaciones = []
    
    for factura, orden_compra in zip(factura_df.itertuples(), orden_compra_df.itertuples()):
        entregada = random.choice([True, False])
        fecha_de_generacion = random_date()
        comentarios = faker.text(max_nb_chars=50)

        relaciones.append({
            "id_orden_compra": orden_compra.id,
            "id_factura": factura.id,
            "entregada": entregada,
            "fecha_de_generacion": fecha_de_generacion,
            "comentarios": comentarios
        })
    
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_GENERA.csv', index=False)
    print("Archivo 'Relaciones_GENERA.csv' creado con éxito.")

def loadGENERA(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}

                # Convertir la propiedad 'entregada' a booleano
                properties['entregada'] = True if properties['entregada'] == 'True' else False
                print("Datos crudos limpios:", properties)

                query = """
                MATCH (o:OrdenDeCompra {id: $id_orden_compra})
                MATCH (f:Factura {id: $id_factura})
                MERGE (o)-[r:GENERA]->(f)
                SET r.entregada = $entregada,
                    r.fecha_de_generacion = date($fecha_de_generacion),
                    r.comentarios = $comentarios
                """
                session.run(query, properties)

        print("All relationships have been imported.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_GENERA.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relationships loaded successfully.")

