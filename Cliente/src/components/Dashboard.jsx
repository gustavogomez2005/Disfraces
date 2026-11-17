import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
    const [masAlquilado, setMasAlquilado] = useState(null);
    const [menosAlquilado, setMenosAlquilado] = useState(null);
    const [empleadoTop, setEmpleadoTop] = useState(null);
    
    // Filtro de recaudación por fechas
    const [fechaInicio, setFechaInicio] = useState('2026-01-01');
    const [fechaFin, setFechaFin] = useState('2026-12-31');
    const [recaudacion, setRecaudacion] = useState(null);

    useEffect(() => {
        api.get('/alquileres/reportes/disfraz-mas-alquilado').then(res => setMasAlquilado(res.data));
        api.get('/alquileres/reportes/disfraz-menos-alquilado').then(res => setMenosAlquilado(res.data));
        api.get('/alquileres/reportes/empleado-top').then(res => setEmpleadoTop(res.data));
        consultarRecaudacion();
    }, []);

    const consultarRecaudacion = async () => {
        try {
            const res = await api.get(`/alquileres/reportes/recaudacion?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
            setRecaudacion(res.data.recaudacion_total || 0);
        } catch (err) {
            console.error('Error al calcular recaudación', err);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Panel de Reportes y Consultas</h2>
            
            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3>🏆 Disfraz Más Alquilado</h3>
                    <p style={styles.highlight}>{masAlquilado?.nombre_disfraz || 'Cargando...'}</p>
                    <small>Total Alquileres: {masAlquilado?.total_alquileres || 0}</small>
                </div>

                <div style={styles.card}>
                    <h3>📉 Disfraz Menos Alquilado</h3>
                    <p style={styles.highlight}>{menosAlquilado?.nombre_disfraz || 'Cargando...'}</p>
                    <small>Total Alquileres: {menosAlquilado?.total_alquileres || 0}</small>
                </div>

                <div style={styles.card}>
                    <h3>🌟 Empleado Destacado</h3>
                    <p style={styles.highlight}>{empleadoTop ? `${empleadoTop.nombre} ${empleadoTop.apellido}` : 'Cargando...'}</p>
                    <small>Alquileres realizados: {empleadoTop?.cantidad_alquileres || 0}</small>
                </div>
            </div>

            <div style={styles.cardWide}>
                <h3>💰 Recaudación entre Fechas</h3>
                <div style={styles.formInline}>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={styles.input} />
                    <span>hasta</span>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={styles.input} />
                    <button onClick={consultarRecaudacion} style={styles.btn}>Calcular</button>
                </div>
                <h2 style={styles.money}>${Number(recaudacion || 0).toLocaleString()}</h2>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
    card: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    cardWide: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    highlight: { fontSize: '1.25rem', fontWeight: 'bold', color: '#4f46e5', margin: '0.5rem 0' },
    formInline: { display: 'flex', gap: '1rem', alignItems: 'center', margin: '1rem 0' },
    input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
    btn: { padding: '0.5rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    money: { color: '#16a34a', marginTop: '0.5rem' }
};
