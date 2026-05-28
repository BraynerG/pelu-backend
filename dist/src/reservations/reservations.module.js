"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsModule = void 0;
const common_1 = require("@nestjs/common");
const reservations_controller_1 = require("../presentation/controllers/reservations.controller");
const create_reservation_use_case_1 = require("../application/use-cases/create-reservation.use-case");
const get_reservations_use_case_1 = require("../application/use-cases/get-reservations.use-case");
const update_reservation_status_use_case_1 = require("../application/use-cases/update-reservation-status.use-case");
const reschedule_reservation_use_case_1 = require("../application/use-cases/reschedule-reservation.use-case");
const prisma_reservation_repository_1 = require("../infrastructure/repositories/prisma-reservation.repository");
const reservation_repository_interface_1 = require("../domain/interfaces/reservation.repository.interface");
const prisma_service_1 = require("../infrastructure/database/prisma.service");
const services_module_1 = require("../services/services.module");
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [services_module_1.ServicesModule],
        controllers: [reservations_controller_1.ReservationsController],
        providers: [
            prisma_service_1.PrismaService,
            create_reservation_use_case_1.CreateReservationUseCase,
            get_reservations_use_case_1.GetReservationsUseCase,
            update_reservation_status_use_case_1.UpdateReservationStatusUseCase,
            reschedule_reservation_use_case_1.RescheduleReservationUseCase,
            {
                provide: reservation_repository_interface_1.RESERVATION_REPOSITORY,
                useClass: prisma_reservation_repository_1.PrismaReservationRepository,
            },
        ],
    })
], ReservationsModule);
//# sourceMappingURL=reservations.module.js.map