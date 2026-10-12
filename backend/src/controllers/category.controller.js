import * as categoryService from '../services/category.service.js';

// Extrae parámetros/filtros de req y envía la lista de categorías
export const listar = async (req, res, next) => {
  try {
    const data = await categoryService.getAll();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Extrae el identificador de req.params y envía la categoría correspondiente
export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await categoryService.getById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${id} no encontrada`
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Extrae el cuerpo de la petición (req.body) y responde con el registro creado
export const crear = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const data = await categoryService.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Extrae id de req.params y datos a modificar de req.body, enviando el resultado
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await categoryService.update(id, updateData);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${id} no encontrada para actualizar`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};