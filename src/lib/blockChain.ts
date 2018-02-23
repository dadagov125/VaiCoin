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

import {Block} from "./block";
import {Transaction} from "./transaction";
import {Peer} from "./peer";
import {createHash} from 'crypto'
import {Address} from "./address";

export class BlockChain {


    chain: Array<Block> = [];

    newTransactions: Array<Transaction> = [];
    allPeers: Array<Peer> = [];
    peer: Peer;

    constructor(peer: Peer) {
        this.peer = peer
    }

    lastBlock() {
        if (this.chain.length > 0)
            return this.chain[this.chain.length - 1]
    }

    lastBlockHash() {
        let block = this.lastBlock();
        if (block) return block.hash;
        else return 'genesis'
    }

    createRawBlock() {
        return new Block(this.chain.length, Date.now(), [], 0, '', this.lastBlockHash())
    }

    getProofData(block: Block) {
        return `${block.index}${block.timestamp}${JSON.stringify(block.transactions)}${block.proof}${block.previousHash}`
    }

    mineBlock() {

        let transactions = this.newTransactions.filter((value, index, array) => {
            true
        });
        transactions.push(new Transaction(new Address(""), this.peer.address, 100));

        let hash = '';
        let block = this.createRawBlock();
        block.transactions = transactions;
        while (!this.verifyProof(this.getProofData(block))) {
            block.proof++
        }
        block.hash = hash;

        this.chain.push(block);
        return block
    }

    verifyProof(proofData: string) {
        let hash = this.getSha256(proofData);
        return hash.startsWith('0000') ? hash : null

    }


    getSha256(text: string) {
        const hasher = createHash('sha256');
        hasher.update(text);
        return hasher.digest('hex')
    }


    createProofOfWork(lastProofOfWork: number, previousHash: string) {

        let pow: number = 0;
        while (!this.isValidProof(lastProofOfWork, pow, previousHash)) {
            pow++
        }
        return pow;
    }

    isValidProof(lastProofOfWork: number, pow: number, previousHash: string) {
        let guess = `${lastProofOfWork}${pow}${previousHash}`;
        let result = this.getSha256(guess);
        if (result.startsWith('0000'))
            return true;
        else false
    }


}