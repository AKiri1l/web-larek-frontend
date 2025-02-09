import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage{
    cards: HTMLElement[];
    totalValue: number;
}

export class Page extends Component<IPage>{
    protected gallery: HTMLElement;
    protected total: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this.gallery = ensureElement('.gallery', this.container);
        this.total = ensureElement('.header__basket-counter', this.container);
        this.basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;

        this.basketButton.addEventListener('click', () => events.emit('basket:open'));
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