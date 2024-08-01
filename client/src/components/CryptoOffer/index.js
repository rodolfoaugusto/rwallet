import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BuyCrypto from './BuyCrypto';
import CryptoTrending from './CryptoTrending';
import CryptoBalance from './CryptoBalance';
import BankAccountLink from './BankAccountLink';

import { AuthActions } from '../../reducers/AuthReducer';
import { decrypt, showToast } from '../../Helpers';
import { Skeleton, LoadingSpin } from '../../components';
import { useRequestBankAccountFetchQuery } from '../../services/PurchaseServices';
import { useBalanceQuery } from '../../services/NetworkServices';

const CryptoOffer = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => decrypt({ data: state.auth?.user }));
    const [title, setTitle] = useState('Home');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [balance, setBalance] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBankAccounts = useRequestBankAccountFetchQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const fetchBalance = useBalanceQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        const { data } = fetchBankAccounts;

        if (data && data.data.length > 0) {
            setTitle('Buy Bitcoin with the best rate');
            setBankAccounts(data.data);
        } else {
            setTitle('Start connecting your bank account');
        }

        setLoading(false);
    }, [fetchBankAccounts, bankAccounts]);

    useEffect(() => {
        const { data, error } = fetchBalance;

        if (data && data.data && data.data.address) {
            setBalance(data.data);
        }

        if (error) {
            showToast(error?.message, 'error');
            dispatch(AuthActions.logout());
        }
    }, [fetchBalance, balance]);

    const handleBankAccountLinked = () => {
        fetchBankAccounts.refetch(); // Trigger a re-fetch of bank accounts when a new bank account is linked
    };

    const handleBalanceLinked = () => {
        fetchBalance.refetch();
    };

    return (
        <>
            {loading ? (
                <Skeleton />
            ) : (
                <>
                    {user && (
                        <>
                            <div className="md:mx-auto md:w-full md:max-w-3x1">
                                <h2 className="mt-20 text-center text-white text-4xl font-bold leading-9 tracking-tight">
                                    <span className="underline underline-offset-8">
                                        {title.slice(0, 5)}
                                    </span>
                                    {title.slice(5)}
                                </h2>
                            </div>
                            <div className="mt-10 md:mx-auto md:w-full lg:max-w-3xl">
                                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-1 gap-1">
                                        {bankAccounts &&
                                            bankAccounts.length > 0 && (
                                                <CryptoTrending
                                                    balance={balance}
                                                />
                                            )}
                                        {balance ? (
                                            <CryptoBalance balance={balance} />
                                        ) : (
                                            <div className="flex mt-10 justify-center text-white">
                                                <LoadingSpin />
                                            </div>
                                        )}
                                    </div>
                                    {bankAccounts && bankAccounts.length > 0 ? (
                                        <BuyCrypto
                                            bankAccounts={bankAccounts}
                                            updateBalance={handleBalanceLinked}
                                            price={balance?.price}
                                        />
                                    ) : (
                                        <BankAccountLink
                                            onBankAccountLinked={
                                                handleBankAccountLinked
                                            }
                                            setBankAccounts={setBankAccounts}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default CryptoOffer;
