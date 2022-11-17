const fs = require('fs')

class ProductService{
    constructor(){}

    async createProduct(data){
        try{
            const products = fs.readFileSync(__dirname + '/products.json');
            const productsObject = JSON.parse(products);
            productsObject.push(data);
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(productsObject, null, 2));
            return{
                success: true,
                message: `Producto id: ${data.uuid} creado con éxito`,
                data
            }
        }catch(err){
            console.error(err);
            return{
                success: false,
                message: err.message
            }
        }
    }

    async getProducts(){
        try{
            const data = fs.readFileSync(__dirname + '/products.json')
            return{
                success: true,
                data: JSON.parse(data)
            }
        }catch(err){
            console.error(err);
            return{
                success: false,
                message: err.message
            }
        }
    }

    async getProduct(uuid){
        try{
            const products = await this.getProducts();
            const product = products.data.filter(i => i.uuid == uuid);
            if(product.length===0){
                return {
                    success: false,
                    message: `No hay productos con ID: ${uuid}`
                }
            }
            return {
                success: true,
                data: product
            }
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    }

    async updateProduct(uuid, data){
        try{
            const products = await this.getProducts();
            const result = products.data.find( prod => prod.uuid === uuid );
            if(result === undefined){
                return {
                    success: false,
                    message: `No hay productos con ID: ${uuid}`
                }
            } 
            const newList = await products.data.map(i => {
                if(i.uuid === uuid){
                    return {
                        name: data.name,
                        description: data.description,
                        code: data.code,
                        image: data.image,
                        price: data.price,
                        stock: data.stock,
                        time: i.time,
                        uuid
                    }  
                }
                return i;
            });
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(newList, null, 2)); 
            return {
                success: true,
                message: `Producto ${data.name} fue actualizado`
            } 
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    }

    async deleteProduct(uuid){
        try{
            const products = await this.getProducts();
            const newProducts = products.data.filter(i => i.uuid != uuid);
            if(products.data.length === newProducts.length){
                return {
                    success: false,
                    message: `No hay producto con ID: ${uuid}`
                }
            } 
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(newProducts, null, 2)); 
            return {
                success: true,
                data: `Product ${uuid} deleted successfully`
            } 
        }catch(err){
            console.error(err);
            return {
                success: false,
                message: err.message
            }
        }
    }
}

module.exports = ProductService;