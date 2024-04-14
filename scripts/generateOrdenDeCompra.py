from faker import Faker
import csv
import random
from neo4j import GraphDatabase


fake = Faker()

def generateOrdenDeCompra():
    nodo_schema = ["id", "fecha", "id_cliente", "codigo_producto", "metodo_pago", "cantidad", "envio", "total"]

    # Leer datos de Producto.csv para obtener precios y IDs
    productos = []
    with open('scripts/Producto.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            productos.append((row['id'], float(row['precio']), float(row['precio_al_por_mayor'])))

    # Leer datos de Cliente.csv para obtener IDs de clientes
    clientes = []
    with open('scripts/Cliente.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            clientes.append(row['id'])

    max_orders = min(len(clientes), len(productos) // 2)
    if max_orders < 700:
        raise Exception(f"No hay suficientes clientes o productos para generar 700 órdenes. Máximo posible: {max_orders}")

    with open('scripts/OrdenDeCompra.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(nodo_schema)
        for id in range(1, 701):  # Generar 700 nodos
            fecha = fake.date_between(start_date="-5y", end_date="today").strftime("%Y-%m-%d")
            id_cliente = clientes.pop(random.randint(0, len(clientes) - 1))
            sampled_productos = random.sample(productos, 2)
            for prod in sampled_productos:
                productos.remove(prod)  # Eliminar los productos usados
            codigo_producto = [p[0] for p in sampled_productos]
            metodo_pago = random.choice(["efectivo", "tarjeta"])
            cantidad = [random.randint(1, 10), random.randint(1, 10)]
            envio = round(random.uniform(5.0, 25.0), 2)

            # Elegir precio según el tipo de nodo
            if id <= 350:
                # Precio por mayor
                total = sum(p[2] * q for p, q in zip(sampled_productos, cantidad))
            else:
                # Precio por menor
                total = sum(p[1] * q for p, q in zip(sampled_productos, cantidad))

            writer.writerow([
                id,
                fecha,
                id_cliente,
                ":".join(codigo_producto),
                metodo_pago,
                ":".join(map(str, cantidad)),
                envio,
                total
            ])

    print("Archivo CSV de OrdenDeCompra generado exitosamente.")


def loadOrdenDeCompra(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for i, line in enumerate(lines[1:], start=1):
                data = line.strip().split(',')
                properties = {}
                for header, value in zip(headers, data):
                    if header == "codigo_producto":  # Convertir a lista de strings
                        list_values = value.split(':')
                        properties[header] = f"[{', '.join(f'\"{val}\"' for val in list_values)}]"
                    elif header == "cantidad":  # Convertir a lista de enteros
                        list_values = value.split(':')
                        properties[header] = f"[{', '.join(list_values)}]"
                    elif header in ["cantidad_total"]:  # Tratar como enteros
                        properties[header] = int(value)
                    elif header in ["envio", "total"]:  # Tratar como flotantes
                        properties[header] = float(value)
                    elif header == "fecha":  # Tratar como fecha
                        properties[header] = f"date('{value}')"
                    else:  # Tratar como cadenas normales
                        properties[header] = f"'{value}'"

                print("Datos crudos limpios:", properties)
                label = "OrdenDeCompra:PorMenor" if i <= 350 else "OrdenDeCompra:PorMayor"
                cypher_query = f"CREATE (n:{label} {{"
                cypher_query += ', '.join([f"{key}: {val}" for key, val in properties.items()])
                cypher_query += "})"
                session.run(cypher_query)

    with driver.session() as session:
        importar_nodos(session, 'scripts/OrdenDeCompra.csv')

    driver.close()
    print("Nodos de OrdenDeCompra cargados en Neo4j.")



