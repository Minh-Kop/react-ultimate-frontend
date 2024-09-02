import { Button, Drawer, notification } from 'antd';
import { useState } from 'react';
import { updateUserAvatarAPI, uploadFileAPI } from '../../services/api.service';

const ViewUserDetail = (props) => {
    const {
        isDetailOpen,
        setIsDetailOpen,
        dataDetail,
        setDataDetail,
        loadUser,
    } = props;

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

    const handleUpdateUserAvatar = async () => {
        const resUpload = await uploadFileAPI(selectedFile, 'avatar');
        if (!resUpload.data) {
            notification.error({
                message: 'Error upload file',
                description: JSON.stringify(resUpload.message),
            });
            return;
        }

        const newAvatar = resUpload.data.fileUploaded;
        const resUpdateAvatar = await updateUserAvatarAPI(
            dataDetail._id,
            newAvatar,
            dataDetail.fullName,
            dataDetail.phone
        );
        if (resUpdateAvatar.data) {
            setIsDetailOpen(false);
            setSelectedFile(null);
            setPreview(null);
            await loadUser();
            return notification.success({
                message: 'Updated user avatar',
                description: 'Cập nhật avatar thành công',
            });
        }
        notification.error({
            message: 'Error update avatar',
            description: JSON.stringify(resUpdateAvatar.message),
        });
    };

    return (
        <Drawer
            width={'40vw'}
            title="Chi Tiết User"
            onClose={() => {
                setIsDetailOpen(false);
                setDataDetail(null);
                setSelectedFile(null);
                setPreview(null);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? (
                <>
                    <p>Id: {dataDetail._id}</p>
                    <br />
                    <p>Full name: {dataDetail.fullName}</p>
                    <br />
                    <p>Email: {dataDetail.email}</p>
                    <br />
                    <p>Phone number: {dataDetail.phone}</p>
                    <br />
                    <p>Avatar:</p>
                    <div
                        style={{
                            width: '150px',
                            height: '100px',
                            marginTop: '10px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                            src={`${
                                import.meta.env.VITE_BACKEND_URL
                            }/images/avatar/${dataDetail.avatar}`}
                        />
                    </div>
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
                            Upload Avatar
                        </label>
                        <input
                            type="file"
                            hidden
                            id="btnUpload"
                            onChange={handleOnChangeFile}
                        />
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
                            <Button
                                type="primary"
                                onClick={() => handleUpdateUserAvatar()}
                            >
                                Save
                            </Button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <p>Không có dữ liệu</p>
                </>
            )}
        </Drawer>
    );
};
export default ViewUserDetail;
