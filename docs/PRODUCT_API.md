# API sản phẩm & dữ liệu AI (form Người bán / Quản trị)

Đặt biến `VITE_API_URL` (xem `.env.example`, trên Netlify: Site configuration > Environment variables) để gửi dữ liệu thật. Để trống thì form chạy chế độ mô phỏng. Frontend gọi 2 endpoint dạng POST, `Content-Type: application/json`.

## 1. POST `/products` (nút "Lưu sản phẩm")
```json
{
  "sku": "GS-014",
  "name": "Hạt giống cà chua bi F1",
  "category": "Rau củ",
  "difficulty": "Dễ",
  "price": { "regular": 45000, "sale": 39000, "currency": "VND" },
  "stock": 100,
  "description": "**Cà chua bi** ngọt, sai quả.\n- Gieo quanh năm",
  "origin": "Nhật Bản",
  "specs": {
    "germination_rate": 92,
    "harvest_days": 70,
    "seasons": ["Xuân", "Hè"],
    "ph": "6.0-6.8",
    "temperature": "20-30°C",
    "light": "Nắng đầy đủ"
  },
  "images": [{ "name": "ca-chua.jpg", "data_url": "data:image/jpeg;base64,..." }],
  "ai_training": {
    "diseases": [
      {
        "disease_name": "Sương mai",
        "symptoms": "Vết úa nâu loang trên lá, mặt dưới có mốc trắng.",
        "sample_images": [{ "name": "suong-mai-1.jpg", "data_url": "data:image/jpeg;base64,..." }]
      }
    ]
  }
}
```
- `price.sale` là `null` nếu không khuyến mãi; khi có thì phải nhỏ hơn `price.regular`.
- `description` là văn bản có ký hiệu định dạng đơn giản (`**đậm**`, `*nghiêng*`, `- danh sách`, `## tiêu đề`).
- Ảnh được thu nhỏ (cạnh dài tối đa 640px, ảnh bệnh 512px) rồi gửi dạng base64. Ở backend thật nên lưu ảnh vào kho lưu trữ (S3, Supabase Storage...) và chỉ giữ URL.

Phản hồi gợi ý: `{ "id": "prod_123", "sku": "GS-014", "status": "saved" }`.

## 2. POST `/ai-training` (nút "Đồng bộ dữ liệu AI")
```json
{
  "sku": "GS-014",
  "product_name": "Hạt giống cà chua bi F1",
  "submitted_at": "2026-10-28T03:15:00.000Z",
  "diseases": [
    { "disease_name": "Sương mai", "symptoms": "...", "sample_images": [{ "name": "a.jpg", "data_url": "data:image/jpeg;base64,..." }] }
  ]
}
```
Phản hồi gợi ý: `{ "sku": "GS-014", "received_diseases": 1, "received_images": 12, "status": "queued" }`.

## Lưu ý
- Trên trình duyệt chỉ lưu tên bệnh, dấu hiệu và số ảnh mẫu (`diseases[].imageCount`); ảnh mẫu chỉ nằm trong yêu cầu gửi lên máy chủ để tránh đầy LocalStorage.
- Cần bật CORS ở backend cho tên miền Netlify của bạn.
