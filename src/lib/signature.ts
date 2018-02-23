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

import {KeyPair} from "./keyPair";
import * as fs from 'fs'

let EC = require('elliptic').ec;

export class Signature {

    private _encrypter: any;
    private _storePath: string;

    constructor(storePath: string) {
        this._encrypter = new EC('secp256k1');
        this._storePath = storePath;
    }


    async signAsync(data: string) {

        let keyPair: KeyPair = await this.importKeyPairFromFileAsync(this._storePath);
        let privKeyPair = this._encrypter.keyFromPrivate(keyPair.privateKey);
        return privKeyPair.sign(data).toDER('hex')
    }

    async verifyAsync(originData: string, signature: string) {
        let keyPair: KeyPair = await this.importKeyPairFromFileAsync(this._storePath);
        let privKeyPair = this._encrypter.keyFromPrivate(keyPair.privateKey);
        return privKeyPair.verify(originData, signature)
    }

    generateKey() {
        let genKeyPair = this._encrypter.genKeyPair();
        let pubKey = genKeyPair.getPublic('hex');
        let privKey = genKeyPair.getPrivate('hex');
        let keyPair: KeyPair = new KeyPair(pubKey, privKey);
        this.exportKeyPairToFile(this._storePath, keyPair);
        return pubKey
    }

    private exportKeyPairToFile(path: string, keyPair: KeyPair) {
        fs.writeFile(path, JSON.stringify(keyPair), (err) => {
        })
    }

    private importKeyPairFromFileAsync(path: string): Promise<KeyPair> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (er, data: Buffer) => {
                let keyPair: KeyPair = JSON.parse(data.toString());
                resolve(keyPair)
            })

        })
    }

}