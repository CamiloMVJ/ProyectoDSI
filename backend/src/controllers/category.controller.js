export const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: [] // CategoryService.getAll()
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      data: { id, name: "Categoría mock" } // CategoryService.getById(id)
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: { id: "1", ...categoryData } // CategoryService.create(categoryData)
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: { id, ...updateData } // CategoryService.update(id, updateData)
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Categoría con id ${id} eliminada` // CategoryService.delete(id)
    });
  } catch (error) {
    next(error);
  }
};