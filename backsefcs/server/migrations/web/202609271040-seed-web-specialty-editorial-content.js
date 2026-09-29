'use strict';

const entries = [
  {slug: 'aro', objectives: [
    'Reconocer los cambios fisiológicos del embarazo y diagnosticar la patología materna y fetal, para elaborar un plan de control y tratamiento en concordancia con la gravedad de la patología.',
    'Interpretar adecuadamente la literatura científica haciendo hincapié especialmente en la metodología utilizada por la medicina basada en evidencias.',
    'Conocer e interpretar los resultados de las diferentes técnicas moleculares de apoyo al diagnóstico citogenética.',
    'Desarrollar las competencias y habilidades para la gestión y administración de la investigación y de las Unidades de UCI obstétrico.'
  ], competencies: [
    'Precisa e interpreta las patologías mas frecuentes que pueden afectar a la madre y al feto.',
    'Explica el fundamento e interpreta adecuadamente los resultados de cada uno de los exámenes y procedimientos auxiliares del diagnóstico usados en el diagnóstico de la salud materna y fetal en el nivel de su competencia.'
  ]},
  {slug: 'eco', objectives: [
    'Promover la capacitación actualizada y especializada de alto nivel científico.',
    'Impulsar la docencia especializada en Obstetricia.',
    'Desarrollar en el profesional de Obstetricia especialista una voluntad compulsiva de perfeccionamiento.',
    'Desarrollar las competencias y habilidades para la gestión y administración de la investigación.',
    'Formar Obstetras especialistas con un alto nivel de eficiencia en la atención de la Salud Integral.'
  ], competencies: [
    'Precisa e interpreta las patologías mas frecuentes que pueden afectar a la madre y al feto.',
    'Explica el fundamento e interpreta adecuadamente los resultados de cada uno de los exámenes y procedimientos auxiliares del diagnóstico usados en el diagnóstico de la salud materna y fetal en el nivel de su competencia.'
  ]},
  {slug: 'cacu', objectives: [
    'Formar profesionales del área de la salud sexual y reproductiva con capacidades creativas e innovadoras orientados al desarrollo de la salud integral a la mujer, pareja y familia durante el periodo reproductivo, básicamente en salud reproductiva con énfasis en cáncer de cuello uterino y mamas, desarrollando intervenciones de comunicación y educación en salud para el cambio hacia comportamiento saludable, seguro y protegido.',
    'Fortalecer las capacidades en los participantes en la planificación, organización, ejecución y evaluación de actividades en salud reproductiva con énfasis en Cáncer de cuello uterino y mamas, incorporando estrategias que faciliten la participación de todos los actores sociales y políticos.'
  ], competencies: [
    'Desarrollo la acciones de promoción de la salud sexual y reproductiva en distintos escenarios, especialmente con las poblaciones vulnerables evaluando y controlando los procesos, resultados e impacto de las intervenciones realizadas en el campo de la salud.',
    'Diseña y propone modelos de intervención innovadores y pertinentes para la promoción y prevención del cáncer Ginecológico.'
  ]}
];

module.exports = {
  up: async queryInterface => {
    for (const entry of entries) await queryInterface.bulkUpdate({tableName: 'Web_specialty', schema: 'web'}, {objectives: JSON.stringify(entry.objectives), competencies: JSON.stringify(entry.competencies), updated_at: new Date()}, {slug: entry.slug});
  },
  down: async queryInterface => {
    for (const entry of entries) await queryInterface.bulkUpdate({tableName: 'Web_specialty', schema: 'web'}, {objectives: JSON.stringify([]), competencies: JSON.stringify([]), updated_at: new Date()}, {slug: entry.slug});
  }
};
