import { IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData{
    protected itemsData: Pick<IProduct, 'title' | 'price' | 'id'>[];

    constructor(protected events: IEvents) {
        this.itemsData = [];
    }

    setItemsData(item: IProduct){
        this.itemsData.push(item);
        this.events.emit('basket:changed')
    }

    getItemsData(){
        return this.itemsData;
    }

    getItemsIds(){
        return this.itemsData.map(item => item.id);
    }

    getTotalPrice(){
        return this.itemsData.reduce((total, item) => total + item.price, 0);
    }

    deleteId(value: string){
        this.itemsData = this.itemsData.filter((item) => item.id != value);
        this.events.emit('basket:changed')
    }

    clearBasket(){
        this.itemsData = [];
        this.events.emit('basket:changed')
    }
}
