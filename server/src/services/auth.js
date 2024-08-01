const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  // verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { hash, compare } = require('bcrypt');

const prismaService = require('./prisma');
const BitcoinNetworkService = require('./bitcoinNetwork');
const UserService = require('./user');

const Config = require('../config');
const {
  MissingFieldsError,
  UserSignupError,
  InvalidCredentialError,
  InvalidPasskeyError,
} = require('../errors');

class AuthService {
  constructor() {
    this.config = Config;
    this.userService = new UserService();
  }

  login = async (payload) => {
    const { email, password } = this.validateInput(payload);

    try {
      const { id, encryptedPassword, security } =
        await this.userService.getCredential(email);

      await this.validatePassword(password, encryptedPassword);

      return { id, security };
    } catch {
      throw new InvalidCredentialError();
    }
  };

  signUp = async (payload) => {
    const { name, email, password } = this.validateInput(payload);

    try {
      const encryptedPassword = await this.passwordEncrypt(password);

      const userId = await this.userService.create(
        name,
        email,
        encryptedPassword
      );

      const bitcoinNetwork = new BitcoinNetworkService(userId);

      const address = await bitcoinNetwork.createWallet();

      // Set the address in the balance table
      await prismaService.balance.update({
        where: {
          balances_user_id_currency_unique: {
            userId,
            currency: 'BTC',
          },
        },
        data: {
          address,
        },
      });

      return { id: userId };
    } catch {
      throw new UserSignupError();
    }
  };

  /**
   * The ``confirmAuthentication`` method is used to confirm WebAuthn authentication.
   * The method takes two arguments: the sessionId and the payload.
   * @param {String} sessionId (sessionId)
   * @param {Object} payload (payload) - The payload contains the response from the WebAuthn authentication process.
   * @returns {Object} ``{userId, security}`` - Returns the user id and security status.
   */
  confirmAuthentication = async (sessionId, payload) => {
    try {
      const getSession =
        await prismaService.sessionFingerprint.findFirstOrThrow({
          select: {
            challenge: true,
          },
          where: {
            sessionId,
          },
        });

      const passkey = await prismaService.passkey.findFirstOrThrow({
        select: {
          credentialId: true,
          credentialPublicKey: true,
          counter: true,
          transports: true,
          userPasskey: {
            select: {
              email: true,
              id: true,
            },
          },
        },
        where: {
          credentialId: payload.id,
        },
      });

      const verified = await verifyAuthenticationResponse({
        response: payload,
        expectedChallenge: getSession.challenge,
        expectedOrigin: this.config.application.expectedOrigin,
        expectedRPID: this.config.application.domain,
        authenticator: {
          credentialID: passkey.credentialId,
          credentialPublicKey: passkey.credentialPublicKey,
          counter: passkey.counter,
          transports: passkey.transports.split(','),
        },
      });

      if (verified) {
        return { id: passkey.userPasskey.id, security: true };
      } else {
        throw 'Invalid Passkey';
      }
    } catch {
      throw new InvalidPasskeyError();
    }
  };

  /**
   * The ``generateAuthentication`` method is to generate the authentication options for the WebAuthn authentication process.
   */
  generateAuthentication = async (sessionId) => {
    const authenticationOptions = await generateAuthenticationOptions({
      rpName: this.config.application.name,
      rpID: this.config.application.domain,
      attestationType: 'indirect',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    await prismaService.sessionFingerprint.upsert({
      where: {
        sessionId,
      },
      create: {
        sessionId,
        challenge: authenticationOptions.challenge,
      },
      update: {
        challenge: authenticationOptions.challenge,
      },
    });

    return authenticationOptions;
  };

  /**
   * The ``confirmRegistration`` method is used to confirm WebAuthn registration.
   * The method takes two arguments: the userId and the payload.
   * @param {String} userId (userId)
   * @param {String} sessionId (sessionId)
   * @param {Object} payload (payload) - The payload contains the response from the WebAuthn registration process.
   */
  confirmRegistration = async (userId, sessionId, payload) => {
    try {
      const getSession =
        await prismaService.sessionFingerprint.findFirstOrThrow({
          select: {
            challenge: true,
          },
          where: {
            sessionId,
          },
        });

      const verified = await verifyRegistrationResponse({
        response: payload,
        expectedChallenge: getSession.challenge,
        expectedOrigin: this.config.application.expectedOrigin,
        expectedRPID: this.config.application.domain,
      });

      if (verified) {
        const {
          counter,
          credentialPublicKey,
          credentialDeviceType,
          credentialID,
        } = verified.registrationInfo;

        await prismaService.passkey.create({
          data: {
            credentialId: credentialID,
            userId,
            counter,
            credentialPublicKey,
            webauthnId: payload.webauthnId,
            deviceType: credentialDeviceType,
            transports: payload.response.transports.join(','),
          },
        });

        return !!verified;
      }
    } catch {
      throw new InvalidPasskeyError();
    }
  };

  /**
   * The ``generateRegistration`` method is used to generate the registration options for the WebAuthn registration process.
   * @param {String} userId (userId)
   */

  /**
   * The ``generateRegistration`` method is used to generate the registration options for the WebAuthn registration process.
   * @param {String} userId (userId)
   */
  generateRegistration = async (userId, sessionId) => {
    const user = await this.userService.get(userId);

    const publicKeyCredential = await generateRegistrationOptions({
      rpName: this.config.application.name,
      rpID: this.config.application.domain,
      userDisplayName: user.name,
      userName: user.email,
      attestationType: 'indirect',
      excludeCredentials: user.passkeys.map((passkey) => ({
        id: passkey.id,
        type: 'public-key',
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    await prismaService.sessionFingerprint.upsert({
      where: {
        sessionId,
      },
      create: {
        sessionId,
        challenge: publicKeyCredential.challenge,
      },
      update: {
        challenge: publicKeyCredential.challenge,
      },
    });

    return publicKeyCredential;
  };

  /**
    * The ``validatePassword`` method is used to compare the password with the encrypted password.
    The method takes two arguments: the password and the encrypted password.
    The compare method is an asynchronous method that takes two arguments: the password and the encrypted password.
    If the password is invalid, the method throws an ``InvalidCredentialError``.
    * @param {String} password (password)
    * @param {String} encryptedPassword (encrypted password)
  */
  validatePassword = async (password, encryptedPassword) => {
    const isValid = await compare(password, encryptedPassword);

    if (!isValid) throw new InvalidCredentialError();
  };

  /**
   * The ``passwordEncrypt`` method is used to encrypt the password using the ``bcrypt`` library.
    This method takes a password as an argument and returns a hashed password.
    Hash method is an asynchronous method that takes two arguments: the password and the number of salt rounds. 
    Salt rounds are defined in the Config file. The higher the number of salt rounds, the more secure the password will be. 
    The method returns a hashed password.
   * @param {String} password (password)
   */
  passwordEncrypt = async (password) => {
    return hash(password, Number(this.config.encryption.passwordSaltRounds));
  };

  /**
   * The ``validateInput`` method is used to validate the input fields. 
    The method takes a payload as an argument and checks if the required fields are present. 
    If any of the required fields are missing, the method throws a ``MissingFieldsError``. 
    The method returns the payload if all the required fields are
   * @param {Object} payload ({name, email, password})
   */
  validateInput(payload) {
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (
        !payload[field] ||
        payload[field] === '' ||
        payload[field] === null ||
        payload[field].length === 0
      ) {
        throw new MissingFieldsError();
      }
    }

    return payload;
  }
}

module.exports = AuthService;
