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
const basket = new Basket(cloneTemplate(basketTemplate), events);
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events, basket);
const modal = new Modal(document.querySelector('.modal'), events);
const basketData = new BasketData(events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new OrderContacts(cloneTemplate(contactTemplate), events);
const orderData = new OrderData(events);
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
})

events.on('basket:changed', () => {
    basket.checked(basketData.getTotalPrice())
    page.totalValue = basketData.getItemsData().length;
    renderBasketModal()
})

events.on('basket:open', () => {
    modal.render({content: 
        basket.render({})
    })
})

events.on("form:open", () => {
    orderData.resetContacts();
    order.valid = validation('order') ? false : true
    modal.render({
        content: order.render({
            valid: false,
			errors: validation('order'),
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
    orderData.choosePayment(data.name)
})

events.on('payment:set', () => {
    order.payment = orderData.getOrderInfo().payment;
    order.valid = validation('order') ? false : true;
    order.errors = validation('order')
})

const validation = (name: string) => {
    let err = ''
    if( name == 'order'){
        return err = (orderData.getOrderInfo().address == '' && orderData.getOrderInfo().payment == '')
            ? 'Выберите способ оплаты и введите адрес' 
            : (orderData.getOrderInfo().address == '' ? 'Введите адресс' 
            : (orderData.getOrderInfo().payment == '' ? 'Выберите способ оплаты' 
            : ""))
    } else {
        return err = (orderData.getOrderInfo().email == '' && orderData.getOrderInfo().phone == '')
            ? 'Введите номер телефона и почту' 
            : (orderData.getOrderInfo().email == '' ? 'Введите почту' 
            : (orderData.getOrderInfo().phone == '' ? 'Введите номер телефона' 
            : ""))
    }
}

events.on('input:change', (data: {field: Exclude<keyof IOrderInfo, 'items'>, value:string, name: string}) => {
        orderData.setOrderInfo(data.field, data.value);
        validation(data.name)
        console.log(validation(data.name), data.field, data.value, data.name)
	}
);

events.on('order:change', (data: {field: Exclude<keyof IOrderInfo, 'items'>}) => {
    if(data.field == 'address') {
        order.valid = validation('order') ? false : true
        order.errors = validation('order')
    } else {
        contact.valid = validation('contact') ? false : true
        contact.errors = validation('contact')
    }
})

events.on('order:submit', () => {
    contact.valid = validation('order') ? false : true;
    modal.render({
        content: contact.render({
            valid: false,
			errors: validation('contact'),
			phone: '',
            email: '',
        })
    })
})

events.on('contacts:submit', () => {
    api.serOrder({...orderData.getOrderInfo(), items: basketData.getItemsIds(), total: basketData.getTotalPrice()})
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