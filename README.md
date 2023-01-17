# SchoolApp
Sistema web que se compone de dos partes: servidor(Backend) y pagina Web(Frontend).
Ver archivos package.json de cada uno para ver dependencias. ver informe para mas detalles.
Backend corre sobre Node.js 14.18.1,
instalar pdf-make en Backend usando: "npm install pdfmake" en la raiz de este

Backend/src/config.js contiene contraseñas secretas, no subir publicamente
Backend/src/config.js database.js controla conexion a servidor mongodb
Backend/src/config.js mailer.js maneja conexion correo electronico

Backend/src/libs/initialSetup.js configura el servidor la primera vez y crea un administrador y base del sistema