'use client';

import { useState, useRef } from 'react';
import Dropdown from '@/components/dropdown/mainDropdown';
import { Button } from '@/components/buttonClick/mainButton';
import { showAlert } from '@/global/globalSwal';
import ChecklistItemForm from '@/app/main/EmerChecked/component/add/ChecklistItemForm';
import { ChecklistFormItem, AddFormProps } from '@/app/main/EmerChecked/component/add/utils/types';
import { initializeChecklistItems, prepareFormData, submitForm } from '@/app/main/EmerChecked/component/add/utils/formUtils';

export default function AddForm({ emergencies, checklists, loading, setLoading, onSuccess }: AddFormProps) {
  const [selectedEmerId, setSelectedEmerId] = useState('');
  const [items, setItems] = useState<ChecklistFormItem[]>(() => initializeChecklistItems(checklists));
  const [errorItems, setErrorItems] = useState<number[]>([]);
  const emerDropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateItem = (index: number, field: keyof ChecklistFormItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
    if (field === 'status' && value !== null) setErrorItems(prev => prev.filter(i => i !== index));
    if (field === 'note' && updated[index].item_type === 'plain_text') setErrorItems(prev => prev.filter(i => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedEmerId) {
      showAlert('ข้อผิดพลาด', 'กรุณาเลือกทะเบียนรถ', 'error');
      emerDropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const errors: number[] = [];
    items.forEach((item, index) => {
      if (item.item_type === 'boolean' && item.status === null) errors.push(index);
      else if (item.item_type !== 'boolean' && !item.note.trim()) errors.push(index);
    });

    if (errors.length > 0) {
      setErrorItems(errors);
      showAlert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกรายการ', 'error');
      itemRefs.current[errors[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrorItems([]);
    setLoading(true);
    const result = await submitForm(prepareFormData(selectedEmerId, items));
    setLoading(false);

    if (result.success) { showAlert('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'success'); onSuccess(); }
    else showAlert('ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาด', 'error');
  };

  const emerOptions = emergencies.map(e => ({ value: e.id.toString(), label: e.license_plate_name }));

  return (
    <div className="space-y-6">
      {/* เลือกทะเบียนรถ */}
      <div ref={emerDropdownRef}>
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 font-bold">
          <span className="material-symbols-outlined text-red-600 text-lg" style={{ fontVariationSettings: "'wght' 700" }}>emergency</span>
          เลือกทะเบียนรถ <span className="text-red-500">*</span>
        </label>
        <Dropdown options={emerOptions} value={selectedEmerId} onChange={setSelectedEmerId} placeholder="เลือกทะเบียนรถ Emergency" searchable />
      </div>

      {/* รายการตรวจสอบ */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">รายการตรวจสอบ</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div key={item.checklist_id} ref={(el) => { itemRefs.current[index] = el; }}>
              <ChecklistItemForm item={item} index={index} hasError={errorItems.includes(index)} onUpdate={(field, value) => updateItem(index, field, value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4 border-t">
        <Button type="button" variant="pastel" onClick={handleSubmit} loading={loading} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
          บันทึกข้อมูล
        </Button>
      </div>
    </div>
  );
}
