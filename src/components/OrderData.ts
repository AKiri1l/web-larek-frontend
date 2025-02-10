import { IOrderInfo } from "../types";
import { IEvents } from "./base/events";

export class OrderData {
    protected orderInfo: IOrderInfo = {};

    constructor(protected events: IEvents) {}

    resetContacts(){
        this.orderInfo.address = '';
        this.orderInfo.email = '';
        this.orderInfo.payment = '';
        this.orderInfo.phone = '';
    }

    choosePayment(value: string){
        this.orderInfo.payment = value;
        this.events.emit('payment:set')
    }

    setOrderInfo<K extends Exclude<keyof IOrderInfo, 'items'>>(field: K, value: IOrderInfo[K]): void {
        this.orderInfo[field] = value;
        this.events.emit('order:change', {field})
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
                case 'payment':
                    return 'Выберите способ оплаты'
                default:
                    return ''
              }
        }
        return '' 
    }

    reset() {
        this.orderInfo = {};
    }
}