import uuid
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

orden_compra_router = APIRouter()

@orden_compra_router.get("/nodes/OrdenDeCompra")
def get_orden_compra():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:OrdenDeCompra:PorMenor) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@orden_compra_router.get("/nodes/OrdenDeCompra/{id}")
def get_ordenCompra(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:OrdenDeCompra:PorMenor) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@orden_compra_router.post("/create_orden_compra")
def create_orden_compra(orden_compra_data: dict):
    driver_neo4j = connection()
    with driver_neo4j.session() as session:
        id = str(uuid.uuid4())

        # Extraer y validar datos
        envio = float(orden_compra_data.get("envio", 0.0))
        fecha_str = orden_compra_data.get("fecha", "")
        total = float(orden_compra_data.get("total", 0.0))
        codigo_producto = orden_compra_data.get("codigo_producto", [])  # Asegurar que es lista
        cantidad_str_list = orden_compra_data.get("cantidad", [])  # Asumir que viene como lista de strings
        metodo_pago = str(orden_compra_data.get("metodo_pago", ""))
        id_cliente = str(orden_compra_data.get("id_cliente", ""))

        # Convertir fecha y cantidades
        if fecha_str:
            fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        else:
            fecha = datetime.now().date()  # Uso de fecha actual como fallback
        
        cantidad = [int(c) for c in cantidad_str_list]  # Convertir cada elemento a int

        # Consulta para crear el nodo en Neo4j
        query = '''
            CREATE (o:OrdenDeCompra:PorMenor {
                envio: $envio, fecha: $fecha, total: $total, id_cliente: $id_cliente, 
                codigo_producto: $codigo_producto, id: $id, cantidad: $cantidad, 
                metodo_pago: $metodo_pago
            })
            RETURN o
        '''

        # Ejecución de la consulta y recopilación de resultados
        result = session.run(query, id=id, envio=envio, fecha=fecha, total=total, id_cliente=id_cliente,
                             codigo_producto=codigo_producto, cantidad=cantidad, metodo_pago=metodo_pago)

        created_orden_compra_info = [dict(record["o"]) for record in result]
        return {"response": created_orden_compra_info}


@orden_compra_router.put("/update_orden_compra/{id}")
def update_orden_compra(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    envio = updated_data.get("envio")
    fecha = updated_data.get("fecha")
    fecha = datetime.strptime(fecha, "%Y-%m-%d")
    total = updated_data.get("total")
    id_cliente = updated_data.get("id_cliente")
    codigo_producto = updated_data.get("codigo_producto")
    cantidad = updated_data.get("cantidad")
    metodo_pago = updated_data.get("metodo_pago")

    query = '''
    MATCH (o:OrdenDeCompra:PorMenor {id: $id})
    SET o.envio = $envio, o.fecha = $fecha, o.total = $total, o.id_cliente = $id_cliente, o.codigo_producto = $codigo_producto, o.cantidad = $cantidad, o.metodo_pago = $metodo_pago
    RETURN o
    '''

    result = session.run(query, envio=envio, fecha=fecha, total=total, id_cliente=id_cliente, codigo_producto=codigo_producto, cantidad=cantidad, metodo_pago=metodo_pago, id=id)

    updated_orden_compra_info = []
    for record in result:
        updated_orden_compra_info.append(dict(record["o"]))

    return {"response": "node updated"}

@orden_compra_router.delete("/delete_orden_compra/{id}")
def delete_orden_compra(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (o:OrdenDeCompra:PorMenor {id: $id})
    DETACH DELETE o
    '''

    session.run(query, id=id)

    return {"response": "OrdenDeCompra deleted successfully"}


orden_compra_router_por_mayor = APIRouter()

@orden_compra_router_por_mayor.get("/nodes/OrdenDeCompraPorMayor")
def get_orden_compra_por_mayor():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:OrdenDeCompra:PorMayor) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@orden_compra_router_por_mayor.get("/nodes/OrdenDeCompraPorMayor/{id}")
def get_ordenCompra(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:OrdenDeCompra:PorMayor) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@orden_compra_router_por_mayor.post("/create_orden_compra_por_mayor")
def create_orden_compra_por_mayor(orden_compra_data: dict):
    driver_neo4j = connection()
    with driver_neo4j.session() as session:
        id = str(uuid.uuid4())

        # Extraer y validar datos
        envio = float(orden_compra_data.get("envio", 0.0))
        fecha_str = orden_compra_data.get("fecha", "")
        total = float(orden_compra_data.get("total", 0.0))
        codigo_producto = orden_compra_data.get("codigo_producto", [])  # Asegurar que es lista
        cantidad_str_list = orden_compra_data.get("cantidad", [])  # Asumir que viene como lista de strings
        metodo_pago = str(orden_compra_data.get("metodo_pago", ""))
        id_cliente = str(orden_compra_data.get("id_cliente", ""))

        # Convertir fecha y cantidades
        if fecha_str:
            fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        else:
            fecha = datetime.now().date()  # Uso de fecha actual como fallback
        
        cantidad = [int(c) for c in cantidad_str_list]  # Convertir cada elemento a int

        # Consulta para crear el nodo en Neo4j
        query = '''
            CREATE (o:OrdenDeCompra:PorMayor {
                envio: $envio, fecha: $fecha, total: $total, id_cliente: $id_cliente, 
                codigo_producto: $codigo_producto, id: $id, cantidad: $cantidad, 
                metodo_pago: $metodo_pago
            })
            RETURN o
        '''

        # Ejecución de la consulta y recopilación de resultados
        result = session.run(query, id=id, envio=envio, fecha=fecha, total=total, id_cliente=id_cliente,
                             codigo_producto=codigo_producto, cantidad=cantidad, metodo_pago=metodo_pago)

        created_orden_compra_info = [dict(record["o"]) for record in result]
        return {"response": created_orden_compra_info}

@orden_compra_router_por_mayor.put("/update_orden_compra_por_mayor/{id}")
def update_orden_compra_por_mayor(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    envio = updated_data.get("envio")
    fecha = updated_data.get("fecha")
    fecha = datetime.strptime(fecha, "%Y-%m-%d")
    total = updated_data.get("total")
    id_cliente = updated_data.get("id_cliente")
    codigo_producto = updated_data.get("codigo_producto")
    cantidad = updated_data.get("cantidad")
    metodo_pago = updated_data.get("metodo_pago")

    query = '''
    MATCH (o:OrdenDeCompra:PorMayor {id: $id})
    SET o.envio = $envio, o.fecha = $fecha, o.total = $total, o.id_cliente = $id_cliente, o.codigo_producto = $codigo_producto, o.cantidad = $cantidad, o.metodo_pago = $metodo_pago
    RETURN o
    '''

    result = session.run(query, envio=envio, fecha=fecha, total=total, id_cliente=id_cliente, codigo_producto=codigo_producto, cantidad=cantidad, metodo_pago=metodo_pago, id=id)

    updated_orden_compra_info = []
    for record in result:
        updated_orden_compra_info.append(dict(record["o"]))

    return {"response": "node updated"}

@orden_compra_router_por_mayor.delete("/delete_orden_compra_por_mayor/{id}")
def delete_orden_compra_por_mayor(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (o:OrdenDeCompra:PorMayor {id: $id})
    DETACH DELETE o
    '''

    session.run(query, id=id)

    return {"response": "OrdenDeCompraPorMayor deleted successfully"}
