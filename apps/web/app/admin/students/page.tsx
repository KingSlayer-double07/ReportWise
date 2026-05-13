"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StatsOverview from "@/components/admin/students/StatsOverview";
import FilterBar from "@/components/admin/students/FilterBar";
import StudentRow from "@/components/admin/students/StudentRow";
import EmptyState from "@/components/admin/students/EmptyState";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminPageHeader from "@/components/admin/common/AdminPageHeader";
import BulkActionsBar from "@/components/admin/common/BulkActionsBar";
import SortableTableHeader from "@/components/admin/common/SortableTableHeader";
import TablePagination from "@/components/admin/common/TablePagination";
import {
  Student,
  ClassLevel,
  CLASSES,
  STREAMS,
  GENDERS,
  STATUSES,
} from "@/components/admin/students/types";
import { mockStudents } from "@/components/admin/data";
import { useRouter } from "next/navigation";

// --- MAIN CONTENT COMPONENT ---

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    class: "",
    stream: "",
    gender: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "asc" | "desc";
  } | null>({ key: "fullName", direction: "asc" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [modalType, setModalType] = useState<"delete" | "bulkDelete" | null>(
    null,
  );
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.admissionNumber.includes(searchQuery);
        const matchesClass = !filters.class || student.class === filters.class;
        const matchesStream =
          !filters.stream || student.stream === filters.stream;
        const matchesGender =
          !filters.gender || student.gender === filters.gender;
        const matchesStatus =
          !filters.status || student.status === filters.status;
        return (
          matchesSearch &&
          matchesClass &&
          matchesStream &&
          matchesGender &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const valA = a[key] ?? "";
        const valB = b[key] ?? "";
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [students, searchQuery, filters, sortConfig]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredStudents, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const handleSort = (key: keyof Student) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedStudents.length)
      setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedStudents.map((s) => s.id)));
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (activeStudentId) {
      setStudents((prev) => prev.filter((s) => s.id !== activeStudentId));
      setActiveStudentId(null);
    } else if (modalType === "bulkDelete") {
      setStudents((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    }
    setModalType(null);
  };

  const handleClassChange = (id: string, newClass: ClassLevel) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              class: newClass,
              stream: newClass.startsWith("SSS") ? s.stream : undefined,
            }
          : s,
      ),
    );
  };

  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden font-dm">
      <div className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Student Overview"
          description="Manage and monitor students records effortlessly."
          className="mb-4"
        />
        <StatsOverview />

        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-lg/3 hover:shadow-lg/5 overflow-hidden mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-4">
            <div className="relative group flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <BulkActionsBar
              selectedCount={selectedIds.size}
              onDelete={() => setModalType("bulkDelete")}
              onTransfer={() => alert("Bulk Transfer")}
              onExport={() => alert("Bulk Export")}
            />
          </div>

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            totalResults={students.length}
            filteredResults={filteredStudents.length}
            onClearFilters={() => {
              setFilters({ class: "", stream: "", gender: "", status: "" });
              setSearchQuery("");
            }}
            onExport={() => alert("Exporting...")}
            onAddStudent={() => router.push("/admin/students/new")}
            onImport={() => alert("Import CSV")}
          />

          <div className="relative overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <SortableTableHeader
                columns={[
                  { key: "admissionNumber", label: "Admission No." },
                  { key: "fullName", label: "Full Name" },
                  { key: "class", label: "Class", align: "center" },
                  { label: "Stream", align: "center" },
                  { label: "Gender", align: "center" },
                  {
                    key: "dateRegistered",
                    label: "Registered",
                    align: "center",
                  },
                  { label: "Status", align: "center" },
                  { label: "Action", align: "right" },
                ]}
                sortConfig={sortConfig}
                onSort={handleSort}
                showCheckbox={true}
                isAllSelected={
                  selectedIds.size === paginatedStudents.length &&
                  paginatedStudents.length > 0
                }
                onSelectAll={handleToggleSelectAll}
              />
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.length === 0 ? (
                  <EmptyState onAdd={() => alert("Add student")} />
                ) : (
                  paginatedStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      isSelected={selectedIds.has(student.id)}
                      onToggleSelect={() => handleToggleSelect(student.id)}
                      onClassChange={handleClassChange}
                      onDelete={(id: string) => {
                        setActiveStudentId(id);
                        setModalType("delete");
                      }}
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
        isOpen={modalType === "delete" || modalType === "bulkDelete"}
        onClose={() => {
          setModalType(null);
          setActiveStudentId(null);
        }}
        onConfirm={handleDelete}
        title={
          modalType === "bulkDelete" ? "Bulk Delete Students" : "Delete Student"
        }
        description={
          modalType === "bulkDelete"
            ? `You are about to delete ${selectedIds.size} students. This action cannot be undone.`
            : "This will permanently remove this student record. Are you sure you want to proceed?"
        }
        confirmText="Yes, delete"
        confirmVariant="danger"
      />
    </div>
  );
}
