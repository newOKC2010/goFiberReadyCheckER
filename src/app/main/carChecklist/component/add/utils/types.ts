export interface AddFormData {
  name: string;
}

export interface AddFormProps {
  loading: boolean;
  onSubmit: (data: AddFormData) => void;
  onCancel: () => void;
}
