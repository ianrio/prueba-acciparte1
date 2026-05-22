export function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Ruta no encontrada' });
}

export function errorHandler(err, req, res, _next) {
    if (err && err.status) {
        return res.status(err.status).json({
            error: err.message,
            ...(err.details ? { details: err.details } : {}),
        });
    }

    console.error('[Unhandled error]', err);
    res.status(500).json({ error: 'Error interno del servidor' });
}


export class HttpError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        if (details) this.details = details;
    }
}
