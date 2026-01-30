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
| `images_action` | string | ❌ | `"append"` = เพิ่ม, อื่นๆ = แทนที่ |

## กฎสำคัญ

- ✅ **ต้องส่ง `images_{checklist_id}` ทุกครั้ง** (ตรงกับ checklist_id)
- ส่งว่าง → ลบหมด
- ส่งรูป → ลบเก่า + ใส่ใหม่
- `images_action: "append"` → เก็บเก่า + เพิ่มใหม่

---

## ตัวอย่าง

### 1. ลบรูปทั้งหมด
```
images_1: (ส่ง field ว่าง)
→ ลบรูปเก่าหมด
```

### 2. Replace (ลบเก่า ใส่ใหม่)
```
images_1: [new1.jpg, new2.jpg]
→ ลบรูปเก่าหมด + ใส่รูปใหม่
```

### 3. Append (เก็บเก่า เพิ่มใหม่)
```
images_action: "append"
images_1: [new3.jpg]
→ เก็บรูปเก่า + เพิ่มรูปใหม่
```

---

## Frontend Example

```javascript
const formData = new FormData();
formData.append('car_checked_id', 8);
formData.append('checklist_id', '1');

// ต้องส่ง images_{checklist_id} ทุกครั้ง
if (mode === 'delete') {
  formData.append('images_1', '');
} else if (mode === 'append') {
  formData.append('images_action', 'append');
  files.forEach(f => formData.append('images_1', f));
} else {
  files.forEach(f => formData.append('images_1', f));
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
- ⚠️ Replace ลบรูปเก่าหมดทุกครั้ง
- ⚠️ ไฟล์ที่ลบไม่สามารถกู้คืน
- ✅ Append เท่านั้นที่ไม่ลบรูปเก่า
