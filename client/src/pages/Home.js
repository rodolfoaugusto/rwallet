import React from 'react';
import { useSelector } from 'react-redux';
import { Header, CryptoOffer, RegisterPasskey } from '../components';
import { decrypt } from 'Helpers';

const Home = () => {
    const { security } = useSelector((state) =>
        decrypt({ data: state.auth?.user }),
    );

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <Header />
            <div className="mb-auto">
                {!security ? <RegisterPasskey /> : <CryptoOffer />}
            </div>
        </div>
    );
};

export default Home;
