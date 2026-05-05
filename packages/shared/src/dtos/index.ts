import { Stream, ClassLevel, TermNumber, PlanTier } from "../enums/index.js";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export interface LoginDto {
  identifier: string;  // email | staffId | admissionNumber
  password:   string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword:     string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id:    string;
    role:  string;
    name:  string;
  };
}

// ─────────────────────────────────────────────
// STUDENT
// ─────────────────────────────────────────────

export interface CreateStudentDto {
  firstName:      string;
  lastName:       string;
  middleName?:    string;
  dateOfBirth?:   string;
  gender?:        string;
  stateOfOrigin?: string;
  parentName?:    string;
  parentContact?:   string;
  parentEmail?:   string;
  address?:       string;
  classId:        string;
  stream?:        Stream;   // required if enrolling into SSS class
  sessionId:      string;
}

export interface UpdateStudentDto {
  firstName?:     string;
  lastName?:      string;
  middleName?:    string;
  dateOfBirth?:   string;
  gender?:        string;
  stateOfOrigin?: string;
  parentName?:    string;
  parentContact?:   string;
  parentEmail?:   string;
  address?:       string;
}

// ─────────────────────────────────────────────
// TEACHER
// ─────────────────────────────────────────────

export interface CreateTeacherDto {
  firstName: string;
  lastName:  string;
  staffId:   string;
  classId?:  string;
}

// ─────────────────────────────────────────────
// SCORE
// ─────────────────────────────────────────────

export interface UpsertScoreDto {
  studentId: string;
  subjectId: string;
  termId:    string;
  sessionId: string;
  caScore:   number;
  examScore: number;
}

export interface BulkUpsertScoresDto {
  scores: UpsertScoreDto[];
}

// ─────────────────────────────────────────────
// REPORT SHEET
// ─────────────────────────────────────────────

export interface UpdateReportSheetMetaDto {
  teacherRemark?: string;
  attendance?:    number;
  daysInSession?: number;
  conduct?:       string;
}

// ─────────────────────────────────────────────
// PROMOTION
// ─────────────────────────────────────────────

export interface PromoteStudentDto {
  studentId:  string;
  promoted:   boolean;
  newStream?: Stream;  // required only for JSS3 → SSS1
}

export interface BulkPromoteDto {
  sessionId:  string;
  promotions: PromoteStudentDto[];
}

// ─────────────────────────────────────────────
// SCHOOL CONFIG
// ─────────────────────────────────────────────

export interface UpdateSchoolConfigDto {
  caWeight?:              number;
  examWeight?:            number;
  jssGradeBands?:         Array<{
    min: number; max: number; grade: string; remark: string;
  }>;
  sssGradeBands?:         Array<{
    min: number; max: number; grade: string; remark: string;
  }>;
  minAveragePercent?:     number;
  minCoreSubjectPercent?: number;
  schoolName?:            string;
  primaryColor?:          string;
}

// ─────────────────────────────────────────────
// CLASS & SUBJECT
// ─────────────────────────────────────────────

export interface AssignSubjectDto {
  subjectId: string;
  stream:    Stream;
  isCore:    boolean;
}

// ─────────────────────────────────────────────
// ACADEMIC SESSION & TERM
// ─────────────────────────────────────────────

export interface CreateSessionDto {
  label:     string;  // e.g. "2025/2026"
  startDate: string;
  endDate:   string;
}

export interface CreateTermDto {
  sessionId:  string;
  termNumber: TermNumber;
  startDate:  string;
  endDate:    string;
}

export interface UpdateTermDto {
  termId:     string;
  termNumber?: TermNumber;
  startDate?:  string;
  endDate?:    string;
}

// ─────────────────────────────────────────────
// SUPER ADMIN
// ─────────────────────────────────────────────

export interface ProvisionSchoolDto {
  name:       string;
  slug:       string;
  adminEmail: string;
  planTier:   PlanTier;
}