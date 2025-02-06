import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect , useState } from "react";

export default function Home() {
    const [orders , setOrders] = useState ( [] );

    // Hàm chuyển đổi ngày theo định dạng dd/mm/yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Lưu ý: tháng trong JS bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect ( () => {
        axios.get ( "http://localhost:3001/orders" )
            .then ( response => {
                setOrders ( response.data || [] );
            } )
            .catch ( error => console.error ( "Error fetching orders:" , error ) );
    } , [] );

    // Sắp xếp sản phẩm theo giá tăng dần
    const sortedOrders = [...orders].sort ( (a , b) => a.product.price - b.product.price );

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Thống kê đơn hàng</h1>
            <div className="text-center mb-4">
                <Link to="/add">
                    <button className="btn btn-primary">Thêm mới đơn hàng</button>
                </Link>
            </div>
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