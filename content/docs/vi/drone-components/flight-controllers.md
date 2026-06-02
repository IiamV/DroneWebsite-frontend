# Bộ điều khiển bay

Bộ điều khiển bay (FC) là bộ xử lý trung tâm của drone. Nó đọc dữ liệu cảm biến và điều chỉnh tốc độ motor nhiều lần mỗi giây để giữ drone ổn định.

## Cách hoạt động

1. **Con quay hồi chuyển (Gyroscope)** đo vận tốc góc trên cả ba trục
2. **Gia tốc kế (Accelerometer)** đo gia tốc tuyến tính
3. **Bộ điều khiển PID** tính toán hiệu chỉnh cần thiết
4. Đầu ra motor được cập nhật ở tần số 8 kHz (hoặc cao hơn trên bộ xử lý F7)

## Firmware phổ biến

| Firmware | Phù hợp nhất cho |
|---|---|
| **Betaflight** | Đua và freestyle; phổ biến nhất |
| **INAV** | Điều hướng GPS và bay tự động |
| **ArduPilot** | Nhiệm vụ tự động nâng cao |
| **Cleanflight** | Cũ; phần lớn đã được thay thế bởi Betaflight |

## Cấp bộ xử lý

- **F4** (STM32F405) — hiệu suất tốt, hỗ trợ rộng rãi
- **F7** (STM32F745) — nhanh hơn, hỗ trợ tốc độ vòng lặp cao hơn
- **H7** (STM32H743) — cao cấp nhất, dùng trong bản dựng chuyên nghiệp

## Chọn FC

Cho người mới: tìm **F4 hoặc F7** có OSD tích hợp, barometer và Bluetooth để cấu hình không dây qua ứng dụng SpeedyBee.
