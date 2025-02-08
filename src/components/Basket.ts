import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { IBasketData } from "../types";


export class Basket extends Component<IBasketData>{
    protected itemsList: HTMLElement;
    protected buttonSubmit: HTMLButtonElement;
    protected totalValue: HTMLElement;

    constructor(container:HTMLElement, protected events: IEvents){
        super(container);
        this.itemsList = ensureElement('.basket__list', this.container);
        this.buttonSubmit = ensureElement('.button', this.container) as HTMLButtonElement;
        this.totalValue = ensureElement('.basket__price', this.container);

        this.buttonSubmit.addEventListener('click', () => events.emit('form:open'));
    }

    set total(total: number) {
        this.setText(this.totalValue, `${total} синапсов`);
    }

    set items(items: HTMLElement[]){
        this.itemsList.replaceChildren(...items);
    }

    checked(value: number) {
        if (value) {
			this.setDisabled(this.buttonSubmit, false);
		} else {
			this.setDisabled(this.buttonSubmit, true);
		}
    }

    addProduct(item: HTMLElement){
        this.items = [item, ...this.items];
    }

    getItems() {
        return this.itemsList;
    }
}

export class BasketData{
    protected itemList: HTMLElement[];
    protected itemsData: Pick<IProduct, 'title' | 'price' | 'id'>[];
    protected totalPrice: number;

    constructor() {
        this.itemList = [];
        this.totalPrice = 0;
        this.itemsData = [];
    }

    setItemsData(item: IProduct){
        this.itemsData.push(item);
    }

    getItemsData(){
        return this.itemsData;
    }

    reserBasket(){
        this.itemList = [];
    }

    addToBasket(item: HTMLElement){
        this.itemList = [...this.itemList, item];
    }

    getItemList() {
        return this.itemList;
    }

    setTotalPrice(value: number){
        this.totalPrice += value;
    }

    getTotalPrice(){
        return this.totalPrice;
    }

    deleteId(value: string){
        this.itemsData = this.itemsData.filter((item) => item.id != value);
    }
}
