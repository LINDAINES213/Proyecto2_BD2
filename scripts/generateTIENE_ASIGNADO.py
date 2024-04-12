# Script para generar relaciones asegurando que cada nodo tenga al menos una

import csv
import random
from faker import Faker

fake = Faker()

with open('Nodos.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    next(reader)  # Saltar el encabezado
    ids_nodos = [row[0] for row in reader]

random.shuffle(ids_nodos)

relacion_schema = ["id_persona1", "id_persona2", "tipo_relacion", "fuerza", "desde"]
numero_relaciones = max(100, len(ids_nodos))  # Asegura un mínimo basado en el número de nodos

with open('Relaciones.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(relacion_schema)
    
    for i in range(0, len(ids_nodos)-1, 2):
        id_persona1 = ids_nodos[i]
        id_persona2 = ids_nodos[i + 1] if i + 1 < len(ids_nodos) else ids_nodos[0]
        
        writer.writerow([
            id_persona1,
            id_persona2,
            "CONOCE",
            random.randint(1, 10),
            fake.date_between(start_date="-5y", end_date="today").isoformat(),
        ])

    for _ in range(numero_relaciones - len(ids_nodos)//2):
        id_persona1, id_persona2 = random.sample(ids_nodos, 2)
        writer.writerow([
            id_persona1,
            id_persona2,
            "CONOCE",
            random.randint(1, 10),
            fake.date_between(start_date="-5y", end_date="today").isoformat(),
        ])
