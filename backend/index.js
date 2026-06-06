const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const usuariosRoutes = require('./Routes/usuariosRoutes')
const productosRoutes = require('./Routes/productosRoutes')
//const movimientosRoutes = require('./Routes/movimientosRoutes')

//Crear la aplicación de Express
const app = express()

//Permitir solicited de otros dominios
app.use(cors())

//Middleware para analizar json
app.use(bodyParser.json())

//Rutas
app.use('/',usuariosRoutes)
app.use('/',productosRoutes)
//app.use('/',movimientosRoutes)

//Iniciar el servidor
const port = 3000
app.listen(port,() => {
    console.log(`Servidor ejecutandose en http://localhost:${port}`)
})