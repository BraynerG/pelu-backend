"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const create_reservation_use_case_1 = require("../../application/use-cases/create-reservation.use-case");
const get_reservations_use_case_1 = require("../../application/use-cases/get-reservations.use-case");
const update_reservation_status_use_case_1 = require("../../application/use-cases/update-reservation-status.use-case");
const reschedule_reservation_use_case_1 = require("../../application/use-cases/reschedule-reservation.use-case");
const create_reservation_dto_1 = require("../../application/dtos/create-reservation.dto");
const reservation_entity_1 = require("../../domain/entities/reservation.entity");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../auth/roles.guard");
const roles_decorator_1 = require("../../auth/roles.decorator");
const optional_jwt_auth_guard_1 = require("../../auth/optional-jwt-auth.guard");
let ReservationsController = class ReservationsController {
    createReservationUseCase;
    getReservationsUseCase;
    updateReservationStatusUseCase;
    rescheduleReservationUseCase;
    constructor(createReservationUseCase, getReservationsUseCase, updateReservationStatusUseCase, rescheduleReservationUseCase) {
        this.createReservationUseCase = createReservationUseCase;
        this.getReservationsUseCase = getReservationsUseCase;
        this.updateReservationStatusUseCase = updateReservationStatusUseCase;
        this.rescheduleReservationUseCase = rescheduleReservationUseCase;
    }
    async create(createReservationDto, req) {
        const userId = req.user?.id;
        const reservation = await this.createReservationUseCase.execute(createReservationDto, userId);
        return {
            success: true,
            data: reservation,
        };
    }
    async findAll() {
        const reservations = await this.getReservationsUseCase.execute();
        return {
            success: true,
            data: reservations,
        };
    }
    async updateStatus(id, status) {
        const reservation = await this.updateReservationStatusUseCase.execute(id, status);
        return {
            success: true,
            data: reservation,
        };
    }
    async reschedule(id, date) {
        const reservation = await this.rescheduleReservationUseCase.execute(id, new Date(date));
        return {
            success: true,
            data: reservation,
        };
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_1.CreateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/reschedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "reschedule", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [create_reservation_use_case_1.CreateReservationUseCase,
        get_reservations_use_case_1.GetReservationsUseCase,
        update_reservation_status_use_case_1.UpdateReservationStatusUseCase,
        reschedule_reservation_use_case_1.RescheduleReservationUseCase])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map