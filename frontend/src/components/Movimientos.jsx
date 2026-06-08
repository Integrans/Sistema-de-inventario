import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../api/apiRoutes";

const Movimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filtro, setFiltro] = useState("");

    // Cargar movimientos al abrir el componente
    useEffect(() => {
        axios.get(API_ROUTES.MOVIMIENTOS)
            .then((response) => {
                console.log("Carga inicial:");
                console.log(response.data);
                console.log("¿Es arreglo?", Array.isArray(response.data));
                setMovimientos(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar movimientos:", error);
            });
    }, []);

    // Buscar movimientos
    const obtenerMovimientos = () => {
        axios.get(API_ROUTES.MOVIMIENTOS, {
            params: { filtro }
        })
        .then((response) => {
            console.log("Búsqueda:");
            console.log(response.data);
            console.log("¿Es arreglo?", Array.isArray(response.data));

            setMovimientos(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener los movimientos:", error);
        });
    };

    console.log("Estado movimientos:", movimientos);
    console.log("¿Es arreglo?", Array.isArray(movimientos));

    return (
        <div className="container mt-4">
            <h5 className="mb-3">Movimientos de Inventario</h5>

            <div className="d-flex mb-3">
                <div
                    className="input-group"
                    style={{ maxWidth: "600px", width: "100%" }}
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar movimientos..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={obtenerMovimientos}
                    >
                        Buscar
                    </button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr
                        className="table-dark"
                        style={{ textTransform: "uppercase" }}
                    >
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.map((movimiento) => (
                        <tr key={movimiento.id_movimiento}>
                            <td>{movimiento.id_movimiento}</td>
                            <td>{movimiento.producto}</td>
                            <td>{movimiento.cantidad}</td>

                            <td>
                                <span
                                    className={
                                        movimiento.tipo_movimiento === "ENTRADA"
                                            ? "badge bg-success"
                                            : "badge bg-danger"
                                    }
                                >
                                    {movimiento.tipo_movimiento}
                                </span>
                            </td>

                            <td>
                                {new Date(
                                    movimiento.fecha
                                ).toLocaleString("es-MX")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Movimientos;