/*
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajusta el puerto de tu backend
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token JWT en las cabeceras si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;


*/

/*
Para manejar de forma centralizada los errores HTTP y la expiración de tokens JWT en el frontend, podemos configurar un interceptores de respuesta en Axios. Esto evita tener que repetir bloques try/catch o validaciones de token en cada petición realizada a la API.

A continuación te muestro cómo actualizar tu archivo src/services/api.js para capturar errores como tokens expirados (401 Unauthenticated), accesos denegados (403 Forbidden) y fallos generales del servidor.
*/


import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Interceptor de Solicitud (Agrega el token JWT si existe)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor de Respuesta (Manejo global de errores y tokens expirados)
api.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente la retornamos
        return response;
    },
    (error) => {
        const { response } = error;

        if (response) {
            const status = response.status;
            
            // Caso 1: Token expirado o inválido (401 Unauthorized o 403 Forbidden por token vencido)
            if (status === 401 || status === 403) {
                // Verificamos si realmente tenemos un token guardado (para evitar bucles en el login)
                const token = localStorage.getItem('token');
                if (token) {
                    console.warn('La sesión ha expirado o el token es inválido.');
                    
                    // Limpiamos el almacenamiento local
                    localStorage.removeItem('token');
                    localStorage.removeItem('empleado');
                    
                    // Notificamos al usuario opcionalmente
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    
                    // Redirigimos al usuario a la pantalla de login recargando la app
                    window.location.href = '/'; 
                }
            }
            
            // Caso 2: Errores de validación o lógica de negocio (400 Bad Request)
            else if (status === 400) {
                // Aquí puedes retornar el error personalizado del backend para que lo maneje el componente
                console.error('Error de validación:', response.data.error || response.data.errores);
            }
            
            // Caso 3: Errores internos del servidor (500 Internal Server Error)
            else if (status >= 500) {
                console.error('Error interno en el servidor. Intente más tarde.');
            }
        } else {
            // Error de red (servidor apagado o sin conexión)
            console.error('No se pudo conectar con el servidor backend.');
        }

        return Promise.reject(error);
    }
);

export default api;

/*
¿Cómo funciona en la práctica?
Expiración de Token Automática: Si un empleado realiza una petición y su token JWT ha expirado (el backend responde con 401 o 403), el interceptor detecta la respuesta, limpia automáticamente el localStorage borrando las credenciales vencidas, avisa al usuario mediante una alerta y lo redirige de inmediato a la pantalla de inicio de sesión (/).

Centralización: Los componentes individuales de React ya no necesitan validar manualmente si el token falló; se concentran únicamente en mostrar los datos o capturar errores específicos de negocio (como cuando intentas eliminar un cliente con alquileres activos).

*/