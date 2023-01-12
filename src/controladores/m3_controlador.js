/**---------------------------------------MODULO APERTURA Y CIERRE----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - CONSULTA NOVEDADES
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* muestra todas la novedades TH cargadas al usuario
*
* @param   {object}  param  objecto con los parametros para cargar la tabla con las novedades th del usuario
*
* @return  {object}         Tabla
*/
function m3_1_gs_solicitud_consulta(param) {
	try {

		param.titulos = ["OFICINA", "NOVEDAD", "INICIO NOVEDAD", "FIN NOVEDAD", "OBSERVACION", "AUTORIZADO", "VIGENTE", "SOPORTE"];
		param.datos = [];
		var contenido;
		var fecha_inicio = param.criterio.fecha_inicial.split("-");
		var fecha_fin = param.criterio.fecha_final.split("-");
		var f_inicio = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
		var f_fin = new Date(fecha_fin[0], fecha_fin[1] - 1, fecha_fin[2]);
		var novedad = query({
			tabla: "NOVEDADES_TH",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "ID_USUARIO"],
				criterio: [f_inicio, f_fin, param.criterio.id_usuario],
				comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL"],
				operador: ["Y", "Y"]
			},
			depuracion: {
				archivo: "m3_controlador",
				funcion: "m3_1_gs_solicitud_consulta",
				variable: "novedad"
			}
		});
		for (var j = 0; j < novedad.registros; j++) {
			var fila = [];
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [novedad.datos[j].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m3_controlador",
					funcion: "m3_1_gs_solicitud_consulta",
					variable: "oficina"
				}
			});
			fila.push(oficina.datos[0].oficina);
			fila.push(novedad.datos[j].novedad);
			fila.push(fecha_texto(novedad.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
			fila.push(fecha_texto(novedad.datos[j].fecha_fin_novedad, "FECHA_HORA"));
			fila.push(novedad.datos[j].detalle);
			if (novedad.datos[j].autorizado == 1) {
				fila.push("SI");
			} else {
				fila.push("NO");
			}
			if (novedad.datos[j].vigencia == 1) {
				fila.push("SI");
			} else {
				fila.push("NO");
			}

			if (novedad.datos[j].soporte !== "") {
				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: ["RUTA"],
					condicion: {
						condicion: true,
						campo: ["ID_UPLOAD"],
						criterio: [novedad.datos[j].soporte],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" >Permiso Autorizado</a>')
			} else {
				if (novedad.datos[j].id_archivo !== "") {
					contenido = '';
					contenido = '<a id="m3_1_a_consulta_novedades_' + novedad.datos[j].id_archivo + '" href="https://docs.google.com/spreadsheets/d/' + novedad.datos[j].id_archivo + '/edit?usp=sharing" target="_blank" ><i class="material-icons">print</i></a>';
					contenido += '<div class="mdl-tooltip" for="m3_1_a_consulta_novedades_' + novedad.datos[j].id_archivo + '">Por favor haga clic aquí si desea imprimir el soporte</div>';
					fila.push(contenido);
				} else {
					fila.push("");
				}
			}
			param.datos.push(fila);
		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m3_1_gs_solicitud_consulta", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - SOLICITUD DE PERMISO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* guarda una nueva solicitud de permiso
*
* @param   {object}  frm  formulario con los datos de la solicitud
*
* @return  {object}       objecto r con los resultados de la operacion
*/
function m3_2_gs_solicitud(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente",
			id_archivo: ''
		}
		var u = usuario();
		var fecha_actual = new Date();
		var fecha_inicial_comparacion = new Date(frm.m3_2_txt_solicitud_fecha_inicio_novedad);
		var fecha_final_comparacion = new Date(frm.m3_2_txt_solicitud_fecha_fin_novedad);
		var dif_horas = Math.abs((fecha_inicial_comparacion - fecha_final_comparacion) / 36e5);

		var sw_privilegio_extemporaneidad;
		if (verificar_acceso("3_18")) {
			sw_privilegio_extemporaneidad = true;
		} else {
			if (fecha_inicial_comparacion > fecha_actual) {
				sw_privilegio_extemporaneidad = true;
			} else {
				sw_privilegio_extemporaneidad = false;
				r.exito = false;
				r.mensaje = "La fecha de inicio de la solicitud de permiso no puede ser anterior a la fecha actual";
			}
		}
		if (sw_privilegio_extemporaneidad) {
			if (fecha_final_comparacion > fecha_inicial_comparacion) {
				if (verificar_acceso("3_16")) {
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "ID_USUARIO", "AUTORIZADO"],
							criterio: [fecha_inicial_comparacion, fecha_inicial_comparacion, fecha_final_comparacion, fecha_final_comparacion, frm.m3_2_sel_solicitud_usuario, 1],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "O", "Y", "Y", "Y", "Y"]
						}
					});
				} else {
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "ID_USUARIO", "AUTORIZADO"],
							criterio: [fecha_inicial_comparacion, fecha_inicial_comparacion, fecha_final_comparacion, fecha_final_comparacion, u.id_usuario, 1],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "O", "Y", "Y", "Y", "Y"]
						}
					});
				}
				if (th.registros == 0) {
					var fecha_inicial = new Date(frm.m3_2_txt_solicitud_fecha_inicio_novedad);
					var fecha_final = new Date(frm.m3_2_txt_solicitud_fecha_fin_novedad);
					if (fecha_inicial.getDate() !== fecha_final.getDate()) {
						fecha_inicial.setHours(0, 0, 0, 0);
						fecha_final.setHours(0, 0, 0, 0);
					}
					if (verificar_acceso("3_16")) {
						var usuario_permiso = query({
							tabla: "USUARIO",
							campo: ["NOMBRE", "CARGO", "AREA", "ROL", "ID_OFICINA"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [frm.m3_2_sel_solicitud_usuario],
								comparador: ["IGUAL"],
								operador: []
							}
						});
						var index_th = th.insercion({
							campo: [
								"ID_NOVEDAD",
								"ID_PAC",
								"ID_USUARIO",
								"ID_USUARIO_REPORTE",
								"FECHA",
								"NOVEDAD",
								"FECHA_INICIO_NOVEDAD",
								"FECHA_FIN_NOVEDAD",
								"DETALLE",
								"VIGENCIA",
								"AUTORIZADO"
							],
							valor: [
								"",
								usuario_permiso.datos[0].id_oficina,
								frm.m3_2_sel_solicitud_usuario,
								u.id_usuario,
								fecha_actual,
								frm.m3_2_sel_solicitud_tipo_novedad,
								fecha_inicial,
								fecha_final,
								frm.m3_2_txt_solicitud_detalle,
								1,
								0
							],
							index: true
						});
					} else {
						var usuario_permiso = query({
							tabla: "USUARIO",
							campo: ["NOMBRE", "CARGO", "AREA", "ROL", "ID_OFICINA"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [u.id_usuario],
								comparador: ["IGUAL"],
								operador: []
							}
						});
						var index_th = th.insercion({
							campo: [
								"ID_NOVEDAD",
								"ID_PAC",
								"ID_USUARIO",
								"ID_USUARIO_REPORTE",
								"FECHA",
								"NOVEDAD",
								"FECHA_INICIO_NOVEDAD",
								"FECHA_FIN_NOVEDAD",
								"DETALLE",
								"VIGENCIA",
								"AUTORIZADO"
							],
							valor: [
								"",
								u.id_oficina,
								u.id_usuario,
								u.id_usuario,
								fecha_actual,
								frm.m3_2_sel_solicitud_tipo_novedad,
								fecha_inicial,
								fecha_final,
								frm.m3_2_txt_solicitud_detalle,
								1,
								0
							],
							index: true
						});
					}
					var plantilla_acta = DriveApp.getFileById('1TgfDnSgC6lZ4jumCQHfWW-vmqJPl5I-TnEj9VkOLIjg');
					var folder = DriveApp.getFolderById('1opqfS4OmVrL4CpPGD3hSpIbDuwDNhbzn');
					var nueva_plantilla = plantilla_acta.makeCopy("SOLICITUD DE PERMISO - " + index_th.id, folder);
					var libro = SpreadsheetApp.openById(nueva_plantilla.getId()).getSheetByName("Nuevo Formato vertical");

					//fecha de solicitud
					libro.getRange(5, 5).setValue(fecha_actual.getDate());
					libro.getRange(5, 6).setValue(fecha_actual.getMonth() + 1);
					libro.getRange(5, 7).setValue(fecha_actual.getFullYear());

					//fecha inicio permiso
					libro.getRange(5, 11).setValue(fecha_inicial.getDate());
					libro.getRange(5, 12).setValue(fecha_inicial.getMonth() + 1);
					libro.getRange(5, 13).setValue(fecha_inicial.getFullYear());

					//fecha fin permiso
					libro.getRange(5, 17).setValue(fecha_final.getDate());
					libro.getRange(5, 18).setValue(fecha_final.getMonth() + 1);
					libro.getRange(5, 19).setValue(fecha_final.getFullYear());

					//apellidos y nombres
					if (verificar_acceso("3_16")) {
						libro.getRange(8, 6).setValue(usuario_permiso.datos[0].nombre);

						//cargo
						libro.getRange(12, 3).setValue(usuario_permiso.datos[0].cargo);

					} else {
						libro.getRange(8, 6).setValue(u.nombre);

						//cargo
						libro.getRange(12, 3).setValue(u.cargo);
					}

					//Tipo vinculacion
					libro.getRange(14, 13).setValue("X");

					//Motivo del permiso
					switch (frm.m3_2_sel_solicitud_tipo_novedad) {
						case "Permiso por asuntos personales":
							libro.getRange(16, 10).setValue("X");
							break;
						case "Permiso por asistencia a servicios médicos":
							libro.getRange(17, 10).setValue("X");
							break;
						case "Permiso por calamidad doméstica":
							libro.getRange(18, 10).setValue("X");
							break;
						case "Permiso por cumpleaños":
							libro.getRange(19, 10).setValue("X");
							break;
						case "Permiso por matrimonio":
							libro.getRange(20, 10).setValue("X");
							break;
						case "Medio día por el uso de medios alternativos de transporte":
							libro.getRange(21, 10).setValue("X");
							break;
						case "Permiso por sufragio":
							libro.getRange(16, 17).setValue("X");
							break;
						case "Permisos por jurado de votación":
							libro.getRange(17, 17).setValue("X");
							break;
						case "Permiso por Talentos":
							libro.getRange(18, 17).setValue("X");
							break;
						case "Permiso por luto":
							libro.getRange(19, 17).setValue("X");
							break;
						case "Licencia por enfermedad grave de un pariente":
							libro.getRange(20, 17).setValue("X");
							break;
						case "Otros":
							libro.getRange(21, 17).setValue(frm.m3_2_txt_solicitud_detalle);
							break;
						default:
							break;
					}

					//tiempo solicitado
					if (dif_horas <= 24) {
						libro.getRange(23, 5).setValue(dif_horas);
						libro.getRange(23, 12).setValue('X');
					} else {
						libro.getRange(23, 5).setValue(dif_horas / 24);
						libro.getRange(23, 9).setValue('X');
					}

					var th_edicion = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["ID_NOVEDAD"],
							criterio: [index_th.id],
							comparador: ["IGUAL"],
							operador: []
						}
					});

					th_edicion.edicion({
						campo: ["ID_ARCHIVO"],
						valor: [nueva_plantilla.getId()]
					})

					r.id_archivo = nueva_plantilla.getId();

					//hora salida
					libro.getRange(23, 16).setValue(fecha_texto(fecha_inicial, "HORA"));

					//hora llegada
					libro.getRange(23, 20).setValue(fecha_texto(fecha_final, "HORA"));

					var param_mail = {
						sender: "APP",
						contenido: '',
						usuarios: [],
						asunto: "Solicitud de Permiso funcionario ",
						id_modulo: 3
					}
					param_mail.contenido += '<p>Datos de la solicitud: </p>';
					param_mail.contenido = '<p>';
					param_mail.contenido += '<ul>';
					param_mail.contenido += '<li><b>ID SOLICITUD:</b>' + index_th.id + '</li>';
					param_mail.contenido += '<li><b>NOMBRE FUNCIONARIO:</b>' + usuario_permiso.datos[0].nombre + '</li>';
					param_mail.contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_2_txt_solicitud_detalle + '</li>';
					param_mail.contenido += '<li><b>FECHA INICIO PERMISO:</b>' + fecha_inicial.getDate() + '/' + (fecha_inicial.getMonth() + 1) + '/' + fecha_inicial.getFullYear() + '/' + fecha_texto(fecha_inicial, "HORA") + '</li>';
					param_mail.contenido += '<li><b>FECHA FIN PERMISO:</b>' + fecha_final.getDate() + '/' + (fecha_final.getMonth() + 1) + '/' + fecha_final.getFullYear() + '/' + fecha_texto(fecha_final, "HORA") + '</li>';
					param_mail.contenido += '<li><b>SOPORTE:</b>"https://docs.google.com/spreadsheets/d/' + r.id_archivo + '/edit?usp=sharing"</li>';
					param_mail.contenido += '</ul>';
					param_mail.contenido += '<br/>';
					param_mail.contenido += '<hr/>';
					param_mail.contenido += '<b>IMPORTANTE:</b> Recuerde que esta solicitud de permiso aun está pendiente de la respectiva autorización de su jefe directo';
					param_mail.contenido += '<hr/>';
					param_mail.contenido += '</p>';

					if (verificar_acceso("3_16")) {
						var usuario_cargo = usuario_permiso.datos[0].cargo
						var usuario_id_oficina = usuario_permiso.datos[0].id_oficina
						var usuario_area = usuario_permiso.datos[0].area
						var usuario_id_usuario = frm.m3_2_sel_solicitud_usuario;
					} else {
						var usuario_cargo = u.cargo
						var usuario_id_oficina = u.id_oficina
						var usuario_area = u.area
						var usuario_id_usuario = u.id_usuario;
					}

					switch (usuario_cargo) {
						case "AGENTE DE SERVICIO COLPENSIONES":
						case "GESTOR DE SERVICIO COLPENSIONES":
							var base_usuario_correo = query({
								tabla: "USUARIO",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["CARGO", "CARGO", "ID_OFICINA", "ACTIVO"],
									criterio: ["JEFE PAC COLPENSIONES", "JEFE PAC EN MISIÓN", usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
									operador: ["O", "Y", "Y"]
								}
							});
							for (var k = 0; k < base_usuario_correo.registros; k++) {
								param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
							}
							var oficina_delegacion = query({
								tabla: "USUARIO_DELEGACION",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["ID_OFICINA_ALTERNA", "ACTIVO"],
									criterio: [usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL"],
									operador: ["Y"]
								}
							});
							if (oficina_delegacion.registros > 0) {
								param_mail.usuarios.push(oficina_delegacion.datos[0].id_usuario)
							}
							if (param_mail.usuarios.length > 0) {
								param_mail.usuarios.push(usuario_id_usuario);
							}
							break;
						case "PROFESIONAL":
						case "ANALISTA":
							var base_usuario_correo = query({
								tabla: "USUARIO",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
									criterio: ["TALENTO HUMANO", "DIRECTOR", usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
									operador: ["O", "Y", "Y"]
								}
							});
							for (var k = 0; k < base_usuario_correo.registros; k++) {
								param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
							}
							var base_usuario_correo = query({
								tabla: "USUARIO",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
									criterio: ["SERVICIO AL CIUDADANO", "ASISTENTE ADMINISTRATIVA", usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
									operador: ["Y", "Y", "Y"]
								}
							});
							for (var k = 0; k < base_usuario_correo.registros; k++) {
								param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
							}
							var base_usuario_correo = query({
								tabla: "USUARIO",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["AREA", "ROL", "ID_OFICINA", "ACTIVO"],
									criterio: [usuario_area, "REGIONAL / LÍDER DE ÁREA", usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
									operador: ["Y", "Y", "Y"]
								}
							});
							for (var k = 0; k < base_usuario_correo.registros; k++) {
								param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
							}
							if (param_mail.usuarios.length > 0) {
								param_mail.usuarios.push(usuario_id_usuario);
							}
							break;
						case "ASISTENTE ADMINISTRATIVA":
							var base_usuario_correo = query({
								tabla: "USUARIO",
								campo: ["ID_USUARIO"],
								condicion: {
									condicion: true,
									campo: ["AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
									criterio: ["TALENTO HUMANO", "DIRECTOR", usuario_id_oficina, 1],
									comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
									operador: ["O", "Y", "Y"]
								}
							});
							for (var k = 0; k < base_usuario_correo.registros; k++) {
								param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
							}
							if (param_mail.usuarios.length > 0) {
								param_mail.usuarios.push(usuario_id_usuario);
							}
							break;
						case "JEFE PAC COLPENSIONES":
							var base_oficinas = query({
								tabla: "OFICINA",
								campo: ["ID_OFICINA"],
								condicion: {
									condicion: true,
									campo: ["ID_REGIONAL"],
									criterio: [u.id_regional],
									comparador: ["IGUAL"],
									operador: []
								}
							});
							for (var h = 0; h < base_oficinas.registros; h++) {
								var base_usuario_correo = query({
									tabla: "USUARIO",
									campo: ["ID_USUARIO"],
									condicion: {
										condicion: true,
										campo: ["AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
										criterio: ["TALENTO HUMANO", "DIRECTOR", base_oficinas.datos[h].id_oficina, 1],
										comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
										operador: ["O", "Y", "Y"]
									}
								});
								for (var k = 0; k < base_usuario_correo.registros; k++) {
									param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
								}
								var base_usuario_correo = query({
									tabla: "USUARIO",
									campo: ["ID_USUARIO"],
									condicion: {
										condicion: true,
										campo: ["AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
										criterio: ["SERVICIO AL CIUDADANO", "ASISTENTE ADMINISTRATIVA", base_oficinas.datos[h].id_oficina, 1],
										comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
										operador: ["Y", "Y", "Y"]
									}
								});
								for (var k = 0; k < base_usuario_correo.registros; k++) {
									param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
								}
							}
							if (param_mail.usuarios.length > 0) {
								param_mail.usuarios.push(usuario_id_usuario);
							}
							break;
						default:
							break;
					}
					generador_de_correo(param_mail);

				} else {
					var mensaje_cruce = ""
					for (var j_cruce = 0; j_cruce < th.registros; j_cruce++) {
						mensaje_cruce += th.datos[j_cruce].id_novedad + ", "
					}
					r.exito = false;
					r.mensaje = "El periodo solicitado para su permiso se cruza con otra novedad registrada para esta misma periodo, (Id Novedad cruce: " + mensaje_cruce;
				}
			} else {
				r.exito = false;
				r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
			}
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_2_gs_solicitud", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 3 - AUTORIZACION PERMISOS 
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descripcion_funcion
 *
 * @param   {number}  id_oficina  id de la oficina en donde se llama la funcion
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m3_3_gs_cargar_solicitudes_permiso_default(u) {
	try {

		var param_tabla = {
			contenedor: "m0_div_panel_secundario"
		}

		var vector_permisos = [
			"Permiso por asistencia a servicios médicos",
			"Permiso por asuntos personales",
			"Permiso por calamidad doméstica",
			"Permiso por estudio",
			"Permiso por sufragio",
			"Permisos por jurado de votación",
			"Permiso por cumpleaños",
			"Licencia por enfermedad grave de un pariente",
			"Permiso por matrimonio",
			"Permiso por lactancia",
			"Permiso especial",
			"Permiso por Talentos",
			"Permiso por solicitud propia",
			"Permiso por luto",
			"Medio día por el uso de medios alternativos de transporte",
			"Otros"
		]

		if (verificar_acceso("3_19")) {
			param_tabla.titulos = ["ID_SOLICITUD", "USUARIO", "OFICINA", "FECHA SOLICITUD", "TIPO DE PERMISO", "INICIO PERMISO", "FIN PERMISO", "DETALLE PERMISO", "AUTORIZADO", "VIGENTE", "", ""];
			param_tabla.datos = [];

			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["VIGENCIA", "AUTORIZADO"],
					criterio: [1, 0],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				}
			});


			for (var j = 0; j < th.registros; j++) {
				if (vector_permisos.indexOf(th.datos[j].novedad) != -1) {
					var oficina = query({
						tabla: "OFICINA",
						campo: ["OFICINA", "ID_REGIONAL"],
						condicion: {
							condicion: true,
							campo: ["ID_OFICINA"],
							criterio: [th.datos[j].id_pac],
							comparador: ["IGUAL"],
							operador: []
						}
					});

					if (oficina.datos[0].id_regional == u.id_regional) {
						var usuario_permiso = query({
							tabla: "USUARIO",
							campo: ["NOMBRE", "CARGO"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [th.datos[j].id_usuario],
								comparador: ["IGUAL"],
								operador: []
							}
						});
						if (usuario_permiso.datos[0].cargo !== "AGENTE DE SERVICIO EN MISIÓN" && usuario_permiso.datos[0].cargo !== "GESTOR DE SERVICIO EN MISIÓN" && usuario_permiso.datos[0].cargo !== "JEFE PAC EN MISIÓN" && usuario_permiso.datos[0].cargo !== "APRENDIZ SENA" && usuario_permiso.datos[0].cargo !== "AGENTE DE ROTONDA" && usuario_permiso.datos[0].cargo !== "ESTUDIANTE UNIVERSITARIO EN PRACTICA" && usuario_permiso.datos[0].cargo !== "ORIENTADOR") {
							var fila = [];
							fila.push(th.datos[j].id_novedad);
							fila.push(usuario_permiso.datos[0].nombre);
							fila.push(oficina.datos[0].oficina);
							fila.push(fecha_texto(th.datos[j].fecha, "FECHA"));
							fila.push(th.datos[j].novedad);
							fila.push(fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
							fila.push(fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA_HORA"));
							fila.push(th.datos[j].detalle);

							if (th.datos[j].autorizado == 1) {
								fila.push("SI");
							} else {
								fila.push("NO");
							}
							if (th.datos[j].vigencia == 1) {
								fila.push("SI");
							} else {
								fila.push("NO");
							}

							if (th.datos[j].soporte !== "") {
								var upload = query({
									tabla: "INDEX_UPLOAD",
									campo: ["RUTA"],
									condicion: {
										condicion: true,
										campo: ["ID_UPLOAD"],
										criterio: [th.datos[j].soporte],
										comparador: ["IGUAL"],
										operador: []
									}
								});
								fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" >Permiso Autorizado</a>')
							} else {
								if (th.datos[j].id_archivo !== "") {
									contenido = '<a id="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '" href="https://docs.google.com/spreadsheets/d/' + th.datos[j].id_archivo + '/edit?usp=sharing" target="_blank" ><i class="material-icons">print</i></a>';
									contenido += '<div class="mdl-tooltip" for="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '">Por favor haga clic aquí si desea imprimir el soporte</div>';
									fila.push(contenido);
								} else {
									fila.push("");
								}
							}
							if (th.datos[j].autorizado == 0 && th.datos[j].vigencia == 1) {
								contenido = '<button id="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m3_3_autorizar_permiso("' + th.datos[j].id_novedad + '")><i class="material-icons">done_all</i></button>';
								contenido += '<div class="mdl-tooltip" for="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '">Por favor haga clic aquí si desea autorizar esta solicitud</div>';
								fila.push(contenido);
							} else {
								fila.push("");
							}
							param_tabla.datos.push(fila);
						}
					}
				}
			}

		} else {
			param_tabla.titulos = ["ID_SOLICITUD", "USUARIO", "FECHA SOLICITUD", "TIPO DE PERMISO", "INICIO PERMISO", "FIN PERMISO", "DETALLE PERMISO", "AUTORIZADO", "VIGENTE", "", ""];
			param_tabla.datos = [];

			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["VIGENCIA", "AUTORIZADO", "ID_PAC"],
					criterio: [1, 0, u.id_oficina],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				}
			});

			for (var j = 0; j < th.registros; j++) {

				if (vector_permisos.indexOf(th.datos[j].novedad) != -1) {
					var usuario_permiso = query({
						tabla: "USUARIO",
						campo: ["NOMBRE", "CARGO"],
						condicion: {
							condicion: true,
							campo: ["ID_USUARIO"],
							criterio: [th.datos[j].id_usuario],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					if (usuario_permiso.datos[0].cargo === "AGENTE DE SERVICIO COLPENSIONES" || usuario_permiso.datos[0].cargo === "GESTOR DE SERVICIO COLPENSIONES" ) {
						var fila = [];
						fila.push(th.datos[j].id_novedad);
						fila.push(usuario_permiso.datos[0].nombre);
						fila.push(fecha_texto(th.datos[j].fecha, "FECHA"));
						fila.push(th.datos[j].novedad);
						fila.push(fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
						fila.push(fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA_HORA"));
						fila.push(th.datos[j].detalle);

						if (th.datos[j].autorizado == 1) {
							fila.push("SI");
						} else {
							fila.push("NO");
						}
						if (th.datos[j].vigencia == 1) {
							fila.push("SI");
						} else {
							fila.push("NO");
						}

						if (th.datos[j].soporte !== "") {
							var upload = query({
								tabla: "INDEX_UPLOAD",
								campo: ["RUTA"],
								condicion: {
									condicion: true,
									campo: ["ID_UPLOAD"],
									criterio: [th.datos[j].soporte],
									comparador: ["IGUAL"],
									operador: []
								}
							});
							fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" >Permiso Autorizado</a>')
						} else {
							if (th.datos[j].id_archivo !== "") {
								contenido = '<a id="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '" C" target="_blank" ><i class="material-icons">print</i></a>';
								contenido += '<div class="mdl-tooltip" for="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '">Por favor haga clic aquí si desea imprimir el soporte</div>';
								fila.push(contenido);
							} else {
								fila.push("");
							}
						}
						if (th.datos[j].autorizado == 0 && th.datos[j].vigencia == 1) {
							contenido = '<button id="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m3_3_autorizar_permiso("' + th.datos[j].id_novedad + '")><i class="material-icons">done_all</i></button>';
							contenido += '<div class="mdl-tooltip" for="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '">Por favor haga clic aquí si desea autorizar esta solicitud</div>';
							fila.push(contenido);
						} else {
							fila.push("");
						}
						param_tabla.datos.push(fila);
					}
				}
			}
		}


		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: u
		};
		var id_error = log_error("m3_3_gs_cargar_solicitudes_permiso_default", param, e);
		param_tabla.exito = false;
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* muestra informacion de solicitudes de permiso sin autorizar en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m3_3_gs_cargar_solicitudes_permiso(frm) {
	try {

		var param_tabla = {
			contenedor: "m0_div_panel_secundario"
		}

		var fecha_inicio = frm.m3_3_txt_autorizacion_permiso_fecha_inicial.split("-");
		var fecha_fin = frm.m3_3_txt_autorizacion_permiso_fecha_final.split("-");
		var f_inicio = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
		var f_fin = new Date(fecha_fin[0], fecha_fin[1] - 1, fecha_fin[2]);
		var u = usuario();
		var vector_permisos = [
			"Permiso por asistencia a servicios médicos",
			"Permiso por asuntos personales",
			"Permiso por calamidad doméstica",
			"Permiso por estudio",
			"Permiso por sufragio",
			"Permisos por jurado de votación",
			"Permiso por cumpleaños",
			"Licencia por enfermedad grave de un pariente",
			"Permiso por matrimonio",
			"Permiso por lactancia",
			"Permiso especial",
			"Permiso por Talentos",
			"Permiso por solicitud propia",
			"Permiso por luto",
			"Medio día por el uso de medios alternativos de transporte",
			"Otros"
		]

		if (verificar_acceso("3_19")) {
			param_tabla.titulos = ["ID_SOLICITUD", "USUARIO", "OFICINA", "FECHA SOLICITUD", "TIPO DE PERMISO", "INICIO PERMISO", "FIN PERMISO", "DETALLE PERMISO", "AUTORIZADO", "VIGENTE", "", ""];
			param_tabla.datos = [];

			switch (frm.m3_3_sel_autorizacion_permiso_opcion) {
				case "ALL":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD"],
							criterio: [f_inicio, f_fin],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL"],
							operador: ["Y"]
						}
					});
					break;
				case "AUTORIZADAS":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "VIGENCIA", "AUTORIZADO"],
							criterio: [f_inicio, f_fin, 1, 1],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y", "Y"]
						}
					});
					break;
				case "NO_AUTORIZADAS":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "VIGENCIA", "AUTORIZADO"],
							criterio: [f_inicio, f_fin, 1, 0],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y", "Y"]
						}
					});
					break;
			}
			for (var j = 0; j < th.registros; j++) {
				if (vector_permisos.indexOf(th.datos[j].novedad) != -1) {
					var oficina = query({
						tabla: "OFICINA",
						campo: ["OFICINA", "ID_REGIONAL"],
						condicion: {
							condicion: true,
							campo: ["ID_OFICINA"],
							criterio: [th.datos[j].id_pac],
							comparador: ["IGUAL"],
							operador: []
						}
					});

					if (oficina.datos[0].id_regional == u.id_regional) {
						var usuario_permiso = query({
							tabla: "USUARIO",
							campo: ["NOMBRE", "CARGO"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [th.datos[j].id_usuario],
								comparador: ["IGUAL"],
								operador: []
							}
						});
						if (usuario_permiso.datos[0].cargo !== "AGENTE DE SERVICIO EN MISIÓN" && usuario_permiso.datos[0].cargo !== "GESTOR DE SERVICIO EN MISIÓN" && usuario_permiso.datos[0].cargo !== "JEFE PAC EN MISIÓN" && usuario_permiso.datos[0].cargo !== "APRENDIZ SENA" && usuario_permiso.datos[0].cargo !== "AGENTE DE ROTONDA" && usuario_permiso.datos[0].cargo !== "ESTUDIANTE UNIVERSITARIO EN PRACTICA" && usuario_permiso.datos[0].cargo !== "ORIENTADOR") {
							var fila = [];
							fila.push(th.datos[j].id_novedad);
							fila.push(usuario_permiso.datos[0].nombre);
							fila.push(oficina.datos[0].oficina);
							fila.push(fecha_texto(th.datos[j].fecha, "FECHA"));
							fila.push(th.datos[j].novedad);
							fila.push(fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
							fila.push(fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA_HORA"));
							fila.push(th.datos[j].detalle);

							if (th.datos[j].autorizado == 1) {
								fila.push("SI");
							} else {
								fila.push("NO");
							}
							if (th.datos[j].vigencia == 1) {
								fila.push("SI");
							} else {
								fila.push("NO");
							}

							if (th.datos[j].soporte !== "") {
								var upload = query({
									tabla: "INDEX_UPLOAD",
									campo: ["RUTA"],
									condicion: {
										condicion: true,
										campo: ["ID_UPLOAD"],
										criterio: [th.datos[j].soporte],
										comparador: ["IGUAL"],
										operador: []
									}
								});
								fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" >Permiso Autorizado</a>')
							} else {
								if (th.datos[j].id_archivo !== "") {
									contenido = '<a id="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '" href="https://docs.google.com/spreadsheets/d/' + th.datos[j].id_archivo + '/edit?usp=sharing" target="_blank" ><i class="material-icons">print</i></a>';
									contenido += '<div class="mdl-tooltip" for="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '">Por favor haga clic aquí si desea imprimir el soporte</div>';
									fila.push(contenido);
								} else {
									fila.push("");
								}
							}
							if (th.datos[j].autorizado == 0 && th.datos[j].vigencia == 1) {
								contenido = '<button id="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m3_3_autorizar_permiso("' + th.datos[j].id_novedad + '")><i class="material-icons">done_all</i></button>';
								contenido += '<div class="mdl-tooltip" for="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '">Por favor haga clic aquí si desea autorizar esta solicitud</div>';
								fila.push(contenido);
							} else {
								fila.push("");
							}
							param_tabla.datos.push(fila);
						}
					}
				}
			}
		} else {

			param_tabla.titulos = ["ID_SOLICITUD", "USUARIO", "FECHA SOLICITUD", "TIPO DE PERMISO", "INICIO PERMISO", "FIN PERMISO", "DETALLE PERMISO", "AUTORIZADO", "VIGENTE", "", ""];
			param_tabla.datos = [];

			switch (frm.m3_3_sel_autorizacion_permiso_opcion) {
				case "ALL":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "ID_PAC"],
							criterio: [f_inicio, f_fin, frm.m3_3_hid_autorizacion_permiso_oficina],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL"],
							operador: ["Y", "Y"]
						}
					});
					break;
				case "AUTORIZADAS":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "VIGENCIA", "AUTORIZADO", "ID_PAC"],
							criterio: [f_inicio, f_fin, 1, 1, frm.m3_3_hid_autorizacion_permiso_oficina],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y", "Y", "Y"]
						}
					});
					break;
				case "NO_AUTORIZADAS":
					var th = query({
						tabla: "NOVEDADES_TH",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD", "VIGENCIA", "AUTORIZADO", "ID_PAC"],
							criterio: [f_inicio, f_fin, 1, 0, frm.m3_3_hid_autorizacion_permiso_oficina],
							comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y", "Y", "Y"]
						}
					});
					break;
			}

			for (var j = 0; j < th.registros; j++) {

				if (vector_permisos.indexOf(th.datos[j].novedad) != -1) {
					var usuario_permiso = query({
						tabla: "USUARIO",
						campo: ["NOMBRE", "CARGO"],
						condicion: {
							condicion: true,
							campo: ["ID_USUARIO"],
							criterio: [th.datos[j].id_usuario],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					if (usuario_permiso.datos[0].cargo === "AGENTE DE SERVICIO COLPENSIONES") {
						var fila = [];
						fila.push(th.datos[j].id_novedad);
						fila.push(usuario_permiso.datos[0].nombre);
						fila.push(fecha_texto(th.datos[j].fecha, "FECHA"));
						fila.push(th.datos[j].novedad);
						fila.push(fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
						fila.push(fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA_HORA"));
						fila.push(th.datos[j].detalle);

						if (th.datos[j].autorizado == 1) {
							fila.push("SI");
						} else {
							fila.push("NO");
						}
						if (th.datos[j].vigencia == 1) {
							fila.push("SI");
						} else {
							fila.push("NO");
						}

						if (th.datos[j].soporte !== "") {
							var upload = query({
								tabla: "INDEX_UPLOAD",
								campo: ["RUTA"],
								condicion: {
									condicion: true,
									campo: ["ID_UPLOAD"],
									criterio: [th.datos[j].soporte],
									comparador: ["IGUAL"],
									operador: []
								}
							});
							fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" >Permiso Autorizado</a>')
						} else {
							if (th.datos[j].id_archivo !== "") {
								contenido = '<a id="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '" C" target="_blank" ><i class="material-icons">print</i></a>';
								contenido += '<div class="mdl-tooltip" for="m3_3_a_autorizacion_solicitud_' + th.datos[j].id_archivo + '">Por favor haga clic aquí si desea imprimir el soporte</div>';
								fila.push(contenido);
							} else {
								fila.push("");
							}
						}
						if (th.datos[j].autorizado == 0 && th.datos[j].vigencia == 1) {
							contenido = '<button id="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m3_3_autorizar_permiso("' + th.datos[j].id_novedad + '")><i class="material-icons">done_all</i></button>';
							contenido += '<div class="mdl-tooltip" for="m3_3_btn_autorizacion_solicitud_' + th.datos[j].id_novedad + '">Por favor haga clic aquí si desea autorizar esta solicitud</div>';
							fila.push(contenido);
						} else {
							fila.push("");
						}
						param_tabla.datos.push(fila);
					}
				}


			}

		}

		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_3_gs_cargar_solicitudes_permiso", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* autorizamos la solicitud de permiso, ya le aparecera a la oficina regional
*
* @param   {number}  id_novedad  id de la novedad
*
* @return  {object}       				objecto con los resultados de la operacion
*/
function m3_3_gs_guardar_autorizacion_permiso(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Solicitud de permiso modificada exitosamente"
		}

		var u = usuario()
		var th = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_NOVEDAD", "ID_EVENTO_CALENDARIO", "ID_PAC", "ID_USUARIO", "NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "DETALLE", "ID_ARCHIVO", "SOPORTE"],
			condicion: {
				condicion: true,
				campo: ["ID_NOVEDAD"],
				criterio: [frm.m3_3_hid_autorizacion_permiso_id_novedad],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m3_controlador",
				funcion: "m3_3_gs_guardar_autorizacion_permiso",
				variable: "th"
			}
		});

		if (frm.m3_3_sel_autorizacion_permiso_confirmacion === "SI") {
			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [frm.m3_3_hid_autorizacion_permiso_id_regional, "Permisos e incapacidades", 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
				depuracion: {
					archivo: "m3_controlador",
					funcion: "m3_3_gs_guardar_autorizacion_permiso",
					variable: "calendario"
				}
			});
			var usuario_permiso = query({
				tabla: "USUARIO",
				campo: ["USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [th.datos[0].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m3_controlador",
					funcion: "m3_3_gs_guardar_autorizacion_permiso",
					variable: "usuario_permiso"
				}
			});
			var oficina_permiso = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [th.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m3_controlador",
					funcion: "m3_3_gs_guardar_autorizacion_permiso",
					variable: "oficina_permiso"
				}
			});

			var f_inicio = new Date(th.datos[0].fecha_inicio_novedad);
			var f_fin = new Date(th.datos[0].fecha_fin_novedad);
			if (f_inicio.getDate() !== f_fin.getDate()) {
				f_fin.setDate(f_fin.getDate() + 1);
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent(
					th.datos[0].id_usuario + " / " + usuario_permiso.datos[0].usuario,
					f_inicio,
					f_fin
				);
			} else {
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createEvent(
					th.datos[0].id_usuario + " / " + usuario_permiso.datos[0].usuario,
					th.datos[0].fecha_inicio_novedad,
					th.datos[0].fecha_fin_novedad
				);
			}
			var param_mail = {
				contenido: '',
				usuarios: [],
				asunto: "Autorización Solicitud de Permiso funcionario ",
				id_modulo: 3
			}
			param_mail.contenido += '<p>Datos de la solicitud: </p>';

			var contenido = '<p>';
			contenido += '<ul>';
			contenido += '<li><b>OFICINA:</b>' + oficina_permiso.datos[0].oficina + '</li>';
			contenido += '<li><b>NOMBRE FUNCIONARIO:</b>' + usuario_permiso.datos[0].nombre + '</li>';
			contenido += '<li><b>DESCRIPCIÓN:</b>' + th.datos[0].detalle + '</li>';

			param_mail.contenido += contenido;

			contenido += '</ul>';
			if (th.datos[0].id_archivo !== "") {
				contenido += '<hr/>';
				contenido += '<a href="https://docs.google.com/spreadsheets/d/' + th.datos[0].id_archivo + '/edit?usp=sharing" target="_blank" >Imprimir formato</a>';
			}
			contenido += '</p>';

			evento.setDescription(contenido);

			var u = usuario();
			var id_upload = "";
			if (frm.FILE_TEXT_ID !== "") {
				var ruta_folder = query({
					tabla: "MODULO_UPLOAD",
					campo: ["RUTA_FOLDER"],
					condicion: {
						condicion: true,
						campo: ["ID_MODULO"],
						criterio: [3],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
				var soporte = folder.createFile(frm.m3_3_file_autorizacion_permiso);
				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: [],
					condicion: {
						condicion: 0,
					}
				});
				var res = upload.insercion({
					campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
					valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 3, soporte.getUrl()],
					index: true
				})
				var id_upload = res.id
				param_mail.contenido += '<li><b>SOPORTE:</b>' + soporte.getUrl() + '</li>';
			} else {
				param_mail.contenido += '<li><b>SOPORTE:</b>"https://docs.google.com/spreadsheets/d/' + th.datos[0].id_archivo + '/edit?usp=sharing"</li>';
			}

			if (frm.m3_3_txt_autorizacion_permiso_observacion !== "") {
				var observacion = th.datos[0].detalle + "<br/>----<br/><b>(" + fecha_texto(0, "FECHA") + ") Actualizacion permiso:</b> " + frm.m3_3_txt_autorizacion_permiso_observacion;
				th.edicion({
					campo: ["ID_EVENTO_CALENDARIO", "AUTORIZADO", "VIGENCIA", "SOPORTE", "DETALLE"],
					valor: [evento.getId(), 1, 1, id_upload, observacion]
				});
			} else {
				th.edicion({
					campo: ["ID_EVENTO_CALENDARIO", "AUTORIZADO", "VIGENCIA", "SOPORTE"],
					valor: [evento.getId(), 1, 1, id_upload]
				});
			}

			param_mail.contenido += '</ul>';
			param_mail.contenido += '</p>';

			var base_usuario_correo = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["AREA", "ACTIVO"],
					criterio: ["TALENTO HUMANO", 1],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});

			for (var k = 0; k < base_usuario_correo.registros; k++) {
				var base_usuario_correo_oficina = query({
					tabla: "OFICINA",
					campo: ["ID_REGIONAL"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [base_usuario_correo.datos[k].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				if (base_usuario_correo_oficina.datos[0].id_regional == u.id_regional) {
					param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
				}
			}
			if (param_mail.usuarios.length > 0) {
				param_mail.usuarios.push(u.id_usuario);
				param_mail.usuarios.push(th.datos[0].id_usuario);
				param_mail.usuarios.push(802);
				param_mail.usuarios.push("N1664394518941");
			}
			param_mail.sender = "USUARIO";

			resp = generador_de_correo(param_mail);
			r.url = resp.url

		} else {
			var observacion = th.datos[0].detalle + "<br/>----<br/><b>(" + fecha_texto(0, "FECHA") + ") Motivo No Autorizaciòn:</b> " + frm.m3_3_txt_autorizacion_permiso_observacion;
			th.edicion({
				campo: ["AUTORIZADO", "VIGENCIA", "DETALLE"],
				valor: [0, 0, observacion]
			});
		}


		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_3_gs_guardar_autorizacion_permiso", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 5 - REGISTRO INCAPACIDAD
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion del personal de planta  adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_5_gs_poblar_menu_registro_incapacidad(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "ID_OFICINA", "ACTIVO"],
					criterio: ["AGENTE DE SERVICIO EN MISIÓN", "GESTOR DE SERVICIO EN MISIÓN", "JEFE PAC EN MISIÓN", "AGENTE DE ROTONDA", "ESTUDIANTE UNIVERSITARIO EN PRACTICA", "ORIENTADOR", oficinas.datos[j].id_oficina, 1],
					comparador: ["DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "IGUAL", "IGUAL"],
					operador: ["Y", "Y", "Y", "Y", "Y", "Y", "Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_5_gs_poblar_menu_registro_incapacidad", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
* Se recibe la informacion para el registro de la novedad de REGISTRO DE INCAPACIDAD
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_5_gs_registro_incapacidad(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}
		var u = usuario();

		var f_inicio = frm.m3_5_txt_registro_incapacidad_fecha_inicio.split("-");
		var f_fin = frm.m3_5_txt_registro_incapacidad_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final >= fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: false
				}
			});
			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [u.id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				}
			});
			var usuario_incapacidad = query({
				tabla: "USUARIO",
				campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [frm.m3_5_sel_registro_incapacidad_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA", "OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [usuario_incapacidad.datos[0].id_oficina],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent("Incapacidad / " + usuario_incapacidad.datos[0].usuario, fecha_inicial, fecha_final_2);

			if (frm.FILE_TEXT_ID == "") {
				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_5_sel_registro_incapacidad_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Incapacidad",
						frm.m3_5_txt_registro_incapacidad_fecha_inicio,
						frm.m3_5_txt_registro_incapacidad_fecha_fin,
						frm.m3_5_txt_registro_incapacidad_detalle,
						1,
						1
					],
					index: true
				});
			} else {
				var ruta_folder = query({
					tabla: "MODULO_UPLOAD",
					campo: ["RUTA_FOLDER"],
					condicion: {
						condicion: true,
						campo: ["ID_MODULO"],
						criterio: [3],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
				var soporte = folder.createFile(frm.m3_5_file_registro_incapacidad_soporte);
				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: [],
					condicion: {
						condicion: 0,
					}
				});
				var res = upload.insercion({
					campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
					valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 3, soporte.getUrl()],
					index: true
				})
				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO",
						"SOPORTE"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_5_sel_registro_incapacidad_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Incapacidad",
						frm.m3_5_txt_registro_incapacidad_fecha_inicio,
						frm.m3_5_txt_registro_incapacidad_fecha_fin,
						frm.m3_5_txt_registro_incapacidad_detalle,
						1,
						1,
						res.id
					],
					index: true
				});
			}
			var contenido = '<p>';
			contenido += '<ul>';
			contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
			contenido += '<li><b>NOMBRE:</b>' + usuario_incapacidad.datos[0].nombre + '</li>';
			contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_5_txt_registro_incapacidad_detalle + '</li>';
			contenido += '</ul>';
			contenido += '</p>';
			evento.setDescription(contenido);

			var usuario_mail = query({
				tabla: "USUARIO",
				campo: ["CORREO", "ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["AREA", "AREA", "CARGO","ACTIVO"],
					criterio: ["TALENTO HUMANO", "SERVICIO AL CIUDADANO", "PROFESIONAL",1],
					comparador: ["IGUAL", "IGUAL", "IGUAL","IGUAL"],
					operador: ["O", "Y","Y"]
				}
			});
			var oficinas_mail = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL"],
					criterio: [u.id_regional],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var correos = '';
			for (var j = 0; j < usuario_mail.registros; j++) {
				for (var i = 0; i < oficinas_mail.registros; i++) {
					if (oficinas_mail.datos[i].id_oficina === usuario_mail.datos[j].id_oficina) {
						correos += usuario_mail.datos[j].correo + ', ';
					}
				}
			}
			if (correos !== '') {
				var cuerpo_correo;
				cuerpo_correo = "<p>Cordial Saludo,</p>";
				cuerpo_correo = cuerpo_correo + "<p>El dia &nbsp;de hoy en la <strong>" + oficina.datos[0].oficina + "</strong>, se reporto una novedad de INCAPACIDAD:</p>";
				cuerpo_correo = cuerpo_correo + "<ul>";
				cuerpo_correo = cuerpo_correo + "<li><strong>FUNCIONARIO: </strong>" + usuario_incapacidad.datos[0].nombre + "</li>";
				cuerpo_correo = cuerpo_correo + "<li><strong>DESCRIPCION NOVEDAD: </strong>" + frm.m3_5_txt_registro_incapacidad_detalle + "</li>";
				cuerpo_correo = cuerpo_correo + "<li><strong>USUARIO QUE REPORTA: </strong>" + u.usuario + "</li>";
				if (frm.FILE_TEXT_ID == "") {
					cuerpo_correo = cuerpo_correo + "<li><b>SOPORTE:</b> No se adjunto soporte de la incapacidad</li>";
				} else {
					cuerpo_correo = cuerpo_correo + "<li><b>SOPORTE:</b>" + soporte.getUrl() + "</li>";
				}
				cuerpo_correo = cuerpo_correo + "</ul>";
				cuerpo_correo = cuerpo_correo + "<p>Muchas gracias por su colaboraci&oacute;n.</p>";
				cuerpo_correo = cuerpo_correo + '<pre><q>Este es un correo generado automaticamente a traves del <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';
				MailApp.sendEmail({
					to: correos,
					subject: "Aviso novedad INCAPACIDAD en " + oficina.datos[0].oficina,
					htmlBody: cuerpo_correo,
					noReply: true
				});
			}

		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_5_gs_registro_incapacidad", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 6 - LICENCIA
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

