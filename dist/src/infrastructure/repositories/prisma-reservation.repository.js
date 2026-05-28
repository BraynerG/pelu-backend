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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaReservationRepository = void 0;
const common_1 = require("@nestjs/common");
const reservation_entity_1 = require("../../domain/entities/reservation.entity");
const prisma_service_1 = require("../database/prisma.service");
let PrismaReservationRepository = class PrismaReservationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const model = await this.prisma.reservation.create({
            data: {
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                date: data.date,
                status: data.status ?? 'PENDING',
                notes: data.notes ?? null,
                serviceId: data.serviceId,
                userId: data.userId,
            }
        });
        return new reservation_entity_1.ReservationEntity(model);
    }
    async findByServiceAndDate(serviceId, date) {
        const models = await this.prisma.reservation.findMany({
            where: {
                serviceId,
                date,
            }
        });
        return models.map(model => new reservation_entity_1.ReservationEntity(model));
    }
    async findAll() {
        const models = await this.prisma.reservation.findMany({
            orderBy: { date: 'asc' }
        });
        return models.map(model => new reservation_entity_1.ReservationEntity(model));
    }
    async findById(id) {
        const model = await this.prisma.reservation.findUnique({
            where: { id }
        });
        return model ? new reservation_entity_1.ReservationEntity(model) : null;
    }
    async update(id, data) {
        const model = await this.prisma.reservation.update({
            where: { id },
            data: {
                status: data.status,
                notes: data.notes,
                date: data.date,
                userId: data.userId,
            }
        });
        return new reservation_entity_1.ReservationEntity(model);
    }
};
exports.PrismaReservationRepository = PrismaReservationRepository;
exports.PrismaReservationRepository = PrismaReservationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaReservationRepository);
//# sourceMappingURL=prisma-reservation.repository.js.map