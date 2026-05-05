import { Controller, Get, Patch, Body, UseGuards, Post, Request, Param, Delete } from "@nestjs/common";
import { ClassSubjectService } from "./class-subject.service.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../common/roles.decorator.js";
import { Role } from "@reportwise/shared";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AssignSubjectDto } from "@reportwise/shared";
import { ApiAssignSubjectDto, ApiCreateSubjectDto } from "../apiDtos/index.js";

@ApiTags('Subjects')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectController {
    constructor(private readonly svc: ClassSubjectService) {}

    @ApiOperation({
        summary: 'Create a new subject',
        description: 'Creates a new subject that can be assigned to classes.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiCreateSubjectDto })
    @ApiResponse({ status: 201, description: 'The subject has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 409, description: 'Subject with the same name already exists.' })
    @Post()
    @Roles(Role.ADMIN, Role.TEACHER)
    createSubject(@Request() req, @Body() dto: { subjectName: string }) {
        return this.svc.createSubject(req.user.schoolSlug, dto.subjectName);
    }

    @ApiOperation({
        summary: 'List all subjects',
        description: 'Retrieves a list of all subjects available in the school.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns a list of subjects.' })
    @ApiResponse({ status: 404, description: 'No subjects found.' })
    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    listSubjects(@Request() req) {
        return this.svc.listSubjects(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Update subject name',
        description: 'Updates the name of an existing subject.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiCreateSubjectDto })
    @ApiResponse({ status: 200, description: 'The subject name has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 404, description: 'Subject not found.' })
    @ApiResponse({ status: 409, description: 'Subject with the same name already exists.' })
    @Patch(':subjectId')
    @Roles(Role.ADMIN, Role.TEACHER)
    updateSubject(@Request() req, @Param('subjectId') subjectId: string, @Body() dto: { subjectName: string }) {
        return this.svc.updateSubject(req.user.schoolSlug, subjectId, dto.subjectName);
    }

    @ApiOperation({
        summary: 'Delete a subject',
        description: 'Deletes a subject from the school. This action cannot be undone.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'The subject has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Subject not found.' })
    @ApiResponse({ status: 409, description: 'Subject cannot be deleted because it is assigned to one or more classes.' })
    @Delete(':subjectId')
    @Roles(Role.ADMIN)
    deleteSubject(@Request() req, @Param('subjectId') subjectId: string) {
        return this.svc.deleteSubject(req.user.schoolSlug, subjectId);
    }
}


@ApiTags('Class Subjects')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassSubjectController {
    constructor(private readonly svc: ClassSubjectService) {}
    @ApiOperation({
        summary: 'List all classes',
        description: 'Retrieves a list of all classes in the school along with their assigned subjects.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns a list of all classes in the school' })
    @ApiResponse({ status: 404, description: 'No classes found.' })
    @Get('all')
    @Roles(Role.ADMIN, Role.TEACHER)
    listAllClasses(@Request() req) {
        return this.svc.listAllClasses(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Retrieve all classes with their assigned subjects',
        description: 'Returns a list of all classes along with the subjects assigned to each class.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns a list of classes with their subjects.' })
    @ApiResponse({ status: 404, description: 'No classes found.' })
    @Get()
    @Roles(Role.ADMIN, Role.TEACHER)
    listClassesWithSubjects(@Request() req) {
        return this.svc.listClasses(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Retrieve a specific class with its assigned subjects',
        description: 'Returns the details of a specific class along with the subjects assigned to it.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns the class details with its subjects.' })
    @ApiResponse({ status: 404, description: 'Class not found.' })
    @Get(':classId')
    @Roles(Role.ADMIN, Role.TEACHER)
    getClassWithSubjects(@Request() req, @Param('classId') classId: string) {
        return this.svc.getClassById(req.user.schoolSlug, classId);
    }

    @ApiOperation({
        summary: 'Assign a subject to a class',
        description: 'Assigns a subject to a specific class.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiAssignSubjectDto })
    @ApiResponse({ status: 200, description: 'The subject has been successfully assigned to the class.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 404, description: 'Class or subject not found.' })
    @ApiResponse({ status: 409, description: 'Subject is already assigned to the class.' })
    @Post(':classId/subjects')
    @Roles(Role.ADMIN, Role.TEACHER)
    assignSubjectsToClass(@Request() req, @Param('classId') classId: string, @Body() dto: ApiAssignSubjectDto) {
        return this.svc.assignSubjectToClass(req.user.schoolSlug, classId, dto);
    }

    @ApiOperation({
        summary: 'Remove a subject from a class',
        description: 'Removes the assignment of a subject from a class.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'The subject has been successfully removed from the class.' })
    @ApiResponse({ status: 404, description: 'Class-subject assignment not found.' })
    @Delete('subjects/:classSubjectId')
    @Roles(Role.ADMIN)
    removeSubjectFromClass(@Request() req, @Param('classSubjectId') classSubjectId: string) {
        return this.svc.removeSubjectFromClass(req.user.schoolSlug, classSubjectId);
    }

    @ApiOperation({
        summary: 'Assign subjects to a class',
        description: 'Bulk updates the subjects assigned to a class.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: [ApiAssignSubjectDto] })
    @ApiResponse({ status: 200, description: 'The subjects have been successfully assigned to the class.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 404, description: 'Class or subject not found.' })
    @Post(':classId/subjects/bulk')
    @Roles(Role.ADMIN)
    bulkAssignSubjects(@Request() req, @Param('classId') classId: string, @Body() dto: ApiAssignSubjectDto[]) {
        return this.svc.bulkAssignSubjects(req.user.schoolSlug, classId, dto);
    }
}