/**
* envia informacion del personal de planta  adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_6_gs_poblar_menu_licencia(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "ID_OFICINA", "ACTIVO"],
					criterio: ["AGENTE DE SERVICIO EN MISIÓN", "GESTOR DE SERVICIO EN MISIÓN", "JEFE PAC EN MISIÓN", "APRENDIZ SENA", "AGENTE DE ROTONDA", "ESTUDIANTE UNIVERSITARIO EN PRACTICA", "ORIENTADOR", oficinas.datos[j].id_oficina, 1],
					comparador: ["DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "IGUAL", "IGUAL"],
					operador: ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_6_gs_poblar_menu_licencia", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
* Se recibe la informacion para el registro de la novedad de LICENCIA NO REMUNERAD
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_6_gs_licencia(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}
		var u = usuario();

		var f_inicio = frm.m3_6_txt_licencia_fecha_inicio.split("-");
		var f_fin = frm.m3_6_txt_licencia_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final > fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "AUTORIZADO", "ID_USUARIO"],
					criterio: [fecha_inicial, fecha_inicial, fecha_final, fecha_final, 1, frm.m3_6_sel_licencia_usuario],
					comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "O", "Y", "Y", "Y"]
				}
			});
			if (th.registros <= 0) {
				var calendario = query({
					tabla: "CALENDARIO",
					campo: ["ID_CALENDARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
						criterio: [u.id_regional, "Vacaciones y licencias", 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});
				var usuario_licencia = query({
					tabla: "USUARIO",
					campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [frm.m3_6_sel_licencia_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [usuario_licencia.datos[0].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent(
					"Licencia / " + usuario_licencia.datos[0].usuario,
					fecha_inicial,
					fecha_final_2
				);

				var param_mail = {
					sender: "APP",
					contenido: '',
					usuarios: [],
					asunto: "Aviso de registro de Licencia ",
					id_modulo: 3
				}
				param_mail.contenido += '<p>Datos de la Licencia : </p>';

				if (frm.FILE_TEXT_ID == "") {
					var index_th = th.insercion({
						campo: [
							"ID_NOVEDAD",
							"ID_EVENTO_CALENDARIO",
							"ID_PAC",
							"ID_USUARIO",
							"ID_USUARIO_REPORTE",
							"FECHA",
							"NOVEDAD",
							"FECHA_INICIO_NOVEDAD",
							"FECHA_FIN_NOVEDAD",
							"DETALLE",
							"VIGENCIA",
							"AUTORIZADO"
						],
						valor: [
							"",
							evento.getId(),
							oficina.datos[0].id_oficina,
							frm.m3_6_sel_licencia_usuario,
							u.id_usuario,
							fecha_texto(0, "FECHA"),
							frm.m3_6_txt_licencia_tipo_licencia,
							frm.m3_6_txt_licencia_fecha_inicio,
							frm.m3_6_txt_licencia_fecha_fin,
							frm.m3_6_txt_licencia_detalle,
							1,
							1
						],
						index: true
					});

					var contenido = '<p>';
					contenido += '<ul>';
					contenido += '<li><b>TIPO DE SOLICITUD:</b>' + frm.m3_6_txt_licencia_tipo_licencia + '</li>';
					contenido += '<li><b>FECHA INICIAL: </b>' + frm.m3_6_txt_licencia_fecha_inicio + '</li>';
					contenido += '<li><b>FECHA FINAL: </b>' + frm.m3_6_txt_licencia_fecha_fin + '</li>';
					contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
					contenido += '<li><b>NOMBRE:</b>' + usuario_licencia.datos[0].nombre + '</li>';
					contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_6_txt_licencia_detalle + '</li>';

					param_mail.contenido += contenido;

					contenido += '</ul>';
					contenido += '</p>';
					evento.setDescription(contenido);

				} else {
					var ruta_folder = query({
						tabla: "MODULO_UPLOAD",
						campo: ["RUTA_FOLDER"],
						condicion: {
							condicion: true,
							campo: ["ID_MODULO"],
							criterio: [3],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
					var soporte = folder.createFile(frm.m3_6_file_licencia_soporte);
					var upload = query({
						tabla: "INDEX_UPLOAD",
						campo: [],
						condicion: {
							condicion: 0,
						}
					});
					var res = upload.insercion({
						campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
						valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 3, soporte.getUrl()],
						index: true
					})
					var index_th = th.insercion({
						campo: [
							"ID_NOVEDAD",
							"ID_EVENTO_CALENDARIO",
							"ID_PAC",
							"ID_USUARIO",
							"ID_USUARIO_REPORTE",
							"FECHA",
							"NOVEDAD",
							"FECHA_INICIO_NOVEDAD",
							"FECHA_FIN_NOVEDAD",
							"DETALLE",
							"VIGENCIA",
							"AUTORIZADO",
							"SOPORTE"
						],
						valor: [
							"",
							evento.getId(),
							oficina.datos[0].id_oficina,
							frm.m3_6_sel_licencia_usuario,
							u.id_usuario,
							fecha_texto(0, "FECHA"),
							frm.m3_6_txt_licencia_tipo_licencia,
							frm.m3_5_txt_registro_incapacidad_fecha_inicio,
							frm.m3_5_txt_registro_incapacidad_fecha_fin,
							frm.m3_5_txt_registro_incapacidad_detalle,
							1,
							1,
							res.id
						],
						index: true
					});
					var contenido = '<p>';
					contenido += '<ul>';
					contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
					contenido += '<li><b>NOMBRE:</b>' + usuario_licencia.datos[0].nombre + '</li>';
					contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_6_txt_licencia_detalle + '</li>';

					param_mail.contenido += contenido;
					param_mail.contenido += '<li><b>SOPORTE:</b>' + soporte.getUrl() + '</li>';

					contenido += '</ul>';
					contenido += '</p>';
					evento.setDescription(contenido);
				}

				param_mail.contenido += '</ul>';
				param_mail.contenido += '</p>';

				var base_usuario_correo = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO", "ID_OFICINA"],
					condicion: {
						condicion: true,
						campo: ["AREA"],
						criterio: ["TALENTO HUMANO"],
						comparador: ["IGUAL"],
						operador: []
					}
				});

				for (var k = 0; k < base_usuario_correo.registros; k++) {
					var base_usuario_correo_oficina = query({
						tabla: "OFICINA",
						campo: ["ID_REGIONAL"],
						condicion: {
							condicion: true,
							campo: ["ID_OFICINA"],
							criterio: [base_usuario_correo.datos[k].id_oficina],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					if (base_usuario_correo_oficina.datos[0].id_regional == u.id_regional) {
						param_mail.usuarios.push(base_usuario_correo.datos[k].id_usuario)
					}
				}
				if (param_mail.usuarios.length > 0) {
					param_mail.usuarios.push(u.id_usuario);
				}

				generador_de_correo(param_mail);

			} else {
				r.exito = false;
				r.mensaje = "El usuario tiene novedades registradas en el intervalo de tiempo que se le esta registrando la licencia. Por favor revisar";
			}
		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_6_gs_licencia", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}






//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 7 - PROGRAMACION VACACIONES
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion del personal de planta  adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_7_gs_poblar_menu_programacion_vacaciones(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "ID_OFICINA", "ACTIVO"],
					criterio: ["AGENTE DE SERVICIO EN MISIÓN", "GESTOR DE SERVICIO EN MISIÓN", "JEFE PAC EN MISIÓN", "APRENDIZ SENA", "AGENTE DE ROTONDA", "ESTUDIANTE UNIVERSITARIO EN PRACTICA", "ORIENTADOR", oficinas.datos[j].id_oficina, 1],
					comparador: ["DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "IGUAL", "IGUAL"],
					operador: ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_7_gs_poblar_menu_programacion_vacaciones", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* Se recibe la informacion para el registro de la novedad de PROGRAMACION AGENTE EN MISION o TRASLADO AGENTE DE PLANTA
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_7_gs_programacion_vacaciones(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}
		var u = usuario();

		var f_inicio = frm.m3_7_txt_programacion_vacaciones_fecha_inicio.split("-");
		var f_fin = frm.m3_7_txt_programacion_vacaciones_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final > fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "AUTORIZADO", "ID_USUARIO"],
					criterio: [fecha_inicial, fecha_inicial, fecha_final, fecha_final, 1, frm.m3_7_sel_programacion_vacaciones_usuario],
					comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "O", "Y", "Y", "Y"]
				}
			});
			if (th.registros <= 0) {
				var calendario = query({
					tabla: "CALENDARIO",
					campo: ["ID_CALENDARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
						criterio: [u.id_regional, "Vacaciones y licencias", 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});
				var usuario_vacaciones = query({
					tabla: "USUARIO",
					campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [frm.m3_7_sel_programacion_vacaciones_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [usuario_vacaciones.datos[0].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent(
					"Vacaciones / " + usuario_vacaciones.datos[0].usuario,
					fecha_inicial,
					fecha_final_2
				);

				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_7_sel_programacion_vacaciones_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Vacación",
						frm.m3_7_txt_programacion_vacaciones_fecha_inicio,
						frm.m3_7_txt_programacion_vacaciones_fecha_fin,
						frm.m3_7_txt_programacion_vacaciones_detalle,
						1,
						1
					],
					index: true
				});
				var contenido = '<p>';
				contenido += '<ul>';
				contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
				contenido += '<li><b>NOMBRE:</b>' + usuario_vacaciones.datos[0].nombre + '</li>';
				contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_7_txt_programacion_vacaciones_detalle + '</li>';
				contenido += '</ul>';
				contenido += '</p>';
				evento.setDescription(contenido);
			} else {
				r.exito = false;
				r.mensaje = "El usuario tiene novedades registradas en el intervalo de tiempo que se le esta programando sus vacaciones. Por favor revisar";
			}
		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_7_gs_programacion_vacaciones", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 10 - CALENDARIO NOVEDADES PLANTA PERSONAL
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* Se busca el calendario que corresponde a la regional y se monta en div_secundario
*
* @return  {object}   objecto con los resultados de la consulta
*/
function m3_10_gs_cargar_calendario(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Calendario cargado exitosamente",
			contenido: ""
		}

		var sw_acceso = true;
		if (verificar_acceso("3_15") && verificar_acceso("3_14") && (verificar_acceso("3_13")) && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Vacaciones y licencias', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_vacaciones_licencias_3_13 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Agentes en misión', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_agentes_mision_3_14 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_permisos_incapacidades_3_15 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_vacaciones_licencias_3_13 + '%40group.calendar.google.com&amp;src=' + id_agentes_mision_3_14 + '%40group.calendar.google.com&amp;src=' + id_permisos_incapacidades_3_15 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}
		}

		if (verificar_acceso("3_15") && (verificar_acceso("3_14")) && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Agentes en misión', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_agentes_mision_3_14 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_permisos_incapacidades_3_15 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_agentes_mision_3_14 + '%40group.calendar.google.com&amp;src=' + id_permisos_incapacidades_3_15 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (verificar_acceso("3_15") && (verificar_acceso("3_13")) && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_permisos_incapacidades_3_15 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Vacaciones y licencias', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_vacaciones_licencias_3_13 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_vacaciones_licencias_3_13 + '%40group.calendar.google.com&amp;src=' + id_permisos_incapacidades_3_15 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (verificar_acceso("3_14") && (verificar_acceso("3_13")) && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Vacaciones y licencias', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_vacaciones_licencias_3_13 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Agentes en misión', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_agentes_mision_3_14 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_vacaciones_licencias_3_13 + '%40group.calendar.google.com&amp;src=' + id_agentes_mision_3_14 + '%40group.calendar.google.com&amp;&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (verificar_acceso("3_13") && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Vacaciones y licencias', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_vacaciones_licencias_3_13 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_vacaciones_licencias_3_13 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (verificar_acceso("3_14") && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Agentes en misión', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_agentes_mision_3_14 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_agentes_mision_3_14 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (verificar_acceso("3_15") && (sw_acceso)) {
			sw_acceso = false;

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
			});
			if (calendario.registros > 0) {
				var id_permisos_incapacidades_3_15 = calendario.datos[0].id_calendario;
			} else {
				r.exito = false;
				r.mensaje = "No se cuenta con un calendario asociado a esta regional"
			}

			if (r.exito) {
				r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + id_permisos_incapacidades_3_15 + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20NOVEDADES%20TH&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			}

		}

		if (sw_acceso) {
			r.exito = false;
			r.mensaje = "No se le ha brindado acceso a ninguno de los calendarios del modulo de Novedades de TH";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m3_10_gs_cargar_calendario", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r;

	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 11 - PROGRAMACIÓN DE AGENTES EN MISIÓN
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de los agentes en mision adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_11_gs_poblar_menu_agentes_mision(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA", "CARGO"],
					criterio: [oficinas.datos[j].id_oficina, "AGENTE DE SERVICIO EN MISIÓN"],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_11_gs_poblar_menu_agentes_mision", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Se recibe la informacion para el registro de la novedad de PROGRAMACION AGENTE EN MISION o TRASLADO AGENTE DE PLANTA
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_11_gs_agentes_mision(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}
		var u = usuario();
		var f_inicio = frm.m3_11_txt_agentes_mision_fecha_inicio.split("-");
		var f_fin = frm.m3_11_txt_agentes_mision_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final > fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "ID_USUARIO", "NOVEDAD", "VIGENCIA"],
					criterio: [fecha_inicial, fecha_final, frm.m3_11_sel_agentes_mision_usuario, "Agente en misión", 1],
					comparador: ["FECHA_MENOR", "FECHA_MAYOR", "IGUAL", "DIFERENTE", "IGUAL"],
					operador: ["O", "Y", "Y", "Y"]
				}
			});
			if (th.registros == 0) {
				var calendario = query({
					tabla: "CALENDARIO",
					campo: ["ID_CALENDARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
						criterio: [u.id_regional, "Agentes en misión", 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});
				var usuario_en_mision = query({
					tabla: "USUARIO",
					campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [frm.m3_11_sel_agentes_mision_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [usuario_en_mision.datos[0].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent(
					"Agente en misión / " + usuario_en_mision.datos[0].usuario,
					fecha_inicial,
					fecha_final_2
				);

				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_11_sel_agentes_mision_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Agente en misión",
						frm.m3_11_txt_agentes_mision_fecha_inicio,
						frm.m3_11_txt_agentes_mision_fecha_fin,
						frm.m3_11_txt_agentes_mision_detalle,
						1,
						1
					],
					index: true
				});

				var contenido = '<p>';
				contenido += '<ul>';
				contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
				contenido += '<li><b>NOMBRE:</b>' + usuario_en_mision.datos[0].nombre + '</li>';
				contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_11_txt_agentes_mision_detalle + '</li>';
				contenido += '</ul>';
				contenido += '</p>';
				evento.setDescription(contenido);

			} else {
				r.exito = false;
				r.mensaje = "El usuario tiene novedades registradas por fuera del intervalo de tiempo que se le esta programando. Por favor revisar";
			}
		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_11_gs_agentes_mision", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 12 - PROGRAMACION APRENDICES SENA / ESTUDIANTES EN PRACTICA
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de los agentes en mision adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_12_gs_poblar_menu_sena_pej(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["CARGO", "CARGO", "ID_OFICINA"],
					criterio: ["ESTUDIANTE UNIVERSITARIO EN PRACTICA", "APRENDIZ SENA", oficinas.datos[j].id_oficina],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["O", "Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_12_gs_poblar_menu_sena_pej", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Se recibe la informacion para el registro de la novedad de PROGRAMACION AGENTE EN MISION o TRASLADO AGENTE DE PLANTA
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_12_gs_sena_pej(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}

		var f_inicio = frm.m3_12_txt_sena_pej_fecha_inicio.split("-");
		var f_fin = frm.m3_12_txt_sena_pej_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final > fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "ID_USUARIO", "NOVEDAD", "VIGENCIA"],
					criterio: [fecha_inicial, fecha_final, frm.m3_12_sel_sena_pej_usuario, "Estudiante en practica", 1],
					comparador: ["FECHA_MENOR", "FECHA_MAYOR", "IGUAL", "DIFERENTE", "IGUAL"],
					operador: ["O", "Y", "Y", "Y"]
				}
			});
			if (th.registros == 0) {
				var u = usuario();
				var calendario = query({
					tabla: "CALENDARIO",
					campo: ["ID_CALENDARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
						criterio: [u.id_regional, "Agentes en misión", 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});
				var usuario_estudiante = query({
					tabla: "USUARIO",
					campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [frm.m3_12_sel_sena_pej_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});

				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [usuario_estudiante.datos[0].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent(
					"Estudiante en practica / " + usuario_estudiante.datos[0].usuario,
					fecha_inicial,
					fecha_final_2
				);

				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_12_sel_sena_pej_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Estudiante en practica",
						frm.m3_12_txt_sena_pej_fecha_inicio,
						frm.m3_12_txt_sena_pej_fecha_fin,
						frm.m3_12_txt_sena_pej_detalle,
						1,
						1
					],
					index: true
				});

				var contenido = '<p>';
				contenido += '<ul>';
				contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
				contenido += '<li><b>NOMBRE:</b>' + usuario_estudiante.datos[0].nombre + '</li>';
				contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_12_txt_sena_pej_detalle + '</li>';
				contenido += '</ul>';
				contenido += '</p>';
				evento.setDescription(contenido);

			} else {
				r.exito = false;
				r.mensaje = "El usuario tiene novedades registradas por fuera del intervalo de tiempo que se le esta programando. Por favor revisar";
			}
		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_12_gs_sena_pej", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}





//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 13 - REPORTE GENERAL BASE NOVEDADES TH
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {number}  id_regional  id de la regional activa
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_13_gs_cargar_reportes(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Reporte cargado exitosamente",
			contenido_usuarios: '',
			contenido_novedades: ''
		}

		var reporte_usuarios = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M3_NOVEDADES_TH_USUARIOS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_usuarios.registros > 0) {
			r.contenido_usuarios += '<button id="m3_13_btn_m3_usuarios_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m3_13_js_usuarios_actualizar_reporte()>';
			r.contenido_usuarios += 'ACTUALIZAR INFORME >>';
			r.contenido_usuarios += '</button>';
			r.contenido_usuarios += '<hr />';
			r.contenido_usuarios += '<br />';
			r.contenido_usuarios += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_usuarios.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_usuarios += '<br />';
			r.contenido_usuarios += 'Abrir la Base USUARIOS en Drive: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_usuarios.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">Drive >></a>';
			r.contenido_usuarios += '<br />';
		} else {
			r.contenido_usuarios += '<br />';
			r.contenido_usuarios += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_usuarios += '<br />';
		}

		var contenido_novedades = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M3_NOVEDADES_TH_GENERAL", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (contenido_novedades.registros > 0) {
			r.contenido_novedades += '<button id="m3_13_btn_m3_novedades_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m3_13_js_novedades_actualizar_reporte()>';
			r.contenido_novedades += 'ACTUALIZAR INFORME >>';
			r.contenido_novedades += '</button>';
			r.contenido_novedades += '<hr />';
			r.contenido_novedades += '<br />';
			r.contenido_novedades += '<iframe src="https://docs.google.com/spreadsheets/d/' + contenido_novedades.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_novedades += '<br />';
			r.contenido_novedades += 'Abrir la Base USUARIOS en Drive: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + contenido_novedades.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">Drive >></a>';
			r.contenido_novedades += '<br />';
		} else {
			r.contenido_novedades += '<br />';
			r.contenido_novedades += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_novedades += '<br />';
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_regional": id_regional
			}
		};
		var id_error = log_error("m3_13_gs_cargar_reportes", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia al front los datos para actualizar el reporte
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_13_gs_usuarios_actualizar_reporte_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		};
		var usuario = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "USUARIO", "CORREO", "NOMBRE", "ID_OFICINA", "CARGO", "ROL", "AREA", "ACTIVO"],
			condicion: {
				condicion: false,
			}
		});
		r.usuarios = usuario;

		var oficina = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});
		r.oficinas = oficina;

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m3_13_gs_usuarios_actualizar_reporte_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Guarda en el drive el reporte ya elaborado
*
* @param   {object}  data  el reporte listo para guardar en el drive
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_13_gs_usuarios_actualizar_reporte_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte se ha actualizado exitosamente"
		}
		var u = usuario();

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M3_NOVEDADES_TH_USUARIOS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1opqfS4OmVrL4CpPGD3hSpIbDuwDNhbzn");
		var copia = file.makeCopy("REPORTE CONSOLIDADO DE USUARIOS Gestion.APP- ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M3_NOVEDADES_TH_USUARIOS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M3_NOVEDADES_TH_USUARIOS", 3],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m3_controlador",
				funcion: "m3_13_gs_usuarios_actualizar_reporte_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M3_NOVEDADES_TH_USUARIOS", 3, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"data": data.length
			}
		};
		var id_error = log_error("m7_8_gs_actualizar_reporte_v_a_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Desde aqui se carga la informacion qeu se procesara del lado del cliente
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_13_gs_novedades_actualizar_reporte_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		}

		var novedad = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_PAC", "ID_USUARIO", "ID_USUARIO_REPORTE", "FECHA", "NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "DETALLE", "VIGENCIA", "AUTORIZADO", "ID_ARCHIVO", "SOPORTE"],
			condicion: {
				condicion: true,
				campo: ["AUTORIZADO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			},
			opciones: {
				formato_fecha: "FECHA_HORA_a_texto"
			}
		});
		r.novedad = novedad;

		var usuario = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false,
			}
		});
		r.usuario = usuario;

		var oficina = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});
		r.oficina = oficina;

		var upload = query({
			tabla: "INDEX_UPLOAD",
			campo: ["ID_UPLOAD", "RUTA"],
			condicion: {
				condicion: false
			}
		});
		r.upload = upload;

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m3_13_gs_novedades_actualizar_reporte_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Guarda en el drive el reporte ya elaborado
*
* @param   {object}  data  el reporte listo para guardar en el drive
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_13_gs_novedades_actualizar_reporte_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte se ha actualizado exitosamente"
		}
		var u = usuario();

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M3_NOVEDADES_TH_GENERAL", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1opqfS4OmVrL4CpPGD3hSpIbDuwDNhbzn");
		var copia = file.makeCopy("REPORTE CONSOLIDADO NOVEDADES TH - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M3_NOVEDADES_TH_GENERAL");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M3_NOVEDADES_TH_GENERAL", 3],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m3_controlador",
				funcion: "m3_13_gs_novedades_actualizar_reporte_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M3_NOVEDADES_TH_GENERAL", 3, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"data": data.length
			}
		};
		var id_error = log_error("m3_13_gs_novedades_actualizar_reporte_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 14 - ELIMINAR NOVEDADES
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* muestra todas la novedades TH cargadas al usuario
*
* @param   {object}  param  objecto con los parametros para cargar la tabla con las novedades th del usuario
*
* @return  {object}         Tabla
*/
function m3_14_gs_solicitud_consulta(param) {
	try {

		param.titulos = ["ID_NOVEDAD", "OFICINA", "USUARIO", "USUARIO QUIEN REALIZA EL REPORTE", "NOVEDAD", "INICIO NOVEDAD", "FIN NOVEDAD", "OBSERVACIONES", "AUTORIZADO", "VIGENTE", "SOPORTE", "ELIMINAR EVENTO"];
		param.datos = [];
		var u = usuario();
		var contenido;
		var fecha_inicio = param.criterio.fecha_inicial.split("-");
		var fecha_fin = param.criterio.fecha_final.split("-");
		var f_inicio = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
		var f_fin = new Date(fecha_fin[0], fecha_fin[1] - 1, fecha_fin[2]);
		var novedad = query({
			tabla: "NOVEDADES_TH",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["FECHA_INICIO_NOVEDAD", "FECHA_INICIO_NOVEDAD"],
				criterio: [f_inicio, f_fin],
				comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL"],
				operador: ["Y"]
			}
		});
		for (var j = 0; j < novedad.registros; j++) {

			var fila = [];
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA", "ID_REGIONAL"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [novedad.datos[j].id_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			if (oficina.datos[0].id_regional == u.id_regional) {
				fila.push(novedad.datos[j].id_novedad)
				fila.push(oficina.datos[0].oficina);

				var usuario_novedad = query({
					tabla: "USUARIO",
					campo: ["NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [novedad.datos[j].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				if (usuario_novedad.registros > 0) {
					fila.push(usuario_novedad.datos[0].nombre);
				} else {
					fila.push("");
				}
				var usuario_reporta = query({
					tabla: "USUARIO",
					campo: ["NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [novedad.datos[j].id_usuario_reporte],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				if (usuario_reporta.registros > 0) {
					fila.push(usuario_reporta.datos[0].nombre);
				} else {
					fila.push("");
				}

				fila.push(novedad.datos[j].novedad);
				fila.push(fecha_texto(novedad.datos[j].fecha_inicio_novedad, "FECHA_HORA"));
				fila.push(fecha_texto(novedad.datos[j].fecha_fin_novedad, "FECHA_HORA"));
				fila.push(novedad.datos[j].detalle);
				if (novedad.datos[j].autorizado == 1) {
					fila.push("SI");
				} else {
					fila.push("NO");
				}
				if (novedad.datos[j].vigencia == 1) {
					fila.push("SI");
				} else {
					fila.push("NO");
				}

				if (novedad.datos[j].soporte === "") {
					if (novedad.datos[j].id_archivo === "") {
						fila.push("");
					} else {
						fila.push('<a href="https://docs.google.com/spreadsheets/d/' + novedad.datos[j].id_archivo + '/edit?usp=sharing" target="_blank" ><i class="material-icons">print</i></a>');
					}
				} else {
					var upload = query({
						tabla: "INDEX_UPLOAD",
						campo: ["RUTA"],
						condicion: {
							condicion: true,
							campo: ["ID_UPLOAD"],
							criterio: [novedad.datos[j].soporte],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					if (upload.registros > 0) {
						fila.push('<a href="' + upload.datos[0].ruta + '" target="_blank" ><i class="material-icons">print</i></a>')
					} else {
						fila.push("")
					}
				}
				var contenido = '';
				contenido = '<button id="m3_14_btn_eliminar_evento_' + novedad.datos[j].id_novedad + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m3_14_eliminar_evento("' + novedad.datos[j].id_novedad + '")><i class="material-icons">delete_forever</i></button>';
				contenido += '<div class="mdl-tooltip" for="m3_14_btn_eliminar_evento_' + novedad.datos[j].id_novedad + '">Por favor haga clic aquí si desea eliminar este evento</div>';

				fila.push(contenido)
				param.datos.push(fila);

			}


		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m3_14_gs_solicitud_consulta", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 15 - PERMISOS SINDICALES
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion del personal de planta  adscritos a la regional 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m3_15_gs_poblar_menu_p_s(param_select) {
	try {

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < oficinas.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "CARGO", "ID_OFICINA", "ACTIVO"],
					criterio: ["AGENTE DE SERVICIO EN MISIÓN", "GESTOR DE SERVICIO EN MISIÓN", "JEFE PAC EN MISIÓN", "APRENDIZ SENA", "AGENTE DE ROTONDA", "ESTUDIANTE UNIVERSITARIO EN PRACTICA", "ORIENTADOR", oficinas.datos[j].id_oficina, 1],
					comparador: ["DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "DIFERENTE", "IGUAL", "IGUAL"],
					operador: ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]
				},
			});
			for (var i = 0; i < usuarios.registros; i++) {
				var rango = {
					texto: oficinas.datos[j].oficina + " / " + usuarios.datos[i].nombre,
					valor: usuarios.datos[i].id_usuario,
					selected: ""
				};
				param_select.datos.push(rango);
			}
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m3_15_gs_poblar_menu_p_s", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
* Se recibe la informacion para el registro de la novedad de PERMISO SINDICAL
*
* @param   {object}  frm  objecto formulario con los datos para registrar la novedad
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m3_15_gs_registro_permiso_sindical(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se almacenaron exitosamente"
		}
		var u = usuario();

		var f_inicio = frm.m3_15_txt_registro_p_s_fecha_inicio.split("-");
		var f_fin = frm.m3_15_txt_registro_p_s_fecha_fin.split("-");
		var fecha_inicial = new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]);
		var fecha_final = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		var fecha_final_2 = new Date(f_fin[0], f_fin[1] - 1, f_fin[2]);
		fecha_final_2.setDate(fecha_final_2.getDate() + 1);
		if (fecha_final >= fecha_inicial) {
			var th = query({
				tabla: "NOVEDADES_TH",
				campo: [],
				condicion: {
					condicion: false
				}
			});
			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [u.id_regional, 'Permisos e incapacidades', 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				}
			});
			var usuario_permiso = query({
				tabla: "USUARIO",
				campo: ["ID_OFICINA", "USUARIO", "NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [frm.m3_15_sel_registro_p_s_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA", "OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [usuario_permiso.datos[0].id_oficina],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent("Permiso sindical / " + usuario_permiso.datos[0].usuario, fecha_inicial, fecha_final_2);

			if (frm.FILE_TEXT_ID == "") {
				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_15_sel_registro_p_s_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Permiso sindical",
						frm.m3_15_txt_registro_p_s_fecha_inicio,
						frm.m3_15_txt_registro_p_s_fecha_fin,
						frm.m3_15_txt_registro_p_s_detalle,
						1,
						1
					],
					index: true
				});
			} else {
				var ruta_folder = query({
					tabla: "MODULO_UPLOAD",
					campo: ["RUTA_FOLDER"],
					condicion: {
						condicion: true,
						campo: ["ID_MODULO"],
						criterio: [3],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
				var soporte = folder.createFile(frm.m3_15_file_registro_p_s_soporte);
				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: [],
					condicion: {
						condicion: 0,
					}
				});
				var res = upload.insercion({
					campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
					valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 3, soporte.getUrl()],
					index: true
				})
				var index_th = th.insercion({
					campo: [
						"ID_NOVEDAD",
						"ID_EVENTO_CALENDARIO",
						"ID_PAC",
						"ID_USUARIO",
						"ID_USUARIO_REPORTE",
						"FECHA",
						"NOVEDAD",
						"FECHA_INICIO_NOVEDAD",
						"FECHA_FIN_NOVEDAD",
						"DETALLE",
						"VIGENCIA",
						"AUTORIZADO",
						"SOPORTE"
					],
					valor: [
						"",
						evento.getId(),
						oficina.datos[0].id_oficina,
						frm.m3_15_sel_registro_p_s_usuario,
						u.id_usuario,
						fecha_texto(0, "FECHA"),
						"Permiso sindical",
						frm.m3_15_txt_registro_p_s_fecha_inicio,
						frm.m3_15_txt_registro_p_s_fecha_fin,
						frm.m3_15_txt_registro_p_s_detalle,
						1,
						1,
						res.id
					],
					index: true
				});
			}
			var contenido = '<p>';
			contenido += '<ul>';
			contenido += '<li><b>OFICINA:</b>' + oficina.datos[0].oficina + '</li>';
			contenido += '<li><b>NOMBRE:</b>' + usuario_permiso.datos[0].nombre + '</li>';
			contenido += '<li><b>DESCRIPCIÓN:</b>' + frm.m3_15_txt_registro_p_s_detalle + '</li>';
			contenido += '</ul>';
			contenido += '</p>';
			evento.setDescription(contenido);

			var usuario_mail = query({
				tabla: "USUARIO",
				campo: ["CORREO", "ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["AREA", "AREA", "CARGO","ACTIVO"],
					criterio: ["TALENTO HUMANO", "SERVICIO AL CIUDADANO", "PROFESIONAL",1],
					comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
					operador: ["O", "Y", "Y"]
				}
			});
			var oficinas_mail = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL"],
					criterio: [u.id_regional],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var correos = '';
			for (var j = 0; j < usuario_mail.registros; j++) {
				for (var i = 0; i < oficinas_mail.registros; i++) {
					if (oficinas_mail.datos[i].id_oficina === usuario_mail.datos[j].id_oficina) {
						correos += usuario_mail.datos[j].correo + ', ';
					}
				}
			}
			if (correos !== '') {
				var cuerpo_correo;
				cuerpo_correo = "<p>Cordial Saludo,</p>";
				cuerpo_correo = cuerpo_correo + "<p>El dia &nbsp;de hoy en la <strong>" + oficina.datos[0].oficina + "</strong>, se reporto una novedad de PERMISO SINDICAL:</p>";
				cuerpo_correo = cuerpo_correo + "<ul>";
				cuerpo_correo = cuerpo_correo + "<li><strong>FUNCIONARIO: </strong>" + usuario_permiso.datos[0].nombre + "</li>";
				cuerpo_correo = cuerpo_correo + "<li><strong>DESCRIPCION NOVEDAD: </strong>" + frm.m3_15_txt_registro_p_s_detalle + "</li>";
				cuerpo_correo = cuerpo_correo + "<li><strong>USUARIO QUE REPORTA: </strong>" + u.usuario + "</li>";
				if (frm.FILE_TEXT_ID == "") {
					cuerpo_correo = cuerpo_correo + "<li><b>SOPORTE:</b> No se adjunto soporte del Permiso sindicald</li>";
				} else {
					cuerpo_correo = cuerpo_correo + "<li><b>SOPORTE:</b>" + soporte.getUrl() + "</li>";
				}
				cuerpo_correo = cuerpo_correo + "</ul>";
				cuerpo_correo = cuerpo_correo + "<p>Muchas gracias por su colaboraci&oacute;n.</p>";
				cuerpo_correo = cuerpo_correo + '<pre><q>Este es un correo generado automaticamente a traves del <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';
				MailApp.sendEmail({
					to: correos,
					subject: "Aviso novedad PERMISO SINDICAL en " + oficina.datos[0].oficina,
					htmlBody: cuerpo_correo,
					noReply: true
				});
			}

		} else {
			r.exito = false;
			r.mensaje = "Por favor verifique las fechas de inicio y fin de la novedad";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_15_gs_registro_permiso_sindical", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 16 - MODIFICACION DE VACACIONES
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* muestra informacion de xxxxxxxxxxx en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m3_16_gs_m_v_mostrar_vacaciones(param_tabla) {
	try {

		param_tabla.titulos = ["FECHA PROGRAMACIÓN", "FECHA INICIO VACACIONES", "FECHA FINALIZACION VACACIONES", "DETALLE", "MODIFICAR FECHA", "FRACCIONAR"];
		param_tabla.datos = [];
		var fecha_actual = new Date();
		var th = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_NOVEDAD", "FECHA", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "DETALLE"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO", "FECHA_INICIO_NOVEDAD", "NOVEDAD", "VIGENCIA", "AUTORIZADO"],
				criterio: [param_tabla.id_usuario, fecha_actual, "Vacación", 1, 1],
				comparador: ["IGUAL", "FECHA_MAYOR_IGUAL", "IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y", "Y", "Y"]
			}
		});

		for (var j = 0; j < th.registros; j++) {
			var fila = [];
			fila.push(fecha_texto(th.datos[j].fecha, "FECHA"));
			fila.push(fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA"));
			fila.push(fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA"));
			fila.push(th.datos[j].detalle);
			fila.push('<a href="#" id="m3_16_a_m_v_mostrar_form_modificacion" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"  ><i class="material-icons" onclick=m3_16_js_m_v_mostrar_form_modificacion("' + th.datos[j].id_novedad + '")>check_circle</i></a>');
			fila.push('<a href="#" id="m3_16_a_m_v_mostrar_form_fraccionamiento" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"  ><i class="material-icons" onclick=m3_16_js_m_v_mostrar_form_fraccionamiento("' + th.datos[j].id_novedad + '")>check_circle</i></a>');
			param_tabla.datos.push(fila);
		}

		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m3_16_gs_m_v_mostrar_vacaciones", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descripcion_funcion
 *
 * @param   {object}  frm  formulario con los datos de la modificacion de vacaciones 
 *
 * @return  {object}       Respuesta de las modificaciones a realizar
 */
function m3_16_gs_m_v_confirmacion_modificacion(frm) {
	try {

		var u = usuario();
		var r = {
			exito: true,
			mensaje: "Solicitud de modificación de vacaciones registrada exitosamente"
		}

		var fecha_actual = new Date()
		var f = frm.m3_16_txt_m_v_fecha_vacacion.split("-");
		var fecha_propuesta = new Date(f[0], f[1] - 1, f[2]);
		if (fecha_actual < fecha_propuesta) {
			var param = {
				sender: "APP",
				usuarios: [u.id_usuario],
				asunto: "Solicitud de Modificación de Vacaciones",
				contenido: "",
				id_modulo: 3
			}
			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL"],
					criterio: [u.id_regional],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			for (var j_oficinas = 0; j_oficinas < oficina.registros; j_oficinas++) {
				var usuarios_correo = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO"],
					condicion: {
						condicion: true,
						campo: ["AREA", "AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
						criterio: ["TALENTO HUMANO", "SERVICIO AL CIUDADANO", "PROFESIONAL", oficina.datos[j_oficinas].id_oficina, 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL"],
						operador: ["O", "Y", "Y", "Y"]
					}
				});
				for (var j_usuario = 0; j_usuario < usuarios_correo.registros; j_usuario++) {
					param.usuarios.push(usuarios_correo.datos[j_usuario].id_usuario);
				}
			}

			var th = query({
				tabla: "NOVEDADES_TH",
				campo: ["ID_USUARIO", "ID_PAC", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_NOVEDAD"],
					criterio: [frm.m3_16_hid_m_v_id_novedad],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var usuario_vacacion = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [th.datos[0].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var oficina_vacacion = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [th.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			param.contenido += "<ul>";
			param.contenido += "<li><strong>FUNCIONARIO: </strong>" + usuario_vacacion.datos[0].nombre + "</li>";
			param.contenido += "<li><strong>OFICINA: </strong>" + oficina_vacacion.datos[0].oficina + "</li>";
			param.contenido += "<li><strong>FECHA ACTUAL DE VACACIONES: </strong>" + fecha_texto(th.datos[0].fecha_inicio_novedad, "FECHA") + " - " + fecha_texto(th.datos[0].fecha_fin_novedad, "FECHA") + "</li>";
			param.contenido += "<li><strong>NUEVA FECHA DE INICIO DE VACACIONES PROPUESTA: </strong>" + frm.m3_16_txt_m_v_fecha_vacacion + "</li>";
			param.contenido += "<li><strong>OBSERVACIONES: </strong>" + frm.m3_16_txt_m_v_observaciones + "</li>";
			param.contenido += "</ul>";
			generador_de_correo(param)
		} else {
			r.exito = false;
			r.mensaje = "No se pude registrar su solicitud. Por favor verifique que la fecha propuesta sea mayor a la fecha actual"
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m3_16_gs_m_v_confirmacion_modificacion", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}






//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//RUTINAS PROGRAMADAS O ALTERNAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* se verifica las fechas de vencimiento en el calendario 
*
*
* @return  {null}
*/
function m3_gs_verificacion_programacion() {
	try {

		var fecha_actual = new Date();
		var th = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_NOVEDAD", "VIGENCIA"],
			condicion: {
				condicion: true,
				campo: ["FECHA_FIN_NOVEDAD", "VIGENCIA"],
				criterio: [fecha_actual, 1],
				comparador: ["FECHA_MENOR", "IGUAL"],
				operador: ["Y"]
			}
		});
		th.edicion({
			campo: ["VIGENCIA"],
			valor: [0]
		});


		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m3_gs_verificacion_programacion", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* se verifica la programacion de todos los agentes en mision de la regional
*
*
* @return  {null}
*/
function m3_gs_agentes_mision_verificacion_programacion() {
	try {

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO"],
			condicion: {
				condicion: true,
				campo: ["CARGO"],
				criterio: ["AGENTE DE SERVICIO EN MISIÓN"],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		usuarios.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		var fecha_actual = new Date();
		var th = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_USUARIO"],
			condicion: {
				condicion: true,
				campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "NOVEDAD", "VIGENCIA"],
				criterio: [fecha_actual, fecha_actual, "Agente en misión", 1],
				comparador: ["FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y", "Y"]
			}
		});
		for (var j = 0; j < th.registros; j++) {
			var usuarios = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [th.datos[j].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			usuarios.edicion({
				campo: ["ACTIVO"],
				valor: [1]
			});
		}


		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m3_gs_agentes_mision_verificacion_programacion", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* se verifica la programacion de todos los agentes en mision de la regional
*
*
* @return  {null}
*/
function m3_gs_eliminar_evento(id_novedad) {
	try {

		var r = {
			exito: true,
			mensaje: "El evento se borro exitosamente"
		}
		if (verificar_acceso('3_12')) {
			var novedades = query({
				tabla: "NOVEDADES_TH",
				campo: ["ID_EVENTO_CALENDARIO", "ID_USUARIO", "NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_NOVEDAD"],
					criterio: [id_novedad],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			if (novedades.registros >= 1) {
				switch (novedades.datos[0].novedad) {
					case "Agente en misión":
						var tipo_novedad = "Agentes en misión";
						break;
					case "Estudiante en practica":
						var tipo_novedad = "Agentes en misión";
						break;
					case "Incapacidad":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por asistencia a servicios médicos":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por asuntos personales":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por calamidad doméstica":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por estudio":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por sufragio":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permisos por jurado de votación":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por cumpleaños":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Licencia por enfermedad grave de un pariente":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por matrimonio":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por lactancia":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso especial":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por Talentos":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por luto":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Permiso por solicitud propia":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Medio día por el uso de medios alternativos de transporte":
						var tipo_novedad = "Permisos e incapacidades";
						break;
					case "Vacación":
						var tipo_novedad = "Vacaciones y licencias";
						break;
					case "Licencia por maternidad":
						var tipo_novedad = "Vacaciones y licencias";
						break;
					case "Licencia NO remunerada":
						var tipo_novedad = "Vacaciones y licencias";
						break;
				}
				var usuario = query({
					tabla: "USUARIO",
					campo: ["ID_OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [novedades.datos[0].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_REGIONAL"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [usuario.datos[0].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var calendario = query({
					tabla: "CALENDARIO",
					campo: ["ID_CALENDARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
						criterio: [oficina.datos[0].id_regional, tipo_novedad, 1],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});
				if (calendario.registros > 0) {
					var id_calendario = novedades.datos[0].id_evento_calendario;
					novedades.borrado();
					try {
						if (id_calendario !== '') {
							var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").getEventById(id_calendario);
							evento.deleteEvent()
						}
					} catch (e) {
						var param = {
							tipo_error: "codigo/GAS",
							parametros: {
								"evento": evento,
								"id_calendario": id_calendario
							}
						};
						log_error("m3_gs_eliminar_evento", param, e);
					}
				}
			} else {
				r.exito = false;
				r.mensaje = "El evento ya ha sido eliminado anteriormente";
			}
		} else {
			r.exito = false;
			r.mensaje = "No tiene los privilegios suficientes para realizar esta operación";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_novedad": id_novedad
			}
		};
		var id_error = log_error("m3_gs_eliminar_evento", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* se envia correo de aviso de inicio de programacion de agente en mision
*
*
* @return  {null}
*/
function m3_gs_aviso_programacion_agente_mision() {
	try {

		var u = usuario();
		var fecha_actual = new Date();
		var th = query({
			tabla: "NOVEDADES_TH",
			campo: ["ID_USUARIO", "FECHA_INICIO_NOVEDAD", "DETALLE", "FECHA_FIN_NOVEDAD", "ID_PAC"],
			condicion: {
				condicion: true,
				campo: ["FECHA_INICIO_NOVEDAD", "NOVEDAD", "VIGENCIA"],
				criterio: [fecha_actual, "Agente en misión", 1],
				comparador: ["FECHA_MAYOR_IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y", "Y"]
			}
		});
		for (var j = 0; j < th.registros; j++) {
			var dif = th.datos[j].fecha_inicio_novedad - fecha_actual;
			var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
			if (dias == 35) {
				var oficina_misional = query({
					tabla: "OFICINA",
					campo: ["OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [th.datos[j].id_pac],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				var param = {
					sender: "APP",
					usuarios: [],
					asunto: "Aviso de inicio de Novedad - Agente en Misión - para la oficina " + oficina_misional.datos[0].oficina,
					contenido: "",
					id_modulo: 3
				}
				var oficina = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL"],
						criterio: [u.id_regional],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				for (var j_oficinas = 0; j_oficinas < oficina.registros; j_oficinas++) {
					var usuarios_correo = query({
						tabla: "USUARIO",
						campo: ["ID_USUARIO"],
						condicion: {
							condicion: true,
							campo: ["AREA", "AREA", "CARGO", "ID_OFICINA", "ACTIVO"],
							criterio: ["TALENTO HUMANO", "SERVICIO AL CIUDADANO", "PROFESIONAL", oficina.datos[j_oficinas].id_oficina, 1],
							comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL"],
							operador: ["O", "Y", "Y", "Y"]
						}
					});
					for (var j_usuario = 0; j_usuario < usuarios_correo.registros; j_usuario++) {
						param.usuarios.push(usuarios_correo.datos[j_usuario].id_usuario);
					}
				}
				if (param.usuarios.length > 0) {
					param.contenido += "<ul>";
					var misional = query({
						tabla: "USUARIO",
						campo: ["NOMBRE"],
						condicion: {
							condicion: true,
							campo: ["ID_USUARIO"],
							criterio: [th.datos[j].id_usuario],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					param.contenido += "<li><strong>FUNCIONARIO: </strong>" + misional.datos[0].nombre + "</li>";
					param.contenido += "<li><strong>DESCRIPCION NOVEDAD: </strong>" + th.datos[j].detalle + "</li>";
					param.contenido += "<li><strong>FECHA INICIO DE NOVEDAD: </strong>" + fecha_texto(th.datos[j].fecha_inicio_novedad, "FECHA") + "</li>";
					param.contenido += "<li><strong>FECHA FINALIZACIÓN DE NOVEDAD: </strong>" + fecha_texto(th.datos[j].fecha_fin_novedad, "FECHA") + "</li>";
					param.contenido += "</ul>";
					generador_de_correo(param)
				}
			}
		}

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m3_gs_aviso_programacion_agente_mision", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}