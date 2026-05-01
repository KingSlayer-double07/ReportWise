import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { Stream, TermNumber, PlanTier } from "@reportwise/database";


// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export class ApiLoginDto {
    @ApiProperty({
        description: "email for admin | staffId for teachers | admissionNumber for students",
        type: String
    })
    identifier!: string;

    @ApiProperty({
        description: "User Password",
        type: String
    })
    password!: string;
}

export class ApiChangePasswordDto {
  @ApiProperty({
        description: "Current password",
        type: String
    })
    currentPassword!: string;

  @ApiProperty({
        description: "New password",
        type: String
    })
    newPassword!: string;
}

export class AuthResponse {
  @ApiProperty({
        description: "The access token for the user",
        type: String
    })
    accessToken!: string;

  @ApiProperty({
        description: "The user information {id, role, name}",
        type: Object
    })
    user!: {
    id:    string;
    role:  string;
    name:  string;
  };
}

// ─────────────────────────────────────────────
// STUDENT
// ─────────────────────────────────────────────

export class CreateStudentDto {
    @ApiProperty({
        description: "Student's First Name"
    })
    firstName!:      string;

    @ApiProperty({
        description: "Student's Last Name"
    })
    lastName!:       string;

    @ApiPropertyOptional({
        description: "Student's Middle Name"
    })
    middleName?:    string;

    @ApiPropertyOptional({
        description: "Student's Date of Birth"
    })
  dateOfBirth?:   string;

  @ApiPropertyOptional({
    description: "Student's Gender"
  })
  gender?:        string;


  @ApiPropertyOptional({
    description: "Student's State of Origin"
  })
  stateOfOrigin?: string;

  @ApiPropertyOptional({
    description: "Parent's Name"
  })
  parentName?:    string;

  @ApiPropertyOptional({
    description: "Parent's Phone Number"
  })
  parentContact?:   string;
  parentEmail?:   string;
  address?:       string;
  classId!:        string;
  stream?:        Stream;   // required if enrolling into SSS class
  sessionId!:      string;
}

export class UpdateStudentDto {
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

export class CreateTeacherDto {
  firstName!: string;
  lastName!:  string;
  staffId!:   string;
  classId?:  string;
}

// ─────────────────────────────────────────────
// SCORE
// ─────────────────────────────────────────────

export class UpsertScoreDto {
  studentId!: string;
  subjectId!: string;
  termId!:    string;
  sessionId!: string;
  caScore!:   number;
  examScore!: number;
}

export class BulkUpsertScoresDto {
  scores!: UpsertScoreDto[];
}

// ─────────────────────────────────────────────
// REPORT SHEET
// ─────────────────────────────────────────────

export class UpdateReportSheetMetaDto {
  teacherRemark?: string;
  attendance?:    number;
  daysInSession?: number;
  conduct?:       string;
}

// ─────────────────────────────────────────────
// PROMOTION
// ─────────────────────────────────────────────

export class PromoteStudentDto {
  studentId!:  string;
  promoted!:   boolean;
  newStream?: Stream;  // required only for JSS3 → SSS1
}

export class BulkPromoteDto {
  sessionId!:  string;
  promotions!: PromoteStudentDto[];
}

// ─────────────────────────────────────────────
// SCHOOL CONFIG
// ─────────────────────────────────────────────

export class UpdateSchoolConfigDto {
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

export class AssignSubjectDto {
  subjectId!: string;
  stream!:    Stream;
  isCore!:    boolean;
}

// ─────────────────────────────────────────────
// ACADEMIC SESSION & TERM
// ─────────────────────────────────────────────

export class CreateSessionDto {
  label!:     string;  // e.g. "2025/2026"
  startDate!: string;
  endDate!:   string;
}

export class CreateTermDto {
  sessionId!:  string;
  termNumber!: TermNumber;
  startDate!:  string;
  endDate!:    string;
}

// ─────────────────────────────────────────────
// SUPER ADMIN
// ─────────────────────────────────────────────

export class ProvisionSchoolDto {
  name!:       string;
  slug!:       string;
  adminEmail!: string;
  planTier!:   PlanTier;
}
