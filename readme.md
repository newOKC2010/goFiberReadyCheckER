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

## 📝 `/emergency-checked` — บันทึกผลการตรวจ

| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| POST | `/emergency-checked/add` | ทุก role | บันทึกผลตรวจ |
| PUT | `/emergency-checked/update` | ทุก role | แก้ไข checklist item |
| DELETE | `/emergency-checked/delete` | admin+ | ลบผลตรวจ (soft delete) |
| GET | `/emergency-checked/views` | ทุก role | ดูผลตรวจ (เฉพาะ active) |
| GET | `/emergency-checked/view-image/*` | ทุก role | ดูรูปภาพ |

**POST /add** `multipart/form-data`
| Field | Type | คำอธิบาย |
|-------|------|----------|
| `emergency_id` | int | ID รถฉุกเฉิน |
| `checklist_items` | JSON string | รายการตรวจสอบ |
| `images_<checklist_id>` | file(s) | รูปภาพ (optional) |

```json
// checklist_items format
{
  "items": [
    { "checklist_id": "1", "name": "ตรวจออกซิเจน", "status": true, "note": "" }
  ]
}
```

> รถแต่ละคันตรวจได้วันละ 1 ครั้ง

**PUT /update** `multipart/form-data`
| Field | Type | คำอธิบาย |
|-------|------|----------|
| `emergency_checked_id` | int | ID ผลตรวจ |
| `checklist_id` | string | ID รายการที่จะแก้ |
| `note` | string | หมายเหตุ |
| `status` | bool | ผ่าน/ไม่ผ่าน |
| `images_<checklist_id>` | file(s) | รูปใหม่ (optional — ไม่ส่ง = ลบรูปเดิม) |

> `user` — แก้ได้เฉพาะของตัวเอง | `admin+` — แก้ได้ทุกรายการ

**DELETE /delete** `{ "emergency_checked_id": 1 }` (JSON body)

**GET /views**
| Param | คำอธิบาย |
|-------|----------|
| `emergency_id` | กรองตาม ID รถ |
| `date_from` / `date_to` | ช่วงวันที่ (YYYY-MM-DD) |
| `staff_id` | กรองตาม user (admin+ เท่านั้น) |
| `offset` / `limit` | pagination |

> `user` — เห็นเฉพาะข้อมูลตัวเอง | `admin+` — เห็นทั้งหมด + ชื่อผู้ตรวจ

**GET /view-image/*** `path = emergency_checked/<checklist_id>/<filename>`

> `user` — เข้าถึงได้เฉพาะรูปที่ตัวเองบันทึก | `admin+` — เข้าถึงได้ทุกรูป

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
