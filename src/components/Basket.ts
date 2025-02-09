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
}