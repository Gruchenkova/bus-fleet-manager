import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/dist/models/response/ResponseModel';
import { BusOnSaleWithBought } from 'shared/models/BusOnSaleModel';

export class BusOnSaleApi {
    public static async getBussesOnSale() {
        const response = await HttpClient.get<ResponseModel<BusOnSaleWithBought[]>>({
            url: 'http://localhost:3080/api/bus-shop'
        });

        return response?.content?.context;
    }

    public static async buyBus(busId: string) {
        const response = await HttpClient.post<ResponseModel<{}>>({
            url: 'http://localhost:3080/api/bus-shop',
            data: {
                busId
            }
        });

        return response?.successResponse;
    }
}