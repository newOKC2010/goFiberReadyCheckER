# Emergency API

Base URL: `http://localhost:8080` | Auth: `Authorization: Bearer <token>`

---

## 🚑 `/emergency` — รถฉุกเฉิน

| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| POST | `/emergency/add` | admin+ | เพิ่มรถ |
| PUT | `/emergency/update` | admin+ | แก้ไขรถ |
| GET | `/emergency/views` | ทุก role | ดูรายการ (เฉพาะ active) |

**POST /add** `{ "license_plate_name": "กข1234", "type": "ALS" }`

**PUT /update** `{ "emergency_id": 1, "license_plate_name"?, "type"?, "active"? }`

**GET /views** `?type=ALS&offset=0&limit=10`

---

## 📋 `/emergency-list` — รายการตรวจสอบ

| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| POST | `/emergency-list/add` | admin+ | เพิ่มรายการ |
| PUT | `/emergency-list/update` | admin+ | แก้ไขรายการ |
| GET | `/emergency-list/views` | ทุก role | ดูรายการ (เฉพาะ active) |

**POST /add** `{ "name": "ตรวจออกซิเจน", "description"? }`

**PUT /update** `{ "emergency_list_id": 1, "name", "description"?, "is_active"? }`

**GET /views** `?offset=0&limit=10`

---

## Response

**สำเร็จ** `{ "success": true, "message": "...", "data": [...] }`

**ไม่พบข้อมูล / ปิดใช้งาน** `{ "success": false, "message": "..." }`

| Status | ความหมาย |
|--------|----------|
| 400 | ข้อมูลผิด / ซ้ำ |
| 401 | ไม่มี token |
| 403 | ไม่มีสิทธิ์ |
| 404 | ไม่พบข้อมูล |
| 500 | เซิร์ฟเวอร์ผิดพลาด |
