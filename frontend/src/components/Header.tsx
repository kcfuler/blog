import { Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'login', label: 'Login', path: '/login' },
    { key: 'register', label: 'Register', path: '/register' },
  ];

  return (
    <AntHeader style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        items={menuItems.map((item) => ({
          key: item.key,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
      />
    </AntHeader>
  );
};

export default Header;
