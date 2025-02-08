import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', container);
        this._total = ensureElement<HTMLElement>('.order-success__description', container);

        this._close.addEventListener('click', () => events.emit('order:success'))
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синопсов`)
    }
}