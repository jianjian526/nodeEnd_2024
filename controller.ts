var debug = require('debug')('backendapp:controller');
var { asyncHandler } = require("./common/utils");

// Duplicate function implementationを防止
export {}

// add url-route in /controllers:
function addMapping(router: any, mapping: any) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, asyncHandler(mapping[url]));
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, asyncHandler(mapping[url]));
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, asyncHandler(mapping[url]));
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, asyncHandler(mapping[url]));
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router: any, dir: string) {
    const fs = require('fs');

    fs.readdirSync(__dirname + '/' + dir).filter((f: any) => {
        return f.endsWith('.ts');
    }).forEach((f: any) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (router: any, dir: string) {
    let controllers_dir = dir || 'controllers';
    // const router = require('express-router')();

    addControllers(router, controllers_dir);

    debug('use controller-------');
};