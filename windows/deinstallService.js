import { Service } from 'node-windows';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Create a new service object
const svc = new Service({
  name:'D2E',
  script: path.join(__dirname,'../src/index.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();
