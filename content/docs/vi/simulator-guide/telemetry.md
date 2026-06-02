# Telemetry & Blackbox

IDE ghi lại toàn bộ telemetry bay mà bạn có thể phân tích sau mỗi phiên.

## Bảng Telemetry trực tiếp

Trong quá trình mô phỏng, **Telemetry Panel** (View → Telemetry) hiển thị:

- Điện áp pin và dòng tiêu thụ
- Nhiệt độ motor và RPM
- Tọa độ GPS và độ cao
- Tư thế (roll, pitch, yaw)
- Cường độ tín hiệu (RSSI)

## Ghi Blackbox

Mỗi chuyến bay được tự động lưu dưới dạng log Blackbox (file `.bbl`) trong thư mục dự án.

### Phân tích Log

Mở **Blackbox Analyzer** (Tools → Blackbox Analyzer) để:

1. Vẽ đồ thị gyro, PID và motor
2. Xác định dao động và tinh chỉnh giá trị PID
3. Xuất dữ liệu sang CSV để phân tích bên ngoài

## Quy trình tinh chỉnh PID

1. Bay phiên thử nghiệm ở chế độ Acro
2. Mở Blackbox Analyzer
3. Tìm **dao động P-term** trên đồ thị gyro
4. Giảm P gain 10% và thử lại
5. Lặp lại cho đến khi đồ thị sạch
