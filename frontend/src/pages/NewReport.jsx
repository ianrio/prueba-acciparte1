import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    place: '',
    interventionType: '',
};

export default function NewReport() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [interventionTypes, setInterventionTypes] = useState([]);

    useEffect(() => {
        api.get('/intervention-types')
            .then(({ data }) => setInterventionTypes(data.types))
            .catch(() => setInterventionTypes([]));
    }, []);

    function update(field) {
        return (e) => {
            const value = e.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            }
        };
    }

    function validateStep1() {
        const next = {};
        if (form.firstName.trim().length < 2) next.firstName = 'Nombre obligatorio (mín. 2 caracteres)';
        if (form.lastName.trim().length < 2)  next.lastName  = 'Apellidos obligatorios (mín. 2 caracteres)';
        if (form.place.trim().length < 2)     next.place     = 'Lugar obligatorio (mín. 2 caracteres)';
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function validateStep2() {
        const next = {};
        if (!form.interventionType) {
            next.interventionType = 'Selecciona un tipo de intervención';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function goNext() {
        if (validateStep1()) setStep(2);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateStep2()) return;

        setSubmitting(true);
        setSubmitError(null);
        try {
            await api.post('/reports', form);
            navigate('/dashboard');
        } catch (err) {
            const details = err.response?.data?.details;
            if (details) {
                setErrors(details);
                if (details.firstName || details.lastName || details.place) setStep(1);
            } else {
                setSubmitError(err.response?.data?.error || 'No se ha podido crear el informe');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <h1>Nuevo informe</h1>
                    <p className="muted">Paso {step} de 2</p>
                </div>
                <button type="button" className="button secondary" onClick={() => navigate('/dashboard')}>
                    Cancelar
                </button>
            </header>

            <main>
                <form className="card form" onSubmit={handleSubmit}>
                    <div className="stepper">
                        <span className={step >= 1 ? 'step active' : 'step'}>1. Dats personales</span>
                        <span className={step >= 2 ? 'step active' : 'step'}>2. Tipo de intervención</span>
                    </div>

                    {step === 1 && (
                        <>
                            <label>
                                Nombre
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={update('firstName')}
                                    autoFocus
                                />
                                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                            </label>

                            <label>
                                Apellidos
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={update('lastName')}
                                />
                                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                            </label>

                            <label>
                                Lugar
                                <input
                                    type="text"
                                    value={form.place}
                                    onChange={update('place')}
                                />
                                {errors.place && <span className="field-error">{errors.place}</span>}
                            </label>

                            <div className="actions">
                                <button type="button" onClick={goNext}>Siguiente</button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <label>
                                Tipo de intervención
                                <select
                                    value={form.interventionType}
                                    onChange={update('interventionType')}
                                >
                                    <option value="">— Selecciona una opción —</option>
                                    {interventionTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                {errors.interventionType && (
                                    <span className="field-error">{errors.interventionType}</span>
                                )}
                            </label>

                            {submitError && <div className="error">{submitError}</div>}

                            <div className="actions">
                                <button type="button" className="button secondary" onClick={() => setStep(1)}>
                                    Atrás
                                </button>
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Guardando…' : 'Guardar informe'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </main>
        </div>
    );
}
