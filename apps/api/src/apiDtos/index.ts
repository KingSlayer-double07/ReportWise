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
        description: "Student's First Name",
        type: String
    })
    firstName!: string;

    @ApiProperty({
        description: "Student's Last Name",
        type: String
    })
    lastName!: string;

    @ApiPropertyOptional({
        description: "Student's Middle Name",
        type: String
    })
    middleName?: string;

    @ApiPropertyOptional({
        description: "Student's Date of Birth",
        type: String
    })
    dateOfBirth?: string;

    @ApiPropertyOptional({
        description: "Student's Gender",
        type: String
    })
    gender?: string;

    @ApiPropertyOptional({
        description: "Student's State of Origin",
        type: String
    })
    stateOfOrigin?: string;

    @ApiPropertyOptional({
        description: "Parent's Name",
        type: String
    })
    parentName?: string;

    @ApiPropertyOptional({
        description: "Parent's Phone Number",
        type: String
    })
    parentContact?: string;

    @ApiPropertyOptional({
        description: "Parent's Email Address",
        type: String
    })
    parentEmail?: string;

    @ApiPropertyOptional({
        description: "Student's Address",
        type: String
    })
    address?: string;

    @ApiProperty({
        description: "ID of the class the student is enrolled in",
        type: String
    })
    classId!: string;

    @ApiPropertyOptional({
        description: "Student stream; required if enrolling into SSS class",
        type: String
    })
    stream?: Stream;

    @ApiProperty({
        description: "ID of the academic session for the student",
        type: String
    })
    sessionId!: string;
}

export class UpdateStudentDto {
    @ApiPropertyOptional({
        description: "Student's First Name",
        type: String
    })
    firstName?: string;

    @ApiPropertyOptional({
        description: "Student's Last Name",
        type: String
    })
    lastName?: string;

    @ApiPropertyOptional({
        description: "Student's Middle Name",
        type: String
    })
    middleName?: string;

    @ApiPropertyOptional({
        description: "Student's Date of Birth",
        type: String
    })
    dateOfBirth?: string;

    @ApiPropertyOptional({
        description: "Student's Gender",
        type: String
    })
    gender?: string;

    @ApiPropertyOptional({
        description: "Student's State of Origin",
        type: String
    })
    stateOfOrigin?: string;

    @ApiPropertyOptional({
        description: "Parent's Name",
        type: String
    })
    parentName?: string;

    @ApiPropertyOptional({
        description: "Parent's Phone Number",
        type: String
    })
    parentContact?: string;

    @ApiPropertyOptional({
        description: "Parent's Email Address",
        type: String
    })
    parentEmail?: string;

    @ApiPropertyOptional({
        description: "Student's Address",
        type: String
    })
    address?: string;
}

// ─────────────────────────────────────────────
// TEACHER
// ─────────────────────────────────────────────

export class CreateTeacherDto {
    @ApiProperty({
        description: "Teacher's First Name",
        type: String
    })
    firstName!: string;

    @ApiProperty({
        description: "Teacher's Last Name",
        type: String
    })
    lastName!: string;

    @ApiProperty({
        description: "Teacher's staff identifier",
        type: String
    })
    staffId!: string;

    @ApiPropertyOptional({
        description: "Assigned class ID",
        type: String
    })
    classId?: string;
}

// ─────────────────────────────────────────────
// SCORE
// ─────────────────────────────────────────────

export class UpsertScoreDto {
    @ApiProperty({
        description: "Student ID",
        type: String
    })
    studentId!: string;

    @ApiProperty({
        description: "Subject ID",
        type: String
    })
    subjectId!: string;

    @ApiProperty({
        description: "Term ID",
        type: String
    })
    termId!: string;

    @ApiProperty({
        description: "Session ID",
        type: String
    })
    sessionId!: string;

    @ApiProperty({
        description: "Continuous assessment score",
        type: Number
    })
    caScore!: number;

    @ApiProperty({
        description: "Exam score",
        type: Number
    })
    examScore!: number;
}

export class BulkUpsertScoresDto {
    @ApiProperty({
        description: "List of score payloads to upsert",
        type: UpsertScoreDto,
        isArray: true
    })
    scores!: UpsertScoreDto[];
}

// ─────────────────────────────────────────────
// REPORT SHEET
// ─────────────────────────────────────────────

export class UpdateReportSheetMetaDto {
    @ApiPropertyOptional({
        description: "Teacher's remark on the report sheet",
        type: String
    })
    teacherRemark?: string;

    @ApiPropertyOptional({
        description: "Student attendance count",
        type: Number
    })
    attendance?: number;

