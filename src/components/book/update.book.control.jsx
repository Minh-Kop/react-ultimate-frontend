import { Input, InputNumber, Modal, notification, Select } from 'antd';
import { useEffect, useState } from 'react';
import { updateBookAPI, uploadFileAPI } from '../../services/api.service';

const UpdateBookControl = (props) => {
    const {
        isModalUpdateOpen,
        setIsModalUpdateOpen,
        dataUpdate,
        setDataUpdate,
        loadBook,
    } = props;

    const [id, setId] = useState('');
    const [mainText, setMainText] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate._id);
            setMainText(dataUpdate.mainText);
            setAuthor(dataUpdate.author);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);
            setCategory(dataUpdate.category);
            setPreview(
                `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    dataUpdate.thumbnail
                }`
            );
        }
    }, [dataUpdate]);

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

    const updateBook = async (newThumbnail) => {
        const resBook = await updateBookAPI(
            id,
            newThumbnail,
            mainText,
            author,
            price,
            quantity,
            category
        );
        if (resBook.data) {
            notification.success({
                message: 'Updated book',
                description: 'Cập nhật book thành công',
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

    const handleSubmitBtn = async () => {
        if (!selectedFile && !preview) {
            return notification.error({
                message: 'Error update book',
                description: 'Vui lòng upload ảnh thumbnail',
            });
        }

        let newThumbnail = '';
        if (!selectedFile && preview) {
            newThumbnail = dataUpdate.thumbnail;
        } else {
            const resUpload = await uploadFileAPI(selectedFile, 'book');
            if (!resUpload.data) {
                return notification.error({
                    message: 'Error upload file',
                    description: JSON.stringify(resUpload.message),
                });
            }
            newThumbnail = resUpload.data.fileUploaded;
        }

        await updateBook(newThumbnail);
    };

    const resetAndCloseModal = () => {
        setMainText('');
        setAuthor('');
        setPrice('');
        setQuantity('');
        setCategory('');

        setSelectedFile(null);
        setPreview(null);

        setIsModalUpdateOpen(false);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update Book (controlled components)"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            maskClosable={false}
            okText={'Update'}
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

export default UpdateBookControl;
