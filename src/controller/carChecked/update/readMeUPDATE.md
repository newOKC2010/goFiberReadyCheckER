# Update Checklist Item API

```
PUT /car-checked/update
Authorization: Bearer <token>
```

## Parameters

| Field | Type | Required | Note |
|-------|------|----------|------|
| `car_checked_id` | int64 | ✅ | ID ข้อมูล |
| `checklist_id` | string | ✅ | ID item |
| `note` | string | ❌ | หมายเหตุ |
| `status` | boolean | ❌ | สถานะ |
| `images_{checklist_id}` | file[] | ✅ | **บังคับส่งทุกครั้ง** |

## กฎสำคัญ

- ✅ **ต้องส่ง `images_{checklist_id}` ทุกครั้ง** (ตรงกับ checklist_id)
- ส่งว่าง → ลบรูปเก่าทั้งหมด
- ส่งรูป → ลบรูปเก่า + ใส่รูปใหม่ทั้งหมด

---

## ตัวอย่าง

### 1. ลบรูปทั้งหมด
```
images_1: (ส่ง field ว่าง)
→ ลบรูปเก่าทั้งหมด
```

### 2. อัพเดทรูป (เช่น เดิม 3 รูป อยากเพิ่มอีก 2 รูป)
```
images_1: [old1.jpg, old2.jpg, old3.jpg, new1.jpg, new2.jpg]
→ ลบรูปเก่าทั้งหมด + ใส่รูปใหม่ทั้งหมด 5 รูป
```

---

## Frontend Example

```javascript
const formData = new FormData();
formData.append('car_checked_id', 8);
formData.append('checklist_id', '1');

// ต้องส่ง images_{checklist_id} ทุกครั้ง
if (mode === 'delete') {
  // ส่ง field ว่างเพื่อลบรูปทั้งหมด
  formData.append('images_1', '');
} else {
  // ส่งรูปทั้งหมด (รูปเก่า + รูปใหม่)
  allFiles.forEach(f => formData.append('images_1', f));
}

await fetch('/car-checked/update', { method: 'PUT', body: formData });
```

---

## Error Cases

- **400** - ไม่ส่ง images field: `"ต้องส่ง images field ทุกครั้ง"`
- **400** - ส่ง field ไม่ตรง: `"ต้องส่ง images_1 ให้ตรงกับ checklist_id"`
- **403** - ไม่มีสิทธิ์: `"ไม่มีสิทธิ์แก้ไขข้อมูลนี้"`
- **500** - ไม่พบ item: `"ไม่พบรายการ items ที่ต้องการแก้ไข"`

## หมายเหตุ

- ⚠️ ต้องส่ง `images_{checklist_id}` ทุกครั้ง (ตรงกับ ID)
- ⚠️ ทุกครั้งที่ส่งจะลบรูปเก่าทั้งหมดแล้วใส่รูปใหม่
- ⚠️ Frontend ต้องส่งรูปทั้งหมด (รูปเก่า + รูปใหม่)
- ⚠️ ไฟล์ที่ลบไม่สามารถกู้คืน
