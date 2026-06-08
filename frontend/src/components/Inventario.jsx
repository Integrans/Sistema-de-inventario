import React, { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { API_ROUTES } from "../api/apiRoutes"

const Inventario = () => {
    const [ productos, setProductos ] = useState([])

    const [ modalProducto, setModalProducto ] = useState(false)
    const [ filteredProductos, setFilteredProductos ] = useState([])
    const [ prodSeleccionado, setProdSeleccionado ] = useState({
        id_producto: '',
        nombre: '',
        descripcion: '',
        precio: '',
        stock_actual: '',
        stock_minimo: '',
        isEditing: false
    })

    const [ filter, setFilter ] = useState('')

    //USEEFFECT PARA OBTENER LOS PRODUCTOS DEL BACKEND
    useEffect(()=>{
        axios.get(API_ROUTES.OBTENER_PRODUCTOS)
        .then(response => {
            setProductos(response.data)
            setFilteredProductos(response.data)
        })
    }, [])

    //FUNCION PARA MANEJAR CAMBIOS EN EL CAMPO DE FILTRO
    const handleFilterChange = (e) => {
        const value = e.target.value
        setFilter(value)

        //Filtrar los productos basado en el ID o Nombre del producto
        const filtered = productos.filter(producto => 
            producto.id_producto.toString().includes(value) ||
            producto.nombre.toLowerCase().includes(value.toLowerCase())
        )

        setFilteredProductos(filtered)
    }

    //Funcion para abrir el modal de nuevo producto
    const nuevoProducto = () => {
        setProdSeleccionado({
            id_producto: '',
            nombre: '',
            descripcion: '',
            precio: '',
            stock_actual: '',
            stock_minimo: '',
            isEditing: false
        })

        setModalProducto(true)
    }

    //Funcion para manejar los cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target
        setProdSeleccionado({
            ...prodSeleccionado,
            [name]: value
        })
    }

    //Funcion para guardar nuevo producto o editar uno existente
    const guardarProducto = () => {
        if(prodSeleccionado.isEditing) { //Actualizar producto existente
            axios.put(API_ROUTES.ACTUALIZAR_PRODUCTO(prodSeleccionado.id_producto),{
            nombre: prodSeleccionado.nombre,
            descripcion: prodSeleccionado.descripcion,
            precio: prodSeleccionado.precio,
            stock_actual: prodSeleccionado.stock_actual,
            stock_minimo: prodSeleccionado.stock_minimo
            })
            .then(response => {
                //Actualizar el producto en la lista de productos
                const updateProductos = productos.map(producto =>
                    producto.id_producto === prodSeleccionado.id_producto ? { ...prodSeleccionado, ...response.data } : producto
                )

                setProductos(updateProductos)
                setFilteredProductos(updateProductos)
                setModalProducto(false)

                Swal.fire({
                    icon: 'success',
                    title: 'Producto actualizado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el producto',
                    text: 'Hubo un problema al actualizar los datos'
                })
            })
        } else {
            //crear producto nuevo
            axios.post(API_ROUTES.CREAR_PRODUCTO, prodSeleccionado)
            .then(response => {
                console.log(response.data)
                const newProductos = [...productos, response.data]
                setProductos(newProductos)
                setFilteredProductos(newProductos)
                setModalProducto(false)

                Swal.fire({
                    icon: 'success',
                    title: 'Producto creado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el producto',
                    text: 'Hubo un problema al guardar el producto'
                })
            })
        }
    }

    //Función para abrir el modal con los datos del producto a editar
    const editarProducto = (producto) => {
        setProdSeleccionado({
            ...producto,
            isEditing: true
        })

        setModalProducto(true)
    }

    //Funcion para borrar un producto
    const borrarProducto = (producto) => {
        Swal.fire({
            icon: 'warning',
            title: '¿Estas seguro?',
            text: `No podras revertir la eliminación del producto: ${producto.id_producto} - ${producto.nombre}`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if(result.isConfirmed){
                axios.delete(API_ROUTES.ELIMINAR_PRODUCTO(producto.id_producto))
                .then(() => {
                    const updateProductos = productos.filter(p => p.id_producto !== producto.id_producto)
                    setProductos(updateProductos)
                    setFilteredProductos(updateProductos)

                    Swal.fire({
                        icon: 'success',
                        title: 'Producto eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar el producto',
                        text: 'Hubo un problema al eliminar el producto'
                    })
                })
            }
        })
    }

    //Funcion para destacar si es urgente solicitar mas productos
    const getEstadoExistenciasClass = (producto) => {
        const stock_actual = Number(producto.stock_actual)
        const stock_minimo = Number(producto.stock_minimo)

        if(stock_actual <= stock_minimo){
            return 'bg-danger text-white'
        } else if(stock_actual <= stock_minimo+5){
            return 'bg-warning text-white'
        } else {
            return 'bg-success text-white'
        }
    }

    return(
        <div className="container mt-4">
            <h3 className="text-center mb-4">Listado de productos</h3>

            {/*Input para filtrar productos */}
            <div className="d-flex justify-content-start mb-3">
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Filtrar por codigo, nombre del producto"
                    value={filter}
                    onChange={handleFilterChange}
                />
            </div>

            {/*Boton para agregar un nuevo producto*/}
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-primary"
                    onClick={nuevoProducto}
                >
                    <i className="bi bi-plus-circle"></i>Nuevo producto
                </button>
            </div>

            <table className="table table-bordered table-striped">
                <thead>
                    <tr className="text-center" style={{textTransform: 'uppercase'}}>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Existencias</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredProductos.map((producto, index) =>(
                        <tr key={index}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.precio}</td>
                            <td className={`text-center ${getEstadoExistenciasClass(producto)}`}>
                                {producto.stock_actual}
                            </td>
                            <td className="text-center">
                                <button 
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => editarProducto(producto)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>

                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => borrarProducto(producto)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/*Modal de productos */}
            {modalProducto && (
                <div className="modal show" style={{display: "block"}} onClick={() => setModalProducto(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {prodSeleccionado.isEditing ? "Editar producto" : "Nuevo producto"}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalProducto(false)}
                                >
                                </button>
                            </div>

                            <div className="modal-body">
                                {/*Formulario */}
                                <form>
                                    <div className="form-group mb-3">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={prodSeleccionado.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                        <textarea
                                            name="descripcion"
                                            id="descripcion"
                                            className="form-control"
                                            value={prodSeleccionado.descripcion}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Precio</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="precio"
                                            value={prodSeleccionado.precio}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Existencias</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="stock_actual"
                                            value={prodSeleccionado.stock_actual}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Stock mínimo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="stock_minimo"
                                            value={prodSeleccionado.stock_minimo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalProducto(false)}>
                                    Cancelar
                                </button>

                                <button type="button" className="btn btn-primary" onClick={guardarProducto}>
                                    {prodSeleccionado.isEditing ? "Guardar cambios" : "Guardar producto"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Inventario

