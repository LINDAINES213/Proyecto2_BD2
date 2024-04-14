from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generatePublicidad():
    nodo_schema = ["id", "nombre", "alcance", "costo", "descripcion", "duracion"]

    with open('scripts/Publicidad.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(700):  # Generar 700 nodos como solicitado
            writer.writerow([
                id + 1,
                fake.company().replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", ""),  # Nombre de la compañía simulada
                random.randint(1000, 1000000),  # Alcance estimado
                round(random.uniform(1000.0, 50000.0), 2),  # Costo en algún rango razonable
                fake.text(max_nb_chars=200).replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", ""),  # Descripción breve
                random.randint(1, 24),  # Duración en meses
            ])

    print("Archivo CSV de Publicidad generado exitosamente.")

def loadPublicidad(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                properties = {}
                for header, value in zip(headers, data):
                    if header in ["alcance", "duracion"]:  # Números
                        properties[header] = int(value)
                    elif header == "costo":  # Número flotante
                        properties[header] = float(value)
                    else:  # Texto
                        properties[header] = value
                print("Datos crudos limpios:", properties)                
                session.run(f"CREATE (n:{label} $properties)", parameters={"properties": properties})

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = 'scripts/Publicidad.csv'
    label = 'Publicidad'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()

