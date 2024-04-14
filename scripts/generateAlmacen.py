from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generateAlmacen():
    nodo_schema = ["id", "direccion", "capacidad_total", "capacidad_vehiculos", "presupuesto", "fecha_de_inauguracion"]

    with open('scripts/Almacen.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(1):  # Generar 700 nodos como solicitado
            writer.writerow([
                id + 1,  # ID
                fake.address().replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", ""),  # Dirección
                random.randint(4000, 5000),  # Capacidad total
                random.randint(700, 1000),  # Capacidad de vehículos
                round(random.uniform(75000, 200000), 2),  # Presupuesto
                fake.date_between(start_date="-30y", end_date="today").strftime("%Y-%m-%d")  # Fecha de inauguración
            ])

    print("Archivo CSV generado exitosamente.")

def loadAlmacen(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {}
                for header, value in zip(headers, data):
                    if header in ["capacidad_total", "capacidad_vehiculos"]:
                        properties[header] = int(value)
                    elif header == "presupuesto":
                        properties[header] = float(value)
                    elif header == "fecha_de_inauguracion":
                        properties[header] = f"date('{value}')"
                    else:
                        properties[header] = f"'{value}'"  # Añadir comillas solo a las propiedades de tipo string
                cypher_query = f"CREATE (n:{label} {{"
                cypher_query += ', '.join([f"{key}: {val}" for key, val in properties.items()])
                cypher_query += "})"
                session.run(cypher_query)

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = './scripts/Almacen.csv'
    label = 'Almacen'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()