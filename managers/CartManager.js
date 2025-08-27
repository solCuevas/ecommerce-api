import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/carts.json');

export default class CartManager {
  constructor() {
    this.path = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.#readFile();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };
    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(c => c.id == id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readFile();
    const cart = carts.find(c => c.id == cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.#writeFile(carts);
    return cart;
  }
}