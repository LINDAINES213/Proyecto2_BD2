from neo4j import GraphDatabase
import os
import pandas as pd
import random
import datetime
from datetime import datetime, timedelta, date


def random_date():
    """Genera una fecha aleatoria dentro de los últimos 3 años."""
    start_date = date.today() - timedelta(days=3 * 365)
    random_days = random.randrange(3 * 365)
    return start_date + timedelta(days=random_days)

def random_availability():
    """Devuelve True con un 90% de probabilidad, y False con un 10%."""
    return random.random() < 0.9

def generateTIENE():
    # Cargar datos
    proveedores_df = pd.read_csv('scripts/Proveedor.csv')
    productos_df = pd.read_csv('scripts/Producto.csv')

    # Mapear productos por categoría
    productos_por_categoria = productos_df.groupby('categoria').apply(lambda x: list(x.itertuples(index=False))).to_dict()

    # Lista para guardar las relaciones
    relaciones = []

    # Inicializar la asignación para asegurarse de que todos los productos tengan al menos una relación
    productos_asignados = set()
    proveedores_asignados = set()

    # Asignar cada producto a un proveedor de la misma categoría, minimizando las relaciones
    for categoria, productos in productos_por_categoria.items():
        proveedores_compatibles = proveedores_df[proveedores_df['tipo_de_producto'] == categoria]
        for producto in productos:
            if not proveedores_compatibles.empty:
                # Elegir un proveedor al azar de los compatibles
                proveedor_elegido = proveedores_compatibles.sample(n=1).iloc[0]
                relaciones.append({
                    "id_proveedor": proveedor_elegido['id'],
                    "id_producto": producto.id,
                    "tipo_de_producto": categoria,
                    "disponibilidad": random_availability(),
                    "fecha_de_produccion": random_date().isoformat()
                })
                productos_asignados.add(producto.id)
                proveedores_asignados.add(proveedor_elegido['id'])

    # Asegurarse de que todos los proveedores tengan al menos un producto asignado
    proveedores_sin_asignar = proveedores_df[~proveedores_df['id'].isin(proveedores_asignados)]
    for _, proveedor in proveedores_sin_asignar.iterrows():
        categoria = proveedor['tipo_de_producto']
        productos_disponibles = productos_por_categoria[categoria]
        if productos_disponibles:
            producto_elegido = productos_disponibles.pop(0)
            relaciones.append({
                "id_proveedor": proveedor['id'],
                "id_producto": producto_elegido.id,
                "tipo_de_producto": categoria,
                "disponibilidad": random_availability(),
                "fecha_de_produccion": random_date().isoformat()
            })
            productos_asignados.add(producto_elegido.id)

    # Convertir lista de relaciones a DataFrame
    relaciones_df = pd.DataFrame(relaciones)

    # Guardar las relaciones en un archivo CSV
    relaciones_df.to_csv('scripts/Relaciones_Tiene.csv', index=False)
    print("Archivo 'Relaciones_Tiene.csv' creado con éxito.")



def loadTIENE(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_relaciones(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            headers = [header.strip().replace('"', '') for header in headers]
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                data = [element.strip().replace('"', '') for element in data]
                properties = {header: value for header, value in zip(headers, data)}

                # Convertir 'fecha_de_produccion' a formato fecha en Neo4j
                if 'fecha_de_produccion' in properties:
                    # Asegurarse de que la fecha está en el formato correcto para Neo4j
                    date_obj = datetime.strptime(properties['fecha_de_produccion'], '%Y-%m-%d')
                    properties['fecha_de_produccion'] = date_obj.date().isoformat()  # Formatea solo la fecha

                # Convertir disponibilidad a booleano si es necesario
                if 'disponibilidad' in properties:
                    properties['disponibilidad'] = properties['disponibilidad'].lower() in ('true', '1', 't', 'yes')

                print("Datos crudos limpios:", properties)

                # Preparar la consulta Cypher para crear la relación y asignar propiedades específicamente
                query = """
                MATCH (p:Proveedor {id: $id_proveedor})
                MATCH (prod:Producto {id: $id_producto})
                MERGE (p)-[r:TIENE]->(prod)
                SET r.fecha_de_produccion = date($fecha_de_produccion),
                    r.disponibilidad = $disponibilidad,
                    r.tipo_de_producto = $tipo_de_producto
                """
                # Ejecutar la consulta Cypher con las propiedades adecuadas
                session.run(query, id_proveedor=properties['id_proveedor'], id_producto=properties['id_producto'],
                            fecha_de_produccion=properties['fecha_de_produccion'], disponibilidad=properties['disponibilidad'],
                            tipo_de_producto=properties['tipo_de_producto'])

        print("Todas las relaciones fueron importadas.")

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = 'scripts/Relaciones_Tiene.csv'  # Asegúrate de que el camino al archivo CSV sea el correcto
    with driver.session() as session:
        importar_relaciones(session, csv_path)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()
    print("Relaciones cargadas exitosamente.")
