import axios from 'axios';
const url = 'api/v1/';

class REST_interface {

    static getState(){
        return new Promise(((resolve, reject) =>
            axios.get(url).then((res) => {
                resolve(
                    res.data
                );
            }).catch((err) => {
                    reject(err);
                }
            )))
    }

    static getClientList(clientNumber) {
        return new Promise(((resolve, reject) =>

            axios.get(url + "downloadClientList", {params: {
                clientNumber: clientNumber
                },responseType: 'arraybuffer'}).then((res) => {
                resolve(
                    this.forceFileDownload(res, clientNumber)
                );
            }).catch((err) => {
                    reject(err);
                }
            )))
    }
    static forceFileDownload(response, clientNumber){
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'client' + clientNumber + '.xlsx') //or any other extension
        document.body.appendChild(link)
        link.click()
    }

}

export default REST_interface
