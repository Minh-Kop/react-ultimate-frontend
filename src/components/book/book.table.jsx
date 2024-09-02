import { useCallback, useEffect, useState } from 'react';
import { deleteBookAPI, fetchAllBookAPI } from '../../services/api.service';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Table } from 'antd';
import BookDetail from './book.detail';
import CreateBookControl from './create.book.control';
import CreateBookUncontrol from './create.book.uncontrol';
import UpdateBookControl from './update.book.control';
import UpdateBookUncontrol from './update.book.uncontrol';

const BookTable = () => {
    const [dataBook, setDataBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [loadingTable, setLoadingTable] = useState(false);

    const loadBook = useCallback(async () => {
        setLoadingTable(true);

        const res = await fetchAllBookAPI(current, pageSize);
        if (!res.data) {
            return;
        }
        const { meta, result } = res.data;
        setDataBook(result);
        setCurrent(+meta.current);
        setPageSize(+meta.pageSize);
        setTotal(+meta.total);

        setLoadingTable(false);
    }, [current, pageSize]);

    useEffect(() => {
        loadBook();
    }, [loadBook]);

    const handleDeleteBook = async (id) => {
        const res = await deleteBookAPI(id);
        if (res.data) {
            notification.success({
                message: 'Deleted book',
                description: 'Xóa book thành công',
            });
            await loadBook();
        } else {
            notification.error({
                message: 'Error delete book',
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
            title: 'Tiêu đề',
            dataIndex: 'mainText',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (text, record, index, action) => {
                // console.log({ text, record, index, action });
                if (text) {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(text);
                }
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
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
                        title="Xóa book"
                        description="Bạn có chắc muốn xóa book này?"
                        onConfirm={() => handleDeleteBook(record._id)}
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

    return (
        <>
            <div
                style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <h1>Table Book</h1>
                <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                    Create Book
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataBook}
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
                loading={loadingTable}
            />

            <BookDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
            />

            {/* <CreateBookControl
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                loadBook={loadBook}
            /> */}
            <CreateBookUncontrol
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                loadBook={loadBook}
            />

            {/* <UpdateBookControl
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                loadBook={loadBook}
            /> */}
            <UpdateBookUncontrol
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                loadBook={loadBook}
            />
        </>
    );
};

export default BookTable;
