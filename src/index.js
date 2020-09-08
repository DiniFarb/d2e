const serverLog = require('./serverlog/serverlogger');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT;
app.listen(port, () => {
    /* eslint-disable no-console */
    serverLog.info(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});


