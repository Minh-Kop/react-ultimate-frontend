import './style.css';

const MyComponent = () => {
    const hoidanit = 'Minh Kop';
    return (
        <>
            <div>{hoidanit} Kop</div>
            <div>{console.log('hello')}</div>
            <div className="child" style={{ border: 'solid 3px' }}>
                child
            </div>
        </>
    );
};

export default MyComponent;
