export const links = {
  cita: 'https://icp.administracionelectronica.gob.es/icpplus/index.html',
  police: 'https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_tarjeta_residencia_residenciaytrabajo.php',
  ex17: 'https://www.inclusion.gob.es/documents/d/migraciones/ex17-formulario-solicitud-tarjeta-de-identidad-de-extranjero',
  fee: 'https://sede.policia.gob.es/Tasa790_012/',
  offices: 'https://www.mptfp.gob.es/portal/delegaciones_gobierno/extranjeria/extranjeria_ddgg.htm',
  tech: 'https://icp.administracionelectronica.gob.es/icpplus/contacto',
  policeOffices: 'https://sede.policia.gob.es/portalCiudadano/_es/dependencias_localizador.php',
  legal: 'https://icp.administracionelectronica.gob.es/icpplus/avisolegal',
  regreso: 'https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_autorizacionregreso.php',
};

export type CheckItem = { id: string; title: string; description: string; link?: string; linkText?: string };
export const checklist: CheckItem[] = [
  {id:'approval', title:'Решение об одобрении', description:'Убедитесь, что у вас есть решение по вашему случаю. Уточните, нужно ли принести его на приём.'},
  {id:'procedure', title:'Верный тип процедуры', description:'На портале выберите провинцию и внимательно прочитайте название процедуры. Проверьте, что она относится к вашей ситуации.'},
  {id:'ex17', title:'Заявление EX-17', description:'Официальная страница полиции для первичной карты или карты после продления указывает форму EX-17.', link:links.ex17, linkText:'Открыть форму EX-17'},
  {id:'fee', title:'Пошлина 790 · код 012', description:'Полиция указывает подтверждение оплаты. Точный пункт и сумму выбирайте по своей процедуре, сверяясь с официальной формой.', link:links.fee, linkText:'Открыть форму пошлины'},
  {id:'extra', title:'Остальные документы для вашего случая', description:'Уточните в своём отделении и в подтверждении записи список удостоверений, фотографий и дополнительных документов. Требования могут различаться.', link:links.police, linkText:'Страница полиции о TIE'},
  {id:'appointment', title:'Подтверждение записи', description:'После записи сохраните данные приёма и перепроверьте адрес, дату и список документов в официальном подтверждении.'},
];

export const spanishTemplate = `Buenos días:\n\nHe recibido una resolución favorable y estoy intentando solicitar una cita para la expedición de mi Tarjeta de Identidad de Extranjero (TIE) en [provincia]. Hasta el momento no he conseguido encontrar una cita disponible.\n\n¿Podrían indicarme cómo debo proceder en mi caso y qué canal debo utilizar para plantear esta consulta? Si existe un plazo aplicable, les agradecería que me indicaran cómo verificarlo.\n\nMuchas gracias por su ayuda.\nUn saludo.`;
