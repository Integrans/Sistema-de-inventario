const express = require('express');
const router = express.Router();
const db = require('../conexion');

// Ruta para registrar una entrada de producto

router.post('/movimientos/entrada', (req, res) => {

    const { id_producto, id_usuario, cantidad } = req.body;

    if (!id_producto || !id_usuario || !cantidad) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const insertarMovimiento = `
        INSERT INTO movimientos
        (id_producto, id_usuario, tipo_movimiento, cantidad)
        VALUES (?, ?, 'ENTRADA', ?)
    `;

    db.query(
        insertarMovimiento,
        [id_producto, id_usuario, cantidad],
        (err) => {

            if (err) {
                return res.status(500).send('Error al registrar movimiento');
            }

            const actualizarStock = `
                UPDATE productos
                SET stock_actual = stock_actual + ?
                WHERE id_producto = ?
            `;

            db.query(
                actualizarStock,
                [cantidad, id_producto],
                (err) => {

                    if (err) {
                        return res.status(500).send('Error al actualizar stock');
                    }

                    res.status(201).json({
                        mensaje: 'Entrada registrada correctamente'
                    });
                }
            );
        }
    );
});

// Ruta para registrar una salida de producto

router.post('/movimientos/salida', (req, res) => {

    const { id_producto, id_usuario, cantidad } = req.body;

    const buscarProducto = `
        SELECT stock_actual
        FROM productos
        WHERE id_producto = ?
    `;

    db.query(buscarProducto, [id_producto], (err, results) => {

        if (err) {
            return res.status(500).send('Error al consultar producto');
        }

        if (results.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        const stock = results[0].stock_actual;

        if (stock < cantidad) {
            return res.status(400).send('Stock insuficiente');
        }

        const insertarMovimiento = `
            INSERT INTO movimientos
            (id_producto, id_usuario, tipo_movimiento, cantidad)
            VALUES (?, ?, 'SALIDA', ?)
        `;

        db.query(
            insertarMovimiento,
            [id_producto, id_usuario, cantidad],
            (err) => {

                if (err) {
                    return res.status(500).send('Error al registrar salida');
                }

                const actualizarStock = `
                    UPDATE productos
                    SET stock_actual = stock_actual - ?
                    WHERE id_producto = ?
                `;

                db.query(
                    actualizarStock,
                    [cantidad, id_producto],
                    (err) => {

                        if (err) {
                            return res.status(500).send('Error al actualizar stock');
                        }

                        res.json({
                            mensaje: 'Salida registrada correctamente'
                        });
                    }
                );
            }
        );
    });
});

// Ruta para obtener el historial de movimientos
router.get('/movimientos', (req, res) => {

    const query = `
        SELECT
            m.id_movimiento,
            p.nombre AS producto,
            u.nombre AS usuario,
            m.tipo_movimiento,
            m.cantidad,
            m.fecha
        FROM movimientos m
        INNER JOIN productos p
            ON p.id_producto = m.id_producto
        INNER JOIN usuarios u
            ON u.id_usuario = m.id_usuario
        ORDER BY m.fecha DESC
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).send('Error al obtener movimientos');
        }

        res.json(results);
    });
});

// Productos con stock bajo
router.get('/productos/stock-bajo', (req, res) => {

    const query = `
        SELECT *
        FROM productos
        WHERE stock_actual <= stock_minimo
    `;

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).send('Error al consultar stock');
        }

        res.json(results);
    });
});