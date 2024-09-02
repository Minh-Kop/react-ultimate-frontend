import { Button, Input, Modal, notification } from 'antd';
import { useState } from 'react';
import { createUserAPI } from '../../services/api.service';

const UserForm = (props) => {
    const { loadUser } = props;

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmitBtn = async () => {
        const res = await createUserAPI(fullName, email, password, phone);
        if (res.data) {
            notification.success({
                message: 'Created user',
                description: 'Tạo user thành công',
            });
            await loadUser();
            resetAndCloseModal();
        } else {
            notification.error({
                message: 'Error create user',
                description: JSON.stringify(res.message),
            });
        }
    };

    const resetAndCloseModal = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setIsModalOpen(false);
    };

    return (
        <div className="user-form" style={{ margin: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Table Users</h1>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create User
                </Button>
            </div>

            <Modal
                title="Create User"
                open={isModalOpen}
                onOk={handleSubmitBtn}
                onCancel={resetAndCloseModal}
                maskClosable={false}
                okText={'Create'}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <div>
                        <span>Full Name</span>
                        <Input
                            value={fullName}
                            onChange={(event) =>
                                setFullName(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <span>Email</span>
                        <Input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <span>Password</span>
                        <Input.Password
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <span>Phone Number</span>
                        <Input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserForm;
