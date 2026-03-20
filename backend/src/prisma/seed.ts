import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ============================================
// CATEGORÍAS BASE
// ============================================

const categories = [
  { name: 'Güipiles', slug: 'guipiles', description: 'Blusas tradicionales tejidas y bordadas a mano, representativas de cada municipio de Guatemala.' },
  { name: 'Cortes', slug: 'cortes', description: 'Faldas tradicionales de tela tejida en telar, usadas con el güipil como parte del traje típico.' },
  { name: 'Fajas', slug: 'fajas', description: 'Cinturones tejidos que se usan para sujetar el corte a la cintura.' },
  { name: 'Perrajes', slug: 'perrajes', description: 'Mantas multiusos: se llevan sobre los hombros, en la cabeza, o para cargar.' },
  { name: 'Complementos Modernos', slug: 'complementos-modernos', description: 'Prendas contemporáneas que combinan con ropa típica: jeans, faldas de lona, blusas modernas.' },
  { name: 'Accesorios', slug: 'accesorios', description: 'Bolsas, aretes, collares, cinturones y otros accesorios con inspiración en textiles guatemaltecos.' },
]

// ============================================
// LOS 22 DEPARTAMENTOS Y SUS MUNICIPIOS
// ============================================

const departmentsWithMunicipalities: { name: string; slug: string; municipalities: { name: string; slug: string }[] }[] = [
  {
    name: 'Alta Verapaz', slug: 'alta-verapaz',
    municipalities: [
      { name: 'Cobán', slug: 'coban' },
      { name: 'Santa Cruz Verapaz', slug: 'santa-cruz-verapaz' },
      { name: 'San Cristóbal Verapaz', slug: 'san-cristobal-verapaz' },
      { name: 'Tactic', slug: 'tactic' },
      { name: 'Tamahú', slug: 'tamahu' },
      { name: 'San Miguel Tucurú', slug: 'san-miguel-tucuru' },
      { name: 'Panzós', slug: 'panzos' },
      { name: 'Senahú', slug: 'senahu' },
      { name: 'San Pedro Carchá', slug: 'san-pedro-carcha' },
      { name: 'Lanquín', slug: 'lanquin' },
      { name: 'Cahabón', slug: 'cahabon' },
      { name: 'Chisec', slug: 'chisec' },
      { name: 'Chahal', slug: 'chahal' },
      { name: 'Fray Bartolomé de las Casas', slug: 'fray-bartolome-de-las-casas' },
      { name: 'Santa Catalina La Tinta', slug: 'santa-catalina-la-tinta' },
      { name: 'Raxruhá', slug: 'raxruha' },
    ],
  },
  {
    name: 'Baja Verapaz', slug: 'baja-verapaz',
    municipalities: [
      { name: 'Salamá', slug: 'salama' },
      { name: 'San Miguel Chicaj', slug: 'san-miguel-chicaj' },
      { name: 'Rabinal', slug: 'rabinal' },
      { name: 'Cubulco', slug: 'cubulco' },
      { name: 'Granados', slug: 'granados' },
      { name: 'Santa Cruz El Chol', slug: 'santa-cruz-el-chol' },
      { name: 'San Jerónimo', slug: 'san-jeronimo-bv' },
      { name: 'Purulhá', slug: 'purulha' },
    ],
  },
  {
    name: 'Chimaltenango', slug: 'chimaltenango',
    municipalities: [
      { name: 'Chimaltenango', slug: 'chimaltenango-muni' },
      { name: 'San José Poaquil', slug: 'san-jose-poaquil' },
      { name: 'San Martín Jilotepeque', slug: 'san-martin-jilotepeque' },
      { name: 'Comalapa', slug: 'comalapa' },
      { name: 'Santa Apolonia', slug: 'santa-apolonia' },
      { name: 'Tecpán Guatemala', slug: 'tecpan-guatemala' },
      { name: 'Patzún', slug: 'patzun' },
      { name: 'Pochuta', slug: 'pochuta' },
      { name: 'Patzicía', slug: 'patzicia' },
      { name: 'Santa Cruz Balanyá', slug: 'santa-cruz-balanya' },
      { name: 'Acatenango', slug: 'acatenango' },
      { name: 'Yepocapa', slug: 'yepocapa' },
      { name: 'San Andrés Itzapa', slug: 'san-andres-itzapa' },
      { name: 'Parramos', slug: 'parramos' },
      { name: 'Zaragoza', slug: 'zaragoza' },
      { name: 'El Tejar', slug: 'el-tejar' },
    ],
  },
  {
    name: 'Chiquimula', slug: 'chiquimula',
    municipalities: [
      { name: 'Chiquimula', slug: 'chiquimula-muni' },
      { name: 'San José La Arada', slug: 'san-jose-la-arada' },
      { name: 'San Juan Ermita', slug: 'san-juan-ermita' },
      { name: 'Jocotán', slug: 'jocotan' },
      { name: 'Camotán', slug: 'camotan' },
      { name: 'Olopa', slug: 'olopa' },
      { name: 'Esquipulas', slug: 'esquipulas' },
      { name: 'Concepción Las Minas', slug: 'concepcion-las-minas' },
      { name: 'Quetzaltepeque', slug: 'quetzaltepeque' },
      { name: 'San Jacinto', slug: 'san-jacinto' },
      { name: 'Ipala', slug: 'ipala' },
    ],
  },
  {
    name: 'Petén', slug: 'peten',
    municipalities: [
      { name: 'Flores', slug: 'flores' },
      { name: 'San José', slug: 'san-jose-peten' },
      { name: 'San Benito', slug: 'san-benito' },
      { name: 'San Andrés', slug: 'san-andres-peten' },
      { name: 'La Libertad', slug: 'la-libertad-peten' },
      { name: 'San Francisco', slug: 'san-francisco-peten' },
      { name: 'Santa Ana', slug: 'santa-ana-peten' },
      { name: 'Dolores', slug: 'dolores' },
      { name: 'San Luis', slug: 'san-luis-peten' },
      { name: 'Sayaxché', slug: 'sayaxche' },
      { name: 'Melchor de Mencos', slug: 'melchor-de-mencos' },
      { name: 'Poptún', slug: 'poptun' },
      { name: 'Las Cruces', slug: 'las-cruces' },
      { name: 'El Chal', slug: 'el-chal' },
    ],
  },
  {
    name: 'El Progreso', slug: 'el-progreso',
    municipalities: [
      { name: 'Guastatoya', slug: 'guastatoya' },
      { name: 'Morazán', slug: 'morazan' },
      { name: 'San Agustín Acasaguastlán', slug: 'san-agustin-acasaguastlan' },
      { name: 'San Cristóbal Acasaguastlán', slug: 'san-cristobal-acasaguastlan' },
      { name: 'El Jícaro', slug: 'el-jicaro' },
      { name: 'Sansare', slug: 'sansare' },
      { name: 'Sanarate', slug: 'sanarate' },
      { name: 'San Antonio La Paz', slug: 'san-antonio-la-paz' },
    ],
  },
  {
    name: 'Quetzaltenango', slug: 'quetzaltenango',
    municipalities: [
      { name: 'Quetzaltenango', slug: 'quetzaltenango-muni' },
      { name: 'Salcajá', slug: 'salcaja' },
      { name: 'Olintepeque', slug: 'olintepeque' },
      { name: 'San Carlos Sija', slug: 'san-carlos-sija' },
      { name: 'Sibilia', slug: 'sibilia' },
      { name: 'Cabricán', slug: 'cabrican' },
      { name: 'Cajolá', slug: 'cajola' },
      { name: 'San Miguel Sigüilá', slug: 'san-miguel-siguila' },
      { name: 'Ostuncalco', slug: 'ostuncalco' },
      { name: 'San Mateo', slug: 'san-mateo-quetzaltenango' },
      { name: 'Concepción Chiquirichapa', slug: 'concepcion-chiquirichapa' },
      { name: 'San Martín Sacatepéquez', slug: 'san-martin-sacatepequez' },
      { name: 'Almolonga', slug: 'almolonga' },
      { name: 'Cantel', slug: 'cantel' },
      { name: 'Huitán', slug: 'huitan' },
      { name: 'Zunil', slug: 'zunil' },
      { name: 'Colomba Costa Cuca', slug: 'colomba-costa-cuca' },
      { name: 'San Francisco La Unión', slug: 'san-francisco-la-union' },
      { name: 'El Palmar', slug: 'el-palmar' },
      { name: 'Coatepeque', slug: 'coatepeque' },
      { name: 'Génova', slug: 'genova' },
      { name: 'Flores Costa Cuca', slug: 'flores-costa-cuca' },
      { name: 'La Esperanza', slug: 'la-esperanza' },
      { name: 'Palestina de los Altos', slug: 'palestina-de-los-altos' },
    ],
  },
  {
    name: 'Quiché', slug: 'quiche',
    municipalities: [
      { name: 'Santa Cruz del Quiché', slug: 'santa-cruz-del-quiche' },
      { name: 'Chiché', slug: 'chiche' },
      { name: 'Chinique', slug: 'chinique' },
      { name: 'Zacualpa', slug: 'zacualpa' },
      { name: 'Chajul', slug: 'chajul' },
      { name: 'Chichicastenango', slug: 'chichicastenango' },
      { name: 'Patzité', slug: 'patzite' },
      { name: 'San Antonio Ilotenango', slug: 'san-antonio-ilotenango' },
      { name: 'San Pedro Jocopilas', slug: 'san-pedro-jocopilas' },
      { name: 'Cunén', slug: 'cunen' },
      { name: 'San Juan Cotzal', slug: 'san-juan-cotzal' },
      { name: 'Joyabaj', slug: 'joyabaj' },
      { name: 'Nebaj', slug: 'nebaj' },
      { name: 'San Andrés Sajcabajá', slug: 'san-andres-sajcabaja' },
      { name: 'Uspantán', slug: 'uspantan' },
      { name: 'Sacapulas', slug: 'sacapulas' },
      { name: 'San Bartolomé Jocotenango', slug: 'san-bartolome-jocotenango' },
      { name: 'Canillá', slug: 'canilla' },
      { name: 'Chicamán', slug: 'chicaman' },
      { name: 'Ixcán', slug: 'ixcan' },
      { name: 'Pachalum', slug: 'pachalum' },
    ],
  },
  {
    name: 'Escuintla', slug: 'escuintla',
    municipalities: [
      { name: 'Escuintla', slug: 'escuintla-muni' },
      { name: 'Santa Lucía Cotzumalguapa', slug: 'santa-lucia-cotzumalguapa' },
      { name: 'La Democracia', slug: 'la-democracia' },
      { name: 'Siquinalá', slug: 'siquinala' },
      { name: 'Masagua', slug: 'masagua' },
      { name: 'Tiquisate', slug: 'tiquisate' },
      { name: 'La Gomera', slug: 'la-gomera' },
      { name: 'Guanagazapa', slug: 'guanagazapa' },
      { name: 'San José', slug: 'san-jose-escuintla' },
      { name: 'Iztapa', slug: 'iztapa' },
      { name: 'Palín', slug: 'palin' },
      { name: 'San Vicente Pacaya', slug: 'san-vicente-pacaya' },
      { name: 'Nueva Concepción', slug: 'nueva-concepcion' },
      { name: 'Sipacate', slug: 'sipacate' },
    ],
  },
  {
    name: 'Guatemala', slug: 'guatemala',
    municipalities: [
      { name: 'Guatemala', slug: 'guatemala-muni' },
      { name: 'Santa Catarina Pinula', slug: 'santa-catarina-pinula' },
      { name: 'San José Pinula', slug: 'san-jose-pinula' },
      { name: 'San José del Golfo', slug: 'san-jose-del-golfo' },
      { name: 'Palencia', slug: 'palencia' },
      { name: 'Chinautla', slug: 'chinautla' },
      { name: 'San Pedro Ayampuc', slug: 'san-pedro-ayampuc' },
      { name: 'Mixco', slug: 'mixco' },
      { name: 'San Pedro Sacatepéquez', slug: 'san-pedro-sacatepequez-gua' },
      { name: 'San Juan Sacatepéquez', slug: 'san-juan-sacatepequez' },
      { name: 'San Raymundo', slug: 'san-raymundo' },
      { name: 'Chuarrancho', slug: 'chuarrancho' },
      { name: 'Fraijanes', slug: 'fraijanes' },
      { name: 'Amatitlán', slug: 'amatitlan' },
      { name: 'Villa Nueva', slug: 'villa-nueva' },
      { name: 'Villa Canales', slug: 'villa-canales' },
      { name: 'Petapa', slug: 'petapa' },
    ],
  },
  {
    name: 'Huehuetenango', slug: 'huehuetenango',
    municipalities: [
      { name: 'Huehuetenango', slug: 'huehuetenango-muni' },
      { name: 'Chiantla', slug: 'chiantla' },
      { name: 'Malacatancito', slug: 'malacatancito' },
      { name: 'Cuilco', slug: 'cuilco' },
      { name: 'Nentón', slug: 'nenton' },
      { name: 'San Pedro Necta', slug: 'san-pedro-necta' },
      { name: 'Jacaltenango', slug: 'jacaltenango' },
      { name: 'Soloma', slug: 'soloma' },
      { name: 'San Ildefonso Ixtahuacán', slug: 'san-ildefonso-ixtahuacan' },
      { name: 'Santa Bárbara', slug: 'santa-barbara' },
      { name: 'La Libertad', slug: 'la-libertad-huehue' },
      { name: 'La Democracia', slug: 'la-democracia-huehue' },
      { name: 'San Miguel Acatán', slug: 'san-miguel-acatan' },
      { name: 'San Rafael La Independencia', slug: 'san-rafael-la-independencia' },
      { name: 'Todos Santos Cuchumatán', slug: 'todos-santos-cuchumatan' },
      { name: 'San Juan Atitán', slug: 'san-juan-atitan' },
      { name: 'Santa Eulalia', slug: 'santa-eulalia' },
      { name: 'San Mateo Ixtatán', slug: 'san-mateo-ixtatan' },
      { name: 'Colotenango', slug: 'colotenango' },
      { name: 'San Sebastián Huehuetenango', slug: 'san-sebastian-huehuetenango' },
      { name: 'Tectitán', slug: 'tectitan' },
      { name: 'Concepción Huista', slug: 'concepcion-huista' },
      { name: 'San Juan Ixcoy', slug: 'san-juan-ixcoy' },
      { name: 'San Antonio Huista', slug: 'san-antonio-huista' },
      { name: 'San Sebastián Coatán', slug: 'san-sebastian-coatan' },
      { name: 'Barillas', slug: 'barillas' },
      { name: 'Aguacatán', slug: 'aguacatan' },
      { name: 'San Rafael Petzal', slug: 'san-rafael-petzal' },
      { name: 'San Gaspar Ixchil', slug: 'san-gaspar-ixchil' },
      { name: 'Santiago Chimaltenango', slug: 'santiago-chimaltenango' },
      { name: 'Santa Ana Huista', slug: 'santa-ana-huista' },
      { name: 'Unión Cantinil', slug: 'union-cantinil' },
      { name: 'Petatán', slug: 'petatan' },
    ],
  },
  {
    name: 'Izabal', slug: 'izabal',
    municipalities: [
      { name: 'Puerto Barrios', slug: 'puerto-barrios' },
      { name: 'Livingston', slug: 'livingston' },
      { name: 'El Estor', slug: 'el-estor' },
      { name: 'Morales', slug: 'morales' },
      { name: 'Los Amates', slug: 'los-amates' },
    ],
  },
  {
    name: 'Jalapa', slug: 'jalapa',
    municipalities: [
      { name: 'Jalapa', slug: 'jalapa-muni' },
      { name: 'San Pedro Pinula', slug: 'san-pedro-pinula' },
      { name: 'San Luis Jilotepeque', slug: 'san-luis-jilotepeque' },
      { name: 'San Manuel Chaparrón', slug: 'san-manuel-chaparron' },
      { name: 'San Carlos Alzatate', slug: 'san-carlos-alzatate' },
      { name: 'Monjas', slug: 'monjas' },
      { name: 'Mataquescuintla', slug: 'mataquescuintla' },
    ],
  },
  {
    name: 'Jutiapa', slug: 'jutiapa',
    municipalities: [
      { name: 'Jutiapa', slug: 'jutiapa-muni' },
      { name: 'El Progreso', slug: 'el-progreso-jutiapa' },
      { name: 'Santa Catarina Mita', slug: 'santa-catarina-mita' },
      { name: 'Agua Blanca', slug: 'agua-blanca' },
      { name: 'Asunción Mita', slug: 'asuncion-mita' },
      { name: 'Yupiltepeque', slug: 'yupiltepeque' },
      { name: 'Atescatempa', slug: 'atescatempa' },
      { name: 'Jerez', slug: 'jerez' },
      { name: 'El Adelanto', slug: 'el-adelanto' },
      { name: 'Zapotitlán', slug: 'zapotitlan' },
      { name: 'Comapa', slug: 'comapa' },
      { name: 'Jalpatagua', slug: 'jalpatagua' },
      { name: 'Conguaco', slug: 'conguaco' },
      { name: 'Moyuta', slug: 'moyuta' },
      { name: 'Pasaco', slug: 'pasaco' },
      { name: 'San José Acatempa', slug: 'san-jose-acatempa' },
      { name: 'Quesada', slug: 'quesada' },
    ],
  },
  {
    name: 'Retalhuleu', slug: 'retalhuleu',
    municipalities: [
      { name: 'Retalhuleu', slug: 'retalhuleu-muni' },
      { name: 'San Sebastián', slug: 'san-sebastian-retalhuleu' },
      { name: 'Santa Cruz Muluá', slug: 'santa-cruz-mulua' },
      { name: 'San Martín Zapotitlán', slug: 'san-martin-zapotitlan' },
      { name: 'San Felipe', slug: 'san-felipe-retalhuleu' },
      { name: 'San Andrés Villa Seca', slug: 'san-andres-villa-seca' },
      { name: 'Champerico', slug: 'champerico' },
      { name: 'Nuevo San Carlos', slug: 'nuevo-san-carlos' },
      { name: 'El Asintal', slug: 'el-asintal' },
    ],
  },
  {
    name: 'Sacatepéquez', slug: 'sacatepequez',
    municipalities: [
      { name: 'Antigua Guatemala', slug: 'antigua-guatemala' },
      { name: 'Jocotenango', slug: 'jocotenango' },
      { name: 'Pastores', slug: 'pastores' },
      { name: 'Sumpango', slug: 'sumpango' },
      { name: 'Santo Domingo Xenacoj', slug: 'santo-domingo-xenacoj' },
      { name: 'Santiago Sacatepéquez', slug: 'santiago-sacatepequez' },
      { name: 'San Bartolomé Milpas Altas', slug: 'san-bartolome-milpas-altas' },
      { name: 'San Lucas Sacatepéquez', slug: 'san-lucas-sacatepequez' },
      { name: 'Santa Lucía Milpas Altas', slug: 'santa-lucia-milpas-altas' },
      { name: 'Magdalena Milpas Altas', slug: 'magdalena-milpas-altas' },
      { name: 'Santa María de Jesús', slug: 'santa-maria-de-jesus' },
      { name: 'Ciudad Vieja', slug: 'ciudad-vieja' },
      { name: 'San Miguel Dueñas', slug: 'san-miguel-duenas' },
      { name: 'Alotenango', slug: 'alotenango' },
      { name: 'San Antonio Aguas Calientes', slug: 'san-antonio-aguas-calientes' },
      { name: 'Santa Catarina Barahona', slug: 'santa-catarina-barahona' },
    ],
  },
  {
    name: 'San Marcos', slug: 'san-marcos',
    municipalities: [
      { name: 'San Marcos', slug: 'san-marcos-muni' },
      { name: 'San Pedro Sacatepéquez', slug: 'san-pedro-sacatepequez-sm' },
      { name: 'San Antonio Sacatepéquez', slug: 'san-antonio-sacatepequez' },
      { name: 'Comitancillo', slug: 'comitancillo' },
      { name: 'San Miguel Ixtahuacán', slug: 'san-miguel-ixtahuacan' },
      { name: 'Concepción Tutuapa', slug: 'concepcion-tutuapa' },
      { name: 'Tacaná', slug: 'tacana' },
      { name: 'Sibinal', slug: 'sibinal' },
      { name: 'Tajumulco', slug: 'tajumulco' },
      { name: 'Tejutla', slug: 'tejutla' },
      { name: 'San Rafael Pie de la Cuesta', slug: 'san-rafael-pie-de-la-cuesta' },
      { name: 'Nuevo Progreso', slug: 'nuevo-progreso' },
      { name: 'El Tumbador', slug: 'el-tumbador' },
      { name: 'El Rodeo', slug: 'el-rodeo' },
      { name: 'Malacatán', slug: 'malacatan' },
      { name: 'Catarina', slug: 'catarina' },
      { name: 'Ayutla', slug: 'ayutla' },
      { name: 'Ocós', slug: 'ocos' },
      { name: 'San Pablo', slug: 'san-pablo-san-marcos' },
      { name: 'El Quetzal', slug: 'el-quetzal' },
      { name: 'La Reforma', slug: 'la-reforma' },
      { name: 'Pajapita', slug: 'pajapita' },
      { name: 'Ixchiguán', slug: 'ixchiguan' },
      { name: 'San José Ojetenam', slug: 'san-jose-ojetenam' },
      { name: 'San Cristóbal Cucho', slug: 'san-cristobal-cucho' },
      { name: 'Sipacapa', slug: 'sipacapa' },
      { name: 'Esquipulas Palo Gordo', slug: 'esquipulas-palo-gordo' },
      { name: 'Río Blanco', slug: 'rio-blanco' },
      { name: 'San Lorenzo', slug: 'san-lorenzo-san-marcos' },
      { name: 'La Blanca', slug: 'la-blanca' },
    ],
  },
  {
    name: 'Santa Rosa', slug: 'santa-rosa',
    municipalities: [
      { name: 'Cuilapa', slug: 'cuilapa' },
      { name: 'Barberena', slug: 'barberena' },
      { name: 'Santa Rosa de Lima', slug: 'santa-rosa-de-lima' },
      { name: 'Casillas', slug: 'casillas' },
      { name: 'San Rafael Las Flores', slug: 'san-rafael-las-flores' },
      { name: 'Oratorio', slug: 'oratorio' },
      { name: 'San Juan Tecuaco', slug: 'san-juan-tecuaco' },
      { name: 'Chiquimulilla', slug: 'chiquimulilla' },
      { name: 'Taxisco', slug: 'taxisco' },
      { name: 'Santa María Ixhuatán', slug: 'santa-maria-ixhuatan' },
      { name: 'Guazacapán', slug: 'guazacapan' },
      { name: 'Santa Cruz Naranjo', slug: 'santa-cruz-naranjo' },
      { name: 'Pueblo Nuevo Viñas', slug: 'pueblo-nuevo-vinas' },
      { name: 'Nueva Santa Rosa', slug: 'nueva-santa-rosa' },
    ],
  },
  {
    name: 'Sololá', slug: 'solola',
    municipalities: [
      { name: 'Sololá', slug: 'solola-muni' },
      { name: 'San José Chacayá', slug: 'san-jose-chacaya' },
      { name: 'Santa María Visitación', slug: 'santa-maria-visitacion' },
      { name: 'Santa Lucía Utatlán', slug: 'santa-lucia-utatlan' },
      { name: 'Nahualá', slug: 'nahuala' },
      { name: 'Santa Catarina Ixtahuacán', slug: 'santa-catarina-ixtahuacan' },
      { name: 'Santa Clara La Laguna', slug: 'santa-clara-la-laguna' },
      { name: 'Concepción', slug: 'concepcion-solola' },
      { name: 'San Andrés Semetabaj', slug: 'san-andres-semetabaj' },
      { name: 'Panajachel', slug: 'panajachel' },
      { name: 'Santa Catarina Palopó', slug: 'santa-catarina-palopo' },
      { name: 'San Antonio Palopó', slug: 'san-antonio-palopo' },
      { name: 'San Lucas Tolimán', slug: 'san-lucas-toliman' },
      { name: 'Santa Cruz La Laguna', slug: 'santa-cruz-la-laguna' },
      { name: 'San Pablo La Laguna', slug: 'san-pablo-la-laguna' },
      { name: 'San Marcos La Laguna', slug: 'san-marcos-la-laguna' },
      { name: 'San Juan La Laguna', slug: 'san-juan-la-laguna' },
      { name: 'San Pedro La Laguna', slug: 'san-pedro-la-laguna' },
      { name: 'Santiago Atitlán', slug: 'santiago-atitlan' },
    ],
  },
  {
    name: 'Suchitepéquez', slug: 'suchitepequez',
    municipalities: [
      { name: 'Mazatenango', slug: 'mazatenango' },
      { name: 'Cuyotenango', slug: 'cuyotenango' },
      { name: 'San Francisco Zapotitlán', slug: 'san-francisco-zapotitlan' },
      { name: 'San Bernardino', slug: 'san-bernardino' },
      { name: 'San José El Ídolo', slug: 'san-jose-el-idolo' },
      { name: 'Santo Domingo Suchitepéquez', slug: 'santo-domingo-suchitepequez' },
      { name: 'San Lorenzo', slug: 'san-lorenzo-suchitepequez' },
      { name: 'Samayac', slug: 'samayac' },
      { name: 'San Pablo Jocopilas', slug: 'san-pablo-jocopilas' },
      { name: 'San Antonio Suchitepéquez', slug: 'san-antonio-suchitepequez' },
      { name: 'San Miguel Panán', slug: 'san-miguel-panan' },
      { name: 'San Gabriel', slug: 'san-gabriel' },
      { name: 'Chicacao', slug: 'chicacao' },
      { name: 'Patulul', slug: 'patulul' },
      { name: 'Santa Bárbara', slug: 'santa-barbara-suchitepequez' },
      { name: 'San Juan Bautista', slug: 'san-juan-bautista' },
      { name: 'Santo Tomás La Unión', slug: 'santo-tomas-la-union' },
      { name: 'Zunilito', slug: 'zunilito' },
      { name: 'Pueblo Nuevo', slug: 'pueblo-nuevo-suchitepequez' },
      { name: 'Río Bravo', slug: 'rio-bravo' },
      { name: 'San José La Máquina', slug: 'san-jose-la-maquina' },
    ],
  },
  {
    name: 'Totonicapán', slug: 'totonicapan',
    municipalities: [
      { name: 'Totonicapán', slug: 'totonicapan-muni' },
      { name: 'San Cristóbal Totonicapán', slug: 'san-cristobal-totonicapan' },
      { name: 'San Francisco El Alto', slug: 'san-francisco-el-alto' },
      { name: 'San Andrés Xecul', slug: 'san-andres-xecul' },
      { name: 'Momostenango', slug: 'momostenango' },
      { name: 'Santa María Chiquimula', slug: 'santa-maria-chiquimula' },
      { name: 'Santa Lucía La Reforma', slug: 'santa-lucia-la-reforma' },
      { name: 'San Bartolo', slug: 'san-bartolo' },
    ],
  },
  {
    name: 'Zacapa', slug: 'zacapa',
    municipalities: [
      { name: 'Zacapa', slug: 'zacapa-muni' },
      { name: 'Estanzuela', slug: 'estanzuela' },
      { name: 'Río Hondo', slug: 'rio-hondo' },
      { name: 'Gualán', slug: 'gualan' },
      { name: 'Teculután', slug: 'teculutan' },
      { name: 'Usumatlán', slug: 'usumatlan' },
      { name: 'Cabañas', slug: 'cabanas' },
      { name: 'San Diego', slug: 'san-diego' },
      { name: 'La Unión', slug: 'la-union-zacapa' },
      { name: 'Huité', slug: 'huite' },
      { name: 'San Jorge', slug: 'san-jorge' },
    ],
  },
]

// ============================================
// FUNCIÓN PRINCIPAL DEL SEED
// ============================================

async function main() {
  console.log('Iniciando seed de la base de datos...\n')

  // 1. Crear categorías
  console.log('Creando categorías...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`  ✓ ${categories.length} categorías creadas\n`)

  // 2. Crear departamentos y municipios
  console.log('Creando departamentos y municipios...')
  let totalMunicipalities = 0

  for (const dept of departmentsWithMunicipalities) {
    const department = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: { name: dept.name, slug: dept.slug },
    })

    for (const muni of dept.municipalities) {
      await prisma.municipality.upsert({
        where: { slug: muni.slug },
        update: {},
        create: {
          name: muni.name,
          slug: muni.slug,
          department_id: department.id,
        },
      })
      totalMunicipalities++
    }
  }

  console.log(`  ✓ ${departmentsWithMunicipalities.length} departamentos creados`)
  console.log(`  ✓ ${totalMunicipalities} municipios creados\n`)

  console.log('Seed completado exitosamente.')
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
