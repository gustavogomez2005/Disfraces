import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AlquileresCliente() {
    const [clientes, setClientes] = useState([]);
    const [codigoClienteSeleccionado, setCodigoClienteSeleccionado] = useState('');
    const [alquileres, setAlquileres] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const buscarAlquileres = async (e) => {
        e.preventDefault();
        if (!codigoClienteSeleccionado) return;

        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/alquileres/cliente/${codigoClienteSeleccionado}`);
            setAlquileres(res.data);
            if (res.data.length === 0) {
                setError('Este cliente no registra alquileres previos.');
            }
        } catch (err) {
            setError('Error al consultar los alquileres del cliente.');
            setAlquileres([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Historial de Alquileres por Cliente</h2>
            <p style={styles.subtitle}>Selecciona un cliente para ver todas sus fichas de alquiler registradas.</p>

            <form onSubmit={buscarAlquileres} style={styles.form}>
                <select 
                    value={codigoClienteSeleccionado} 
                    onChange={(e) => setCodigoClienteSeleccionado(e.target.value)} 
                    required 
                    style={styles.select}
                >
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map(c => (
                        <option key={c.codigo_cliente} value={c.codigo_cliente}>
                            {c.nombre} {c.apellido} (DNI: {c.dni})
                        </option>
                    ))}
                </select>
                <button type="submit" style={styles.btnBuscar}>Buscar Alquileres</button>
            </form>

            {loading && <p style={styles.info}>Buscando registros...</p>}
            {error && <div style={styles.alertError}>{error}</div>}

            {alquileres.length > 0 && (
                <div style={styles.resultsContainer}>
                    <h3>Fichas Encontradas ({alquileres.length})</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thTr}>
                                <th style={styles.th}>Nº Alquiler</th>
                                <th style={styles.th}>Fecha Solicitud</th>
                                <th style={styles.th}>Salida</th>
                                <th style={styles.th}>Devolución</th>
                                <th style={styles.th}>Empleado Responsable</th>
                                <th style={styles.th}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alquileres.map(a => (
                                <tr key={a.numero_alquiler} style={styles.tdTr}>
                                    <td style={styles.td}>#{a.numero_alquiler}</td>
                                    <td style={styles.td}>{a.fecha_solicitud?.split('T')[0]}</td>
                                    <td style={styles.td}>{a.fecha_salida?.split('T')[0]}</td>
                                    <td style={styles.td}>{a.fecha_devolucion?.split('T')[0]}</td>
                                    <td style={styles.td}>{a.empleado_nombre} {a.empleado_apellido}</td>
                                    <td style={styles.td}>${Number(a.total).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '2rem', maxWidth: '900px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    subtitle: { color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' },
    form: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    select: { flex: 2, padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '0.95rem', minWidth: '250px' },
    btnBuscar: { padding: '0.7rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
    info: { color: '#475569', fontStyle: 'italic' },
    alertError: { padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '5px', marginBottom: '1rem' },
    resultsContainer: { marginTop: '2rem' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem', background: '#f8fafc', borderRadius: '6px', overflow: 'hidden' },
    thTr: { backgroundColor: '#e2e8f0', textAlign: 'left' },
    th: { padding: '0.8rem', fontSize: '0.85rem', color: '#334155', textTransform: 'uppercase' },
    tdTr: { borderBottom: '1px solid #e2e8f0' },
    td: { padding: '0.8rem', fontSize: '0.9rem', color: '#1e293b' }
};
