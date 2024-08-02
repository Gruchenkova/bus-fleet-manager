import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/dist/models/response/ResponseModel';
import { MapPoint } from 'shared/models/MapPointModel';

export class MapPointApi {
    public static async getPoints() {
        const response = await HttpClient.get<ResponseModel<MapPoint[]>>({
            url: 'http://localhost:3080/api/map-points'
        });

        return response?.content?.context;
    }
}