"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEntity = void 0;
class ServiceEntity {
    id;
    name;
    description;
    price;
    duration;
    imageUrl;
    category;
    steps;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ServiceEntity = ServiceEntity;
//# sourceMappingURL=service.entity.js.map