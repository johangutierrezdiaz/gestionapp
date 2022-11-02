/**---------------------------------------MODULO GESTION BEPS----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - FORMULARIO PSAP
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar en el formulario la info basica del ciudadano PSAP
*
* @param   {number}  documento  documento del ciudadano
*
* @return  {string}             contenido html para cargar en la app
*/
function m5_1_gs_cargar_info_ciudadano(documento) {
	try {

		var contenido = '';
		var psap = query({
			tabla: "PSAP_BASE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_1_gs_cargar_info_ciudadano",
				variable: "psap"
			}
		});
		if (psap.registros > 0) {
			contenido += '<h4><i class="material-icons">keyboard_arrow_right</i>' + psap.datos[0].nombre + '</h4>';
			contenido += '<input type="hidden" value="' + psap.datos[0].documento + '" id="m5_1_hid_base_psap_info_ciudadano_documento" name="m5_1_hid_base_psap_info_ciudadano_documento">';
			contenido += '<hr/>';
			contenido += '<div class="mdl-grid">';
			contenido += '<div class="mdl-cell mdl-cell--6-col">';
			contenido += '<ul>';
			contenido += '<li><strong>Gestión: </strong> <span style="color: #ff0000;"><strong>' + psap.datos[0].gestion + '</strong></span></li>';
			contenido += '<li><strong>Genero: </strong>' + psap.datos[0].genero + '</li>';
			contenido += '<li><strong>Estado programa: </strong>' + psap.datos[0].estado_programa + '</li>';
			contenido += '<li><strong>Segmento: </strong>' + psap.datos[0].segmento + '</li>';
			contenido += '<li><strong>Telefonos: </strong>' + psap.datos[0].telefono_1 + ', ' + psap.datos[0].telefono_2 + ', ' + psap.datos[0].telefono_3 + ', ' + psap.datos[0].telefono_4 + '</li>';
			contenido += '<li><strong>Dirección: </strong>' + psap.datos[0].direccion + '</li>';
			contenido += '<li><strong>Municipio: </strong>' + psap.datos[0].municipio + '</li>';
			contenido += '<li><strong>Prioridad agendamiento: </strong>' + psap.datos[0].prioridad_agendamiento + '</li>';
			contenido += '<li><strong>Gestion contact: </strong>' + psap.datos[0].gestion_contact + '</li>';
			contenido += '<li><strong>Tipificación contact: </strong>' + psap.datos[0].tipificacion_contact + '</li>';
			contenido += '</ul>';
			contenido += '</div>';
			contenido += '<div class="mdl-cell mdl-cell--6-col">';
			contenido += '<ul>';
			contenido += '<li><strong>Edad: </strong>' + psap.datos[0].edad + '</li>';
			contenido += '<li><strong>Grupo poblacional: </strong>' + psap.datos[0].grupo_poblacional + '</li>';
			contenido += '<li><strong>Prioridad decreto: </strong>' + psap.datos[0].prioridad_decreto + '</li>';
			contenido += '<li><strong>Mail: </strong>' + psap.datos[0].mail + '</li>';
			contenido += '<li><strong>Departamento / Municipio: </strong>' + psap.datos[0].departamento + ' / ' + psap.datos[0].municipio + '</li>';
			contenido += '<li><strong>Semanas subsidiadas: </strong>' + psap.datos[0].semanas_subsidiadas + '</li>';
			contenido += '<li><strong>Semanas NO subsidiadas: </strong>' + psap.datos[0].semanas_no_subsidiadas + '</li>';
			contenido += '<li><strong>Total semanas: </strong>' + psap.datos[0].total_semanas + '</li>';
			contenido += '<li><strong>Cobertura: </strong>' + psap.datos[0].cobertura + '</li>';
			contenido += '</ul>';
			contenido += '</div>';
		} else {
			contenido += '<div class="aviso_error"><p><strong>No se tiene en la Base PSAP a ningún ciudadano bajo este numero de cédula</strong></p></div>';
		}
		return contenido;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"documento": documento
			}
		};
		log_error("m5_1_gs_cargar_info_ciudadano", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Funcion que carga la informacion de la gestion realizada con el ciudadano
*
* @param   {object}  q  informacion para la construccion de la tabla de resultados
*
* @return  {object}     tabla de resultados
*/
function m5_1_gs_cargar_gestion_ciudadano(param) {
	try {
		param.titulos = ["FECHA", "USUARIO", "PAC", "DETALLE GESTIÓN"];
		param.datos = [];
		var psap_gestion = query({
			tabla: "PSAP_GESTION",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [param.criterio.documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_1_gs_cargar_gestion_ciudadano",
				variable: "gestion_psap"
			}
		});
		for (var j = 0; j < psap_gestion.registros; j++) {
			var fila = [];
			fila.push(fecha_texto(psap_gestion.datos[j].fecha, "FECHA"));
			var usuario = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [psap_gestion.datos[j].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_1_gs_cargar_gestion_ciudadano",
					variable: "usuario"
				}
			});
			fila.push(usuario.datos[0].nombre);
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [psap_gestion.datos[j].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_1_gs_cargar_gestion_ciudadano",
					variable: "oficina"
				}
			});
			fila.push(oficina.datos[0].oficina);
			fila.push(psap_gestion.datos[j].detalle_gestion);
			param.datos.push(fila);
		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m5_1_gs_cargar_gestion_ciudadano", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* guarda la informacion de la gestion
