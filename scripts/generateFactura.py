from faker import Faker
import csv
import random
from datetime import datetime
from neo4j import GraphDatabase

fake = Faker()

def read_csv_dict(filename):
    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        return list(reader)

def generateFactura():
    # Leer datos de los CSV
    clientes = read_csv_dict('scripts/Cliente.csv')
    productos = read_csv_dict('scripts/Producto.csv')
    ordenes_compra = read_csv_dict('scripts/OrdenDeCompra.csv')

    # Convertir listas a diccionarios para fácil acceso
    clientes_dict = {cliente['id']: cliente for cliente in clientes}
    productos_dict = {producto['id']: producto for producto in productos}

    # Esquema de nodo Factura
    factura_schema = ["id", "no_serie", "no_factura", "fecha", "nombre_del_cliente", "NIT", "direccion", 
                      "cantidad", "productos", "precio", "descuento", "envio", "total"]
    
    with open('scripts/Factura.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(factura_schema)

        for orden in ordenes_compra:
            id_factura = orden['id']
            no_serie = random.randint(10000, 99999)
            no_factura = random.randint(10000000, 99999999)
            fecha = orden['fecha']
            cliente = clientes_dict[orden['id_cliente']]
            nombre_del_cliente = cliente['nombre']
            NIT = int(cliente['NIT'])
            direccion = cliente['direccion']
            cantidad = list(map(int, orden['cantidad'].split(':')))
            codigo_productos = orden['codigo_producto'].split(':')
            productos = [productos_dict[codigo]['nombre'] for codigo in codigo_productos]
            precios = [float(productos_dict[codigo]['precio']) for codigo in codigo_productos]
            descuento = random.uniform(0.0, 0.1) * sum(p*q for p, q in zip(precios, cantidad))
            envio = float(orden['envio'])
            total = sum(p * q for p, q in zip(precios, cantidad)) - descuento + envio

            writer.writerow([
                id_factura,
                no_serie,
                no_factura,
                fecha,
                nombre_del_cliente,
                NIT,
                direccion,
                ":".join(map(str, cantidad)),
                ":".join(productos),
                ":".join(map(str, precios)),
                descuento,
                envio,
                total
            ])
    print("Archivo CSV de Facturas generado exitosamente.")

def loadFacturas(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_facturas(session, csv_path):
        with open(csv_path, 'r') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {}
                for header, value in zip(headers, data):
                    if header in ["no_serie", "no_factura", "NIT"]:
                        # Tratar no_serie y no_factura como enteros
                        properties[header] = int(value)
                    elif header == "productos" or header == "cantidad":
                        # Formatea como lista de strings para productos o lista de enteros para cantidad
                        list_values = value.split(':')
                        if header == "cantidad":
                            properties[header] = f"[{', '.join(list_values)}]"
                        else:
                            properties[header] = f"[{', '.join(f'\"{item}\"' for item in list_values)}]"
                    elif header == "precio":
                        # Convierte los precios a lista de floats
                        list_values = value.split(':')
                        properties[header] = f"[{', '.join(list_values)}]"
                    elif header in ["descuento", "envio", "total"]:
                        properties[header] = float(value)
                    elif header == "fecha":
                        properties[header] = f"date('{value}')"
                    else:
                        properties[header] = f"'{value}'"

                print("Datos crudos limpios:", properties)
                cypher_query = "CREATE (n:Factura {"
                cypher_query += ', '.join([f"{key}: {val}" for key, val in properties.items()])
                cypher_query += "})"
                session.run(cypher_query)

    with driver.session() as session:
        importar_facturas(session, 'scripts/Factura.csv')

    driver.close()
    print("Nodos de Factura cargados en Neo4j.")

