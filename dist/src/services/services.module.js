"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const services_controller_1 = require("../presentation/controllers/services.controller");
const get_services_use_case_1 = require("../application/use-cases/get-services.use-case");
const create_service_use_case_1 = require("../application/use-cases/create-service.use-case");
const prisma_service_repository_1 = require("../infrastructure/repositories/prisma-service.repository");
const service_repository_interface_1 = require("../domain/interfaces/service.repository.interface");
const prisma_service_1 = require("../infrastructure/database/prisma.service");
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        controllers: [services_controller_1.ServicesController],
        providers: [
            prisma_service_1.PrismaService,
            get_services_use_case_1.GetServicesUseCase,
            create_service_use_case_1.CreateServiceUseCase,
            {
                provide: service_repository_interface_1.SERVICE_REPOSITORY,
                useClass: prisma_service_repository_1.PrismaServiceRepository,
            },
        ],
        exports: [service_repository_interface_1.SERVICE_REPOSITORY],
    })
], ServicesModule);
//# sourceMappingURL=services.module.js.map