import productModel from "../Models/product.model.js";

const getProductsfunc = async (req, res) => {
  try {
    let filter = {};

    let queryName = req.query.name;
    let queryCategory = req.query.category;
    let queryPrice = req.query.price;

    if (queryName) {
      filter.name = queryName;
    }

    if (queryCategory) {
      filter.category = queryCategory;
    }

    if (queryPrice) {
      filter.price = queryPrice;
    }

    console.log(filter);

    const getAll = await productModel.find(filter);
    if (!getAll) {
      return res.status(400).json({
        status: false,
      });
    } else {
      return res.status(200).json({
        status: true,
        data: getAll,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      Error: error,
      message: error.message,
    });
  }
};

const createProductsfunc = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    const createdProduct = await productModel.create(body);
    console.log(createdProduct);
    res.status(200).json({ message: "Product created" });
  } catch (error) {
    res.status(400).json({
      status: false,
      Error: error,
      message: error.message,
    });
  }
};

const updateProductsfunc = async (req, res) => {
  try {
    const id = await req.params.id;
    const body = req.body;
    if (!id)
      return res
        .status(400)
        .json({ message: "Please provide id for updation" });
    const updatedProduct = await productModel.findByIdAndUpdate(id, body);
    !updatedProduct
      ? res.send("Product not updated not find")
      : res.send("Product updated");
  } catch (error) {
    res.status(400).json({
      status: false,
      Error: error,
      message: error.message,
    });
  }
};

const deleteProductsfunc = async (req, res) => {
  try {
    const id = await req.params.id;
    if (!id)
      return res
        .status(400)
        .json({ message: "Please provide id for updation" });
    const productDeleted = await productModel.findByIdAndDelete(id);
    if (productDeleted) res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    res.status(400).json({
      status: false,
      Error: error,
      message: error.message,
    });
  }
};

export {
  getProductsfunc,
  createProductsfunc,
  updateProductsfunc,
  deleteProductsfunc,
};
