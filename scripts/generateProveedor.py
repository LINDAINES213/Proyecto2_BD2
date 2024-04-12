from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generateProveedor():
    nodo_schema = ["id", "nombre", "direccion", "email", "telefono", "tipo_de_producto"]
    categorias_productos = ["Electronica", "Ropa", "Juguetes", "Alimentos", "Herramientas", "Libros", "Deportes", "Belleza", "Muebles", "Jardineria"]

    with open('scripts/Proveedor.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, quoting=csv.QUOTE_ALL, escapechar='\\')  # Ajustar parámetros de csv.writer
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(700):  # Generar 700 nodos como solicitado
            # Generar fila con todos los campos encerrados en comillas
            writer.writerow([
                id + 1,                                # ID
                fake.company().replace('\n', ' ').replace(","," "),                        # Nombre de la empresa
                fake.address().replace('\n', ' ').replace(","," "),    # Dirección, reemplazando nuevas líneas por comas
                fake.email().replace('\n', ' ').replace(","," "),                          # Email
                fake.phone_number().replace('\n', ' ').replace(","," "),                   # Teléfono
                random.choice(categorias_productos)    # Tipo de producto
            ])
    print("Archivo CSV generado exitosamente.")

def loadProveedor(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            headers = [header.strip().replace('"', '') for header in headers]
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                data = [element.strip().replace('"', '') for element in data]
                properties = {header: value for header, value in zip(headers, data)}
                session.run(f"CREATE (n:{label} $properties)", parameters={"properties": properties})

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = './scripts/Proveedor.csv'
    label = 'Proveedor'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()

