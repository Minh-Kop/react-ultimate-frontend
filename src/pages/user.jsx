import { useEffect, useState } from 'react';
import UserForm from '../components/user/user.form';
import UserTable from '../components/user/user.table';
import { fetchAllUserAPI } from '../services/api.service';

const UserPage = () => {
    const [dataUsers, setDataUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const loadUser = async () => {
        const res = await fetchAllUserAPI(current, pageSize);
        if (!res.data) {
            return;
        }
        const { meta, result } = res.data;
        setDataUsers(result);
        setCurrent(+meta.current);
        setPageSize(+meta.pageSize);
        setTotal(+meta.total);
    };

    useEffect(() => {
        loadUser();
    }, [current, pageSize]);

    return (
        <div style={{ padding: '20px' }}>
            <UserForm loadUser={loadUser} />
            <UserTable
                dataUsers={dataUsers}
                loadUser={loadUser}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </div>
    );
};

export default UserPage;
