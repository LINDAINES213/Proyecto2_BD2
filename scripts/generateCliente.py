from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generateCliente():
    def generate_NIT():
        """Genera un NIT como un string de 10 dígitos."""
        return str(fake.random_number(digits=10, fix_len=True))

    nodo_schema = ["id", "nombre", "direccion", "telefono", "correo", "NIT"]

    with open('scripts/Cliente.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(700):  # Generar 700 nodos como solicitado
            writer.writerow([
                id + 1,  # ID, asumiendo un inicio en 1 para mantener la unicidad
                fake.name().replace('\n', ' ').replace(","," ").replace('"',"").replace("'",""),  # Nombre
                fake.address().replace('\n', ' ').replace(","," ").replace('"',"").replace("'",""),  # Dirección
                fake.phone_number().replace('\n', ' ').replace(","," ").replace('"',"").replace("'",""),  # Teléfono
                fake.email().replace('\n', ' ').replace(","," ").replace('"',"").replace("'",""),  # Correo electrónico
                generate_NIT(),  # NIT como número de 10 dígitos
            ])

    print("Archivo CSV generado exitosamente.")


def loadCliente(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    # Función para importar nodos desde un archivo CSV
    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            headers = [header.strip().replace('"', '') for header in headers]
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                data = [element.strip().replace('"', '') for element in data]
                properties = {}
                for header, value in zip(headers, data):
                    if header in ["NIT"]:  # Números
                        properties[header] = int(value)
                    else:  # Para texto, teléfono, correo, dirección y NIT
                        properties[header] = value
                print("Datos crudos limpios:", properties)
                session.run(f"CREATE (n:{label} $properties)", properties=properties)

    print("Directorio de trabajo actual:", os.getcwd())
    # Ejemplo de uso
    csv_path = './scripts/Cliente.csv'
    label = 'Cliente'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()
