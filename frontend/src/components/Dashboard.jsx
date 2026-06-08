import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Inventario from "./Inventario";
import Movimientos from "./Movimientos";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario } = location.state || {};

    const [mostrarMovimientos, setMostrarMovimientos] = useState(false);

    // FUNCION PARA MANEJAR EL CIERRE DE SESION
    const handleLogout = () => {
        Swal.fire({
            icon: "warning",
            title: "¿Estas seguro?",
            text: "Quieres cerrar sesion",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Hasta luego",
                    text: "Gracias por usar la aplicación",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate("../login");
                });
            }
        });
    };

    const renderAreaComponent = () => {
        switch (usuario.rol) {
            case "EMPLEADO":
                return <Inventario rol="EMPLEADO" />;

            case "ADMIN":
                return <Inventario rol="ADMIN" />;

            default:
                return <h3 className="text-center mt-3">Rol no autorizado</h3>;
        }
    };

    return (
        
        <div>
            
            {/* BARRA SUPERIOR */}
            <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3">
                <div className="text-center w-100">

                    <p className="m-0">{usuario.nombre}</p>
                    <p className="m-0">{usuario.rol}</p>
                </div>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>

            {/* BOTON SOLO PARA ADMIN */}
            {usuario.rol === "ADMIN" && (
                <div className="container mt-3">
                    <button
                        className="btn btn-info"
                        onClick={() =>
                            setMostrarMovimientos(!mostrarMovimientos)
                        }
                    >
                        {mostrarMovimientos
                            ? "Ocultar movimientos"
                            : "Ver movimientos"}
                    </button>
                </div>
            )}

            {/* INVENTARIO */}
            {renderAreaComponent()}

            {/* MOVIMIENTOS SOLO PARA ADMIN */}
            {usuario.rol === "ADMIN" && mostrarMovimientos && (
                <Movimientos />
            )}
        </div>
    );
};

export default Dashboard;