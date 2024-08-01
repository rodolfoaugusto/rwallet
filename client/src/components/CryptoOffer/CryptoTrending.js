import React from 'react';

const CryptoTrending = ({ balance }) => {
    return (
        <div className="bg-gray-900 mt-2 p-4 rounded-lg">
            <h2 className="text-gray-300 text-2xl mb-4 font-bold ">Trending</h2>

            <div className="flex justify-between text-white mb-2 bg-gray-800 p-2 rounded animate-pulse">
                <span className="rounded pr-1 pl-1 bg-yellow-600 text-center font-semibold text-gray-800">
                    BTC
                </span>
                <span>${balance.price || 0}</span>
                <span className="text-green-500">+0.15%</span>
            </div>
        </div>
    );
};

export default CryptoTrending;
