"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationEntity = exports.ReservationStatus = void 0;
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "PENDING";
    ReservationStatus["CONFIRMED"] = "CONFIRMED";
    ReservationStatus["MODIFIED"] = "MODIFIED";
    ReservationStatus["REJECTED"] = "REJECTED";
    ReservationStatus["CANCELLED"] = "CANCELLED";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
class ReservationEntity {
    id;
    customerName;
    customerPhone;
    date;
    status;
    notes;
    serviceId;
    userId;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ReservationEntity = ReservationEntity;
//# sourceMappingURL=reservation.entity.js.map