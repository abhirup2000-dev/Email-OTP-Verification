const Product = require("../models/product");
const StatusCode = require("../utils/StatusCode");

class productController {

  async createProduct(req, res) {
    try {
      const { name, description, price, category, inStock } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        category,
        inStock,
      });

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: "Product created successfully",
        product,
      });

    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await Product.find();

      return res.status(StatusCode.OK).json({
        success: true,
        message: "All products fetched successfully",
        length: products.length,
        products,
      });

    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Product id is required",
        });
      }

      const product = await Product.findByIdAndUpdate(id, req.body, { returnDocument:'after' });

      if (!product) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Product updated successfully",
        product,
      });

    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Product id is required",
        });
      }

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Product deleted successfully",
      });

    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new productController();