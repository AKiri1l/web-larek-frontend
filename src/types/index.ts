interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface IBasketData {
    items: HTMLElement[];
    total: number;
}

interface IProductData {
    items: IProduct[];
    total: number;
}

interface IOrderInfo {
    address: string;
    email: string;
    phone: string;
    payment: string;
    orderItems: IProduct[];
}

type TPayment = 'cash' | 'card'; 