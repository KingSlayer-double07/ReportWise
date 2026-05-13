export type Gender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'Active' | 'Graduated';
export type ClassLevel = 'JSS1' | 'JSS2' | 'JSS3' | 'SSS1' | 'SSS2' | 'SSS3';
export type Stream = 'Art' | 'Commercial' | 'Science';

export interface Student {
  id: string;
  admissionNumber: string;
  fullName: string;
  class: ClassLevel;
  stream?: Stream;
  gender: Gender;
  dateRegistered: string;
  status: StudentStatus;
  avatarUrl?: string;
  attendance: number;
  guardian: string;
}

export const CLASSES: ClassLevel[] = ['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'];
export const STREAMS: Stream[] = ['Art', 'Commercial', 'Science'];
export const GENDERS: Gender[] = ['Male', 'Female'];
export const STATUSES: StudentStatus[] = ['Active', 'Graduated'];
