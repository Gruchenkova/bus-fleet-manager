import { HttpClient } from '../utils/httpClient';
import { ResponseModel } from 'shared/models/response/ResponseModel';
import { ReferenceInfo } from 'shared/models/response/referenceInfo';

export class RefInfoApi {
    public static async getRefInfo() {
        const response = await HttpClient.get<ResponseModel<ReferenceInfo>>({
            url: 'http://localhost:3080/api/ref-info'
        });

        return response?.content?.context;
    }
}