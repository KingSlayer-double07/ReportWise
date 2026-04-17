import {
  Role, Stream, ClassLevel, TermNumber,
  SchoolStatus, PlanTier,
} from "../enums/index.js";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export interface JwtPayload {
  sub:        string;   // userId
  role:       Role;
  schoolSlug: string | null;  // null for SuperAdmin
  iat?:       number;
  exp?:       number;
  mustChangePassword: boolean;
}

// ─────────────────────────────────────────────
// USER & PROFILES
// ─────────────────────────────────────────────

export interface User {
  id:                 string;
  role:               Role;
  email?:             string | null;  // Admin
  staffId?:           string | null;  // Teacher
  admissionNumber?:   string | null;  // Student
  mustChangePassword: boolean;
  createdAt:          string;
  updatedAt:          string;
}

export interface AdminProfile {
  id:        string;
  userId:    string;
  firstName: string;
  lastName:  string;
  user?:     User;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  id:        string;
  userId:    string;
  firstName: string;
  lastName:  string;
  classId:   string | null;
  class?:    Class;
  user?:     User;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id:             string;
  userId:         string;
  firstName:      string;
  lastName:       string;
  middleName?:    string | null;
  dateOfBirth?:   string | null;
  gender?:        string | null;
  stateOfOrigin?: string | null;
  parentName?:    string | null;
  parentContact?:   string | null;
  parentEmail?:   string | null;
  address?:       string | null;
  photoUrl?:      string | null;
  user?:          User;
  createdAt:      string;
  updatedAt:      string;
}

// ─────────────────────────────────────────────
// ACADEMIC STRUCTURE
// ─────────────────────────────────────────────

export interface Class {
  id:        string;
  level:     ClassLevel;
  subjects?: ClassSubject[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id:        string;
  name:      string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSubject {
  id:        string;
  classId:   string;
  subjectId: string;
  subject?:  Subject;
  stream:    Stream;
  isCore:    boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// SESSION & TERM
// ─────────────────────────────────────────────

export interface AcademicSession {
  id:        string;
  label:     string;      // e.g. "2025/2026"
  startDate: string;
  endDate:   string;
  isActive:  boolean;
  terms?:    TermRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface TermRecord {
  id:         string;
  sessionId:  string;
  session?:   AcademicSession;
  termNumber: TermNumber;
  startDate:  string;
  endDate:    string;
  isActive:   boolean;
  createdAt:  string;
  updatedAt:  string;
}

// ─────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────

export interface StudentEnrollment {
  id:        string;
  studentId: string;
  student?:  StudentProfile;
  classId:   string;
  class?:    Class;
  sessionId: string;
  session?:  AcademicSession;
  stream:    Stream;
  isActive:  boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// SCORES
// ─────────────────────────────────────────────

export interface Score {
  id:        string;
  studentId: string;
  subjectId: string;
  subject?:  Subject;
  termId:    string;
  sessionId: string;
  caScore:   number;
  examScore: number;
  total:     number;
  grade:     string;
  remark:    string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// REPORT SHEET
// ─────────────────────────────────────────────

export interface ReportSheet {
  id:             string;
  studentId:      string;
  student?:       StudentProfile;
  termId:         string;
  term?:          TermRecord;
  sessionId:      string;
  session?:       AcademicSession;
  classId:        string;
  overallAverage: number;
  classPosition:  number;
  totalStudents:  number;
  teacherRemark?: string | null;
  attendance?:    number | null;
  daysInSession?: number | null;
  conduct?:       string | null;
  isGenerated:    boolean;
  scores?:        Score[];
  createdAt:      string;
  updatedAt:      string;
}

// ─────────────────────────────────────────────
// PROMOTION
// ─────────────────────────────────────────────

export interface Promotion {
  id:               string;
  studentId:        string;
  student?:         StudentProfile;
  fromClassId:      string;
  fromClass?:       Class;
  toClassId:        string | null;
  toClass?:         Class | null;
  sessionId:        string;
  teacherId:        string;
  computedEligible: boolean;
  promoted:         boolean;
  newStream?:       Stream | null;  // set only when promoting JSS3 → SSS1
  promotionDate:        string;
}

// ─────────────────────────────────────────────
// GRADUATION
// ─────────────────────────────────────────────

export interface GraduatedStudent {
  id:               string;
  studentId:        string;
  firstName:        string;
  lastName:         string;
  middleName?:      string | null;
  dateOfBirth:      string;
  admissionNumber:  string;
  graduationSession:string;
  stream:           Stream;
  finalAverage?:    number | null;
  graduationDate:        string;
}

// ─────────────────────────────────────────────
// SCHOOL CONFIG
// ─────────────────────────────────────────────

export interface GradeBand {
  min:    number;
  max:    number;
  grade:  string;
  remark: string;
}

export interface SchoolConfig {
  id:                   string;
  caWeight:             number;
  examWeight:           number;
  jssGradeBands:        GradeBand[];
  sssGradeBands:        GradeBand[];
  minAveragePercent:    number;
  minCoreSubjectPercent:number;
  schoolName:           string;
  logoUrl?:             string | null;
  primaryColor?:        string | null;
  createdAt:            string;
  updatedAt:            string;
}

// ─────────────────────────────────────────────
// PUBLIC SCHEMA (platform-level)
// ─────────────────────────────────────────────

export interface School {
  id:           string;
  name:         string;
  slug:         string;
  status:       SchoolStatus;
  planTier:     PlanTier;
  adminEmail:   string;
  schemaName:   string;
  studentCount: number;
  lastActiveAt?: string | null;
  createdAt:    string;
  updatedAt:    string;
}

export interface BillingRecord {
  id:           string;
  schoolId:     string;
  amount:       number;
  sessionLabel: string;
  studentCount: number;
  paystackRef?: string | null;
  paidAt?:      string | null;
  createdAt:    string;
}