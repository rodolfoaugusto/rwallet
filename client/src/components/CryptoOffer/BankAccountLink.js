import React, { useCallback, useState, useEffect } from 'react';

import { usePlaidLink } from 'react-plaid-link';

import {
    useRequestBankLinkTokenQuery,
    useRequestBankAccountFetchQuery,
    useRequestBankRegisterMutation,
} from '../../services/PurchaseServices';
import { showToast } from '../../Helpers';
import LoadingSpin from '../LoadingSpin';

const BankAccountLink = ({ onBankAccountLinked, setBankAccounts }) => {
    const [token, setToken] = useState(null);
    const [bankAccountLinked, setBankAccountLinked] = useState(false);

    const getLinkToken = useRequestBankLinkTokenQuery();

    const [setBankAccountRegister] = useRequestBankRegisterMutation();

    const fetchBankAccounts = useRequestBankAccountFetchQuery(undefined, {
        skip: !bankAccountLinked,
    });

    const isOAuthRedirect = window.location.href.includes('?oauth_state_id=');

    useEffect(() => {
        if (isOAuthRedirect) {
            setToken(localStorage.getItem('link_token'));
            return;
        }

        const { data, error } = getLinkToken;

        if (data) {
            const { link_token } = data.data;

            setToken(link_token);

            localStorage.setItem('link_token', link_token);
        }

        if (error) {
            showToast(error?.message, 'error');
        }
    }, [getLinkToken]);

    const onSuccess = useCallback(
        async (publicToken, metadata) => {
            try {
                await setBankAccountRegister({
                    publicToken,
                    metadata,
                }).unwrap();

                showToast('Bank account(s) has been registered.', 'success');
                setBankAccountLinked(true);
                onBankAccountLinked();
            } catch (error) {
                showToast(error, 'error');
            }
        },
        [setBankAccountRegister, onBankAccountLinked],
    );

    const config = {
        token,
        onSuccess,
    };

    if (isOAuthRedirect) {
        config.receivedRedirectUri = window.location.href;
    }

    const {
        open,
        ready,
        // error,
        // exit
    } = usePlaidLink(config);

    useEffect(() => {
        if (isOAuthRedirect && ready) {
            open();
        }
    }, [ready, open, isOAuthRedirect]);

    return isOAuthRedirect ? (
        <></>
    ) : (
        <div className="mt-14 md:mx-auto md:w-full lg:max-w-3xl text-center">
            <button
                onClick={() => open()}
                disabled={!ready}
                type="submit"
                className="md:mx-auto lg:max-w-sm rounded-md px-5 py-3 font-semibold leading-6 text-white text-lg shadow-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-pink-500 animate-pulse"
            >
                Connect a bank account
            </button>
        </div>
    );
};

export default BankAccountLink;
