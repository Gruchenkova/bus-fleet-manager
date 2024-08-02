import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/dist/models/response/ResponseModel';
import { DriverModel } from 'shared/models/response/DriverModel';
import { DriverUpdateDto } from 'shared/models/DriverUpdateDto';

export class DriverApi {
    public static async getDrivers(limit: number, offset: number) {
        const response = await HttpClient.get<ResponseModel<DriverModel[]>>({
            url: 'http://localhost:3080/api/driver',
            params: {
                limit,
                offset
            }
        });

        return response?.content?.context;
    }

    public static async fireDriver(id: string) {
        const response = await HttpClient.del<ResponseModel<any>>({
            url: `http://localhost:3080/api/driver/${id}`
        });

        return response?.successResponse;
    }

    public static async updateDriver(driverId: string, model: DriverUpdateDto) {
        const response = await HttpClient.post<ResponseModel<any>>({
            url: `http://localhost:3080/api/driver/${driverId}`,
            data: model
        });

        return response?.successResponse;
    }
}