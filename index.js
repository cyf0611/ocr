const request = require('request');  
const qs = require('querystring');  
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));
app.use(bodyParser.json({limit: '10mb'}));
const server = require('http').createServer(app);
var content, appcode, appcodeObj;

 
// 将base64 发送到第三方识别平台，并接收其返回值
function sendToAliyun(base64) {
    const post_data = {
        "inputs": [
            {
                "image": {
                    "dataType": 50,
                    "dataValue": base64
                }
            }
        ]
    }

    const options = {  
        url: "https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json",   
        method: "POST",  
        json: true,
        headers: {  
            "Content-Type":"application/json; charset=UTF-8",
            "Authorization":"APPCODE " + appcode
        },
        body: post_data
    }; 
    return new Promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                 //次数加1 写入到appcode.json文件   
                appcodeObj[appcode] += 1;  
                appcodeObj = JSON.stringify(appcodeObj);
                fs.writeFileSync('appcode.json', appcodeObj)

                content = JSON.parse(body.outputs[0].outputValue.dataValue);
                resolve()
            }else {
                console.log(error);
            }
        }); 
       
    })
    
}
// 读取appcode.json文件
function getAppCode() {
    return new Promise((resolve)=> {
        fs.readFile('appcode.json','utf8',function (err, data) {
            if(err) console.log(err);
            appcodeObj=JSON.parse(data);
            var index;
            //获取小于500次的appcode
            for (var k in appcodeObj) {
                if(appcodeObj[k]<=500) {
                    appcode = k;
                    break;
                }
            }
            
            resolve();
        });
    })
}
app.post('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    (async() => {
        await getAppCode();
        await sendToAliyun(req.body.base64.replace('data:image/png;base64,','').replace('data:image/jpeg;base64,',''));
        res.send(content);
    })()
    
});

server.listen(5566);


