from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generateVehiculo():
    nodo_schema = ["id", "marca", "placa", "consumo", "modelo", "peso_limite"]

    with open('scripts/Vehiculos.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(700):  # Generar 700 nodos
            peso_limite = random.randint(1, 10)  # Peso límite entre 1 y 10 toneladas
            writer.writerow([
                id + 1,
                fake.company().replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", ""),  # Simulamos que la marca es el nombre de una compañía
                fake.license_plate().replace('\n', ' ').replace(",", " ").replace('"', "").replace("'", ""),  # Placa
                random.randint(5, 20),  # Consumo (litros por 100 km)
                random.randint(1990, 2022),  # Modelo (año)
                peso_limite  # Peso límite en toneladas
            ])

    print("Archivo CSV generado exitosamente.")


def loadVehiculo(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                properties["consumo"] = int(properties["consumo"])
                properties["modelo"] = int(properties["modelo"])
                properties["peso_limite"] = int(properties["peso_limite"])
                print("Datos crudos limpios:", properties)
                # Determinar etiquetas adicionales según el peso límite
                additional_label = 'TransportePesado' if properties["peso_limite"] >= 6 else 'TransporteLigero'
                session.run(f"CREATE (n:Vehiculo:{additional_label} $properties)", parameters={"properties": properties})

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = './scripts/Vehiculos.csv'
    with driver.session() as session:
        importar_nodos(session, csv_path)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()

