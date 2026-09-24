import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

/************Menu's speciality second section project ******************************/

const Dashboard = React.lazy(() => import("./FCS/Dashboard"));

const ProfileModules = React.lazy(() => import("./FCS/Modules/Profile"));
const ProfilePersonModules = React.lazy(() =>
    import("./FCS/Modules/Profile/Person")
);

const ProgramModules = React.lazy(() => import("./FCS/Modules/Programs"));
const ProgramStudyPlan = React.lazy(() =>
    import("./FCS/Modules/Programs/StudyPlan")
);
const ProgramDocument = React.lazy(() =>
    import("./FCS/Modules/Programs/DocumentProgram")
);

const ProgramAdmissionPlan = React.lazy(() =>
    import("./FCS/Modules/Programs/AdmissionPlan")
);
const ProgramAdmissionPlanCost = React.lazy(() =>
    import("./FCS/Modules/Programs/AdmissionPlan/CostAdmission")
);

const ProgramWorkPlan = React.lazy(() =>
    import("./FCS/Modules/Programs/Workplan")
);
const ProgramWorkPlanProjection = React.lazy(() =>
    import("./FCS/Modules/Programs/Workplan/ProgramProjection")
);

const AdministrativeModules = React.lazy(() =>
    import("./FCS/Modules/Administrative")
);
const AdministrativeContractModules = React.lazy(() =>
    import("./FCS/Modules/Administrative/Contract")
);

const TeacherModules = React.lazy(() => import("./FCS/Modules/Teacher"));
const TeacherContractModules = React.lazy(() =>
    import("./FCS/Modules/Teacher/Contract")
);

const ReportModules = React.lazy(() => import("./FCS/Modules/Report"));
const SuneduModules = React.lazy(() => import("./FCS/Modules/Sunedu"));
const ReportGeneralModules = React.lazy(() =>
    import("./FCS/Modules/ReportGeneral")
);
const SettingtUserDetailModules = React.lazy(() =>
    import("./FCS/Modules/Security/Users/UserDetail")
);
const SettingtUserLogModules = React.lazy(() =>
    import("./FCS/Modules/Security/Users/UserLog")
);

const PersonModules = React.lazy(() => import("./FCS/Modules/Person"));
const RegistrationModules = React.lazy(() =>
    import("./FCS/Modules/Registration")
);
const RRegistrationModules = React.lazy(() =>
    import("./FCS/Modules/RRegistration")
);
const ConvalidationModules = React.lazy(() =>
    import("./FCS/Modules/Convalidation")
);
const HoraryModules = React.lazy(() => import("./FCS/Modules/Horary"));
const OperationModules = React.lazy(() => import("./FCS/Modules/Operation"));
const DocumentBookModules = React.lazy(() =>
    import("./FCS/Modules/DocumentBook")
);
const RectificationModules = React.lazy(() =>
    import("./FCS/Modules/Rectification")
);
const RetirementModules = React.lazy(() => import("./FCS/Modules/Retirement"));
const NoteManagement = React.lazy(() => import("./FCS/Modules/NoteManagement"));
const Aacademic = React.lazy(() => import("./FCS/Modules/Aacademic"));
const SustentacionProjectModules = React.lazy(() =>
    import("./FCS/Modules/Sustentacion/Project")
);
const PaymentModules = React.lazy(() => import("./FCS/Modules/Payment"));
const EntryModules = React.lazy(() => import("./FCS/Modules/Entry"));
const EgressModules = React.lazy(() => import("./FCS/Modules/Egress"));
const CostModules = React.lazy(() => import("./FCS/Modules/Cost"));
const UpdateRegistrationModules = React.lazy(() =>
    import("./FCS/Modules/UpdateRegistration")
);
const InscriptionModules = React.lazy(() =>
    import("./FCS/Modules/Inscription")
);
const InscriptionAcreditation = React.lazy(() =>
    import("./FCS/Modules/Inscription/Accreditation")
);
const InscriptionDiscount = React.lazy(() =>
    import("./FCS/Modules/Inscription/Discount")
);

const AcademicCalendarModules = React.lazy(() =>
    import("./FCS/Modules/AcademicCalendar")
);

const OpenCourseModules = React.lazy(() => import("./FCS/Modules/OpenCourse"));

const CampusMaintenance = React.lazy(() =>
    import("./FCS/Maintenance/University/Campus")
);

