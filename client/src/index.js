import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

if (process.env.REACT_APP_DEBUG === 'false') {
    // console.log = function () {};
    console.error = function () {};
    console.warn = function () {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
