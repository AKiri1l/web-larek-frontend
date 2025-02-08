import { IOrderInfo, IProduct } from '../../types'
import {Api, ApiListResponse} from './api'

export class AppApi extends Api {
    getProducts() {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => {
            return data.items.map(item => ({...item}));
        })
    }

    serOrder(data: IOrderInfo){
        return this.post('/order', data).then(
            (data: {info: IOrderInfo, items: Pick<IProduct, 'title' | 'price' | 'id'>}) => data
        );
    }
}