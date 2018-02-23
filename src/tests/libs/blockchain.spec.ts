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

let path = './keys.json';


describe('Blockchain', async () => {
    let signature = new Signature(path);
    let wallet = new Wallet(signature);
    let peer = new Peer(wallet.address, 'localhost', 9595);
    let blockchain = new BlockChain(peer);
    let msg = "test";

    it('chain is not empty, check genesis block', async () => {

        assert.notEqual(blockchain.chain.length, 0);
        assert.equal(blockchain.chain[0].previousHash, '1')
    });

    //
    // it('create new block success', async () => {
    //
    //     let block=blockchain.createBlock(100)
    //     assert.isNotNull(block)
    //     assert.equal(block.previousHash.length,64)
    // });


    it('mine success', async () => {
        blockchain = new BlockChain(peer);
        let block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();
        block = blockchain.mineBlock();


        assert.isNotNull(block)
    });


});