const express = require('express');
const web = express.Router();

const InscriptionController = require('../controllers/web').InscriptionController;
const ProgramController = require('../controllers/web').ProgramController;
const AdmissionController = require('../controllers/web').AdmissionController;
const ContentController = require('../controllers/web').ContentController;
const verifyToken = require('../middlewares/auth');

web.get('/inscriptions/:id', InscriptionController.list);
web.post('/inscriptions', InscriptionController.create);

web.get('/programs', ProgramController.list);

web.get('/admissions', AdmissionController.list);

web.get('/about/manage', verifyToken, ContentController.adminContent);
web.patch('/about', verifyToken, ContentController.updateContent);
web.post('/authorities', verifyToken, ContentController.createAuthority);
web.patch('/authorities/:id', verifyToken, ContentController.updateAuthority);
web.delete('/authorities/:id', verifyToken, ContentController.deleteAuthority);
web.get('/admission/manage', verifyToken, ContentController.adminAdmission);
web.patch('/admission', verifyToken, ContentController.updateAdmission);
web.get('/specialties/manage', verifyToken, ContentController.adminSpecialties);
web.patch('/specialties/:id', verifyToken, ContentController.updateSpecialty);
web.get('/about', ContentController.publicContent);
web.get('/admission', ContentController.publicAdmission);
web.get('/specialties/:slug', ContentController.publicSpecialty);

module.exports = web;
