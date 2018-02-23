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

import "reflect-metadata";
import {All, Controller, Get, RouteService} from "ts-express-decorators";
import {$log} from "ts-log-debug";
import {Connection, createConnection} from "typeorm";
import {Account} from "../entities/Account";

@Controller("")
export class RestCtrl {


    private connection: Connection;

    constructor(private routeService: RouteService) {
        this.init();
    }

    async init() {

        this.connection = await  createConnection();

    }

    @All('/all')
    public all() {
        const start = new Date();

        $log.debug("Route ALL /rest");
        $log.error("SSS");
        return "ALL"
    }


    @Get('/')
    public async getRoutes() {
        try {
            await this.connection.connect();
            const account = await this.connection.manager.find(Account);
            $log.info("Loaded users: ", account);
            return account
        } catch (err) {
            $log.error(err);
            return err
        } finally {
            await this.connection.close();
        }

    }
}