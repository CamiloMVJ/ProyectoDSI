import * as categoriasService from '../services/categorias.service.js';

// 1. listar
export const listar = async (req, res, next) => {
  try {
    const data = await categoriasService.findAll();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// 2. obtener
export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await categoriasService.findOne(id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// 3. crear
export const crear = async (req, res, next) => {
  try {
    const data = await categoriasService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

// 4. actualizar
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await categoriasService.update(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};