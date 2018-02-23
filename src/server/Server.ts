/*
 MIT License

 Copyright (c) 2018 Magomed Dadagov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {Env, GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from 'ts-express-decorators'
import * as path from 'path'
import {$log} from "ts-log-debug";


const rootDir = path.resolve(__dirname);

@ServerSettings({

    logger: {
        debug: true,
        logRequest: true,
        requestFields: ["reqId", "method", "url", "headers", "body", "query", "params", "duration"]
    },
    env: Env.DEV,
    debug: false,
    port: 3000,
    rootDir,
    mount: {
        "": `${rootDir}/controllers/**/**.js`
    },
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    $onMountingMiddlewares(): void | Promise<any> {

        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');


        this
            .use(morgan('dev'))
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(bodyParser.raw())
            .use(bodyParser.text())
    }

    $onReady() {
        $log.debug('Server initialized')

    }

    $onServerInitError(error: any): any {
        $log.error('Server encounter an error =>', error);
    }


}

$log.info('Initialize server');

const server: Server = new Server();

server.start()
    .then(() => {
        $log.info('Server started...');


    })
    .catch((err) => {
        $log.error(err);
    });

