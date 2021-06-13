'use strict';

// Constants
require('dotenv').config();
const PORT = 8000;
const HOST = '127.0.0.1';

// Prometheus Client
const client = require('prom-client');

// PageSpeed
const axios = require('axios');
const jsonData = require('./sites.json');

// Express
const express = require('express');
const app = express();
app.get('/metrics', (_req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        let promises = [];
        // Updates PageSpeed scores
        jsonData.sites.forEach( (url) => {
            const request_url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url)
            const key = '&key=' + process.env.GOOGLE_API_KEY;
            const desktop = request_url + key + '&strategy=desktop';
            const mobile = request_url + key + '&strategy=mobile';
            
            console.log('started: ' + url);
            const mobileRequest = axios.get(mobile);
            const desktopRequest = axios.get(desktop);
            promises.push( Promise.all( [mobileRequest, desktopRequest] ).then( values => {
                values.forEach( value => {

                    // Process data here
                })
            }))
        })
          
        Promise.all(promises)
        .then( response => {
            // Send data to Grafana here
        })
        .catch(errors => {
            // react on errors.
            console.log(errors);
        })
        
    } catch (err) {
        res.status(500).end(err);
    }
});

app.listen(PORT, HOST);