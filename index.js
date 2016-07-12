'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));



restService.post('/hook', function (req, res) {

    res.header('Access-Control-Allow-Origin','*');



    if(req.body.data){
            console.log('hook request');
            console.log(req.body);
            req.body = JSON.parse(req.body.data);
            req.body.data= null;
            console.log(req.body);
    }else if( typeof req.body=='string'){
            req.body = JSON.parse(req.body);
    }



    try {
        var speech = 'empty speech';



        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: req.body.result.action
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});