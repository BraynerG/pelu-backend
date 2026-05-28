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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const get_services_use_case_1 = require("../../application/use-cases/get-services.use-case");
const create_service_use_case_1 = require("../../application/use-cases/create-service.use-case");
const create_service_dto_1 = require("../../application/dtos/create-service.dto");
const prisma_service_1 = require("../../infrastructure/database/prisma.service");
let ServicesController = class ServicesController {
    getServicesUseCase;
    createServiceUseCase;
    prisma;
    constructor(getServicesUseCase, createServiceUseCase, prisma) {
        this.getServicesUseCase = getServicesUseCase;
        this.createServiceUseCase = createServiceUseCase;
        this.prisma = prisma;
    }
    async getLookbook() {
        const slides = await this.prisma.lookbookSlide.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return {
            success: true,
            data: slides,
        };
    }
    async findAll() {
        const services = await this.getServicesUseCase.execute();
        return {
            success: true,
            data: services,
        };
    }
    async create(createServiceDto) {
        const service = await this.createServiceUseCase.execute(createServiceDto);
        return {
            success: true,
            data: service,
        };
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)('lookbook'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getLookbook", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "create", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [get_services_use_case_1.GetServicesUseCase,
        create_service_use_case_1.CreateServiceUseCase,
        prisma_service_1.PrismaService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map