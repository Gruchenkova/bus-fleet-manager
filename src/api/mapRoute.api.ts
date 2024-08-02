import { HttpClient } from '../utils/httpClient';
import { MapRouteCreateDto } from 'shared/models/MapRouteCreateDto';
import { ResponseModel } from 'shared/dist/models/response/ResponseModel';
import { MapRouteModel } from 'shared/models/MapRouteModel';

export class MapRouteApi {
    public static async createRoute(model: MapRouteCreateDto) {
        const response = await HttpClient.post({
            url: 'http://localhost:3080/api/map-routes',
            data: model
        });

        return response?.successResponse;
    }

    public static async updateRoute(id: string, model: MapRouteCreateDto) {
        const response = await HttpClient.post({
            url: `http://localhost:3080/api/map-routes/${id}`,
            data: model
        });

        return response?.successResponse;
    }

    public static async getRoutes(offset: number, limit: number) {
        const response = await HttpClient.get<ResponseModel<MapRouteModel[]>>({
            url: 'http://localhost:3080/api/map-routes',
            params: {
                limit,
                offset
            }
        });

        return response?.content?.context;
    }

    public static async deleteRoute(id: string) {
        const response = await HttpClient.del<ResponseModel<MapRouteModel[]>>({
            url: `http://localhost:3080/api/map-routes/${id}`
        });

        return response?.successResponse;

    }
}