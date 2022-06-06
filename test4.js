import https from 'http';
import { Selector } from 'testcafe';

const executeRequest = () => {
    return new Promise(resolve => {

        const options = {
            hostname: 'localhost',
            port:     3000,
            path:     '/devices/Up5bcEQp4', //ID for last element in list
            method:   'DELETE',  //delete route
            headers : {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, res => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            resolve();
        });

        req.on('error', e => {
            console.error(e);
        });
        req.end();
    });
};

const getResponseData = (url) => new Promise((resolve, reject) => {
    https.get(url, res => {
        const {statusCode} = res;
        const contentType = res.headers['content-type'];

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {rawData += chunk;});
        res.on('end', () => resolve({statusCode, contentType, rawData}));
    }).on('error', e => reject(e));
});

fixture('fixture');

test
.page('http://localhost:3001')
('Check devices on UI', async t => {

    // Delete device 'Up5bcEQp4' on server
    await executeRequest(); 

    // Extract list of devices from UI 
    var devices_ui = Selector('.list-devices').child();
    var uiCount = await devices_ui.count;
         
    for(var i = 0; i < uiCount; i++){
        var device_main = devices_ui.nth(i);
        var device_options = await device_main.find('.device-options');
        var device_edit_href = await device_options.find('.device-edit').getAttribute("href");
        var id = device_edit_href.substring(14);  //get device's ID
        await t
        .expect(id).notEql('Up5bcEQp4'); //test will fail if the id is found in the device list, otherwise it will pass as it means it was deleted

    }
   })
 

