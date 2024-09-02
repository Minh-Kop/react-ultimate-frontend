import { useEffect, useState } from 'react';
import { updateUserAPI } from '../../services/api.service';
import { Input, Modal, notification } from 'antd';

const UpdateUserModal = (props) => {
    const {
        isModalUpdateOpen,
        setIsModalUpdateOpen,
        dataUpdate,
        setDataUpdate,
        loadUser,
    } = props;

    const [id, setId] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate._id);
            setFullName(dataUpdate.fullName);
            setPhone(dataUpdate.phone);
        }
    }, [dataUpdate]);

    const handleSubmitBtn = async () => {
        const res = await updateUserAPI(id, fullName, phone);
        if (res.data) {
            notification.success({
                message: 'Updated user',
                description: 'Cập nhật user thành công',
            });
            await loadUser();
            resetAndCloseModal();
        } else {
            notification.error({
                message: 'Error update user',
                description: JSON.stringify(res.message),
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update User"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            okText={'Save'}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                <div>
                    <span>Id</span>
                    <Input value={id} disabled />
                </div>
                <div>
                    <span>Full Name</span>
                    <Input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
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
    );
};

export default UpdateUserModal;
