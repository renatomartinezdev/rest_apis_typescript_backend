import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The Product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the product
 *           example: Zapato
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 199.99
 *         availability:
 *           type: boolean
 *           description: Product availability
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     description: Return a list of products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */

//RUTA PARA OBTENER PRODUCTOS
router.get("/", getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     description: Return a product based on its unique ID
 *     parameters: 
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve 
 *         required: true
 *         schema:
 *           type: integer 
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 */

//RUTA PARA OBTENER PRODUCTO POR EL ID
router.get(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),

  //MIDDLEWARE
  handleInputErrors,

  getProductById
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Create a new product with a name and price
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Zapato
 *               price:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 */

// RUTA POST PARA CREAR PRODUCTOS
router.post(
  "/",

  // VALIDACIONES
  body("name")
    .notEmpty()
    .withMessage("El nombre de producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("valor no valido")
    .notEmpty()
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),

  //MIDDLEWARE
  handleInputErrors,

  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     description: Update the name, price and availability of a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - availability
 *             properties:
 *               name:
 *                 type: string
 *                 example: Zapato actualizado
 *               price:
 *                 type: number
 *                 example: 149.99
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 */

router.put(
  "/:id",

  param("id").isInt().withMessage("ID no valido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre de producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("valor no valido")
    .notEmpty()
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),

  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no valido"),

  handleInputErrors,

  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product availability
 *     tags:
 *       - Products
 *     description: Update only the availability status of a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update availability
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availability
 *             properties:
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputErrors,
  updateAvailability
);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     description: Delete a product from the database by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputErrors,
  deleteProduct
);

export default router;
