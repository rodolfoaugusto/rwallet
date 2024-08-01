import { api } from './api';

export const NetworkServices = api.injectEndpoints({
    endpoints: (build) => ({
        balance: build.query({
            query: () => 'network/balance',
        }),
    }),
});

export const { useBalanceQuery } = NetworkServices;
