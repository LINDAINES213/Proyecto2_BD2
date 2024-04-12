from generatePersonal import *
from generateProveedor import *

# Establecer la conexión con la base de datos Neo4j
uri = "neo4j+s://f6120b34.databases.neo4j.io"
usuario = "neo4j"
contraseña = "mmHnKEyuPplktl35zNEi-q31mR4qBY-4hFKAXN2JGhY"

#generatePersonal()
#loadPersonal(uri, usuario, contraseña)
generateProveedor() 
loadProveedor(uri, usuario, contraseña)
