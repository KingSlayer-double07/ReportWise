import { Controller, Get, Patch, Body, Param, UseGuards, Post, Request } from '@nestjs/common';
import { AcademicSessionService } from './academic-session.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { Role } from '@reportwise/shared';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { CreateSessionDto, CreateTermDto, UpdateTermDto } from '@reportwise/shared';
import { ApiCreateSessionDto, ApiCreateTermDto, ApiUpdateTermDto } from '../apiDtos/index.js';

@ApiTags('Academic Sessions')
@Controller('academic-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicSessionController {
    constructor(private readonly svc: AcademicSessionService) {}

    @ApiOperation({
        summary: 'Create Academic Session',
        description: 'Creates a new academic session. Only one active session is allowed at a time.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiCreateSessionDto })
    @ApiResponse({ status: 201, description: 'The academic session has been successfully created.' })
    @ApiResponse({ status: 409, description: 'An active academic session already exists.' })
    @Post('sessions')
    @Roles(Role.ADMIN)
    createSession(@Request() req, @Body() dto: CreateSessionDto) {
        return this.svc.createSession(req.user.schoolSlug, dto);
    }

    @ApiOperation({
        summary: 'List Academic Sessions',
        description: 'Retrieves a list of all academic sessions.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns a list of academic sessions.' })
    @Get('sessions')
    @Roles(Role.ADMIN, Role.TEACHER)
    listSessions(@Request() req) {
        return this.svc.listSessions(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Get Active Academic Session',
        description: 'Retrieves the currently active academic session.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns the active academic session.' })
    @Get('sessions/active')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    getActiveSession(@Request() req) {
        return this.svc.getActiveSession(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Activate Academic Session',
        description: 'Activates an academic session by its ID. Deactivates any currently active session.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'The academic session has been successfully activated.' })
    @Patch('sessions/:id/activate')
    @Roles(Role.ADMIN)
    activateSession(@Request() req, @Param('id') id: string) {
        return this.svc.activateSession(req.user.schoolSlug, id);
    }

    @ApiOperation({
        summary: 'Create new academic term',
        description: 'Creates a new academic term within the specified academic session. Only one active term is allowed at a time.', 
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiCreateTermDto })
    @ApiResponse({ status: 201, description: 'The academic term has been successfully created.' })
    @ApiResponse({ status: 409, description: 'Conflict Errors' })
    @ApiResponse({ status: 404, description: 'Academic session not found.' })
    @Post('sessions/:sessionId/terms')
    @Roles(Role.ADMIN)
    createTerm(@Request() req, @Body() dto: CreateTermDto) {
        return this.svc.createTerm(req.user.schoolSlug, dto);
    }

    @ApiOperation({
        summary: 'List Academic Terms',
        description: 'Retrieves a list of all academic terms.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Returns a list of academic terms.' })
    @ApiResponse({ status: 404, description: 'Academic session not found.' })
    @Get('sessions/terms/active')
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    getActiveTerm(@Request() req) {
        return this.svc.getActiveTerm(req.user.schoolSlug);
    }

    @ApiOperation({
        summary: 'Activate academic term',
        description: 'Activates an academic term by its ID. Deactivates any currently active term.',
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'The academic term has been successfully activated.' })
    @ApiResponse({ status: 404, description: 'Academic term not found.' })
    @Patch('sessions/terms/:termId/activate')
    @Roles(Role.ADMIN)
    activateTerm(@Request() req, @Param('termId') termId: string) {
        return this.svc.activateTerm(req.user.schoolSlug, termId);
    }

    @ApiOperation({
        summary: 'Update academic term dates',
        description: 'Updates the start and end dates of an academic term.',
    })
    @ApiBearerAuth()
    @ApiBody({ type: ApiUpdateTermDto })
    @ApiResponse({ status: 200, description: 'The academic term dates have been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Academic term not found.' })
    @Patch('sessions/terms/:termId/dates')
    @Roles(Role.ADMIN)
    updateTermDates(@Request() req, @Param('termId') termId: string, @Body() dto: UpdateTermDto) {
        return this.svc.updateTermDates(req.user.schoolSlug, termId, dto);
    }
}
