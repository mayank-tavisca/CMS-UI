import axios from 'axios';

const BASE_URL = `http://localhost:8080/api`;

export class DataService {

    /*
    ** Page Content APIs
    */

    getAllContentPages() {
        return axios.get(`${BASE_URL}/pageContent`);
    }

    getPageContentById(id: string) {
        return axios.get(`${BASE_URL}/pageContent/${id}`);
    }

    postPageContent(data) {
        return axios.post(`${BASE_URL}/pageContent`, data);
    }

    updatePageContent(data) {
        return axios.put(`${BASE_URL}/pageContent`, data);
    }

    /*
    ** Content Type APIs
    */

    public getContetTypes() {
        return axios.get(`${BASE_URL}/contentType`);
    }

    public getContentTypeById(id: string) {
        return axios.get(`${BASE_URL}/contentType/${id}`)
    }

    public saveContentType(data: any) {
        return axios.post(`${BASE_URL}/contentType`, data)
    }

    public updateContentType(data: any) {
        return axios.put(`${BASE_URL}/contentType`, data);
    }
}