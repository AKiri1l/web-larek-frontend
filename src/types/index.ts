export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    index: number
}

export interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export interface IOrderInfo {
    address?: string;
    email?: string;
    phone?: string;
    payment?: string;
    items?: string[];
    total?: number;
}


export const productCategories: { [key: string]: string } = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard',
}
