import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email.trim(), password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            const msg = err.response?.data?.error || 'No se ha podido iniciar sesión';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-screen">
            <form className="card" onSubmit={handleSubmit}>
                <h1>Acciparte</h1>
                <p className="muted">Inicia sesión para acceder a tus informess</p>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </label>

                <label>
                    Contraseña
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Entrando…' : 'Entrar'}
                </button>

                <div className="hint">
                    <strong>Usuarios de prueba</strong>
                    <ul>
                        <li>admin@acme.com / acme1234</li>
                        <li>admin@globex.com / globex1234</li>
                    </ul>
                </div>
            </form>
        </div>
    );
}
