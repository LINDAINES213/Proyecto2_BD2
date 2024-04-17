import uuid
from fastapi import APIRouter
from database.db import connection

delete_relation = APIRouter()

@delete_relation.delete("/delete_relacion/{id}")
def delete_publicidad(id: int):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    

    query = f'''
    MATCH ()-[r]->()
    WHERE ID(r) = {id}
    DELETE r
    '''

    session.run(query, id=id)

    return {"response": "Publicidad deleted successfully"}