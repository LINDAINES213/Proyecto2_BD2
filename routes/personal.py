from fastapi import APIRouter
from database.db import connection

# Definir un enrutador de API para la sección de usuarios
personal = APIRouter()

@personal.get("/nodes/{label}")
def nodes(label):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Consulta Cypher con un parámetro
    query = f'MATCH (n:{label}) RETURN n' #n.name AS name, COUNT(n) AS count
    # Pasando el valor del parámetro label
    results = session.run(query, label=label)
    # Recopilando todas las propiedades de cada nodo
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}
    return {"response": [{"name": row["name"], "Count": row["count"]} for row in results]}

@personal.post("/create_personal")
def create_user(personal_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos del usuario del cuerpo de la solicitud
    dpi = personal_data.get("DPI")
    nombre = personal_data.get("nombre")
    edad = personal_data.get("Edad")
    email = personal_data.get("email")
    telefono = personal_data.get("telefono")
    estado = personal_data.get("estado")
    tipo_de_licencia = personal_data.get("Tipo_de_licencia")

    # Consulta Cypher para crear un nodo de usuario
    query = '''
    CREATE (u:Personal {DPI: $dpi, nombre: $nombre, edad: $edad, email: $email, telefono: $telefono, estado: $estado, Tipo_de_licencia: $tipo_de_licencia})
    RETURN u
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, dpi=dpi, nombre=nombre, edad=edad, email=email, telefono=telefono, estado=estado, tipo_de_licencia=tipo_de_licencia)

    # Recopilar las propiedades del nuevo nodo creado
    created_user_info = []
    for record in result:
        created_user_info.append(dict(record["u"]))

    return {"response": created_user_info}

@personal.put("/update_user/{user_id}")
def update_user(user_id: int, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos actualizados del cuerpo de la solicitud
    updated_name = updated_data.get("name")
    updated_userId = updated_data.get("userId")

    # Consulta Cypher para actualizar el nodo de usuario
    query = '''
    MATCH (u:USER {userId: $user_id})
    SET u.name = $updated_name, u.userId = $updated_userId
    RETURN u
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, user_id=user_id, updated_name=updated_name, updated_userId=updated_userId)

    # Recopilar las propiedades del nodo actualizado
    updated_user_info = []
    for record in result:
        updated_user_info.append(dict(record["u"]))

    return {"response": "node updated"}

@personal.delete("/delete_user/{user_id}")
def delete_user(user_id: int):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Consulta Cypher para eliminar el nodo de usuario
    query = '''
    MATCH (u:USER {userId: $user_id})
    DELETE u
    '''

    # Ejecutar la consulta Cypher con el parámetro proporcionado
    session.run(query, user_id=user_id)

    return {"response": "User deleted successfully"}