import https from 'http';
import { Selector } from 'testcafe';

const executeRequest = () => {
    return new Promise(resolve => {

        const deviceData = JSON.stringify({
            system_name : 'Renamed Device',
            type : 'WINDOWS_SERVER',
            hdd_capacity: '60'
        });

        const options = {
            hostname: 'localhost',
            port:     3000,
            path:     '/devices/e8okoP2l5', // ID for first element in device list
            method:   'PUT', //put route
            headers : {
                'Content-Type': 'application/json',
                'Content-Length': deviceData.length
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
        req.write(deviceData);
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

test('test', async t => {
    //RENAME the first device by using the ID 
    await executeRequest(); 

    const  server_response = await getResponseData('http://localhost:3000/devices');

    const devices_list = JSON.parse(server_response.rawData);
    for(let i=0; i< devices_list.length; i++){
        if(devices_list[i].id == 'e8okoP2l5 '){ //check if device with ID e8okoP2l5 has the specified new name
            await t
            .expect(device_name).eql(system_name)
            .expect(device_type).eql(type)
            .expect(device_capacity).contains(hdd_capacity);
        }
    }

});
 

