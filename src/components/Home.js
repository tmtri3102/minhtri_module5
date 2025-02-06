import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect , useState } from "react";

export default function Home() {
    const [orders , setOrders] = useState ( [] );

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
        <>
            <h1>Thống kê đơn hàng</h1>
            <Link to="/add">
                <button>Thêm mới đơn hàng</button>
            </Link>
            <table>
                <thead>
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
                {sortedOrders.map ( (order , index) => (
                    <tr key={order.orderId}>
                        <td>{index + 1}</td>
                        <td>{order.orderId}</td>
                        <td>{order.product.name}</td>
                        <td>{order.product.price}</td>
                        <td>{order.product.type}</td>
                        <td>{order.purchaseDate}</td>
                        <td>{order.quantity}</td>
                        <td>{order.total}</td>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                ) )}
                </tbody>
            </table>
        </>
    )
}