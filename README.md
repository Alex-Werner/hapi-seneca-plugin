# hapi-seneca-plugin
Seneca microservices plugin for Hapi framework

## Overview 

This plugin allow you to use seneca 3.2 in a simpler way in your Hapi project. It use the Hapi [decorate](http://hapijs.com/api#serverdecoratetype-property-method-options) method.

## Installation

Using npm : 

```
npm install hapi-seneca-plugin
```

## How to 

api_gateway/index.js
```
const Hapi = require('hapi');
const server = new Hapi.Server();
const Routes = require('./routes.js');
const hapiSenecaPlugin=require('./hapi-seneca-plugin');
const hapiSenecaPluginOptions = {
    client: 
        {
            type: 'http', 
            port: 11110, 
            host:'localhost', 
            pin:{role:'users',cmd:'*'}
        }
};

server.connection({port:80});
server.register({register:hapiSenecaPlugin, options:hapiSenecaPluginOptions},(err)=>{
    if (err) throw cl(err);
    server.route(Routes.endpoints);
    server.start((err)=> {
        if (err) throw cl(err);
        cl('Started', server.info.id, 'on', server.info.protocol + '://' + server.info.host + ':' + server.info.port, 'Environment:' + process.env.NODE_ENV);
    });
})
```

api_gateway/routes.js
```
var PageHandler:{
    helloWorld:function(
        handler:function (request, reply) {
              return reply('<h2>Hello world! Have an hapi day!</h2>');
          }
    }
};
var UserHandler = {
    getUsersList:{
        handler:function (request, reply) {
                return reply.act({role:'users', cmd:'getUsersList'});
        }
    }
};
exports.endpoints = [
    {method:'GET', path:'/', config:PageHandler.helloWorld},
    {method:'GET', path:'/users', config:UserHandler.getUsersList}
];
```

microservices/users/index.js
```
var seneca = require('seneca')();
var usersOptions = {type: 'http', port: 11110, host: 'localhost'};
seneca.listen(usersOptions);
seneca.ready(()=> {
    cl('Started');
    seneca.add({role: 'users', cmd: 'getUsersList'}, getUsersList);
});
function getUsersList(request, reply) {
    var users = {users: [{username: "AWerner", firstname: "Alex", lastname: "Werner", age: 24}]};
    reply(null,users);
};
```

## What's next 

For now, I just expose `seneca` in server's hapi object.  
And `seneca.act` in reply's hapi object  
And I only allow a single connection.  

I plan to add every other tools I need for a side project [hapi-microservices-hapi-mongodb-sharded-seneca-docker](https://github.com/Alex-Werner/hapi-microservices-hapi-mongodb-sharded-seneca-docker) as :  
* Allow multiple client to be passed in options


## Versioning  

Releases will be numbered with the following format (semver):

`<major>.<minor>.<patch>`

The reason we doing that, is that, far from marketing or stuff. You will know easily if a breaking change occurs by
just looking the first number. Mind that some major version (breaking changes) can be absolutely necessary (bugfix). 
But at least it won't break your code  