const express = require('express');
const router = express.Router();
const db = require('../conexion');

//ruta para obtener los productos de la tabla productos
router.get('/productos', (req,res) => {
    const query = 'SELECT * FROM productos'
    db.query(query, (err,results) => {
        if(err){
            return res.status(500).send('Error en la consulta')
        }

        res.json(results)
    })
})

//Ruta para obtener el producto usando el id
router.get('/producto/:id_producto', (req,res) => {
    const { id_producto } = req.params

    const query = 'SELECT id_producto, nombre, precio FROM productos WHERE id_producto = ?'
    db.query(query, [id_producto], (err,result) => {
        if(err){
            return res.status(500).send('Error al obtener el producto')

        }
        res.json(result)
    })
})

//Ruta para agregar un nuevo producto
router.post('/productos', (req,res) => {
    const {nombre, descripcion, precio, stock_actual, stock_minimo} = req.body

    if(!nombre || !descripcion || !precio || !stock_actual || !stock_minimo){
        return res.status(400).send('Todos los campos son obligatorios')
    }

    const query = `INSERT INTO productos(nombre, descripcion, precio, stock_actual, stock_minimo) VALUES(?,?,?,?,?)`

    db.query(query, [nombre, descripcion, precio, stock_actual, stock_minimo], (err,result) => {
        if(err){
            console.error('Error al agregar el producto: ',err)
            return res.status(500).send('Error al agregar el producto')
        }

        res.status(201).send({
            id_producto: result.insertId, nombre, descripcion, precio, stock_actual, stock_minimo
        })
    })
})

//Ruta para editar un producto
router.put('/productos/:id_producto', (req,res) => {
    const { id_producto } = req.params
    const { nombre, descripcion, precio, stock_actual, stock_minimo} = req.body 

    const query = 'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock_actual=?, stock_minimo=? WHERE id_producto=?'
    
    db.query(query, [nombre, descripcion, precio, stock_actual, stock_minimo, id_producto], (err,result) => {
        if(err){
            return res.status(500).send('Error al actualizar el producto')
        }

        res.send('Producto actualizado')
    })
})

//Ruta para eliminar un producto
router.delete('/productos/:id_producto', (req,res) => {
    const { id_producto } = req.params
    db.query(
        'DELETE FROM productos WHERE id_producto=?',
        [id_producto],
        (err,result) => {

            if(err){
                return res.status(500).send('Error al eliminar el producto')
            }

            res.send('Producto eliminado')
        }
    )
})

module.exports = router