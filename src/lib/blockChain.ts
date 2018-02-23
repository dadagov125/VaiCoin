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
import {Signature} from "./signature";

export class BlockChain {


    chain: Array<Block> = [];
    allPeers: Array<Peer> = [];
    peer: Peer;

    private _newTransactions: Array<Transaction> = [];
    private _signature: Signature;

    constructor(peer: Peer, signature: Signature) {
        this.peer = peer;
        this._signature = signature
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


    mine() {
        let transactions = [new Transaction(new Address(""), this.peer.address, 100)];
        transactions = transactions.concat(this._newTransactions);
        this._newTransactions = [];

        let block = this.createRawBlock();
        block.transactions = transactions;
        block.hash = this.getHash(block);
        this.chain.push(block);
        return block
    }

    verifyBlock(block: Block) {
        return this.verifyProofData(this.getProofData(block)) !== false
    }

    verifyProofData(proofData: string): string | boolean {
        let hash = this.getSha256(proofData);
        return hash.startsWith('0000') ? hash : false

    }

    verifyTransaction(transaction: Transaction): boolean {
        return this._signature.verify(transaction.getTransferData(), transaction.signature)
    }

    addTransaction(transaction: Transaction) {
        if (this.verifyTransaction(transaction)) {
            this._newTransactions.push(transaction)
        }
    }

    getProofData(block: Block) {
        return `${block.index}${block.timestamp}${JSON.stringify(block.transactions)}${block.proof}${block.previousHash}`
    }

    getHash(block: Block) {
        let hash: string | boolean;
        while (!(hash = this.verifyProofData(this.getProofData(block)))) {
            block.proof++
        }
        return hash.toString()
    }

    getSha256(text: string) {
        const hasher = createHash('sha256');
        hasher.update(text);
        return hasher.digest('hex')
    }


}