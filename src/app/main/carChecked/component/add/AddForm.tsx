'use client';

import { useState, useRef } from 'react';
import Dropdown from '@/components/dropdown/mainDropdown';
import { Button } from '@/components/buttonClick/mainButton';
import { showAlert } from '@/global/globalSwal';
import ChecklistItemForm from '@/app/main/carChecked/component/add/ChecklistItemForm';
import { ChecklistItem, AddFormProps } from '@/app/main/carChecked/component/add/utils/types';
import { initializeChecklistItems, validateForm, prepareFormData, submitForm } from '@/app/main/carChecked/component/add/utils/formUtils';

export default function AddForm({ cars, checklists, loading, setLoading, onSuccess, onCancel }: AddFormProps) {
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [errorItems, setErrorItems] = useState<number[]>([]);
  const carDropdownRef = useRef<HTMLDivElement>(null);
  const checklistItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useState(() => {
    if (checklists.length > 0 && checklistItems.length === 0) {
      setChecklistItems(initializeChecklistItems(checklists));
    }
  });

  const updateChecklistItem = (index: number, field: keyof ChecklistItem, value: any) => {
    const updated = [...checklistItems];
    updated[index] = { ...updated[index], [field]: value };
    setChecklistItems(updated);
  };

  const handleSubmit = async () => {
    // ตรวจสอบทะเบียนรถ
    if (!selectedCarId) {
      showAlert('ข้อผิดพลาด', 'กรุณาเลือกทะเบียนรถ', 'error');
      carDropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ตรวจสอบสถานะของแต่ละ checklist item
    const errors: number[] = [];
    checklistItems.forEach((item, index) => {
      if (item.status === null) {
        errors.push(index);
      }
    });

    if (errors.length > 0) {
      setErrorItems(errors);
      showAlert('ข้อผิดพลาด', 'กรุณาเลือกสถานะการตรวจสอบทุกรายการ', 'error');
      // Focus ไปที่ item แรกที่มี error
      checklistItemRefs.current[errors[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrorItems([]);

    setLoading(true);
    const formData = prepareFormData(selectedCarId, checklistItems);
    const result = await submitForm(formData);

    if (result.success) {
      showAlert('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success');
      onSuccess();
    } else {
      showAlert('ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาด', 'error');
    }
    
    setLoading(false);
  };

  const carOptions = cars.map(car => ({
    value: car.id.toString(),
    label: car.license_plate_name
  }));

  return (
    <div className="space-y-6">
      {/* เลือกทะเบียนรถ */}
      <div ref={carDropdownRef}>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          เลือกทะเบียนรถ <span className="text-red-500">*</span>
        </label>
        <Dropdown
          options={carOptions}
          value={selectedCarId}
          onChange={setSelectedCarId}
          placeholder="เลือกทะเบียนรถที่ต้องการตรวจสอบ"
          searchable={true}
        />
      </div>

      {/* รายการตรวจสอบ */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">รายการตรวจสอบ</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {checklistItems.map((item, index) => (
            <div key={item.checklist_id} ref={(el) => { checklistItemRefs.current[index] = el; }}>
              <ChecklistItemForm
                item={item}
                index={index}
                hasError={errorItems.includes(index)}
                onUpdate={(field, value) => {
                  updateChecklistItem(index, field, value);
                  // ลบ error เมื่อมีการเลือกสถานะ
                  if (field === 'status' && value !== null) {
                    setErrorItems(prev => prev.filter(i => i !== index));
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ปุ่มบันทึก */}
      <div className="flex justify-center pt-4 border-t">
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-bold"
        >
          บันทึกข้อมูล
        </Button>
      </div>
    </div>
  );
}
