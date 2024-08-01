const Client = require('bitcoin-core');

const prismaService = require('./prisma');
const Config = require('../config');
const {
  ServiceUnavailableError,
  TransactionIncompleteError,
} = require('../errors');

class BitcoinNetworkService {
  userId;

  constructor(userId = null) {
    this.userId = userId;
    this.walletName = `wallet_${this.userId}`;
    this.config = Config.bitcoinNetwork;

    this.clientParameters = {
      network: 'regtest',
      port: 18443,
      version: '0.27.0',
      host: this.config.host,
      username: this.config.username,
      password: this.config.password,
    };

    // Regtest network client
    this.client = new Client(this.clientParameters);
  }

  sendToAddress = async (systemAsset, address, requestData) => {
    try {
      await this.loadWallet(systemAsset.systemId);

      const transactionId = await this.client.command(
        'sendtoaddress',
        address,
        requestData.amount
      );

      await this.unloadWallet(systemAsset.systemId);

      await this.setTransaction(
        systemAsset.id,
        systemAsset.id, // TO:DO - to user balance id
        requestData,
        transactionId
      );

      await this.removeFromCryptoAsset(requestData.amount, systemAsset.id);
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  generate = async (amount, address) => {
    try {
      await this.client.command('generatetoaddress', amount, address);

      const newAddress = await this.client.getNewAddress();

      await this.client.command('generatetoaddress', 1, newAddress);

      await this.client.command('generatetoaddress', 1000, newAddress);

      const balance = await this.client.command('getbalance');

      return balance;
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  createWallet = async () => {
    try {
      // Create wallet
      await this.client.command('createwallet', this.walletName);

      const address = await this.client.command('getnewaddress');

      // Unload
      await this.unloadWallet();

      return address;
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  loadWallet = async (walletName = false) => {
    try {
      await this.client.command(
        'loadwallet',
        walletName ? `wallet_${walletName}` : this.walletName
      );
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  unloadWallet = async (walletName = false) => {
    try {
      await this.client.command(
        'unloadwallet',
        walletName ? `wallet_${walletName}` : this.walletName
      );
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  // DATABASE OPERATIONS

  setTransaction = async (fromId, toId, data, transactionId) => {
    try {
      await prismaService.transaction.create({
        data: {
          fromId,
          toId,
          fee: 0.000001, // TO-DO: implement transaction fee from network
          amount: data.amount,
          currency: 'BTC',
          status: 'pending',
          transactionId,
        },
      });
    } catch {
      throw new TransactionIncompleteError();
    }
  };

  removeFromCryptoAsset = async (amount, balanceId) => {
    try {
      await prismaService.balance.update({
        where: {
          id: balanceId,
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });
    } catch {
      throw new ServiceUnavailableError();
    }
  };

  getCryptoAsset = async () => {
    try {
      const cryptoAsset = await prismaService.cryptoAssets.findFirstOrThrow({
        include: {
          systemBalance: true,
        },
        where: {
          systemBalance: {
            currency: 'BTC',
          },
        },
      });

      return {
        systemId: cryptoAsset.systemBalance.userId,
        address: cryptoAsset.systemBalance.address,
        amount: cryptoAsset.systemBalance.amount,
        id: cryptoAsset.systemBalance.id,
      };
    } catch {
      throw new ServiceUnavailableError();
    }
  };
}

module.exports = BitcoinNetworkService;
