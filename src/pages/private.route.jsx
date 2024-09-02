import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { Button, Result } from 'antd';

const PrivateRoute = (props) => {
    const { user } = useContext(AuthContext);

    if (user && user.id) {
        return <>{props.children}</>;
    }
    // return <Navigate to={'/login'} replace />;
    return (
        <Result
            status="403"
            title="Unauthorized"
            subTitle="You must log in to access this page."
            extra={
                <Button type="primary">
                    <Link to="/">
                        <span>Back to homepage</span>
                    </Link>
                </Button>
            }
        />
    );
};

export default PrivateRoute;
