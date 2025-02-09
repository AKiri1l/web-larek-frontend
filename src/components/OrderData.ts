import { IOrderInfo } from "../types";

export class OrderData {
    protected orderInfo: IOrderInfo = {};

    constructor() {}

    resetContacts(){
        this.orderInfo.address = undefined;
        this.orderInfo.email = '';
        this.orderInfo.payment = undefined;
        this.orderInfo.phone = '';
    }

    setOrderInfo<K extends Exclude<keyof IOrderInfo, 'items'>>(field: K, value: IOrderInfo[K]): void {
        this.orderInfo[field] = value;
        console.log(this.getOrderInfo());
    }

    setOrderItemsIds(item: string[]){
        this.orderInfo.items = item;
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