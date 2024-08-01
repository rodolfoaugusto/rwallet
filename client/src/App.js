import React, { Suspense, lazy, Profiler } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import { history } from './Helpers';
import { store, persistor } from './Store';
import useAuthMiddleware from './hooks/useAuthMiddleware';
import Loading from './pages/Loading';

const Home = lazy(() => import('./pages/Home'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Login = lazy(() => import('./pages/auth/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AuthRoute = ({ children }) => {
    const user = useAuthMiddleware();
    return user ? <Navigate to="/" /> : children;
};

AuthRoute.propTypes = {
    children: PropTypes.element,
};

const PrivateRoute = ({ children }) => {
    const user = useAuthMiddleware();
    return user ? children : <Navigate to={{ pathname: '/login' }} />;
};

PrivateRoute.propTypes = {
    children: PropTypes.element,
};

const AppRoutes = () => {
    return (
        <Router history={history}>
            <Routes>
                <Route
                    exact={true}
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    exact={true}
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    exact={true}
                    path="/signup"
                    element={
                        <AuthRoute>
                            <Signup />
                        </AuthRoute>
                    }
                />
                <Route exact={true} path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Profiler id="App">
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <AppRoutes />
                        <ToastContainer />
                    </PersistGate>
                </Provider>
            </Profiler>
        </Suspense>
    );
};

export default App;
