import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { Header, TextInput, LoadingSpin } from '../../components';
import { handleFormError } from '../../Helpers';
import { AuthActions } from '../../reducers/AuthReducer';
import { useRegisterMutation } from '../../services/AuthServices';

const Signup = () => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
        setError,
        watch,
    } = useForm({ mode: 'onSubmit' });

    const [register] = useRegisterMutation();

    const dispatch = useDispatch();

    const onSubmit = async (payload) => {
        try {
            const response = await register(payload).unwrap();
            dispatch(AuthActions.setAuth(response.data));
        } catch (error) {
            handleFormError(error, setError);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <Header />
            <div className="mb-auto">
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-5 text-center text-white text-3xl font-bold leading-9 tracking-tight">
                            Start your crypto journey
                        </h2>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm bg-blue-950 p-10 rounded-lg shadow-lg hover:shadow-lg">
                        <h2 className="text-white font-semibold text-3xl mb-10">
                            Registration
                        </h2>
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit((values) =>
                                onSubmit(values),
                            )}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={(field) => (
                                    <TextInput
                                        {...field}
                                        label="Name"
                                        type="text"
                                        placeholder="Enter your name"
                                        errors={errors}
                                    />
                                )}
                                rules={{ required: 'Name is required.' }}
                            />

                            <Controller
                                name="email"
                                control={control}
                                render={(field) => (
                                    <TextInput
                                        {...field}
                                        label="Email"
                                        type="text"
                                        placeholder="Enter your email"
                                        errors={errors}
                                    />
                                )}
                                rules={{
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: 'Enter a valid email format.',
                                    },
                                    required: 'Email is required.',
                                }}
                            />

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
                                    pattern: {
                                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                                        message:
                                            'Password must contain at least 8 characters, including uppercase, lowercase, and numbers.',
                                    },
                                    required: 'Password is required.',
                                }}
                            />

                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={(field) => (
                                    <TextInput
                                        {...field}
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Enter your password again"
                                        errors={errors}
                                    />
                                )}
                                rules={{
                                    validate: (val) => {
                                        if (watch('password') != val) {
                                            return 'Passwords do not match.';
                                        }
                                    },
                                    required: 'Confirm Password is required.',
                                }}
                            />

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-pink-500"
                                >
                                    {isSubmitting && <LoadingSpin />}
                                    {isSubmitting ? 'SUBMITTING...' : 'SIGN UP'}
                                </button>
                            </div>
                        </form>

                        <p className="mt-5 text-center text-sm text-gray-300">
                            Already have an account?
                            <Link
                                to="/login"
                                className="ml-1 font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
