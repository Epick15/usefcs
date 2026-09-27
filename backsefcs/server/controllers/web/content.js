'use strict';

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const {WebContent, WebAuthority, WebAdmission, WebSpecialty, Admission_plan, Cost_admission_plan, Programs, Plan, Ciclo, Course, Concept, Academic_semester} = require('../../models');
const {URL_PLUBLIC} = require('../Abox');

const uploadDirectory = path.join(URL_PLUBLIC, 'web', 'authorities');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const serializeAuthority = authority => {
    const data = authority.toJSON ? authority.toJSON() : authority;
    return {...data, image_url: data.image ? `/api/web/authorities/${encodeURIComponent(data.image)}` : null};
};

async function removeTempFile(file) {
    if (file && file.path) await fs.unlink(file.path).catch(() => {});
}

async function saveImage(file) {
    if (!file) return null;
    const extension = path.extname(file.name || '').toLowerCase();
    if (!allowedExtensions.has(extension) || !String(file.type || '').startsWith('image/')) {
        const error = new Error('La foto debe ser JPG, PNG o WEBP.'); error.status = 422; throw error;
    }
    if (file.size > 5 * 1024 * 1024) {
        const error = new Error('La foto no puede superar los 5 MB.'); error.status = 422; throw error;
    }
    await fs.mkdir(uploadDirectory, {recursive: true});
    const filename = `${crypto.randomUUID()}${extension}`;
    await fs.rename(file.path, path.join(uploadDirectory, filename));
    return filename;
}

