import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Dropdown from './Dropdown';
import Input from './Input';
import Select from './Select';

import { LoadingSpin } from '../../components';
import { handleFormError, showToast } from '../../Helpers';
import { useRequestPaymentCheckoutMutation } from '../../services/PurchaseServices';

const BuyCrypto = ({ bankAccounts, updateBalance, price }) => {
    const [amount, setAmount] = useState(0);

    const {
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
        setError,
        setValue,
        reset,
    } = useForm({ mode: 'onSubmit' });

    const [paymentCheckout] = useRequestPaymentCheckoutMutation();

    const onSubmit = async (payload) => {
        try {
            await paymentCheckout(payload).unwrap();

            showToast(
                'Transaction succeed. BTC added to your balance.',
                'success',
            );

            // reset form
            setAmount(0);

            reset({
                price: '',
                amount: '',
                bankAccount: '',
            });

            updateBalance();
        } catch (error) {
            handleFormError(error, setError);
        }
    };

    return (
        <div className="bg-gradient-to-t from-blue-900 p-4 rounded-lg">
            <h2 className="text-gray-300 text-2xl mb-4 font-bold">
                Buy Bitcoin
            </h2>
            <form
                className="space-y-6"
                onSubmit={handleSubmit((values) => onSubmit(values))}
            >
                <Controller
                    name="price"
                    control={control}
                    render={(field) => (
                        <Dropdown
                            {...field}
                            label="Spend"
                            type="number"
                            placeholder="Enter amount"
                            errors={errors}
                            price={price}
                            setAmount={setAmount}
                            setValue={setValue}
                        />
                    )}
                    rules={{
                        validate: (val) => {
                            if (val < 10 || isNaN(val) || val > 1000) {
                                return 'Minimum spend is 10 USD.';
                            }
                        },
                        required: 'Spend amount is required.',
                    }}
                />
                <Controller
                    name="amount"
                    control={control}
                    render={(field) => (
                        <Input
                            {...field}
                            label="Receive"
                            type="text"
                            value={`${amount} BTC`}
                            readOnly
                            placeholder="0.00 BTC"
                        />
                    )}
                    rules={{ required: 'Receive amount is required.' }}
                />
                <Controller
                    name="bankAccount"
                    control={control}
                    render={(field) => (
                        <Select {...field} errors={errors} label="Pay with">
                            {bankAccounts.map((account) => (
                                <option value={account.id} key={account.id}>
                                    {account.bankName} - {account.name} (**
                                    {account.accountMask})
                                </option>
                            ))}
                        </Select>
                    )}
                    rules={{ required: 'Payment method is required.' }}
                />
                <button
                    type="submit"
                    className="flex md:mx-auto lg:max-w-sm justify-center w-full p-2 font-semibold rounded text-white bg-yellow-600 hover:bg-yellow-500"
                >
                    {isSubmitting && <LoadingSpin />}
                    {isSubmitting ? 'Confirming...' : 'Buy BTC'}
                </button>
                <span
                    className="text-xs block w-full text-right text-gray-200"
                    style={{ marginTop: '5px', marginBottom: '0px' }}
                >
                    Taxes included.
                </span>
            </form>
        </div>
    );
};

export default BuyCrypto;
