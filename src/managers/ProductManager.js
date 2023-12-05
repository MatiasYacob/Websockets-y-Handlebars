import { log } from "console";
import * as fs from "fs";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.loadProductsFromDisk();
    }

    // Cargar productos desde el archivo al inicializar la instancia
    loadProductsFromDisk() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    // Guardar productos en el archivo
    saveProductsToDisk() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
            console.log('Datos guardados correctamente en products.json');
        } catch (error) {
            console.error('Error al guardar los datos en products.json:', error);
        }
    }


    
    


    addProduct(producto) {
        const { title, description, price, thumbnails, code, stock } = producto;
    
        if (!title || !description || !price || !thumbnails || !code || !stock) {
            console.log("Todos los campos son obligatorios, excepto thumbnails.");
            return;
        }
    
        if (this.products.some((p) => p.title === title)) {
            console.log("El producto ya existe.");
            return;
        }
    
        // Asignar un pid autoincrementable
        producto.pid = this.getNextProductpid();
        
        // Agregar el campo status
        producto.status = true;
    
        this.products.push(producto);
        this.saveProductsToDisk();
        console.log("Producto agregado exitosamente.");
    }
    

    updateProduct(pid, updatedProduct) {
        // Obtener el producto
        const product = this.getProductBypid(pid);
        if (!product) {
            return null;
        }

        // Actualizar el producto
        for (const property in updatedProduct) {
            if (property !== "pid") {
                product[property] = updatedProduct[property];
            }
        }

        // Guardar el producto actualizado
        this.saveProductsToDisk();

        return product;
    }

    deleteProduct(pid) {
        // Obtener el producto
        const product = this.products.find((p) => p.pid === pid);
        if (!product) {
            return null;
        }

        // Eliminar el producto
        this.products.splice(this.products.indexOf(product), 1);

        // Guardar los productos
        this.saveProductsToDisk();

        return product;
    }

    getNextProductpid() {
        if (this.products.length === 0) {
            return 1;
        } else {
            const maxpid = Math.max(...this.products.map((product) => product.pid));
            return maxpid + 1;
        }
    }

    getProducts() {
        return this.products;
    }

    getProductBypid(pid) {
        const producto = this.products.find((p) => p.pid === pid);
        return producto || null;
    }
}

// Creacion de una instancia de la clase "ProductManager"
const manager = new ProductManager("products.json");


//exporto ProductManager
export default ProductManager;
