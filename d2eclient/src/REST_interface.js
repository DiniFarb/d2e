import axios from 'axios';
const url = 'api/v1/';

class REST_interface {

    static getState() {
        return new Promise(((resolve, reject) =>
            axios.get(url).then((res) => {
                resolve(
                    res.data
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static importExcel() {
        return new Promise(((resolve, reject) =>
            axios.get(url + '/import').then((res) => {
                resolve(
                    res.data
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static getAliasList() {
        return new Promise(((resolve, reject) =>
            axios.get(url + '/aliasList', { responseType: 'arraybuffer' }).then((res) => {
                resolve(
                    this.forceFileDownload(res, "alias_list")
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static getClientList(clientNumber) {
        return new Promise(((resolve, reject) =>
            axios.get(url + "downloadClientList", {
                params: {
                    clientNumber: clientNumber
                },
                responseType: 'arraybuffer'
            }).then((res) => {
                resolve(
                    this.forceFileDownload(res, 'client' + clientNumber)
                );
            }).catch((err) => {
                reject(err);
            })))
    }

    static forceFileDownload(response, fileName) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName + '.xlsx') //or any other extension
        document.body.appendChild(link)
        link.click()
    }

}

export default REST_interface