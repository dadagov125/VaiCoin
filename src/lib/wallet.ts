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


import {Transaction} from "./transaction";
import {Address} from "./address";
import {Signature} from "./signature";


export class Wallet {

    address: Address;
    _signature: Signature;

    constructor(signature: Signature) {
        this._signature = signature;
        if (!this.address) this._generateNewAddress()
    }


    async transfer(recipient: Address, amount: number) {
        let transaction: Transaction = new Transaction(this.address, recipient, amount);
        let transferData = transaction.getTransferData();
        transaction.signature = await this._signature.signAsync(transferData);
        return transaction
    }

    private _generateNewAddress() {
        let pubKey = this._signature.generateKey();
        this.address = new Address(pubKey)
    }


}

