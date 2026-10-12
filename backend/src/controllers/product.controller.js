import * as productService from '../services/product.service.js';

// Extrae parámetros/filtros de req y envía la lista de productos
export const listar = async (req, res, next) => {
  try {
    const data = await productService.getAll();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Extrae el identificador de req.params y envía el producto correspondiente
export const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await productService.getById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado`
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

// Extrae los datos del producto desde req.body y responde con el registro creado
export const crear = async (req, res, next) => {
  try {
    const productData = req.body;
    const data = await productService.create(productData);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Extrae id de req.params y campos a modificar de req.body, enviando la respuesta
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await productService.update(id, updateData);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado para actualizar`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};