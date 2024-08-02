import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/dist/models/response/ResponseModel';
import { DriverOnSaleWithHired } from 'shared';

export class DriverOnSaleApi {
    public static async getDriversOnSale() {
        const response = await HttpClient.get<ResponseModel<DriverOnSaleWithHired[]>>({
            url: 'http://localhost:3080/api/driver-vacancies'
        });

        return response?.content?.context;
    }

    public static async hireDriver(driverId: string) {
        const response = await HttpClient.post<ResponseModel<{}>>({
            url: 'http://localhost:3080/api/driver-vacancies',
            data: {
                driverId
            }
        });

        return response?.successResponse;
    }
}