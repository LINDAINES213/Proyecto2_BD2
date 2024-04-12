from neo4j import GraphDatabase
import datetime
import random

uri = "bolt://localhost:7687"  # Asegúrate de usar tu URI
usuario = "neo4j"  # Asegúrate de usar tu usuario
contraseña = "password"  # Asegúrate de usar tu contraseña


def generateTIENE(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def random_date():
        """Genera una fecha aleatoria dentro de los últimos 3 años."""
        start_date = datetime.date.today() - datetime.timedelta(days=3 * 365)
        random_days = random.randrange(3 * 365)  # Genera un número aleatorio de días hasta 3 años
        return start_date + datetime.timedelta(days=random_days)

    def random_availability():
        """Devuelve True con un 90% de probabilidad, y False con un 10%."""
        return random.random() < 0.9  # 90% de probabilidad de True

    def crear_relaciones():
        fecha_aleatoria = random_date().isoformat()  # Fecha aleatoria como cadena ISO
        with driver.session() as session:
            # Crear relaciones solo si la categoría del proveedor y del producto coinciden
            resultado = session.run("""
            MATCH (p:Proveedor), (prod:Producto)
            WHERE p.tipo_de_producto = prod.categoria
            MERGE (p)-[r:TIENE]->(prod)
            SET r.tipo_de_producto = prod.categoria,
                r.disponibilidad = $disponibilidad,
                r.fecha_de_produccion = date($fecha_aleatoria)
            """, {"fecha_aleatoria": fecha_aleatoria, "disponibilidad": random_availability()})
            
            print("Relaciones creadas: ", resultado.consume().counters.relationships_created)
        
    crear_relaciones()
    driver.close()
