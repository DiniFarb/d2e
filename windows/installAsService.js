const Service = require('node-windows').Service;

// Create a new service
const svc = new Service({
    name:'D2E',
    description: 'Desigo to excel exporter',
    script: require('path').join(__dirname,'../src/index.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
    console.log("Install service DE");
});

svc.install();

const EventLogger = require('node-windows').EventLogger;

const log = new EventLogger('tgdcc');

log.info('Basic information.');
log.warn('Watch out!');
log.error('Something went wrong.');
