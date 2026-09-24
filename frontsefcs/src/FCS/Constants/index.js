import config from "../../config";

const MODE = config.mode;
let host = "";
let headers = "";
if (MODE === "DEV") {
    // host = 'http://asefcs.test/api/';
    host = 'http://localhost:8899/api/';
    headers = {
        headers: {'Content-Type': 'multipart/form-data', 'x-accesss-token': localStorage.getItem('TOKEN') || null}
    };
}
if (MODE === "TEST") {
    host = '';
    headers = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-accesss-token': localStorage.getItem('TOKEN') || null
        }
    };
}
if (MODE === "PRO") {
    host = config.hostPro;
    headers = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-accesss-token': localStorage.getItem('TOKEN') || null
        }
    };
}

const Config = {
//
    apiRenicDNI: 'https://dniruc.apisperu.com/api/v1/dni/',
    tokenReniec: '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNvcG9ydGVAdW5zbS5lZHUucGUifQ.0_GDfGtk3rl0ScfpZ1NUfOMUr-Zqe8o1oy2lQtbTJiQ',
    //GENERAL
    general: host + 'general',
    civilStatus: 'civil-status',
    activityType: 'activity-type',
    categoryConcept: 'category-concept',
    unitMeasure: 'unit-measure',
    material: 'material',
    country: 'country',
    province: 'province',
    district: 'district',
    department: 'department',
    requeriment: 'requeriment-inscription',
    requerimentDelivered: 'requeriment-delivered',

    campus: 'campus',
    ubigeo: 'ubigeo',
    pais: 'pais',
    bank: 'bank',
    bankAccount: 'bank-account',
    UbigeoNacional: '/ubigeo-nacional',
    organicUnit: 'organic-unit',
    typeOrganicUnit: 'type-organic-unit',
    typeBuilding: 'type-building',
    academicDegree: 'academic-degree',
    identificationDocument: 'identification-document',
    socialNetwork: 'social-network',
    studyLevel: 'study-level',
    uit: 'uit',
    authority: 'authority',
    config: 'config',
    semester: 'semester',
    semesterActual: 'semester-actual',
    academicSemester: 'academic-semester',
    academicCalendar: 'academic-calendar',
    academicPeriod: 'academic-period',
    activity: 'activity',
    semesterActivity: 'semester-activity',
    documentCurriculum: 'document-curriculum',
    document: 'document',
    documentType: 'document-type',
    charge: 'charge',
    contractType: 'contract-type',
    report: 'report',
    discount: 'discount',
    studentDiscount: 'student-discount',

    // REGISTRATION
    registration: host + 'registration',
    registrations: 'registration',
    registrationCourse: 'registration-course',
    openCourse: 'open-course',
    groupClass: 'group-class',
    typeCourse: 'type-course',
    schedule: 'schedule',
    horary: 'horary',
    teacher: 'teacher',

    //PROGRAMAS
    programs: host + 'programs',
    program: 'programs',
    project: 'project',
    programDocument: 'program-document',
    documentBook: 'document-book',
    actaBook: 'acta-book',
    plan: 'plan',
    studyPlan: 'study-plan',
    cycle: 'cycle',
    workPlan: "work-plan",
    admissionPlan: "admission-plan",
    entryWorkPlan: "entry-work-plan",
    costAdmissionPlan: "cost-admission-plan",
    egressAdministrative: "egress-administrative",
    egressComission: "egress-comission",
    egressTeacher: "egress-teacher",
    egressMaterial: "egress-material",
    detailWorkPlan: "detail-work-plan",
    organizationWorkPlan: "organization-work-plan",
    course: 'course',

    mention: 'mention',
    courseState: 'course-state',
    mentionCourse: 'mention-course',
    mentionByProgram: 'mention-by-program',
    courseByProgram: 'course-by-program',
    courseByMentionAndSemester: 'course-mention-semester',
    semesterByMention: 'semester-by-mention',
    assignCourseToMention: 'assign-course-to-mention',
    semesterMention: 'semester-mention',

    //ACCOUNTING
    accounting: host + 'accounting',
    concepts: 'concepts',
    conceptsParent: 'concepts-parent',
    conceptsChild: 'concepts-child',
    cost: 'cost',
    egress: 'egress',
    cashBox: 'cashbox',
    cashBoxFlow: 'cashbox-flow',
    initialBalance: 'initial-balance',
    initial: 'initial',
    payment: 'payment',
    movement: 'movement',

    //SECURITY
    security: host + 'security',
    user: 'user',
    users: 'users',
    userType: 'user-type',
    login: 'login',
    session: 'session',
    module: 'module',
    administrative: 'administrative',
    administrativeContract: 'administrative-contract',
    role: 'role',
    roles: 'roles',
    privilege: 'privilege',

    //PERSONA
    person: host + 'person',
    persons: 'person',
    student: 'student',
    profile: 'profile',
    personType: 'person-type',
    study: 'study',
    postulant: 'postulant',
    personSearch: 'person-search',
    work: 'work',
    //INTRANET
    intranet: host + 'intranet',
    userIntranet: 'user-intranet',

    server: host,
    files: host + 'files/',
    docsProgram: 'docs-program/',
    docsStudent: 'docs-student/',
    voucher: 'voucher/',
    voucherPostulant: 'voucher-postulant/',
    personPhotography: 'person-photography/',
    slash: '/',

    headers: headers,
    key: 'Fj2VmL7SqVLjr8dimsDKwIS8lnUZMysUe5gGsUBBc9PI2vG9Kb',

    // MPT WEB
    web: host + 'web',

};

export default Config;
