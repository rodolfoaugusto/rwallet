<h1 align="center">R Wallet</h1><br>

<p align="center">
  <img src=".assets/rwallet-logo.png" alt="R Wallet logo" height="140">
</p>

# Introduction

Client and Server demonstration offer for Bitcoin test wallet with purchase flow, side-to-side encryption and passkey authentication. Developed in Node.js and React.

## Notes

> - [Download the Bitcoin Core](https://bitcoin.org/bin/bitcoin-core-27.0/bitcoin-27.0-x86_64-linux-gnu.tar.gz) and use the following configuration file.
> - [Regtest config asset](server/assets) for the Bitcoin Core in `regtest` mode.
> - Plaid sandbox credentials: **username** `user_good` and **password** `pass_good`.

## Structure

<p align="center">
    <a href="client">Client</a> |
    <a href="server">Server</a>
</p>

```bash
root
├── client      # contains the frontend client React application.
│ ├── components/    # React components.
│ ├── hooks/         # custom hooks.
│ ├── pages/         # page components.
│ ├── reducers/      # Redux reducers or state management.
│ ├── services/      # service layer logic and API calls.
│ ├── App.css        # the main stylesheet.
│ ├── App.js         # main App component.
│ ├── Helpers.js     # generic helper functions.
│ ├── index.js       # main entry point of the client application.
│ └── Store.js       # Redux store configuration.
├── server      # contains the backend server NodeJS application.
│ ├── config/        # configuration files for the server.
│ ├── errors/        # error handling extended classes.
│ ├── interceptors/  # interceptor logic for handling requests/responses.
│ ├── routes/        # route definitions and controllers.
│ ├── schemas/       # request validation schemas.
│ ├── services/      # service layer logic and business rules.
│ ├── tests/         # unit tests coverage.
│ └── app.js         # main entry point of the server application.
```
## Screenshots
**Login**
![image](https://github.com/user-attachments/assets/ae34b857-03c8-483e-a747-4fcd1c80f3bb)

**Connect bank account**
![image](https://github.com/user-attachments/assets/8c318a6d-91c2-420b-bbd8-4a72b7279f46)

**Crypto Offer**
![image](https://github.com/user-attachments/assets/45b9e018-acbe-4086-8acb-abb08749c0a3)

## Entity Relationship Diagram

<p align="center" style="background-color: rgba(0,0,0,0.1)">
    <img src=".assets/erd.svg" alt="Demo Architecture" width="80%">
</p>

## References

- [Patterns of distributed systems](https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html)
- [Redux Async Data Flow](https://redux.js.org/tutorials/fundamentals/part-6-async-logic#redux-async-data-flow)
- [Getting Started with Plaid in 3 Minutes](https://www.youtube.com/watch?v=U9xa1gzyPx8)
- [Payment Initiation (UK and Europe)](https://plaid.com/docs/api/products/payment-initiation/)
