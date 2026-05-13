import { Teacher, DESIGNATIONS, STATUSES as TEACHER_STATUSES, GENDERS as TEACHER_GENDERS, SUBJECTS } from '@/components/admin/teachers/types';
import { Student, CLASSES, STREAMS, GENDERS as STUDENT_GENDERS, STATUSES as STUDENT_STATUSES } from '@/components/admin/students/types';

// --- TYPES ---

export interface ActivityType {
  id: string;
  content: string;
  timestamp: string;
}

export interface ClassProgress {
  name: string;
  studentCount: number;
  scoresEntered: number;
  totalSubjects: number;
  teacher: string;
}

// --- DASHBOARD DATA ---

export const mockActivities: ActivityType[] = [
  { id: '1', content: 'Teacher Adamu uploaded scores for JSS2A', timestamp: '2 hours ago' },
  { id: '2', content: 'Student Amaka Obi registered', timestamp: '5 hours ago' },
  { id: '3', content: 'Term 2 started automatically', timestamp: '3 days ago' },
  { id: '4', content: 'Bulk export of Grade 10 reports completed', timestamp: '4 days ago' },
  { id: '5', content: 'Teacher Sarah assigned to SSS1 Science', timestamp: '1 week ago' },
  { id: '6', content: 'System maintenance completed', timestamp: '1 week ago' },
  { id: '7', content: 'Subscription renewed for 2024/2025 session', timestamp: '2 weeks ago' },
  { id: '8', content: 'Student David John graduated', timestamp: '2 weeks ago' },
  { id: '9', content: 'New teacher profile created: Mr. Benson', timestamp: '3 weeks ago' },
  { id: '10', content: 'Audit log exported by Admin', timestamp: '1 month ago' },
];

export const mockClassProgress: ClassProgress[] = [
  { name: 'JSS1', studentCount: 45, scoresEntered: 8, totalSubjects: 12, teacher: 'Mr. Okoro' },
  { name: 'JSS2', studentCount: 42, scoresEntered: 10, totalSubjects: 12, teacher: 'Mrs. Adebayo' },
  { name: 'JSS3', studentCount: 38, scoresEntered: 12, totalSubjects: 12, teacher: 'Mr. Ibrahim' },
  { name: 'SSS1', studentCount: 40, scoresEntered: 5, totalSubjects: 9, teacher: 'Mrs. Eze' },
  { name: 'SSS2', studentCount: 35, scoresEntered: 3, totalSubjects: 9, teacher: 'Mr. Nwosu' },
  { name: 'SSS3', studentCount: 30, scoresEntered: 0, totalSubjects: 9, teacher: 'Miss Chidimma' },
];

// --- TEACHERS DATA ---

const TEACHER_FIRST_NAMES = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Christopher', 'Ashley', 'James', 'Matthew', 'Robert', 'Mary', 'Jennifer', 'Patricia', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah'];
const TEACHER_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

export const mockTeachers: Teacher[] = Array.from({ length: 24 }).map((_, i) => {
  const firstName = TEACHER_FIRST_NAMES[i % TEACHER_FIRST_NAMES.length];
  const lastName = TEACHER_LAST_NAMES[i % TEACHER_LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const designation = DESIGNATIONS[Math.floor(Math.random() * DESIGNATIONS.length)];
  const status = TEACHER_STATUSES[Math.floor(Math.random() * TEACHER_STATUSES.length)];
  
  const numSubjects = Math.floor(Math.random() * 3) + 1;
  const teacherSubjects = [...SUBJECTS].sort(() => 0.5 - Math.random()).slice(0, numSubjects);

  return {
    id: (i + 1).toString(),
    teacherId: `TR2026${(i + 1).toString().padStart(3, '0')}`,
    fullName,
    designation,
    subjects: teacherSubjects,
    gender: TEACHER_GENDERS[Math.floor(Math.random() * TEACHER_GENDERS.length)],
    dateJoined: `202${Math.floor(Math.random() * 6)}-0${Math.floor(Math.random() * 9) + 1}-1${Math.floor(Math.random() * 9)}`,
    status,
    attendance: Math.floor(Math.random() * 15) + 85,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@reportwise.edu`,
    phone: `+234 80${Math.floor(Math.random() * 9)} 000 ${Math.floor(Math.random() * 9000).toString().padStart(4, '0')}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
  };
});

// --- STUDENTS DATA ---

const STUDENT_FIRST_NAMES = ['Aulia', 'Siti', 'Dimas', 'Danisa', 'Rani', 'Intan', 'Arif', 'Melati', 'Rizky', 'Putri', 'Budi', 'Chandra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Ika', 'Joko', 'Kartika'];
const STUDENT_LAST_NAMES = ['Rahman', 'Nurhaliza', 'Pratama', 'Rahadimas', 'Maharani', 'Permata', 'Setiawan', 'Ayu', 'Hidayat', 'Anindya', 'Santoso', 'Lestari', 'Yusuf', 'Indah', 'Kurniawan', 'Rudi', 'Prasetyo', 'Sari', 'Abdullah', 'Akbar'];

export const mockStudents: Student[] = Array.from({ length: 42 }).map((_, i) => {
  const firstName = STUDENT_FIRST_NAMES[i % STUDENT_FIRST_NAMES.length];
  const lastName = STUDENT_LAST_NAMES[i % STUDENT_LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const classLevel = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  return {
    id: (i + 1).toString(),
    admissionNumber: `202600${(i + 1).toString().padStart(2, '0')}`,
    fullName,
    class: classLevel,
    stream: classLevel.startsWith('SSS') ? STREAMS[Math.floor(Math.random() * STREAMS.length)] : undefined,
    gender: STUDENT_GENDERS[Math.floor(Math.random() * STUDENT_GENDERS.length)] as any,
    dateRegistered: `2026-0${Math.floor(Math.random() * 4) + 1}-1${Math.floor(Math.random() * 9)}`,
    status: STUDENT_STATUSES[Math.floor(Math.random() * STUDENT_STATUSES.length)] as any,
    attendance: Math.floor(Math.random() * 20) + 80,
    guardian: `${lastName} ${firstName}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
  };
});
