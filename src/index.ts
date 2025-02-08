import './scss/styles.scss';
import {ProductModel} from './components/ProductModel'
import { AppApi } from './components/base/AppApi';
import { CardCatalog, CardPreview, CardBasket, Card } from './components/Card';
import { cloneTemplate } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { Page } from './components/Page';
import { API_URL } from './utils/constants';
import { Modal } from './components/Modal';
import { IProduct, IOrderInfo } from './types';
import { Basket, BasketData } from './components/Basket';
import { Order, OrderData } from './components/Order';
import { Success } from './components/Success';


const itemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardBasketTempalte = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardPreview = document.querySelector('#card-preview') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const events = new EventEmitter();
const model = new ProductModel(events);
const api = new AppApi(`${API_URL}`);
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('.modal'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const basketData = new BasketData();
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Order(cloneTemplate(contactTemplate), events);
const orderData = new OrderData();
const succes = new Success(cloneTemplate(successTemplate), events);

api.getProducts()
    .then(data => {
        model.setProducts(data);
    })

events.on('items:changed', () => {
    const cardHTMLArray = model.getProducts().map(item => new CardCatalog(cloneTemplate(itemTemplate), {onClick: () => events.emit('item:selected', item)}).render(item))
    page.render({
        cards: cardHTMLArray,
    })
})

events.on('item:selected', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreview), {onClick: () => {
        events.emit('basket:add', item);
    }
    });
    if(basketData.getItemsData().some(elem => elem.id == item.id) || item.title == 'Мамка-таймер'){
        card.valid = false
    }
    modal.render({
		    content: card.render(item),
	    });
})

events.on('basket:add', (item: IProduct) => {
    orderData.setOrderInfo('items', item.id);
    basketData.setItemsData(item);
    page.totalValue = basketData.getItemsData().length;
    basketData.setTotalPrice(item.price);
    modal.close();
})

const renderBasketModal = () => {
    basketData.reserBasket();
    basketData.getItemsData().forEach(item => {
        const card = new CardBasket(cloneTemplate(cardBasketTempalte), {onClick: () => {
            events.emit('basket:delete', item);
        }
        }).render({ title: item.title, price: item.price,index: basketData.getItemList().length + 1});
        basketData.addToBasket(card);
    })
    modal.render({content: 
        basket.render({
            total: basketData.getTotalPrice(),
            items: basketData.getItemList()
        })
})
}

events.on('basket:delete', (item: IProduct) => {
    basketData.deleteId(item.id);
    basketData.setTotalPrice(-item.price);
    page.totalValue = basketData.getItemsData().length;
    renderBasketModal()
    basket.checked(basketData.getTotalPrice())
})

events.on('basket:open', () => {
    renderBasketModal()
    basket.checked(basketData.getTotalPrice())
})

events.on("form:open", () => {
    orderData.getOrderInfo().address = undefined;
    orderData.setOrderInfo('total', basketData.getTotalPrice());
    modal.render({
        content: order.render({
            valid: false,
			errors: [],
			address: '',
			payment: '',
        })
    })
})

events.on('payment:change', (data: {name: string}) => {
    orderData.setOrderInfo('payment', data.name)
    order.payment = orderData.getOrderInfo().payment;
    order.valid = (order.errors == '') && (orderData.getOrderInfo().payment != undefined) && (orderData.getOrderInfo().address != undefined) ? true: false;
})

events.on('input:change', (data: { field: keyof IOrderInfo; value: string}) => {
        orderData.setOrderInfo(data.field, data.value);
        if(data.field == 'address'){
            order.errors = orderData.checkValidity(data.field);
            order.valid = (order.errors == '') && (orderData.getOrderInfo().payment != undefined) ? true: false;
        } else {
            contact.errors = orderData.checkValidity(data.field);
            contact.valid = orderData.checkButton();
        }
	}
);

events.on('order:submit', () => {
    modal.render({
        content: contact.render({
            valid: false,
			errors: [],
			phone: '',
            email: '',
        })
    })
})

events.on('contacts:submit', () => {
    api.serOrder(orderData.getOrderInfo())
        .then(() => {
            succes.total = basketData.getTotalPrice();
            modal.render({
                content: succes.render({})
            })
            basketData.reserBasket();
            orderData.reset();
            page.totalValue = 0;
        })
})

events.on('order:success', () => {
    modal.close();
})

