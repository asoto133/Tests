import https from 'http';
import { Selector } from 'testcafe';

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
let devices_list; 
let devices_ui;
let client_response;
let server_response;

test('Get Server objects', async t => {
    server_response = await getResponseData('http://localhost:3000/devices');
    await t.expect(server_response.statusCode).eql(200);
});

test('Get client objects', async t => {
    client_response = await getResponseData('http://localhost:3001');
    await t.expect(client_response.statusCode).eql(200);
})


test
.page('http://localhost:3001')
('Check devices on UI', async t => {
  
    // Extract list of devices from UI 
    devices_ui = Selector('.list-devices').child();
    var uiCount = await devices_ui.count;
    const devices_list_UI = new Array(uiCount);

    for(var i = 0; i < uiCount; i++){ 
        var device_main = devices_ui.nth(i);
        var device_info = await device_main.find('.device-info');
        var device_name = await device_info.find('.device-name');
        var device_type = await device_info.find('.device-type');
        var device_capacity = await device_info.find('.device-capacity');
        var device_options = await device_main.find('.device-options');
        var device_edit_href = await device_options.find('.device-edit').getAttribute("href"); //href contains the device ID
        device_edit_href = device_edit_href.substring(14); //device ID after 14th position in string
        var device_edit = await device_options.find('.device-edit');
        var device_remove = await device_options.find('.device-remove');

        devices_list_UI[i] = {
            id: device_edit_href,
            system_name : await device_name.innerText,
            type : await device_type.innerText,
            hdd_capacity : await device_capacity.innerText,
            edit: await device_edit.innerText,
            remove: await device_remove.innerText
        }
    }

    // iterate for each device from server 
    devices_list = JSON.parse(server_response.rawData);
    for(let i=0; i< devices_list.length; i++){
        for(let j=0; j< devices_list_UI.length; j++){
            if(devices_list[i].id == devices_list_UI[j].id){
                await t
                //Check if devices are correctly displayed
                .expect(devices_list[i].system_name).eql(devices_list_UI[j].system_name)
                .expect(devices_list[i].type).eql(devices_list_UI[j].type)
                .expect(devices_list_UI[j].hdd_capacity).contains(devices_list[i].hdd_capacity)
                //Verify that EDIT and REMOVE button exist
                .expect(devices_list_UI[i].edit).contains("EDIT")
                .expect(devices_list_UI[i].remove).contains("REMOVE");
            }
        }
    }

})

      


