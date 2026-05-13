"use client"

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import TeacherStatsOverview from '@/components/admin/teachers/TeacherStatsOverview';
import TeacherFilterBar from '@/components/admin/teachers/TeacherFilterBar';
import TeacherRow from '@/components/admin/teachers/TeacherRow';
import TeacherEmptyState from '@/components/admin/teachers/TeacherEmptyState';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminPageHeader from '@/components/admin/common/AdminPageHeader';
import BulkActionsBar from '@/components/admin/common/BulkActionsBar';
import SortableTableHeader from '@/components/admin/common/SortableTableHeader';
import TablePagination from '@/components/admin/common/TablePagination';
import { Teacher, Designation, DESIGNATIONS, STATUSES, GENDERS, SUBJECTS } from '@/components/admin/teachers/types';
import { mockTeachers } from '@/components/admin/data';
import { useRouter } from 'next/navigation';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ designation: '', gender: '', status: '' });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: 'asc' | 'desc' } | null>({ key: 'fullName', direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [modalType, setModalType] = useState<'delete' | 'bulkDelete' | null>(null);
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           teacher.teacherId.includes(searchQuery) ||
                           teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDesignation = !filters.designation || teacher.designation === filters.designation;
      const matchesGender = !filters.gender || teacher.gender === filters.gender;
      const matchesStatus = !filters.status || teacher.status === filters.status;
      return matchesSearch && matchesDesignation && matchesGender && matchesStatus;
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [teachers, searchQuery, filters, sortConfig]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTeachers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

  const handleSort = (key: keyof Teacher) => {
    setSortConfig(prev => ({ key, direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedTeachers.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedTeachers.map(t => t.id)));
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (activeTeacherId) {
      setTeachers(prev => prev.filter(t => t.id !== activeTeacherId));
      setActiveTeacherId(null);
    } else if (modalType === 'bulkDelete') {
      setTeachers(prev => prev.filter(t => !selectedIds.has(t.id)));
      setSelectedIds(new Set());
    }
    setModalType(null);
  };

  const handleDesignationChange = (id: string, newDesignation: Designation) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, designation: newDesignation } : t));
  };

  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden font-dm">
      <div className="flex-1 overflow-auto">
        <AdminPageHeader 
          title="Teacher Management" 
          description="Manage faculty records, designations, and status."
          className="mb-4"
        />
        <TeacherStatsOverview />

        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-lg/3 hover:shadow-lg/5 overflow-hidden mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-4">
            <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search teachers by name, ID or email..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
              />
            </div>
            
            <BulkActionsBar 
              selectedCount={selectedIds.size} 
              onDelete={() => setModalType('bulkDelete')}
              onTransfer={() => alert('Bulk Transfer')}
              onExport={() => alert('Bulk Export')}
            />
          </div>

          <TeacherFilterBar 
            filters={filters} 
            setFilters={setFilters} 
            totalResults={teachers.length} 
            filteredResults={filteredTeachers.length} 
            onClearFilters={() => { setFilters({ designation: '', gender: '', status: '' }); setSearchQuery(''); }} 
            onExport={() => alert('Exporting teachers...')} 
            onAddTeacher={() => router.push('/admin/teachers/new')} 
            onImport={() => alert('Import Teachers CSV')} 
          />

          <div className="relative overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <SortableTableHeader 
                columns={[
                  { key: 'teacherId', label: 'ID' },
                  { key: 'fullName', label: 'Teacher' },
                  { key: 'designation', label: 'Designation', align: 'center' },
                  { label: 'Subjects' },
                  { key: 'dateJoined', label: 'Joined', align: 'center' },
                  { label: 'Status', align: 'center' },
                  { label: 'Action', align: 'right' }
                ]}
                sortConfig={sortConfig}
                onSort={handleSort}
                showCheckbox={true}
                isAllSelected={selectedIds.size === paginatedTeachers.length && paginatedTeachers.length > 0}
                onSelectAll={handleToggleSelectAll}
              />
              <tbody className="divide-y divide-slate-100">
                {paginatedTeachers.length === 0 ? (
                  <TeacherEmptyState onAdd={() => alert('Add teacher')} />
                ) : (
                  paginatedTeachers.map((teacher) => (
                    <TeacherRow 
                      key={teacher.id} 
                      teacher={teacher} 
                      isSelected={selectedIds.has(teacher.id)} 
                      onToggleSelect={() => handleToggleSelect(teacher.id)} 
                      onDesignationChange={handleDesignationChange} 
                      onDelete={(id: string) => { setActiveTeacherId(id); setModalType('delete'); }} 
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>
      </div>
      <ConfirmModal 
        isOpen={modalType === 'delete' || modalType === 'bulkDelete'} 
        onClose={() => { setModalType(null); setActiveTeacherId(null); }} 
        onConfirm={handleDelete} 
        title={modalType === 'bulkDelete' ? 'Bulk Delete Teachers' : 'Delete Teacher'} 
        description={modalType === 'bulkDelete' ? `You are about to delete ${selectedIds.size} teachers. This action cannot be undone.` : 'This will permanently remove this teacher record. Are you sure you want to proceed?'} 
        confirmText="Yes, delete" 
        confirmVariant="danger" 
      />
    </div>
  );
}
