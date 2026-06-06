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
    db.query('SELECT * FROM usuarios WHERE nombre = ? AND password = ?', [nombre,password], (err,results)=>{
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        if(results.length === 0){
            return res.status(401).send('Usuario no encontrado')
        }

        const usuarioEncontrado = results[0]

        res.status(200).send({
            mensaje: '',
            usuario: {
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol
            }
        })
    })
})

module.exports = router