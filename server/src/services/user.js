const prismaService = require('./prisma');
const {
  UserFetchError,
  UserSetBankAccountError,
  UserDataValidationError,
  ServiceUnavailableError,
} = require('../errors');

class UserService {
  userId;

  constructor(userId = null) {
    this.userId = userId;
  }

  create = async (name, email, password) => {
    try {
      const { id } = await prismaService.user.create({
        data: {
          name,
          email,
          password,
          balances: {
            create: {
              amount: 0,
            },
          },
        },
      });

      return id;
    } catch {
      throw new UserFetchError();
    }
  };

  getCredential = async (email) => {
    try {
      const {
        id,
        password: encryptedPassword,
        passkeys,
      } = await prismaService.user.findUnique({
        select: {
          id: true,
          password: true,
          passkeys: {
            select: {
              credentialId: true,
            },
          },
        },
        where: {
          email,
          role: 'USER',
        },
      });

      return {
        id,
        encryptedPassword,
        security: passkeys.length > 0 ? true : false,
      };
    } catch {
      throw new UserFetchError();
    }
  };

  get = async (userId = false) => {
    try {
      const findUser = await prismaService.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          passkeys: true,
        },
        where: {
          id: userId || this.userId,
        },
      });

      return findUser;
    } catch {
      throw new UserFetchError();
    }
  };

  getBalance = async (userId = false) => {
    try {
      const { amount, address } = await prismaService.balance.findUnique({
        select: {
          amount: true,
          address: true,
        },
        where: {
          balances_user_id_currency_unique: {
            userId: userId ? userId : this.userId,
            currency: 'BTC',
          },
        },
      });

      const { price } = await prismaService.currencyList.findUnique({
        select: {
          price: true,
        },
        where: {
          value: 'BTC',
        },
      });

      return {
        amount: amount.toFixed(6),
        address,
        profit: (price * amount).toFixed(2),
        price,
      };
    } catch {
      throw new UserDataValidationError();
    }
  };

  updateBalance = async (value, action = 'increment') => {
    const validActions = ['increment', 'decrement'];

    if (!validActions.includes(action)) {
      throw new ServiceUnavailableError();
    }

    try {
      await prismaService.balance.update({
        where: {
          balances_user_id_currency_unique: {
            userId: this.userId,
            currency: 'BTC',
          },
        },
        data: {
          amount: {
            [action]: parseFloat(value),
          },
        },
      });
    } catch {
      throw new UserFetchError();
    }
  };

  getBankAccount = async (bankAccountId) => {
    try {
      const bankAccount = await prismaService.bankAccount.findUniqueOrThrow({
        select: {
          accessToken: true,
          accountId: true,
        },
        where: {
          bank_accounts_user_id_id_unique: {
            userId: this.userId,
            id: bankAccountId,
          },
        },
      });

      return bankAccount;
    } catch {
      throw new UserDataValidationError();
    }
  };

  selectBankAccounts = async () => {
    try {
      const bankAccounts = await prismaService.bankAccount.findMany({
        select: {
          id: true,
          name: true,
          bankName: true,
          accountMask: true,
        },
        where: {
          userId: this.userId,
        },
      });

      return bankAccounts;
    } catch {
      throw new UserSetBankAccountError();
    }
  };

  setBankAccounts = async (accessToken, data) => {
    const { metadata } = data;

    try {
      if (metadata.accounts) {
        const availableAccounts = [];

        for (const account of metadata.accounts) {
          availableAccounts.push({
            accessToken,
            userId: this.userId,
            bankName: metadata.institution.name,
            institutionId: metadata.institution.institution_id,
            name: account.name,
            accountId: account.id,
            accountMask: account.mask,
          });
        }

        await prismaService.bankAccount.createMany({
          data: availableAccounts,
          skipDuplicates: true,
        });
      } else {
        throw 'No accounts found';
      }
    } catch {
      throw new UserSetBankAccountError();
    }
  };
}

module.exports = UserService;
