export type Gender = 'Male' | 'Female' | 'Other';
export type TeacherStatus = 'Active' | 'On Leave' | 'Resigned';
export type Designation = 'Principal' | 'Vice Principal' | 'HOD' | 'Senior Teacher' | 'Teacher';

export interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  designation: Designation;
  subjects: string[];
  gender: Gender;
  dateJoined: string;
  status: TeacherStatus;
  avatarUrl?: string;
  attendance: number;
  email: string;
  phone: string;
}

export const DESIGNATIONS: Designation[] = ['Principal', 'Vice Principal', 'HOD', 'Senior Teacher', 'Teacher'];
export const GENDERS: Gender[] = ['Male', 'Female'];
export const STATUSES: TeacherStatus[] = ['Active', 'On Leave', 'Resigned'];
export const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Government', 'Literature'];
