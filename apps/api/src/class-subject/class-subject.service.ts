import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { withTenant, retry } from '../common/tenantHelper.utils.js';
import { randomUUID } from 'crypto';
import { AssignSubjectDto, Stream } from '@reportwise/shared';

@Injectable()
export class ClassSubjectService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: any) {}

  async validateSubjectName(subjectName: string) {
    if (!subjectName || subjectName.trim() === '') {
      throw new BadRequestException('Subject name cannot be empty.');
    }
    if (subjectName.length < 3) {
      throw new BadRequestException(
        'Subject name must be at least 3 characters long.',
      );
    }
    if (subjectName.length > 50) {
      throw new BadRequestException(
        'Subject name cannot exceed 50 characters.',
      );
    }
    if (/[^a-zA-Z\s]/.test(subjectName)) {
      throw new BadRequestException(
        'Subject name can only contain letters and spaces.',
      );
    }
  }
  /** POST /subjects Create a new subject */
  async createSubject(schoolSlug: string, subjectName: string) {
    // Validate subject name
    await this.validateSubjectName(subjectName);

    // Check if subject already exists
    const existingSubject: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
                WHERE "name" = ${subjectName}
                LIMIT 1
            `,
      ),
    );
    if (existingSubject.length > 0) {
      throw new ConflictException(
        `Subject with name "${subjectName}" already exists. Subject names must be unique.`,
      );
    }

    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$executeRaw`
                INSERT INTO "Subject" ("id", "name", "updatedAt")
                VALUES (${randomUUID()}, ${subjectName}, NOW())
                RETURNING *
            `,
      ),
    );
    return { message: 'Subject created successfully' };
  }

  /** GET /subjects Retrieve all subjects */
  async listSubjects(schoolSlug: string) {
    const subjects: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
            `,
      ),
    );
    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('No subjects found.');
    }
    return subjects;
  }

  /** PATCH /subjects/<subjectId> Rename a subject */
  async updateSubject(schoolSlug: string, subjectId: string, newName: string) {
    // Validate subject name
    await this.validateSubjectName(newName);
    // Check if subject exists
    const existingSubject: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
                WHERE id = ${subjectId}
                LIMIT 1
            `,
      ),
    );
    if (existingSubject.length === 0) {
      throw new NotFoundException(`Subject with ID "${subjectId}" not found.`);
    }
    // Verify Subject name is unique
    const duplicateSubject: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
                WHERE "name" = ${newName}
                AND id != ${subjectId}
                `,
      ),
    );
    if (duplicateSubject.length > 0) {
      throw new ConflictException(
        `Subject with name "${newName}" already exists. Subject names must be unique.`,
      );
    }

    // Update the subject name
    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$executeRaw`
                UPDATE "Subject"
                SET "name" = ${newName}, "updatedAt" = NOW()
                WHERE id = ${subjectId}
            `,
      ),
    );
    return { message: 'Subject updated successfully' };
  }

  /** DELETE /subjects/<subjectId> Delete a subject */
  async deleteSubject(schoolSlug: string, subjectId: string) {
    // Check if subject exists
    const existingSubject: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
                WHERE id = ${subjectId}
                LIMIT 1
            `,
      ),
    );
    if (existingSubject.length === 0) {
      throw new NotFoundException(`Subject with ID "${subjectId}" not found.`);
    }
    // Check if subject is assigned to any class
    const assignedClasses: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "ClassSubject"
                WHERE "subjectId" = ${subjectId}
            `,
      ),
    );
    if (assignedClasses.length > 0) {
      throw new ConflictException(
        `Subject with ID "${subjectId}" is assigned to one or more classes and cannot be deleted.`,
      );
    }
    // Delete the subject
    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$executeRaw`
                DELETE FROM "Subject"
                WHERE id = ${subjectId}
            `,
      ),
    );
    return { message: 'Subject deleted successfully' };
  }

  /** GET /classes/all Retrieve all classes in the school */
  async listAllClasses(schoolSlug: string) {
    const classes: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Class"
            `,
      ),
    );
    if (!classes || classes.length === 0) {
      throw new NotFoundException('No classes found.');
    }
    return classes;
  }

  /** GET /classes Retrieve all classes with their assigned subjects */
  async listClasses(schoolSlug: string) {
    const classes: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "ClassSubject"
            `,
      ),
    );
    if (!classes || classes.length === 0) {
      throw new NotFoundException('No classes linked to subjects found.');
    }
    return classes;
  }

  /** GET /classes/:id Retrieve a specific class with its assigned subjects grouped by stream */
  async getClassById(schoolSlug: string, classId: string) {
    const classWithSubjects: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "ClassSubject"
                WHERE "classId" = ${classId}
                GROUP BY "stream"
            `,
      ),
    );
    if (!classWithSubjects || classWithSubjects.length === 0) {
      throw new NotFoundException('No class found with the specified ID.');
    }
    return classWithSubjects;
  }

  async assignSubjectFunction(
    schoolSlug: string,
    classId: string,
    dto: AssignSubjectDto,
  ) {
    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$executeRaw`
                INSERT INTO "ClassSubject" ("id", "classId", "subjectId", "stream")
                VALUES (${randomUUID()}, ${classId}, ${dto.subjectId}, ${dto.stream})
            `,
      ),
    );
  }

  async validateSubjectAssignmentFunction(
    schoolSlug: string,
    classId: string,
    dto: AssignSubjectDto,
  ) {
    // Validate stream
    if (Stream[dto.stream] === undefined) {
      throw new BadRequestException(
        `Stream "${dto.stream}" is not valid. Valid streams are: ${Object.keys(Stream).join(', ')}.`,
      );
    }
    // Check if class exists
    const existingClass: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Class"
                WHERE id = ${classId}
                LIMIT 1
            `,
      ),
    );
    if (existingClass.length === 0) {
      throw new NotFoundException(`Class with ID "${classId}" not found.`);
    }
    // Check if subject exists
    const existingSubject: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Subject"
                WHERE id = ${dto.subjectId}
                LIMIT 1
            `,
      ),
    );
    if (existingSubject.length === 0) {
      throw new NotFoundException(
        `Subject with ID "${dto.subjectId}" not found.`,
      );
    }
    // Validate JSS classes must have STREAM = 'NONE'
    const classLevel: string = existingClass[0].level;
    console.log('Class Level:', classLevel);
    if (classLevel.includes('JSS') && dto.stream !== Stream.NONE) {
      throw new BadRequestException(`JSS classes must have STREAM = 'NONE'.`);
    }
    // Validate subject cannot be assigned to the same class and stream more than once
    const existingAssignment: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "ClassSubject"
                WHERE "classId" = ${classId}
                AND "subjectId" = ${dto.subjectId}
                AND "stream" = ${dto.stream}
                LIMIT 1
            `,
      ),
    );
    if (existingAssignment.length > 0) {
      throw new ConflictException(
        `Subject with ID "${dto.subjectId}" is already assigned to class with ID "${classId}" and stream "${dto.stream}".`,
      );
    }
  }

  /** POST /classes Assign subjects to a class */
  async assignSubjectToClass(
    schoolSlug: string,
    classId: string,
    dto: AssignSubjectDto,
  ) {
    // Validate Input
    await this.validateSubjectAssignmentFunction(schoolSlug, classId, dto);
    // Assign the subject to the class
    await this.assignSubjectFunction(schoolSlug, classId, dto);
    return { message: 'Subject assigned to class successfully' };
  }

  /** DELETE /classes/subjects/:classSubjectId Remove a subject from a class */
  async removeSubjectFromClass(schoolSlug: string, classSubjectId: string) {
    // Check if class-subject assignment exists
    const existingAssignment: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "ClassSubject"
                WHERE id = ${classSubjectId}
                LIMIT 1
            `,
      ),
    );
    if (existingAssignment.length === 0) {
      throw new NotFoundException(
        `Class-subject assignment with ID "${classSubjectId}" not found.`,
      );
    }
    // Remove the subject from the class
    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$executeRaw`
                DELETE FROM "ClassSubject"
                WHERE id = ${classSubjectId}
            `,
      ),
    );
    return { message: 'Subject removed from class successfully' };
  }

  // POST /classes/:classId/subjects/bulk Bulk assign subjects to a class
  async bulkAssignSubjects(
    schoolSlug: string,
    classId: string,
    assignments: AssignSubjectDto[],
  ) {
    // Check if class exists
    const existingClass: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
                SELECT * FROM "Class"
                WHERE id = ${classId}
                LIMIT 1
            `,
      ),
    );
    if (existingClass.length === 0) {
      throw new NotFoundException(`Class with ID "${classId}" not found.`);
    }
    for (const dto of assignments) {
      // Validate each assignment
      await this.validateSubjectAssignmentFunction(schoolSlug, classId, dto);
      // Perform bulk insert
      console.log('Value:', dto);
      await this.assignSubjectFunction(schoolSlug, classId, dto);
    }
    return { message: 'Subjects assigned to class successfully' };
  }
}
