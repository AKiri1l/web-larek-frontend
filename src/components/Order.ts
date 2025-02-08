import { IOrderInfo, IProduct } from '../types/index';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './base/Form';

export class Order extends Form<IOrderInfo> {
	protected cashButton: HTMLButtonElement;
	protected cardButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        
		this.cashButton = this.container.querySelectorAll('.button')[1] as HTMLButtonElement;
		this.cardButton = this.container.querySelectorAll('.button')[0] as HTMLButtonElement;
        this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;

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
		this.address = '';
		this.payment = '';
	}
}

export class OrderData {
	protected orderInfo: IOrderInfo = {};

    constructor() {
		this.orderInfo.items = [];
	}

	setOrderInfo(field: keyof IOrderInfo, value: string | number): void{
		if(field == 'items'){
			this.orderInfo.items.push(value.toString());
		} else if (field == 'total') {
            this.orderInfo[field] = value as number; 
        } else {
            this.orderInfo[field] = value as string;
        }
		console.log(this.getOrderInfo())
	}

	getOrderInfo() {
		return this.orderInfo;
	}

	checkValidity(value: keyof IOrderInfo): string {
		if(!this.orderInfo[value]){
			switch(value) {
				case 'address':
					return 'Введите адрес'
				case 'phone':
				  return 'Введите номер телефона'
				case 'email': 
				  return 'Введите адрес электронной почты'
				default:
					return ''
			  }
		}
		return '' 
	}

	checkButton() {
		if(this.orderInfo.address && this.orderInfo.payment && this.orderInfo.email && this.orderInfo.phone){
			return true
		}
		return false;
	}

	reset() {
		this.orderInfo = {};
	}
}