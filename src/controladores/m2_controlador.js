/**---------------------------------------MODULO APERTURA Y CIERRE----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - ACTA DE APERTURA
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* verifica que ya no exista un informe de cierre diligenciado para ese mismo dia
*
* @param   {number}  id_oficina  id_ de la oficina
*
* @return  {object}              objecto con los resultados de la verificacion
*/
function m2_1_gs_verificar_acta_apertura(id_oficina) {
	try {
		var r = {
			exito: false,
			mensaje: ""
		};
		var fecha_actual = new Date();
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION"],
			condicion: {
				condicion: true,
				campo: ["FECHA", "ID_PAC"],
				criterio: [fecha_actual, id_oficina],
				comparador: ["FECHA_IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_verificar_acta_apertura",
				variable: "operacion"
			}
		});
		if (operacion.registros >= 1) {
			r.exito = true;
			r.mensaje = "Ya tiene un formulario de Apertura diligenciado para el día de hoy, este se sobrescribirá";
		}
		return r;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_oficina": id_oficina
			}
		};
		log_error("m2_1_gs_verificar_acta_apertura", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Carga en el acta de apertura los usuarios asignados a la oficina
*
* @param   {object}  param  objecto con los parametros para cargar la tabla con los usuarios disponibles
*
* @return  {object}         objecto con los parametros para cargar la tabla con los usuarios disponibles
*/
function m2_1_gs_cargar_disponibilidad_funcionarios(param) {
	try {

		param.titulos = ["USUARIO", "NOMBRE", "CARGO", "ROL", "DISPONIBILIDAD", "NOVEDADES", "REPORTAR INCAPACIDAD"];
		param.datos = [];
		param.opciones = {
			"scrollX": true,
			"responsive": true,
			"paging": false
		}

		var fecha_actual = new Date();
		fecha_actual.setHours(0, 0, 0, 0);

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "USUARIO", "NOMBRE", "CARGO", "ROL"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA", "ACTIVO"],
				criterio: [param.criterio.id_oficina, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		param.usuarios = usuarios;

		var novedades = query({
			tabla: "NOVEDADES_TH",
			campo: ["NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "DETALLE", "VIGENCIA", "AUTORIZADO", "ID_PAC", "ID_USUARIO"],
			condicion: {
				condicion: true,
				campo: ["FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "VIGENCIA", "NOVEDAD", "ID_PAC"],
				criterio: [fecha_actual, fecha_actual, 1, "Agente en misión", param.criterio.id_oficina],
				comparador: ["FECHA_MENOR_IGUAL", "FECHA_MAYOR_IGUAL", "IGUAL", "DIFERENTE", "IGUAL"],
				operador: ["Y", "Y", "Y", "Y"]
			},
			opciones: {
				formato_fecha: "FECHA_HORA_a_texto"
			}
		});
		param.novedades = novedades;

		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m2_1_gs_cargar_disponibilidad_funcionarios", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
*  Carga la informacion de las tablas necesarias para mostrar carga la base documental
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m2_1_gs_cargar_base_documental(param) {
	try {

		var base_documental = query({
			tabla: "BASE_DOCUMENTAL",
			campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "ID_UPLOAD", "REQUIERE_SOPORTE"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		param.base_documental = base_documental;

		var upload = query({
			tabla: "INDEX_UPLOAD",
			campo: ["FECHA", "RUTA", "ID_UPLOAD"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ID_MODULO"],
				criterio: [param.id_regional, 2],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		param.upload = upload;

		var socializaciones = query({
			tabla: "BASE_SOCIALIZACION",
			campo: ["ID_DOCUMENTO", "ID_UPLOAD", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		param.socializaciones = socializaciones

		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		var id_error = log_error("m2_1_gs_cargar_base_documental", param, e);
		param.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Funcion que devuelve la planilla de control de temperatura que corresponde a la regional
 *
 * @param   number  id_regional  id de la regional 
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m2_1_gs_cargar_planilla_control_ingreso(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Planilla cargada exitosamente",
			contenido: ''
		}

		switch (id_regional) {
			case 0:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1ceShKx9m254re4nVuR7zIOf9uUK6Fn_cV-2vgTOHSg0/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1ceShKx9m254re4nVuR7zIOf9uUK6Fn_cV-2vgTOHSg0/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 4:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1BxxgANjVCK6a1kPkTkzcX8RcJhqQvSj9xylKnHFsPfU/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1BxxgANjVCK6a1kPkTkzcX8RcJhqQvSj9xylKnHFsPfU/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 5:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1PhVy3wVBoTn7zJ0eyKimS1FEG3VhVOt4jIIxmJvjSxE/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1PhVy3wVBoTn7zJ0eyKimS1FEG3VhVOt4jIIxmJvjSxE/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 6:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1AUUryXPD_LiA8r3c7ra_SD2KNiIL01Xe2meG25cdZaQ/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1AUUryXPD_LiA8r3c7ra_SD2KNiIL01Xe2meG25cdZaQ/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 7:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1YrpR1N-HwUtBw7S6KKra3x-JpJvtAR-x8sHPuAj1m4E/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1YrpR1N-HwUtBw7S6KKra3x-JpJvtAR-x8sHPuAj1m4E/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 8:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1vxBVuQHc4KyyOPeztS3wqxo-K0pZIYeH6UQdsCfyklk/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1vxBVuQHc4KyyOPeztS3wqxo-K0pZIYeH6UQdsCfyklk/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 9:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1Vhl1PG6-Uy5jzu08FDYd4801elixoAohODssZtspHdM/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1Vhl1PG6-Uy5jzu08FDYd4801elixoAohODssZtspHdM/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			case 10:
				r.contenido += '<hr />';
				r.contenido += '<br />';
				r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/1RIibeIfkl4nLpJbAakklsdVNI5c9lCj1VUAcqVO_r_s/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
				r.contenido += '<br />';
				r.contenido += 'Abrir <b>PLANILLA DE CONTROL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/1RIibeIfkl4nLpJbAakklsdVNI5c9lCj1VUAcqVO_r_s/edit?usp=sharing" target="_blank">DRIVE >></a>';
				r.contenido += '<br />';
				r.contenido += '<hr />';
				break;
			default:
				r.exito = false;
				r.mensaje = "No existe una Planilla de Control de Temperatura asociada a esta Regional";
				break;
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
		var id_error = log_error("m2_1_gs_cargar_planilla_control_ingreso", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Carga la evidencia de socializacion a la base de datos
*
* @param   {object}  frm  formulario con los datos que se van a guardar en el back
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m2_1_gs_a_p_socializacion(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se guardaron exitosamente"
		}
		var u = usuario();
		var socializacion = query({
			tabla: "BASE_SOCIALIZACION",
			campo: ["ID_DOCUMENTO", "ID_UPLOAD", "OBSERVACION", "ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_DOCUMENTO", "ID_OFICINA", "ACTIVO"],
				criterio: [frm.m2_1_hid_a_p_id_documento, u.id_oficina, 1],
				comparador: ["IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y"]
			}
		});

		if (frm.m2_1_hid_a_p_requiere_soporte === "SI") {

			if (socializacion.registros > 0) {
				socializacion.edicion({
					campo: ["ACTIVO"],
					valor: [0]
				})
			}

			var ruta_folder = query({
				tabla: "MODULO_UPLOAD",
				campo: ["RUTA_FOLDER"],
				condicion: {
					condicion: true,
					campo: ["ID_MODULO"],
					criterio: [2],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
			var soporte = folder.createFile(frm.m2_1_file_a_p_socializacion);
			var upload = query({
				tabla: "INDEX_UPLOAD",
				campo: [],
				condicion: {
					condicion: 0,
				}
			});
			var res = upload.insercion({
				campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
				valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 2, soporte.getUrl()],
				index: true
			})
			socializacion.insercion({
				campo: ["ID_DOCUMENTO", "ID_OFICINA", "ID_UPLOAD", "OBSERVACION", "ACTIVO"],
				valor: [frm.m2_1_hid_a_p_id_documento, u.id_oficina, res.id, frm.m2_1_txt_a_p_observaciones_socializacion, 1],
				index: false
			})

		} else {

			if (socializacion.registros > 0) {
				socializacion.edicion({
					campo: ["ACTIVO"],
					valor: [0]
				})
			}
			socializacion.insercion({
				campo: ["ID_DOCUMENTO", "ID_OFICINA", "OBSERVACION", "ACTIVO"],
				valor: [frm.m2_1_hid_a_p_id_documento, u.id_oficina, frm.m2_1_txt_a_p_observaciones_socializacion, 1],
				index: false
			})

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m2_1_gs_a_p_socializacion", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* funcion que crea un id para el acta de apertura
*
* @param   {object}  acta  Objecto con la informacion del acta 
*
* @return  {object}        respuesta de la insercion del acta (exito y mensaje)
*/
function m2_1_gs_registrar_acta_crear_acta(acta) {
	try {

		var r = {
			exito: true,
			mensaje: ""
		}


		var u = usuario();
		acta.id_operacion = -1
		acta.id_pac = u.id_oficina
		acta.id_usuario = u.id_usuario

		var fecha_actual = new Date();

		//PASO 1 : "CREAR_ACTA"

		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ID_PAC", "FECHA"],
				criterio: [acta.id_pac, fecha_actual],
				comparador: ["IGUAL", "FECHA_IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta",
				variable: "operacion"
			}
		});
		if (operacion.registros >= 1) {
			operacion.edicion({
				campo: ["ACTIVO"],
				valor: [0]
			});
		}
		var r_insercion = operacion.insercion({
			campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION", "ACTIVO"],
			valor: ["", acta.id_pac, acta.id_usuario, fecha_texto(0, "FECHA"), fecha_texto(0, "HORA"), acta.caso_bizagi, acta.observaciones_personal, acta.observaciones_reunion, 1],
			index: true
		});
		acta.id_operacion = r_insercion.id

		//PASO 2 : "REGISTRAR NOVEDADES PERSONAL"

		if (acta.usuarios.length != 0) {
			var operacion_personal = query({
				tabla: "NOVEDADES_PERSONAL",
				campo: [],
				condicion: {
					condicion: 0,
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_1_gs_registrar_acta",
					variable: "operacion_personal"
				}
			});
			for (var j = 0; j < acta.usuarios.length; j++) {
				operacion_personal.insercion({
					campo: ["ID_OPERACION", "ID_USUARIO", "DISPONIBILIDAD", "NOVEDAD"],
					valor: [acta.id_operacion, acta.usuarios[j].id_usuario, acta.usuarios[j].disponibilidad, acta.usuarios[j].novedad],
					index: false
				});
			}
		}

		//PASO 3 : "REGISTRAR SOCIALIZACIONES"

		if (acta.socializaciones.length != 0) {
			for (j = 0; j < acta.socializaciones.length; j++) {
				var base_socializacion = query({
					tabla: "BASE_SOCIALIZACION",
					campo: ["ID_OPERACION"],
					condicion: {
						condicion: true,
						campo: ["ID_DOCUMENTO", "ID_OFICINA", "ACTIVO", "ID_OPERACION"],
						criterio: [acta.socializaciones[j], acta.id_pac, 1, ""],
						comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y", "Y"]
					}
				});
				if (base_socializacion.registros > 0) {
					base_socializacion.edicion({
						campo: ["ID_OPERACION"],
						valor: [acta.id_operacion]
					})
				}
			}
		}


		//PASO 4 : "REGISTRAR_NOVEDADES_INFRAESTRUCTURA"


		if (acta.fallas_categoria.length != 0) {
			for (j = 0; j < acta.fallas_categoria.length; j++) {
				var operacion_fallas = query({
					tabla: "NOVEDADES_OPERACION",
					campo: [],
					condicion: {
						condicion: 0,
					}
				});
				operacion_fallas.insercion({
					campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD"],
					valor: [acta.id_operacion, "APERTURA", acta.fallas_categoria[j], acta.fallas_descripcion[j]],
					index: false
				});
			}
		}

		//PASO 5 : "ENVIAR_CORREO"

		m2_1_gs_registrar_acta_enviar_correo(acta.id_operacion)

		r.mensaje = "Correo de soporte de diligenciamiento de formulario de Apertura enviado exitosamente"

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: acta
		};
		var id_error = log_error("m2_1_gs_registrar_acta_crear_acta", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return acta

	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* funcion que se encarga de enviar el mail de evidencia de la reunion de apertura a todos los que hicieron parte de la misma
*
* @param   {number}  id_operacion  id de la operacion
*
* @return  {null}
*/
function m2_1_gs_registrar_acta_enviar_correo(id_operacion) {
	try {
		var r = {
			exito: true,
			mensaje: "Acta de Apertura diligenciada exitosamente"
		}
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
			condicion: {
				condicion: true,
				campo: ["ID_OPERACION"],
				criterio: [id_operacion],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta_enviar_mail",
				variable: "variable"
			}
		});
		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [operacion.datos[0].id_pac],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta_enviar_mail",
				variable: "oficina"
			}
		});
		var contenido = '';
		var fecha_acta = new Date(operacion.datos[0].fecha);
		contenido += '<p style="text-align: center;"><strong>ACTA DE APERTURA ' + oficina.datos[0].oficina + '</strong></p>';
		contenido += '<p style="text-align: center;">' + obtener_dia_semana(fecha_acta.getDay()) + ", " + fecha_acta.getDate() + " de " + obtener_mes(fecha_acta.getMonth() + 1).toLowerCase() + " de " + fecha_acta.getFullYear() + '</p>';
		contenido += '<p style="text-align: center;">' + id_operacion + '</p>';
		contenido += '<br />';
		contenido += '<hr />';
		contenido += '<p><strong>SECCION 1:</strong>Checklitst Personal</p>';
		contenido += '<hr />';
		contenido += '<br />';
		contenido += '<p><strong>1.1 Personal disponible:</strong></p>';
		contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
		contenido += '<thead>';
		contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
		contenido += '<th style="text-align: center;">USUARIO</th>';
		contenido += '<th style="text-align: center;">NOMBRE</th>';
		contenido += '<th style="text-align: center;">CARGO</th>';
		contenido += '<th style="text-align: center;">DISPONIBILIDAD</th>';
		contenido += '<th style="text-align: center;">NOVEDAD PERSONAL</th>';
		contenido += '</tr>';
		contenido += '</thead>';
		var usuarios_novedades_personal = query({
			tabla: "NOVEDADES_PERSONAL",
			campo: ["ID_USUARIO", "DISPONIBILIDAD", "NOVEDAD"],
			condicion: {
				condicion: true,
				campo: ["ID_OPERACION"],
				criterio: [id_operacion],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta_enviar_mail",
				variable: "usuarios_novedades_personal"
			}
		});
		var usuarios_correo = "";
		for (var j = 0; j < usuarios_novedades_personal.registros; j++) {
			contenido += '<tr>';
			var usuario_novedades = query({
				tabla: "USUARIO",
				campo: ["USUARIO", "NOMBRE", "CARGO", "CORREO", "ROL"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [usuarios_novedades_personal.datos[j].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_1_gs_registrar_acta_enviar_mail",
					variable: "usuario_novedades"
				}
			});

			if (usuario_novedades.datos[0].rol !== "PAC / ORIENTADOR" && usuario_novedades.datos[0].rol !== "PAC / AGENTE ROTONDA" && usuario_novedades.datos[0].rol !== "PAC / GESTOR BEPS") {
				usuarios_correo += usuario_novedades.datos[0].correo + ",";
			}

			contenido += '<td>' + usuario_novedades.datos[0].usuario + '</td>';
			contenido += '<td>' + usuario_novedades.datos[0].nombre + '</td>';
			contenido += '<td>' + usuario_novedades.datos[0].cargo + '</td>';
			contenido += '<td>' + usuarios_novedades_personal.datos[j].disponibilidad + '</td>';
			contenido += '<td>' + usuarios_novedades_personal.datos[j].novedad + '</td>';
			contenido += '</tr>';
		}
		contenido += '</tbody>';
		contenido += '</table>';
		contenido += '<br />';
		contenido += '<p><strong>1.2 Observaciones relacionadas con el personal:<br /></strong></p>';
		if (operacion.datos[0].observaciones_reunion === "") {
			contenido += '<p>sin novedades</p>'
		} else {
			contenido += '<p>' + operacion.datos[0].observaciones_personal + '</p>';
		}
		contenido += '<br />';
		contenido += '<br />';
		contenido += '<hr />';
		contenido += '<p><strong>SECCION 2:</strong> Checklist infraestructura / conectividad / equipos</p>';
		contenido += '<hr />';
		contenido += '<br />';
		contenido += '<p><strong>2.1 Observaciones relacionadas con infraestructura, conectividad y equipos:</strong></p>';
		var novedades_operacion = query({
			tabla: "NOVEDADES_OPERACION",
			campo: ["ID_OPERACION", "TIPO_NOVEDAD", "NOVEDAD"],
			condicion: {
				condicion: true,
				campo: ["ID_OPERACION", "MOMENTO"],
				criterio: [id_operacion, "APERTURA"],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta_enviar_mail",
				variable: "novedades_operacion"
			}
		});
		if (novedades_operacion.registros > 0) {
			contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
			contenido += '<thead>';
			contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
			contenido += '<th style="text-align: center;">TIPO NOVEDAD</th>';
			contenido += '<th style="text-align: center;">NOVEDAD</th>';
			contenido += '</tr>';
			contenido += '</thead>';
			for (j = 0; j < novedades_operacion.registros; j++) {
				contenido += '<tr>';
				contenido += '<td>' + novedades_operacion.datos[j].tipo_novedad + '</td>';
				contenido += '<td>' + novedades_operacion.datos[j].novedad + '</td>';
				contenido += '</tr>';
			}
			contenido += '</tbody>';
			contenido += '</table>';
		} else {
			contenido += '<p>sin novedades</p>'
		}
		contenido += '<br />';
		contenido += '<br />';
		contenido += '<hr />';
		contenido += '<p><strong>SECCION 3:</strong> Reuni&oacute;n de apertura</p>';
		contenido += '<hr />';
		contenido += '<br />';
		contenido += '<p><strong>3.1 Observaciones relacionadas con la reuni&oacute;n de apertura:</strong></p>';
		if (operacion.datos[0].observaciones_reunion === "") {
			contenido += '<p>sin novedades</p>'
		} else {
			contenido += '<p>' + operacion.datos[0].observaciones_reunion + '</p>';
		}
		contenido += '<br />';
		contenido += '<p><strong>3.2 Temas tratados en la reunión de apertura:</strong></p>';
		var socializaciones = query({
			tabla: "BASE_SOCIALIZACION",
			campo: ["ID_DOCUMENTO", "OBSERVACION", "ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_OPERACION", "ACTIVO"],
				criterio: [id_operacion, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});
		if (socializaciones.registros > 0) {
			contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
			contenido += '<thead>';
			contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
			contenido += '<th style="text-align: center;">ID_DOCUMENTO</th>';
			contenido += '<th style="text-align: center;">DOCUMENTO</th>';
			contenido += '<th style="text-align: center;">COMENTARIOS SOCIALIZACION</th>';
			contenido += '</tr>';
			contenido += '</thead>';
			for (j = 0; j < socializaciones.registros; j++) {
				var documento = query({
					tabla: "BASE_DOCUMENTAL",
					campo: ["DOCUMENTO"],
					condicion: {
						condicion: true,
						campo: ["ID_DOCUMENTO"],
						criterio: [socializaciones.datos[j].id_documento],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				contenido += '<tr>';
				contenido += '<td>' + socializaciones.datos[j].id_documento + '</td>';
				contenido += '<td>' + documento.datos[0].documento + '</td>';
				contenido += '<td>' + socializaciones.datos[j].observacion + '</td>';
				contenido += '</tr>';
			}
			contenido += '</tbody>';
			contenido += '</table>';
		} else {
			contenido += '<p>sin novedades</p>'
		}
		contenido += '<br />';
		contenido += '<br />';
		contenido += '<hr />';
		contenido += '<p><strong>SECCION 4:</strong> Apertura en Bizagi</p>';
		contenido += '<hr />';
		contenido += '<br />';
		contenido += '<p><strong>4.1 Caso Bizagi de Apertura:</strong></p>';
		contenido += '<p>' + operacion.datos[0].bzg_apertura + '</p>';
		contenido += '<br />';
		contenido += '<br />';
		contenido += '<hr />';
		contenido += '<pre><q>Este es un correo generado automaticamente a traves del <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">App para la Gestión de los PAC</a>. Por favor no responderlo.</q></pre>';
		if (usuarios_correo !== "") {
			MailApp.sendEmail({
				to: usuarios_correo,
				subject: "Acta de Apertura " + oficina.datos[0].oficina + " (" + fecha_acta.getFullYear() + "/" + addZero(fecha_acta.getMonth() + 1) + "/" + addZero(fecha_acta.getDate()) + ")",
				htmlBody: contenido,
				noReply: true
			});
		} else {
			r.exito = false;
			r.mensaje = "No existe alguien a quien enviar el correo registrado en esta apertura";
		}
		return r;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_operacion": id_operacion
			}
		};
		var id_error = log_error("m2_1_gs_registrar_acta_enviar_mail", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - INFORME DE CIERRE
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

/**
* verifica que ya no exista un informe de cierre diligenciado para ese mismo dia
*
* @param   {number}  id_oficina  id_ de la oficina
*
* @return  {object}              objecto con los resultados de la verificacion
*/
function m2_2_gs_verificar_informe_cierre(id_oficina) {
	try {
		var r = {
			exito: false,
			mensaje: ""
		};
		var fecha_actual = new Date();
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION"],
			condicion: {
				condicion: true,
				campo: ["FECHA", "ID_PAC"],
				criterio: [fecha_actual, id_oficina],
				comparador: ["FECHA_IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_verificar_informe_cierre",
				variable: "operacion"
			}
		});
		if (operacion.registros > 0) {
			var operacion_cierre = query({
				tabla: "NOVEDADES_OPERACION",
				campo: ["ID_OPERACION"],
				condicion: {
					condicion: true,
					campo: ["ID_OPERACION", "MOMENTO"],
					criterio: [operacion.datos[0].id_operacion, "CIERRE"],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_1_gs_verificar_informe_cierre",
					variable: "operacion_cierre"
				}
			});
			if (operacion_cierre.registros >= 1) {
				r.exito = true;
				r.mensaje = "Ya tiene un Informe de Cierre diligenciado para el día de hoy. Lo que se registre se añadirá al informe";
			}
		} else {
			r.exito = true;
			r.mensaje = "No se ha diligenciado el Formulario de Apertura del dia de hoy. Debe diligenciarla a fin de realizar el Informe de Cierre";
		}
		return r;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_oficina": id_oficina
			}
		};
		log_error("m2_1_gs_verificar_informe_cierre", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga el acta de apertura del dia
*
* @param   {number}  id_oficina  id de la oficina
*
* @return  {object}              objecto con el id de operacion y el acta
*/
function m2_gs_cargar_acta_apertura_informe_cierre(id_oficina) {
	try {
		var r = {
			contenido: '',
			id_operacion: ''
		}
		var fecha_actual = new Date();
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
			condicion: {
				condicion: true,
				campo: ["ID_PAC", "ACTIVO", "FECHA"],
				criterio: [id_oficina, 1, fecha_actual],
				comparador: ["IGUAL", "IGUAL", "FECHA_IGUAL"],
				operador: ["Y", "Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_gs_cargar_acta_apertura_informe_cierre",
				variable: "operacion"
			}
		});
		if (operacion.registros == 1) {
			r.id_operacion = operacion.datos[0].id_operacion;
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [operacion.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_gs_cargar_acta_apertura_informe_cierre",
					variable: "oficina"
				}
			});
			var fecha_acta = new Date(operacion.datos[0].fecha);
			r.contenido += '<p style="text-align: center;"><strong>ACTA DE APERTURA ' + oficina.datos[0].oficina + '</strong></p>';
			r.contenido += '<p style="text-align: center;">' + obtener_dia_semana(fecha_acta.getDay()) + ", " + fecha_acta.getDate() + " de " + obtener_mes(fecha_acta.getMonth() + 1).toLowerCase() + " de " + fecha_acta.getFullYear() + '</p>';
			r.contenido += '<br />';
			r.contenido += '<hr />';
			r.contenido += '<p><strong>SECCION 1:</strong>Checklitst Personal</p>';
			r.contenido += '<hr />';
			r.contenido += '<br />';
			r.contenido += '<p><strong>1.1 Personal disponible:</strong></p>';
			r.contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
			r.contenido += '<thead>';
			r.contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
			r.contenido += '<th style="text-align: center;">USUARIO</th>';
			r.contenido += '<th style="text-align: center;">NOMBRE</th>';
			r.contenido += '<th style="text-align: center;">CARGO</th>';
			r.contenido += '<th style="text-align: center;">DISPONIBILIDAD</th>';
			r.contenido += '<th style="text-align: center;">NOVEDAD PERSONAL</th>';
			r.contenido += '</tr>';
			r.contenido += '</thead>';
			var usuarios_novedades_personal = query({
				tabla: "NOVEDADES_PERSONAL",
				campo: ["ID_USUARIO", "DISPONIBILIDAD", "NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_OPERACION"],
					criterio: [operacion.datos[0].id_operacion],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_gs_cargar_acta_apertura_informe_cierre",
					variable: "usuarios_novedades_personal"
				}
			});
			var usuarios_correo = "";
			for (var j = 0; j < usuarios_novedades_personal.registros; j++) {
				r.contenido += '<tr>';
				var usuario_novedades = query({
					tabla: "USUARIO",
					campo: ["USUARIO", "NOMBRE", "CARGO", "CORREO"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [usuarios_novedades_personal.datos[j].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_gs_cargar_acta_apertura_informe_cierre",
						variable: "usuario_novedades"
					}
				});
				usuarios_correo += usuario_novedades.datos[0].correo + ",";
				r.contenido += '<td>' + usuario_novedades.datos[0].usuario + '</td>';
				r.contenido += '<td>' + usuario_novedades.datos[0].nombre + '</td>';
				r.contenido += '<td>' + usuario_novedades.datos[0].cargo + '</td>';
				r.contenido += '<td>' + usuarios_novedades_personal.datos[j].disponibilidad + '</td>';
				r.contenido += '<td>' + usuarios_novedades_personal.datos[j].novedad + '</td>';
				r.contenido += '</tr>';
			}
			r.contenido += '</tbody>';
			r.contenido += '</table>';
			r.contenido += '<br />';
			r.contenido += '<p><strong>1.2 Observaciones relacionadas con el personal:<br /></strong></p>';
			if (operacion.datos[0].observaciones_reunion === "") {
				r.contenido += '<p>sin novedades</p>'
			} else {
				r.contenido += '<p>' + operacion.datos[0].observaciones_personal + '</p>';
			}
			r.contenido += '<br />';
			r.contenido += '<br />';
			r.contenido += '<hr />';
			r.contenido += '<p><strong>SECCION 2:</strong> Checklist infraestructura / conectividad / equipos</p>';
			r.contenido += '<hr />';
			r.contenido += '<br />';
			r.contenido += '<p><strong>2.1 Observaciones relacionadas con infraestructura, conectividad y equipos:</strong></p>';
			var novedades_operacion = query({
				tabla: "NOVEDADES_OPERACION",
				campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_OPERACION"],
					criterio: [operacion.datos[0].id_operacion],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_gs_cargar_acta_apertura_informe_cierre",
					variable: "novedades_operacion"
				}
			});
			if (novedades_operacion.registros > 0) {
				r.contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
				r.contenido += '<thead>';
				r.contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
				r.contenido += '<th style="text-align: center;">MOMENTO</th>';
				r.contenido += '<th style="text-align: center;">TIPO NOVEDAD</th>';
				r.contenido += '<th style="text-align: center;">NOVEDAD</th>';
				r.contenido += '<th style="text-align: center;">INICIO NOVEDAD</th>';
				r.contenido += '<th style="text-align: center;">FIN NOVEDAD</th>';
				r.contenido += '</tr>';
				r.contenido += '</thead>';
				for (j = 0; j < novedades_operacion.registros; j++) {
					r.contenido += '<tr>';
					r.contenido += '<td>' + novedades_operacion.datos[j].momento + '</td>';
					r.contenido += '<td>' + novedades_operacion.datos[j].tipo_novedad + '</td>';
					r.contenido += '<td>' + novedades_operacion.datos[j].novedad + '</td>';
					if (novedades_operacion.datos[j].inicio_novedad == "") {
						r.contenido += '<td> - </td>';
					} else {
						r.contenido += '<td>' + fecha_texto(novedades_operacion.datos[j].inicio_novedad, "HORA_MINUTOS") + '</td>';
					}
					if (novedades_operacion.datos[j].fin_novedad == "") {
						r.contenido += '<td> - </td>';
					} else {
						r.contenido += '<td>' + fecha_texto(novedades_operacion.datos[j].fin_novedad, "HORA_MINUTOS") + '</td>';
					}
					r.contenido += '</tr>';
				}
				r.contenido += '</tbody>';
				r.contenido += '</table>';
			} else {
				r.contenido += '<p>sin novedades</p>'
			}
			r.contenido += '<br />';
			r.contenido += '<br />';
			r.contenido += '<hr />';
			r.contenido += '<p><strong>SECCION 3:</strong> Reuni&oacute;n de apertura</p>';
			r.contenido += '<hr />';
			r.contenido += '<br />';
			r.contenido += '<p><strong>3.1 Observaciones relacionadas con la reuni&oacute;n de apertura:</strong></p>';
			if (operacion.datos[0].observaciones_reunion === "") {
				r.contenido += '<p>sin novedades</p>'
			} else {
				r.contenido += '<p>' + operacion.datos[0].observaciones_reunion + '</p>';
			}
			r.contenido += '<br />';
			r.contenido += '<br />';
			r.contenido += '<hr />';
			r.contenido += '<p><strong>SECCION 4:</strong>Apertura en Bizagi</p>';
			r.contenido += '<hr />';
			r.contenido += '<br />';
			r.contenido += '<p><strong>4.1 Caso Bizagi de Apertura:</strong></p>';
			r.contenido += '<p>' + operacion.datos[0].bzg_apertura + '</p>';
			r.contenido += '<br />';
			r.contenido += '<br />';
			r.contenido += '<hr />';
		} else {
			r.contenido += '<div class="aviso_error"><p><strong>No hay reporte de diligenciamiento de Novedades en Apertura. <br />Recuerde que debe diligenciar un Formulario de Apertura para la jornada a fin de poder diligenciar el Informe de Cierre</strong></p></div>';
			r.contenido += '<hr />';
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_oficina": id_oficina
			}
		};
		log_error("m2_gs_cargar_acta_apertura_informe_cierre", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Guarda el informe de cierre
*
* @param   {object}  informe  objecto con todos los parametros del informe de cierre
*
* @return  {string}           mensaje de estado con los resultados de la operacion
*/
function m2_2_gs_registrar_informe(informe) {
	try {
		Logger.log(informe)
		var operacion_fallas = query({
			tabla: "NOVEDADES_OPERACION",
			campo: [],
			condicion: {
				condicion: 0,
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_registrar_acta",
				variable: "operacion_fallas"
			}
		});
		for (j = 0; j < informe.fallas_categoria.length; j++) {
			operacion_fallas.insercion({
				campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
				valor: [informe.id_operacion, "CIERRE", informe.fallas_categoria[j], informe.fallas_descripcion[j], informe.hora_inicio_novedad[j], informe.hora_fin_novedad[j]],
				index: false
			});
		}
		return "Los datos se almacenaron exitosamente";

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: informe
		};
		log_error("m2_2_gs_registrar_informe", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 3 - OPERACION OFICINAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* realiza la busqueda de la operacion de una oficina de acuerdo a un rango de fecha 	
*
* @param   {object}  param  objecto con los criterios de busqueda
*
* @return  {object}					objecto con la tabla de resultados de la busqueda
*/
function m2_3_gs_consultar_operacion_oficinas(param) {
	try {
		param.titulos = ["ID OPERACION", "CASO APERTURA", "OFICINA", "USUARIO", "FECHA", "HORA", ""];
		param.datos = [];
		var fecha_inicio = param.criterio.fecha_inicial.split("-");
		var fecha_fin = param.criterio.fecha_final.split("-");
		var f_inicio = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
		var f_fin = new Date(fecha_fin[0], fecha_fin[1] - 1, fecha_fin[2]);
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA"],
			condicion: {
				condicion: true,
				campo: ["FECHA", "FECHA", "ACTIVO"],
				criterio: [f_inicio, f_fin, 1],
				comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL"],
				operador: ["Y", "Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_3_gs_consultar_operacion_oficinas",
				variable: "operacion"
			}
		});
		if (verificar_acceso("0_1")) {
			for (var j = 0; j < operacion.registros; j++) {
				var oficinas = query({
					tabla: "OFICINA",
					campo: ["OFICINA", "ID_REGIONAL", "ID_OFICINA"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [operacion.datos[j].id_pac],
						comparador: ["IGUAL"],
						operador: []
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_3_gs_consultar_operacion_oficinas",
						variable: "oficinas"
					}
				});
				var fila = [];
				fila.push(operacion.datos[j].id_operacion);
				fila.push(operacion.datos[j].bzg_apertura);
				fila.push(oficinas.datos[0].oficina);
				var usuarios = query({
					tabla: "USUARIO",
					campo: ["NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [operacion.datos[j].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_3_gs_consultar_operacion_oficinas",
						variable: "usuarios"
					}
				});
				fila.push(usuarios.datos[0].nombre);
				fila.push(fecha_texto(operacion.datos[j].fecha, "FECHA"));
				fila.push(fecha_texto(operacion.datos[j].hora, "HORA"));
				fila.push('<a href="#m0_div_panel_secundario" id="m2_3_a_consultar_operacion_oficina" data-id_operacion="' + operacion.datos[j].id_operacion + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">visibility</i></a>');
				param.datos.push(fila);
			}
		} else {
			if (verificar_acceso("2_4")) {
				for (var j = 0; j < operacion.registros; j++) {
					var oficinas = query({
						tabla: "OFICINA",
						campo: ["OFICINA", "ID_REGIONAL", "ID_OFICINA"],
						condicion: {
							condicion: true,
							campo: ["ID_OFICINA"],
							criterio: [operacion.datos[j].id_pac],
							comparador: ["IGUAL"],
							operador: []
						},
						depuracion: {
							archivo: "m2_controlador",
							funcion: "m2_3_gs_consultar_operacion_oficinas",
							variable: "oficinas"
						}
					});
					if (param.criterio.id_regional == oficinas.datos[0].id_regional) {
						var fila = [];
						fila.push(operacion.datos[j].id_operacion);
						fila.push(operacion.datos[j].bzg_apertura);
						fila.push(oficinas.datos[0].oficina);
						var usuarios = query({
							tabla: "USUARIO",
							campo: ["NOMBRE"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [operacion.datos[j].id_usuario],
								comparador: ["IGUAL"],
								operador: []
							},
							depuracion: {
								archivo: "m2_controlador",
								funcion: "m2_3_gs_consultar_operacion_oficinas",
								variable: "usuarios"
							}
						});
						fila.push(usuarios.datos[0].nombre);
						fila.push(fecha_texto(operacion.datos[j].fecha, "FECHA"));
						fila.push(fecha_texto(operacion.datos[j].hora, "HORA"));
						fila.push('<a href="#m0_div_panel_secundario" id="m2_3_a_consultar_operacion_oficina" data-id_operacion="' + operacion.datos[j].id_operacion + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">visibility</i></a>');
						param.datos.push(fila);
					}
				}
			} else {
				if (verificar_acceso("2_3")) {
					for (var j = 0; j < operacion.registros; j++) {
						var oficinas = query({
							tabla: "OFICINA",
							campo: ["OFICINA", "ID_REGIONAL", "ID_OFICINA"],
							condicion: {
								condicion: true,
								campo: ["ID_OFICINA"],
								criterio: [operacion.datos[j].id_pac],
								comparador: ["IGUAL"],
								operador: []
							},
							depuracion: {
								archivo: "m2_controlador",
								funcion: "m2_3_gs_consultar_operacion_oficinas",
								variable: "oficinas"
							}
						});
						if (param.criterio.id_oficina == oficinas.datos[0].id_oficina) {
							var fila = [];
							fila.push(operacion.datos[j].id_operacion);
							fila.push(operacion.datos[j].bzg_apertura);
							fila.push(oficinas.datos[0].oficina);
							var usuarios = query({
								tabla: "USUARIO",
								campo: ["NOMBRE"],
								condicion: {
									condicion: true,
									campo: ["ID_USUARIO"],
									criterio: [operacion.datos[j].id_usuario],
									comparador: ["IGUAL"],
									operador: []
								},
								depuracion: {
									archivo: "m2_controlador",
									funcion: "m2_3_gs_consultar_operacion_oficinas",
									variable: "usuarios"
								}
							});
							fila.push(usuarios.datos[0].nombre);
							fila.push(fecha_texto(operacion.datos[j].fecha, "FECHA"));
							fila.push(fecha_texto(operacion.datos[j].hora, "HORA"));
							fila.push('<a href="#m0_div_panel_secundario" id="m2_3_a_consultar_operacion_oficina" data-id_operacion="' + operacion.datos[j].id_operacion + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">visibility</i></a>');
							param.datos.push(fila);
						}
					}
				}
			}
		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m2_3_gs_consultar_operacion_oficinas", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga la operacion de la oficina en el dia seleccionado
*
* @param   {number}  id_operacion  id operacion
*
* @return  {string}              	html con la operacion de la oficina
*/
function m2_3_gs_consultar_operacion_oficina_detalle(id_operacion) {
	try {
		var contenido = '<div class="div_panel mdl-shadow--3dp">';
		var operacion = query({
			tabla: "OPERACION_PAC",
			campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
			condicion: {
				condicion: true,
				campo: ["ID_OPERACION"],
				criterio: [id_operacion],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_3_gs_consultar_operacion_oficina_detalle",
				variable: "operacion"
			}
		});
		if (operacion.registros == 1) {
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [operacion.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_3_gs_consultar_operacion_oficina_detalle",
					variable: "oficina"
				}
			});
			var fecha_acta = new Date(operacion.datos[0].fecha);
			contenido += '<p style="text-align: center;"><strong>OPERACIÓN OFICINA - ' + oficina.datos[0].oficina + '</strong></p>';
			contenido += '<p style="text-align: center;">' + obtener_dia_semana(fecha_acta.getDay()) + ", " + fecha_acta.getDate() + " de " + obtener_mes(fecha_acta.getMonth() + 1).toLowerCase() + " de " + fecha_acta.getFullYear() + '</p>';
			contenido += '<br />';
			contenido += '<hr />';
			contenido += '<p><strong>SECCION 1:</strong>Checklitst Personal</p>';
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p><strong>1.1 Personal disponible:</strong></p>';
			contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
			contenido += '<thead>';
			contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
			contenido += '<th style="text-align: center;">USUARIO</th>';
			contenido += '<th style="text-align: center;">NOMBRE</th>';
			contenido += '<th style="text-align: center;">CARGO</th>';
			contenido += '<th style="text-align: center;">DISPONIBILIDAD</th>';
			contenido += '<th style="text-align: center;">NOVEDAD PERSONAL</th>';
			contenido += '</tr>';
			contenido += '</thead>';
			var usuarios_novedades_personal = query({
				tabla: "NOVEDADES_PERSONAL",
				campo: ["ID_USUARIO", "DISPONIBILIDAD", "NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_OPERACION"],
					criterio: [operacion.datos[0].id_operacion],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_3_gs_consultar_operacion_oficina_detalle",
					variable: "usuarios_novedades_personal"
				}
			});
			var usuarios_correo = "";
			for (var j = 0; j < usuarios_novedades_personal.registros; j++) {
				contenido += '<tr>';
				var usuario_novedades = query({
					tabla: "USUARIO",
					campo: ["USUARIO", "NOMBRE", "CARGO", "CORREO"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [usuarios_novedades_personal.datos[j].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_3_gs_consultar_operacion_oficina_detalle",
						variable: "usuario_novedades"
					}
				});
				usuarios_correo += usuario_novedades.datos[0].correo + ",";
				contenido += '<td>' + usuario_novedades.datos[0].usuario + '</td>';
				contenido += '<td>' + usuario_novedades.datos[0].nombre + '</td>';
				contenido += '<td>' + usuario_novedades.datos[0].cargo + '</td>';
				contenido += '<td>' + usuarios_novedades_personal.datos[j].disponibilidad + '</td>';
				contenido += '<td>' + usuarios_novedades_personal.datos[j].novedad + '</td>';
				contenido += '</tr>';
			}
			contenido += '</tbody>';
			contenido += '</table>';
			contenido += '<br />';
			contenido += '<p><strong>1.2 Observaciones relacionadas con el personal:<br /></strong></p>';
			if (operacion.datos[0].observaciones_reunion === "") {
				contenido += '<p>sin novedades</p>'
			} else {
				contenido += '<p>' + operacion.datos[0].observaciones_personal + '</p>';
			}
			contenido += '<br />';
			contenido += '<br />';
			contenido += '<hr />';
			contenido += '<p><strong>SECCION 2:</strong> Checklist infraestructura / conectividad / equipos</p>';
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p><strong>2.1 Observaciones relacionadas con infraestructura, conectividad y equipos:</strong></p>';
			var novedades_operacion = query({
				tabla: "NOVEDADES_OPERACION",
				campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
				condicion: {
					condicion: true,
					campo: ["ID_OPERACION"],
					criterio: [operacion.datos[0].id_operacion],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_3_gs_consultar_operacion_oficina_detalle",
					variable: "novedades_operacion"
				}
			});
			if (novedades_operacion.registros > 0) {
				contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
				contenido += '<thead>';
				contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
				contenido += '<th style="text-align: center;">MOMENTO</th>';
				contenido += '<th style="text-align: center;">TIPO NOVEDAD</th>';
				contenido += '<th style="text-align: center;">NOVEDAD</th>';
				contenido += '<th style="text-align: center;">INICIO NOVEDAD</th>';
				contenido += '<th style="text-align: center;">FIN NOVEDAD</th>';
				contenido += '</tr>';
				contenido += '</thead>';
				for (j = 0; j < novedades_operacion.registros; j++) {
					contenido += '<tr>';
					contenido += '<td>' + novedades_operacion.datos[j].momento + '</td>';
					contenido += '<td>' + novedades_operacion.datos[j].tipo_novedad + '</td>';
					contenido += '<td>' + novedades_operacion.datos[j].novedad + '</td>';
					if (novedades_operacion.datos[j].inicio_novedad == "") {
						r.contenido += '<td> - </td>';
					} else {
						r.contenido += '<td>' + fecha_texto(novedades_operacion.datos[j].inicio_novedad, "HORA_MINUTOS") + '</td>';
					}
					if (novedades_operacion.datos[j].fin_novedad == "") {
						r.contenido += '<td> - </td>';
					} else {
						r.contenido += '<td>' + fecha_texto(novedades_operacion.datos[j].fin_novedad, "HORA_MINUTOS") + '</td>';
					}
					contenido += '</tr>';
				}
				contenido += '</tbody>';
				contenido += '</table>';
			} else {
				contenido += '<p>sin novedades</p>'
			}
			contenido += '<br />';
			contenido += '<br />';
			contenido += '<hr />';
			contenido += '<p><strong>SECCION 3:</strong> Reuni&oacute;n de apertura</p>';
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p><strong>3.1 Observaciones relacionadas con la reuni&oacute;n de apertura:</strong></p>';
			if (operacion.datos[0].observaciones_reunion === "") {
				contenido += '<p>sin novedades</p>'
			} else {
				contenido += '<p>' + operacion.datos[0].observaciones_reunion + '</p>';
			}
			contenido += '<br />';
			contenido += '<br />';
			contenido += '<hr />';
			contenido += '<p><strong>SECCION 4:</strong>Apertura en Bizagi</p>';
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p><strong>4.1 Caso Bizagi de Apertura:</strong></p>';
			contenido += '<p>' + operacion.datos[0].bzg_apertura + '</p>';
			contenido += '<br />';
			contenido += '<br />';
			contenido += '<hr />';
		} else {
			contenido += '<p><strong>No hay reporte de diligenciamiento de Novedades en Apertura</strong></p>';
			contenido += '<hr />';
		}
		contenido += '</div>'
		return contenido;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_operacion": id_operacion
			}
		};
		log_error("m2_3_gs_consultar_operacion_oficina_detalle", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 4 - REPORTES MODULO APERTURA Y CIERRE
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* descripcion_funcion
*
* @param   {number}  id_regional  id de la regional activa
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m2_4_gs_cargar_reportes(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Reporte cargado exitosamente",
			contenido_a_c: '',
			contenido_n_o: '',
			contenido_n_p: '',
			contenido_b_d: '',
			contenido_s: ''
		}

		var reporte_a_c = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M2_APERTURA_CIERRE", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_a_c.registros > 0) {
			r.contenido_a_c += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m2_4_js_actualizar_reporte("M2_APERTURA_CIERRE")>';
			r.contenido_a_c += 'ACTUALIZAR INFORME >>';
			r.contenido_a_c += '</button>';
			r.contenido_a_c += '<hr />';
			r.contenido_a_c += '<br />';
			r.contenido_a_c += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_a_c.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_a_c += '<br />';
			r.contenido_a_c += 'Abrir <b>INFORME GENERAL APERTURA Y CIERRE</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_a_c.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_a_c += '<br />';
		} else {
			r.contenido_a_c += '<br />';
			r.contenido_a_c += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_a_c += '<br />';
		}

		var reporte_n_o = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M2_APERTURA_CIERRE_OPERACION", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_n_o.registros > 0) {
			r.contenido_n_o += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m2_4_js_actualizar_reporte("M2_APERTURA_CIERRE_OPERACION")>';
			r.contenido_n_o += 'ACTUALIZAR INFORME >>';
			r.contenido_n_o += '</button>';
			r.contenido_n_o += '<hr />';
			r.contenido_n_o += '<br />';
			r.contenido_n_o += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_n_o.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_n_o += '<br />';
			r.contenido_n_o += 'Abrir <b>INFORME DE NOVEDADES EN OPERACIÓN</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_n_o.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_n_o += '<br />';
		} else {
			r.contenido_n_o += '<br />';
			r.contenido_n_o += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_n_o += '<br />';
		}


		var reporte_n_p = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M2_APERTURA_CIERRE_PERSONAL", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_a_c.registros > 0) {
			r.contenido_n_p += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m2_4_js_actualizar_reporte("M2_APERTURA_CIERRE_PERSONAL")>';
			r.contenido_n_p += 'ACTUALIZAR INFORME >>';
			r.contenido_n_p += '</button>';
			r.contenido_n_p += '<hr />';
			r.contenido_n_p += '<br />';
			r.contenido_n_p += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_n_p.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_n_p += '<br />';
			r.contenido_n_p += 'Abrir <b>INFORME DE NOVEDADES EN PERSONAL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_n_p.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_n_p += '<br />';
		} else {
			r.contenido_n_p += '<br />';
			r.contenido_n_p += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_n_p += '<br />';
		}


		var reporte_b_d = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M2_APERTURA_CIERRE_BASE_DOCUMENTAL", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_b_d.registros > 0) {
			r.contenido_b_d += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m2_4_js_actualizar_reporte("M2_APERTURA_CIERRE_BASE_DOCUMENTAL")>';
			r.contenido_b_d += 'ACTUALIZAR INFORME >>';
			r.contenido_b_d += '</button>';
			r.contenido_b_d += '<hr />';
			r.contenido_b_d += '<br />';
			r.contenido_b_d += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_b_d.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_b_d += '<br />';
			r.contenido_b_d += 'Abrir <b>INFORME BASE DOCUMENTAL</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_b_d.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_b_d += '<br />';
		} else {
			r.contenido_b_d += '<br />';
			r.contenido_b_d += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_b_d += '<br />';
		}


		var reporte_s = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M2_APERTURA_CIERRE_SOCIALIZACIONES", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_a_c.registros > 0) {
			r.contenido_s += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m2_4_js_actualizar_reporte("M2_APERTURA_CIERRE_SOCIALIZACIONES")>';
			r.contenido_s += 'ACTUALIZAR INFORME >>';
			r.contenido_s += '</button>';
			r.contenido_s += '<hr />';
			r.contenido_s += '<br />';
			r.contenido_s += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_s.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_s += '<br />';
			r.contenido_s += 'Abrir <b>INFORME SOCIALIZACIONES</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_s.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_s += '<br />';
		} else {
			r.contenido_s += '<br />';
			r.contenido_s += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_s += '<br />';
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
		var id_error = log_error("m2_4_gs_cargar_reportes", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* Dependiendo del tipo de reporte se obtiene la info de la base y se envia de vuelta al front
*
* @param   {object}		param		Objecto con los parametros necesarios para seleccionar la data que se enviara al front para el procesamiento del reporte  
*
* @return  {object}       		Objeto con la info extraida de la base de datos
*/
function m2_4_gs_actualizar_reporte_paso_1(param) {
	try {

		param.exito = true,
			param.mensaje = "Base de datos descargada, por favor espere mientras se actualiza el informe"

		switch (param.reporte) {
			case "M2_APERTURA_CIERRE":

				var apertura_cierre = query({
					tabla: "OPERACION_PAC",
					campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
					condicion: {
						condicion: true,
						campo: ["ACTIVO"],
						criterio: [1],
						comparador: ["IGUAL"],
						operador: []
					},
					opciones: {
						formato_fecha: "FECHA_HORA_a_texto"
					}
				});
				param.apertura_cierre = apertura_cierre;
				var usuarios = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO", "NOMBRE"],
					condicion: {
						condicion: false
					}
				});
				param.usuarios = usuarios;
				var oficinas = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
					condicion: {
						condicion: false
					}
				});
				param.oficinas = oficinas;

				break;
			case "M2_APERTURA_CIERRE_OPERACION":

				var apertura_cierre = query({
					tabla: "OPERACION_PAC",
					campo: ["ID_OPERACION", "ID_PAC", "FECHA"],
					condicion: {
						condicion: true,
						campo: ["ACTIVO"],
						criterio: [1],
						comparador: ["IGUAL"],
						operador: []
					},
					opciones: {
						formato_fecha: "FECHA_a_texto"
					}
				});
				param.apertura_cierre = apertura_cierre;
				var oficinas = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
					condicion: {
						condicion: false
					}
				});
				param.oficinas = oficinas;
				var operacion = query({
					tabla: "NOVEDADES_OPERACION",
					campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
					condicion: {
						condicion: false
					},
					opciones: {
						formato_fecha: "HORA_MINUTOS_a_texto"
					}
				});
				param.operacion = operacion;

				break;
			case "M2_APERTURA_CIERRE_PERSONAL":

				var apertura_cierre = query({
					tabla: "OPERACION_PAC",
					campo: ["ID_OPERACION", "ID_PAC", "FECHA"],
					condicion: {
						condicion: true,
						campo: ["ACTIVO"],
						criterio: [1],
						comparador: ["IGUAL"],
						operador: []
					},
					opciones: {
						formato_fecha: "FECHA_a_texto"
					}
				});
				param.apertura_cierre = apertura_cierre;

				var usuarios = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO", "NOMBRE"],
					condicion: {
						condicion: false
					}
				});
				param.usuarios = usuarios;

				var oficinas = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
					condicion: {
						condicion: false
					}
				});
				param.oficinas = oficinas;

				var personal = query({
					tabla: "NOVEDADES_PERSONAL",
					campo: ["ID_OPERACION", "ID_USUARIO", "DISPONIBILIDAD", "NOVEDAD"],
					condicion: {
						condicion: false
					},
					opciones: {
						formato_fecha: "FECHA_a_texto"
					}
				});
				param.personal = personal;

				break;
			case "M2_APERTURA_CIERRE_BASE_DOCUMENTAL":
				var base_documental = query({
					tabla: "BASE_DOCUMENTAL",
					campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "ID_UPLOAD", "ACTIVO"],
					condicion: {
						condicion: false
					}
				});
				param.base_documental = base_documental;
				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "RUTA", "ID_OFICINA"],
					condicion: {
						condicion: false
					},
					opciones: {
						formato_fecha: "FECHA_a_texto"
					}
				});
				param.upload = upload;
				var oficinas = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
					condicion: {
						condicion: false
					}
				});
				param.oficinas = oficinas;
				var usuarios = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO", "NOMBRE"],
					condicion: {
						condicion: false
					}
				});
				param.usuarios = usuarios;

				break;
			case "M2_APERTURA_CIERRE_SOCIALIZACIONES":
				var socializaciones = query({
					tabla: "BASE_SOCIALIZACION",
					campo: ["ID_DOCUMENTO", "ID_OFICINA", "ID_UPLOAD", "OBSERVACION", "ACTIVO"],
					condicion: {
						condicion: true,
						campo: ["ACTIVO"],
						criterio: [1],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				param.socializaciones = socializaciones;

				var base_documental = query({
					tabla: "BASE_DOCUMENTAL",
					campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "ID_UPLOAD", "ACTIVO", "REQUIERE_SOPORTE"],
					condicion: {
						condicion: false
					}
				});

				param.base_documental = base_documental;

				var upload = query({
					tabla: "INDEX_UPLOAD",
					campo: ["ID_UPLOAD", "FECHA", "RUTA", "ID_REGIONAL"],
					condicion: {
						condicion: false,
					},
					opciones: {
						formato_fecha: "FECHA_a_texto"
					}
				});
				param.upload = upload;

				var oficinas = query({
					tabla: "OFICINA",
					campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
					condicion: {
						condicion: true,
						campo: ["ID_REGIONAL"],
						criterio: [param.id_regional],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				param.oficinas = oficinas;

				break;
		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		var id_error = log_error("m2_4_gs_actualizar_reporte_paso_1", param, e);
		param.exito = false;
		param.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* Guarda las operaciones realizadas en el front en el reporte a publicar
*
* @param   {object}  param  objecto con la matriz de datos para montar en el reporte
*
* @return  {object}       	objecto con los resultados de la operacion
*/
function m2_4_gs_actualizar_reporte_paso_2(param) {
	try {

		var r = {
			exito: true,
			mensaje: "El informe se ha actualizado correctamente"
		}
		var u = usuario();
		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: [param.reporte, u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("17xdkvdIH3WO85LT3vKTXB2Bi21aemWDo");
		var copia = file.makeCopy("REPORTE " + param.reporte + " - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		if (param.data.length != 0) {

			var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName(param.reporte);
			hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
			hoja_informe.getRange(2, 1, param.data.length, param.data[0].length).setValues(param.data);

			var index_reporte = query({
				tabla: "INDEX_REPORTE",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["REPORTE", "ID_MODULO"],
					criterio: [param.reporte, 2],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_4_gs_actualizar_reporte_paso_2",
					variable: "index_reporte"
				}
			});
			if (index_reporte.registros > 0) {
				index_reporte.edicion({
					campo: ["ACTIVO"],
					valor: [0]
				});
			}

			index_reporte.insercion({
				campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
				valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, param.reporte, 2, 1, copia.getId()],
				index: true
			});
		} else {
			r.mensaje = "Reporte vacío";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m2_4_gs_actualizar_reporte_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 5 - ADMINISTRACION BASE DOCUMENTAL
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* muestra informacion de base documental en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m2_5_gs_b_d_consulta(param_tabla) {
	try {

		param_tabla.titulos = ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "PUBLICADO POR", "FECHA PUBLICACIÓN", "VIGENTE", "ARCHIVAR / DESARCHIVAR", "REQUIERE SOPORTE SOCIALIZACIÓN", "DESCARGAR"];
		param_tabla.datos = [];
		var fecha_inicio = param_tabla.criterio.fecha_inicial.split("-");
		var fecha_fin = param_tabla.criterio.fecha_final.split("-");
		var f_inicio = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
		var f_fin = new Date(fecha_fin[0], fecha_fin[1] - 1, fecha_fin[2]);

		var upload = query({
			tabla: "INDEX_UPLOAD",
			campo: ["FECHA", "RUTA", "ID_USUARIO", "ID_UPLOAD"],
			condicion: {
				condicion: true,
				campo: ["FECHA", "FECHA", "ID_REGIONAL", "ID_MODULO"],
				criterio: [f_inicio, f_fin, param_tabla.criterio.id_regional, 2],
				comparador: ["FECHA_MAYOR_IGUAL", "FECHA_MENOR_IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y", "Y"]
			}
		});
		for (var j = 0; j < upload.registros; j++) {

			var fila = [];
			var base_documental = query({
				tabla: "BASE_DOCUMENTAL",
				campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "ID_UPLOAD", "ACTIVO", "REQUIERE_SOPORTE"],
				condicion: {
					condicion: true,
					campo: ["ID_UPLOAD"],
					criterio: [upload.datos[j].id_upload],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			if (base_documental.registros > 0) {
				fila.push(base_documental.datos[0].id_documento);
				fila.push(base_documental.datos[0].documento);
				fila.push(base_documental.datos[0].descripcion);
				fila.push(base_documental.datos[0].fuente);
				var usuarios = query({
					tabla: "USUARIO",
					campo: ["NOMBRE"],
					condicion: {
						condicion: true,
						campo: ["ID_USUARIO"],
						criterio: [upload.datos[j].id_usuario],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				fila.push(usuarios.datos[0].nombre);
				fila.push(fecha_texto(upload.datos[j].fecha, "FECHA"));
				if (base_documental.datos[0].activo == 0) {
					fila.push("NO");
					fila.push('<a href="#" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m2_5_js_b_d_archivar_documento(' + base_documental.datos[0].id_documento + ')><i class="material-icons">unarchive</i></a>');
				} else {
					fila.push("SI")
					fila.push('<a href="#" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick=m2_5_js_b_d_archivar_documento(' + base_documental.datos[0].id_documento + ')><i class="material-icons">archive</i></a>');
				}
				if (base_documental.datos[0].requiere_soporte == 0) {
					fila.push("NO");
				} else {
					fila.push("SI");
				}
				fila.push('<a href="' + upload.datos[j].ruta + '" target="_blank" ><i class="material-icons">cloud_download</i></a>')
				param_tabla.datos.push(fila);
			}
		}

		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m2_5_gs_b_d_consulta", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Carga la evidencia de socializacion a la base de datos
*
* @param   {object}  frm  formulario con los datos que se van a guardar en el back
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m2_5_gs_b_d_documento(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se guardaron exitosamente"
		}

		var u = usuario();
		var ruta_folder = query({
			tabla: "MODULO_UPLOAD",
			campo: ["RUTA_FOLDER"],
			condicion: {
				condicion: true,
				campo: ["ID_MODULO"],
				criterio: [2],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var folder = DriveApp.getFolderById(ruta_folder.datos[0].ruta_folder);
		var soporte = folder.createFile(frm.m2_5_file_b_d_documento_carga)

		var upload = query({
			tabla: "INDEX_UPLOAD",
			campo: [],
			condicion: {
				condicion: 0,
			}
		});

		var res = upload.insercion({
			campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "NOMBRE_ARCHIVO", "ID_MODULO", "RUTA"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, frm.FILE_TEXT_ID, 2, soporte.getUrl()],
			index: true
		})

		var base_documental = query({
			tabla: "BASE_DOCUMENTAL",
			campo: [],
			condicion: {
				condicion: 0
			}
		});

		var soporte = 0;
		if (frm.m2_5_chk_documento_requerido === "SI") {
			soporte = 1;
		}

		base_documental.insercion({
			campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "ID_UPLOAD", "ACTIVO", "REQUIERE_SOPORTE"],
			valor: ["", frm.m2_5_txt_b_d_documento, frm.m2_5_txt_b_d_documento_descripcion, frm.m2_5_txt_b_d_documento_fuente, res.id, 1, soporte],
			index: true
		})

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m2_5_gs_b_d_documento", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Funcion para inactivar documentos
*
* @param   {object}  id_documento  id del documento
*
* @return  {null}
*/
function m2_5_gs_b_d_archivar_documento(id_documento) {
	try {

		var r = {
			exito: true,
			mensaje: "Se cambio el estado al elemento exitosamente"
		}

		var base_documental = query({
			tabla: "BASE_DOCUMENTAL",
			campo: ["ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_DOCUMENTO"],
				criterio: [id_documento],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		if (base_documental.datos[0].activo == 1) {
			base_documental.edicion({
				campo: ["ACTIVO"],
				valor: [0]
			})
		} else {
			base_documental.edicion({
				campo: ["ACTIVO"],
				valor: [1]
			})
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_documento": id_documento
			}
		};
		var id_error = log_error("m2_5_gs_b_d_archivar_documento", param, e);
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
* funcion para el envio del informe diario consolidado de diligenciamiento de Acta de Apertura
*
* @return  {null}
*/
function m2_1_gs_enviar_informe_consolidado_apertura_mail() {
	try {
		var fecha_actual = new Date();
		var sw_informe = false;
		var usuario_correo;
		var contenido;
		var contenido_novedades_personal;
		var contenido_novedades_operacion;
		var sw_envio_correo;
		var base_usuario_correo = query({
			tabla: "USUARIO",
			campo: ["CORREO", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ROL", "ROL", "ROL", "ROL", "ROL", "ROL", "ACTIVO"],
				criterio: ["REGIONAL / ASEGURAMIENTO DE LA CALIDAD", "REGIONAL / LÍDER FRENTE DE ACCIÓN", "REGIONAL / DIRECTOR", "REGIONAL / INTEGRACIÓN OPERATIVA", "REGIONAL / ANALISTA", "REGIONAL / ADMINISTRATIVA Y TALENTO HUMANO", 1],
				comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL"],
				operador: ["O", "O", "O", "O", "O", "Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_enviar_informe_consolidado_apertura_mail",
				variable: "usuario_correo"
			}
		});

		var regional = query({
			tabla: "REGIONAL",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_enviar_informe_consolidado_apertura_mail",
				variable: "regional"
			}
		});
		for (var j_regional = 0; j_regional < regional.registros; j_regional++) {
			sw_envio_correo = false;
			usuario_correo = "";
			contenido = '';
			contenido += '<p>Cordial Saludo,</p>';
			contenido += '<p>A trav&eacute;s del presente correo se le env&iacute;a el Consolidado diario de diligenciamiento del Formulario de Apertura, Regional ' + regional.datos[j_regional].regional + ':</p>';
			contenido += '<br />';
			contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
			contenido += '<thead>';
			contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
			contenido += '<th style="text-align: center;">OFICINA</th>';
			contenido += '<th style="text-align: center;">RESPONSABLE APERTURA</th>';
			contenido += '<th style="text-align: center;">CASO BIZAGI</th>';
			contenido += '<th style="text-align: center;">NOVEDADES PERSONAL (Solo NO Disponibles)</th>';
			contenido += '<th style="text-align: center;">OBSERVACIONES PERSONAL</th>';
			contenido += '<th style="text-align: center;">NOVEDADES OPERACIÓN</th>';
			contenido += '<th style="text-align: center;">TEMAS DEL BANCO DE CONOCIMIENTO SOCIALIZADOS</th>';
			contenido += '<th style="text-align: center;">OBSERVACIONES GENERALES REUNIÓN</th>';
			contenido += '</tr>';
			contenido += '</thead>';
			contenido = contenido + '<tbody>';
			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA", "OFICINA", "TIPO_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ACTIVO", "ID_REGIONAL"],
					criterio: [1, regional.datos[j_regional].id_regional],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});

			for (var j_oficina = 0; j_oficina < oficina.registros; j_oficina++) {

				for (var t = 0; t < base_usuario_correo.registros; t++) {
					if (base_usuario_correo.datos[t].id_oficina === oficina.datos[j_oficina].id_oficina) {
						usuario_correo += base_usuario_correo.datos[t].correo + ",";
					}
				}

				if (oficina.datos[j_oficina].tipo_oficina !== "ADMINISTRATIVA REGIONAL" && oficina.datos[j_oficina].tipo_oficina !== "ADMINISTRATIVA NIVEL CENTRAL" && oficina.datos[j_oficina].tipo_oficina !== "PA EXCLUIDO CONTROL DE APERTURA") {
					contenido += '<tr>';
					contenido += '<td>' + oficina.datos[j_oficina].oficina + '</td>';
					var operacion = query({
						tabla: "OPERACION_PAC",
						campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
						condicion: {
							condicion: true,
							campo: ["FECHA", "ACTIVO", "ID_PAC"],
							criterio: [fecha_actual, 1, oficina.datos[j_oficina].id_oficina],
							comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y"]
						},
						depuracion: {
							archivo: "m2_controlador",
							funcion: "m2_1_gs_enviar_informe_consolidado_apertura_mail",
							variable: "operacion"
						}
					});

					if (operacion.registros == 1) {
						sw_envio_correo = true;
						var usuario_apertura = query({
							tabla: "USUARIO",
							campo: ["USUARIO"],
							condicion: {
								condicion: true,
								campo: ["ID_USUARIO"],
								criterio: [operacion.datos[0].id_usuario],
								comparador: ["IGUAL"],
								operador: []
							}
						});
						contenido += '<td>' + usuario_apertura.datos[0].usuario + '</td>';
						contenido += '<td>' + operacion.datos[0].bzg_apertura + '</td>';
						var contenido_novedades_personal = '';
						var usuarios_novedades_personal = query({
							tabla: "NOVEDADES_PERSONAL",
							campo: ["ID_USUARIO", "NOVEDAD"],
							condicion: {
								condicion: true,
								campo: ["ID_OPERACION", "DISPONIBILIDAD"],
								criterio: [operacion.datos[0].id_operacion, 0],
								comparador: ["IGUAL", "IGUAL"],
								operador: ["Y"]
							}
						});
						if (usuarios_novedades_personal.registros > 0) {
							contenido_novedades_personal += '<dl>';
							for (var j = 0; j < usuarios_novedades_personal.registros; j++) {
								var usuario_novedades = query({
									tabla: "USUARIO",
									campo: ["USUARIO", "ROL"],
									condicion: {
										condicion: true,
										campo: ["ID_USUARIO"],
										criterio: [usuarios_novedades_personal.datos[j].id_usuario],
										comparador: ["IGUAL"],
										operador: []
									}
								});
								contenido_novedades_personal += '<dt><b>-' + usuario_novedades.datos[0].usuario + ':</b></dt>';
								contenido_novedades_personal += '<dd>(' + usuario_novedades.datos[0].rol + ") " + usuarios_novedades_personal.datos[j].novedad + '<dd></br>';
							}
							contenido_novedades_personal += '</dl>';
							contenido += '<td>' + contenido_novedades_personal + '</td>';
						} else {
							contenido += '<td> - </td>';
						}
						contenido += '<td>' + operacion.datos[0].observaciones_personal + '</td>';

						var contenido_novedades_operacion = '';
						var novedades_operacion = query({
							tabla: "NOVEDADES_OPERACION",
							campo: ["TIPO_NOVEDAD", "NOVEDAD"],
							condicion: {
								condicion: true,
								campo: ["ID_OPERACION", "MOMENTO"],
								criterio: [operacion.datos[0].id_operacion, "APERTURA"],
								comparador: ["IGUAL", "IGUAL"],
								operador: ["Y"]
							}
						});
						if (novedades_operacion.registros > 0) {
							contenido_novedades_operacion += '<dl>';
							for (var i = 0; i < novedades_operacion.registros; i++) {
								contenido_novedades_operacion += '<dt><b>-' + novedades_operacion.datos[i].tipo_novedad + ':</b></dt>';
								contenido_novedades_operacion += '<dd>' + novedades_operacion.datos[i].novedad + '<dd></br>';
							}
							contenido_novedades_operacion += '</dl>';
							contenido += '<td>' + contenido_novedades_operacion + '</td>';
						} else {
							contenido += '<td> - </td>';
						}

						var contenido_socializaciones = '';
						var socializaciones = query({
							tabla: "BASE_SOCIALIZACION",
							campo: ["ID_DOCUMENTO", "OBSERVACION"],
							condicion: {
								condicion: true,
								campo: ["ID_OPERACION", "ACTIVO"],
								criterio: [operacion.datos[0].id_operacion, 1],
								comparador: ["IGUAL", "IGUAL"],
								operador: ["Y"]
							}
						});
						if (socializaciones.registros > 0) {
							contenido_socializaciones += '<dl>';
							for (var k = 0; k < socializaciones.registros; k++) {
								var documento = query({
									tabla: "BASE_DOCUMENTAL",
									campo: ["DOCUMENTO"],
									condicion: {
										condicion: true,
										campo: ["ID_DOCUMENTO"],
										criterio: [socializaciones.datos[k].id_documento],
										comparador: ["IGUAL"],
										operador: []
									}
								});
								contenido_socializaciones += '<dt><b>-' + documento.datos[0].documento + ':</b></dt>';
								contenido_socializaciones += '<dd>' + socializaciones.datos[k].observacion + '<dd></br>';
							}
							contenido_socializaciones += '</dl>';
							contenido += '<td>' + contenido_socializaciones + '</td>';
						} else {
							contenido += '<td> - </td>';
						}
						contenido += '<td>' + operacion.datos[0].observaciones_reunion + '</td>';

					} else {
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '<td> - </td>';
						contenido += '</tr>';
					}
				}
			}
			contenido = contenido + '</tbody>';
			contenido = contenido + '</table>';
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p>La fecha y hora de corte del reporte es : <strong>' + fecha_actual.getFullYear() + '/' + addZero(fecha_actual.getMonth() + 1) + '/' + addZero(fecha_actual.getDate()) + ' ' + addZero(fecha_actual.getHours()) + ':' + addZero(fecha_actual.getMinutes()) + ':' + addZero(fecha_actual.getSeconds()); + '</strong></p>';
			contenido += '<p>&nbsp;</p>';
			contenido += '<pre><q>Este es un correo generado automaticamente a traves de <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbxyfpofr_hWvtekW7ow7uknFWU1Jutrqn2t1gCa4VSSDHSSAuQ/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';
			if (sw_envio_correo && usuario_correo !== "") {
				MailApp.sendEmail({
					to: usuario_correo,
					subject: "Consolidado Novedades de Apertura Regional " + regional.datos[j_regional].regional + " (" + fecha_actual.getFullYear() + "/" + addZero(fecha_actual.getMonth() + 1) + "/" + addZero(fecha_actual.getDate()) + ")",
					htmlBody: contenido,
					noReply: true
				});
			}
		}
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m2_1_gs_enviar_informe_consolidado_apertura_mail", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
* funcion para el envio del informe diario consolidado de diligenciamiento de Informe de Cierre
*
* @return  {null}
*/
function m2_1_gs_enviar_informe_consolidado_cierre_mail() {
	try {
		var fecha_actual = new Date();
		var sw_informe = false;
		var regional = query({
			tabla: "REGIONAL",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_enviar_informe_consolidado_cierre_mail",
				variable: "regional"
			}
		});
		var base_usuario_correo = query({
			tabla: "USUARIO",
			campo: ["CORREO", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ROL", "ROL", "ROL", "ROL", "ROL", "ACTIVO"],
				criterio: ["REGIONAL / ASEGURAMIENTO DE LA CALIDAD", "REGIONAL / LÍDER FRENTE DE ACCIÓN", "REGIONAL / DIRECTOR", "REGIONAL / INTEGRACIÓN OPERATIVA", "REGIONAL / ANALISTA", 1],
				comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL"],
				operador: ["O", "O", "O", "O", "Y"]
			},
			depuracion: {
				archivo: "m2_controlador",
				funcion: "m2_1_gs_enviar_informe_consolidado_cierre_mail",
				variable: "usuario_correo"
			}
		});
		for (var j_regional = 0; j_regional < regional.registros; j_regional++) {

			var contenido = '';
			contenido += '<p>Cordial Saludo,</p>';
			contenido += '<p>A trav&eacute;s del presente correo se le env&iacute;a el Consolidado diario de diligenciamiento del Formulario de Apertura, Regional ' + regional.datos[j_regional].regional + ':</p>';
			contenido += '<br />';
			contenido += '<hr />';
			contenido += '<hr />';
			var usuario_correo = "";
			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA", "OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ACTIVO", "ID_REGIONAL", "TIPO_OFICINA", "TIPO_OFICINA"],
					criterio: [1, regional.datos[j_regional].id_regional, "ADMINISTRATIVA REGIONAL", "ADMINISTRATIVA NIVEL CENTRAL"],
					comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y", "Y"]
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_1_gs_enviar_informe_consolidado_cierre_mail",
					variable: "oficina"
				}
			});
			for (var j_oficina = 0; j_oficina < oficina.registros; j_oficina++) {
				var operacion = query({
					tabla: "OPERACION_PAC",
					campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
					condicion: {
						condicion: true,
						campo: ["FECHA", "ACTIVO", "ID_PAC"],
						criterio: [fecha_actual, 1, oficina.datos[j_oficina].id_oficina],
						comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_1_gs_enviar_informe_consolidado_cierre_mail",
						variable: "operacion"
					}
				});
				contenido += '<p><strong>APERTURA ' + oficina.datos[j_oficina].oficina + '</strong></p>';
				contenido += '<br />';
				if (operacion.registros == 1) {
					for (var t = 0; t < base_usuario_correo.registros; t++) {
						if (base_usuario_correo.datos[t].id_oficina === oficina.datos[j_oficina].id_oficina) {
							usuario_correo += base_usuario_correo.datos[t].correo + ",";
						}
					}
					contenido += '<p><strong>Checklist infraestructura / conectividad / equipos</strong></p>';
					var novedades_operacion = query({
						tabla: "NOVEDADES_OPERACION",
						campo: ["ID_OPERACION", "TIPO_NOVEDAD", "NOVEDAD"],
						condicion: {
							condicion: true,
							campo: ["ID_OPERACION", "MOMENTO"],
							criterio: [operacion.datos[0].id_operacion, "CIERRE"],
							comparador: ["IGUAL", "IGUAL"],
							operador: ["Y"]
						},
						depuracion: {
							archivo: "m2_controlador",
							funcion: "m2_1_gs_enviar_informe_consolidado_cierre_mail",
							variable: "novedades_operacion"
						}
					});
					if (novedades_operacion.registros > 0) {
						contenido += '<table  width="100%" style="border-color: #b7b7b7; margin-left: auto; margin-right: auto;" border="1" cellspacing="1" cellpadding="4">';
						contenido += '<thead>';
						contenido += '<tr style="text-align: center; background-color: #d4e1f7;">';
						contenido += '<th style="text-align: center;">TIPO NOVEDAD</th>';
						contenido += '<th style="text-align: center;">NOVEDAD</th>';
						contenido += '</tr>';
						contenido += '</thead>';
						for (j = 0; j < novedades_operacion.registros; j++) {
							contenido += '<tr>';
							contenido += '<td>' + novedades_operacion.datos[j].tipo_novedad + '</td>';
							contenido += '<td>' + novedades_operacion.datos[j].novedad + '</td>';
							contenido += '</tr>';
						}
						contenido += '</tbody>';
						contenido += '</table>';
					} else {
						contenido += '<p>sin novedades</p>'
					}
					contenido += '<hr />';
				} else {
					contenido += '<p><strong>No hay reporte de diligenciamiento de Informe de Cierre</strong></p>';
					contenido += '<hr />';
				}
			}
			contenido += '<hr />';
			contenido += '<br />';
			contenido += '<p>La fecha y hora de corte del reporte es : <strong>' + fecha_actual.getFullYear() + '/' + addZero(fecha_actual.getMonth() + 1) + '/' + addZero(fecha_actual.getDate()) + ' ' + addZero(fecha_actual.getHours()) + ':' + addZero(fecha_actual.getMinutes()) + ':' + addZero(fecha_actual.getSeconds()); + '</strong></p>';
			contenido += '<p>&nbsp;</p>';
			contenido += '<pre><q>Este es un correo generado automaticamente a traves de <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbxyfpofr_hWvtekW7ow7uknFWU1Jutrqn2t1gCa4VSSDHSSAuQ/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';
			if (usuario_correo !== "") {
				MailApp.sendEmail({
					to: usuario_correo,
					subject: "Consolidado Informe de Cierre Regional " + regional.datos[j_regional].regional + " (" + fecha_actual.getFullYear() + "/" + addZero(fecha_actual.getMonth() + 1) + "/" + addZero(fecha_actual.getDate()) + ")",
					htmlBody: contenido,
					noReply: true
				});
			}
		}
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m2_1_gs_enviar_informe_consolidado_cierre_mail", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion generica par el envio de correo a los jefes acerca de documentos de la base de conocimientos para ser socializados
 *
 */
function m2_5_gs_b_d_aviso_diario() {
	try {

		var fecha_actual = new Date();

		var regional = query({
			tabla: "REGIONAL",
			campo: ["ID_REGIONAL"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		for (var j_regional = 0; j_regional < regional.registros; j_regional++) {

			var documentos = query({
				tabla: "INDEX_UPLOAD",
				campo: ["ID_UPLOAD", "FECHA", "ID_USUARIO", "ID_OFICINA", "NOMBRE_ARCHIVO", "RUTA"],
				condicion: {
					condicion: true,
					campo: ["ID_MODULO", "ID_REGIONAL", "FECHA"],
					criterio: [2, regional.datos[j_regional].id_regional, fecha_actual],
					comparador: ["IGUAL", "IGUAL", "FECHA_IGUAL"],
					operador: ["Y", "Y"]
				}
			});

			var contenido = '';
			var soc;
			for (var j_documentos = 0; j_documentos < documentos.registros; j_documentos++) {
				var info_documento = query({
					tabla: "BASE_DOCUMENTAL",
					campo: ["ID_DOCUMENTO", "DOCUMENTO", "DESCRIPCION", "FUENTE", "REQUIERE_SOPORTE"],
					condicion: {
						condicion: true,
						campo: ["ID_UPLOAD", "ACTIVO"],
						criterio: [documentos.datos[j_documentos].id_upload, 1],
						comparador: ["IGUAL", "IGUAL"],
						operador: ["Y"]
					}
				});
				if (info_documento.registros == 1) {
					contenido += '<ul>';
					contenido += '<li><strong>Titulo:</strong> ' + info_documento.datos[0].documento + '</li>';
					contenido += '<li><strong>Descripci&oacute;n:</strong> ' + info_documento.datos[0].descripcion + '</li>';
					contenido += '<li><strong>Fuente:</strong> ' + info_documento.datos[0].fuente + '</li>';
					soc = "NO"
					if (info_documento.datos[0].requiere_soporte == 1) {
						soc = "SI";
					}
					contenido += '<li><strong>Requiere planilla de socializaci&oacute;n:</strong> ' + soc + '</li>';
					contenido += '<li><strong>Link descarga:</strong> ' + documentos.datos[j_documentos].ruta + '</li>';
					var usuario = query({
						tabla: "USUARIO",
						campo: ["NOMBRE"],
						condicion: {
							condicion: true,
							campo: ["ID_USUARIO"],
							criterio: [documentos.datos[j_documentos].id_usuario],
							comparador: ["IGUAL"],
							operador: []
						}
					});
					contenido += '<li><strong>Funcionario responsable ingreso:</strong> ' + usuario.datos[0].nombre + '</li>';
					contenido += "</ul>";
					contenido += "<p><strong>--</strong></p>";
				}
			}

			var param = {
				sender: "APP",
				usuarios: [],
				asunto: "Aviso de nuevos Documentos cargados al Banco de Conocimientos para su socialización",
				contenido: contenido,
				id_modulo: 2
			}

			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL"],
					criterio: [regional.datos[j_regional].id_regional],
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
						campo: ["ID_OFICINA", "ACTIVO", "ROL"],
						criterio: [oficina.datos[j_oficinas].id_oficina, 1, "PAC / LIDER PAC"],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});

				for (var j_usuario = 0; j_usuario < usuarios_correo.registros; j_usuario++) {
					param.usuarios.push(usuarios_correo.datos[j_usuario].id_usuario);
				}

			}
			if (param.contenido !== '') {
				generador_de_correo(param)
			}


		}

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m2_5_gs_b_d_aviso_diario", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para el envio del reporte semanal de encendido de planta 
*
* @return  {null}
*/
function m2_1_gs_enviar_informe_consolidado_encendido_planta() {
	try {
		var fecha_lunes = new Date();
		fecha_lunes.setDate(fecha_lunes.getDate() - 3)
		var fecha_actual = new Date()

		var sw_envio_correo;

		var oficina = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [0, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});


		for (var j_oficina = 0; j_oficina < oficina.registros; j_oficina++) {

			sw_envio_correo = true;

			var operacion = query({
				tabla: "OPERACION_PAC",
				campo: ["ID_OPERACION"],
				condicion: {
					condicion: true,
					campo: ["FECHA", "ACTIVO", "ID_PAC"],
					criterio: [fecha_lunes, 1, oficina.datos[j_oficina].id_oficina],
					comparador: ["FECHA_MAYOR_IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				},
				depuracion: {
					archivo: "m2_controlador",
					funcion: "m2_1_gs_enviar_informe_consolidado_encendido_planta",
					variable: "operacion"
				}
			});

			for (var j_operacion = 0; j_operacion < operacion.registros; j_operacion++) {

				var novedades_operacion = query({
					tabla: "NOVEDADES_OPERACION",
					campo: ["ID_OPERACION", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
					condicion: {
						condicion: true,
						campo: ["ID_OPERACION", "TIPO_NOVEDAD"],
						criterio: [operacion.datos[j_operacion].id_operacion, "Checkeo semanal funcionamiento Planta (Solo Informe de Cierre)"],
						comparador: ["IGUAL", "IGUAL"],
						operador: ["Y"]
					},
					depuracion: {
						archivo: "m2_controlador",
						funcion: "m2_1_gs_enviar_informe_consolidado_encendido_planta",
						variable: "novedades_operacion"
					}
				});

				if (novedades_operacion.registros > 0) {
					sw_envio_correo = false;
				}

			}

			if (sw_envio_correo) {

				var contenido;

				contenido = "<p>A trav&eacute;s de la presente se le recuerda la realizaci&oacute;n y posterior registro, de la actividad de encendido de plantas.</p>"
				contenido += "<p>El corte de la informaci&oacute;n semanal se realiza los viernes, por favor realizar esta actividad antes de esa fecha.</p>"
				contenido += "<p>Muchas gracias</p>"

				var param = {
					sender: "APP",
					usuarios: [],
					asunto: "Recordatorio de encendido de planta ",
					contenido: contenido,
					id_modulo: 2
				}

				var usuarios_correo = query({
					tabla: "USUARIO",
					campo: ["ID_USUARIO"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA", "ACTIVO", "ROL"],
						criterio: [oficina.datos[j_oficina].id_oficina, 1, "PAC / LIDER PAC"],
						comparador: ["IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					}
				});

				for (var j_usuario = 0; j_usuario < usuarios_correo.registros; j_usuario++) {
					param.usuarios.push(usuarios_correo.datos[j_usuario].id_usuario);
				}

				param.contenido = contenido;
				generador_de_correo(param);
			}
		}

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m2_1_gs_enviar_informe_consolidado_encendido_planta", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Genera el reporte nacional de novedades operativas
*
*/
function m2_1_gs_actualizar_reporte_novedades_operativas() {

	var oficinas_digiturno = [
		"PAA Envigado",
		"PAA Medellín Centroccidental",
		"PAA Medellín Norte",
		"PAA Medellín Sur",
		"PAB Quibdó",
		"PAB Rionegro",
		"PAC Apartadó",
		"PAA Bogotá Sur",
		"PAA Calle 94",
		"PAA Chapinero",
		"PAA Prado",
		"PAA Salitre",
		"PAA Teusaquillo",
		"PAA Barranquilla Centro",
		"PAA Barranquilla Norte",
		"PAA Cartagena",
		"PAB Montería",
		"PAB Riohacha",
		"PAB San Andres",
		"PAB Santa Marta",
		"PAB Sincelejo",
		"PAB Valledupar",
		"PAE CIS Cartagena",
		"PAA Tunja",
		"PAA Villavicencio",
		"PAB Duitama",
		"PAB Facatativá",
		"PAB Florencia",
		"PAB Soacha",
		"PAB Sogamoso",
		"PAB Yopal",
		"PAB Zipaquirá",
		"PAC Arauca",
		"PAC Leticia",
		"PAC Mocoa",
		"PAE Mitú",
		"PAE Puerto Carreño",
		"PAE Puerto Inírida",
		"PAE San José Del Guaviare",
		"Regional Centro",
		"PAA Armenia",
		"PAA Manizales",
		"PAA Pereira",
		"Regional Eje Cafetero",
		"PAA Cali Centro",
		"PAA Cali Norte",
		"PAA Cali Sur",
		"PAA Pasto",
		"PAB Buenaventura",
		"PAB Palmira",
		"PAB Popayán",
		"PAB Tuluá",
		"PAC Buga",
		"PAC Ipiales",
		"PAC Tumaco",
		"PAE Emcali (Cali)",
		"PAP Rotonda Jurídica Cali",
		"PAA Bucaramanga",
		"PAA Cúcuta",
		"PAB Barrancabermeja",
		"PAC Aguachica",
		"PAC Ocaña",
		"PAC Pamplona",
		"PAC San Gil",
		"PAA Ibagué",
		"PAA Neiva",
		"PAB Girardot",
		"PAC Fusagasugá",
		"PAC La Dorada",
		"PAC Pitalito",
		"Regional Sur"
	]

	var regionales_digiturno = [
		"Antioquia",
		"Bogotá",
		"Caribe",
		"Centro",
		"Eje Cafetero",
		"Occidente",
		"Santanderes",
		"Sur"
	]


	var id_oficinas_gestionapp = [
		29,
		23,
		24,
		25,
		26,
		27,
		28,
		58,
		54,
		55,
		56,
		57,
		59,
		0,
		9,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		11,
		67,
		68,
		69,
		70,
		71,
		78,
		72,
		73,
		74,
		75,
		76,
		77,
		79,
		81,
		80,
		82,
		66,
		31,
		32,
		30,
		33,
		85,
		42,
		43,
		50,
		53,
		47,
		49,
		48,
		51,
		52,
		45,
		44,
		34,
		40,
		35,
		37,
		38,
		39,
		36,
		17,
		18,
		21,
		22,
		20,
		19,
		"B022597365"
	]

	var id_regionales_digiturno = [
		4,
		5,
		0,
		6,
		7,
		8,
		9,
		10
	]

	var apertura_cierre = query({
		tabla: "OPERACION_PAC",
		campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
		condicion: {
			condicion: true,
			campo: ["ACTIVO"],
			criterio: [1],
			comparador: ["IGUAL"],
			operador: []
		},
	});

	var usuarios = query({
		tabla: "USUARIO",
		campo: ["ID_USUARIO", "NOMBRE"],
		condicion: {
			condicion: false
		}
	});

	var oficinas = query({
		tabla: "OFICINA",
		campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
		condicion: {
			condicion: false
		}
	});

	var operacion = query({
		tabla: "NOVEDADES_OPERACION",
		campo: ["ID_OPERACION", "MOMENTO", "TIPO_NOVEDAD", "NOVEDAD", "INICIO_NOVEDAD", "FIN_NOVEDAD"],
		condicion: {
			condicion: false
		},
	});

	var regional = query({
		tabla: "REGIONAL",
		campo: ["ID_REGIONAL", "REGIONAL"],
		condicion: {
			condicion: false
		}
	});

	var id_oficina;
	var oficina;
	var id_regional;
	var nombre_usuario;
	var nombre_regional;
	var data = [];

	for (let k = 0; k < operacion.registros; k++) {
		for (var j = 0; j < apertura_cierre.registros; j++) {
			if (operacion.datos[k].id_operacion === apertura_cierre.datos[j].id_operacion) {
				var fila = [];
				id_oficina = ""
				id_regional = 0
				for (var l = 0; l < oficinas.registros; l++) {
					if (apertura_cierre.datos[j].id_pac == oficinas.datos[l].id_oficina) {
						id_regional = oficinas.datos[l].id_regional;
						id_oficina = oficinas.datos[l].id_oficina;
						oficina = oficinas.datos[l].oficina
					}
				}
				nombre_regional = ""
				for (l = 0; l < regional.registros; l++) {
					if (id_regional == regional.datos[l].id_regional) {
						nombre_regional = regional.datos[l].regional;
						id_regional = regional.datos[l].id_regional
					}
				}
				fila.push(apertura_cierre.datos[j].id_operacion)
				fila.push(id_regionales_digiturno.includes(id_regional) ? regionales_digiturno[id_regionales_digiturno.indexOf(id_regional)] : nombre_regional);
				fila.push(id_oficinas_gestionapp.includes(id_oficina) ? oficinas_digiturno[id_oficinas_gestionapp.indexOf(id_oficina)] : oficina);
				fila.push(apertura_cierre.datos[j].fecha);
				nombre_usuario = "";
				for (l = 0; l < usuarios.registros; l++) {
					if (usuarios.datos[l].id_usuario == apertura_cierre.datos[j].id_usuario) {
						nombre_usuario = usuarios.datos[l].nombre;
					}
				}
				fila.push(nombre_usuario)
				fila.push(apertura_cierre.datos[j].bzg_apertura);
				fila.push(operacion.datos[k].momento);
				fila.push(operacion.datos[k].tipo_novedad);
				fila.push(`'${operacion.datos[k].novedad}'`);
				fila.push(operacion.datos[k].inicio_novedad);
				fila.push(operacion.datos[k].fin_novedad);
				data.push(fila);
			}
		}
	}
	var hoja_informe = SpreadsheetApp.openById("1LU0oddxnC2hfoLmN9ZrgazvMxiL5ARnsVvF4aMMNWi0").getSheetByName("AC_NOVEDADES_OPERATIVAS");
	hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
	hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Genera el reporte nacional de novedades operativas
*
*/
function m2_1_gs_actualizar_reporte_novedades_personal() {

	var oficinas_digiturno = [
		"PAA Envigado",
		"PAA Medellín Centroccidental",
		"PAA Medellín Norte",
		"PAA Medellín Sur",
		"PAB Quibdó",
		"PAB Rionegro",
		"PAC Apartadó",
		"PAA Bogotá Sur",
		"PAA Calle 94",
		"PAA Chapinero",
		"PAA Prado",
		"PAA Salitre",
		"PAA Teusaquillo",
		"PAA Barranquilla Centro",
		"PAA Barranquilla Norte",
		"PAA Cartagena",
		"PAB Montería",
		"PAB Riohacha",
		"PAB San Andres",
		"PAB Santa Marta",
		"PAB Sincelejo",
		"PAB Valledupar",
		"PAE CIS Cartagena",
		"PAA Tunja",
		"PAA Villavicencio",
		"PAB Duitama",
		"PAB Facatativá",
		"PAB Florencia",
		"PAB Soacha",
		"PAB Sogamoso",
		"PAB Yopal",
		"PAB Zipaquirá",
		"PAC Arauca",
		"PAC Leticia",
		"PAC Mocoa",
		"PAE Mitú",
		"PAE Puerto Carreño",
		"PAE Puerto Inírida",
		"PAE San José Del Guaviare",
		"Regional Centro",
		"PAA Armenia",
		"PAA Manizales",
		"PAA Pereira",
		"Regional Eje Cafetero",
		"PAA Cali Centro",
		"PAA Cali Norte",
		"PAA Cali Sur",
		"PAA Pasto",
		"PAB Buenaventura",
		"PAB Palmira",
		"PAB Popayán",
		"PAB Tuluá",
		"PAC Buga",
		"PAC Ipiales",
		"PAC Tumaco",
		"PAE Emcali (Cali)",
		"PAP Rotonda Jurídica Cali",
		"PAA Bucaramanga",
		"PAA Cúcuta",
		"PAB Barrancabermeja",
		"PAC Aguachica",
		"PAC Ocaña",
		"PAC Pamplona",
		"PAC San Gil",
		"PAA Ibagué",
		"PAA Neiva",
		"PAB Girardot",
		"PAC Fusagasugá",
		"PAC La Dorada",
		"PAC Pitalito",
		"Regional Sur"
	]

	var id_oficinas_gestionapp = [
		29,
		23,
		24,
		25,
		26,
		27,
		28,
		58,
		54,
		55,
		56,
		57,
		59,
		0,
		9,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		11,
		67,
		68,
		69,
		70,
		71,
		78,
		72,
		73,
		74,
		75,
		76,
		77,
		79,
		81,
		80,
		82,
		66,
		31,
		32,
		30,
		33,
		85,
		42,
		43,
		50,
		53,
		47,
		49,
		48,
		51,
		52,
		45,
		44,
		34,
		40,
		35,
		37,
		38,
		39,
		36,
		17,
		18,
		21,
		22,
		20,
		19,
		"B022597365"
	]

	var apertura_cierre = query({
		tabla: "OPERACION_PAC",
		campo: ["ID_OPERACION", "ID_PAC", "ID_USUARIO", "FECHA", "HORA", "BZG_APERTURA", "OBSERVACIONES_PERSONAL", "OBSERVACIONES_REUNION"],
		condicion: {
			condicion: true,
			campo: ["ACTIVO"],
			criterio: [1],
			comparador: ["IGUAL"],
			operador: []
		},
	});

	var usuarios = query({
		tabla: "USUARIO",
		campo: ["ID_USUARIO", "NOMBRE", "CARGO"],
		condicion: {
			condicion: false
		}
	});

	var oficinas = query({
		tabla: "OFICINA",
		campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
		condicion: {
			condicion: true,
			campo: ["ID_REGIONAL"],
			criterio: [0],
			comparador: ["IGUAL"],
			operador: []
		},
	});

	var personal = query({
		tabla: "NOVEDADES_PERSONAL",
		campo: ["ID_OPERACION", "ID_USUARIO", "DISPONIBILIDAD"],
		condicion: {
			condicion: false
		},
	});

	var id_oficina;
	var oficina;
	var nombre_usuario;
	var cargo_usuario;
	var data = [];

	for (let k = 0; k < personal.registros; k++) {
		for (var j = 0; j < apertura_cierre.registros; j++) {
			if (personal.datos[k].id_operacion === apertura_cierre.datos[j].id_operacion) {
				var fila = [];
				id_oficina = ""
				for (var l = 0; l < oficinas.registros; l++) {
					if (apertura_cierre.datos[j].id_pac == oficinas.datos[l].id_oficina) {
						id_oficina = oficinas.datos[l].id_oficina;
						oficina = oficinas.datos[l].oficina
					}
				}
				fila.push(apertura_cierre.datos[j].id_operacion)
				fila.push(id_oficinas_gestionapp.includes(id_oficina) ? oficinas_digiturno[id_oficinas_gestionapp.indexOf(id_oficina)] : oficina);
				fila.push(apertura_cierre.datos[j].fecha);
				nombre_usuario = "";
				for (l = 0; l < usuarios.registros; l++) {
					if (usuarios.datos[l].id_usuario == personal.datos[k].id_usuario) {
						nombre_usuario = usuarios.datos[l].nombre;
						cargo_usuario = usuarios.datos[l].cargo
					}
				}
				fila.push(nombre_usuario)
				fila.push(cargo_usuario)
				fila.push(personal.datos[k].disponibilidad);
				data.push(fila);
			}
		}
	}
	var hoja_informe = SpreadsheetApp.openById("1ojsZgq2O6d8_LyuNpk4ZG0qNrdTwaMZoVTMOWITzm6A").getSheetByName("AC_NOVEDADES_PERSONAL");
	hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
	hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

}


