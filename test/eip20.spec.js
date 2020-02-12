const {use, expect} = require('chai');
const {solidity} = require('ethereum-waffle');
const EIP20 = require('../build/EIP20.json');
//ADD TO SUPPORT OVM
const {createMockProvider, getWallets, deployContract } = require('@eth-optimism/rollup-full-node')

use(solidity);

describe('ERC20 smart contract', () => {
  let provider
  let wallet, walletTo

  before(async () => {
    provider = await createMockProvider()
    const wallets = getWallets(provider)
    wallet = wallets[0]
    walletTo = wallets[1]
  })

  //ADD TO SUPPORT OVM
  after(() => {provider.closeOVM()}) 

  // parameters to use for our test coin
  const COIN_NAME = 'OVM Test Coin'
  const TICKER = 'OVM'
  const NUM_DECIMALS = 1
  let ERC20

  /* Deploy a new ERC20 Token before each test */
  beforeEach(async () => {
    ERC20 = await deployContract(wallet, EIP20, [10000, COIN_NAME, NUM_DECIMALS, TICKER])
  })

  it('creation: should create an initial balance of 10000 for the creator', async () => {
    const balance = await ERC20.balanceOf(wallet.address)
    expect(balance.toNumber()).to.equal(10000);
  });

  it('creation: test correct setting of vanity information', async () => {
    const name = await ERC20.name();
    expect(name).to.equal(COIN_NAME);

    const decimals = await ERC20.decimals();
    expect(decimals).to.equal(NUM_DECIMALS);

    const symbol = await ERC20.symbol();
    expect(symbol).to.equal(TICKER);
  });

  it('transfers: should transfer 10000 to walletTo with wallet having 10000', async () => {
    await ERC20.transfer(walletTo.address, 10000);
    const walletToBalance = await ERC20.balanceOf(walletTo.address);
    const walletFromBalance = await ERC20.balanceOf(wallet.address);
    expect(walletToBalance.toNumber()).to.equal(10000);
    expect(walletFromBalance.toNumber()).to.equal(0);
  });
});