module.exports = {
    publicSpecialty: async (req, res) => {
        try {
            const specialty = await WebSpecialty.findOne({where: {slug: req.params.slug, published: true}});
            if (!specialty) return res.status(404).send({message: 'Especialidad no encontrada.'});
            const program = await Programs.findByPk(specialty.id_program, {attributes: ['id', 'denomination'], include: [{model: Plan, as: 'Plans', where: {state: true}, required: false, include: [{model: Ciclo, as: 'Ciclos', where: {state: true}, required: false, include: [{model: Course, as: 'Course', where: {state: true}, required: false, attributes: ['id', 'code', 'denomination', 'credits', 'order']}]}]}]});
            const plans = (program && program.Plans) || [];
            const plan = plans.find(item => item.valid) || plans[0] || null;
            if (plan && plan.Ciclos) plan.Ciclos.sort((a, b) => Number(a.period) - Number(b.period)).forEach(cycle => cycle.Course && cycle.Course.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)));
            res.status(200).send({specialty, program, plan});
        } catch (error) { res.status(500).send({message: 'No se pudo obtener la especialidad.'}); }
    },
    adminSpecialties: async (req, res) => {
        try {
            const [specialties, programs] = await Promise.all([WebSpecialty.findAll({order: [['id', 'ASC']]}), Programs.findAll({where: {state: true}, attributes: ['id', 'denomination'], order: [['denomination', 'ASC']]})]);
            res.status(200).send({specialties, programs});
        } catch (error) { res.status(500).send({message: 'No se pudo cargar las especialidades.'}); }
    },
    updateSpecialty: async (req, res) => {
        try {
            const specialty = await WebSpecialty.findByPk(req.params.id);
            if (!specialty) return res.status(404).send({message: 'Especialidad no encontrada.'});
            const parse = value => { try { return JSON.parse(value || '[]'); } catch (_) { return null; } };
            const objectives = parse(req.body.objectives), competencies = parse(req.body.competencies);
            if (!Array.isArray(objectives) || !Array.isArray(competencies)) return res.status(422).send({message: 'Objetivos y competencias deben ser listas vÃ¡lidas.'});
            await specialty.update({id_program: Number(req.body.id_program), slug: req.body.slug || specialty.slug, title: req.body.title || '', objectives, competencies, color: req.body.color || '#811632', background_color: req.body.background_color || '#f8f6f3', published: req.body.published !== 'false'});
            res.status(200).send({message: 'Especialidad actualizada.', specialty});
        } catch (error) { res.status(500).send({message: 'No se pudo actualizar la especialidad.'}); }
    },
    publicAdmission: async (req, res) => {
        try {
            const admission = await WebAdmission.findOne({order: [['id', 'ASC']]});
            let plans = [];
            let process = null;
            if (admission && admission.id_process) process = await Academic_semester.findByPk(admission.id_process, {attributes: ['id', 'denomination']});
            if (admission && admission.id_process) plans = await Admission_plan.findAll({where: {id_process: admission.id_process, state: true}, include: [{model: Programs, as: 'Program', attributes: ['denomination']}, {model: Cost_admission_plan, as: 'Cost_admission_plans', where: {state: true}, required: false, include: {model: Concept, as: 'Concept', attributes: ['denomination']}}], order: [['id', 'ASC']]});
            res.status(200).send({admission, process, plans});
        } catch (error) { res.status(500).send({message: 'No se pudo obtener la información de admisión.'}); }
    },
    adminAdmission: async (req, res) => {
        try {
            const admission = await WebAdmission.findOne({order: [['id', 'ASC']]});
            const processes = await Academic_semester.findAll({attributes: ['id', 'denomination', 'actual', 'state'], where: {state: true}, order: [['id', 'DESC']]});
            res.status(200).send({admission, processes});
        } catch (error) { res.status(500).send({message: 'No se pudo obtener la configuración de admisión.'}); }
    },
    updateAdmission: async (req, res) => {
        try {
            const parse = value => { try { return value ? JSON.parse(value) : []; } catch (_) { return []; } };
            const values = {id_admission_plan: null, id_process: req.body.id_process || null, title: req.body.title || '', subtitle: req.body.subtitle || '', audience: req.body.audience || '', requirements: parse(req.body.requirements), schedule: parse(req.body.schedule), calendar: parse(req.body.calendar), whatsapp_url: req.body.whatsapp_url || '', registration_url: req.body.registration_url || ''};
            let admission = await WebAdmission.findOne({order: [['id', 'ASC']]});
            if (admission) await admission.update(values); else admission = await WebAdmission.create(values);
            res.status(200).send({message: 'Admisión actualizada.', admission});
        } catch (error) { res.status(500).send({message: 'No se pudo actualizar la admisión.'}); }
    },
    publicContent: async (req, res) => {
        try {
            const content = await WebContent.findOne({order: [['id', 'ASC']]});
            const authorities = await WebAuthority.findAll({where: {published: true}, order: [['display_order', 'ASC'], ['id', 'ASC']]});
            res.status(200).send({content, authorities: authorities.map(serializeAuthority)});
        } catch (error) { res.status(500).send({message: 'No se pudo obtener el contenido del sitio.'}); }
    },
    adminContent: async (req, res) => {
        try {
            const content = await WebContent.findOne({order: [['id', 'ASC']]});
            const authorities = await WebAuthority.findAll({order: [['display_order', 'ASC'], ['id', 'ASC']]});
            res.status(200).send({content, authorities: authorities.map(serializeAuthority)});
        } catch (error) { res.status(500).send({message: 'No se pudo obtener el contenido del sitio.'}); }
    },
    updateContent: async (req, res) => {
        try {
            const values = {presentation: req.body.presentation || '', mission: req.body.mission || '', vision: req.body.vision || ''};
            let content = await WebContent.findOne({order: [['id', 'ASC']]});
            if (content) await content.update(values); else content = await WebContent.create(values);
            res.status(200).send({message: 'Contenido actualizado.', content});
        } catch (error) { res.status(500).send({message: 'No se pudo actualizar el contenido.'}); }
    },
    createAuthority: async (req, res) => {
        const file = req.files && req.files.image;
        try {
            if (!req.body.name || !req.body.position) return res.status(422).send({message: 'El nombre y el cargo son obligatorios.'});
            const authority = await WebAuthority.create({name: req.body.name.trim(), position: req.body.position.trim(), image: await saveImage(file), display_order: Number(req.body.display_order) || 1, published: req.body.published !== 'false'});
            res.status(201).send({message: 'Autoridad registrada.', authority: serializeAuthority(authority)});
        } catch (error) { await removeTempFile(file); res.status(error.status || 500).send({message: error.message || 'No se pudo registrar la autoridad.'}); }
    },
    updateAuthority: async (req, res) => {
        const file = req.files && req.files.image;
        try {
            const authority = await WebAuthority.findByPk(req.params.id);
            if (!authority) return res.status(404).send({message: 'Autoridad no encontrada.'});
            if (!req.body.name || !req.body.position) return res.status(422).send({message: 'El nombre y el cargo son obligatorios.'});
            const oldImage = file ? authority.image : null;
            await authority.update({name: req.body.name.trim(), position: req.body.position.trim(), image: file ? await saveImage(file) : authority.image, display_order: Number(req.body.display_order) || 1, published: req.body.published !== 'false'});
            if (oldImage) await fs.unlink(path.join(uploadDirectory, oldImage)).catch(() => {});
            res.status(200).send({message: 'Autoridad actualizada.', authority: serializeAuthority(authority)});
        } catch (error) { await removeTempFile(file); res.status(error.status || 500).send({message: error.message || 'No se pudo actualizar la autoridad.'}); }
    },
    deleteAuthority: async (req, res) => {
        try {
            const authority = await WebAuthority.findByPk(req.params.id);
            if (!authority) return res.status(404).send({message: 'Autoridad no encontrada.'});
            await authority.destroy();
            if (authority.image) await fs.unlink(path.join(uploadDirectory, authority.image)).catch(() => {});
            res.status(200).send({message: 'Autoridad eliminada.'});
        } catch (error) { res.status(500).send({message: 'No se pudo eliminar la autoridad.'}); }
    }
};
