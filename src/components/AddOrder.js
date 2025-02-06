import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddOrder() {
    const navigate = useNavigate ();
    const [orderData , setOrderData] = useState ( {
        orderId: "" ,
        product: "" ,
        quantity: 0 ,
        purchaseDate: "" ,
        total: 0
    } );
    const [products , setProducts] = useState ( [] );
    const [errorMessage , setErrorMessage] = useState ( "" );

    useEffect ( () => {
        axios.get ( "http://localhost:3001/products" )
            .then ( response => {
                console.log ( "Products loaded" , response.data );
                setProducts ( response.data );
            } )
            .catch ( error => console.error ( "Error loading products:" , error ) );
    } , [] );

    // Thêm đơn hàng
    const handleSubmit = (e) => {
        e.preventDefault ();

        const {orderId , product , quantity , purchaseDate} = orderData;
        const currentDate = new Date ();
        const purchaseDateObj = new Date ( purchaseDate );

        // Kiểm tra điều kiện
        if (!orderId || !product || !quantity || !purchaseDate) {
            setErrorMessage ( "Tất cả các trường đều là bắt buộc!" );
            return;
        }
        if (purchaseDateObj > currentDate) {
            setErrorMessage ( "Ngày mua không được lớn hơn ngày hiện tại." );
            return;
        }
        if (quantity <= 0 || !Number.isInteger ( Number ( quantity ) )) {
            setErrorMessage ( "Số lượng phải là số nguyên và lớn hơn 0." );
            return;
        }

        // Tính tổng tiền
        const selectedProduct = products.find ( p => p.id === product );
        const total = selectedProduct ? selectedProduct.price * quantity : 0;

        const newOrder = {
            orderId ,
            purchaseDate ,
            total ,
            quantity ,
            product: selectedProduct
        };

        // Gửi đơn hàng mới đến db.json
        axios.post ( "http://localhost:3001/orders" , newOrder )
            .then ( () => {
                alert ( "Thêm đơn hàng thành công!" );
                navigate ( '/' );
            } )
            .catch ( error => {
                console.error ( "Error adding order:" , error );
                setErrorMessage ( "Đã xảy ra lỗi khi thêm đơn hàng." );
            } );
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Thêm mới đơn hàng</h1>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">

                {/* Mã */}
                <div className="mb-3">
                    <label htmlFor="orderId" className="form-label">Mã đơn hàng:</label>
                    <input
                        type="text"
                        id="orderId"
                        className="form-control"
                        value={orderData.orderId}
                        onChange={(e) => setOrderData ( {...orderData , orderId: e.target.value} )}
                        required
                    />
                </div>

                {/* Tên */}
                <div className="mb-3">
                    <label htmlFor="product" className="form-label">Sản phẩm:</label>
                    <select
                        id="product"
                        className="form-select"
                        value={orderData.product}
                        onChange={(e) => setOrderData ( {...orderData , product: e.target.value} )}
                        required
                    >
                        <option value="">Chọn sản phẩm</option>
                        {products.map ( (product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ) )}
                    </select>
                </div>

                {/* Số lượng */}
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Số lượng:</label>
                    <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        min="1"
                        value={orderData.quantity}
                        onChange={(e) => setOrderData ( {...orderData , quantity: e.target.value} )}
                        required
                    />
                </div>

                {/* Ngày mua */}
                <div className="mb-3">
                    <label htmlFor="purchaseDate" className="form-label">Ngày mua:</label>
                    <input
                        type="date"
                        id="purchaseDate"
                        className="form-control"
                        value={orderData.purchaseDate}
                        onChange={(e) => setOrderData ( {...orderData , purchaseDate: e.target.value} )}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Thêm đơn hàng</button>
            </form>
        </div>
    );
}
