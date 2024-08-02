import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/models/response/ResponseModel';
import { BusModel } from 'shared/models/response/BusModel';

export class BusApi {
    public static async getBusses(limit: number, offset: number) {
        const response = await HttpClient.get<ResponseModel<BusModel[]>>({
            url: 'http://localhost:3080/api/bus',
            params: {
                limit,
                offset
            }
        });

        return response?.content?.context;
    }

    public static async sellBus(busId: string) {
        const response = await HttpClient.post<ResponseModel<{}>>({
            url: 'http://localhost:3080/api/bus/sell',
            data: {
                busId
            }
        });

        return response?.successResponse;
    }

    public static async repairBus(busId: string) {
        const response = await HttpClient.post<ResponseModel<{}>>({
            url: 'http://localhost:3080/api/bus/repair',
            data: {
                busId
            }
        });

        return response?.successResponse;
    }
}