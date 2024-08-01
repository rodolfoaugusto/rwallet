import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrypt } from '../Helpers';
import { AuthActions } from '../reducers/AuthReducer';
import { useValidateTokenQuery } from '../services/AuthServices';

const useAuthMiddleware = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user);
    const decryptedUser = user ? decrypt({ data: user }) : null;

    const validate = useValidateTokenQuery(undefined, {
        skip: !user,
        keepUnusedDataFor: 0,
    });

    useEffect(() => {
        const { data, error } = validate;

        if (error) {
            dispatch(AuthActions.logout());
        }

        if (data) {
            dispatch(AuthActions.setAuth(data.data));
        }
    }, [validate, dispatch]);

    return decryptedUser;
};

export default useAuthMiddleware;
