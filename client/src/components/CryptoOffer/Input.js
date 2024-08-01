import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

const Input = (props) => {
    const { field, label, type, placeholder, readOnly, value, errors } = props;
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={field.name}
                    className="block text-md text-gray-100 mb-2"
                >
                    {label}
                </label>
            )}
            <input
                placeholder={placeholder}
                className="w-full p-2 rounded-md bg-gray-800 text-lg text-white w-full p-2 shadow-sm focus:outline-none font-semibold"
                type={type}
                id={field.name}
                {...field}
                readOnly={readOnly}
                value={value}
            />
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

export default Input;
