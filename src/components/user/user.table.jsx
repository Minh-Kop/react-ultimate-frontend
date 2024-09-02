import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Table } from 'antd';
import UpdateUserModal from './update.user.modal';
import { useState } from 'react';
import ViewUserDetail from './view.user.detail';
import { deleteUserAPI } from '../../services/api.service';

const UserTable = (props) => {
    const {
        dataUsers,
        loadUser,
        current,
        pageSize,
        total,
        setCurrent,
        setPageSize,
    } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const columns = [
        {
            title: 'Order',
            render: (_, record, index) => {
                return <>{index + 1 + (current - 1) * pageSize}</>;
            },
        },
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_, record) => (
                <>
                    <a
                        href="#!"
                        onClick={() => {
                            setDataDetail(record);
                            setIsDetailOpen(true);
                        }}
                    >
                        {record._id}
                    </a>
                </>
            ),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <EditOutlined
                        style={{ cursor: 'pointer', color: 'orange' }}
                        onClick={() => {
                            setDataUpdate(record);
                            setIsModalUpdateOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Xóa user"
                        description="Bạn có chắc muốn xóa user này?"
                        onConfirm={() => handleDeleteUser(record._id)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined
                            style={{ cursor: 'pointer', color: 'red' }}
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const handleDeleteUser = async (id) => {
        const res = await deleteUserAPI(id);
        if (res.data) {
            notification.success({
                message: 'Deleted user',
                description: 'Xóa user thành công',
            });
            await loadUser();
        } else {
            notification.error({
                message: 'Error delete user',
                description: JSON.stringify(res.message),
            });
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (!pagination) {
            return;
        }
        if (pagination.current !== +current) {
            return setCurrent(pagination.current);
        }
        if (pagination.pageSize !== +pageSize) {
            return setPageSize(pagination.pageSize);
        }
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataUsers}
                rowKey={'_id'}
                pagination={{
                    current,
                    pageSize,
                    showSizeChanger: true,
                    total,
                    showTotal: (total, range) => {
                        return (
                            <>
                                {range[0]}-{range[1]} trên {total} rows
                            </>
                        );
                    },
                }}
                onChange={onChange}
            />
            <UpdateUserModal
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadUser={loadUser}
            />
            <ViewUserDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                loadUser={loadUser}
            />
        </>
    );
};

export default UserTable;
