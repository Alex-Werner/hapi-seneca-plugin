'use strict';
const Package = require('./package');
const Seneca = require('seneca');
const cl = console.log;

exports.register = function (server, options, next) {
    const seneca = Seneca();
    seneca.client(options.client);
    server.decorate('server','seneca',seneca);
    server.decorate('reply', 'act', function(pattern){
        seneca.act(pattern, (err, result, info) => {
            this.response(err || result);
    });
    });
    return next();
};

exports.register.attributes = {
    name: Package.name,
    version: Package.version
};