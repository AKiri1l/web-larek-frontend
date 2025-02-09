import { IOrderInfo, IProduct, IServerResult } from '../../types'
import {Api, ApiListResponse} from './api'

export class AppApi extends Api {
    getProducts() {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => {
            return data.items.map(item => ({...item}));
        })
    }

    serOrder(data: IOrderInfo): Promise<IServerResult>{
        return this.post('/order', data).then(
            (data: IServerResult) => data
        );
    }
}