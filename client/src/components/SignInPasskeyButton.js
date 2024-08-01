import React from 'react';
import PasskeyIcon from './PasskeyIcon';

const SignInPasskeyButton = ({ onClick }) => {
    return (
        <button
            type="submit"
            className="flex mt-4 md:mx-auto lg:max-w-sm justify-center w-full p-2 font-semibold rounded text-white hover:bg-gray-500/40 border-2 border-gray-100/50"
            onClick={onClick}
        >
            <PasskeyIcon />
            Sign in with a passkey
        </button>
    );
};

export default SignInPasskeyButton;
