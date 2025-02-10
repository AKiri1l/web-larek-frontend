import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Basket } from "./Basket";

interface IPage{
    cards: HTMLElement[];
    totalValue: number;
}

export class Page extends Component<IPage>{
    protected gallery: HTMLElement;
    protected total: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basket: Basket

    constructor(container: HTMLElement, protected events: IEvents, basket: Basket){
        super(container);
        this.gallery = ensureElement('.gallery', this.container);
        this.total = ensureElement('.header__basket-counter', this.container);
        this.basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;
        this.basket = basket;

        this.basketButton.addEventListener('click', () => {
            console.log(this.basket.total)
            this.basket.checked(this.basket.total)
            events.emit('basket:open')
        });
    }

    set locked(value: boolean) {
        if (value) {
            this.container.classList.add('page__wrapper_locked');
        } else {
            this.container.classList.remove('page__wrapper_locked');
        }
    }

    set cards(items: HTMLElement[]){
        this.gallery.replaceChildren(...items);
    }

    set totalValue(value: number){
        this.setText(this.total, value);
    }
}