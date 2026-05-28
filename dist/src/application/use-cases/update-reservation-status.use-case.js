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
exports.UpdateReservationStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const reservation_repository_interface_1 = require("../../domain/interfaces/reservation.repository.interface");
const reservation_entity_1 = require("../../domain/entities/reservation.entity");
let UpdateReservationStatusUseCase = class UpdateReservationStatusUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(id, status) {
        if (!Object.values(reservation_entity_1.ReservationStatus).includes(status)) {
            throw new common_1.BadRequestException('Estado de reserva no válido');
        }
        try {
            const reservation = await this.reservationRepository.update(id, { status });
            return reservation;
        }
        catch (error) {
            throw new common_1.BadRequestException('No se pudo actualizar la reserva. Es posible que el ID no exista.');
        }
    }
};
exports.UpdateReservationStatusUseCase = UpdateReservationStatusUseCase;
exports.UpdateReservationStatusUseCase = UpdateReservationStatusUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(reservation_repository_interface_1.RESERVATION_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateReservationStatusUseCase);
//# sourceMappingURL=update-reservation-status.use-case.js.map