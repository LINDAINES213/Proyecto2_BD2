import pandas as pd
import random
from datetime import datetime, time
from faker import Faker
from neo4j import GraphDatabase


fake = Faker()

def random_time():
    return time(random.randint(0, 23), random.randint(0, 59))

def generateMANEJA_ORDEN():
    # Cargar datos
    ordenes_df = pd.read_csv('scripts/OrdenDeCompra.csv')
    vehiculos_df = pd.read_csv('scripts/Vehiculos.csv')
    relaciones_df = pd.read_csv('scripts/Relaciones_PERTENECE_A.csv')
    
    # Filtrar vehículos disponibles según 'PERTENECE_A' con estado=True
    vehiculos_disponibles = relaciones_df[relaciones_df['estado'] == True]['id_vehiculo'].unique()
    vehiculos_df = vehiculos_df[vehiculos_df['id'].isin(vehiculos_disponibles)]
    
    # Inicializar lista para almacenar las relaciones
    relaciones = []
    vehiculos_asignados = set()

    # Asignar un vehículo a cada orden
    for _, orden in ordenes_df.iterrows():
        peso_total = random.randint(1, 12)  # Generar un peso total aleatorio entre 1 y 12
        fecha_asignacion = fake.date_between(start_date='-1y', end_date='today')
        hora_asignacion = random_time()

        # Seleccionar un vehículo cuyo peso máximo sea mayor o igual al peso total y no haya sido asignado
        vehiculos_candidatos = vehiculos_df[(vehiculos_df['peso_limite'] >= peso_total) & (~vehiculos_df['id'].isin(vehiculos_asignados))]
        
        if not vehiculos_candidatos.empty:
            vehiculo_asignado = vehiculos_candidatos.sample(n=1).iloc[0]
        else:
            # Si no hay vehículos que cumplan con la condición de peso, asignar cualquiera que no haya sido asignado
            vehiculos_restantes = vehiculos_df[~vehiculos_df['id'].isin(vehiculos_asignados)]
            if not vehiculos_restantes.empty:
                vehiculo_asignado = vehiculos_restantes.sample(n=1).iloc[0]
            else:
                print(f"No hay más vehículos disponibles para asignar a la orden {orden['id']}")
                continue  # Si no hay vehículos restantes, continuar con la siguiente orden

        vehiculos_asignados.add(vehiculo_asignado['id'])

        relaciones.append({
            "id_orden": orden['id'],
            "id_vehiculo": vehiculo_asignado['id'],
            "fecha_asignacion": fecha_asignacion,
            "hora_asignacion": hora_asignacion.strftime("%H:%M"),
            "peso_total": peso_total
        })

    relaciones_df = pd.DataFrame(relaciones)
    relaciones_df.to_csv('scripts/Relaciones_MANEJA_ORDEN.csv', index=False)
    print("Archivo 'MANEJA_ORDEN.csv' creado con éxito.")



def loadMANEJA_ORDEN(uri, user, password):
    driver = GraphDatabase.driver(uri, auth=(user, password))

    def import_relations(session, csv_path):
        with open(csv_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            headers = lines[0].strip().split(',')
            for line in lines[1:]:
                data = line.strip().split(',')
                properties = {header: value for header, value in zip(headers, data)}
                print("Datos crudos limpios:", properties)
                query = """
                MATCH (o:OrdenDeCompra {id: $id_orden})
                MATCH (v:Vehiculo {id: $id_vehiculo})
                MERGE (o)-[r:MANEJA_ORDEN]->(v)
                SET r.fecha_asignacion = date($fecha_asignacion),
                    r.hora_asignacion = time($hora_asignacion),
                    r.peso_total = toInteger($peso_total)
                """
                session.run(query, properties)

        print("Todas las relaciones MANEJA_ORDEN han sido importadas.")

    with driver.session() as session:
        csv_path = 'scripts/Relaciones_MANEJA_ORDEN.csv'
        import_relations(session, csv_path)

    driver.close()
    print("Relaciones MANEJA_ORDEN cargadas exitosamente.")

