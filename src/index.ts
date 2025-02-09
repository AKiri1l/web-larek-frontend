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
import { Basket } from './components/Basket';
import { BasketData } from './components/BasketData';
import { Order, OrderContacts } from './components/Order';
import { OrderData } from './components/OrderData';
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
const contact = new OrderContacts(cloneTemplate(contactTemplate), events);
const orderData = new OrderData();
const succes = new Success(cloneTemplate(successTemplate), events);

api.getProducts()
    .then(data => {
        model.setProducts(data);
    })
    .catch(err => {
        console.error(err);
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
    if(basketData.getItemsData().some(elem => elem.id == item.id) || item.price == null){

        card.valid = false
    }
    modal.render({
		    content: card.render(item),
	    });
})

events.on('basket:add', (item: IProduct) => {
    basketData.setItemsData(item);
    modal.close();
    events.emit('data:changed')
    renderBasketModal()
})

const renderBasketModal = () => {
    basket.items = basketData.getItemsData().map((item,index) => {
        return new CardBasket(cloneTemplate(cardBasketTempalte), {
            onClick: () => {
                events.emit('basket:delete', item);
            }
        }).render({ title: item.title, price: item.price, index: index + 1 });
    });
    basket.total = basketData.getTotalPrice();
}

events.on('basket:delete', (item: IProduct) => {
    basketData.deleteId(item.id);
    renderBasketModal()
    basket.checked(basketData.getTotalPrice())
    events.emit('data:changed')
})

events.on('data:changed', () => {
    page.totalValue = basketData.getItemsData().length;
    order.payment = orderData.getOrderInfo().payment;
    renderBasketModal()
})

events.on('basket:open', () => {
    modal.render({content: 
        basket.render({
            total: basketData.getTotalPrice(),
        })
    })
    basket.checked(basketData.getTotalPrice())
})

events.on("form:open", () => {
    orderData.setOrderItemsIds(basketData.getItemsIds());
    orderData.resetContacts();
    orderData.setOrderInfo('total', basketData.getTotalPrice());
    order.errors = orderData.checkValidity('payment');
    modal.render({
        content: order.render({
            valid: false,
			errors: order.errors,
			address: '',
			payment: '',
        })
    })
})

events.on('modal:open', () => {
    page.locked = true;
  });
    
events.on('modal:close', () => {
    page.locked = false;
});
    
events.on('payment:change', (data: {name: string}) => {
    orderData.setOrderInfo('payment', data.name)
    order.errors = orderData.checkValidity('payment');
    order.valid = (order.errors == '') && (orderData.getOrderInfo().payment != undefined) && (orderData.getOrderInfo().address != undefined) ? true: false;
    events.emit('data:changed')
})

events.on('input:change', (data: { field: Exclude<keyof IOrderInfo, 'items'>; value: string}) => {
        orderData.setOrderInfo(data.field, data.value);
        if(data.field == 'address'){
            order.errors = orderData.checkValidity(data.field);
            order.valid = (order.errors == '') && (orderData.getOrderInfo().payment != undefined) ? true: false;
        } else {
            contact.errors = orderData.checkValidity(data.field);
            contact.valid = order.checkButton(orderData.getOrderInfo());
        }
	}
);

events.on('order:submit', () => {
    modal.render({
        content: contact.render({
            valid: false,
			errors: '',
			phone: '',
            email: '',
        })
    })
})

events.on('contacts:submit', () => {
    api.serOrder(orderData.getOrderInfo())
        .then((data) => {
            succes.total = data.total;
            modal.render({
                content: succes.render({})
            })
            basketData.clearBasket();
            orderData.reset();
            events.emit('data:changed')
        })
})

events.on('order:success', () => {
    modal.close();
})