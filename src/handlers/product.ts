import { Request, Response } from "express";

import Product from "../models/Product.model";
import { body } from "express-validator";

// HANDLER PARA OBTENER EL PRODUCTO
export const getProduct = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [["id", "DESC"]],
    attributes: { exclude: ["updatedAt", "createdAt"] },
  });
  res.json({ data: products });
};

// HANDLER PARA OBTENER EL PRODUCTO POR SU ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      error: "Producto no encontrado",
    });

    return;
  }

  res.json({ data: product });
};

// HANDLER PARA CREAR PRODUCTOS
export const createProduct = async (req: Request, res: Response) => {
  //crear producto en la base de datos
  const product = await Product.create(req.body);
  // Responder con el producto creado (incluye id, timestamps, etc.)
  res.status(201).json({ data: product });
};

//HANDLER PARA ACTUALIZAR PRODUCTOS

export const updateProduct = async (req: Request, res: Response) => {
  //si existe el producto
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      error: "Producto no encontrado",
    });

    return;
  }

  //Actualizar el producto
  await product.update(req.body);
  await product.save();

  res.json({ data: product });
};

//HANDLER PARA ACTUALIZAR LA DISPONIBILIDAD
export const updateAvailability = async (req: Request, res: Response) => {
  //si existe el producto
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      error: "Producto no encontrado",
    });

    return;
  }

  //Actualizar el producto
  product.availability = !product.dataValues.availability;
  await product.save();

  res.json({ data: product });
};

//HANDLER PARA ELIMINAR EL PRODUCTO
export const deleteProduct = async (req: Request, res: Response) => {
  //si existe el producto
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({
      error: "Producto no encontrado",
    });

    return;
  }

  await product.destroy();
  res.json({ data: "Producto Eliminado" });
};
