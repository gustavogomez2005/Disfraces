import React, { useState } from 'react';
import api from '../services/api';
import RegistroEmpleado from './RegistroEmpleado'; // Importamos el componente de registro que creamos antes

export default function Login({ onLoginSuccess }) {
    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [registrando, setRegistrando] = useState(false); // Estado para alternar vistas

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { identificador, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('empleado', JSON.stringify(response.data.empleado));
            onLoginSuccess(response.data.empleado);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión. Verifique sus datos.');
        }
    };

    // Si el usuario hace clic en "Crear cuenta", mostramos el componente de registro
    if (registrando) {
        return (
            <div style={styles.container}>
                <div style={{ width: '100%', maxWidth: '750px' }}>
                    <RegistroEmpleado />
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button 
                            onClick={() => setRegistrando(false)} 
                            style={styles.linkButton}
                        >
                            ← Volver al Inicio de Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h2 style={styles.title}>🎃 Alquiler de Disfraces</h2>
                <p style={styles.subtitle}>Iniciar Sesión de Empleado</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email, Teléfono o Nombre Completo</label>
                    <input 
                        type="text" 
                        value={identificador} 
                        onChange={(e) => setIdentificador(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="Ej: empleado@tienda.com o Juan Perez"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="••••••••"
                    />
                </div>

                <button type="submit" style={styles.button}>Ingresar al Sistema</button>

                {/* Enlace para crear cuenta */}
                <div style={styles.footerLink}>
                    <span>¿No tienes cuenta? </span>
                    <button 
                        type="button" 
                        onClick={() => setRegistrando(true)} 
                        style={styles.linkButton}
                    >
                        Crear cuenta
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '1rem' },
    card: { background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { marginBottom: '0.5rem', color: '#333', textAlign: 'center' },
    subtitle: { marginBottom: '1.5rem', color: '#666', textAlign: 'center', fontSize: '0.9rem' },
    inputGroup: { marginBottom: '1.2rem', display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#444' },
    input: { padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' },
    button: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
    error: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '5px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' },
    footerLink: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' },
    linkButton: { background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }
};


/*
import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { identificador, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('empleado', JSON.stringify(response.data.empleado));
            onLoginSuccess(response.data.empleado);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión. Verifique sus datos.');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h2 style={styles.title}>🎃 Alquiler de Disfraces</h2>
                <p style={styles.subtitle}>Iniciar Sesión de Empleado</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email, Teléfono o Nombre Completo</label>
                    <input 
                        type="text" 
                        value={identificador} 
                        onChange={(e) => setIdentificador(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="Ej: empleado@tienda.com o Juan Perez"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                        placeholder="••••••••"
                    />
                </div>

                <button type="submit" style={styles.button}>Ingresar al Sistema</button>
            </form>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' },
    card: { background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { marginBottom: '0.5rem', color: '#333', textAlign: 'center' },
    subtitle: { marginBottom: '1.5rem', color: '#666', textAlign: 'center', fontSize: '0.9rem' },
    inputGroup: { marginBottom: '1.2rem', display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#444' },
    input: { padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' },
    button: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
    error: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '5px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }
};

*/