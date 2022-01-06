import { Service } from 'node-windows';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Create a new service
const svc = new Service({
  name:'D2E',
  description: 'Desigo to excel exporter',
  script: path.join(__dirname,'../src/index.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
  console.log('Install service DE');
});

svc.install();