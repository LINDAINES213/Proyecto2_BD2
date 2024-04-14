from faker import Faker
import csv
import random
from neo4j import GraphDatabase
import os

fake = Faker()

def generateProducto():
    categorias_productos = {
        "Electronica": [("Laptop", "Portátil de alta gama para profesionales y gamers"),
                        ("Smartphone", "Último modelo con 5G y cámara de 108MP"),
                        ("Tablet", "Ideal para leer y navegar en internet"),
                        ("Smartwatch", "Monitorea tu salud y recibe notificaciones"),
                        ("Cámara", "Captura tus momentos con calidad profesional")],
        "Ropa": [("Camiseta", "Cómoda y estilosa para el día a día"),
                 ("Jeans", "Clásicos y resistentes para cualquier ocasión"),
                 ("Chaqueta", "Perfecta para el clima frío"),
                 ("Vestido", "Elegante y sofisticado para eventos especiales"),
                 ("Zapatos", "Confortables y duraderos")],
        "Juguetes": [("Muñeca", "Perfecta para las horas de juego"),
                     ("Coche de juguete", "Diseño robusto y seguro"),
                     ("Pelota", "Ideal para actividades al aire libre"),
                     ("Rompecabezas", "Fomenta el desarrollo intelectual"),
                     ("Juego de mesa", "Diversión para toda la familia")],
        "Alimentos": [("Pan", "Fresco y crujiente, hecho a diario"),
                      ("Chocolate", "Dulce y cremoso, un placer en cada bocado"),
                      ("Queso", "Madurado a la perfección"),
                      ("Vino", "Seleccionado de las mejores viñas"),
                      ("Fruta", "Fresca y natural")],
        "Herramientas": [("Martillo", "Robusto y fiable para todos tus proyectos"),
                         ("Taladro", "Potente y preciso para trabajos difíciles"),
                         ("Sierra", "Corta con precisión y eficacia"),
                         ("Destornillador", "Imprescindible en cualquier caja de herramientas"),
                         ("Llave inglesa", "Ajustable y versátil")],
        "Libros": [("Novela", "Una emocionante trama que no podrás dejar de leer"),
                   ("Diccionario", "Fuente confiable para la correcta ortografía y significado"),
                   ("Biografía", "Descubre la vida de personajes históricos"),
                   ("Poesía", "Versos que tocarán tu alma"),
                   ("Guía de viaje", "Todo lo que necesitas saber para tu próxima aventura")],
        "Deportes": [("Balón de fútbol", "Para los amantes del fútbol"),
                     ("Raqueta de tenis", "Para un juego preciso y potente"),
                     ("Guantes de boxeo", "Protege tus manos mientras entrenas"),
                     ("Patines", "Diversión asegurada sobre ruedas"),
                     ("Equipo de natación", "Todo lo necesario para el nadador")],
        "Belleza": [("Maquillaje", "Resalta tu belleza natural"),
                    ("Perfume", "Una fragancia encantadora"),
                    ("Cremas para la piel", "Cuida y protege tu piel"),
                    ("Champú", "Para un cabello limpio y saludable"),
                    ("Esmalte de uñas", "Colores vibrantes para tus manos")],
        "Muebles": [("Sofá", "Comodidad en tu sala de estar"),
                    ("Mesa de comedor", "Reúne a tu familia para comer juntos"),
                    ("Silla", "Ideal para cualquier espacio"),
                    ("Estantería", "Organiza tus libros y adornos"),
                    ("Escritorio", "Perfecto para tus horas de trabajo")],
        "Jardineria": [("Maceta", "Ideal para tus plantas"),
                       ("Herramientas de jardinería", "Todo lo necesario para el cuidado del jardín"),
                       ("Semillas", "Cultiva tus propias plantas y verduras"),
                       ("Fertilizante", "Nutre tus plantas"),
                       ("Regadera", "Mantén tus plantas hidratadas")]
    }

    precios_productos = {producto: (round(random.uniform(10, 1000), 2), round(random.uniform(10, 1000) * 0.8, 2)) for categoria in categorias_productos for producto, _ in categorias_productos[categoria]}

    nodo_schema = ["id", "nombre", "precio", "precio_al_por_mayor", "descripcion", "categoria"]
    total_productos = sum(len(v) for v in categorias_productos.values())
    productos_por_nodo = 1400 / total_productos

    with open('scripts/Producto.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(nodo_schema)
        id = 1
        for categoria, productos in categorias_productos.items():
            for nombre, descripcion in productos:
                precio, precio_mayor = precios_productos[nombre]
                for _ in range(int(productos_por_nodo)):  # Asegurar 700 nodos en total
                    writer.writerow([
                        id,
                        nombre.replace('\n', ' ').replace(","," "),
                        precio,
                        precio_mayor,
                        descripcion.replace('\n', ' ').replace(","," "),
                        categoria.replace('\n', ' ').replace(","," ")
                    ])
                    id += 1
    print("Archivo CSV generado exitosamente.")


def loadProducto(uri, usuario, contraseña):
    driver = GraphDatabase.driver(uri, auth=(usuario, contraseña))

    def importar_nodos(session, csv_path, label):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')  # Leer los encabezados del CSV
            # Eliminar comillas extras en los encabezados
            headers = [header.strip().replace('"', '') for header in headers]
            for line in lines[1:]:
                data = line.strip().split(',')  # Obtener los datos de cada línea
                # Limpiar cada elemento de datos y eliminar comillas
                data = [element.strip().replace('"', '') for element in data]
                properties = {header: value for header, value in zip(headers, data)}

                print("Datos crudos limpios:", properties)

                try:
                    # Convertir precios a float
                    properties['precio'] = float(properties['precio'])
                    properties['precio_al_por_mayor'] = float(properties['precio_al_por_mayor'])
                except ValueError as e:
                    print("Error al convertir los precios a flotante:", e)
                    continue  # Omitir este nodo si hay un error

                # Usar correctamente los parámetros en la consulta Cypher
                session.run(f"CREATE (n:{label} $properties)", parameters={"properties": properties})

        print("Todos los nodos fueron importados o hubo errores que fueron manejados.")

    print("Directorio de trabajo actual:", os.getcwd())
    csv_path = './scripts/Producto.csv'
    label = 'Producto'  # Etiqueta de los nodos
    with driver.session() as session:
        importar_nodos(session, csv_path, label)

    # Cerrar la conexión con la base de datos Neo4j
    driver.close()
    print("Nodos cargados exitosamente.")

# Ejemplo de cómo llamar a loadProductos
