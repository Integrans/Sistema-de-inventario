const express = require('express')
const router = express.Router()
const db = require('../conexion')

//Ruta para el login
router.post('/login', (req,res)=>{
    const { nombre, password } = req.body

    if(!nombre || !password){
        return res.status(400).send('Usuario y contraseña son obligatorios')
    }

    //Buscar el usuario en la base de datos
    const query = 'SELECT id_usuario, nombre, rol FROM usuarios WHERE nombre = ? AND password = ?'
    db.query(query, [nombre,password], (err,results)=>{
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        if(results.length === 0){
            return res.status(401).send('Usuario no encontrado')
        }

        const usuarioEncontrado = results[0]

        res.status(200).send({
            mensaje: 'Login exitoso',
            usuario: {
                id_usuario: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol
            }
        })
    })
})

//Ruta para traer todos los usuarios
router.get('/usuarios', (req,res) => {
    const query = 'SELECT id_usuario, nombre, rol FROM usuarios'
    db.query(query, (err,results) => {
        if(err){
            return res.status(500).send('Error en la consulta')
        }
        res.status(200).send(results)
    })
})

module.exports = router