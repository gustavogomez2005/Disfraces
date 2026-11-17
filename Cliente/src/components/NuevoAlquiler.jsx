import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function NuevoAlquiler({ empleadoActual, onAlquilerCreado }) {
    const [clientes, setClientes] = useState([]);
    const [disfraces, setDisfraces] = useState([]);
    
    // Datos del formulario principal
    const [codigoCliente, setCodigoCliente] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const [total, setTotal] = useState('');
    
    // Ítems de la ficha (detalles)
    const [items, setItems] = useState([{ codigo_disfaz: '', cantidad: 1 }]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        cargarDatosAuxiliares();
    }, []);

    const cargarDatosAuxiliares = async () => {
        try {
            const [resClientes, resDisfraces] = await Promise.all([
                api.get('/clientes'),
                api.get('/disfraces')
            ]);
            setClientes(resClientes.data);
            setDisfraces(resDisfraces.data);
        } catch (err) {
            console.error('Error al cargar datos para el alquiler', err);
        }
    };

    const handleItemChange = (index, field, value) => {
        const nuevosItems = [...items];
        nuevosItems[index][field] = value;
        setItems(nuevosItems);
    };

    const agregarFilaItem = () => {
        setItems([...items, { codigo_disfaz: '', cantidad: 1 }]);
    };

    const eliminarFilaItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        const fechaSolicitud = new Date().toISOString().split('T')[0];

        const payload = {
            fecha_solicitud: fechaSolicitud,
            fecha_salida: fechaSalida,
            fecha_devolucion: fechaDevolucion,
            codigo_cliente: Number(codigoCliente),
            codigo_empleado: Number(empleadoActual.codigo_empleado || empleadoActual.codigo),
            total: Number(total),
            items: items.map(i => ({
                codigo_disfaz: Number(i.codigo_disfaz),
                cantidad: Number(i.cantidad)
            }))
        };

        try {
            const res = await api.post('/alquileres', payload);
            setMensaje(`¡Ficha de alquiler #${res.data.numero_alquiler} registrada con éxito!`);
            // Limpiar formulario
            setCodigoCliente('');
            setFechaSalida('');
            setFechaDevolucion('');
            setTotal('');
            setItems([{ codigo_disfaz: '', cantidad: 1 }]);
            if (onAlquilerCreado) onAlquilerCreado();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar la ficha de alquiler.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Registrar Nueva Ficha de Alquiler</h2>
            
            {mensaje && <div style={styles.success}>{mensaje}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Cliente</label>
                        <select 
                            value={codigoCliente} 
                            onChange={(e) => setCodigoCliente(e.target.value)} 
                            required 
                            style={styles.input}
                        >
                            <option value="">Seleccione un cliente...</option>
                            {clientes.map(c => (
                                <option key={c.codigo_cliente} value={c.codigo_cliente}>
                                    {c.nombre} {c.apellido} (DNI: {c.dni})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Empleado Responsable</label>
                        <input 
                            type="text" 
                            disabled 
                            value={`${empleadoActual.nombre} ${empleadoActual.apellido || ''}`} 
                            style={{ ...styles.input, backgroundColor: '#f1f5f9' }} 
                        />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Fecha de Salida</label>
                        <input 
                            type="date" 
                            value={fechaSalida} 
                            onChange={(e) => setFechaSalida(e.target.value)} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Fecha de Devolución</label>
                        <input 
                            type="date" 
                            value={fechaDevolucion} 
                            onChange={(e) => setFechaDevolucion(e.target.value)} 
                            required 
                            style={styles.input} 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Total ($)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            value={total} 
                            onChange={(e) => setTotal(e.target.value)} 
                            required 
                            style={styles.input} 
                        />
                    </div>
                </div>

                <hr style={styles.divider} />

                <h3>Disfraces a Alquilar (Detalle)</h3>
                {items.map((item, index) => (
                    <div key={index} style={styles.itemRow}>
                        <select 
                            value={item.codigo_disfaz} 
                            onChange={(e) => handleItemChange(index, 'codigo_disfaz', e.target.value)} 
                            required 
                            style={{ ...styles.input, flex: 2 }}
                        >
                            <option value="">Seleccione un disfraz...</option>
                            {disfraces.map(d => (
                                <option key={d.codigo_disfaz} value={d.codigo_disfaz}>
                                    {d.nombre_disfraz} (Piezas: {d.cantidad_piezas})
                                </option>
                            ))}
                        </select>

                        <input 
                            type="number" 
                            min="1" 
                            value={item.cantidad} 
                            onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)} 
                            required 
                            style={{ ...styles.input, flex: 1 }} 
                            placeholder="Cantidad"
                        />

                        {items.length > 1 && (
                            <button type="button" onClick={() => eliminarFilaItem(index)} style={styles.btnDelete}>
                                Eliminar
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={agregarFilaItem} style={styles.btnAddItem}>
                    + Agregar otro disfraz
                </button>

                <button type="submit" style={styles.btnSubmit}>Guardar Ficha de Alquiler</button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' },
    row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    inputGroup: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: '200px' },
    label: { marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#444' },
    input: { padding: '0.7rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '0.95rem' },
    divider: { border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' },
    itemRow: { display: 'flex', gap: '1rem', alignItems: 'center' },
    btnAddItem: { padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' },
    btnDelete: { padding: '0.7rem 1rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnSubmit: { padding: '0.9rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
    success: { padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '5px', marginBottom: '1rem' },
    error: { padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '5px', marginBottom: '1rem' }
};
