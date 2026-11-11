/*import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function UserProfileManager({ supabase, session }) {
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state cho địa chỉ mới
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách địa chỉ
      const { data: addrData, error: addrError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', session.user.id);
      if (addrError) throw addrError;
      setAddresses(addrData || []);

      // Lấy lịch sử đơn hàng
      const { data: ordData, error: ordError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (ordError) throw ordError;
      setOrders(ordData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address_line) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const { data, error } = await supabase.from('addresses').insert([
        {
          user_id: session.user.id,
          ...newAddress,
        },
      ]).select();

      if (error) throw error;

      setAddresses([...addresses, data[0]]);
      setNewAddress({ recipient_name: '', phone: '', address_line: '', city: '' });
      alert('Thêm địa chỉ thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // HÀM XÓA ĐỊA CHỈ
  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      // Cập nhật lại state để địa chỉ biến mất ngay lập tức trên giao diện
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      alert('Không thể xóa địa chỉ: ' + error.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white shadow rounded-lg my-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Quản lý Tài khoản & Đơn hàng</h2>

      // PHẦN 1: QUẢN LÝ ĐỊA CHỈ & SỐ ĐIỆN THOẠI 
      <div className="grid md:grid-cols-2 gap-6">
        // Danh sách địa chỉ đã lưu 
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sổ địa chỉ & Số điện thoại</h3>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có địa chỉ nào được lưu.</p>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="p-3 border rounded-md bg-gray-50 text-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {addr.recipient_name} - <span className="text-blue-600">{addr.phone}</span>
                    </p>
                    <p className="text-gray-600">{addr.address_line}, {addr.city}</p>
                  </div>
                  // Nút Xóa địa chỉ 
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="px-2.5 py-1 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white text-xs rounded transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        // Form thêm địa chỉ mới 
        <form onSubmit={handleAddAddress} className="space-y-3 bg-gray-50 p-4 rounded-md border">
          <h3 className="text-lg font-semibold text-gray-700">Thêm địa chỉ mới</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600">Họ tên người nhận</label>
            <input
              type="text"
              value={newAddress.recipient_name}
              onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Số điện thoại liên hệ</label>
            <input
              type="text"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Địa chỉ chi tiết (Số nhà, tên đường)</label>
            <input
              type="text"
              value={newAddress.address_line}
              onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Tỉnh / Thành phố</label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition">
            Lưu địa chỉ
          </button>
        </form>
      </div>

      // PHẦN 2: LỊCH SỬ ĐƠN HÀNG 
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Lịch sử đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Ngày đặt</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Địa chỉ nhận</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="p-3">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 font-semibold text-green-600">{Number(order.total_amount).toLocaleString()} đ</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 truncate max-w-xs">{order.shipping_address} ({order.phone})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
*/
/*import React, { useState, useEffect } from 'react';

export default function UserProfileManager({ supabase, session, orders = [], setOrders }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state cho địa chỉ mới
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách địa chỉ từ Supabase
      const { data: addrData, error: addrError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', session.user.id);
      if (addrError) throw addrError;
      setAddresses(addrData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address_line) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const { data, error } = await supabase.from('addresses').insert([
        {
          user_id: session.user.id,
          ...newAddress,
        },
      ]).select();

      if (error) throw error;

      setAddresses([...addresses, data[0]]);
      setNewAddress({ recipient_name: '', phone: '', address_line: '', city: '' });
      alert('Thêm địa chỉ thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      alert('Không thể xóa địa chỉ: ' + error.message);
    }
  };

  // HÀM HỦY ĐƠN HÀNG: Xóa hẳn đơn hàng khỏi State (biến mất hoàn toàn khỏi giao diện)
  const handleCancelOrder = (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    // Lọc bỏ đơn hàng ra khỏi mảng orders chung
    if (typeof setOrders === 'function') {
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Đã hủy và xóa đơn hàng thành công.');
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white shadow rounded-lg my-6 text-gray-800">
      <h2 className="text-2xl font-bold border-b pb-4">Quản lý Tài khoản & Đơn hàng</h2>

      //PHẦN 1: QUẢN LÝ ĐỊA CHỈ & SỐ ĐIỆN THOẠI 
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sổ địa chỉ & Số điện thoại</h3>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có địa chỉ nào được lưu.</p>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="p-3 border rounded-md bg-gray-50 text-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {addr.recipient_name} <span className="text-blue-600 font-normal">({addr.phone})</span>
                    </p>
                    <p className="text-gray-600">{addr.address_line}, {addr.city}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="px-2.5 py-1 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white text-xs rounded transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleAddAddress} className="space-y-3 bg-gray-50 p-4 rounded-md border">
          <h3 className="text-lg font-semibold text-gray-700">Thêm địa chỉ mới</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600">Họ tên người nhận</label>
            <input
              type="text"
              value={newAddress.recipient_name}
              onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Số điện thoại liên hệ</label>
            <input
              type="text"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Địa chỉ chi tiết (Số nhà, tên đường)</label>
            <input
              type="text"
              value={newAddress.address_line}
              onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Tỉnh / Thành phố</label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm bg-white"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition">
            Lưu địa chỉ
          </button>
        </form>
      </div>

      // PHẦN 2: LỊCH SỬ ĐƠN HÀNG (Đồng bộ trực tiếp với State chung) 
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Lịch sử đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Ngày đặt</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Địa chỉ nhận</th>
                  <th className="p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs font-bold text-emerald-700">{order.id}</td>
                    <td className="p-3">{order.date || new Date().toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 font-semibold text-green-600">
                      {Number(order.total || order.total_amount || 0).toLocaleString()} đ
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        order.status === 'Chờ xác nhận' || order.status === 'Đang xử lý'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 truncate max-w-xs">
                      {order.address || order.shipping_address} ({order.phone})
                    </td>
                    <td className="p-3 text-center">
                      Chỉ hiển thị nút Hủy khi đơn ở trạng thái chờ xác nhận đang xử lý
                      {(order.status === 'Chờ xác nhận' || order.status === 'Đang xử lý') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-2.5 py-1 bg-red-500 text-white hover:bg-red-600 text-xs rounded transition"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
  */
 import React, { useState, useEffect } from 'react';

