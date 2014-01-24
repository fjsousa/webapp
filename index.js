#!/usr/bin/env node

var express = require('express');
var app = express();

app.use('/', express.static(__dirname+'/build/'));

app.listen(8070);