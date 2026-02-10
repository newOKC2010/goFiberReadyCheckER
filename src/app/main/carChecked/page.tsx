'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/app/main/carChecked/component/PageHeader';
import FilterSection from '@/app/main/carChecked/component/FilterSection';
import TableSection from '@/app/main/carChecked/component/TableSection';
import { showAlert } from '@/global/globalSwal';
import { CarCheckedItem, CarOption, StaffOption, FilterParams } from '@/app/main/carChecked/utils/types';
import * as handler from '@/app/main/carChecked/handler/handlerCarChecked';

export default function CarCheckedPage() {
  const [data, setData] = useState<CarCheckedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  const [cars, setCars] = useState<CarOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await initData();
      await initialFetchData();
      setLoading(false);
    };
    init();
  }, []);

  const initData = async () => {
    const role = await handler.loadUserRole();
    setUserRole(role);
    
    const carsData = await handler.loadCars();
    setCars(carsData);
    
    if (handler.isAdminOrSuperAdmin(role)) {
      const staffData = await handler.loadStaff();
      setStaff(staffData);
    }
  };

  const initialFetchData = async () => {
    const result = await handler.loadData({});
    if (result.success) {
      setData(result.data);
    }
  };

  const fetchData = async () => {
    setSearchLoading(true);
    const result = await handler.loadData(filters);
    
    if (result.success) {
      setData(result.data);
      setCurrentPage(1);
    } else {
      setData([]);
    }
    
    setTimeout(() => {
      setSearchLoading(false);
      if (result.success) {
        if (result.data.length === 0) {
          showAlert('แจ้งเตือน', 'ไม่พบข้อมูล', 'info');
        } else {
          showAlert('สำเร็จ', `พบข้อมูล ${result.data.length} รายการ`, 'success');
        }
      } else {
        showAlert('ผิดพลาด', result.message || 'ไม่สามารถค้นหาข้อมูลได้', 'error');
      }
    }, 3000);
  };

  const handleReset = async () => {
    setSearchLoading(true);
    setFilters({});
    setCurrentPage(1);
    const result = await handler.loadData({});
    
    if (result.success) {
      setData(result.data);
    } else {
      setData([]);
    }
    
    setTimeout(() => {
      setSearchLoading(false);
      if (result.success) {
        if (result.data.length === 0) {
          showAlert('แจ้งเตือน', 'รีเซ็ตเสร็จ แต่ไม่พบข้อมูล', 'info');
        } else {
          showAlert('สำเร็จ', `รีเซ็ตเสร็จ แสดงข้อมูลทั้งหมด ${result.data.length} รายการ`, 'success');
        }
      } else {
        showAlert('ผิดพลาด', result.message || 'ไม่สามารถรีเซ็ตข้อมูลได้', 'error');
      }
    }, 3000);
  };

  const handleView = (item: CarCheckedItem) => {
    showAlert('ดูรายละเอียด', `รายการ: ${item.license_plate_name}`, 'info');
  };

  const handleEdit = (item: CarCheckedItem) => {
    showAlert('แก้ไข', `แก้ไขรายการ: ${item.license_plate_name}`, 'info');
  };

  const { carOptions, staffOptions, itemsPerPageOptions } = handler.createDropdownOptions(cars, staff);
  const { paginatedData, totalPages } = handler.paginateData(data, currentPage, itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader />
      
      <FilterSection
        filters={filters}
        onFilterChange={setFilters}
        onSearch={fetchData}
        onReset={handleReset}
        loading={searchLoading}
        carOptions={carOptions}
        staffOptions={staffOptions}
        showStaffFilter={handler.isAdminOrSuperAdmin(userRole)}
      />
      
      <TableSection
        data={paginatedData}
        loading={searchLoading || loading}
        totalCount={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPageOptions={itemsPerPageOptions}
        showStaffColumn={handler.isAdminOrSuperAdmin(userRole)}
        showDeleteButton={handler.isAdminOrSuperAdmin(userRole)}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(item) => handler.handleDelete(item, fetchData)}
      />
      </div>
    </div>
  );
}