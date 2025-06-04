# SmartPlot

---

# 1. Ambiente de desarrollo

1. Clonar este repositorio (`git clone https://github.com/benjarojas/smartplot-backend`)
2. Instalar las dependencias necesarias (`npm install`)
3. Configurar las variables de entorno:
   - Se debe crear un archivo llamado `.env` en la raíz del repositorio con los siguientes parámetros:
    ```
    APPVERSION=0.1.0
    APPNAME=SmartPlot
    PORT=3000

    # Database
    DB_HOST=<ip de la base de datos>
    DB_PORT=<puerto>
    DB_USERNAME=<usuario>
    DB_PASSWORD=<contraseña>
    DB_NAME=smartplot

    # JWT
    JWT_SECRET=<clave secreta para generar tokens JWT>
    JWT_EXPIRATION=<tiempo de validez de un token JWT>

    # Transbank
    TRANSBANK_RETURN_URL=<URL de callback posterior al pago>
    ```