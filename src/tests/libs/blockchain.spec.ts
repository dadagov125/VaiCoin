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

import {assert} from 'chai';
import 'mocha';
import {Wallet} from "../../lib/wallet";
import {BlockChain} from "../../lib/blockChain";
import {Peer} from "../../lib/peer";
import {Signature} from "../../lib/signature";
import {Address} from "../../lib/address";

let path = './keys.json';


describe('Blockchain', async () => {
    let signature = new Signature(path);
    let wallet = new Wallet(signature);
    let peer = new Peer(wallet.address, 'localhost', 9595);
    let blockchain = new BlockChain(peer, signature);
    let msg = "test";




    it('mine success', async () => {

        let transaction = wallet.transfer(new Address('ss'), 222);

        blockchain = new BlockChain(peer, signature);
        blockchain.addTransaction(transaction);

        let block = blockchain.mine();

        let block2 = blockchain.mine();


        assert.isNotNull(block);
        assert.isNotNull(block2);
        assert.equal(block.previousHash, 'genesis');
        assert.equal(block.hash, block2.previousHash)

    });


});