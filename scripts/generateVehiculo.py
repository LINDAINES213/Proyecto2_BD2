from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generatePersonal():
    def generate_DPI():
        """Genera un DPI como un string de 13 dígitos."""
        return str(fake.random_number(digits=13))

    def generate_licencia():
        """Elige aleatoriamente entre los tipos de licencia A, B, y C."""
        return random.choice(['A', 'B', 'C'])

    def generate_estado():
        """Genera un estado booleano, con mayor probabilidad de ser True."""
        return fake.boolean(chance_of_getting_true=75)

    nodo_schema = ["id", "Peso_limite(t)", "Ubicacion", "Placa", "id_orden", "consumo(gl)"]

    with open('scripts/Vehiculo.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)  # Escribir los encabezados
        for id in range(700):  # Generar 700 nodos como solicitado
            writer.writerow([
                id + 1,  # ID, asumiendo un inicio en 1 para mantener la unicidad
                fake.name(),  # Nombre
                generate_DPI(),  # DPI como número de 13 dígitos
                fake.random_int(min=18, max=80),  # Edad, mayor o igual a 18
                generate_licencia(),  # Tipo de licencia, uno entre A, B, o C
                fake.phone_number(),  # Teléfono
                fake.email(),  # Email
                generate_estado(),  # Estado, mayormente True
            ])

    print("Archivo CSV generado exitosamente.")


def loadPersonal(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))
    # Función para convertir una cadena en un valor booleano
    def str_to_bool(s):
        return s.lower() in ['true', '1', 't', 'y', 'yes']

    # Función para importar nodos desde un archivo CSV
    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                properties = {}
                for header, value in zip(headers, data):
                    if header in ["Edad", "DPI"]:  # Números
                        properties[header] = int(value)
                    elif header == "estado":  # Booleano
                        properties[header] = str_to_bool(value)
                    else:  # Para Texto, Teléfono, Email, etc., no se necesita conversión
                        properties[header] = value
                # La línea modificada es la siguiente:
                session.run(f"CREATE (n:{label} $properties)", parameters={"properties": properties})


    print("Directorio de trabajo actual:", os.getcwd())
    # Ejemplo de uso
    csv_path = './scripts/Personal.csv'
    label = 'Personal'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()
