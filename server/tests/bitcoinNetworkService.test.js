const Client = require('bitcoin-core');
const prismaService = require('../src/services/prisma');
const BitcoinNetworkService = require('../src/services/bitcoinNetwork');

// Mocking dependencies
jest.mock('bitcoin-core');
jest.mock('../src/services/prisma', () => {
  return {
    transaction: {
      create: jest.fn(),
    },
    balance: {
      update: jest.fn(),
    },
    cryptoAssets: {
      findFirstOrThrow: jest.fn(),
    },
  };
});
jest.mock('../src/config', () => ({
  bitcoinNetwork: {
    host: 'localhost',
    username: 'user',
    password: 'pass',
  },
}));

describe('BitcoinNetworkService', () => {
  let service;
  let clientMock;

  beforeEach(() => {
    clientMock = {
      command: jest.fn(),
      getNewAddress: jest.fn(),
    };
    Client.mockImplementation(() => clientMock);
    service = new BitcoinNetworkService(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendToAddress', () => {
    it('should send to address and update transaction', async () => {
      clientMock.command.mockResolvedValueOnce('transactionId');

      prismaService.transaction.create.mockResolvedValue({});
      prismaService.balance.update.mockResolvedValue({});

      await service.sendToAddress({ systemId: 1, id: 1 }, 'address', {
        amount: 1,
      });

      expect(clientMock.command).toHaveBeenCalledWith(
        'sendtoaddress',
        'address',
        1
      );
      expect(clientMock.command).toHaveBeenCalledWith(
        'unloadwallet',
        'wallet_1'
      );
      expect(prismaService.transaction.create).toHaveBeenCalled();
      expect(prismaService.balance.update).toHaveBeenCalled();
    });
  });

  describe('createWallet', () => {
    it('should create a wallet and return the address', async () => {
      clientMock.command
        .mockResolvedValueOnce()
        .mockResolvedValueOnce('newAddress');

      const address = await service.createWallet();

      expect(clientMock.command).toHaveBeenCalledWith(
        'createwallet',
        'wallet_1'
      );
      expect(clientMock.command).toHaveBeenCalledWith('getnewaddress');
      expect(clientMock.command).toHaveBeenCalledWith(
        'unloadwallet',
        'wallet_1'
      );
      expect(address).toBe('newAddress');
    });
  });

  describe('loadWallet', () => {
    it('should load the wallet', async () => {
      clientMock.command.mockResolvedValueOnce();

      await service.loadWallet();

      expect(clientMock.command).toHaveBeenCalledWith('loadwallet', 'wallet_1');
    });
  });

  describe('unloadWallet', () => {
    it('should unload the wallet', async () => {
      clientMock.command.mockResolvedValueOnce();

      await service.unloadWallet();

      expect(clientMock.command).toHaveBeenCalledWith(
        'unloadwallet',
        'wallet_1'
      );
    });
  });

  describe('setTransaction', () => {
    it('should set the transaction', async () => {
      prismaService.transaction.create.mockResolvedValueOnce({});

      await service.setTransaction(1, 2, { amount: 1 }, 'transactionId');

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          fromId: 1,
          toId: 2,
          fee: 0.000001,
          amount: 1,
          currency: 'BTC',
          status: 'pending',
          transactionId: 'transactionId',
        },
      });
    });
  });

  describe('removeFromCryptoAsset', () => {
    it('should remove from crypto asset', async () => {
      prismaService.balance.update.mockResolvedValueOnce({});

      await service.removeFromCryptoAsset(1, 1);

      expect(prismaService.balance.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          amount: { decrement: 1 },
        },
      });
    });
  });

  describe('getCryptoAsset', () => {
    it('should get crypto asset', async () => {
      prismaService.cryptoAssets.findFirstOrThrow.mockResolvedValueOnce({
        systemBalance: {
          userId: 1,
          address: 'address',
          amount: 1,
          id: 1,
        },
      });

      const asset = await service.getCryptoAsset();

      expect(prismaService.cryptoAssets.findFirstOrThrow).toHaveBeenCalledWith({
        include: { systemBalance: true },
        where: {
          systemBalance: {
            currency: 'BTC',
          },
        },
      });
      expect(asset).toEqual({
        systemId: 1,
        address: 'address',
        amount: 1,
        id: 1,
      });
    });
  });
});
