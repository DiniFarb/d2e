const express = require('express');
const cors = require('cors');
const logger = require('./logger/logger');
const app = express();

//Middleware
app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev' ) {
    // Static folder
    app.use(express.static(__dirname + '/public/'))
    // Handle SPA
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
        logger.info("GET INDEX")
    });
}

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Server started on port ${port}`));


