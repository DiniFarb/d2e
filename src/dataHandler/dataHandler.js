class DataHandler{

    constructor(data) {
       this.systemPath = [];
       this.systemDescription = [];
        for (let i = 1; i < data.length; i++) {
            this.systemPath.push(data[i][0]);
            this.systemDescription.push(data[i][1]);
        }
    }
}

module.exports = DataHandler
