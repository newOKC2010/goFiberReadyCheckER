'use client';

import { useState } from 'react';
import Dropdown from '@/components/dropdown/mainDropdown';
import { Button } from '@/components/buttonClick/mainButton';
import { showAlert } from '@/global/globalSwal';
import ChecklistItemForm from '@/app/main/carChecked/component/add/ChecklistItemForm';
import { ChecklistItem, AddFormProps } from '@/app/main/carChecked/component/add/utils/types';
import { initializeChecklistItems, validateForm, prepareFormData, submitForm } from '@/app/main/carChecked/component/add/utils/formUtils';

export default function AddForm({ cars, checklists, loading, setLoading, onSuccess, onCancel }: AddFormProps) {
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

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
    if (!validateForm(selectedCarId, checklistItems)) return;

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
      <div>
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
            <ChecklistItemForm
              key={item.checklist_id}
              item={item}
              index={index}
              onUpdate={(field, value) => updateChecklistItem(index, field, value)}
            />
          ))}
        </div>
      </div>

      {/* ปุ่มควบคุม */}
      <div className="flex gap-2 sm:gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          size="sm"
          className="sm:!px-4 sm:!py-2"
        >
          ยกเลิก
        </Button>
        <Button
          type="button"
          variant="pastel"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || !selectedCarId}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white sm:!px-4 sm:!py-2"
        >
          บันทึกข้อมูล
        </Button>
      </div>
    </div>
  );
}
