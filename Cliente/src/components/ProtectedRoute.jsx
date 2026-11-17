import React from 'react';

export default function ProtectedRoute({ children, rolRequerido }) {
    const token = localStorage.getItem('token');
    const empleadoStr = localStorage.getItem('empleado');
    const empleado = empleadoStr ? JSON.parse(empleadoStr) : null;

    // 1. Si no hay token o datos de empleado, redirigir o bloquear acceso
    if (!token || !empleado) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2>Acceso Denegado</h2>
                    <p>Debe iniciar sesión para acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    // 2. Si se requiere un rol específico (ej: 'administrador') y el usuario no lo tiene
    if (rolRequerido && empleado.rol !== rolRequerido) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2>⚠️ Restricción de Acceso</h2>
                    <p>No tienes los permisos necesarios (Rol requerido: <strong>{rolRequerido}</strong>).</p>
                </div>
            </div>
        );
    }

    // Si pasa las validaciones, renderiza el componente hijo
    return children;
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
    card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px' }
};
