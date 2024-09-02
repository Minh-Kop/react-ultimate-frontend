import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AliwangwangOutlined,
    AuditOutlined,
    HomeOutlined,
    LoginOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { logoutAPI } from '../../services/api.service';

const Header = () => {
    const [current, setCurrent] = useState('home');
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('>>> check location: ', location);
        if (location && location.pathname) {
            const allRoutes = ['users', 'books'];
            const currentRoute = allRoutes.find(
                (item) => `/${item}` === location.pathname
            );
            if (currentRoute) {
                setCurrent(currentRoute);
            } else {
                setCurrent('home');
            }
        }
    }, [location]);

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            localStorage.removeItem('access_token');
            setUser({
                email: '',
                phone: '',
                fullName: '',
                role: '',
                avatar: '',
                id: '',
            });
            message.success('Log out successfully!');
            navigate('/');
        }
    };

    const items = [
        {
            label: <Link to={'/'}>Home</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/users'}>Users</Link>,
            key: 'users',
            icon: <UsergroupAddOutlined />,
        },
        {
            label: <Link to={'/books'}>Books</Link>,
            key: 'books',
            icon: <AuditOutlined />,
        },
        ...(!user.id
            ? [
                  {
                      label: <Link to={'/login'}>Đăng nhập</Link>,
                      key: 'login',
                      icon: <LoginOutlined />,
                  },
              ]
            : [
                  {
                      label: `Welcome ${user.fullName}`,
                      key: 'settings',
                      icon: <AliwangwangOutlined />,
                      children: [
                          {
                              label: (
                                  <span onClick={handleLogout}>Đăng xuất</span>
                              ),
                              key: 'logout',
                          },
                      ],
                  },
              ]),
    ];

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

export default Header;
