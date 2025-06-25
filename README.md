# SmartPlot

## 1. Ambiente de desarrollo

1. Clonar este repositorio (`git clone https://github.com/benjarojas/smartplot-backend`)
2. Instalar las dependencias necesarias (`npm install`)
3. Configurar las variables de entorno:
   Se debe crear un archivo llamado `.env` en la raíz del repositorio con los siguientes parámetros:
    ```
    APPVERSION=0.1.0
    APPNAME=SmartPlot
    PORT=3000

    # Prefijo de la API (opcional, dejar en blanco si no es necesario)
    API_PREFIX=

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
    TRANSBANK_RETURN_URL=<URL para confirmar la transacción local>
    
    # Despues de confirmar una transacción, se redirige al usuario a esta URL con ?paymentId=<id>&status=<status>
    WEBPAY_PAYMENT_RESULT_URL=<URL de callback para mostrar resultado del pago en el frontend>

    # Configuración del servicio SMTP para enviar notificaciones por correo
    SMTP_HOST=<smtp.example.com>
    SMTP_PORT=<587>
    SMTP_SECURE=<true|false>
    SMTP_TLS_REJECT_UNAUTHORIZED=<true|false>
    SMTP_FROM=<example>
    SMTP_USER=<smtp_user>
    SMTP_PASSWORD=<smtp_password>
    ```
4. Ahora se puede iniciar la API utilizando el comando `npm run start:dev`

## 2. Documentación
Esta API utiliza Swagger para generar la documentación de los endpoints y DTOs de forma automática, a la que se puede acceder mediante la siguiente página: `http://localhost:3000/api/docs`. Se incluye documentación extra como modelos y diagramas en la carpeta `docs` de este repositorio.
