import { createBrowserHistory } from 'history';
import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from './Store';
import CryptoJS from 'crypto-js';

// Axios instance
export const apiRequest = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

apiRequest.interceptors.request.use(
    async (requestConfig) => {
        const config = { ...requestConfig };

        const decryptedUser = store.getState()?.auth?.user
            ? decrypt({ data: store.getState()?.auth?.user })
            : null;

        const token = decryptedUser?.accessToken || '';

        if (token) config.headers.authorization = `Bearer ${token}`;

        config.data = { payload: encrypt(config.body) };

        return config;
    },
    (err) => {
        return Promise.reject(err);
    },
);

apiRequest.interceptors.response.use(
    (responseConfig) => {
        const response = { ...responseConfig };

        if (response.data) {
            response.data.data = decrypt(response.data);
        }

        return response.data;
    },
    (err) => {
        try {
            if (err.response.data) {
                err.response.data.data = decrypt(err.response.data);
            }

            return Promise.reject(err.response.data);
        } catch (error) {
            return Promise.reject({ message: 'No response from server.' });
        }
    },
);

// Encrypt and Decrypt
export const encrypt = (data) => {
    try {
        if (!data) return data;

        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            process.env.REACT_APP_ENCRYPTION_SECRET_KEY,
        ).toString();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

export const decrypt = (body) => {
    try {
        if (!body || !body.data) return undefined;

        const bytes = CryptoJS.AES.decrypt(
            body.data,
            process.env.REACT_APP_ENCRYPTION_SECRET_KEY,
        );

        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        showToast(error.message, 'error');
    }
};

// Misc
export const history = createBrowserHistory();

export const showToast = (message, type) => {
    if (type === 'error')
        toast.error(message, {
            position: 'top-center',
        });
    if (type === 'success')
        toast.success(message, {
            position: 'top-center',
        });
};

export const handleFormError = (error, setError) => {
    if (typeof error.data == 'object') {
        Object.keys(error.data).forEach((field) => {
            setError(field, {
                type: 'server',
                message: error.data[field],
            });
        });
    } else {
        showToast(error?.message || 'An error occurred', 'error');
    }
};

// Browser sesion Storage
export const getBrowserSessionStorage = () => {
    const key = 'session_id';
    const value = CryptoJS.SHA256(Date.now().toString()).toString();

    let storage = localStorage.getItem(key);

    if (!storage) {
        storage = localStorage.setItem(key, value);
    }

    return storage;
};

getBrowserSessionStorage();
