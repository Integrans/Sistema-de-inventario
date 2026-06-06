const BASE_URL = 'http://localhost:3000'

export const API_ROUTES = {
    LOGIN: `${BASE_URL}/login`,
    OBTENER_PRODUCTOS: `${BASE_URL}/productos`,
    CREAR_PRODUCTO: `${BASE_URL}/productos`,
    ACTUALIZAR_PRODUCTO: (id) => `${BASE_URL}/productos/${id}`,
    ELIMINAR_PRODUCTO: (id) => `${BASE_URL}/productos/${id}`,
    OBTENER_PRODUCTO_POR_ID: (id) => `${BASE_URL}/productos/?id=${id}`
}