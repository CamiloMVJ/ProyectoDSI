export const validate = (schema, { stripUnknown = true } = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación en los datos enviados',
        errores: error.details.map((detail) => detail.message)
      });
    }

    req.body = value;
    next();
  };
};
