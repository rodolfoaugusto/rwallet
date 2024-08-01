const { CryptoCurrency, Role } = require('@prisma/client');

const prisma = require('../src/services/prisma');
const BitcoinNetworkService = require('../src/services/bitcoinNetwork');

prisma.$connect();

const seed = async () => {
  // reset database
  await prisma.cryptoAssets.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.balance.deleteMany();
  await prisma.currencyList.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.user.deleteMany();

  // Add crypto currency
  const cryptoCurrency = Object.values(CryptoCurrency);

  for (let i = 0; i < cryptoCurrency.length; i++) {
    await prisma.currencyList.create({
      data: {
        isCrypto: true,
        value: cryptoCurrency[i],
        ...(cryptoCurrency[i] === CryptoCurrency.BTC && {
          price: 64778.14, // BTC price in USD
        }),
      },
    });
  }

  // Add not crypto currency
  await prisma.currencyList.create({
    data: {
      isCrypto: false,
      value: 'USD',
    },
  });

  // System user

  const systemUser = await prisma.user.create({
    data: {
      name: 'SYSTEM',
      email: '[email protected]',
      role: Role.SYSTEM,
      password: 'system',
      balances: {
        create: {
          currency: CryptoCurrency.BTC,
          amount: 0,
        },
      },
    },
  });

  const bitcoinNetwork = new BitcoinNetworkService(systemUser.id);

  const address = await bitcoinNetwork.createWallet();

  await bitcoinNetwork.loadWallet();

  const amount = await bitcoinNetwork.generate(100, address); // 100 generate blocks

  await bitcoinNetwork.unloadWallet();

  // Select System user BTC balance
  const systemBtcBalance = await prisma.balance.update({
    data: {
      address,
      amount,
    },
    where: {
      balances_user_id_currency_unique: {
        userId: systemUser.id,
        currency: CryptoCurrency.BTC,
      },
    },
  });

  // Add crypto asset to system user
  await prisma.cryptoAssets.create({
    data: {
      userId: systemUser.id,
      balanceId: systemBtcBalance.id,
    },
  });
};

seed();
