import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Disfraces from './components/Disfraces';
import Clientes from './components/Clientes';
import NuevoAlquiler from './components/NuevoAlquiler';
import AlquileresCliente from './components/AlquileresCliente';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Importamos el componente

export default function App() {
    const [empleado, setEmpleado] = useState(null);
    const [vistaActiva, setVistaActiva] = useState('disfraces');

    useEffect(() => {
        const storedEmpleado = localStorage.getItem('empleado');
        if (storedEmpleado) {
            setEmpleado(JSON.parse(storedEmpleado));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('empleado');
        setEmpleado(null);
    };

    if (!empleado) {
        return <Login onLoginSuccess={(emp) => setEmpleado(emp)} />;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <nav style={styles.nav}>
                <div style={styles.navBrand}>🎭 Tienda de Disfraces</div>
                // En la barra de navegación de App.jsx:
                <div style={styles.navLinks}>
                    <button onClick={() => setVistaActiva('disfraces')} style={vistaActiva === 'disfraces' ? styles.linkActive : styles.link}>Disfraces</button>
                    <button onClick={() => setVistaActiva('clientes')} style={vistaActiva === 'clientes' ? styles.linkActive : styles.link}>Clientes</button>
                    <button onClick={() => setVistaActiva('nuevoAlquiler')} style={vistaActiva === 'nuevoAlquiler' ? styles.linkActive : styles.link}>Nuevo Alquiler</button>
                    <button onClick={() => setVistaActiva('alquileresCliente')} style={vistaActiva === 'alquileresCliente' ? styles.linkActive : styles.link}>Buscar por Cliente</button>
                    
                    {/* Opción exclusiva para administradores */}
                    {empleado.rol === 'administrador' && (
                        <>
                            <button onClick={() => setVistaActiva('registroEmpleado')} style={vistaActiva === 'registroEmpleado' ? styles.linkActive : styles.link}>Registrar Empleado</button>
                            <button onClick={() => setVistaActiva('dashboard')} style={vistaActiva === 'dashboard' ? styles.linkActive : styles.link}>Reportes</button>
                        </>
                    )}
                </div>
                <div style={styles.userSection}>
                    <span style={styles.userText}>{empleado.nombre} ({empleado.rol})</span>
                    <button onClick={handleLogout} style={styles.btnLogout}>Cerrar Sesión</button>
                </div>
            </nav>

            {/* Renderizado de la vista de registro */}
            <main>
                {vistaActiva === 'disfraces' && <Disfraces empleado={empleado} />}
                {vistaActiva === 'clientes' && <Clientes />}
                {vistaActiva === 'nuevoAlquiler' && <NuevoAlquiler empleadoActual={empleado} />}
                {vistaActiva === 'alquileresCliente' && <AlquileresCliente />}
                {vistaActiva === 'registroEmpleado' && (
                    <ProtectedRoute rolRequerido="administrador">
                        <RegistroEmpleado />
                    </ProtectedRoute>
                )}
                {vistaActiva === 'dashboard' && (
                    <ProtectedRoute rolRequerido="administrador">
                        <Dashboard />
                    </ProtectedRoute>
                )}
            </main>
        </div>
    );
}

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e2e8f0' },
    navBrand: { fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b' },
    navLinks: { display: 'flex', gap: '1rem', alignItems: 'center' },
    link: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#64748b' },
    linkActive: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#4f46e5', fontWeight: 'bold' },
    userSection: { display: 'flex', alignItems: 'center', gap: '1rem' },
    userText: { fontSize: '0.9rem', color: '#334155' },
    btnLogout: { padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};
