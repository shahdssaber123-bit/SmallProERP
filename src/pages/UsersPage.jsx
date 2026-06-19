import React, { useMemo, useState } from 'react';
import { useErp } from '@/lib/erpContext';
import {
  Button,
  Card,
  DataTable,
  ErrorBanner,
  Field,
  Input,
  Modal,
  PageHeader,
  ReviewDialog,
  Select,
  SyncButton,
  idText
} from '@/components/erp/ErpKit';

const CREATED_USERS_STORAGE_KEY = 'smallpro_created_users_preview';

const loadCreatedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(CREATED_USERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveCreatedUsers = (users) => {
  localStorage.setItem(CREATED_USERS_STORAGE_KEY, JSON.stringify(users));
};

const normalizeUserRow = (user) => ({
  userId: user?.userId ?? user?.id ?? user?.UserId ?? user?.Id,
  fullName: user?.fullName ?? user?.FullName ?? user?.name ?? user?.Name ?? '',
  username: user?.username ?? user?.Username ?? '',
  email: user?.email ?? user?.Email ?? '',
  role: user?.role ?? user?.Role ?? '',
  tenantId: user?.tenantId ?? user?.TenantId ?? '',
  companyName: user?.companyName ?? user?.CompanyName ?? ''
});

export default function UsersPage() {
  const {
    data,
    loading,
    syncAllSystemData,
    registerUser,
    resetPassword,
    currentUser
  } = useErp();

  const [modal, setModal] = useState(null);
  const [err, setErr] = useState('');
  const [createdUsers, setCreatedUsers] = useState(loadCreatedUsers);

  const [form, setForm] = useState({
    Username: '',
    Email: '',
    Password: '',
    FullName: '',
    PhoneNumber: '',
    Role: 'Salesperson'
  });

  const [reset, setReset] = useState({
    Username: '',
    NewPassword: ''
  });

  const [review, setReview] = useState(null);

  const usersRows = useMemo(() => {
    const sourceRows = [
      ...(Array.isArray(data.users) ? data.users : []),
      ...(currentUser ? [currentUser] : []),
      ...createdUsers
    ].map(normalizeUserRow);

    const seen = new Set();

    return sourceRows.filter((user) => {
      const key = String(user.userId || user.email || user.username || Math.random());

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [data.users, currentUser, createdUsers]);

  const addCreatedUserToTable = (payload, responseData) => {
    const newUser = normalizeUserRow({
      userId: responseData?.userId || responseData?.UserId || `new-${Date.now()}`,
      fullName: payload.FullName,
      username: responseData?.username || responseData?.Username || payload.Username,
      email: responseData?.email || responseData?.Email || payload.Email,
      role: responseData?.role || responseData?.Role || payload.Role,
      tenantId: responseData?.tenantId || responseData?.TenantId || currentUser?.tenantId || currentUser?.TenantId || '—',
      companyName: responseData?.companyName || responseData?.CompanyName || currentUser?.companyName || currentUser?.CompanyName || '—'
    });

    setCreatedUsers((prev) => {
      const filtered = prev.filter((user) => {
        const row = normalizeUserRow(user);
        return row.username !== newUser.username && row.email !== newUser.email;
      });

      const next = [...filtered, newUser];

      saveCreatedUsers(next);
      return next;
    });
  };

  const validateRegister = () => {
    if (!form.Username.trim()) return 'Username is required.';
    if (!form.FullName.trim()) return 'Full Name is required.';
    if (!form.Email.trim()) return 'Email is required.';
    if (!form.Password.trim()) return 'Password is required.';
    if (!form.Role.trim()) return 'Role is required.';
    return '';
  };

  const validateReset = () => {
    if (!reset.Username.trim()) return 'Username is required.';
    if (!reset.NewPassword.trim()) return 'New password is required.';
    return '';
  };

  const openRegisterReview = () => {
    setErr('');
    const validationError = validateRegister();

    if (validationError) {
      setErr(validationError);
      return;
    }

    setReview('register');
  };

  const openResetReview = () => {
    setErr('');
    const validationError = validateReset();

    if (validationError) {
      setErr(validationError);
      return;
    }

    setReview('reset');
  };

  const submitRegister = async () => {
    setErr('');

    const payload = {
      Username: form.Username.trim(),
      Email: form.Email.trim(),
      Password: form.Password,
      FullName: form.FullName.trim(),
      PhoneNumber: form.PhoneNumber.trim(),
      Role: form.Role
    };

    try {
      const res = await registerUser(payload);

      if (res && res.success === false) {
        setErr(res.error || 'Register user failed.');
        return;
      }

      addCreatedUserToTable(payload, res?.data || res);

      setModal(null);
      setReview(null);

      setForm({
        Username: '',
        Email: '',
        Password: '',
        FullName: '',
        PhoneNumber: '',
        Role: 'Salesperson'
      });
    } catch (e) {
      setErr(e?.message || 'Register user failed.');
    }
  };

  const submitReset = async () => {
    setErr('');

    const payload = {
      Username: reset.Username.trim(),
      NewPassword: reset.NewPassword
    };

    try {
      const res = await resetPassword(payload);

      if (res && res.success === false) {
        setErr(res.error || 'Reset password failed.');
        return;
      }

      setModal(null);
      setReview(null);

      setReset({
        Username: '',
        NewPassword: ''
      });
    } catch (e) {
      setErr(e?.message || 'Reset password failed.');
    }
  };

  const clearLocalCreatedUsers = () => {
    setCreatedUsers([]);
    saveCreatedUsers([]);
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage users and reset passwords"
        actions={
          <>
            <SyncButton loading={loading.global} onClick={syncAllSystemData} />
            <Button onClick={() => setModal('register')}>New User</Button>
            <Button variant="secondary" onClick={() => setModal('reset')}>
              Reset Password
            </Button>
          </>
        }
      />

      <ErrorBanner message={err} />


      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-bold text-slate-600">
          Showing {usersRows.length} user{usersRows.length === 1 ? '' : 's'}
        </div>

        {createdUsers.length > 0 && (
          <Button variant="secondary" onClick={clearLocalCreatedUsers}>
            Clear local created users
          </Button>
        )}
      </div>

      <DataTable
        rows={usersRows}
        columns={[
          { key: 'userId', label: 'ID', render: (r) => idText(r.userId) },
          { key: 'fullName', label: 'Full Name' },
          { key: 'username', label: 'Username' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'tenantId', label: 'Tenant' },
          { key: 'companyName', label: 'Company' }
        ]}
      />

      <Modal
        open={modal === 'register'}
        title="Register User"
        subtitle="Create User"
        onClose={() => setModal(null)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username *">
            <Input
              value={form.Username}
              onChange={(e) => setForm({ ...form, Username: e.target.value })}
            />
          </Field>

          <Field label="Full Name *">
            <Input
              value={form.FullName}
              onChange={(e) => setForm({ ...form, FullName: e.target.value })}
            />
          </Field>

          <Field label="Email *">
            <Input
              type="email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
            />
          </Field>

          <Field label="Phone Number">
            <Input
              value={form.PhoneNumber}
              onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })}
            />
          </Field>

          <Field label="Password *">
            <Input
              type="password"
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
            />
          </Field>

          <Field label="Role *">
            <Select
              value={form.Role}
              onChange={(e) => setForm({ ...form, Role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Salesperson">Salesperson</option>
              <option value="InventoryManager">Inventory Manager</option>
            </Select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={openRegisterReview}>Review Register</Button>
        </div>
      </Modal>

      <Modal
        open={modal === 'reset'}
        title="Reset Password"
        subtitle="Reset Password"
        onClose={() => setModal(null)}
      >
        <div className="grid gap-4">
          <Field label="Username *">
            <Input
              value={reset.Username}
              onChange={(e) => setReset({ ...reset, Username: e.target.value })}
            />
          </Field>

          <Field label="New Password *">
            <Input
              type="password"
              value={reset.NewPassword}
              onChange={(e) => setReset({ ...reset, NewPassword: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={openResetReview}>Review Reset</Button>
        </div>
      </Modal>

      <ReviewDialog
        open={review === 'register'}
        onClose={() => setReview(null)}
        onConfirm={submitRegister}
        items={[
          { label: 'Full Name', value: form.FullName },
          { label: 'Username', value: form.Username },
          { label: 'Role', value: form.Role },
          { label: 'Email', value: form.Email },
          { label: 'Phone Number', value: form.PhoneNumber || '—' },
          { label: 'Password', value: form.Password ? '••••••••' : '' }
        ]}
      />

      <ReviewDialog
        open={review === 'reset'}
        onClose={() => setReview(null)}
        onConfirm={submitReset}
        items={[
          { label: 'Username', value: reset.Username },
          { label: 'New Password', value: reset.NewPassword ? '••••••••' : '' }
        ]}
      />
    </div>
  );
}