const SecurityModules = React.lazy(() =>
    import("./FCS/Modules/Security/Modules")
);
const SecurityRoles = React.lazy(() => import("./FCS/Modules/Security/Roles"));
const SecurityUser = React.lazy(() => import("./FCS/Modules/Security/Users"));
const SettingSetting = React.lazy(() =>
    import("./FCS/Modules/Security/Setting")
);

const MasterModueles = React.lazy(() => import("./FCS/Maintenance/index"));
const MasterAcademicDegreeModules = React.lazy(() =>
    import("./FCS/Maintenance/AcademicDegree")
);
const MasterStudyLevelModules = React.lazy(() =>
    import("./FCS/Maintenance/StudyLevel")
);
const MasterActivityTypeModules = React.lazy(() =>
    import("./FCS/Maintenance/ActivityType")
);
const MasterActivityModules = React.lazy(() =>
    import("./FCS/Maintenance/Activity")
);
const MasterContractTypeModules = React.lazy(() =>
    import("./FCS/Maintenance/ContractType")
);
const MasterChargeModules = React.lazy(() =>
    import("./FCS/Maintenance/Charge")
);
const MasterConcetpModules = React.lazy(() =>
    import("./FCS/Maintenance/Concetps")
);
const MasterCategoryConceptModules = React.lazy(() =>
    import("./FCS/Maintenance/CategoryConcept")
);
const MasterBankModules = React.lazy(() => import("./FCS/Maintenance/Bank"));
const MasterSocialNetworkModules = React.lazy(() =>
    import("./FCS/Maintenance/SocialNetwork")
);
const MasterTypeDocumentModules = React.lazy(() =>
    import("./FCS/Maintenance/TypeDocument")
);
const MasterCivilStatusModules = React.lazy(() =>
    import("./FCS/Maintenance/CivilStatus")
);
const MasterMaterialModules = React.lazy(() =>
    import("./FCS/Maintenance/Material")
);
const MasterUnitMeasureModules = React.lazy(() =>
    import("./FCS/Maintenance/UnitMeasure")
);
const MasterRequerimentInscriptionModules = React.lazy(() =>
    import("./FCS/Maintenance/RequerimentInscription")
);

const MasterTypeOrganicUnitModules = React.lazy(() =>
    import("./FCS/Maintenance/TypeOrganicUnit")
);
const MasterTypeEdificationModules = React.lazy(() =>
    import("./FCS/Maintenance/TypeBuilding")
);

// MPT
// const WebInscriptions = React.lazy(() => import('./FCS/Modules/WebInscription'));
const ReportWebInscriptionModules = React.lazy(() =>
    import("./FCS/Modules/ReportWebInscription")
);

