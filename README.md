# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура
Выбрана архитектура MVP

M - Model - управление данными 

V - View - отображение данных и обработка дейтсвий пользователя 

P - Presenter - связывание Model и View

## Интерфейсы

### Интерфес товара 
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

### Интерфейс данных в корзине 
```
interface IBasketData {
    items: HTMLElement[];
    total: number;
}
```

### Интерфейс данных на главной странице
```
interface IProductData {
    items: IProduct[];
    total: number;
}
```

### Интерфейс данных для оформления заказа
```
interface IOrderInfo {
    address: string;
    email: string;
    phone: string;
    payment: string;
    orderItems: IProduct[];
}
```

### Класс EventEmitter 
Реализует брокер событий, позволяя компонентам приложения обмениваться данными без прямой связи друг с другом. Этот подход улучшает модульность и изоляцию компонентов.
Основные методы:

- on позволяет подписаться на событие. Если событие с указанным именем ещё не зарегистрировано, оно создаётся.
- off удаляет указанного подписчика с события. Если у события больше нет подписчиков, оно удаляется.
- emit генерирует событие с указанными данными. Все подписчики события (или соответствующие шаблону) будут уведомлены.

### Класс Component.
Класс Component предназначен для работы с DOM в веб-приложениях. Класс содержит базовый функционал для управления HTML-элементами, включая управление стилями, текстом, состояниями блокировки и отображения, а также рендеринг данных. Конструктор: принимает на вход container типа HTMLElement.

- toggleClass добавляет, удаляет или переключает CSS-класс для указанного элемента.
- setText устанавливает текстовое содержимое элемента.
- setDisabled управляет состоянием блокировки элемента (disabled).
- setHidden cкрывает элемент, устанавливая его стиль display: none.
- setVisible делает элемент видимым, удаляя стиль display: none.
- setImage устанавливает источник изображения и альтернативный текст для элемента <img>.
- render основной метод рендеринга. Передаёт данные в экземпляр компонента и возвращает корневой элемент container.

### Класс ProductModel
Класс для работы с данными приложения. Отвечает за логику работы с данными типа IProduct.
Класс:
- protected items: IProduct[]; 
- protected events: IEvents 

- setProducts(items: IProduct[]): void - метод сохраняет данные товара 
- getProducts(): items: IProduct[] -метод возвращает массив товаров
- getProduct(id: string): IProduct - метод возвращает товар по его id

### Класс Card 
Класс для работы с карточками. Он является основой для других карточек
- protected itemTitle: HTMLElement; - название товара
- protected itemPrice: HTMLElement; - стоимость товара
- protected itemButton: HTMLButtonElement; - кнопка добавления в корзину
- set title(value: string) - устанавливаем название товара
- set price(value: number) - устанавливаем стоимость товара

### Класс CardCatalog
Класс для работы с каталогом карточек, расширяет класс Card
- protected itemImage: HTMLImageElement; - картинка товара
- protected itemCategory: HTMLElement; - категория товара
- set category(value: string) - устанавливаем категорию товара
- set image(value: string) - устанавливаем картинку товара

### Класс CardPreview
Класс для работы с превью карточек, расширяет класс Card
protected itemDescription: HTMLElement; - описание товара
protected productId: string; - id продукта
set description(value: string) - устанавливаем дописание товара
set id(value: string) - устанавливаем id товара
set valid(value: boolean) - проверяем валидность кнопки

### Класс CardBasket
private itemIndex: HTMLElement; - индекс товара в корзине
set index(value: number) - устанавливаем индекс товара в корзине

### Класс Order 
Класс для работы с отображением заказа
- protected cashButton: HTMLButtonElement; - кнопка для оплаты наличкой
- protected cardButton: HTMLButtonElement; - кнопка для оплаты картой
- protected addressInput: HTMLInputElement; - поле для введения адреса
- protected phoneInput: HTMLInputElement; - поле для введения телефона
- protected emailInput: HTMLInputElement; - поле для введения электронной почты
- set payment(value: string) - устанавлием класс для активной кнопки
- get address() - получаем значение адреса
- set address(value: string) - устанавливаем значение адреса
- get phone() - получаем значение номера
- set phone(value: string) - устанавливаем значением номера
- get email() - поулчаем значение почты
- set email(value: string) - устанавливаем значение почты
- reset() - сбрасываем данные

