import { updateUserStatus } from '@/app/main/UserManage/service/serviceUserManage';
import { UpdateUserForm } from './types';

export async function submitUpdateUser(
  userId: number,
  form: UpdateUserForm
): Promise<{ success: boolean; message: string }> {
  return updateUserStatus(userId, form.status, form.status ? form.role : undefined);
}
