const request = require('request');  
const qs = require('querystring');  
var express = require('express');
var bodyParser =require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));
app.use(bodyParser.json({limit: '10mb'}));
var server = require('http').createServer(app);
var content;

 
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
            "Authorization":"APPCODE bf46438bab3b4e5da30556681771fd72"
        },
        body: post_data
    }; 
    return new Promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                content = JSON.parse(body.outputs[0].outputValue.dataValue);
                resolve()
            }else {
                console.log(error);
            }
        }); 
       
    })
    
}
app.post('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    (async() => {
        await sendToAliyun(req.body.base64.replace('data:image/png;base64,','').replace('data:image/jpeg;base64,',''));
        res.send(content);
    })()
    
});

server.listen(5566);


