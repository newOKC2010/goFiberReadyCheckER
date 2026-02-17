export interface DeleteFormData {
  car_checked_id: number;
}

export interface DeleteFormProps {
  item: {
    id: number;
    license_plate_name: string;
    checked_date: string;
  };
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}
