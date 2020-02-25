import axios from 'axios';

const BASE_URL = `http://localhost:8080/api`;

export class DataService {

    public getPages() {
        return axios.get(`${BASE_URL}/pages`);
    }

    public getPagesByClientAndAccountId(clientId, accountId) {
        return axios.get(`${BASE_URL}/pages/${clientId}/${accountId}`);
    }

    public getPageContent(id) {
        return axios.get(`${BASE_URL}/editor/${id}`);
    }
}