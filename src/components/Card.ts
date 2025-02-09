import { IProduct, productCategories } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { CDN_URL } from "../utils/constants";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected itemTitle: HTMLElement;
    protected itemPrice: HTMLElement;
    protected itemButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions){
        super(container);

        this.itemTitle = ensureElement('.card__title', this.container) as HTMLElement;
        this.itemPrice = ensureElement('.card__price', this.container) as HTMLElement;
        this.itemButton = container.querySelector('.card__button');

        if (actions?.onClick) {
			if (this.itemButton) {
				this.itemButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

    }

    set title(value: string){
        this.setText(this.itemTitle, value);
    }

    set price(value: number){
        if(typeof value != "number"){
            this.setText(this.itemPrice, 'Бесценно');
        } else {
            this.setText(this.itemPrice, `${value} синапсов`);
        }
    }
}

export class CardCatalog extends Card{
    protected itemImage: HTMLImageElement;
    protected itemCategory: HTMLElement;
    
    constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this.itemImage = ensureElement<HTMLElement>('.card__image', container) as HTMLImageElement;
		this.itemCategory = ensureElement<HTMLElement>('.card__category', container);
	}

    set category(value: string){
        this.setText(this.itemCategory, value);
        this.itemCategory.classList.add(productCategories[value])
    }

    set image(value: string){
        this.setImage(this.itemImage, `${CDN_URL}${value}`);
    }
}

export class CardPreview extends CardCatalog {
	protected itemDescription: HTMLElement;
    protected productId: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this.itemDescription = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string) {
		this.setText(this.itemDescription, value);
	}

    set id(value: string){
        this.productId = value;
    }

    set valid(value: boolean){
        this.itemButton.disabled = !value;
    }
}

export class CardBasket extends Card {
	private itemIndex: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', container);
	}

	set index(value: number) {
		this.setText(this.itemIndex, value.toString());
	}
}