import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AuthActions } from '../reducers/AuthReducer';
import { decrypt } from 'Helpers';

const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => decrypt({ data: state.auth?.user }));

    const logout = () => {
        dispatch(AuthActions.logout());
    };

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] dark:bg-slate-900/75">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link
                    to="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse text-slate-100 dm-sans-light"
                >
                    {process.env.REACT_APP_NAME}
                </Link>
                <div
                    className="hidden w-full md:block md:w-auto"
                    id="navbar-default"
                >
                    {user && (
                        <button
                            type="button"
                            className="p-1 pl-2 pr-2 rounded text-white font-semibold text-sm bg-indigo-900 text-gray-50 hover:bg-indigo-500"
                            onClick={logout}
                        >
                            Disconnect
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default memo(Header);
