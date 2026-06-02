# Lắp ráp Drone đầu tiên

Tổng quan từng bước về cách lắp ráp drone FPV 5 inch từ đầu.

## Bạn cần gì

### Dụng cụ
- Mỏ hàn (khuyến nghị TS100 hoặc Pinecil)
- Thiếc hàn (63/37 có chì hoặc không chì)
- Kìm cắt
- Tua vít lục giác (2mm, 2.5mm)
- Ống co nhiệt
- Loctite Blue (keo khóa ren)
- Đồng hồ vạn năng

### Linh kiện
- Khung (5 inch, ví dụ: iFlight Nazgul5 V3)
- Motor × 4 (ví dụ: iFlight XING2 2207 1800KV)
- ESC 4-in-1 (ví dụ: SpeedyBee F405 V4 stack)
- Bộ điều khiển bay (có trong stack)
- Cánh quạt × 4+4 dự phòng (ví dụ: HQProp 5x4x3)
- Pin (ví dụ: Tattu R-Line 6S 1300mAh)
- Camera FPV (ví dụ: RunCam Phoenix 2 SP)
- Bộ thu (ví dụ: ELRS EP2)
- Anten, dây XT60, dây rút

## Thứ tự lắp ráp

1. **Lắp khung** — cánh tay vào tấm đáy
2. **Gắn motor** — mỗi cánh tay một motor, bôi Loctite
3. **Lắp ESC** — hàn dây pin và dây motor
4. **Xếp FC** — kết nối cáp ESC-FC
5. **Lắp bộ thu** — hàn vào UART trên FC
6. **Gắn camera** — kết nối video và nguồn
7. **Flash firmware** — Betaflight qua USB
8. **Lắp cánh quạt** — xác nhận hướng quay motor trước
9. **Bay thử** — khu vực rộng, chế độ Angle trước

## Lỗi thường gặp

- Quên Loctite trên ốc motor (chúng rung lỏng)
- Sai hướng quay motor (kiểm tra trong tab motor Betaflight, KHÔNG gắn cánh)
- Không thêm tụ điện qua pad pin (gây nhiễu)
- Siết quá chặt standoff (nứt carbon fiber)
- Bay mà không cấu hình failsafe (nguy hiểm)

## Bảng chi phí

| Linh kiện | Tiết kiệm | Tầm trung | Cao cấp |
|---|---|---|---|
| Khung | $30 | $50 | $80 |
| Motor (×4) | $60 | $100 | $160 |
| FC + ESC Stack | $50 | $80 | $120 |
| Cánh quạt (×8) | $10 | $15 | $20 |
| Pin | $30 | $45 | $60 |
| Camera | $20 | $35 | $50 |
| Bộ thu | $15 | $20 | $25 |
| **Tổng** | **$215** | **$345** | **$515** |