export default function UserProfileManager({ supabase, session, orders = [], setOrders }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state cho địa chỉ mới
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách địa chỉ từ Supabase
      const { data: addrData, error: addrError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', session.user.id);
      if (addrError) throw addrError;
      setAddresses(addrData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address_line) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const { data, error } = await supabase.from('addresses').insert([
        {
          user_id: session.user.id,
          ...newAddress,
        },
      ]).select();

      if (error) throw error;

      setAddresses([...addresses, data[0]]);
      setNewAddress({ recipient_name: '', phone: '', address_line: '', city: '' });
      alert('Thêm địa chỉ thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      alert('Không thể xóa địa chỉ: ' + error.message);
    }
  };

  // HÀM HỦY ĐƠN HÀNG: Xóa hẳn đơn hàng khỏi State và biến mất hoàn toàn khỏi giao diện
  const handleCancelOrder = (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    if (typeof setOrders === 'function') {
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Đã hủy và xóa đơn hàng thành công.');
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 card my-6">
      <h2 className="text-2xl font-bold border-b pb-4">Quản lý Tài khoản & Đơn hàng</h2>

      {/* PHẦN 1: QUẢN LÝ ĐỊA CHỈ & SỐ ĐIỆN THOẠI */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Sổ địa chỉ & Số điện thoại</h3>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm opacity-70">Chưa có địa chỉ nào được lưu.</p>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="p-3 border border-emerald-900/60 rounded-md bg-emerald-950/20 text-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {addr.recipient_name} <span className="text-lime-400 font-normal">({addr.phone})</span>
                    </p>
                    <p className="opacity-80">{addr.address_line}, {addr.city}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="px-2.5 py-1 bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white text-xs rounded transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleAddAddress} className="space-y-3 p-4 rounded-md border border-emerald-900/60 bg-emerald-950/10">
          <h3 className="text-lg font-semibold">Thêm địa chỉ mới</h3>
          <div>
            <label className="block text-xs font-medium opacity-80">Họ tên người nhận</label>
            <input
              type="text"
              value={newAddress.recipient_name}
              onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm inp"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-80">Số điện thoại liên hệ</label>
            <input
              type="text"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm inp"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-80">Địa chỉ chi tiết (Số nhà, tên đường)</label>
            <input
              type="text"
              value={newAddress.address_line}
              onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm inp"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-80">Tỉnh / Thành phố</label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full mt-1 p-2 border rounded text-sm inp"
            />
          </div>
          <button type="submit" className="w-full btn py-2 text-sm transition">
            Lưu địa chỉ
          </button>
        </form>
      </div>

      {/* PHẦN 2: LỊCH SỬ ĐƠN HÀNG */}
      <div className="border-t border-emerald-900/60 pt-6">
        <h3 className="text-lg font-semibold mb-4">Lịch sử đơn hàng của bạn</h3>
        {orders.length === 0 ? (
          <p className="text-sm opacity-70">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-emerald-900/60 opacity-80">
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Ngày đặt</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Địa chỉ nhận</th>
                  <th className="p-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-emerald-900/30 hover:bg-emerald-950/20">
                    <td className="p-3 font-mono text-xs font-bold text-lime-400">{order.id}</td>
                    <td className="p-3">{order.date || new Date().toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 font-semibold text-lime-400">
                      {Number(order.total || order.total_amount || 0).toLocaleString()} đ
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        order.status === 'Chờ xác nhận' || order.status === 'Đang xử lý'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 opacity-90 truncate max-w-xs">
                      {order.address || order.shipping_address} ({order.phone})
                    </td>
                    <td className="p-3 text-center">
                      {(order.status === 'Chờ xác nhận' || order.status === 'Đang xử lý') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-2.5 py-1 bg-red-500 text-white hover:bg-red-600 text-xs rounded transition"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}