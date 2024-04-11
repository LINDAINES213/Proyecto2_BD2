from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("uri")
user = os.getenv("user")
pwd = os.getenv("pwd")

def connection():
    driver = GraphDatabase.driver(uri=uri, auth=(user, pwd))
    return driver
