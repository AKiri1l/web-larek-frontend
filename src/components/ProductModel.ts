import {IProduct} from '../types/index'
import {IEvents} from './base/events'

export class ProductModel{
    protected items: IProduct[] = []; 

    constructor(protected events: IEvents) {}

    setProducts(items: IProduct[]): void {
        this.items.push(...items);
        this.events.emit('items:changed');
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct {
        return this.items.find(item => item.id == id);
    }

    getTotal() {
        return this.items.length;
    }
}
