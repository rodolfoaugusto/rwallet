import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
    browserSupportsWebAuthn,
    startAuthentication,
} from '@simplewebauthn/browser';

import {
    Header,
    TextInput,
    LoadingSpin,
    SignInPasskeyButton,
} from '../../components';
import { showToast } from '../../Helpers';
import { AuthActions } from '../../reducers/AuthReducer';
import {
    useLoginMutation,
    useGenerateAuthenticationOptionsQuery,
    useConfirmAuthenticationQuery,
} from '../../services/AuthServices';

const Login = () => {
    const [loginStep, setLoginStep] = useState(1); // TO:DO Validate step entry by API
    const [allowWebAuthn, setAllowWebAuthn] = useState(false);
    const [authenticationData, setAuthenticationData] = useState(null);
    const [selectedPasskey, setSelectedPasskey] = useState(null);
    const {
        handleSubmit,
        control,
        setFocus,
        formState: { isSubmitting, errors },
    } = useForm({ mode: 'onSubmit' });

    const [login] = useLoginMutation();

    const dispatch = useDispatch();

    const onSubmit = async (payload) => {
        try {
            if (loginStep === 1) {
                setLoginStep(2);
                setTimeout(() => {
                    setFocus('password', {
                        shouldSelect: false,
                    });
                }, 100);
                return;
            }

            const response = await login(payload).unwrap();
            dispatch(AuthActions.setAuth(response.data));
        } catch (error) {
            showToast(error?.message, 'error');
        }
    };

    // Check if the browser supports WebAuthn
    useEffect(() => {
        const checkWebAuthn = async () => {
            const isSupported = browserSupportsWebAuthn();
            setAllowWebAuthn(isSupported);
        };

        checkWebAuthn();
    }, []);

    const authenticationOptions = useGenerateAuthenticationOptionsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: false,
        },
    );

    const confirmAuthentication = useConfirmAuthenticationQuery(
        selectedPasskey,
        {
            skip: !selectedPasskey,
            refetchOnMountOrArgChange: false,
        },
    );

    const authenticate = async (data) => {
        try {
            const authentication =
                await startAuthentication(authenticationData);

            setSelectedPasskey(authentication);
        } catch {
            //Bypass Handle error
        }
    };

    useEffect(() => {
        if (authenticationOptions.isSuccess) {
            const { data } = authenticationOptions;
            if (data?.data) {
                setAuthenticationData(data.data);
            }
        }
    }, [authenticationOptions]);

    useEffect(() => {
        if (confirmAuthentication.isSuccess) {
            const { data } = confirmAuthentication;
            if (data?.data) {
                dispatch(AuthActions.setAuth(data.data));
            }
        }
    }, [confirmAuthentication]);

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <Header />
            <div className="mb-auto">
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-5 text-center text-white text-3xl font-bold leading-9 tracking-tight">
                            Enter your credentials
                        </h2>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm bg-blue-950 p-10 rounded-lg shadow-lg hover:shadow-lg">
                        <h2 className="text-white font-semibold text-3xl mb-10">
                            Log in
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit((values) =>
                                onSubmit(values),
                            )}
                        >
                            {loginStep === 1 && (
                                <Controller
                                    name="email"
                                    control={control}
                                    render={(field) => (
                                        <TextInput
                                            {...field}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            label="Email"
                                            type="text"
                                            placeholder="Enter your email"
                                            errors={errors}
                                        />
                                    )}
                                    rules={{
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message:
                                                'Enter a valid email format.',
                                        },
                                        required: 'Email is required.',
                                    }}
                                />
                            )}

                            {loginStep === 2 && (
                                <Controller
                                    name="password"
                                    control={control}
                                    render={(field) => (
                                        <TextInput
                                            {...field}
                                            label="Password"
                                            type="password"
                                            placeholder="Enter your password"
                                            errors={errors}
                                        />
                                    )}
                                    rules={{
                                        required: 'Password is required.',
                                    }}
                                />
                            )}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-pink-500"
                                >
                                    {loginStep === 1 ? (
                                        'CONTINUE'
                                    ) : (
                                        <>
                                            {isSubmitting && <LoadingSpin />}
                                            {isSubmitting
                                                ? 'LOGGING...'
                                                : 'SIGN IN'}
                                        </>
                                    )}
                                </button>
                                {loginStep === 2 && (
                                    <div className="mt-2 flex w-full justify-end">
                                        <button
                                            className="rounded-md mr-2 text-sm underline font-normal text-gray-300/80 hover:text-gray-300"
                                            onClick={() => setLoginStep(1)}
                                        >
                                            Use a different email
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>

                        {allowWebAuthn && (
                            <>
                                <div className="relative flex mt-4 py-1 items-center">
                                    <div className="flex-grow border-t border-gray-400/50"></div>
                                    <span className="flex-shrink mx-4 text-gray-400 text-sm">
                                        OR
                                    </span>
                                    <div className="flex-grow border-t border-gray-400/50"></div>
                                </div>

                                <SignInPasskeyButton
                                    onClick={() => authenticate()}
                                />
                            </>
                        )}

                        <p className="mt-5 text-center text-sm text-gray-300">
                            {"Don't have an account?"}
                            <Link
                                to="/signup"
                                className="ml-1 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
