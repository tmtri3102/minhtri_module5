import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    // Hàm xử lý khi thêm đơn hàng
    const handleSubmit = (e) => {
        e.preventDefault ();

        const {orderId , product , quantity , purchaseDate} = orderData;
        const currentDate = new Date ();
        const purchaseDateObj = new Date ( purchaseDate );

        // Kiểm tra điều kiện nhập liệu
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

        // Cập nhật đơn hàng vào db.json
        // axios.get ( "http://localhost:3001/orders" )
        //     .then ( response => {
        //         const orders = response.data || [];
        //         orders.push ( newOrder );
        //
        //         // Lưu đơn hàng vào db.json
        //         axios.put ( "http://localhost:3001/orders" , orders )
        //             .then ( () => {
        //                 alert ( "Thêm đơn hàng thành công!" );
        //                 navigate ( '/' );
        //             } )
        //             .catch ( error => {
        //                 console.error ( "Error adding order:" , error );
        //                 setErrorMessage ( "Đã xảy ra lỗi khi thêm đơn hàng." );
        //             } );
        //     } )
        //     .catch ( error => {
        //         console.error ( "Error reading db.json:" , error );
        //         setErrorMessage ( "Không thể đọc dữ liệu từ db.json." );
        //     } );
        // Gửi đơn hàng mới đến server
        axios.post("http://localhost:3001/orders", newOrder)
            .then(() => {
                alert("Thêm đơn hàng thành công!");
                navigate('/');
            })
            .catch(error => {
                console.error("Error adding order:", error);
                setErrorMessage("Đã xảy ra lỗi khi thêm đơn hàng.");
            });
    };

    return (
        <div>
            <h1>Thêm mới đơn hàng</h1>

            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Mã đơn hàng:
                    <input
                        type="text"
                        value={orderData.orderId}
                        onChange={(e) => setOrderData ( {...orderData , orderId: e.target.value} )}
                        required
                    />
                </label>

                <label>
                    Sản phẩm:
                    <select
                        value={orderData.product}
                        onChange={(e) => setOrderData ( {...orderData , product: e.target.value} )}
                        required
                    >
                        <option value="">Chọn sản phẩm</option>
                        {products.map ( (product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ) )}
                    </select>
                </label>

                <label>
                    Số lượng:
                    <input
                        type="number"
                        min="1"
                        value={orderData.quantity}
                        onChange={(e) => setOrderData ( {...orderData , quantity: e.target.value} )}
                        required
                    />
                </label>

                <label>
                    Ngày mua:
                    <input
                        type="date"
                        value={orderData.purchaseDate}
                        onChange={(e) => setOrderData ( {...orderData , purchaseDate: e.target.value} )}
                        required
                    />
                </label>

                <button type="submit">Thêm đơn hàng</button>
            </form>
        </div>
    );
}
