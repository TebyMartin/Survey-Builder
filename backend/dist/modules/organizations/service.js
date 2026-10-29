"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const repository_1 = require("./repository");
const repository = new repository_1.OrganizationRepository();
class OrganizationService {
    async delete(id) {
        return repository.delete(id);
    }
    async findAll() {
        return repository.findAll();
    }
    async findById(id) {
        const organization = await repository.findById(id);
        if (!organization) {
            throw new Error("Organización no encontrada");
        }
        return organization;
    }
    async create(data) {
        const name = data.name.trim();
        if (!name) {
            throw new Error("El nombre de la organización es obligatorio");
        }
        const slug = this.generateSlug(data.slug || name);
        const existing = await repository.findBySlug(slug);
        if (existing) {
            throw new Error("Ya existe una organización con ese slug");
        }
        return repository.create({
            name,
            slug,
        });
    }
    async update(id, data) {
        const organization = await repository.findById(id);
        if (!organization) {
            throw new Error("Organización no encontrada");
        }
        let slug = data.slug;
        if (slug) {
            slug = this.generateSlug(slug);
            const existing = await repository.findBySlug(slug);
            if (existing && existing.id !== id) {
                throw new Error("Ya existe una organización con ese slug");
            }
        }
        return repository.update(id, {
            name: data.name?.trim(),
            slug,
            isActive: data.isActive,
        });
    }
    async deactivate(id) {
        const organization = await repository.findById(id);
        if (!organization) {
            throw new Error("Organización no encontrada");
        }
        return repository.deactivate(id);
    }
    generateSlug(value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
}
exports.OrganizationService = OrganizationService;
