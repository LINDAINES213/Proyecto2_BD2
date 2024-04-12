
#NODOS
from faker import Faker
import csv
import random
from datetime import datetime

fake = Faker()

# Funciones de ayuda para generar datos aleatorios
def generate_random_list(element_generator, delimiter='|', min_size=1, max_size=5):
    """Genera una lista aleatoria de elementos, unida por un delimitador."""
    return delimiter.join([element_generator() for _ in range(random.randint(min_size, max_size))])

def generate_date(min_year=1990, max_year=2023):
    """Genera una fecha aleatoria en formato ISO."""
    start = datetime(min_year, 1, 1)
    end = datetime(max_year, 12, 31)
    return fake.date_between(start_date=start, end_date=end).isoformat()

# Cambia esta función según cómo desees generar y representar tus etiquetas
def generate_tags(*tags):
    """Genera una representación de cadena de etiquetas para el nodo."""
    return '|'.join(tags)

# Definición del esquema del nodo. Modifica según tus necesidades
nodo_schema = ["id", "nombre", "DPI", "Edad", "Tipo_de_licencia", "telefono", "email", "fecha_registro", "estado", "tags"]
# nodo_tags = ["Personal"]  # Ejemplo de etiquetas. Modifica según sea necesario

# Generación y escritura del archivo CSV
with open('Personal.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(nodo_schema)  # Escribir los encabezados
    for _ in range(100):  # Generar 100 nodos. Modifica según tus necesidades
        writer.writerow([
            fake.unique.random_int(min=1, max=1000),  # ID
            fake.name(),  # Texto
            fake.random_int(min=18, max=80),  # Número
            fake.boolean(),  # Booleano
            generate_random_list(fake.word),  # Lista
            generate_date(),  # Fecha
            "Personal"  # Tags
        ])

print("Archivo CSV generado exitosamente.")

#Plantilla relaciones.