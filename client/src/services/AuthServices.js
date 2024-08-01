import { api } from './api';
import { getBrowserSessionStorage } from '../Helpers';

export const AuthServices = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (payload) => ({
                url: 'auth/login',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: [{ type: 'Auth', id: 'STATUS' }],
        }),
        register: build.mutation({
            query: (payload) => ({
                url: 'auth/signup',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: [{ type: 'Auth', id: 'STATUS' }],
        }),
        generateRegistrationOptions: build.query({
            query: () => ({
                url: 'auth/generate-registration-options',
                method: 'GET',
                headers: {
                    'x-session-id': getBrowserSessionStorage(),
                },
            }),
        }),
        confirmRegistration: build.query({
            query: (payload) => ({
                url: 'auth/confirm-registration',
                method: 'POST',
                body: payload,
                headers: {
                    'x-session-id': getBrowserSessionStorage(),
                },
            }),
        }),
        generateAuthenticationOptions: build.query({
            query: () => ({
                url: 'auth/generate-authentication-options',
                method: 'GET',
                headers: {
                    'x-session-id': getBrowserSessionStorage(),
                },
            }),
        }),
        confirmAuthentication: build.query({
            query: (payload) => ({
                url: 'auth/confirm-authentication',
                method: 'POST',
                body: payload,
                headers: {
                    'x-session-id': getBrowserSessionStorage(),
                },
            }),
        }),
        validateToken: build.query({
            query: () => 'auth/validate-token',
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGenerateRegistrationOptionsQuery,
    useConfirmRegistrationQuery,
    useGenerateAuthenticationOptionsQuery,
    useConfirmAuthenticationQuery,
    useValidateTokenQuery,
} = AuthServices;
