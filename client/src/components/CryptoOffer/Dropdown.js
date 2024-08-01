import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessage } from '@hookform/error-message';

const Dropdown = (props) => {
    const [fee, setFee] = useState(0);

    const {
        field,
        label,
        type,
        placeholder,
        errors,
        setAmount,
        setValue,
        price,
    } = props;

    useEffect(() => {
        const calculateBitcoinTransactionFee = async () => {
            try {
                // Fetch the current fee rate
                const response = await axios.get(
                    'https://mempool.space/api/v1/fees/recommended',
                );
                const feeRate = response.data.fastestFee; // satoshis per byte

                // Estimate the transaction size (e.g., 250 bytes for a simple transaction)
                const transactionSize = 250; // in bytes

                // calculate the fee
                const feeInSatoshis = feeRate * transactionSize;
                const feeInBitcoin = feeInSatoshis / 100000000; // convert satoshis to Bitcoin

                setFee(feeInBitcoin);
            } catch (error) {
                console.error('Error fetching fee rate:', error);
            }
        };

        calculateBitcoinTransactionFee();
    }, []);

    const recalculateReceiveAmount = (currencyValue) => {
        const bitcoinPrice = parseFloat(price); // in USD
        const bitcoinAmount = currencyValue / bitcoinPrice;
        const bitcoinAmountAfterFee = parseFloat(
            (bitcoinAmount - fee).toFixed(8),
        );

        if (bitcoinAmountAfterFee < 0) {
            setAmount(0);
            return;
        }

        if (currencyValue < 10) return;

        setValue('amount', bitcoinAmountAfterFee);
        setAmount(bitcoinAmountAfterFee);
    };

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-md text-gray-100 mb-2">
                    {label}
                </label>
            )}
            <div className="flex items-center">
                <div
                    id="currency-icon"
                    className="select-none flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-lg font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none rounded-s-lg focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                >
                    <svg
                        fill="none"
                        aria-hidden="true"
                        className="h-4 w-4 me-2"
                        viewBox="0 0 20 15"
                    >
                        <rect
                            width="19.6"
                            height="14"
                            y=".5"
                            fill="#fff"
                            rx="2"
                        />
                        <mask
                            id="a"
                            style={{ maskType: 'luminance' }}
                            width="20"
                            height="15"
                            x="0"
                            y="0"
                            maskUnits="userSpaceOnUse"
                        >
                            <rect
                                width="19.6"
                                height="14"
                                y=".5"
                                fill="#fff"
                                rx="2"
                            />
                        </mask>
                        <g mask="url(#a)">
                            <path
                                fill="#D02F44"
                                fillRule="evenodd"
                                d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z"
                                clipRule="evenodd"
                            />
                            <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                            <g filter="url(#filter0_d_343_121520)">
                                <path
                                    fill="url(#paint0_linear_343_121520)"
                                    fillRule="evenodd"
                                    d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                                    clipRule="evenodd"
                                />
                            </g>
                        </g>
                        <defs>
                            <linearGradient
                                id="paint0_linear_343_121520"
                                x1=".933"
                                x2=".933"
                                y1="1.433"
                                y2="6.1"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#fff" />
                                <stop offset="1" stopColor="#F0F0F0" />
                            </linearGradient>
                            <filter
                                id="filter0_d_343_121520"
                                width="6.533"
                                height="5.667"
                                x=".933"
                                y="1.433"
                                colorInterpolationFilters="sRGB"
                                filterUnits="userSpaceOnUse"
                            >
                                <feFlood
                                    floodOpacity="0"
                                    result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                    in="SourceAlpha"
                                    result="hardAlpha"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                />
                                <feOffset dy="1" />
                                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                <feBlend
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_343_121520"
                                />
                                <feBlend
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_343_121520"
                                    result="shape"
                                />
                            </filter>
                        </defs>
                    </svg>
                    USD{' '}
                </div>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        placeholder={placeholder}
                        className="block p-2.5 w-full z-20 ps-10 text-lg text-gray-900 focus:outline-none bg-gray-50 rounded-e-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-e-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-semibold"
                        type={type}
                        id={field.name}
                        {...field}
                        onChange={(e) => {
                            //round value
                            e.target.value = Math.round(e.target.value);
                            if (e.target.value > 1000) e.target.value = 1000;
                            recalculateReceiveAmount(e.target.value);
                            setValue(field.name, parseInt(e.target.value, 10));
                            e.preventDefault();
                        }}
                    />
                </div>
            </div>
            <div className="mt-1">
                {errors && (
                    <ErrorMessage
                        errors={errors}
                        name={field.name}
                        render={({ message }) => (
                            <span className="text-pink-100 text-sm antialiased underline decoration-pink-500 bg-red-900">
                                {message}
                            </span>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default Dropdown;