    @ApiPropertyOptional({
        description: "Number of days in the session",
        type: Number
    })
    daysInSession?: number;

    @ApiPropertyOptional({
        description: "Conduct remark",
        type: String
    })
    conduct?: string;
}

// ─────────────────────────────────────────────
// PROMOTION
// ─────────────────────────────────────────────

export class PromoteStudentDto {
    @ApiProperty({
        description: "Student ID",
        type: String
    })
    studentId!: string;

    @ApiProperty({
        description: "Promotion status",
        type: Boolean
    })
    promoted!: boolean;

    @ApiPropertyOptional({
        description: "New stream when promoting to SSS1",
        type: String
    })
    newStream?: Stream;
}

export class BulkPromoteDto {
    @ApiProperty({
        description: "Academic session ID for promotions",
        type: String
    })
    sessionId!: string;

    @ApiProperty({
        description: "List of student promotions",
        type: PromoteStudentDto,
        isArray: true
    })
    promotions!: PromoteStudentDto[];
}

// ─────────────────────────────────────────────
// SCHOOL CONFIG
// ─────────────────────────────────────────────

export class UpdateSchoolConfigDto {
    @ApiPropertyOptional({
        description: "Continuous assessment weight percentage",
        type: Number
    })
    caWeight?: number;

    @ApiPropertyOptional({
        description: "Exam weight percentage",
        type: Number
    })
    examWeight?: number;

    @ApiPropertyOptional({
        description: "JSS grade band definitions",
        type: Object,
        isArray: true
    })
    jssGradeBands?: Array<{
        min: number;
        max: number;
        grade: string;
        remark: string;
    }>;

    @ApiPropertyOptional({
        description: "SSS grade band definitions",
        type: Object,
        isArray: true
    })
    sssGradeBands?: Array<{
        min: number;
        max: number;
        grade: string;
        remark: string;
    }>;

    @ApiPropertyOptional({
        description: "Minimum average percentage for passing",
        type: Number
    })
    minAveragePercent?: number;

    @ApiPropertyOptional({
        description: "Minimum core subject percentage for passing",
        type: Number
    })
    minCoreSubjectPercent?: number;

    @ApiPropertyOptional({
        description: "School name",
        type: String
    })
    schoolName?: string;

    @ApiPropertyOptional({
        description: "Primary brand color",
        type: String
    })
    primaryColor?: string;
}

// ─────────────────────────────────────────────
// CLASS & SUBJECT
// ─────────────────────────────────────────────

export class AssignSubjectDto {
    @ApiProperty({
        description: "Subject ID",
        type: String
    })
    subjectId!: string;

    @ApiProperty({
        description: "Stream for the subject assignment",
        type: String
    })
    stream!: Stream;

    @ApiProperty({
        description: "Whether the subject is core",
        type: Boolean
    })
    isCore!: boolean;
}

// ─────────────────────────────────────────────
// ACADEMIC SESSION & TERM
// ─────────────────────────────────────────────

export class ApiCreateSessionDto {
    @ApiProperty({
        description: "Academic session label",
        type: String
    })
    label!: string;

    @ApiProperty({
        description: "Session start date",
        type: String
    })
    startDate!: string;

    @ApiProperty({
        description: "Session end date",
        type: String
    })
    endDate!: string;
}

export class ApiCreateTermDto {
    @ApiProperty({
        description: "Academic session ID",
        type: String
    })
    sessionId!: string;

    @ApiProperty({
        description: "Term number",
        type: String
    })
    termNumber!: TermNumber;

    @ApiProperty({
        description: "Term start date",
        type: String
    })
    startDate!: string;

    @ApiProperty({
        description: "Term end date",
        type: String
    })
    endDate!: string;
}

export class ApiUpdateTermDto {
  @ApiProperty({
    description: "Term ID",
    type: String
  })
  termId!: string;
  
  @ApiPropertyOptional({
    description: "Term number",
    type: String
  })
  termNumber?: TermNumber;

  @ApiPropertyOptional({
    description: "Term start date",
    type: String
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: "Term end date",
    type: String
  })
  endDate?: string;
}

// ─────────────────────────────────────────────
// SUPER ADMIN
// ─────────────────────────────────────────────

export class ProvisionSchoolDto {
    @ApiProperty({
        description: "School name",
        type: String
    })
    name!: string;

    @ApiProperty({
        description: "School slug",
        type: String
    })
    slug!: string;

    @ApiProperty({
        description: "Administrator email address",
        type: String
    })
    adminEmail!: string;

    @ApiProperty({
        description: "Selected plan tier",
        type: String
    })
    planTier!: PlanTier;
}
