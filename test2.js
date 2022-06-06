import https from 'http';
import { Selector } from 'testcafe';

fixture('fixture');
let devices_list;
let devices_ui;
let client_response;
let server_response;
let newDeviceName = "TEST-PC-2022";
let newDeviceType = "WINDOWS WORKSTATION";
let newDeviceCapacity = "50";

test
.page('http://localhost:3001')
('Create device test', async t => {
        await t  
        //Create new device with set properties
        .click('.submitButton')
        .typeText('#system_name',newDeviceName)
        .typeText('#hdd_capacity',newDeviceCapacity) 
        .click('.submitButton') 
});


test
.page('http://localhost:3001')
('Check devices on UI', async t => {
       // Extract list of devices from UI 
       devices_ui = Selector('.list-devices').child();
       var uiCount = await devices_ui.count;
         
       for(var i = 0; i < uiCount; i++){
           var device_main = devices_ui.nth(i);
           var device_info = await device_main.find('.device-info');
           var device_name = await device_info.find('.device-name').innerText;
           var device_type = await device_info.find('.device-type').innerText;
           var device_capacity = await device_info.find('.device-capacity').innerText;
           if(device_name == newDeviceName){
               await t
               //check if created device matches any of the devices in the list
               .expect(device_name).eql(newDeviceName)
               .expect(device_type).eql(newDeviceType)
               .expect(device_capacity).contains(newDeviceCapacity);
           }

       }
   })
