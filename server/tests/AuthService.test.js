const { hash, compare } = require('bcrypt');

const Config = require('../src/config');
const { MissingFieldsError } = require('../src/errors');

const prismaService = require('../src/services/prisma');
const AuthService = require('../src/services/auth');
const BitcoinNetworkService = require('../src/services/bitcoinNetwork');

// Mocking dependencies
jest.mock('bcrypt');
jest.mock('../src/services/prisma');
jest.mock('../src/services/bitcoinNetwork');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const payload = { email: 'test@example.com', password: 'password' };

      prismaService.user.findUnique.mockResolvedValue({
        id: 1,
        password: 'encryptedPassword',
        passkeys: [],
      });
      compare.mockResolvedValue(true);

      const userId = await authService.login(payload);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
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
          email: payload.email,
          role: 'USER',
        },
      });
      expect(compare).toHaveBeenCalledWith(
        payload.password,
        'encryptedPassword'
      );
      expect(userId).toStrictEqual({ id: 1, security: false });
    });
  });

  describe('signUp', () => {
    it('should sign up a new user and create a wallet', async () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      const encryptedPassword = 'hashedPassword';
      hash.mockResolvedValue(encryptedPassword);

      prismaService.user.create.mockResolvedValue({ id: 1 });

      BitcoinNetworkService.mockImplementation(() => ({
        createWallet: jest.fn().mockResolvedValue('newAddress'),
      }));

      prismaService.balance.update.mockResolvedValue({});

      const result = await authService.signUp(payload);

      expect(hash).toHaveBeenCalledWith(
        payload.password,
        Number(Config.encryption.passwordSaltRounds)
      );

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: payload.name,
          email: payload.email,
          password: encryptedPassword,
          balances: {
            create: {
              amount: 0,
            },
          },
        },
      });

      expect(BitcoinNetworkService).toHaveBeenCalledWith(1);

      expect(prismaService.balance.update).toHaveBeenCalledWith({
        where: {
          balances_user_id_currency_unique: {
            userId: 1,
            currency: 'BTC',
          },
        },
        data: {
          address: 'newAddress',
        },
      });

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('validatePassword', () => {
    it('should validate the password correctly', async () => {
      compare.mockResolvedValue(true);

      await expect(
        authService.validatePassword('password', 'encryptedPassword')
      ).resolves.not.toThrow();

      expect(compare).toHaveBeenCalledWith('password', 'encryptedPassword');
    });
  });

  describe('passwordEncrypt', () => {
    it('should encrypt the password', async () => {
      const encryptedPassword = 'hashedPassword';
      hash.mockResolvedValue(encryptedPassword);

      const result = await authService.passwordEncrypt('password');

      expect(hash).toHaveBeenCalledWith(
        'password',
        Number(Config.encryption.passwordSaltRounds)
      );
      expect(result).toBe(encryptedPassword);
    });
  });

  describe('validateInput', () => {
    it('should validate the input and return the payload', () => {
      const payload = { email: 'test@example.com', password: 'password' };

      const result = authService.validateInput(payload);

      expect(result).toBe(payload);
    });

    it('should throw MissingFieldsError if a required field is missing', () => {
      const payload = { email: '', password: 'password' };

      expect(() => authService.validateInput(payload)).toThrow(
        MissingFieldsError
      );
    });
  });
});
