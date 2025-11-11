import React, { useState } from 'react';
import { User, Column, UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { UserForm } from '../../components/forms/UserForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const roleClasses: Record<UserRole, string> = {
    [UserRole.Admin]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    [UserRole.Accountant]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [UserRole.Sales]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role]}`}>
      {role}
    </span>
  );
};

const UserRolesPage: React.FC = () => {
  const { users, companies, addUser, updateUser, deleteUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
    }
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  const handleSave = (userData: Partial<User>) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const columns: Column<User>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { 
      header: 'Company', 
      accessor: (row) => companies.find(c => c.id === row.companyId)?.name || 'N/A', 
      sortKey: 'companyId' 
    },
    { header: 'Role', accessor: (row) => <RoleBadge role={row.role} />, sortKey: 'role' },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex space-x-1">
          <Tooltip text="Edit">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip text="Delete">
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Users & Roles</h1>
        <Button onClick={handleAddNew}>Add New User</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={users}
        searchKeys={['name', 'email', 'role']}
        searchPlaceholder="Search by Name, Email, or Role..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm 
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          companies={companies}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserRolesPage;



