import { IOrderInfo, IProduct } from '../types/index';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './base/Form';

export class Order extends Form<IOrderInfo> {
	protected cashButton: HTMLButtonElement;
	protected cardButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cashButton = ensureElement('.button_alt[name = cash]',this.container) as HTMLButtonElement
		this.cardButton = ensureElement('.button_alt[name = card]',this.container) as HTMLButtonElement
        this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;

		if(this.cashButton && this.cardButton){
			this.cashButton.addEventListener('click', (e: Event) => {
				const target = e.target as HTMLButtonElement;
				//this.onInputChange('payment', 'cash');
				events.emit('payment:change', {name: target.name})
			});
			this.cardButton.addEventListener('click', (e:Event) => {
				const target = e.target as HTMLButtonElement;
				//this.onInputChange('payment', 'card');
				events.emit('payment:change', {name: target.name})
			});
		}
	}
	
	set payment(value: string) {
		this.cashButton.classList.toggle('button_alt-active', value === 'cash');
		this.cardButton.classList.toggle('button_alt-active', value === 'card');
	}

	get address(){
		return this.addressInput.value;
	}

	set address(value: string) {
		this.addressInput.value = value;
	}

	reset() {
		this.address = '';
		this.payment = '';
	}
}

export class OrderContacts extends Form<IOrderInfo> {
    protected phoneInput: HTMLInputElement;
    protected emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;

		}

	get phone(){
		return this.phoneInput.value;
	}

    set phone(value: string) {
		this.phoneInput.value = value;
	}

	get email() {
		return this.emailInput.value;
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	reset() {
		this.phone = '';
		this.email = '';
	}
}