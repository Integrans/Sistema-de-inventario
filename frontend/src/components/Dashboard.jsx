import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import Inventario from "./Inventario"

const Dashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { usuario } = location.state || { }

    //FUNCION PARA MANEJAR EL CIERRE DE SESION
    const handleLogout = () => {
        Swal.fire({
            icon: 'warning',
            title: '¿Estas seguro?',
            text: 'Quieres cerrar sesion',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        })
        .then((result)=>{
            if(result.isConfirmed){
                Swal.fire({
                    icon: 'success',
                    title: 'Hasta luego',
                    text: 'Gracias por usar la aplicación',
                    timer: 2000, //Espera 2 segundos antes de redirigir
                    showConfirmButton: false
                })
                .then(()=>{
                    navigate('../login')
                })
            }
        })
    }

    const renderAreaComponent = () => {
        switch(usuario.rol) {
            case 'EMPLEADO': return <Inventario />
        }
    }

    return(
        <div>
            {/*BARRA SUPERIOR */}
            <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3">
                <div className="text-center w-100">
                    <p className="m-0">{usuario.nombre}</p>
                    <p className="m-0">{usuario.rol}</p>
                </div>

                <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                </button>
            </div>
            { renderAreaComponent() }
        </div>
    )
}

export default Dashboard