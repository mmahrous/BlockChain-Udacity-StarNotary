require('babel-polyfill');

var StarNotary = artifacts.require('./StarNotary.sol')

let owner, accounts

contract('StarNotary', async (_accounts) => {
    accounts = _accounts
    owner = accounts[0]
    it('get star token name', async () => {
        let instance = await StarNotary.deployed()
        assert.equal(await instance.name.call(), 'Fun Star Notary')
    })
    it('get star token symbol', async () => {
        let instance = await StarNotary.deployed()
        assert.equal(await instance.symbol.call(), 'FSNT')
    })
    it('create star', async () => {
        let instance = await StarNotary.deployed()
        await instance.createStar('Fun Star', 1, {from: owner})
        assert.equal(await instance.tokenIdToStarInfo.call(1), 'Fun Star')
        assert.equal(await instance.ownerOf(1, {from: owner}), owner)
    })
    it('create star and get info', async () => {
        let instance = await StarNotary.deployed()
        let starId = 10
        await instance.createStar('Fun Star', starId, {from: owner})
        assert.equal(await instance.lookUptokenIdToStarInfo(starId, {from: owner}), 'Fun Star')
    })
    it('Transfer stars', async () => {
        let instance = await StarNotary.deployed()
        let starId = 11
        await instance.createStar('Fun Star', starId, {from: owner})
        assert.equal(await instance.ownerOf(starId, {from: owner}), owner)
        await instance.transferStar(accounts[1], starId, {from: owner})
        assert.equal(await instance.ownerOf(starId, {from: accounts[1]}), accounts[1])
    })
    it('Exchange stars', async () => {
        let instance = await StarNotary.deployed()
        let starId = 12
        await instance.createStar('Fun Star', starId, {from: owner})
        assert.equal(await instance.ownerOf(starId, {from: owner}), owner)
        let secondStarId = 13
        await instance.createStar('Fun Star', secondStarId, {from: accounts[1]})
        assert.equal(await instance.ownerOf(secondStarId, {from: accounts[1]}), accounts[1])
        await instance.exchangeStars(starId, accounts[1], secondStarId, {from: owner})
        assert.equal(await instance.ownerOf(starId, {from: owner}), accounts[1])
        assert.equal(await instance.ownerOf(secondStarId, {from: accounts[1]}), owner)
    })
    it('put star for sale', async () => {
        let instance = await StarNotary.deployed()
        let price = web3.toWei("0.01", "ether")
        await instance.createStar('Fun Star', 2, {from: owner})
        await instance.putStarForSale(2, price, {from: owner})
        assert.equal(await instance.starsForSale.call(2), price)
    })

    it('buy star with same price', async () => {
        let instance = await StarNotary.deployed()
        let price = web3.toWei("0.01", "ether")
        let buyer = accounts[1]
        await instance.createStar('Fun Star', 3, {from: owner})
        await instance.putStarForSale(3, price, {from: owner})
        let ownerBal = web3.eth.getBalance(owner)
        let buyerBal = web3.eth.getBalance(buyer)
        await instance.buyStar(3, {from: buyer, value: price})
        let newOwnerBal = web3.eth.getBalance(owner)
        let newBuyerBal = web3.eth.getBalance(buyer)
        assert.equal(newOwnerBal - ownerBal, price)
        assert.equal(await instance.ownerOf(3, {from: buyer}), buyer)
    })
})
