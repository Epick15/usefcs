export default {
    items: [
        {
            id: 'general',
            title: 'General',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Principal',
                    type: 'item',
                    url: '/',
                    classes: 'nav-item',
                    icon: 'feather icon-home',
                }
            ]
        },
        {
            id: 'modules',
            title: 'Módulos',
            type: 'group',
            icon: 'icon-monitor',
            children: [
                {
                    id: 'programs',
                    title: 'Programas',
                    type: 'item',
                    url: '/programs',
                    classes: 'nav-item',
                    icon: 'feather icon-activity',

                },
                {
                    id: 'payment',
                    title: 'Pagos',
                    type: 'item',
                    url: '/payment  ',
                    classes: 'nav-item',
                    icon: 'feather icon-activity',

                },
                {
                    id: 'accounting',
                    title: 'Contabilidad',
                    type: 'item',
                    url: '/accounting',
                    classes: 'nav-item',
                    icon: 'feather icon-trending-up'
                },
                {
                    id: 'teacher',
                    title: 'Docentes',
                    type: 'item',
                    url: '/teacher',
                    classes: 'nav-item',
                    icon: 'feather icon-activity',

                },
                {
                    id: 'student',
                    title: 'Estudiantes',
                    type: 'item',
                    url: '/student',
                    classes: 'nav-item',
                    icon: 'feather icon-activity',

                },
                {
                    id: 'security',
                    title: 'Seguridad',
                    type: 'collapse',
                    icon: 'feather icon-lock',
                    children: [
                        {
                            id: 'modules',
                            title: 'Modulos',
                            type: 'item',
                            url: '/security/modules',
                        },
                        {
                            id: 'roles',
                            title: 'Roles',
                            type: 'item',
                            url: '/security/roles',
                        },
                        {
                            id: 'Users',
                            title: 'Usuarios',
                            type: 'item',
                            url: '/security/users',
                        },
                    ]
                }


            ]
        },
        {
            id: 'maintenance',
            title: 'Mantenimiento',
            type: 'group',
            icon: 'icon-ui',
            children: [
                {
                    id: 'Generalb',
                    title: 'General',
                    type: 'collapse',
                    icon: 'feather icon-list',
                    children: [
                        {
                            id: 'AcademicDegree',
                            title: 'Grado Academico',
                            type: 'item',
                            url: '/maintenance/academic-degree',
                        },
                        {
                            id: 'Bank',
                            title: 'Banco',
                            type: 'item',
                            url: '/maintenance/bank',
                        },
                        {
                            id: 'IdentificationDocument',
                            title: 'Documento de identificación',
                            type: 'item',
                            url: '/maintenance/identification-document',
                        },
                        {
                            id: 'SocialNetwork',
                            title: 'Red Social',
                            type: 'item',
                            url: '/maintenance/social-network',
                        },
                        {
                            id: 'Studylevel',
                            title: 'Nivel de Estudio',
                            type: 'item',
                            url: '/maintenance/study-level',
                        },
                        {
                            id: 'Uit',
                            title: 'Uit',
                            type: 'item',
                            url: '/maintenance/uit',
                        },

                    ]
                },
                {
                    id: 'academic',
                    title: 'Academico',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'ActivityType',
                            title: 'Tipo de actividad',
                            type: 'item',
                            url: '/maintenance/activity-type'
                        },


                    ]
                },
                {
                    id: 'location',
                    title: 'Localización',
                    type: 'collapse',
                    icon: 'feather icon-navigation',
                    children: [
                        {
                            id: 'ubiquitous',
                            title: 'Ubigeo',
                            type: 'item',
                            url: '/maintenance/ubiquitous'
                        }
                    ]
                },
                {
                    id: 'person',
                    title: 'Persona',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'civil-status',
                            title: 'Estado civil',
                            type: 'item',
                            url: '/maintenance/civil-status'
                        },
                        {
                            id: 'identification-document',
                            title: 'Doc. Identificación',
                            type: 'item',
                            url: '/maintenance/identification-document'
                        },
                        {
                            id: 'social-network',
                            title: 'Red Social',
                            type: 'item',
                            url: '/maintenance/social-network'
                        }
                    ]
                },
                {
                    id: 'university',
                    title: 'Universidad',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'Campus',
                            title: 'Campus',
                            type: 'item',
                            url: '/maintenance/campus'
                        },

                        {
                            id: 'OrganicUnitType',
                            title: 'Tipos de Uni.Org',
                            type: 'item',
                            url: '/maintenance/type-organic-unit'
                        },

                        {
                            id: 'type',
                            title: 'Tipos de Edificaciones',
                            type: 'item',
                            url: '/maintenance/type-edification'
                        },

                    ]
                },

            ]
        }
    ]
}
