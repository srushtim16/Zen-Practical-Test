const { ProductMaster } = require('../models');

// Fetch all products for dropdown
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductMaster.findAll({
      order: [['Product_Name', 'ASC']]
    });
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Fetch single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductMaster.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message
    });
  }
};
