from typing import List
import uuid
from fastapi import APIRouter
from database.db import connection

delete_node = APIRouter()

@delete_node.delete("/delete_clientes_nodes")
def delete_nodes_clientes():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    query = '''
    MATCH (n:Cliente)
    RETURN n
    LIMIT 5
    '''

    result = session.run(query)

    for record in result:
        node_id = record["n"].id
        delete_query = f'''
        MATCH (n)
        WHERE ID(n) = {node_id}
        DETACH DELETE n
        '''
        session.run(delete_query)

    return {"response": "First five nodes with specified label deleted successfully"}

@delete_node.delete("/delete_personal_nodes")
def delete_nodes_personal():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    query = '''
    MATCH (n:Personal)
    RETURN n
    LIMIT 5
    '''

    result = session.run(query)

    for record in result:
        node_id = record["n"].id
        delete_query = f'''
        MATCH (n)
        WHERE ID(n) = {node_id}
        DETACH DELETE n
        '''
        session.run(delete_query)

    return {"response": "First five nodes with specified label deleted successfully"}