const god = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    {
        path: "/profile",
        exact: true,
        name: "Perfiles",
        component: ProfileModules,
    },
    {
        path: "/profile/:id/person",
        exact: true,
        name: "Perfil persona",
        component: ProfilePersonModules,
    },
    {
        path: "/teacher",
        exact: true,
        name: "Docentes",
        component: TeacherModules,
    },
    {
        path: "/teacher/:id/contract",
        exact: true,
        name: "Docente contrato",
        component: TeacherContractModules,
    },
    {
        path: "/programs",
        exact: true,
        name: "Programas",
        component: ProgramModules,
    },
    {
        path: "/programs/:id/study-plan",
        exact: true,
        name: "StudyPlan",
        component: ProgramStudyPlan,
    },
    {
        path: "/programs/:id/document",
        exact: true,
        name: "ProgramDocument",
        component: ProgramDocument,
    },
    {
        path: "/programs/:id/admission-plan",
        exact: true,
        name: "ProgramAdmissionPlan",
        component: ProgramAdmissionPlan,
    },
    {
        path: "/programs/:id/work-plan",
        exact: true,
        name: "WorkPlan",
        component: ProgramWorkPlan,
    },
    {
        path: "/programs/admission-plan/:id/cost",
        exact: true,
        name: "ProgramAdmissionPlanCost",
        component: ProgramAdmissionPlanCost,
    },
    {
        path: "/programs/work-plan/:id/projection",
        exact: true,
        name: "WorkPlanProjection",
        component: ProgramWorkPlanProjection,
    },
    {
        path: "/administrative",
        exact: true,
        name: "Administrativos",
        component: AdministrativeModules,
    },
    {
        path: "/administrative/:id/contract",
        exact: true,
        name: "Administrativos contrato",
        component: AdministrativeContractModules,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
    {
        path: "/report/general",
        exact: true,
        name: "Informes",
        component: ReportGeneralModules,
    },
    {
        path: "/sunedu",
        exact: true,
        name: "Sunedu",
        component: SuneduModules,
    }, // {path: '/setting', exact: true, name: 'Configuración', component: SettingtModules},
    {
        path: "/setting/user/:id",
        exact: true,
        name: "Detalle usuario",
        component: SettingtUserDetailModules,
    },
    {
        path: "/setting/user/log/:id",
        exact: true,
        name: "Detalle log",
        component: SettingtUserLogModules,
    },
    {
        path: "/inscription/:ida",
        exact: true,
        name: "Inscripciones",
        component: InscriptionModules,
    },
    {
        path: "/inscription/student/:id/accreditation",
        exact: true,
        name: "Estudiante Acreditacion",
        component: InscriptionAcreditation,
    },
    {
        path: "/inscription/student/:id/discount",
        exact: true,
        name: "Estudiante Descuento",
        component: InscriptionDiscount,
    },
    {
        path: "/persons",
        exact: true,
        name: "persons",
        component: PersonModules,
    },
    {
        path: "/sustentacion/project",
        exact: true,
        name: "project",
        component: SustentacionProjectModules,
    },
    {
        path: "/registration",
        exact: true,
        name: "registration",
        component: RegistrationModules,
    },
    {
        path: "/r-registration",
        exact: true,
        name: "registration",
        component: RRegistrationModules,
    },
    { path: "/oaa", exact: true, name: "registration", component: Aacademic },
    {
        path: "/convalidation",
        exact: true,
        name: "convalidation",
        component: ConvalidationModules,
    },
    { path: "/horary", exact: true, name: "horary", component: HoraryModules },
    {
        path: "/operation",
        exact: true,
        name: "registration",
        component: OperationModules,
    },
    {
        path: "/document-book",
        exact: true,
        name: "document-book",
        component: DocumentBookModules,
    },
    {
        path: "/rectification",
        exact: true,
        name: "registration",
        component: RectificationModules,
    },
    {
        path: "/retirement",
        exact: true,
        name: "registration",
        component: RetirementModules,
    },
    {
        path: "/note-management",
        exact: true,
        name: "registration",
        component: NoteManagement,
    },
    {
        path: "/payment",
        exact: true,
        name: "payment",
        component: PaymentModules,
    }, //contador
    { path: "/entry", exact: true, name: "entry", component: EntryModules },
    { path: "/egress", exact: true, name: "egress", component: EgressModules },
    { path: "/cost", exact: true, name: "cost", component: CostModules }, // {path: '/voucher', exact: true, name: 'movement', component: MovementModules},
    {
        path: "/update-registration",
        exact: true,
        name: "movement",
        component: UpdateRegistrationModules,
    },
    { path: "/master", exact: true, name: "master", component: MasterModueles },
    {
        path: "/master/academic-degree",
        exact: true,
        name: "Grados Academicos",
        component: MasterAcademicDegreeModules,
    },
    {
        path: "/master/study-level",
        exact: true,
        name: "Niveles de estudio",
        component: MasterStudyLevelModules,
    },
    {
        path: "/master/activity-type",
        exact: true,
        name: "Tipos de actividades",
        component: MasterActivityTypeModules,
    },
    {
        path: "/master/activity",
        exact: true,
        name: "Actividades",
        component: MasterActivityModules,
    },
    {
        path: "/master/contract-type",
        exact: true,
        name: "Tipos de contratos",
        component: MasterContractTypeModules,
    },
    {
        path: "/master/charge",
        exact: true,
        name: "Cargos",
        component: MasterChargeModules,
    },
    {
        path: "/master/concept",
        exact: true,
        name: "Conceptos",
        component: MasterConcetpModules,
    },
    {
        path: "/master/category-concept",
        exact: true,
        name: "Catergoria concepto",
        component: MasterCategoryConceptModules,
    },
    {
        path: "/master/bank",
        exact: true,
        name: "Bancos",
        component: MasterBankModules,
    },
    {
        path: "/master/social-network",
        exact: true,
        name: "Redes sociales",
        component: MasterSocialNetworkModules,
    },
    {
        path: "/master/document-type",
        exact: true,
        name: "Tipos de documentos",
        component: MasterTypeDocumentModules,
    },
    {
        path: "/master/civil-status",
        exact: true,
        name: "Estado civil",
        component: MasterCivilStatusModules,
    },
    {
        path: "/master/material",
        exact: true,
        name: "Materiales",
        component: MasterMaterialModules,
    },
    {
        path: "/master/unit-measure",
        exact: true,
        name: "Unidades de medida",
        component: MasterUnitMeasureModules,
    },
    {
        path: "/master/type-organic-unit",
        exact: true,
        name: "Tipos de unidades organicas",
        component: MasterTypeOrganicUnitModules,
    },
    {
        path: "/master/type-building",
        exact: true,
        name: "Tipos de edificaciones",
        component: MasterTypeEdificationModules,
    },
    {
        path: "/master/requeriment-inscription",
        exact: true,
        name: "Tipos de edificaciones",
        component: MasterRequerimentInscriptionModules,
    },
    {
        path: "/open-course",
        exact: true,
        name: "openCourse",
        component: OpenCourseModules,
    },
    {
        path: "/campus",
        exact: true,
        name: "Campus",
        component: CampusMaintenance,
    },
    {
        path: "/setting/academic-calendar",
        exact: true,
        name: "academicCalendar",
        component: AcademicCalendarModules,
    },
    {
        path: "/setting/module",
        exact: true,
        name: "Module",
        component: SecurityModules,
    },
    {
        path: "/setting/roles",
        exact: true,
        name: "Role",
        component: SecurityRoles,
    },
    {
        path: "/setting/users",
        exact: true,
        name: "Users",
        component: SecurityUser,
    },
    {
        path: "/setting/setting",
        exact: true,
        name: "Setting",
        component: SettingSetting,
    },
    // MPT
    {
        path: "/report/web-inscriptions",
        exact: true,
        name: "web-inscription",
        component: ReportWebInscriptionModules,
    },

    // ***************************************************************************************************************
];
const administrador = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    {
        path: "/profile",
        exact: true,
        name: "Perfiles",
        component: ProfileModules,
    },
    {
        path: "/profile/:id/person",
        exact: true,
        name: "Perfil persona",
        component: ProfilePersonModules,
    },
    {
        path: "/teacher",
        exact: true,
        name: "Docentes",
        component: TeacherModules,
    },
    {
        path: "/teacher/:id/contract",
        exact: true,
        name: "Docente contrato",
        component: TeacherContractModules,
    },
    {
        path: "/programs",
        exact: true,
        name: "Programas",
        component: ProgramModules,
    },
    {
        path: "/programs/:id/study-plan",
        exact: true,
        name: "StudyPlan",
        component: ProgramStudyPlan,
    },
    {
        path: "/programs/:id/document",
        exact: true,
        name: "ProgramDocument",
        component: ProgramDocument,
    },
    {
        path: "/programs/:id/admission-plan",
        exact: true,
        name: "ProgramAdmissionPlan",
        component: ProgramAdmissionPlan,
    },
    {
        path: "/programs/admission-plan/:id/cost",
        exact: true,
        name: "ProgramAdmissionPlanCost",
        component: ProgramAdmissionPlanCost,
    },
    {
        path: "/programs/:id/work-plan",
        exact: true,
        name: "WorkPlan",
        component: ProgramWorkPlan,
    },
    {
        path: "/programs/work-plan/:id/projection",
        exact: true,
        name: "WorkPlanProjection",
        component: ProgramWorkPlanProjection,
    },
    {
        path: "/inscription/:ida",
        exact: true,
        name: "Inscripciones",
        component: InscriptionModules,
    },
    {
        path: "/inscription/student/:id/accreditation",
        exact: true,
        name: "Estudiante Acreditacion",
        component: InscriptionAcreditation,
    },
    {
        path: "/inscription/student/:id/discount",
        exact: true,
        name: "Estudiante Descuento",
        component: InscriptionDiscount,
    },
    {
        path: "/document-book",
        exact: true,
        name: "document-book",
        component: DocumentBookModules,
    },
    {
        path: "/persons",
        exact: true,
        name: "persons",
        component: PersonModules,
    },
    {
        path: "/registration",
        exact: true,
        name: "registration",
        component: RegistrationModules,
    },
    {
        path: "/r-registration",
        exact: true,
        name: "registration",
        component: RRegistrationModules,
    },
    { path: "/horary", exact: true, name: "horary", component: HoraryModules },
    {
        path: "/operation",
        exact: true,
        name: "horary",
        component: OperationModules,
    },
    {
        path: "/note-management",
        exact: true,
        name: "noteManagement",
        component: NoteManagement,
    },
    {
        path: "/payment",
        exact: true,
        name: "payment",
        component: PaymentModules,
    }, //contador
    { path: "/entry", exact: true, name: "entry", component: EntryModules },
    { path: "/egress", exact: true, name: "egress", component: EgressModules },
    {
        path: "/update-registration",
        exact: true,
        name: "movement",
        component: UpdateRegistrationModules,
    },
    {
        path: "/open-course",
        exact: true,
        name: "openCourse",
        component: OpenCourseModules,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
    {
        path: "/report/general",
        exact: true,
        name: "Informes",
        component: ReportGeneralModules,
    },
    {
        path: "/setting/roles",
        exact: true,
        name: "Role",
        component: SecurityRoles,
    },
    {
        path: "/sustentacion/project",
        exact: true,
        name: "project",
        component: SustentacionProjectModules,
    },
    // MPT
    {
        path: "/report/web-inscriptions",
        exact: true,
        name: "web-inscription",
        component: ReportWebInscriptionModules,
    },
];
const contabilidad = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },

    //PROGRAMAS
    {
        path: "/programs",
        exact: true,
        name: "Programas",
        component: ProgramModules,
    },
    {
        path: "/programs/:id/study-plan",
        exact: true,
        name: "StudyPlan",
        component: ProgramStudyPlan,
    },
    {
        path: "/programs/:id/document",
        exact: true,
        name: "ProgramDocument",
        component: ProgramDocument,
    },
    {
        path: "/programs/:id/admission-plan",
        exact: true,
        name: "ProgramAdmissionPlan",
        component: ProgramAdmissionPlan,
    },
    {
        path: "/programs/admission-plan/:id/cost",
        exact: true,
        name: "ProgramAdmissionPlanCost",
        component: ProgramAdmissionPlanCost,
    },
    {
        path: "/programs/:id/work-plan",
        exact: true,
        name: "WorkPlan",
        component: ProgramWorkPlan,
    },
    {
        path: "/programs/work-plan/:id/projection",
        exact: true,
        name: "WorkPlanProjection",
        component: ProgramWorkPlanProjection,
    },

    {
        path: "/profile",
        exact: true,
        name: "Perfiles",
        component: ProfileModules,
    },
    {
        path: "/payment",
        exact: true,
        name: "payment",
        component: PaymentModules,
    }, //contador
    { path: "/entry", exact: true, name: "entry", component: EntryModules },
    { path: "/egress", exact: true, name: "egress", component: EgressModules },
    { path: "/cost", exact: true, name: "cost", component: CostModules },
    {
        path: "/profile/:id/person",
        exact: true,
        name: "Perfil persona",
        component: ProfilePersonModules,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
    {
        path: "/report/general",
        exact: true,
        name: "Informes",
        component: ReportGeneralModules,
    },
];
const sunedu = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    {
        path: "/profile",
        exact: true,
        name: "Perfiles",
        component: ProfileModules,
    },
    {
        path: "/profile/:id/person",
        exact: true,
        name: "Perfil persona",
        component: ProfilePersonModules,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
];
const academico = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    {
        path: "/profile",
        exact: true,
        name: "Perfiles",
        component: ProfileModules,
    },
    {
        path: "/profile/:id/person",
        exact: true,
        name: "Perfil persona",
        component: ProfilePersonModules,
    },
    {
        path: "/operation",
        exact: true,
        name: "registration",
        component: OperationModules,
    },
    {
        path: "/document-book",
        exact: true,
        name: "document-book",
        component: DocumentBookModules,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
    {
        path: "/note-management",
        exact: true,
        name: "registration",
        component: NoteManagement,
    },
    {
        path: "/reports",
        exact: true,
        name: "Informes",
        component: ReportModules,
    },
    {
        path: "/report/general",
        exact: true,
        name: "Informes",
        component: ReportGeneralModules,
    },
    {
        path: "/setting/academic-calendar",
        exact: true,
        name: "academicCalendar",
        component: AcademicCalendarModules,
    },
];

const egresos = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    { path: "/egress", exact: true, name: "egress", component: EgressModules },
];

const visualizador = [
    { path: "/", exact: true, name: "Dashboard", component: Dashboard },
    {
        path: "/report/web-inscriptions",
        exact: true,
        name: "web-inscription",
        component: ReportWebInscriptionModules,
    },
];

export default {
    god,
    administrador,
    contabilidad,
    academico,
    sunedu,
    egresos,
    visualizador,
};