*
* @param   {object}  frm  formulario		
*
* @return  {object}     		mensaje de exito o fracaso
*/
function m5_1_gs_guardar_nueva_gestion(frm) {
	try {
		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}
		var u = usuario();
		var psap = query({
			tabla: "PSAP_BASE",
			campo: ["GESTION"],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [frm.m5_1_hid_psap_documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_1_gs_guardar_nueva_gestion",
				variable: "psap"
			}
		});
		if (psap.registros == 1) {
			psap.edicion({
				campo: ["GESTION", "ULTIMA_GESTION_OFICINA", "ULTIMA_GESTION_USUARIO"],
				valor: [frm.m5_1_sel_psap_gestion, u.oficina, u.usuario]
			})
			var psap_gestion = query({
				tabla: "PSAP_GESTION",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_1_gs_guardar_nueva_gestion",
					variable: "psap_gestion"
				}
			});
			psap_gestion.insercion({
				campo: ["ID_GESTION", "FECHA", "DOCUMENTO", "ID_USUARIO", "ID_PAC", "DETALLE_GESTION"],
				valor: ["", fecha_texto(0, "FECHA"), frm.m5_1_hid_psap_documento, u.id_usuario, u.id_oficina, frm.m5_1_txt_psap_detalle_gestion],
				index: true
			});
		} else {
			r.exito = false;
			r.mensaje = "No existe ese numero de documento registrado en la base PSAP";
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		log_error("m5_1_gs_guardar_nueva_gestion", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - GESTION ISPV - BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Funcion para el guardado de los datos del formulario ispv-beps
 *
 * @param   {object}  frm  Objecto formulario 
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m5_2_gs_registro_ispv(frm) {
	try {

		var u = usuario();
		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}

		var ispv = query({
			tabla: "ISPV_BEPS",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["RADICADO"],
				criterio: [frm.m5_2_txt_registro_ispv_bizagi],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_2_gs_registro_ispv",
				variable: "ispv"
			}
		});

		if (ispv.registros > 0) {
			r.exito = false;
			var usuario_registro = query({
				tabla: "USUARIO",
				campo: ["USUARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [ispv.datos[0].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_2_gs_registro_ispv",
					variable: "usuario_registro"
				}
			})
			r.mensaje = "No se puede registrar esta gestión. Este trámite ISPV aparece gestionado por el usuario: " + usuario_registro.datos[0].usuario
		} else {
			if (frm.m5_2_sel_registro_ispv_tramite === "Traslado") {
				if (frm.m5_2_sel_registro_ispv_gestion_realizada === "Se logro un traslado de fondos de una indemnización.") {
					ispv.insercion({
						campo: ["ID_GESTION", "FECHA", "ID_USUARIO", "ID_PAC", "RADICADO", "GESTION", "OBSERVACION", "PSAP_TERCEROS", "TRAMITE_BEPS", "SEMANAS"],
						valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, frm.m5_2_txt_registro_ispv_bizagi, frm.m5_2_sel_registro_ispv_gestion_realizada, frm.m5_2_txt_registro_ispv_observaciones, frm.m5_2_sel_registro_ispv_psap_terceros, frm.m5_2_sel_registro_ispv_tramite, frm.m5_2_sel_registro_ispv_numero_semanas],
						index: true
					})
				} else {
					ispv.insercion({
						campo: ["ID_GESTION", "FECHA", "ID_USUARIO", "ID_PAC", "RADICADO", "GESTION", "INFORMACION_ADICIONAL_GESTIÓN", "OBSERVACION", "PSAP_TERCEROS", "TRAMITE_BEPS", "SEMANAS"],
						valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, frm.m5_2_txt_registro_ispv_bizagi, frm.m5_2_sel_registro_ispv_gestion_realizada, frm.m5_2_sel_registro_ispv_informacion_gestion, frm.m5_2_txt_registro_ispv_observaciones, frm.m5_2_sel_registro_ispv_psap_terceros, frm.m5_2_sel_registro_ispv_tramite, frm.m5_2_sel_registro_ispv_numero_semanas],
						index: true
					})
				}
			} else {
				ispv.insercion({
					campo: ["ID_GESTION", "FECHA", "ID_USUARIO", "ID_PAC", "RADICADO", "TRAMITE_BEPS"],
					valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, frm.m5_2_txt_registro_ispv_bizagi, frm.m5_2_sel_registro_ispv_tramite],
					index: true
				})
			}
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_registro_ispv", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 3 - Registrar cantadas gestores BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga la informacion de beps cantadas de la fecha seleccionada
*
* @param   {date}  	f  				fecha desde donde se van a traer las beps cantadas
* @param   {number}  regional  id de la regional
*
* @return  {null}     
*/
function m5_3_gs_beps_cantadas_consulta(f, id_regional, regional) {
	try {

		var r = {
			mensaje: "Informe cargado. Por favor al lado de cada gestor colocar el valor de estadístico de medición.",
			exito: true,
		};
		var parametros = query({
			tabla: "BEPS_PARAMETRO",
			campo: ["ID_PARAMETRO", "PARAMETRO"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO", "AMBITO"],
				criterio: [1, "CANTADAS"],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_3_gs_beps_cantadas_consulta",
				variable: "parametros"
			}
		});
		if (parametros.registros > 0) {
			var sw;
			var parts = f.split('-');
			var fecha = new Date(parts[0], parts[1] - 1, parts[2]);
			fecha.setHours(0, 0, 0, 0);
			var hoja_informe = SpreadsheetApp.openById("1HDeDOtVTZHqs3WzxcO3hnOZLw802LC5rVa4x1QtOtuw").getSheetByName("CANTADAS_PLANTILLA");
			hoja_informe.getRange(1, 7, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
			hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), 6).clear({ formatOnly: false, contentsOnly: true });
			for (var j = 0; j < parametros.registros; j++) {
				hoja_informe.getRange(1, hoja_informe.getLastColumn() + 1).setValue(parametros.datos[j].id_parametro + ") " + parametros.datos[j].parametro);
			}
			var gestores = query({
				tabla: "USUARIO",
				campo: ["ID_USUARIO", "NOMBRE", "ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ACTIVO", "CARGO"],
					criterio: [1, "GESTOR BEPS"],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_3_gs_beps_cantadas_consulta",
					variable: "gestores"
				}
			});
			var valor_parametro;
			for (var i = 0; i < gestores.registros; i++) {
				var gestor_oficina = query({
					tabla: "OFICINA",
					campo: ["ID_REGIONAL_BEPS"],
					condicion: {
						condicion: true,
						campo: ["ID_OFICINA"],
						criterio: [gestores.datos[i].id_oficina],
						comparador: ["IGUAL"],
						operador: []
					},
					depuracion: {
						archivo: "m5_controlador",
						funcion: "m5_3_gs_beps_cantadas_consulta",
						variable: "gestor_oficina"
					}
				});
				if (gestor_oficina.datos[0].id_regional_beps == id_regional) {
					var beps = query({
						tabla: "BEPS_BASE",
						campo: [],
						condicion: {
							condicion: true,
							campo: ["FECHA", "ID_REGIONAL", "ID_USUARIO"],
							criterio: [fecha, id_regional, gestores.datos[i].id_usuario],
							comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
							operador: ["Y", "Y"]
						},
						depuracion: {
							archivo: "m5_controlador",
							funcion: "m5_3_gs_beps_cantadas_consulta",
							variable: "beps"
						}
					});
					var fila = [gestores.datos[i].id_usuario, gestores.datos[i].nombre, fecha_texto(fecha, "FECHA"), id_regional, regional, ""];
					for (j = 0; j < parametros.registros; j++) {
						valor_parametro = 0;
						for (var l = 0; l < beps.registros; l++) {
							if (beps.datos[l].id_parametro == parametros.datos[j].id_parametro) {
								if (fila[5] === "") {
									var municipio = query({
										tabla: "DIVIPOLA_MUNICIPIOS",
										campo: ["CODIGO_MUNICIPIO", "MUNICIPIO", "DEPARTAMENTO"],
										condicion: {
											condicion: true,
											campo: ["CODIGO_MUNICIPIO"],
											criterio: [beps.datos[l].id_municipio],
											comparador: ["IGUAL"],
											operador: []
										},
										depuracion: {
											archivo: "m5_controlador",
											funcion: "m5_3_gs_beps_cantadas_consulta",
											variable: "municipio"
										}
									});
									fila[5] = municipio.datos[0].municipio + ") " + municipio.datos[0].municipio + ", " + municipio.datos[0].departamento;
								}
								valor_parametro = beps.datos[l].valor
							}
						}
						fila.push(valor_parametro);
					}
					var valores = [];
					valores.push(fila);
					hoja_informe.getRange(hoja_informe.getLastRow() + 1, 1, 1, fila.length).setValues(valores);
				}
			}
		} else {
			var r = {
				mensaje: "No se ha definido ningun parámetro de medición BEPS.",
				exito: false,
			};
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"f": f,
				"id_regional": id_regional,
				"regional": regional
			}
		};
		var id_error = log_error("m5_3_gs_beps_cantadas_consulta", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r

	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia el correo con la plantilla al correo 
*
* @param   {string}  q  correo a donde se enviara la plantilla
*
* @return  {straing}     mensaje de estado con el resultado de la operacion
*/
function m5_3_gs_beps_cantadas_envio_plantilla(correo) {
	try {

		var r = {
			exito: true,
			mensaje: ""
		}
		var id = SpreadsheetApp.openById("1HDeDOtVTZHqs3WzxcO3hnOZLw802LC5rVa4x1QtOtuw").getId();
		var hoja_informe = SpreadsheetApp.openById("1HDeDOtVTZHqs3WzxcO3hnOZLw802LC5rVa4x1QtOtuw").getSheetByName("CANTADAS_PLANTILLA");
		var fecha = hoja_informe.getRange(2, 3).getValue();
		var url = 'https://docs.google.com/spreadsheets/d/' + id + '/export?format=xlsx';
		var token = ScriptApp.getOAuthToken();
		var archivo = UrlFetchApp.fetch(url, {
			headers: {
				'Authorization': 'Bearer ' + token
			}
		});
		var blobs = [archivo.getBlob().setName("PLANTILLA_GESTORES_CANTADAS.xlsx")];
		var contenido_html = '<p>Buen d&iacute;a,&nbsp;</p>';
		contenido_html += '<p>Por favor no hacer modificaciones sobre la plantilla, solo llenar las columnas correspondientes a:</p>';
		var parametros = query({
			tabla: "BEPS_PARAMETRO",
			campo: ["ID_PARAMETRO", "PARAMETRO"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO", "AMBITO"],
				criterio: [1, "CANTADAS"],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_3_gs_beps_cantadas_consulta",
				variable: "parametros"
			}
		});
		contenido_html += '<ul>';
		contenido_html += '<li>"MUNICIPIO"</li>';
		for (var j = 0; j < parametros.registros; j++) {
			contenido_html += '<li>"' + parametros.datos[j].parametro + '"</li>';
		}
		contenido_html += '</ul>';
		contenido_html += '<p>Estos son los campos marcados en rojo.</p>';
		contenido_html += '<p>Una vez diligenciada la plantilla, enviarla a <a href="mailto:jjgutierrezd@colpensiones.gov.co?Subject=Plantilla%20Reporte%20Diario%20Cantadas%20Diligenciada">jjgutierrezd@colpensiones.gov.co</a></p>';
		contenido_html += '<p><span style="color: #ff0000;">IMPORTANTE: por favor verificar la fecha correcta para la cual se va a diligenciar la plantilla.</span></p>';
		contenido_html += '<p><span style="color: #000000;">Muchas gracias por su colaboraci&oacute;n</span></p>';
		MailApp.sendEmail({
			to: correo,
			subject: "PLANTILLA REPORTE DIARIO BEPS CANTADAS (" + fecha_texto(fecha, "FECHA") + ")",
			htmlBody: contenido_html,
			noReply: true,
			attachments: blobs
		});
		r.mensaje = "La plantilla se envio exitosamente al correo: " + correo;
		return r

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"correo": correo
			}
		};
		var id_error = log_error("m5_3_gs_beps_cantadas_envio_plantilla", param, e);
		r.exito = false;
		r.error = "Error en la aplicacion, por favor intente nuevamente o comuniquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Carga desde el correo las cantadas y lo coloca en la plantilla
*
*
* @return  {null}          
*/
function m5_3_gs_beps_cantadas_cargar_plantilla() {
	try {

		var r = {
			exito: true,
			mensaje: "No se encontraron correos con informacion de Cantadas BEPS",
			error: ""
		};
		var hilo = GmailApp.getInboxThreads(0, 200);
		var correo = GmailApp.getMessagesForThreads(hilo);
		var sw_correos = true;
		for (var i = 0; i < correo.length; i++) {
			for (var j = 0; j < correo[i].length; j++) {
				if (correo[i][j].isUnread() && correo[i][j].getSubject().indexOf("REPORTE DIARIO BEPS CANTADAS") !== -1) {
					if (sw_correos) {
						var adjunto = correo[i][j].getAttachments();
						var pos = -1;
						for (var a = 0; a < adjunto.length; a++) {
							if (adjunto[a].getName().indexOf("PLANTILLA_GESTORES_CANTADAS") !== -1 && adjunto[a].getContentType() === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
								pos = a;
							}
						}
						if (pos !== -1) {
							var folder = DriveApp.getFolderById("1MrZ20lP-fl-Z8xzqGSDMwFlL5mzWmBaf");
							var files = folder.getFiles();
							while (files.hasNext()) {
								var file = files.next();
								if (file.getName().indexOf("_USADO") == -1) {
									file.setName(file.getName() + "_USADO");
								}
							}
							var blob = adjunto[pos].copyBlob();
							var fecha_informe = correo[i][j].getDate();
							var nombre_archivo_cantada = "CANTADAS_" + fecha_informe.getFullYear() + "." + (fecha_informe.getMonth() + 1) + "." + fecha_informe.getDate();
							var resource = {
								title: nombre_archivo_cantada,
								mimeType: MimeType.GOOGLE_SHEETS,
								parents: [{ id: "1MrZ20lP-fl-Z8xzqGSDMwFlL5mzWmBaf" }]
							};
							var cantada = Drive.Files.insert(resource, blob);
							var hoja_cantada = SpreadsheetApp.openById(cantada.id).getSheetByName("CANTADAS_PLANTILLA");
							var base_cantada = hoja_cantada.getRange(1, 1, hoja_cantada.getLastRow(), hoja_cantada.getLastColumn()).getValues();
							var hoja_informe = SpreadsheetApp.openById("1HDeDOtVTZHqs3WzxcO3hnOZLw802LC5rVa4x1QtOtuw").getSheetByName("CANTADAS_PLANTILLA");
							hoja_informe.getRange(1, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
							hoja_informe.getRange(1, 1, hoja_cantada.getLastRow(), hoja_cantada.getLastColumn()).setValues(base_cantada);
							r.mensaje = "Se obtuvo la informacion del correo";
							correo[i][j].markRead();
						} else {
							r.mensaje = "El correo se envio sin adjunto";
						}
						sw_correos = false;
					} else {
						r.mensaje += " - \r\nNota: Existen mas correos en colas del mismo destinatario, por favor ejecutar nuevamente el script ";
					}
				}
			}
		}
		return r

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_3_gs_beps_cantadas_cargar_plantilla", param, e);
		r.exito = false;
		r.error = "Error en la aplicacion, por favor intente nuevamente o comuniquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Guarda la informacion registrada en la plantilla en la base de datos de la app
*
*
* @return  {null}          
*/
function m5_3_gs_beps_cantadas_guardar_plantilla() {
	try {

		var r = {
			exito: true,
			mensaje: "Los datos se guardaron exitosamente"
		}
		var hoja_informe = SpreadsheetApp.openById("1HDeDOtVTZHqs3WzxcO3hnOZLw802LC5rVa4x1QtOtuw").getSheetByName("CANTADAS_PLANTILLA");
		var base_informe = hoja_informe.getDataRange().getValues();
		for (var j = 1; j < (base_informe.length - 1); j++) {
			var beps = query({
				tabla: "BEPS_BASE",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["FECHA", "ID_USUARIO"],
					criterio: [base_informe[j][2], base_informe[j][0]],
					comparador: ["FECHA_IGUAL", "IGUAL"],
					operador: ["Y"]
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_3_gs_beps_cantadas_guardar_plantilla",
					variable: "beps"
				}
			});
			if (beps.registros > 0) {
				beps.borrado();
			}
			var fila = ["", base_informe[j][2], base_informe[j][0], base_informe[j][3], "", "", ""];
			if (base_informe[j][5] !== "") {
				fila[6] = base_informe[j][5].substring(0, base_informe[j][5].indexOf(")"));
			}
			for (var i = 6; i < base_informe[0].length; i++) {
				if (base_informe[j][i] != 0) {
					fila[4] = base_informe[0][i].substring(0, base_informe[0][i].indexOf(")"));
					fila[5] = base_informe[j][i];
					beps.insercion({
						campo: ["ID_OPERACION", "FECHA", "ID_USUARIO", "ID_REGIONAL", "ID_PARAMETRO", "VALOR", "ID_MUNICIPIO"],
						valor: fila,
						index: true
					})
				}
			}
		}
		hoja_informe.getRange(1, 7, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), 6).clear({ formatOnly: false, contentsOnly: true });
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_3_gs_beps_cantadas_guardar_plantilla", param, e);
		r.exito = false;
		r.error = "Error en la aplicacion, por favor intente nuevamente o comuniquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 6 - ADMINISTRACION PARAMETROS BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para la carga en el front de los parametros BEPS registrados en la APP
*
* @return  {object}  objeto con la informacion de los parametros para armar la tabla
*/
function m5_6_gs_cargar_parametros(param_tabla) {
	try {

		param_tabla.titulos = ["ID_PARAMETRO", "PARAMETRO", "DESCRIPCION", "AMBITO", "ACTIVO", ""];
		param_tabla.datos = [];
		var parametros = query({
			tabla: "BEPS_PARAMETRO",
			campo: [],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_6_gs_cargar_parametros",
				variable: "parametros"
			}
		});
		for (var j = 0; j < parametros.registros; j++) {
			var fila = [];
			fila.push(parametros.datos[j].id_parametro);
			fila.push(parametros.datos[j].parametro);
			fila.push(parametros.datos[j].descripcion);
			fila.push(parametros.datos[j].ambito);
			fila.push(parametros.datos[j].activo);
			fila.push('<a href="#m0_div_panel_secundario" id="m5_6_btn_editar_parametro" data-id_parametro="' + parametros.datos[j].id_parametro + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">edit</i></a>');
			param_tabla.datos.push(fila);
		}
		return param_tabla

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m5_6_gs_cargar_parametros", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {number}  id_parametro  id del parametro a mostrar en el formulario
*
* @return  {object}       					objecto con los resultados de la busquedad
*/
function m5_6_gs_poblar_formulario_parametros(id_parametro) {
	try {

		var parametro = query({
			tabla: "BEPS_PARAMETRO",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ID_PARAMETRO"],
				criterio: [id_parametro],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_6_gs_poblar_formulario_parametros",
				variable: "parametro"
			}
		});

		var info_servidor = {
			id_parametro: parametro.datos[0].id_parametro,
			operacion: "EDITAR",
			parametro: parametro.datos[0].parametro,
			parametro_descripcion: parametro.datos[0].descripcion,
			ambito: parametro.datos[0].ambito,
			activo: parametro.datos[0].activo
		}
		return info_servidor;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_parametro": id_parametro
			}
		};
		log_error("m5_6_gs_poblar_formulario_parametros", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* guadamos los datos del formulario
*
* @param   {object}  frm  formulario
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m5_6_gs_parametro_manipular_guardar(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente",
			limpiar_formulario: true
		}
		if (frm.m5_6_hid_operacion === "EDITAR") {
			var parametro = query({
				tabla: "BEPS_PARAMETRO",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["ID_PARAMETRO"],
					criterio: [frm.m5_6_hid_id_parametro],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_6_gs_parametro_manipular_guardar",
					variable: "parametro"
				}
			});
			var chk_parametro = 0;
			if (frm.m5_6_chk_parametro_activo === "si") {
				chk_parametro = 1;
			}
			parametro.edicion({
				campo: ["ID_PARAMETRO", "PARAMETRO", "DESCRIPCION", "AMBITO", "ACTIVO"],
				valor: [frm.m5_6_hid_id_parametro, frm.m5_6_txt_parametro, frm.m5_6_txt_parametro_descripcion, frm.m5_6_sel_parametro_ambito, chk_parametro]
			});
		} else {
			var parametro = query({
				tabla: "BEPS_PARAMETRO",
				campo: [],
				condicion: {
					condicion: 0,
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_6_gs_parametro_manipular_guardar",
					variable: "parametro"
				}
			});
			var chk_parametro = 0;
			if (frm.m5_6_chk_parametro_activo === "si") {
				chk_parametro = 1;
			}
			parametro.insercion({
				campo: ["ID_PARAMETRO", "PARAMETRO", "DESCRIPCION", "AMBITO", "ACTIVO"],
				valor: ["", frm.m5_6_txt_parametro, frm.m5_6_txt_parametro_descripcion, frm.m5_6_sel_parametro_ambito, chk_parametro],
				index: true
			})
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m5_6_gs_parametro_manipular_guardar", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 7 - PROSPECTIVA BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Funcion para cargar los parametros de prospectiva en la plantilla drive 
*
* @param   {date}  			fecha  Fecha en la cual se cargaran/guardaran los datos de prospectiva
*
* @return  {null}       
*/
function m5_7_gs_beps_prospectiva_consulta(f) {
	try {

		var r = {
			exito: true,
			mensaje: "Informe cargado. Por favor al lado de cada parametro colocar el valor de estadístico de medición."
		}
		var parametros = query({
			tabla: "BEPS_PARAMETRO",
			campo: ["ID_PARAMETRO", "PARAMETRO"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO", "AMBITO"],
				criterio: [1, "PROSPECTIVA"],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_7_js_beps_prospectiva_consulta",
				variable: "parametros"
			}
		});
		if (parametros.registros > 0) {
			var parts = f.split('-');
			var fecha = new Date(parts[0], parts[1] - 1, parts[2]);
			fecha.setHours(0, 0, 0, 0);
			var hoja_informe = SpreadsheetApp.openById("1Z2-nDaZ5zCKxPygXD_gKz_ZRdUENbiOdfs4qbRpfFRw").getSheetByName("PROSPECTIVA_PLANTILLA");
			hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
			for (j = 0; j < parametros.registros; j++) {
				var fila_norte = [1, "BEPS / CARIBE NORTE", fecha_texto(fecha, "FECHA"), parametros.datos[j].id_parametro, parametros.datos[j].parametro, 0];
				var beps = query({
					tabla: "BEPS_BASE",
					campo: [],
					condicion: {
						condicion: true,
						campo: ["FECHA", "ID_REGIONAL", "ID_PARAMETRO"],
						criterio: [fecha, 1, parametros.datos[j].id_parametro],
						comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					},
					depuracion: {
						archivo: "m5_controlador",
						funcion: "m5_7_js_beps_prospectiva_consulta",
						variable: "beps"
					}
				});
				if (beps.registros > 0) {
					fila_norte[5] = beps.datos[0].valor;
				}
				var valores = [];
				valores.push(fila_norte);
				hoja_informe.getRange(hoja_informe.getLastRow() + 1, 1, 1, fila_norte.length).setValues(valores);

				var fila_sur = [2, "BEPS / CARIBE SUR", fecha_texto(fecha, "FECHA"), parametros.datos[j].id_parametro, parametros.datos[j].parametro, 0];
				var beps = query({
					tabla: "BEPS_BASE",
					campo: [],
					condicion: {
						condicion: true,
						campo: ["FECHA", "ID_REGIONAL", "ID_PARAMETRO"],
						criterio: [fecha, 2, parametros.datos[j].id_parametro],
						comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					},
					depuracion: {
						archivo: "m5_controlador",
						funcion: "m5_7_js_beps_prospectiva_consulta",
						variable: "beps"
					}
				});
				if (beps.registros > 0) {
					fila_sur[5] = beps.datos[0].valor;
				}
				var valores = [];
				valores.push(fila_sur);
				hoja_informe.getRange(hoja_informe.getLastRow() + 1, 1, 1, fila_sur.length).setValues(valores);
			}
		} else {
			var r = {
				mensaje: "No se ha definido ningun parámetro de medición BEPS.",
				exito: false,
			};
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"fecha": fecha
			}
		};
		var id_error = log_error("m5_7_js_beps_prospectiva_consulta", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m5_7_gs_beps_prospectiva_guardar_plantilla() {
	try {

		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}
		var hoja_informe = SpreadsheetApp.openById("1Z2-nDaZ5zCKxPygXD_gKz_ZRdUENbiOdfs4qbRpfFRw").getSheetByName("PROSPECTIVA_PLANTILLA");
		var base_informe = hoja_informe.getDataRange().getValues();
		for (var j = 1; j < (base_informe.length); j++) {
			if (base_informe[j][5] != 0) {
				var fila = ["", base_informe[j][2], "", base_informe[j][0], base_informe[j][3], base_informe[j][5], ""];
				var beps = query({
					tabla: "BEPS_BASE",
					campo: ["ID_OPERACION"],
					condicion: {
						condicion: true,
						campo: ["FECHA", "ID_REGIONAL", "ID_PARAMETRO"],
						criterio: [base_informe[j][2], base_informe[j][0], base_informe[j][3]],
						comparador: ["FECHA_IGUAL", "IGUAL", "IGUAL"],
						operador: ["Y", "Y"]
					},
					depuracion: {
						archivo: "m5_controlador",
						funcion: "m5_7_js_beps_prospectiva_consulta",
						variable: "beps"
					}
				});
				if (beps.registros > 0) {
					beps.borrado();
				}
				beps.insercion({
					campo: ["ID_OPERACION", "FECHA", "ID_USUARIO", "ID_REGIONAL", "ID_PARAMETRO", "VALOR", "ID_MUNICIPIO"],
					valor: fila,
					index: true
				})
			}
		}
		var hoja_informe = SpreadsheetApp.openById("1Z2-nDaZ5zCKxPygXD_gKz_ZRdUENbiOdfs4qbRpfFRw").getSheetByName("PROSPECTIVA_PLANTILLA");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_7_gs_beps_prospectiva_guardar_plantilla", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 8 - REPORTES BEPS PROSPECTIVA
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* Carga en el el index de reportes el boton de actualizar y el drive
*
* @param   {number}  			id_regional  id de la regional activa
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m5_8_gs_cargar_reportes(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Reporte cargado exitosamente",
			contenido_ispv_beps: '',
			contenido_referidos_beps: '',
			contenido_anualidades_beps: ''
		}

		var reporte_isv_beps = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REPORTE_GESTION_ISPV_BEPS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_isv_beps.registros > 0) {
			r.contenido_ispv_beps += '<button id="m5_8_btn_informe_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m5_8_js_actualizar_reporte_ispv_beps()>';
			r.contenido_ispv_beps += 'ACTUALIZAR INFORME >>';
			r.contenido_ispv_beps += '</button>';
			r.contenido_ispv_beps += '<hr />';
			r.contenido_ispv_beps += '<br />';
			r.contenido_ispv_beps += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_isv_beps.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_ispv_beps += '<br />';
			r.contenido_ispv_beps += 'Abrir <b>REPORTE GESTION ISPV - BEPS</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_isv_beps.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_ispv_beps += '<br />';
		} else {
			r.contenido_ispv_beps += '<br />';
			r.contenido_ispv_beps += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_ispv_beps += '<br />';
		}

		var reporte_referido_beps = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REFERIDOS_BEPS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_referido_beps.registros > 0) {
			r.contenido_referidos_beps += '<button id="m5_8_btn_informe_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m5_8_js_actualizar_reporte_referidos_beps()>';
			r.contenido_referidos_beps += 'ACTUALIZAR INFORME >>';
			r.contenido_referidos_beps += '</button>';
			r.contenido_referidos_beps += '<hr />';
			r.contenido_referidos_beps += '<br />';
			r.contenido_referidos_beps += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_referido_beps.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_referidos_beps += '<br />';
			r.contenido_referidos_beps += 'Abrir <b>REPORTE REFERIDOS BEPS</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_referido_beps.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_referidos_beps += '<br />';
		} else {
			r.contenido_referidos_beps += '<br />';
			r.contenido_referidos_beps += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_referidos_beps += '<br />';
		}

		var reporte_anualidades_beps = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REPORTE_ANUALIDADES_BEPS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_anualidades_beps.registros > 0) {
			r.contenido_anualidades_beps += '<button id="m5_8_btn_informe_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m5_8_js_actualizar_reporte_anualidades_beps()>';
			r.contenido_anualidades_beps += 'ACTUALIZAR INFORME >>';
			r.contenido_anualidades_beps += '</button>';
			r.contenido_anualidades_beps += '<hr />';
			r.contenido_anualidades_beps += '<br />';
			r.contenido_anualidades_beps += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_anualidades_beps.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_anualidades_beps += '<br />';
			r.contenido_anualidades_beps += 'Abrir <b>REPORTE GESTION ISPV - BEPS</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_anualidades_beps.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_anualidades_beps += '<br />';
		} else {
			r.contenido_anualidades_beps += '<br />';
			r.contenido_anualidades_beps += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_anualidades_beps += '<br />';
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
		var id_error = log_error("m5_8_gs_cargar_reportes", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descargamos los datos del servidor y los mandamos al front
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_ispv_beps_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		}
		var u = usuario()

		var usuario_query = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_ispv_beps_paso_1",
				variable: "usuario_query"
			}
		});
		r.usuario = usuario_query

		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "ACTIVO"],
				criterio: [u.id_regional, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_ispv_beps_paso_1",
				variable: "oficina"
			}
		});
		r.oficina = oficina;
		/*
		var tramites_bizagi = query({
			tabla: "CONSOLIDADO_TRAMITES_BIZAGI",
			campo: ["OFICINA", "NUMERO_RADICACION", "TRAMITE", "SUBTIPO_TRAMITE","AGENTE_ROTONDA", "AGENTE_SERVICIO", "FECHA"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_ispv_beps_paso_1",
				variable: "tramites_bizagi"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.tramites_bizagi = tramites_bizagi
		*/
		var ispv = query({
			tabla: "ISPV_BEPS",
			campo: [],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_ispv_beps_paso_1",
				variable: "ispv"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.ispv = ispv

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_ispv_beps_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * cargamos los datos al servidor despues de ser procesado en el front
 *
 * @param   {object}  data  				matriz de datos procesados para ser montado en el drive de reporte
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_ispv_beps_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte de GESTION ISPV - BEPS se ha actualizado exitosamente"
		}
		var u = usuario()

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REPORTE_GESTION_ISPV_BEPS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var copia = file.makeCopy("REPORTE GESTION ISPV - BEPS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M5_REPORTE_GESTION_ISPV_BEPS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M5_REPORTE_GESTION_ISPV_BEPS", 5],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_ispv_beps_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M5_REPORTE_GESTION_ISPV_BEPS", 5, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: data
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_ispv_beps_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descargamos los datos del servidor y los mandamos al front
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_referidos_beps_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		}
		var u = usuario()

		var usuario_query = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_1",
				variable: "usuario_query"
			}
		});
		r.usuario = usuario_query

		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [u.id_regional],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_1",
				variable: "oficina"
			}
		});
		r.oficina = oficina;

		var referidos = query({
			tabla: "REFERIDOS_BEPS",
			campo: ["ID_GESTION", "ID_USUARIO", "FECHA", "ID_OFICINA", "REFERIDO", "TELEFONO", "ID_USUARIO_REFIERE", "ID_MUNICIPIO", "OBSERVACION"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_1",
				variable: "referidos"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.referidos = referidos;

		var municipios = query({
			tabla: "MUNICIPIO",
			campo: ["ID_MUNICIPIO", "MUNICIPIO", "DEPARTAMENTO"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_1",
				variable: "municipios"
			}
		});
		r.municipio = municipios;

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_referidos_beps_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
 * cargamos los datos al servidor despues de ser procesado en el front
 *
 * @param   {object}  data  				matriz de datos procesados para ser montado en el drive de reporte
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_referidos_beps_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte de GESTION ISPV - BEPS se ha actualizado exitosamente"
		}
		var u = usuario()

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REPORTE_ANUALIDADES_BEPS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var copia = file.makeCopy("REPORTE GESTION ANUALIDADES BEPS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M5_REPORTE_ANUALIDADES_BEPS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M5_REPORTE_ANUALIDADES_BEPS", 5],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M5_REPORTE_ANUALIDADES_BEPS", 5, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: data
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_referidos_beps_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descargamos los datos del servidor y los mandamos al front
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_anualidades_beps_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		}
		var u = usuario()

		var usuario_query = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_anualidades_beps_paso_1",
				variable: "usuario_query"
			}
		});
		r.usuario = usuario_query

		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [u.id_regional],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_anualidades_beps_paso_1",
				variable: "oficina"
			}
		});
		r.oficina = oficina;

		var anualidades = query({
			tabla: "ANUALIDAD_GESTION",
			campo: [],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_referidos_beps_paso_1",
				variable: "referidos"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.anualidades = anualidades;

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_anualidades_beps_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------



/**
 * cargamos los datos al servidor despues de ser procesado en el front
 *
 * @param   {object}  data  				matriz de datos procesados para ser montado en el drive de reporte
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m5_8_gs_actualizar_reporte_anualidades_beps_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte de GESTION ISPV - BEPS se ha actualizado exitosamente"
		}
		var u = usuario()

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M5_REFERIDOS_BEPS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var copia = file.makeCopy("REPORTE GESTION REFERIDOS BEPS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M5_REFERIDOS_BEPS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M5_REFERIDOS_BEPS", 5],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_8_gs_actualizar_reporte_anualidades_beps_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M5_REFERIDOS_BEPS", 5, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: data
		};
		var id_error = log_error("m5_8_gs_actualizar_reporte_anualidades_beps_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}






//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 9 - REFERIDOS  BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Funcion de descarga de la informacion para los select de la seccion en el front
 * 
 * @param   {number}  id_oficina  id de la oficina
 *
 * @return  {object}       				objecto con los resultados de la operacion
 */
function m5_9_gs_referidos_beps_poblar_menus(id_oficina) {
	try {

		var r = {
			exito: true,
			mensaje: "Se cargaron los datos correctamente puede usar el formulario"
		}

		var funcionario = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA", "ACTIVO"],
				criterio: [id_oficina, 1],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_9_gs_referidos_beps_poblar_menus",
				variable: "oficina"
			}
		});
		r.funcionario = funcionario

		var municipio = query({
			tabla: "MUNICIPIO",
			campo: ["ID_MUNICIPIO", "MUNICIPIO", "DEPARTAMENTO"],
			condicion: {
				condicion: true,
				campo: ["REGIONAL"],
				criterio: ["CARIBE"],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_9_gs_referidos_beps_poblar_menus",
				variable: "municipio"
			}
		});
		r.municipio = municipio

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_oficina": id_oficina
			}
		};
		var id_error = log_error("m5_9_gs_referidos_beps_poblar_menus", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descripcion_funcion
 *
 * @param   {object}  frm  				objecto formulario con la informacion recogida en el front
 *
 * @return  {object}       				objecto con los resultados de la operacion
 */
function m5_9_gs_registro_referido(frm) {
	try {

		var u = usuario();
		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}

		var refereridos = query({
			tabla: "REFERIDOS_BEPS",
			campo: [],
			condicion: {
				condicion: 0
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_9_gs_registro_referido",
				variable: "referidos"
			}
		});

		refereridos.insercion({
			campo: ["ID_GESTION", "ID_USUARIO", "FECHA", "ID_OFICINA", "REFERIDO", "TELEFONO", "ID_USUARIO_REFIERE", "ID_MUNICIPIO", "OBSERVACION"],
			valor: ["", u.id_usuario, fecha_texto(0, "FECHA"), u.id_oficina, frm.m5_9_txt_referido_beps_nombre_referido, frm.m5_9_txt_referido_beps_telefono_referido, frm.m5_9_txt_referido_beps_funcionario, frm.m5_9_txt_referido_beps_municipio, frm.m5_9_txt_referido_beps_observaciones],
			index: true
		})

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: this
		};
		var id_error = log_error("m5_9_gs_registro_referido", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 10 - FORMULARIO ANUALIDAD BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar en el formulario la info basica del ciudadano anualidad beps
*
* @param   {number}  documento  documento del ciudadano
*
* @return  {string}             contenido html para cargar en la app
*/
function m5_10_gs_cargar_info_ciudadano(documento) {
	try {

		var contenido = '';
		var anualidad = query({
			tabla: "ANUALIDAD_BASE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_10_gs_cargar_info_ciudadano",
				variable: "anualidad"
			}
		});
		if (anualidad.registros > 0) {
			contenido += '<h4><i class="material-icons">keyboard_arrow_right</i>' + anualidad.datos[0].nombre + '</h4>';
			contenido += '<input type="hidden" value="' + anualidad.datos[0].documento + '" id="m5_10_hid_base_anualidad_info_ciudadano_documento" name="m5_10_hid_base_anualidad_info_ciudadano_documento">';
			contenido += '<hr/>';
			contenido += '<div class="mdl-grid">';
			contenido += '<div class="mdl-cell mdl-cell--6-col">';
			contenido += '<ul>';
			contenido += '<li><strong>Gestión: </strong> <span style="color: #ff0000;"><strong>' + anualidad.datos[0].gestion + '</strong></span></li>';
			contenido += '<li><strong>Genero: </strong>' + anualidad.datos[0].sexo + '</li>';
			contenido += '<li><strong>Telefonos: </strong>' + anualidad.datos[0].telefono_1 + ', ' + anualidad.datos[0].telefono_2 + '</li>';
			contenido += '<li><strong>Fecha vinculación: </strong>' + fecha_texto(anualidad.datos[0].fecha_vinculacion, "FECHA") + '</li>';
			contenido += '<li><strong>Afiliación RPM: </strong>' + anualidad.datos[0].afiliacion_rpm + '</li>';
			contenido += '<li><strong>Semanas cotizadas abril: </strong>' + anualidad.datos[0].semanas_cotizadas_abril + '</li>';
			contenido += '<li><strong>Sorteos colpensiones: </strong>' + anualidad.datos[0].sorteos_colpensiones + '</li>';
			contenido += '<li><strong>Traslados RAIS: </strong>' + anualidad.datos[0].traslados_rais + '</li>';
			contenido += '<li><strong>Traslado aseguradora: </strong>' + anualidad.datos[0].traslado_aseguradora + '</li>';
			contenido += '<li><strong>Tercero renta vitalicia: </strong>' + anualidad.datos[0].tercero_renta_vitalicia + '</li>';
			contenido += '<li><strong>Premio ahorraton BEPS: </strong>' + anualidad.datos[0].premio_ahorraton_beps + '</li>';
			contenido += '<li><strong>Traslados subsidios PSAP: </strong>' + anualidad.datos[0].traslados_subsidios_psap + '</li>';
			contenido += '<li><strong>Reintegro cobro red: </strong>' + anualidad.datos[0].reintegro_cobro_red + '</li>';
			contenido += '<li><strong>Traslado subsidio PSAP: </strong>' + anualidad.datos[0].traslado_subsidio_psap + '</li>';
			contenido += '<li><strong>Traslado aportes PSAP: </strong>' + anualidad.datos[0].traslado_aportes_psap + '</li>';
			contenido += '<li><strong>Valor aportes CI: </strong>' + anualidad.datos[0].valor_aportes_ci + '</li>';
			contenido += '<li><strong>Valor rendimientos CI: </strong>' + anualidad.datos[0].valor_rendimientos_ci + '</li>';
			contenido += '<li><strong>Aportes con incentivo: </strong>' + anualidad.datos[0].aportes_con_incentivo + '</li>';
			contenido += '<li><strong>Valor estimado incentivo periodico: </strong>' + anualidad.datos[0].valor_estimado_incentivo_periodico + '</li>';
			contenido += '<li><strong>Periodo calculo: </strong>' + fecha_texto(anualidad.datos[0].periodo_calculo, "FECHA") + '</li>';
			contenido += '<li><strong>Efectividad: </strong>' + anualidad.datos[0].efectividad + '</li>';
			contenido += '</ul>';
			contenido += '</div>';
			contenido += '<div class="mdl-cell mdl-cell--6-col">';
			contenido += '<ul>';
			contenido += '<li><strong>Regional: </strong>' + anualidad.datos[0].regional + '</li>';
			contenido += '<li><strong>Departamento / Municipio: </strong>' + anualidad.datos[0].departamento + ' / ' + anualidad.datos[0].municipio + '</li>';
			contenido += '<li><strong>Semanas cotizadas: </strong>' + anualidad.datos[0].semanas_cotizadas + '</li>';
			contenido += '<li><strong>Afiliación RPM Abril: </strong>' + anualidad.datos[0].afiliacion_rpm_abril + '</li>';
			contenido += '<li><strong>Red de recaudo: </strong>' + anualidad.datos[0].red_de_recaudo + '</li>';
			contenido += '<li><strong>Aportes propios por tercero: </strong>' + anualidad.datos[0].aportes_propios_por_tercero + '</li>';
			contenido += '<li><strong>Traslados RPM: </strong>' + anualidad.datos[0].traslados_rpm + '</li>';
			contenido += '<li><strong>Terceros fomanto al ahorro: </strong>' + anualidad.datos[0].terceros_fomento_al_ahorro + '</li>';
			contenido += '<li><strong>Programa social ARN: </strong>' + anualidad.datos[0].programa_social_arn + '</li>';
			contenido += '<li><strong>Aportes recaudo colpensiones: </strong>' + anualidad.datos[0].aportes_recaudo_colpensiones + '</li>';
			contenido += '<li><strong>Traslado subpsap rendimiento: </strong>' + anualidad.datos[0].traslado_subpsap_rendimiento + '</li>';
			contenido += '<li><strong>Traslado rend sub PSAP : </strong>' + anualidad.datos[0].traslado_rend_sub_psap + '</li>';
			contenido += '<li><strong>Aportes obligatorios PPS: </strong>' + anualidad.datos[0].aportes_obligatorios_pps + '</li>';
			contenido += '<li><strong>Aportes voluntarios PPS: </strong>' + anualidad.datos[0].aportes_voluntarios_pps + '</li>';
			contenido += '<li><strong>Total cuenta individual: </strong>' + anualidad.datos[0].total_cuenta_individual + '</li>';
			contenido += '<li><strong>Aportes sin incentivo: </strong>' + anualidad.datos[0].aportes_sin_incentivo + '</li>';
			contenido += '<li><strong>Valor estimado BEPS bimestral: </strong>' + anualidad.datos[0].valor_estimado_beps_bimestral + '</li>';
			contenido += '<li><strong>contactabilidad: </strong>' + anualidad.datos[0].contactabilidad + '</li>';
			contenido += '<li><strong>Tipificacion 1: </strong>' + anualidad.datos[0].tipificacion_1 + '</li>';
			contenido += '<li><strong>Tipificacion 2: </strong>' + anualidad.datos[0].tipificacion_2 + '</li>';
			contenido += '</ul>';
			contenido += '</div>';
		} else {
			contenido += '<div class="aviso_error"><p><strong>No se tiene en la Base de ANUALIDADES BEPS a ningún ciudadano bajo este numero de cédula</strong></p></div>';
		}
		return contenido;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"documento": documento
			}
		};
		log_error("m5_10_gs_cargar_info_ciudadano", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Funcion que carga la informacion de la gestion realizada con el ciudadano
*
* @param   {object}  q  informacion para la construccion de la tabla de resultados
*
* @return  {object}     tabla de resultados
*/
function m5_10_gs_cargar_gestion_ciudadano(param) {
	try {
		param.titulos = ["FECHA", "USUARIO", "PAC", "DETALLE GESTIÓN"];
		param.datos = [];
		var gestion_anualidad = query({
			tabla: "ANUALIDAD_GESTION",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [param.criterio.documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_10_gs_cargar_gestion_ciudadano",
				variable: "gestion_anualidad"
			}
		});
		for (var j = 0; j < gestion_anualidad.registros; j++) {
			var fila = [];
			fila.push(fecha_texto(gestion_anualidad.datos[j].fecha, "FECHA"));
			var usuario = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [gestion_anualidad.datos[j].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_10_gs_cargar_gestion_ciudadano",
					variable: "usuario"
				}
			});
			fila.push(usuario.datos[0].nombre);
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [gestion_anualidad.datos[j].id_pac],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_10_gs_cargar_gestion_ciudadano",
					variable: "oficina"
				}
			});
			fila.push(oficina.datos[0].oficina);
			fila.push(gestion_anualidad.datos[j].detalle_gestion);
			param.datos.push(fila);
		}
		return param;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param
		};
		log_error("m5_10_gs_cargar_gestion_ciudadano", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* guarda la informacion de la gestion
*
* @param   {object}  frm  formulario		
*
* @return  {object}     		mensaje de exito o fracaso
*/
function m5_10_gs_guardar_nueva_gestion(frm) {
	try {

		Logger.log(frm)
		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}
		var u = usuario();
		var anualidad = query({
			tabla: "ANUALIDAD_BASE",
			campo: ["GESTION"],
			condicion: {
				condicion: true,
				campo: ["DOCUMENTO"],
				criterio: [frm.m5_10_hid_anualidad_documento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m5_10_gs_guardar_nueva_gestion",
				variable: "anualidad"
			}
		});
		Logger.log(anualidad)
		if (anualidad.registros == 1) {
			anualidad.edicion({
				campo: ["GESTION", "ULTIMA GESTION OFICINA", "ULTIMA GESTION USUARIO"],
				valor: [frm.m5_10_sel_anualidad_gestion, u.oficina, u.usuario]
			})
			var anualidad_gestion = query({
				tabla: "ANUALIDAD_GESTION",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m5_controlador",
					funcion: "m5_10_gs_guardar_nueva_gestion",
					variable: "anualidad_gestion"
				}
			});
			anualidad_gestion.insercion({
				campo: ["ID_GESTION", "FECHA", "DOCUMENTO", "ID_USUARIO", "ID_PAC", "DETALLE_GESTION"],
				valor: ["", fecha_texto(0, "FECHA"), frm.m5_10_hid_anualidad_documento, u.id_usuario, u.id_oficina, frm.m5_10_txt_anualidad_detalle_gestion],
				index: true
			});
		} else {
			r.exito = false;
			r.mensaje = "No existe ese numero de documento registrado en la base ANUALIDAD";
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		log_error("m5_10_gs_guardar_nueva_gestion", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Actualiza el reporte de traslados ISPV Automaticamente 
*
*
*/
function m5_8_gs_actualizar_reporte_traslados_ispv() {

	var usuario = query({
		tabla: "USUARIO",
		campo: ["ID_USUARIO", "NOMBRE"],
		condicion: {
			condicion: false
		},
	});

	var oficina = query({
		tabla: "OFICINA",
		campo: ["OFICINA", "ID_OFICINA"],
		condicion: {
			condicion: false
		},
	});

	var ispv = query({
		tabla: "ISPV_BEPS",
		campo: [],
		condicion: {
			condicion: false
		},
	});

	var data = [];
	for (var j = 0; j < ispv.registros; j++) {
		var fila = []
		fila.push(ispv.datos[j].id_gestion)
		fila.push(ispv.datos[j].fecha)

		var nombre_usuario = ""
		for (var i = 0; i < usuario.registros; i++) {
			if (usuario.datos[i].id_usuario == ispv.datos[j].id_usuario) {
				nombre_usuario = usuario.datos[i].nombre
			}
		}

		fila.push(nombre_usuario)

		var nombre_oficina = ""
		for (i = 0; i < oficina.registros; i++) {
			if (oficina.datos[i].id_oficina === ispv.datos[j].id_pac) {
				var nombre_oficina = oficina.datos[i].oficina
			}
		}
		fila.push(nombre_oficina)

		fila.push(ispv.datos[j].radicado)
		fila.push(ispv.datos[j].tramite_beps)

		if (ispv.datos[j].gestion !== "") {
			if (ispv.datos[j].gestion === "SI") {
				fila.push("RESULTADOS POSITIVOS")
			} else {
				fila.push("RESULTADOS NEGATIVOS")
			}
		} else {
			fila.push("")
		}

		fila.push(ispv.datos[j].psap_terceros)
		fila.push(ispv.datos[j].informacion_adicional_gestion)
		fila.push(ispv.datos[j].observacion)
		data.push(fila)
	}
	var hoja_informe = SpreadsheetApp.openById("1YHQA1cKoB_pz9zHmVsiAPS5iOKOUI_V-R0YH_L4W168").getSheetByName("datos");
	hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
	hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);
}
