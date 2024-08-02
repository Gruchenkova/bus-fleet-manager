import { HttpClient } from '../utils/httpClient';
import { PlayerGameInfo } from 'shared/models/response/PlayerGameInfo';
import { ResponseModel } from 'shared/models/response/ResponseModel';

export class GameApi {
    public static async getPlayerScore() {
        const response = await HttpClient.get<ResponseModel<PlayerGameInfo>>({
            url: 'http://localhost:3080/api/game'
        });

        return response?.content?.context;
    }
}