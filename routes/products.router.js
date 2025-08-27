import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  if (!product) return res.status(404).send('Producto no encontrado');
  res.json(product);
});

router.post('/', async (req, res) => {
  const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
  if (!requiredFields.every(field => req.body[field] !== undefined)) {
    return res.status(400).send('Faltan campos requeridos');
  }

  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).send('Producto no encontrado');
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.sendStatus(204);
});

export default router;