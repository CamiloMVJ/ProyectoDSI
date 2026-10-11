// Obtener todos los productos
export const getProducts = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: [] // Aquí se llamará a ProductService.getAll()
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      data: { id, name: "Producto mock" } // ProductService.getById(id)
    });
  } catch (error) {
    next(error);
  }
};

// Crear producto
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: { id: "1", ...productData } // ProductService.create(productData)
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar producto
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: { id, ...updateData } // ProductService.update(id, updateData)
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar producto
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Producto con id ${id} eliminado` // ProductService.delete(id)
    });
  } catch (error) {
    next(error);
  }
};