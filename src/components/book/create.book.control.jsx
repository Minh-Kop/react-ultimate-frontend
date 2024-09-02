import { Input, InputNumber, Modal, notification, Select } from 'antd';
import { useState } from 'react';
import { createBookAPI, uploadFileAPI } from '../../services/api.service';

const CreateBookControl = (props) => {
    const { isCreateOpen, setIsCreateOpen, loadBook } = props;

    const [mainText, setMainText] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const resetAndCloseModal = () => {
        setMainText('');
        setAuthor('');
        setPrice('');
        setQuantity('');
        setCategory('');

        setSelectedFile(null);
        setPreview(null);

        setIsCreateOpen(false);
    };

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

    const handleSubmitBtn = async () => {
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

    return (
        <Modal
            title="Create Book (controlled components)"
            open={isCreateOpen}
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
                    <span>Tiêu đề</span>
                    <Input
                        value={mainText}
                        onChange={(event) => setMainText(event.target.value)}
                    />
                </div>
                <div>
                    <span>Tác giả</span>
                    <Input
                        value={author}
                        onChange={(event) => setAuthor(event.target.value)}
                    />
                </div>
                <div>
                    <span>Giá tiền</span>
                    <InputNumber
                        style={{ width: '100%' }}
                        addonAfter={' đ'}
                        value={price}
                        onChange={(value) => setPrice(value)}
                    />
                </div>
                <div>
                    <span>Số lượng</span>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={quantity}
                        onChange={(value) => setQuantity(value)}
                    />
                </div>

                <div>
                    <div>Thể loại</div>
                    <Select
                        style={{ width: '100%' }}
                        value={category}
                        onChange={(value) => setCategory(value)}
                        options={[
                            { value: 'Arts', label: 'Arts' },
                            { value: 'Business', label: 'Business' },
                            { value: 'Comics', label: 'Comics' },
                            { value: 'Cooking', label: 'Cooking' },
                            { value: 'Entertainment', label: 'Entertainment' },
                            { value: 'History', label: 'History' },
                            { value: 'Music', label: 'Music' },
                            { value: 'Sports', label: 'Sports' },
                            { value: 'Teen', label: 'Teen' },
                            { value: 'Travel', label: 'Travel' },
                        ]}
                    ></Select>
                </div>

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
            </div>
        </Modal>
    );
};

export default CreateBookControl;
