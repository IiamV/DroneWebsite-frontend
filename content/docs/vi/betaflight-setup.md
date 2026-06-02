# Hướng dẫn cài đặt Betaflight

Betaflight là firmware phổ biến nhất cho drone FPV. Hướng dẫn này bao gồm các bước cấu hình thiết yếu.

## Kết nối Betaflight Configurator

1. Tải Betaflight Configurator từ Chrome Web Store hoặc GitHub releases
2. Kết nối FC qua USB
3. Chọn đúng cổng COM và nhấp **Connect**

## Cấu hình thiết yếu

### Tab Ports
- Bật **Serial RX** trên UART kết nối với bộ thu
- Bật **MSP** trên USB (mặc định)

### Tab Configuration
- Đặt **Motor Protocol** thành DSHOT600 (khuyến nghị cho hầu hết bản dựng)
- Bật **Bidirectional DSHOT** cho lọc RPM
- Đặt **Gyro Update** và **PID Loop** thành 8kHz/8kHz (F7/H7) hoặc 8kHz/4kHz (F4)

### Tab Receiver
- Chọn giao thức bộ thu (CRSF cho ELRS/Crossfire, SBUS cho FrSky)
- Xác nhận ánh xạ kênh khớp với radio

### Tab Modes
- Gán **ARM** cho một công tắc (bắt buộc)
- Gán chế độ **ANGLE** cho người mới
- Gán **BEEPER** để tìm quad bị rơi
- Tùy chọn: **TURTLE MODE** (lật sau khi rơi)

## Cơ bản về tinh chỉnh PID

PID mặc định hoạt động tốt cho hầu hết bản dựng 5". Chỉ tinh chỉnh khi bạn nhận thấy:
- **Dao động** → giảm P
- **Phản hồi chậm** → tăng P
- **Bật ngược sau flip** → tăng D
- **Trôi khi treo** → điều chỉnh I

## Cài đặt OSD

Cấu hình OSD hiển thị:
- Điện áp pin (quan trọng cho sức khỏe LiPo)
- Thời gian bay
- RSSI (cường độ tín hiệu)
- Cảnh báo (pin yếu, failsafe)
