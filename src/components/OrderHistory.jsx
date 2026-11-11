import React, { useState, useEffect } from 'react';

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng từ localStorage hoặc API/Supabase của bạn
  useEffect(() => {
    const loadOrders = () => {
      const allOrders = JSON.parse(localStorage.getItem('store_orders') || '[]');
      // Nếu có thông tin user, có thể lọc theo user.id hoặc hiển thị tất cả nếu đang test đơn giản
      setOrders(allOrders);
    };

    loadOrders();
    // Lắng nghe sự kiện thay đổi dữ liệu đơn hàng
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  // Xử lý hủy đơn hàng (chỉ cho phép hủy khi đang ở trạng thái 'pending' - Chờ xác nhận)
  const handleCancelOrder = (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    const updatedOrders = orders.map(order => {
      if (order.id === orderId && order.status === 'pending') {
        return { ...order, status: 'cancelled' };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('store_orders', JSON.stringify(updatedOrders));
    // Phát sự kiện để SellerDashboard bên kia cập nhật theo nếu cần
    window.dispatchEvent(new Event('storage'));
  };

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Bạn chưa có lịch sử đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Lịch sử đơn hàng của bạn</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-semibold text-gray-700">Mã đơn: #{order.id}</p>
              <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt || Date.now()).toLocaleString()}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipping' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' && 'Chờ xác nhận'}
                  {order.status === 'confirmed' && 'Người bán đã xác nhận'}
                  {order.status === 'shipping' && 'Đang giao hàng'}
                  {order.status === 'completed' && 'Đã hoàn thành'}
                  {order.status === 'cancelled' && 'Đã hủy'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-green-600">
                {Number(order.total || 0).toLocaleString()} VNĐ
              </span>

              {/* Nút hủy đơn: Chỉ hiện khi trạng thái là pending */}
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}