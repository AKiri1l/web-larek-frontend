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
## Слой данных

### Класс ProductModel
Класс для работы с данными приложения. Отвечает за логику работы с данными типа IProduct.
Класс:
- protected items: IProduct[]; 
- protected events: IEvents 

- setProducts(items: IProduct[]): void 
- getProducts(): items: IProduct[] 
- getProduct(id: string): IProduct 

### Класс Order 
Класс для работы с заказом. Работает с типами данных IOrderInfo.
Класс: 
- protected payment: string 
- protected address: string 
- protected email: string 
- protected phone: string 
- protected items: IProduct[]
- protected events: IEvents
- addProduct(product: IProduct): void 
- deleteProduct(id: string)
- getItems(): IProduct[]
- getTotalPrice(): number 
- getTotal(): number

### Класс AppApi 
Класс для работы с сервером. Расширяет класс Api.
Класс:
- getProducts(): Promise<IProduct[]> 
- orderProducts(order: IOrderInfo) - отправка заказа на сервер

## Слой отображения
Класс для отображения интерактивных элементов.

### Класс Component:
Базовый класс, который является для всех классов отображения. Содержит метод render для перерисовывания элементов.

### Класс Modal
Класс для работы с модальными окнами. Использует методы open и close.

- protected _content: HTMLElement - контент модального окна
- set content(value: HTMLElement):void - сеттер для контента темплейта
- render(data: HTMLElement): HTMLElement - рендер окна модели

### Класс Page 
Класс отвечающий за отображение элементов на главной странице.
- counter: HTMLElement
- catalog: HTMLElement
- basket: HTMLElement


## Представление
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
