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
                admin: true,
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
                data: JSON.parse(data),
                admin: false
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
            const products = await fs.promises.readFile(__dirname + '/products.json');
            const productsObject = JSON.parse(products);
            const product = productsObject.filter(i => i.uuid == uuid);
            return {
                success: true,
                data: product,
                admin: false

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
            const newList = await products.data.map(i => {
                if(i.uuid == uuid){
                    return {
                        title: data.title,
                        price: data.price,
                        thumbnail: data.thumbnail,
                        uuid
                    }
                }
                return i;
            });
            fs.writeFileSync(__dirname + '/products.json', JSON.stringify(newList, null, 2)); 
            return {
                success: true,
                data: `Product ${uuid} updated successfully`
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
            const products = fs.readFileSync(__dirname + '/products.json');
            const productsObject = JSON.parse(products);
            const newProducts = productsObject.filter(i => i.uuid != uuid);
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