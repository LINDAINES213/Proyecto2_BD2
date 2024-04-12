# Usa la imagen oficial de Python
FROM python:3.11.4

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia todos los archivos necesarios para el backend al directorio de trabajo
COPY / .

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto en el que tu FastAPI estará escuchando
EXPOSE 8001

# Comando para ejecutar el servidor de desarrollo de FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]