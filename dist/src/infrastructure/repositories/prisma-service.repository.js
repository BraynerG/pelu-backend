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
exports.PrismaServiceRepository = void 0;
const common_1 = require("@nestjs/common");
const service_entity_1 = require("../../domain/entities/service.entity");
const prisma_service_1 = require("../database/prisma.service");
let PrismaServiceRepository = class PrismaServiceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const models = await this.prisma.service.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return models.map(model => new service_entity_1.ServiceEntity(model));
    }
    async findById(id) {
        const model = await this.prisma.service.findUnique({ where: { id } });
        if (!model)
            return null;
        return new service_entity_1.ServiceEntity(model);
    }
    async create(data) {
        const model = await this.prisma.service.create({
            data: {
                name: data.name,
                description: data.description ?? '',
                price: data.price,
                duration: data.duration,
                imageUrl: data.imageUrl ?? null,
                category: data.category ?? 'hair',
                steps: data.steps ?? [],
            }
        });
        return new service_entity_1.ServiceEntity(model);
    }
};
exports.PrismaServiceRepository = PrismaServiceRepository;
exports.PrismaServiceRepository = PrismaServiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaServiceRepository);
//# sourceMappingURL=prisma-service.repository.js.map