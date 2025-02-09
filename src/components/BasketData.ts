import { IProduct } from "../types";

export class BasketData{
    protected itemsData: Pick<IProduct, 'title' | 'price' | 'id'>[];

    constructor() {
        this.itemsData = [];
    }

    setItemsData(item: IProduct){
        this.itemsData.push(item);
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
    }

    clearBasket(){
        this.itemsData = []
    }
}
