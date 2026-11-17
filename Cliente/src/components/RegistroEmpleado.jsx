import React, { useState } from 'react';
import api from '../services/api';

export default function RegistroEmpleado() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        rol: 'empleado'
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const res = await api.post('/auth/registro', form);
            setMensaje(`¡${res.data.mensaje} (ID: ${res.data.codigo_empleado})!`);
            // Limpiar formulario
            setForm({
                nombre: '',
                apellido: '',
                direccion: '',
                telefono: '',
                email: '',
                password: '',
                rol: 'empleado'
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar el empleado. Verifique los datos.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Registrar Nuevo Empleado</h2>
            <p style={styles.subtitle}>Cree cuentas de acceso con rol de empleado o administrador.</p>

            {mensaje && <div style={styles.success}>{mensaje}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                    <input 
                        type="text" 
                        name="apellido" 
                        placeholder="Apellido" 
                        value={form.apellido} 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>

                <div style={styles.row}>
                    <input 
                        type="text" 
                        name="telefono" 
                        placeholder="Teléfono" 
                        value={form.telefono} 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Correo Electrónico" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>

                <div style={styles.row}>
                    <input 
                        type="text" 
                        name="direccion" 
                        placeholder="Dirección" 
                        value={form.direccion} 
                        onChange={handleChange} 
                        style={styles.input} 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña (mín. 6 caracteres)" 
                        value={form.password} 
                        onChange={handleChange} 
                        required 
                        style={styles.input} 
                    />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Rol de Usuario</label>
                        <select name="rol" value={form.rol} onChange={handleChange} style={styles.input}>
                            <option value="empleado">Empleado</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                </div>

                <button type="submit" style={styles.button}>Registrar Empleado</button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: '2rem', maxWidth: '750px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    subtitle: { color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    inputGroup: { flex: 1, display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#444' },
    input: { flex: 1, padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '0.95rem', minWidth: '220px' },
    button: { padding: '0.8rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
    success: { padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '5px', marginBottom: '1rem' },
    error: { padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '5px', marginBottom: '1rem' }
};
