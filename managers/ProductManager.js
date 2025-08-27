import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/products.json');

export default class ProductManager {
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

  async getAll() {
    return await this.#readFile();
  }

  async getById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id == id);
  }

  async addProduct(productData) {
    const products = await this.#readFile();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      status: true,
      ...productData
    };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updateData, id: products[index].id };
    products[index] = updatedProduct;
    await this.#writeFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter(p => p.id != id);
    await this.#writeFile(filtered);
  }
}