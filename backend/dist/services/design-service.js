"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class DesignService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(user, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const design = yield this.prisma.design.create({
                data: {
                    name: name,
                    designerId: user.id,
                },
            });
            return design.id;
        });
    }
    delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkDesign(user, id);
            yield this.prisma.design.delete({
                where: {
                    id,
                },
            });
            return "Design has been removed";
        });
    }
    updateObjList(user, id, objects) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkDesign(user, id);
            for (const element of objects) {
                yield this.prisma.objects.update({
                    where: {
                        designId: id,
                        id: element.id,
                    },
                    data: {
                        data: element.data,
                    },
                });
            }
            return "updated";
        });
    }
    getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const designs = yield this.prisma.design.findMany();
            return JSON.stringify(designs);
        });
    }
    checkDesign(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const design = yield this.prisma.design.findFirst({
                where: {
                    id: id,
                },
            });
            if (!design) {
                throw new Error("No design was found");
            }
            if (design.designerId !== user.id) {
                throw new Error("Not your design");
            }
        });
    }
}
exports.default = DesignService;
