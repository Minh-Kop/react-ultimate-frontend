import { Drawer } from 'antd';

const BookDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail } = props;

    return (
        <Drawer
            width={'40vw'}
            title="Chi Tiết Book"
            onClose={() => {
                setIsDetailOpen(false);
                setDataDetail(null);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? (
                <>
                    <p>Id: {dataDetail._id}</p>
                    <br />
                    <p>Tiêu đề: {dataDetail.mainText}</p>
                    <br />
                    <p>Tác giả: {dataDetail.author}</p>
                    <br />
                    <p>Thể loại: {dataDetail.category}</p>
                    <br />
                    <p>
                        Giá tiền:{' '}
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(dataDetail.price)}
                    </p>
                    <br />
                    <p>Số lượng: {dataDetail.quantity}</p>
                    <br />
                    <p>Đã bán: {dataDetail.sold}</p>
                    <br />
                    <p>Thumbnail</p>
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
                            }/images/book/${dataDetail.thumbnail}`}
                        />
                    </div>
                </>
            ) : (
                <>
                    <p>Không có dữ liệu</p>
                </>
            )}
        </Drawer>
    );
};
export default BookDetail;
