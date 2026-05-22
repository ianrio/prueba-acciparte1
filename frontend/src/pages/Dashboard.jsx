import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

const INTERVENTION_LABELS = {
    medica:    'Médica',
    tecnica:   'Técnica',
    rescate:   'Rescate',
    logistica: 'Logística',
    otra:      'Otra',
};

export default function Dashboard() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        api.get('/reports')
            .then(({ data }) => { if (!cancelled) setReports(data.reports); })
            .catch((err) => {
                if (cancelled) return;
                setError(err.response?.data?.error || 'No se han podido cargar los informes');
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <h1>Informes</h1>
                    <p className="muted">
                        Tenant: <strong>{session.tenant.name}</strong>
                        {' · '}
                        Usuario: <strong>{session.user.email}</strong>
                    </p>
                </div>
                <div className="header-actions">
                    <Link className="button" to="/reports/new">+ Nuevo informe</Link>
                    <button type="button" className="button secondary" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main>
                {loading && <p>Cargando…</p>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && reports.length === 0 && (
                    <div className="empty">
                        Aún no hay informes registrados para este tenant.
                    </div>
                )}

                {!loading && !error && reports.length > 0 && (
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Lugar</th>
                                <th>Tipo de intervención</th>
                                <th>Creado por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.firstName}</td>
                                    <td>{r.lastName}</td>
                                    <td>{r.place}</td>
                                    <td>{INTERVENTION_LABELS[r.interventionType] ?? r.interventionType}</td>
                                    <td>{r.createdByEmail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}
