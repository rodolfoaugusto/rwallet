import { api } from './api';

export const PurchaseServices = api.injectEndpoints({
    endpoints: (build) => ({
        requestBankLinkToken: build.query({
            query: () => ({
                url: 'purchase/bank-account/request-link-token',
                method: 'POST',
            }),
        }),
        requestBankAccountFetch: build.query({
            query: () => ({
                url: 'purchase/bank-account/list',
                method: 'GET',
            }),
        }),
        requestBankRegister: build.mutation({
            query: (payload) => ({
                url: 'purchase/bank-account/register',
                method: 'POST',
                body: payload,
            }),
        }),
        requestPaymentCheckout: build.mutation({
            query: (payload) => ({
                url: 'purchase/checkout',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useRequestBankLinkTokenQuery,
    useRequestBankAccountFetchQuery,
    useRequestBankRegisterMutation,
    useRequestPaymentCheckoutMutation,
} = PurchaseServices;
