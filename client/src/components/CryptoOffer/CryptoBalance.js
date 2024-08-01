import React from 'react';
import { showToast } from '../../Helpers';

const CryptoBalance = ({ balance }) => {
    return (
        <div className="bg-gray-900 mt-2 p-4 rounded-lg">
            <h2 className="text-gray-300 text-2xl mb-4 font-bold ">
                Your balance
            </h2>
            <div className="flex justify-between text-white bg-gray-800 p-2 rounded-t">
                <span className="rounded pr-1 pl-1 bg-yellow-600 text-center font-semibold text-gray-800">
                    BTC
                </span>
                <span>${balance.profit}</span>
                <span className="text-gray-500">{balance.amount}</span>
            </div>

            <div
                className="flex justify-center text-white bg-gray-800 p-2 text-gray-500 rounded-b-md cursor-pointer hover:text-black hover:bg-yellow-600 hover:underline"
                onClick={() => {
                    navigator.clipboard.writeText(balance.address);
                    showToast('Address copied to clipboard!', 'success');
                }}
            >
                <span className="text-sm hover:underline">
                    Address to clipboard
                </span>
            </div>
        </div>
    );
};

export default CryptoBalance;
