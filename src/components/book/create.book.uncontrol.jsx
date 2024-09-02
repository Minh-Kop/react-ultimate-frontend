import { Form, Input, InputNumber, Modal, notification, Select } from 'antd';
import { useState } from 'react';
import { createBookAPI, uploadFileAPI } from '../../services/api.service';

const CreateBookUncontrol = (props) => {
    const { isCreateOpen, setIsCreateOpen, loadBook } = props;

    const [form] = Form.useForm();

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        const file = event.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmitBtn = async (values) => {
        if (!selectedFile) {
            return notification.error({
                message: 'Error create book',
                description: 'Vui lòng upload ảnh thumbnail',
            });
        }

        const resUpload = await uploadFileAPI(selectedFile, 'book');
        if (!resUpload.data) {
            return notification.error({
                message: 'Error upload file',
                description: JSON.stringify(resUpload.message),
            });
        }

        const newThumbnail = resUpload.data.fileUploaded;
        const { mainText, author, price, quantity, category } = values;

        const resBook = await createBookAPI(
            newThumbnail,
            mainText,
            author,
            price,
            quantity,
            category
        );
        if (resBook.data) {
            notification.success({
                message: 'Created book',
                description: 'Tạo book thành công',
            });
            await loadBook();
            resetAndCloseModal();
        } else {
            notification.error({
                message: 'Error create book',
                description: JSON.stringify(resBook.message),
            });
        }
    };

    const resetAndCloseModal = () => {
        form.resetFields();

        setSelectedFile(null);
        setPreview(null);

        setIsCreateOpen(false);
    };

    return (
        <Modal
            title="Create Book (uncontrolled components)"
            open={isCreateOpen}
            onOk={() => form.submit()}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            okText={'Create'}
        >
            <Form form={form} onFinish={handleSubmitBtn} layout="vertical">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <Form.Item
                            label="Tiêu đề"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your mainText!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your author!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Giá tiền"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter={' đ'}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your quantity!',
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter={' đ'}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Thể loại"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your category!',
                                },
                            ]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                name="category"
                                options={[
                                    { value: 'Arts', label: 'Arts' },
                                    { value: 'Business', label: 'Business' },
                                    { value: 'Comics', label: 'Comics' },
                                    { value: 'Cooking', label: 'Cooking' },
                                    {
                                        value: 'Entertainment',
                                        label: 'Entertainment',
                                    },
                                    { value: 'History', label: 'History' },
                                    { value: 'Music', label: 'Music' },
                                    { value: 'Sports', label: 'Sports' },
                                    { value: 'Teen', label: 'Teen' },
                                    { value: 'Travel', label: 'Travel' },
                                ]}
                            ></Select>
                        </Form.Item>
                    </div>
                </div>
            </Form>

            <div>
                <div>Ảnh thumbnail</div>
                <div>
                    <label
                        htmlFor="btnUpload"
                        style={{
                            display: 'block',
                            width: 'fit-content',
                            marginTop: '15px',
                            padding: '5px 10px',
                            background: 'orange',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Upload
                    </label>
                    <input
                        type="file"
                        hidden
                        id="btnUpload"
                        style={{ display: 'none' }}
                        onChange={handleOnChangeFile}
                        onClick={(event) => (event.target.value = null)}
                    />
                </div>
            </div>
            {preview && (
                <>
                    <div
                        style={{
                            width: '150px',
                            height: '100px',
                            marginTop: '10px',
                            marginBottom: '15px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                            src={preview}
                        />
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CreateBookUncontrol;
