import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect , useState } from "react";

export default function Home() {
    const [orders , setOrders] = useState ( [] );

    // Search states
    const [products, setProducts] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    // for filtered results
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Ngày theo định dạng dd/mm/yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Lưu ý: tháng trong JS bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect ( () => {
        // Fetch orders cho table
        axios.get ( "http://localhost:3001/orders" )
            .then ( response => {
                setOrders ( response.data || [] );
                setSearchResults(response.data || []);
            } )
            .catch ( error => console.error ( "Error fetching orders:" , error ) );

        // Fetch products cho search
        axios.get("http://localhost:3001/products")
            .then(response => {

                setProducts(response.data || []);
            })
            .catch(error => console.error("Error fetching products:", error));
    } , [] );

    const handleSearch = () => {
        let filtered = [...orders];
        let shouldFilter = false;

        // If either date is selected, filter by date range
        if (startDate || endDate) {
            shouldFilter = true;
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.purchaseDate);
                const startDateObj = startDate ? new Date(startDate) : null;
                const endDateObj = endDate ? new Date(endDate) : null;

                return (!startDateObj || orderDate >= startDateObj) &&
                    (!endDateObj || orderDate <= endDateObj);
            });
            // Reset date inputs after search
            setStartDate('');
            setEndDate('');
        }

        // If product is selected, filter by product name
        if (selectedProduct) {
            shouldFilter = true;
            filtered = filtered.filter(order =>
                order.product.name === selectedProduct
            );
            // Reset product selection after search
            setSelectedProduct('');
        }

        setSearchResults(filtered);
        setIsSearchActive(shouldFilter);
    };

    // Sắp xếp sản phẩm theo giá tăng dần
    const sortedOrders = [...(isSearchActive ? searchResults : orders)].sort((a, b) =>
        a.product.price - b.product.price
    );

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Thống kê đơn hàng</h1>

            {/* Search Section */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <label className="form-label">Từ ngày:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Đến ngày:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Sản phẩm:</label>
                    <select
                        className="form-select"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Chọn sản phẩm</option>
                        {products.map(product => (
                            <option key={product.id} value={product.name}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={handleSearch}
                    >
                        Tìm
                    </button>
                </div>
            </div>

            {/* Add button */}
            <div className="text-center mb-4">
                <Link to="/add">
                    <button className="btn btn-primary">Thêm mới đơn hàng</button>
                </Link>
            </div>

            {/* All Orders */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá (USD)</th>
                    <th>Loại sản phẩm</th>
                    <th>Ngày mua</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền (USD)</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {sortedOrders.map((order, index) => (
                    <tr key={order.orderId}>
                        <td>{index + 1}</td>
                        <td>{order.orderId}</td>
                        <td>{order.product.name}</td>
                        <td>{order.product.price}</td>
                        <td>{order.product.type}</td>
                        <td>{formatDate(order.purchaseDate)}</td>
                        <td>{order.quantity}</td>
                        <td>{order.total}</td>
                        <td>
                            <button className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}