### OrderData
Класс для работы с данными заказа
- protected orderInfo: IOrderInfo = {}; - объект с информацией о заказе
- setOrderInfo(field: keyof IOrderInfo, value: string | number) - добавляем данные о заказе в объект
- getOrderInfo() - получаем объект с данными
- checkValidity(value: keyof IOrderInfo) - проверяем валидность данных
- checkButton() - проверяем статус кнопки
- reset() - сброс данных

### Basket 
Класс для работы с отображением корзины
- protected itemsList: HTMLElement; - список товаров в корзине
- protected buttonSubmit: HTMLButtonElement; - кнопка для оформления заказа
- protected totalValue: HTMLElement; - стоимость заказа
- set total(total: number) - устанавливаем стоимость заказа
- set items(items: HTMLElement[]) - добавляем товары в корзину
- checked(value: number) - проверка активности кнопки 
- addProduct(item: HTMLElement) - обновляем список товаров
- getItems() - получаем список товаров

### BasketData
Класс для работы с данными в корзине
- protected itemList: HTMLElement[]; - список товаров в DOM
- protected itemsData: Pick<IProduct, 'title' | 'price' | 'id'>[]; - товары для добавления
- protected totalPrice: number; - значение стоимости товаров
- setItemsData(item: IProduct) - добавлем товар в список
- getItemsData() - возвращаем список товаров
- reserBasket() - сбрасываем корзину
- addToBasket(item: HTMLElement) - добавляем товар в DOM список
- getItemList() - возвращаем DOM список элементов
- setTotalPrice(value: number) - устанавливаем значение стоимости корзины
- getTotalPrice() - получаем значение стоимости корзины
- deleteId(value: string) - удалеение товара по id



### Класс AppApi 
Класс для работы с сервером. Расширяет класс Api.
Класс:
- getProducts(): Promise<IProduct[]> 
- serOrder(order: IOrderInfo) - отправка заказа на сервер


### Класс Component:
Базовый класс, который является для всех классов отображения. Содержит метод render для перерисовывания элементов.

### Класс Modal
Класс для работы с модальными окнами. Использует методы open и close.

- protected _content: HTMLElement - контент модального окна
- protected _closeButton: HTMLButtonElement - кнопка закрытия
- open(): - функция открытия модального окна
- close(): - функция закрытия модального окна
- set content(value: HTMLElement):void - сеттер для контента темплейта
- render(data: HTMLElement): HTMLElement - рендер окна модели

### Класс Page 
Класс отвечающий за отображение элементов на главной странице.
- protected gallery: HTMLElement - список товаров для отображения;
- protected total: HTMLElement - счетчик товаров в корзине;
- protected basketButton: HTMLButtonElement - кнопка корзины;
- set cards(items: HTMLElement[]) - выводим список товаров в DOM
- set totalValue(value: number) - устанавливаем количество товаров в DOM

### Класс Form 
Управляет работой форм в приложении, контролирует состояние кнопки отправки и генерирует события при отправке данных. Конструктор принимает container с типом HTMLElement, в также объект events с типом IEvents.

Поля:
- submit: HTMLButtonElement разметка кнопки сабмита.
- errors: HTMLElement разметка вывода ошибок.

Методы:
- set valid(value: boolean) сеттер включает или отключает кнопку отправки в зависимости от валидности формы.
- set errors(value: string) сеттер устанавливает текст ошибки
- render() обновляет состояние формы, включая валидность, ошибки и значения полей.

### Класс Success
Показывает окно с успешным совершением заказа.
- protected _close: HTMLElement;
- protected _total: HTMLElement; 

- set total(value: number) - устанавливает количество списанных средств

## Презентер
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
