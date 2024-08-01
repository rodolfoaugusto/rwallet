const prismaService = require('./prisma');
const { CurrencyListFetchError } = require('../errors');

class CurrencyService {
  listCurrency = async () => {
    try {
      const currencies = await prismaService.currencyList.findMany({
        select: {
          value: true,
          isCrypto: true,
          price: true,
        },
        where: {
          active: true,
        },
        orderBy: {
          isCrypto: 'asc',
        },
      });

      return currencies;
    } catch {
      throw new CurrencyListFetchError();
    }
  };

  getCurrency = async (currency) => {
    try {
      const currencyData = await prismaService.currencyList.findUnique({
        where: {
          value: currency,
          active: true,
        },
      });

      return currencyData;
    } catch {
      throw new CurrencyListFetchError();
    }
  };
}

module.exports = CurrencyService;
