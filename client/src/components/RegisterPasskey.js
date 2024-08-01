import React, { useState, useEffect } from 'react';
import PasskeyIcon from './PasskeyIcon';

import { startRegistration } from '@simplewebauthn/browser';
import {
    useGenerateRegistrationOptionsQuery,
    useConfirmRegistrationQuery,
} from '../services/AuthServices';
import { showToast } from '../Helpers';
import { useDispatch } from 'react-redux';
import { AuthActions } from '../reducers/AuthReducer';

const RegisterPasskey = () => {
    const dispatch = useDispatch();
    const [publicKey, setPublicKey] = useState(false);
    const [passkey, setPasskey] = useState(false);

    const generateRegistrationOptions = useGenerateRegistrationOptionsQuery(
        undefined,
        {
            skip: !publicKey,
            refetchOnMountOrArgChange: true,
        },
    );

    const confirmRegistration = useConfirmRegistrationQuery(passkey, {
        skip: !passkey,
    });

    const handleSetPasskey = () => {
        if (publicKey) {
            generateRegistrationOptions.refetch();
        } else {
            setPublicKey(true);
        }
    };

    useEffect(() => {
        const { data, error } = generateRegistrationOptions;

        const startWebAuthnRegistration = async (data) => {
            try {
                const registrationResponse = await startRegistration(
                    data.publicKey,
                );

                setPasskey({
                    ...registrationResponse,
                    webauthnId: data.publicKey.user.id,
                });
            } catch (error) {
                showToast('Passkey cannot be registered.', 'error');
                setPublicKey(false);
            }
        };

        if (data) {
            startWebAuthnRegistration(data.data);
        }

        if (error) {
            showToast(
                'Passkey is not available, please try again later.',
                'error',
            );
        }
    }, [generateRegistrationOptions]);

    useEffect(() => {
        const { data, error } = confirmRegistration;

        if (data) {
            showToast(
                'Passkey has been registered! Please, log in again.',
                'success',
            );

            dispatch(AuthActions.logout());
        }

        if (error) {
            showToast('Passkey cannot be registered.', 'error');
            setPublicKey(false);
        }
    }, [confirmRegistration]);

    return (
        <>
            <div className="md:mx-auto md:w-full md:max-w-3x1">
                <h2 className="mt-20 text-center text-white text-4xl font-bold leading-9 tracking-tight">
                    <span className="underline underline-offset-8">
                        Before start
                    </span>
                    {' improve the security'}
                </h2>
            </div>
            <div className="p-2 mt-10 md:mx-auto md:w-full lg:max-w-3xl">
                <button
                    type="button"
                    onClick={() => handleSetPasskey()}
                    className="flex mt-4 md:mx-auto lg:max-w-sm justify-center w-full p-2 font-semibold rounded text-white hover:bg-gray-500/40 border-2 border-gray-100/50"
                >
                    <PasskeyIcon />
                    Create a passkey
                </button>
            </div>
        </>
    );
};

export default RegisterPasskey;
