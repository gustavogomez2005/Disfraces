import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Disfraces({ empleado }) {
    const [disfraces, setDisfraces] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const cargarDisfraces = async () => {
        try {
            const res = await api.get('/disfraces');
            setDisfraces(res.data);
        } catch (err) {
            console.error('Error al cargar disfraces', err);
        }
    };

    useEffect(() => {
        cargarDisfraces();
    }, []);

    const verificarDisponibilidad = async (id) => {
        try {
            const res = await api.get(`/disfraces/${id}/disponibilidad`);
            alert(`Disfraz: ${res.data.nombre_disfraz}\nEstado: ${res.data.estado_disponibilidad}`);
        } catch (err) {
            alert('Error al verificar disponibilidad');
        }
    };

    const eliminarDisfraz = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este disfraz? (Solo Administradores)')) return;
        try {
            const res = await api.delete(`/disfraces/${id}`);
            setMensaje(res.data.mensaje);
            cargarDisfraces();
        } catch (err) {
            alert(err.response?.data?.error || 'No se pudo eliminar el disfraz');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Gestión de Disfraces</h2>
            {mensaje && <div style={styles.alert}>{mensaje}</div>}
            
            <table style={styles.table}>
                <thead>
                    <tr style={styles.thTr}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Piezas</th>
                        <th style={styles.th}>Categoría</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {disfraces.map((d) => (
                        <tr key={d.codigo_disfaz} style={styles.tdTr}>
                            <td style={styles.td}>{d.codigo_disfaz}</td>
                            <td style={styles.td}>{d.nombre_disfraz}</td>
                            <td style={styles.td}>{d.cantidad_piezas}</td>
                            <td style={styles.td}>{d.categoria_descripcion}</td>
                            <td style={styles.td}>
                                <button onClick={() => verificarDisponibilidad(d.codigo_disfaz)} style={styles.btnInfo}>Ver Estado</button>
                                {empleado.rol === 'administrador' && (
                                    <button onClick={() => eliminarDisfraz(d.codigo_disfaz)} style={styles.btnDanger}>Dar de Baja</button>
                                )}
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
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' },
    thTr: { backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '1rem', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase' },
    tdTr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '1rem', fontSize: '0.95rem', color: '#1e293b' },
    btnInfo: { padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
    btnDanger: { padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    alert: { padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '1rem', borderRadius: '5px' }
};
