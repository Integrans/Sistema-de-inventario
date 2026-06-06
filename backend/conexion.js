const mysql = require('mysql2');

//Configuración para la conexión de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'patinpitin',
    database: 'inventario_pikmin'
}

const db = mysql.createConnection(dbConfig);

//Conectar a la base de datos
db.connect((err) => {
    if(err){
        console.error('Error al conectar a la base de datos: ',err)
        return
    }
    console.log('Conectado a la base de datos MySQL')
})

module.exports = db