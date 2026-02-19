export interface AddFormData {
  license_plate_name: string;
}

export interface AddFormProps {
  loading: boolean;
  onSubmit: (data: AddFormData) => void;
  onCancel: () => void;
}
