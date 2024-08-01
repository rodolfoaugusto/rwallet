import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

const Input = (props) => {
    const {
        field,
        label,
        type,
        placeholder,
        autoComplete,
        autoCorrect,
        errors,
    } = props;
    return (
        <div>
            {label && (
                <label
                    htmlFor={field.name}
                    className="block text-md text-gray-300 font-medium leading-6"
                >
                    {label}
                </label>
            )}
            <div className="mt-1">
                <input
                    autoComplete={autoComplete}
                    autoCorrect={autoCorrect}
                    placeholder={placeholder}
                    className="blocks w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                    type={type}
                    id={field.name}
                    {...field}
                />
                {errors && (
                    <ErrorMessage
                        errors={errors}
                        name={field.name}
                        render={({ message }) => (
                            <span className="text-pink-100 text-sm antialiased underline decoration-pink-500">
                                {message}
                            </span>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default Input;
