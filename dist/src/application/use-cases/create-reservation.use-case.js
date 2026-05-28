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
exports.CreateReservationUseCase = void 0;
const common_1 = require("@nestjs/common");
const reservation_repository_interface_1 = require("../../domain/interfaces/reservation.repository.interface");
const service_repository_interface_1 = require("../../domain/interfaces/service.repository.interface");
const reservation_entity_1 = require("../../domain/entities/reservation.entity");
let CreateReservationUseCase = class CreateReservationUseCase {
    reservationRepository;
    serviceRepository;
    constructor(reservationRepository, serviceRepository) {
        this.reservationRepository = reservationRepository;
        this.serviceRepository = serviceRepository;
    }
    async execute(dto, userId) {
        const service = await this.serviceRepository.findById(dto.serviceId);
        if (!service) {
            throw new common_1.BadRequestException('El servicio especificado no existe');
        }
        const reservationDate = new Date(dto.date);
        if (reservationDate <= new Date()) {
            throw new common_1.BadRequestException('La fecha de la reserva debe ser en el futuro');
        }
        const reservation = await this.reservationRepository.create({
            customerName: dto.customerName,
            customerPhone: dto.customerPhone,
            date: reservationDate,
            status: reservation_entity_1.ReservationStatus.PENDING,
            notes: dto.notes,
            serviceId: dto.serviceId,
            userId: userId,
        });
        return reservation;
    }
};
exports.CreateReservationUseCase = CreateReservationUseCase;
exports.CreateReservationUseCase = CreateReservationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(reservation_repository_interface_1.RESERVATION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(service_repository_interface_1.SERVICE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CreateReservationUseCase);
//# sourceMappingURL=create-reservation.use-case.js.map