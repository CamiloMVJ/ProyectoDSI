export const validar = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores: error.details.map((detalle) => ({
                    campo: detalle.path.join('.'),
                    mensaje: detalle.message
                }))
            });
        }

        req.body = value;
        next();
    };
};