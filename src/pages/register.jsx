import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { registerUserAPI } from '../services/api.service';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const res = await registerUserAPI(
            values.fullName,
            values.email,
            values.password,
            values.phone
        );
        if (res.data) {
            notification.success({
                message: 'Registered user',
                description: 'Đăng ký user thành công',
            });
            navigate('/login');
        } else {
            notification.error({
                message: 'Error register user',
                description: JSON.stringify(res.message),
            });
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{
                margin: '30px',
            }}
        >
            <h1 style={{ textAlign: 'center' }}>Đăng ký tài khoản</h1>
            <Row justify={'center'}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your full name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={'center'}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={'center'}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={'center'}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                pattern: new RegExp(/^\d+$/g),
                                message: 'Wrong format!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={'center'}>
                <Col xs={24} md={8}>
                    <Button type="primary" onClick={() => form.submit()}>
                        Register
                    </Button>
                    <Divider />
                    <div>
                        Đã có tài khoản?
                        <Link to={'/login'}>Đăng nhập tại đây</Link>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default RegisterPage;
