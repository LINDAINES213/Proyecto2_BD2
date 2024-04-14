import pandas as pd
import random
from neo4j import GraphDatabase
import os

import pandas as pd
import random
from datetime import datetime, timedelta

def random_date():
    start_date = datetime.now() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return (start_date + timedelta(days=random_days)).date()

def generateSOLICITA():
    # Suponiendo que los dataframes ya están cargados
    clientes_df = pd.read_csv('scripts/Cliente.csv')
    ordenes_df = pd.read_csv('scripts/OrdenDeCompra.csv')
    
    # Definir posibles categorías y otras propiedades
    categorias_possibles = ['Electrónica', 'Ropa', 'Hogar', 'Jardinería', 'Deportes']
    uso_possibles = ["Personal", "Venta"]
    accesibilidad_possibles = ["Interior", "Exterior"]

    relaciones = []
    
    # Supongamos que cada Orden de Compra se enlaza a un Cliente
    for _, orden in ordenes_df.iterrows():
        id_cliente = orden['id_cliente']  # Asumiendo existencia de esta columna
        categorias = ":".join(random.sample(categorias_possibles, k=random.randint(1, len(categorias_possibles))))
        uso = random.choice(uso_possibles)
        accesibilidad = random.choice(accesibilidad_possibles)
        
        relaciones.append({
            "id_cliente": id_cliente,
            "id_orden_compra": orden['id'],
            "categorias": categorias,
            "uso": uso,
            "accesibilidad": accesibilidad
        })
    
    # Convertir a DataFrame y guardar en CSV
    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_SOLICITA.csv', index=False)
    print("Archivo 'Relaciones_SOLICITA.csv' creado con éxito.")

def loadSOLICITA(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                
                # Convertir la cadena de categorías a lista
                properties['categorias'] = properties['categorias'].split(':')
                print("Datos crudos limpios:", properties)
                query = """
                MATCH (c:Cliente {id: $id_cliente})
                MATCH (o:OrdenDeCompra {id: $id_orden_compra})
                MERGE (c)-[r:SOLICITA]->(o)
                SET r.categorias = $categorias,
                    r.uso = $uso,
                    r.accesibilidad = $accesibilidad
                """
                session.run(query, properties)

        print("All relationships have been imported.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_SOLICITA.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relationships loaded successfully.")