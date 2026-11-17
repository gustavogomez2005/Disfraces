import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [clienteIdEditando, setClienteIdEditando] = useState(null);

    // Estado del formulario
    const [form, setForm] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
        localidad: '',
        provincia: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            const res = await api.get('/clientes');
            setClientes(res.data);
        } catch (err) {
            console.error('Error al cargar clientes', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            if (modoEdicion) {
                await api.put(`/clientes/${clienteIdEditando}`, form);
                setMensaje('Cliente actualizado correctamente');
            } else {
                await api.post('/clientes', form);
                setMensaje('Cliente creado exitosamente');
            }

            limpiarFormulario();
            cargarClientes();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al procesar la operación');
        }
    };

    const prepararEdicion = (cliente) => {
        setModoEdicion(true);
        setClienteIdEditando(cliente.codigo_cliente);
        setForm({
            dni: cliente.dni || '',
            nombre: cliente.nombre || '',
            apellido: cliente.apellido || '',
            direccion: cliente.direccion || '',
            telefono: cliente.telefono || '',
            email: cliente.email || '',
            localidad: cliente.localidad || '',
            provincia: cliente.provincia || ''
        });
    };

    const eliminarCliente = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este cliente?')) return;
        setError('');
        setMensaje('');

        try {
            const res = await api.delete(`/clientes/${id}`);
            setMensaje(res.data.mensaje);
            cargarClientes();
        } catch (err) {
            setError(err.response?.data?.error || 'No se puede eliminar un cliente que haya alquilado algún disfraz.');
        }
    };

    const limpiarFormulario = () => {
        setModoEdicion(false);
        setClienteIdEditando(null);
        setForm({
            dni: '',
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            email: '',
            localidad: '',
            provincia: ''
        });
    };

    return (
        <div style={styles.container}>
            <h2>Gestión de Clientes</h2>
            
            {mensaje && <div style={styles.success}>{mensaje}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.formCard}>
                <h3>{modoEdicion ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
                
                <div style={styles.row}>
                    <input type="text" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required style={styles.input} />
                    <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required style={styles.input} />
                    <input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required style={styles.input} />
                </div>

                <div style={styles.row}>
                    <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} style={styles.input} />
                    <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} style={styles.input} />
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.row}>
                    <input type="text" name="localidad" placeholder="Localidad" value={form.localidad} onChange={handleChange} style={styles.input} />
                    <input type="text" name="provincia" placeholder="Provincia" value={form.provincia} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.btnRow}>
                    <button type="submit" style={styles.btnSubmit}>{modoEdicion ? 'Actualizar Cliente' : 'Guardar Cliente'}</button>
                    {modoEdicion && <button type="button" onClick={limpiarFormulario} style={styles.btnCancel}>Cancelar</button>}
                </div>
            </form>

            <h3 style={{ marginTop: '2rem' }}>Listado de Clientes Registrados</h3>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.thTr}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>DNI</th>
                        <th style={styles.th}>Nombre y Apellido</th>
                        <th style={styles.th}>Teléfono</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(c => (
                        <tr key={c.codigo_cliente} style={styles.tdTr}>
                            <td style={styles.td}>{c.codigo_cliente}</td>
                            <td style={styles.td}>{c.dni}</td>
                            <td style={styles.td}>{c.nombre} {c.apellido}</td>
                            <td style={styles.td}>{c.telefono || '-'}</td>
                            <td style={styles.td}>{c.email || '-'}</td>
                            <td style={styles.td}>
                                <button onClick={() => prepararEdicion(c)} style={styles.btnEdit}>Editar</button>
                                <button onClick={() => eliminarCliente(c.codigo_cliente)} style={styles.btnDelete}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
    formCard: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    input: { flex: 1, padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '0.95rem', minWidth: '200px' },
    btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
    btnSubmit: { padding: '0.7rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
    btnCancel: { padding: '0.7rem 1.5rem', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    thTr: { backgroundColor: '#f8fafc', textAlign: 'left' },
    th: { padding: '0.9rem', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase' },
    tdTr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '0.9rem', fontSize: '0.9rem', color: '#1e293b' },
    btnEdit: { padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
    btnDelete: { padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    success: { padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '5px', marginBottom: '1rem' },
    error: { padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '5px', marginBottom: '1rem' }
};
