/**---------------------------------------MODULO VISITAS DE ASEGURAMIENTO----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - CONSOLIDADO VISITAS DE ASEGURAMIENTO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de xxxxxxxxxxx para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_1_gs_poblar_menu_programar_visita_oficina(param_select) {
	try {

		var oficina = query({
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
		for (var j = 0; j < oficina.registros; j++) {
			var rango = {
				texto: oficina.datos[j].oficina,
				valor: oficina.datos[j].id_oficina,
				selected: ""
			};
			param_select.datos.push(rango);
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m7_1_gs_poblar_menu_programar_visita_oficina", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de xxxxxxxxxxx para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_1_gs_poblar_menu_programar_visita_usuario_oficina(param_select) {
	try {

		var usuario = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE", "CARGO"],
			condicion: {
				condicion: true,
				campo: ["ROL", "ROL", "ROL", "ROL", "ID_OFICINA", "ACTIVO"],
				criterio: ["PAC / AGENTE DE SERVICIO", "PAC / LIDER PAC", "PAC / GESTOR DE SERVICIO", "PAC / JEFE PAC", param_select.criterio, 1],
				comparador: ["IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL", "IGUAL"],
				operador: ["O", "O", "O", "Y", "Y"]
			}
		});

		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < usuario.registros; j++) {
			var rango = {
				texto: usuario.datos[j].cargo + " / " + usuario.datos[j].nombre,
				valor: usuario.datos[j].id_usuario,
				selected: ""
			};
			param_select.datos.push(rango);
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		var id_error = log_error("m7_1_gs_poblar_menu_programar_visita_oficina", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de xxxxxxxxxxx para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_1_gs_poblar_menu_programar_visita_usuario(param_select) {
	try {

		var usuario = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE", "ID_OFICINA"],
			condicion: {
				condicion: true,
				campo: [
					"ACTIVO",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
					"ROL",
				],
				criterio: [
					1,
					"REGIONAL / COMERCIAL BEPS",
					"REGIONAL / DEFENSA JUDICIAL",
					"REGIONAL / MERCADEO",
					"REGIONAL / ADMINISTRATIVA Y TALENTO HUMANO",
					"REGIONAL / ESTUDIANTE EN PRACTICA",
					"REGIONAL / ASISTENTE ADMINISTRATIVA",
					"PAC / AGENTE DE SERVICIO",
					"PAC / GESTOR DE SERVICIO",
					"PAC / ORIENTADOR",
					"PAC / AGENTE ROTONDA",
					"PAC / LIDER PAC",
					"PAC / JEFE PAC",
					"PAC / GESTOR BEPS",
					"PAC / AGENTE PSAP",
					"PAC / COMERCIAL RPM"
				],
				comparador: [
					"IGUAL",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE",
					"DIFERENTE"
				],
				operador: [
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y",
					"Y"
				]
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < usuario.registros; j++) {

			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA", "ID_REGIONAL"],
					criterio: [usuario.datos[j].id_oficina, param_select.criterio],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});
			if (oficina.registros == 1) {
				var rango = {
					texto: usuario.datos[j].nombre,
					valor: usuario.datos[j].id_usuario,
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
		var id_error = log_error("m7_1_gs_poblar_menu_programar_visita_usuario", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de xxxxxxxxxxx para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_1_gs_poblar_menu_programar_visita_categorias() {
	try {

		r = [];

		var listas = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		for (var j = 0; j < listas.registros; j++) {

			var rango = {
				lista: listas.datos[j].categoria,
				id_lista: listas.datos[j].id_categoria,
			};
			r.push(rango);
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {};
		var id_error = log_error("m7_1_gs_poblar_menu_programar_visita_categorias", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_1_gs_programar_visita(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Datos guardados exitosamente"
		}

		var fecha_comparacion = new Date(frm.m7_1_txt_programar_visita_fecha);

		var visitas = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA"],
			condicion: {
				condicion: true,
				campo: ["FECHA_VISITA", "ID_PAC", "ESTADO"],
				criterio: [fecha_comparacion, frm.m7_1_sel_programar_visita_pac, "CANCELADA"],
				comparador: ["FECHA_IGUAL", "IGUAL", "DIFERENTE"],
				operador: ["Y", "Y"]
			}
		});

		if (visitas.registros > 0) {
			r.exito = false;
			r.mensaje = "Ya se tiene programada una visita para este PAC en esta fecha, por favor cambiar la fecha!";
		} else {
			var u = usuario();
			var fecha = new Date(frm.m7_1_txt_programar_visita_fecha);
			fecha.setDate(fecha.getDate() + 1);

			var calendario = query({
				tabla: "CALENDARIO",
				campo: ["ID_CALENDARIO"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
					criterio: [u.id_regional, "Visitas de aseguramiento", 1],
					comparador: ["IGUAL", "IGUAL", "IGUAL"],
					operador: ["Y", "Y"]
				}
			});
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [frm.m7_1_sel_programar_visita_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var usuario_visita = query({
				tabla: "USUARIO",
				campo: ["NOMBRE", "CORREO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [frm.m7_1_sel_programar_visita_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var usuario_atiende = query({
				tabla: "USUARIO",
				campo: ["NOMBRE", "CORREO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [frm.m7_1_sel_programar_visita_usuario_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var evento = CalendarApp.getCalendarById(calendario.datos[0].id_calendario + "@group.calendar.google.com").createAllDayEvent("Visita aseguramiento: " + oficina.datos[0].oficina, fecha);

			var id_visita = visitas.insercion({
				campo: ["ID_VISITA", "FECHA_VISITA", "ID_PAC", "ID_USUARIO", "ID_USUARIO_PAC", "ESTADO", "ID_EVENTO", "OBSERVACIONES", "PLAN_MEJORAMIENTO"],
				valor: ["", frm.m7_1_txt_programar_visita_fecha, frm.m7_1_sel_programar_visita_pac, frm.m7_1_sel_programar_visita_usuario, frm.m7_1_sel_programar_visita_usuario_pac, "PROGRAMADA", evento.getId(), frm.m7_1_txt_programar_visita_observaciones, "NO"],
				index: true
			});

			var visita_categoria = query({
				tabla: "VISITA_CATEGORIA",
				campo: [],
				condicion: {
					condicion: 0
				}
			});

			var plantilla = DriveApp.getFileById('1URw9Ng4nmY1uA1LzKoknIc8lTYt36IMCyUTxkUX_1Oc');
			var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
			var nueva_acta = plantilla.makeCopy("Visita Aseguramiento " + oficina.datos[0].pac + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate() + ")", folder);
			var num = nueva_acta.getId();
			var doc = DocumentApp.openById(num);

			var body = doc.getBody();
			body.replaceText('{regional}', u.regional);
			body.replaceText('{pac}', oficina.datos[0].oficina);
			body.replaceText('{fecha_visita}', frm.m7_1_txt_programar_visita_fecha);
			body.replaceText('{realiza_visita}', usuario_visita.datos[0].nombre);
			body.replaceText('{recibe_visita}', usuario_atiende.datos[0].nombre);

			var contenido_listas = "";
			var id_categoria;
			for (k in frm) {
				if (k.substring(0, k.indexOf("-")) === "m7_1_chk_programar_visita_lista_id") {

					id_categoria = k.substring(k.indexOf("-") + 1);
					visita_categoria.insercion({
						campo: ["ID_VISITA", "ID_CATEGORIA"],
						valor: [id_visita.id, id_categoria],
						index: false
					});
					contenido_listas += "<li>" + frm[k] + "</li>";

					var categoria = query({
						tabla: "CATEGORIA_CHECKLIST",
						campo: ["CATEGORIA"],
						condicion: {
							condicion: true,
							campo: ["ID_CATEGORIA"],
							criterio: [id_categoria],
							comparador: ["IGUAL"],
							operador: []
						}
					});

					body.appendHorizontalRule();
					body.appendParagraph(categoria.datos[0].categoria).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					var celdas = [];
					celdas.push(["ITEM VERIFICACIÓN", "CUMPLE", "NO CUMPLE", "NO APLICA", "OBSERVACIONES"])
					var items = query({
						tabla: "CHECKLIST",
						campo: ["ID_ITEM", "ITEM"],
						condicion: {
							condicion: true,
							campo: ["ID_CATEGORIA", "ACTIVO"],
							criterio: [id_categoria, 1],
							comparador: ["IGUAL", "IGUAL"],
							operador: ["Y"]
						}
					});

					for (var i = 0; i < items.registros; i++) {
						celdas.push([items.datos[i].item, "", "", "", ""]);
					}

					var tabla = body.appendTable(celdas);
					tabla.setColumnWidth(0, 300);
					tabla.setColumnWidth(1, 50);
					tabla.setColumnWidth(2, 50);
					tabla.setColumnWidth(3, 50);
					tabla.setColumnWidth(4, 250);
					var fila_tabla = tabla.getRow(0);
					var encabezado_tabla = {};
					encabezado_tabla[DocumentApp.Attribute.BOLD] = true;
					encabezado_tabla[DocumentApp.Attribute.BACKGROUND_COLOR] = '#99ccff';
					encabezado_tabla[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = 'CENTER';
					fila_tabla.getCell(0).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					fila_tabla.getCell(1).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					fila_tabla.getCell(2).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					fila_tabla.getCell(3).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					fila_tabla.getCell(4).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
					body.appendPageBreak();
				}
			}

			var descripcion_evento = "<p>";
			descripcion_evento += "<ul>";
			descripcion_evento += "<li><b>Listas de verificación a evaluar:</b></li>";
			descripcion_evento += "<ul>";
			descripcion_evento += contenido_listas;
			descripcion_evento += "</ul>";
			descripcion_evento += "<li><b>Observaciones: </b>" + frm.m7_1_txt_programar_visita_observaciones + "</li>";
			descripcion_evento += "</ul>";
			descripcion_evento += "</p>";
			evento.setDescription(descripcion_evento);

			var pie_tabla = body.appendTable([["Firma del Funcionario que realiza la visita", "Firma del jefe del Punto de Atención"]]);
			pie_tabla.getRow(0).setMinimumHeight(70);
			pie_tabla.getRow(0).getCell(0).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
			pie_tabla.getRow(0).getCell(1).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
			doc.saveAndClose();

			var file = Drive.Files.get(num);
			var url = file.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
			var oauthToken = ScriptApp.getOAuthToken();
			var response = UrlFetchApp.fetch(url, {
				headers: {
					'Authorization': 'Bearer ' + oauthToken
				}
			});
			var blobs = [response.getBlob().setName("Visita Aseguramiento " + oficina.datos[0].pac + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate() + ").docx")];
			var cuerpo_correo;
			cuerpo_correo = '<p>Cordial Saludo,</p>';
			cuerpo_correo = cuerpo_correo + '<p>Se ha programado una visita de aseguramiento su oficina: </p>';
			cuerpo_correo = cuerpo_correo + '<ul>';
			cuerpo_correo = cuerpo_correo + '<li><strong>FECHA VISITA: </strong>' + frm.m7_1_txt_programar_visita_fecha + '</li>';
			cuerpo_correo = cuerpo_correo + '<li><strong>QUIEN REALIZA LA VISITA: </strong>' + usuario_visita.datos[0].nombre + '</li>';
			cuerpo_correo = cuerpo_correo + '<li><strong>OBSERVACIONES: </strong>' + frm.m7_1_txt_programar_visita_observaciones + '</li>';
			cuerpo_correo = cuerpo_correo + '</ul>';
			cuerpo_correo = cuerpo_correo + '<p>Adjunto se envía una versión para impresión de la lista de verificación a aplicar durante esta visita</p>';
			cuerpo_correo = cuerpo_correo + '<p>Muchas gracias por su colaboraci&oacute;n.</p>';
			cuerpo_correo = cuerpo_correo + '<pre><q>Este es un correo generado automaticamente a traves del <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';

			GmailApp.sendEmail(
				usuario_visita.datos[0].correo + ";" + usuario_atiende.datos[0].correo,
				'VISITA DE ASEGURAMIENTO / ' + oficina.datos[0].oficina + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate(),
				'Cordial Saludo. Se ha programado una nueva Visita de Aseguramiento para el dia: ' + frm.m7_1_txt_programar_visita_fecha + '. La visita será liderada por el funcionario ' + usuario_visita.datos[0].nombre,
				{
					attachments: blobs,
					htmlBody: cuerpo_correo
				}
			);

		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"frm": frm
			}
		};
		var id_error = log_error("m7_1_js_programar_visita", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - REALIZAR VISITA DE ASEGURAMIENTO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de xxxxxxxxxxx para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_2_gs_v_a_cargar_visitas(param_select) {
	try {

		var visitas = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "FECHA_VISITA"],
			condicion: {
				condicion: true,
				campo: ["ESTADO"],
				criterio: ["PROGRAMADA"],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);

		for (var j = 0; j < visitas.registros; j++) {

			var oficina = query({
				tabla: "OFICINA",
				campo: ["ID_OFICINA", "OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA", "ID_REGIONAL"],
					criterio: [visitas.datos[j].id_pac, param_select.criterio],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});
			if (oficina.registros == 1) {
				var rango = {
					texto: oficina.datos[0].oficina + " (" + fecha_texto(visitas.datos[j].fecha_visita, "FECHA") + ")",
					valor: visitas.datos[j].id_visita,
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
		var id_error = log_error("nombre_funcion", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_2_gs_cargar_visita_paso_1(id_visita) {
	try {

		var r = {
			exito: true,
			contenido: '',
			mensaje: "Por favor espere mientras se carga la lista de verificación para la visita"
		};

		var visita = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "FECHA_VISITA", "ID_USUARIO", "ID_PAC", "ID_USUARIO_PAC", "OBSERVACIONES"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var usuario_visita = query({
			tabla: "USUARIO",
			campo: ["NOMBRE"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [visita.datos[0].id_usuario],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var usuario_atiende = query({
			tabla: "USUARIO",
			campo: ["NOMBRE"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [visita.datos[0].id_usuario_pac],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [visita.datos[0].id_pac],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		r.contenido += '<hr/>';
		r.contenido += '<div class="mdl-grid">';
		r.contenido += '<div class="mdl-cell mdl-cell--6-col">';
		r.contenido += '<ul>';
		r.contenido += '<li><strong>Oficina: </strong>' + oficina.datos[0].oficina + '</li>';
		r.contenido += '<li><strong>Fecha visita: </strong>' + fecha_texto(visita.datos[0].fecha_visita, "FECHA") + '</li>';
		r.contenido += '<li><strong>Observaciones: </strong>' + visita.datos[0].observaciones + '</li>';
		r.contenido += '</ul>';
		r.contenido += '</div>';
		r.contenido += '<div class="mdl-cell mdl-cell--6-col">';
		r.contenido += '<ul>';
		r.contenido += '<li><strong>Quien realiza la visita: </strong>' + usuario_visita.datos[0].nombre + '</li>';
		r.contenido += '<li><strong>Quien recibe la visita: </strong>' + usuario_atiende.datos[0].nombre + '</li>';
		r.contenido += '</ul>';
		r.contenido += '</div>';
		r.contenido += '</div>';
		r.contenido += '<br/>';
		r.contenido += '<hr/>';
		r.contenido += '<div id="m7_2_div_v_a_consolidado_checklist"></div>';
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_visita": id_visita
			}
		};
		var id_error = log_error("m7_2_gs_cargar_visita_paso_1", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_2_gs_cargar_visita_paso_2(id_visita) {
	try {

		var c = {
			exito: true,
			mensaje: "Lista de verificación cargada exitosamente, por favor espere mientras se cargan las calificaciones guardadas",
		}

		var listas = query({
			tabla: "VISITA_CATEGORIA",
			campo: ["ID_CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		c.listas = listas

		var categoria = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA", "DESCRIPCION"],
			condicion: {
				condicion: false,
			}
		});
		c.categoria = categoria;

		var items = query({
			tabla: "CHECKLIST",
			campo: ["ID_ITEM", "ITEM", "ID_CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		c.items = items;

		var resultado_visita = query({
			tabla: "VISITA",
			campo: ["ID_VISITA", "ID_ITEM", "VERIFICACION", "OBSERVACION"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		c.resultado_visita = resultado_visita;

		return c;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_visita": id_visita
			}
		};
		var id_error = log_error("m7_2_gs_cargar_visita_paso_2", param, e);
		c.exito = false;
		c.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return c
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_2_gs_v_a_cerrar_visita_paso_1(param) {
	try {

		var r = {
			exito: true,
			mensaje: "Calificaciones guardadas exitosamente ",
			sw_cierre_visitas: param.sw_cierre_visitas
		}

		var evaluacion_visita = query({
			tabla: "VISITA",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [param.id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		if (evaluacion_visita.registros > 0) {
			evaluacion_visita.borrado();
		}

		if (param.sw_cierre_visitas) {
			var accion_correctiva = query({
				tabla: "ACCION_CORRECTIVA",
				campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO"],
				condicion: {
					condicion: false
				}
			});
		}

		for (var j = 0; j < param.items.length; j++) {
			var resultado_insercion_visita = evaluacion_visita.insercion({
				campo: ["ID_VISITA", "ID_ITEM", "VERIFICACION", "OBSERVACION"],
				valor: [param.id_visita, param.items[j].id, param.items[j].calificacion, param.items[j].observacion],
				index: false
			});
			if (param.sw_cierre_visitas && param.items[j].calificacion === "NO CUMPLE") {
				var resultado_insercion_accion_correctiva = accion_correctiva.insercion({
					campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO"],
					valor: ["", param.id_visita, param.items[j].id, "PENDIENTE PLAN DE MEJORAMIENTO"],
					index: true
				})
			}
		}

		if (param.sw_cierre_visitas) {

			var visita = query({
				tabla: "PROGRAMACION",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA"],
					criterio: [param.id_visita],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			visita.edicion({
				campo: ["ESTADO"],
				valor: ["REALIZADA"]
			});
			var usuario_visita = query({
				tabla: "USUARIO",
				campo: ["NOMBRE", "CORREO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visita.datos[0].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var usuario_atiende = query({
				tabla: "USUARIO",
				campo: ["NOMBRE", "CORREO"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visita.datos[0].id_usuario_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA", "ID_REGIONAL"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [visita.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var regional = query({
				tabla: "REGIONAL",
				campo: ["REGIONAL"],
				condicion: {
					condicion: true,
					campo: ["ID_REGIONAL"],
					criterio: [oficina.datos[0].id_regional],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var evaluacion;
			var observacion;
			var fecha = new Date(visita.datos[0].fecha_visita);
			var plantilla = DriveApp.getFileById('1URw9Ng4nmY1uA1LzKoknIc8lTYt36IMCyUTxkUX_1Oc');
			var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
			var nueva_acta = plantilla.makeCopy("Visita Aseguramiento Diligenciada" + oficina.datos[0].pac + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate() + ")", folder);
			var num = nueva_acta.getId();
			var doc = DocumentApp.openById(num);

			var body = doc.getBody();
			body.replaceText('{regional}', regional.datos[0].regional);
			body.replaceText('{pac}', oficina.datos[0].oficina);
			body.replaceText('{fecha_visita}', fecha_texto(visita.datos[0].fecha_visita, "FECHA"));
			body.replaceText('{realiza_visita}', usuario_visita.datos[0].nombre);
			body.replaceText('{recibe_visita}', usuario_atiende.datos[0].nombre);
			var listas = query({
				tabla: "VISITA_CATEGORIA",
				campo: ["ID_CATEGORIA"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA"],
					criterio: [param.id_visita],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			for (j = 0; j < listas.registros; j++) {
				var categoria = query({
					tabla: "CATEGORIA_CHECKLIST",
					campo: ["CATEGORIA"],
					condicion: {
						condicion: true,
						campo: ["ID_CATEGORIA"],
						criterio: [listas.datos[j].id_categoria],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				body.appendHorizontalRule();
				body.appendParagraph(categoria.datos[0].categoria).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
				var celdas = [];
				celdas.push(["ITEM VERIFICACIÓN", "EVALUACIÓN", "OBSERVACIONES"])
				var items = query({
					tabla: "CHECKLIST",
					campo: ["ID_ITEM", "ITEM"],
					condicion: {
						condicion: true,
						campo: ["ID_CATEGORIA"],
						criterio: [listas.datos[j].id_categoria],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				for (var i = 0; i < items.registros; i++) {
					evaluacion = "";
					observacion = "";
					for (var l = 0; l < param.items.length; l++) {
						if (items.datos[i].id_item == param.items[l].id) {
							evaluacion = param.items[l].calificacion;
							observacion = param.items[l].observacion;
						}
					}
					celdas.push([items.datos[i].item, evaluacion, observacion]);
				}
				var tabla = body.appendTable(celdas);
				tabla.setColumnWidth(0, 300);
				tabla.setColumnWidth(1, 100);
				tabla.setColumnWidth(2, 300);
				var fila_tabla = tabla.getRow(0);
				var encabezado_tabla = {};
				encabezado_tabla[DocumentApp.Attribute.BOLD] = true;
				encabezado_tabla[DocumentApp.Attribute.BACKGROUND_COLOR] = '#99ccff';
				encabezado_tabla[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = 'CENTER';
				fila_tabla.getCell(0).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
				fila_tabla.getCell(1).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
				fila_tabla.getCell(2).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
				body.appendPageBreak();
			}

			var pie_tabla = body.appendTable([["Firma del Funcionario que realiza la visita", "Firma del jefe del Punto de Atención"]]);
			pie_tabla.getRow(0).setMinimumHeight(70);
			pie_tabla.getRow(0).getCell(0).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
			pie_tabla.getRow(0).getCell(1).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
			doc.saveAndClose();

			var file = Drive.Files.get(num);
			var url = file.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
			var oauthToken = ScriptApp.getOAuthToken();
			var response = UrlFetchApp.fetch(url, {
				headers: {
					'Authorization': 'Bearer ' + oauthToken
				}
			});
			var blobs = [response.getBlob().setName("Visita Aseguramiento Diligenciada " + oficina.datos[0].oficina + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate() + ").docx")];
			var cuerpo_correo;
			cuerpo_correo = '<p>Cordial Saludo,</p>';
			cuerpo_correo = cuerpo_correo + '<p>Se ha cerrado una visita de aseguramiento realizada a su oficina: </p>';
			cuerpo_correo = cuerpo_correo + '<ul>';
			cuerpo_correo = cuerpo_correo + '<li><strong>FECHA VISITA: </strong>' + fecha_texto(fecha, "FECHA") + '</li>';
			cuerpo_correo = cuerpo_correo + '<li><strong>QUIEN REALIZA LA VISITA: </strong>' + usuario_visita.datos[0].nombre + '</li>';
			cuerpo_correo = cuerpo_correo + '<li><strong>OBSERVACIONES: </strong>' + visita.datos[0].observaciones + '</li>';
			cuerpo_correo = cuerpo_correo + '</ul>';
			cuerpo_correo = cuerpo_correo + '<p>Adjunto se envía una versión para impresión de la lista de verificación a diligenciada durante la visita</p>';
			cuerpo_correo = cuerpo_correo + '<p>Muchas gracias por su colaboraci&oacute;n.</p>';
			cuerpo_correo = cuerpo_correo + '<pre><q>Este es un correo generado automaticamente a traves del <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';
			GmailApp.sendEmail(
				usuario_atiende.datos[0].correo + ";" + usuario_visita.datos[0].correo,
				'VISITA DE ASEGURAMIENTO DILIGENCIADA / ' + oficina.datos[0].oficina + " (" + fecha.getFullYear() + "." + (fecha.getMonth() + 1) + "." + fecha.getDate(),
				'Cordial Saludo. Se ha cerrado una Visita de Aseguramiento',
				{
					attachments: blobs,
					htmlBody: cuerpo_correo
				}
			);
			r.mensaje = "Esta acta de visita ha sido cerrado. \n Recuerde que la gestión de las acciones correctivas resultantes de la evaluación de esta visita las encontrara en la sección Gestión acciones correctivas. \n En caso de que en la visita no se encuentre una No Conformidad, esta se cerrara automáticamente y no será necesario pasar a la sección de Acciones Correctivas. \n A su correo llegara una copia del Acta ya Diligenciada"
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"param": param
			}
		};
		var id_error = log_error("m7_2_gs_v_a_cerrar_visita_paso_1", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}





//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 3 - CALENDARIO VISITAS DE ASEGURAMIENTO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_3_gs_cargar_calendario(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Calendario cargado exitosamente",
			contenido: ''
		}

		var calendario = query({
			tabla: "CALENDARIO",
			campo: ["ID_CALENDARIO"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL", "CALENDARIO", "ACTIVO"],
				criterio: [id_regional, "Visitas de aseguramiento", 1],
				comparador: ["IGUAL", "IGUAL", "IGUAL"],
				operador: ["Y", "Y"]
			},
		});
		if (calendario.registros > 0) {
			r.contenido = '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=' + calendario.datos[0].id_calendario + '%40group.calendar.google.com&amp;color=%23402175&amp;color=%2381910B&amp;color=%23A87070&amp;title=Gesti%C3%B3n.APP%20%2F%20VISITAS%20DE%20ASEGURAMIENTO&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
		} else {
			r.exito = false;
			r.mensaje = "No se cuenta con un calendario asociado a esta regional"
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
		var id_error = log_error("m7_3_gs_cargar_calendario", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 4 - CANCELACION DE VISITAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* muestra informacion de xxxxxxxxxxx en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m7_4_gs_cargar_visitas_aseguramiento() {
	try {

		var param_tabla = {
			contenedor: "m7_4_div_v_a_modificacion",
			titulos: ["ID_VISITA", "OFICINA", "FECHA", "USUARIO QUE REALIZA LA VISITA", "USUARIO QUE ATIENDE LA VISITA", ""],
			datos: []
		}

		var visita = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "ID_USUARIO", "FECHA_VISITA", "ID_USUARIO_PAC"],
			condicion: {
				condicion: true,
				campo: ["ESTADO"],
				criterio: ["PROGRAMADA"],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		for (var j = 0; j < visita.registros; j++) {
			var fila = [];
			fila.push(visita.datos[j].id_visita);

			var oficina = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [visita.datos[j].id_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			fila.push(oficina.datos[0].oficina);
			fila.push(fecha_texto(visita.datos[j].fecha_visita, "FECHA"));

			var usuario_visita = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visita.datos[j].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			fila.push(usuario_visita.datos[0].nombre);

			var usuario_atiende = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visita.datos[j].id_usuario_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			fila.push(usuario_atiende.datos[0].nombre);
			fila.push('<a href="#m7_4_btn_v_a_modificacion" id="m7_4_btn_v_a_modificacion" onclick=m7_4_js_v_a_modificar_visita_paso_1("' + visita.datos[j].id_visita + '") class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">cancel</i></a>');

			param_tabla.datos.push(fila);

		}

		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("nombre_funcion", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_4_gs_v_a_modificar_visita_paso_2(id_visita) {
	try {

		var r = {
			exito: true,
			mensaje: "Cancelación realizada exitosamente"
		}
		var visita = query({
			tabla: "VISITA",
			campo: ["ID_ITEM"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		if (visita.registros > 0) {
			r.exito = false;
			r.mensaje = "Usted ya cuenta con calificaciones realizadas sobre esta visita, aunque aún no la ha cerrado. Si desea cancelar esta visita, debe eliminar todas las calificaciones realizadas"
		} else {
			var programacion = query({
				tabla: "PROGRAMACION",
				campo: ["ID_VISITA"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA"],
					criterio: [id_visita],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			programacion.edicion({
				campo: ["ESTADO"],
				valor: ["CANCELADA"]
			})
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_visita": id_visita
			}
		};
		var id_error = log_error("m7_4_gs_v_a_modificar_visita_paso_2", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}





//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 5 - GESTIÓN ACCIONES CORRECTIVAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* muestra informacion de xxxxxxxxxxx en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m7_5_gs_a_c_formulario_consulta(param_tabla) {
	try {

		param_tabla.titulos = ["ID", "VISITA", "CATEGORÍA", "ÍTEM NO CONFORMIDAD", "OBSERVACION VISITA", "ESTADO NO CONFORMIDAD", "FECHA VENCIMIENTO", ""];
		param_tabla.datos = [];

		if (param_tabla.criterio.plan === "PLAN DE MEJORAMIENTO FINALIZADO") {
			var no_conformidad = query({
				tabla: "ACCION_CORRECTIVA",
				campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO", "FECHA_VENCIMIENTO"],
				condicion: {
					condicion: true,
					campo: ["ESTADO"],
					criterio: [param_tabla.criterio.plan],
					comparador: ["DIFERENTE"],
					operador: []
				},
				opciones: {
					formato_fecha: "FECHA_a_texto"
				}
			});
		} else {
			var no_conformidad = query({
				tabla: "ACCION_CORRECTIVA",
				campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO", "FECHA_VENCIMIENTO"],
				condicion: {
					condicion: true,
					campo: ["ESTADO"],
					criterio: [param_tabla.criterio.plan],
					comparador: ["IGUAL"],
					operador: []
				},
				opciones: {
					formato_fecha: "FECHA_a_texto"
				}
			});
		}
		param_tabla.no_conformidad = no_conformidad;

		var visita = query({
			tabla: "PROGRAMACION",
			campo: ["FECHA_VISITA", "ID_PAC", "ID_VISITA"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		param_tabla.visita = visita;

		var oficina = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});
		param_tabla.oficina = oficina;

		var item = query({
			tabla: "CHECKLIST",
			campo: ["ID_ITEM", "ITEM", "ID_CATEGORIA"],
			condicion: {
				condicion: false
			}
		});
		param_tabla.item = item;

		var categoria = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: false
			}
		});
		param_tabla.categoria = categoria;

		var observacion_visita = query({
			tabla: "VISITA",
			campo: ["OBSERVACION", "ID_VISITA", "ID_ITEM"],
			condicion: {
				condicion: false
			}
		});
		param_tabla.observacion_visita = observacion_visita;


		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m7_5_gs_a_c_formulario_consulta", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_5_gs_a_c_abrir_visita(id_plan) {
	try {

		var correciones = query({
			tabla: "ACCION_CORRECTIVA",
			campo: ["ID_VISITA", "ESTADO"],
			condicion: {
				condicion: true,
				campo: ["ID_PLAN"],
				criterio: [id_plan],
				comparador: ["IGUAL"],
				operador: []
			}
		});


		if (correciones.datos[0].estado === "PLAN DE MEJORAMIENTO FINALIZADO") {
			var r = {
				exito: false
			};
		} else {
			var r = {
				contenido: '',
				id_visita: correciones.datos[0].id_visita,
				exito: true
			}

			var visitas = query({
				tabla: "PROGRAMACION",
				campo: ["ID_VISITA", "FECHA_VISITA", "ID_PAC", "ID_USUARIO", "ID_USUARIO_PAC"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA"],
					criterio: [correciones.datos[0].id_visita],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var pac = query({
				tabla: "OFICINA",
				campo: ["OFICINA"],
				condicion: {
					condicion: true,
					campo: ["ID_OFICINA"],
					criterio: [visitas.datos[0].id_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var usuario_visita = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visitas.datos[0].id_usuario],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var usuario_atiende = query({
				tabla: "USUARIO",
				campo: ["NOMBRE"],
				condicion: {
					condicion: true,
					campo: ["ID_USUARIO"],
					criterio: [visitas.datos[0].id_usuario_pac],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var correciones_2 = query({
				tabla: "ACCION_CORRECTIVA",
				campo: ["ID_PLAN"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA", "ESTADO"],
					criterio: [correciones.datos[0].id_visita, "PENDIENTE PLAN DE MEJORAMIENTO"],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});

			var correciones_3 = query({
				tabla: "ACCION_CORRECTIVA",
				campo: ["ID_PLAN"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA", "ESTADO"],
					criterio: [correciones.datos[0].id_visita, "PLAN DE MEJORAMIENTO ABIERTO"],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});

			var visita_categoria = query({
				tabla: "VISITA_CATEGORIA",
				campo: ["ID_CATEGORIA"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA"],
					criterio: [visitas.datos[0].id_visita],
					comparador: ["IGUAL"],
					operador: []
				}
			});

			var contenido_categorias = '';
			contenido_categorias += "<ul>";

			for (var k = 0; k < visita_categoria.registros; k++) {
				var categoria = query({
					tabla: "CATEGORIA_CHECKLIST",
					campo: ["CATEGORIA"],
					condicion: {
						condicion: true,
						campo: ["ID_CATEGORIA"],
						criterio: [visita_categoria.datos[k].id_categoria],
						comparador: ["IGUAL"],
						operador: []
					}
				});
				contenido_categorias += "<li>" + categoria.datos[0].categoria + "</li>";
			}
			contenido_categorias += "</ul>";

			r.contenido += '<hr/>';
			r.contenido += '<h4><i class="material-icons">keyboard_arrow_right</i>Datos Visita:</h4>';
			r.contenido += '<hr/>';
			r.contenido += '<div class="mdl-grid">';
			r.contenido += '<div class="mdl-cell mdl-cell--6-col">';
			r.contenido += '<ul>';
			r.contenido += '<li><strong>PAC: </strong>' + pac.datos[0].oficina + '</li>';
			r.contenido += '<li><strong>Fecha visita: </strong>' + fecha_texto(visitas.datos[0].fecha_visita, "FECHA") + '</li>';
			r.contenido += '<li><strong>Realiza la visita: </strong>' + usuario_visita.datos[0].nombre + '</li>';
			r.contenido += '<li><strong>Atiende la visita: </strong>' + usuario_atiende.datos[0].nombre + '</li>';
			r.contenido += '<li><strong>Acciones Correctivas Pendientes: </strong>' + correciones_2.registros + '</li>';
			r.contenido += '<li><strong>Acciones Correctivas con Plan de Mejoramiento: </strong>' + correciones_3.registros + '</li>';
			r.contenido += '</ul>';
			r.contenido += '</div>';
			r.contenido += '<div class="mdl-cell mdl-cell--6-col">';
			r.contenido += '<ul>';
			r.contenido += '<li><strong>Listas de Verificación Evaluadas: </strong>'
			r.contenido += contenido_categorias;
			r.contenido += '</li>';
			r.contenido += '</ul>';
			r.contenido += '</div>';
			r.contenido += '</div>';
			r.contenido += '<button id="m7_5_btn_a_c_enviar_correo" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m7_5_a_c_enviar_correo_paso_1("' + correciones.datos[0].id_visita + '")>';
			r.contenido += 'ENVIAR PLAN DE MEJORAMIENTO <i class="material-icons">mail</i>';
			r.contenido += '</button>';
			r.contenido += '<hr/>';
			r.contenido += '<h4>MODIFICACIÓN PLAN DE MEJORAMIENTO</h4>';
			r.contenido += '<hr/>';
			r.contenido += '<h5><i class="material-icons">keyboard_arrow_right</i><strong>Categoría: </strong><span id="m7_5_span_a_c_plan_mejoramiento_categoria"></span></h5>';
			r.contenido += '<h5><i class="material-icons">subdirectory_arrow_right</i><strong>Ítem: </strong><span id="m7_5_span_a_c_plan_mejoramiento_item"></span></h5>';
			r.contenido += '<h5><i class="material-icons">subdirectory_arrow_right</i><strong>Plan de Mejoramiento: </strong><span id="m7_5_span_a_c_plan_mejoramiento_plan"></span></h5>';
			r.contenido += '<h5><i class="material-icons">subdirectory_arrow_right</i><strong>Fecha Vencimiento del Plan de Mejoramiento: </strong><span id="m7_5_span_a_c_plan_mejoramiento_fecha_vencimiento"></span></h5>';
			r.contenido += '<br/>';
			r.contenido += '<div id="m7_5_div_a_c_consolidado_consulta_2"></div>';
			r.contenido += '<div class="alineado_derecha">';
			r.contenido += '<a id="m7_5_a_a_c_nuevo_comentario_plan_mejoramiento" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"  onclick=m7_5_a_c_nueva_actualizacion_plan_mejoramiento("' + id_plan + '")>';
			r.contenido += '<i class="material-icons">add_comment</i>';
			r.contenido += '</a>';
			r.contenido += '</div>';
			r.contenido += '<div class="mdl-tooltip" for="m7_5_a_a_c_nuevo_comentario_plan_mejoramiento">Por favor haga clic aquí para registrar una nueva actualización del plan de mejoramiento</div>';
			r.contenido += '<br/>';
			r.contenido += '<br/>';
		}
		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_plan": id_plan
			}
		};
		var id_error = log_error("m7_5_gs_a_c_abrir_visita", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* muestra informacion de xxxxxxxxxxx en forma de tabla 
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m7_5_gs_a_c_abrir_plan_mejoramiento(param_tabla) {
	try {

		param_tabla.titulos = ["ID", "FECHA ACTUALIZACION", "ACTUALIZACION"];
		param_tabla.datos = [];

		var plan_mejoramiento = query({
			tabla: "PLAN_ACCION_CORRECTIVA",
			campo: ["ID_ACTUALIZACION_PLAN", "FECHA_ACTUALIZACION", "ACTUALIZACION"],
			condicion: {
				condicion: true,
				campo: ["ID_PLAN"],
				criterio: [param_tabla.id_plan],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var no_conformidad = query({
			tabla: "ACCION_CORRECTIVA",
			campo: ["ID_ITEM", "PLAN_MEJORAMIENTO", "FECHA_VENCIMIENTO"],
			condicion: {
				condicion: true,
				campo: ["ID_PLAN"],
				criterio: [param_tabla.id_plan],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		param_tabla.plan = no_conformidad.datos[0].plan_mejoramiento;
		if (no_conformidad.datos[0].fecha_vencimiento === "") {
			param_tabla.fecha_vencimiento = "";
		} else {
			param_tabla.fecha_vencimiento = fecha_texto(no_conformidad.datos[0].fecha_vencimiento, "FECHA");
		}


		var item = query({
			tabla: "CHECKLIST",
			campo: ["ITEM", "ID_CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ID_ITEM"],
				criterio: [no_conformidad.datos[0].id_item],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		param_tabla.item = item.datos[0].item;

		var categoria = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ID_CATEGORIA"],
				criterio: [item.datos[0].id_categoria],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		param_tabla.categoria = categoria.datos[0].categoria;

		for (var j = 0; j < plan_mejoramiento.registros; j++) {
			var fila = [];
			fila.push(plan_mejoramiento.datos[j].id_actualizacion_plan);
			fila.push(fecha_texto(plan_mejoramiento.datos[j].fecha_actualizacion, "FECHA"));
			fila.push(plan_mejoramiento.datos[j].actualizacion);
			param_tabla.datos.push(fila);
		}

		return param_tabla;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m7_5_gs_a_c_abrir_plan_mejoramiento", param, e);
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_5_gs_a_c_enviar_correo_paso_1(id_visita) {
	try {

		var r = {
			exito: true,
			mensaje: "Ya se ha hecho el envío de un Plan de Mejoramiento para esta visita."
		}

		var visita = query({
			tabla: "PROGRAMACION",
			campo: ["PLAN_MEJORAMIENTO"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		if (visita.datos[0].plan_mejoramiento === "NO") {
			r.exito = false;
			r.mensaje = "Por favor espere mientras se envia el Plan de Mejoramiento.";
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_visita": id_visita
			}
		};
		var id_error = log_error("m7_5_gs_a_c_enviar_correo_paso_1", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_5_gs_a_c_enviar_correo_paso_2(id_visita) {
	try {

		var r = {
			exito: true,
			mensaje: "Se ha enviado el Plan de Mejoramiento exitosamente"
		}
		var u = usuario();
		var visita_aseguramiento = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "FECHA_VISITA", "ID_USUARIO", "ID_PAC", "ID_USUARIO_PAC", "OBSERVACIONES", "PLAN_MEJORAMIENTO", "ESTADO"],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var usuario_visita = query({
			tabla: "USUARIO",
			campo: ["NOMBRE", "CORREO"],
			tiene_condicion: true,
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [visita_aseguramiento.datos[0].id_usuario],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var usuario_atiende = query({
			tabla: "USUARIO",
			campo: ["NOMBRE", "CORREO"],
			tiene_condicion: true,
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [visita_aseguramiento.datos[0].id_usuario_pac],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [visita_aseguramiento.datos[0].id_pac],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var regional = query({
			tabla: "REGIONAL",
			campo: ["REGIONAL"],
			tiene_condicion: true,
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [oficina.datos[0].id_regional],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		var plantilla = DriveApp.getFileById('14xKPtYpnEWGE3FDWuG5s-VMLFendQp-5ltBIY3ObgPQ');
		var d = new Date(visita_aseguramiento.datos[0].fecha_visita);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var nueva_acta = plantilla.makeCopy("Plan de Mejoramiento " + oficina.datos[0].oficina + " (" + d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + ")", folder);
		var num = nueva_acta.getId();
		var doc = DocumentApp.openById(num);

		var body = doc.getBody();
		body.replaceText('{regional}', regional.datos[0].regional);
		body.replaceText('{pac}', oficina.datos[0].oficina);
		body.replaceText('{fecha_visita}', fecha_texto(visita_aseguramiento.datos[0].fecha_visita, "FECHA"));
		body.replaceText('{realiza_visita}', usuario_visita.datos[0].nombre);
		body.replaceText('{recibe_visita}', usuario_atiende.datos[0].nombre);
		body.appendHorizontalRule();
		var celdas = [];
		celdas.push(["LISTA DE VERIFICACIÓN", "ITEM VERIFICACIÓN", "OBSERVACIÓN DURANTE LA VISITA", "ESTADO", "PLAN DE MEJORAMIENTO", "FECHA VENCIMIENTO", "ACTUALIZACIONES REALIZADAS SOBRE EL PLAN DE MEJORAMIENTO"])
		var plan = query({
			tabla: "ACCION_CORRECTIVA",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["ID_VISITA"],
				criterio: [id_visita],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		for (var j = 0; j < plan.registros; j++) {
			var item = query({
				tabla: "CHECKLIST",
				campo: ["ID_CATEGORIA", "ITEM"],
				condicion: {
					condicion: true,
					campo: ["ID_ITEM"],
					criterio: [plan.datos[j].id_item],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var lista = query({
				tabla: "CATEGORIA_CHECKLIST",
				campo: ["CATEGORIA"],
				condicion: {
					condicion: true,
					campo: ["ID_CATEGORIA"],
					criterio: [item.datos[0].id_categoria],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var visita = query({
				tabla: "VISITA",
				campo: ["OBSERVACION"],
				condicion: {
					condicion: true,
					campo: ["ID_VISITA", "ID_ITEM"],
					criterio: [id_visita, plan.datos[j].id_item],
					comparador: ["IGUAL", "IGUAL"],
					operador: ["Y"]
				}
			});
			var plan_mejoramiento = query({
				tabla: "PLAN_ACCION_CORRECTIVA",
				campo: ["FECHA_ACTUALIZACION", "ACTUALIZACION"],
				condicion: {
					condicion: true,
					campo: ["ID_PLAN"],
					criterio: [plan.datos[j].id_plan],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var contenido_plan = '';
			for (var l = 0; l < plan_mejoramiento.registros; l++) {
				contenido_plan += "-" + fecha_texto(plan_mejoramiento.datos[l].fecha_actualizacion, "FECHA") + " / " + plan_mejoramiento.datos[l].actualizacion + '\r';
			}
			var fecha_vencimiento_plan = "";
			if (plan.datos[j].fecha_vencimiento !== "") {
				fecha_vencimiento_plan = fecha_texto(plan.datos[j].fecha_vencimiento, "FECHA");
			}
			celdas.push([lista.datos[0].categoria, item.datos[0].item, visita.datos[0].observacion, plan.datos[j].estado, plan.datos[j].plan_mejoramiento, fecha_vencimiento_plan, contenido_plan]);
		}
		var tabla = body.appendTable(celdas);
		tabla.setColumnWidth(0, 100);
		tabla.setColumnWidth(1, 100);
		tabla.setColumnWidth(2, 100);
		tabla.setColumnWidth(3, 80);
		tabla.setColumnWidth(4, 110);
		tabla.setColumnWidth(5, 60);
		tabla.setColumnWidth(6, 150);
		var fila_tabla = tabla.getRow(0);
		var encabezado_tabla = {};
		encabezado_tabla[DocumentApp.Attribute.BOLD] = true;
		encabezado_tabla[DocumentApp.Attribute.BACKGROUND_COLOR] = '#99ccff';
		encabezado_tabla[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = 'CENTER';
		fila_tabla.getCell(0).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(1).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(2).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(3).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(4).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(5).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		fila_tabla.getCell(6).setAttributes(encabezado_tabla).setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		body.appendPageBreak();
		var pie_tabla = body.appendTable([["Firma del Funcionario que realiza la visita", "Firma del jefe del Punto de Atención"]]);
		pie_tabla.getRow(0).setMinimumHeight(70);
		pie_tabla.getRow(0).getCell(0).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		pie_tabla.getRow(0).getCell(1).setVerticalAlignment(DocumentApp.VerticalAlignment.BOTTOM).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
		doc.saveAndClose();
		var file = Drive.Files.get(num);
		var url = file.exportLinks['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
		var oauthToken = ScriptApp.getOAuthToken();
		var response = UrlFetchApp.fetch(url, {
			headers: {
				'Authorization': 'Bearer ' + oauthToken
			}
		});
		var blobs = [response.getBlob().setName("Plan de Mejoramiento " + oficina.datos[0].oficina + " (" + d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + ").docx")];
		GmailApp.sendEmail(
			usuario_visita.datos[0].correo + ";" + usuario_atiende.datos[0].correo,
			'VISITA DE ASEGURAMIENTO / ' + oficina.datos[0].oficina + " (" + d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + ")",
			'Cordial saludo, Adjunto se envía el Plan de Mejoramiento de la Visita de Aseguramiento realizada el día ' + d.getFullYear() + " - " + (d.getMonth() + 1) + " - " + d.getDate(),
			{
				attachments: blobs
			}
		);
		visita_aseguramiento.edicion({
			campo: ["PLAN_MEJORAMIENTO"],
			valor: ["SI"]
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_visita": id_visita
			}
		};
		var id_error = log_error("m7_5_gs_a_c_enviar_correo_paso_2", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_5_gs_a_c_guardar_actualizacion_plan_mejoramiento(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Actualizacion almacenada",
			id_plan: frm.m7_5_hid_a_c_actualizacion_plan_mejoramiento_id
		};

		var plan_mejoramiento = query({
			tabla: "PLAN_ACCION_CORRECTIVA",
			campo: [],
			condicion: {
				condicion: 0
			}
		});
		var fecha_actual = new Date();
		plan_mejoramiento.insercion({
			campo: ["ID_ACTUALIZACION_PLAN", "ID_PLAN", "FECHA_ACTUALIZACION", "ACTUALIZACION"],
			valor: ["", frm.m7_5_hid_a_c_actualizacion_plan_mejoramiento_id, fecha_texto(0, "FECHA"), frm.m7_5_txt_a_c_actualizacion_plan_mejoramiento_plan],
			index: true
		});

		var no_conformidad = query({
			tabla: "ACCION_CORRECTIVA",
			campo: ["ID_VISITA"],
			condicion: {
				condicion: true,
				campo: ["ID_PLAN"],
				criterio: [frm.m7_5_hid_a_c_actualizacion_plan_mejoramiento_id],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		no_conformidad.edicion({
			campo: ["ESTADO"],
			valor: ["PLAN DE MEJORAMIENTO ABIERTO"]
		})
		if (frm.m7_5_chk_a_c_actualizacion_plan_mejoramiento_inicio === "SI") {
			no_conformidad.edicion({
				campo: ["FECHA_VENCIMIENTO", "PLAN_MEJORAMIENTO"],
				valor: [frm.m7_5_txt_a_c_actualizacion_plan_mejoramiento_fecha_vencimiento, frm.m7_5_txt_a_c_actualizacion_plan_mejoramiento_plan]
			})
		}
		if (frm.m7_5_chk_a_c_actualizacion_plan_mejoramiento_cierre === "SI") {
			no_conformidad.edicion({
				campo: ["ESTADO"],
				valor: ["PLAN DE MEJORAMIENTO FINALIZADO"]
			})
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"frm": frm
			}
		};
		var id_error = log_error("m7_5_gs_a_c_plan_mejoramiento", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}





//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 6 - GESTION CHECKLIST
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para la carga en el front de los parametros BEPS registrados en la APP
*
* @return  {object}  objeto con la informacion de los parametros para armar la tabla
*/
function m7_6_gs_cargar_items(param_tabla) {
	try {

		param_tabla.titulos = ["ID_ITEM", "ITEM", "CATEGORIA", "ACTIVO", ""];
		param_tabla.datos = [];
		var item = query({
			tabla: "CHECKLIST",
			campo: [],
			condicion: {
				condicion: false
			}
		});
		for (var j = 0; j < item.registros; j++) {
			var fila = [];
			fila.push(item.datos[j].id_item);
			fila.push(item.datos[j].item);
			var categoria = query({
				tabla: "CATEGORIA_CHECKLIST",
				campo: ["CATEGORIA"],
				condicion: {
					condicion: true,
					campo: ["ID_CATEGORIA"],
					criterio: [item.datos[j].id_categoria],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			fila.push(categoria.datos[0].categoria);
			fila.push(item.datos[j].activo);
			fila.push('<a href="#m0_div_panel_secundario" id="m7_6_btn_item_editar" data-id_item="' + item.datos[j].id_item + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">edit</i></a>');
			param_tabla.datos.push(fila);
		}
		return param_tabla

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {

		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		log_error("m7_6_gs_cargar_items", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de categorias para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m7_6_gs_item_poblar_categoria(param_select) {
	try {

		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: true,
				campo: ["ACTIVO"],
				criterio: [1],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var rango = {
			texto: "",
			valor: "",
			selected: "selected"
		};
		param_select.datos.push(rango);
		for (var j = 0; j < categorias.registros; j++) {
			var rango = {
				texto: categorias.datos[j].categoria,
				valor: categorias.datos[j].id_categoria,
				selected: ""
			};
			param_select.datos.push(rango);
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		id_error = log_error("m7_6_gs_item_poblar_categoria", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_6_gs_poblar_formulario_item(id_item) {
	try {

		var items = query({
			tabla: "CHECKLIST",
			campo: ["ID_CATEGORIA", "ITEM", "ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_ITEM"],
				criterio: [id_item],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var r = {
			id_item: id_item,
			operacion: "EDITAR",
			item: items.datos[0].item,
			id_categoria: items.datos[0].id_categoria,
			activo: items.datos[0].activo
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_item": id_item
			}
		};
		var id_error = log_error("m7_6_gs_poblar_formulario_item", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
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
function m7_6_gs_item_manipular_guardar(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}
		if (frm.m7_6_hid_operacion === "EDITAR") {
			var items = query({
				tabla: "CHECKLIST",
				campo: ["ID_CATEGORIA", "ITEM", "ACTIVO"],
				condicion: {
					condicion: true,
					campo: ["ID_ITEM"],
					criterio: [frm.m7_6_hid_id_item],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			var chk_item = 0;
			if (frm.m7_6_chk_item_activo === "SI") {
				chk_item = 1;
			}
			items.edicion({
				campo: ["ITEM", "ID_CATEGORIA", "ACTIVO"],
				valor: [frm.m7_6_txt_item, frm.m7_6_sel_item_categoria, chk_item]
			});
		} else {
			var parametro = query({
				tabla: "CHECKLIST",
				campo: [],
				condicion: {
					condicion: 0,
				}
			});
			var chk_item = 0;
			if (frm.m7_6_chk_item_activo === "SI") {
				chk_item = 1;
			}
			parametro.insercion({
				campo: ["ID_ITEM", "ITEM", "ID_CATEGORIA", "ACTIVO"],
				valor: ["", frm.m7_6_txt_item, frm.m7_6_sel_item_categoria, chk_item],
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
		var id_error = log_error("m7_6_gs_item_manipular_guardar", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 7 - GESTION CATEGORIAS CHECKLIST
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para la carga en el front de los parametros BEPS registrados en la APP
*
* @return  {object}  objeto con la informacion de los parametros para armar la tabla
*/
function m7_7_gs_cargar_categorias(param_tabla) {
	try {

		param_tabla.titulos = ["ID_CATEGORÍA", "CATEGORÍA", "DESCRIPCION", "ACTIVO", ""];
		param_tabla.datos = [];
		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: [],
			condicion: {
				condicion: false
			}
		});
		for (var j = 0; j < categorias.registros; j++) {
			var fila = [];
			fila.push(categorias.datos[j].id_categoria);
			fila.push(categorias.datos[j].categoria);
			fila.push(categorias.datos[j].descripcion);
			fila.push(categorias.datos[j].activo);
			fila.push('<a href="#m0_div_panel_secundario" id="m7_7_a_categoria_editar" data-id_categoria="' + categorias.datos[j].id_categoria + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">edit</i></a>');
			param_tabla.datos.push(fila);
		}
		return param_tabla

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m7_7_gs_cargar_categorias", param, e);
		param_tabla.exito = false;
		param_tabla.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_tabla
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_7_gs_poblar_formulario_categoria(id_categoria) {
	try {

		var categoria = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA", "DESCRIPCION", "ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_CATEGORIA"],
				criterio: [id_categoria],
				comparador: ["IGUAL"],
				operador: []
			}
		});

		var r = {
			id_categoria: id_categoria,
			operacion: "EDITAR",
			categoria: categoria.datos[0].categoria,
			categoria_descripcion: categoria.datos[0].descripcion,
			activo: categoria.datos[0].activo
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_categoria": id_categoria
			}
		};
		var id_error = log_error("m7_7_gs_poblar_formulario_categoria", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
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
function m7_7_gs_categoria_manipular_guardar(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Datos almacenados exitosamente"
		}
		var chk_categoria = 0;
		if (frm.m7_7_chk_categoria_activo === "SI") {
			chk_categoria = 1;
		}

		if (frm.m7_7_hid_operacion === "EDITAR") {
			var categoria = query({
				tabla: "CATEGORIA_CHECKLIST",
				campo: ["ID_CATEGORIA", "CATEGORIA", "DESCRIPCION", "ACTIVO"],
				condicion: {
					condicion: true,
					campo: ["ID_CATEGORIA"],
					criterio: [frm.m7_7_hid_id_categoria],
					comparador: ["IGUAL"],
					operador: []
				}
			});
			categoria.edicion({
				campo: ["CATEGORIA", "DESCRIPCION", "ACTIVO"],
				valor: [frm.m7_7_txt_categoria, frm.m7_7_txt_categoria_descripcion, chk_categoria]
			});
		} else {
			var categoria = query({
				tabla: "CATEGORIA_CHECKLIST",
				campo: ["ID_CATEGORIA", "CATEGORIA", "DESCRIPCION", "ACTIVO"],
				condicion: {
					condicion: 0
				}
			});
			categoria.insercion({
				campo: ["ID_CATEGORIA", "CATEGORIA", "DESCRIPCION", "ACTIVO"],
				valor: ["", frm.m7_7_txt_categoria, frm.m7_7_txt_categoria_descripcion, chk_categoria],
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
		var id_error = log_error("m7_7_gs_categoria_manipular_guardar", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 8 - REPORTES VISITA DE ASEGURAMIENTO
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
function m7_8_gs_cargar_reportes(id_regional) {
	try {

		var r = {
			exito: true,
			mensaje: "Reporte cargado exitosamente",
			contenido_v_a: '',
			contenido_a_c: ''
		}

		var reporte_v_a = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M7_PROGRAMACION_VISITAS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_v_a.registros > 0) {
			r.contenido_v_a += '<button id="m2_5_btn_informe_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m7_8_js_actualizar_reporte_v_a()>';
			r.contenido_v_a += 'ACTUALIZAR INFORME >>';
			r.contenido_v_a += '</button>';
			r.contenido_v_a += '<hr />';
			r.contenido_v_a += '<br />';
			r.contenido_v_a += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_v_a.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_v_a += '<br />';
			r.contenido_v_a += 'Abrir <b>REPORTE PROGRAMACIÓN DE VISITAS</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_v_a.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_v_a += '<br />';
		} else {
			r.contenido_v_a += '<br />';
			r.contenido_v_a += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_v_a += '<br />';
		}

		var reporte_a_c = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M7_ACCIONES_CORRECTIVAS", id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		if (reporte_a_c.registros > 0) {
			r.contenido_a_c += '<button id="m2_5_btn_informe_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m7_8_js_actualizar_reporte_a_c()>';
			r.contenido_a_c += 'ACTUALIZAR INFORME >>';
			r.contenido_a_c += '</button>';
			r.contenido_a_c += '<hr />';
			r.contenido_a_c += '<br />';
			r.contenido_a_c += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte_a_c.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
			r.contenido_a_c += '<br />';
			r.contenido_a_c += 'Abrir <b>REPORTE ACCIONES CORRECTIVAS</b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte_a_c.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
			r.contenido_a_c += '<br />';
		} else {
			r.contenido_a_c += '<br />';
			r.contenido_a_c += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
			r.contenido_a_c += '<br />';
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
		var id_error = log_error("m7_8_gs_cargar_reportes", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_8_gs_actualizar_reporte_v_a_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		};

		var programacion = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "ID_USUARIO", "FECHA_VISITA", "ID_USUARIO_PAC", "ESTADO", "OBSERVACIONES"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.programacion = programacion;

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});
		r.oficinas = oficinas;

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			}
		});
		r.usuarios = usuarios;

		var visitas_categoria = query({
			tabla: "VISITA_CATEGORIA",
			campo: ["ID_VISITA", "ID_CATEGORIA"],
			condicion: {
				condicion: false
			}
		});
		r.visitas_categoria = visitas_categoria;

		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: false
			}
		});
		r.categorias = categorias;


		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m7_8_gs_actualizar_reporte_v_a_paso_1", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_8_gs_actualizar_reporte_v_a_paso_2(data) {
	try {


		var r = {
			exito: true,
			mensaje: "El reporte de Visita de Aseguramiento se ha actualizado exitosamente"
		}
		var u = usuario();

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M7_PROGRAMACION_VISITAS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var copia = file.makeCopy("REPORTE VISITAS DE ASEGURAMIENTO - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M7_PROGRAMACION_VISITAS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M7_PROGRAMACION_VISITAS", 7],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m7_controlador",
				funcion: "m7_8_gs_actualizar_reporte_v_a_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M7_PROGRAMACION_VISITAS", 7, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"data": ""
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
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_8_gs_actualizar_reporte_a_c_paso_1() {
	try {

		var r = {
			exito: true,
			mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
		};

		var acciones_correctivas = query({
			tabla: "ACCION_CORRECTIVA",
			campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO", "PLAN_MEJORAMIENTO", "FECHA_VENCIMIENTO"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.acciones_correctivas = acciones_correctivas;

		var actualizaciones = query({
			tabla: "PLAN_ACCION_CORRECTIVA",
			campo: ["ID_PLAN", "FECHA_ACTUALIZACION", "ACTUALIZACION"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.actualizaciones = actualizaciones;


		var programacion = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "ID_USUARIO", "ID_USUARIO_PAC", "FECHA_VISITA"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.programacion = programacion;

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});
		r.oficinas = oficinas;

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			}
		});
		r.usuarios = usuarios;

		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: false
			}
		});
		r.categorias = categorias;

		var items = query({
			tabla: "CHECKLIST",
			campo: ["ID_CATEGORIA", "ID_ITEM", "ITEM"],
			condicion: {
				condicion: false
			}
		});
		r.items = items;

		var visita = query({
			tabla: "VISITA",
			campo: ["ID_VISITA", "ID_ITEM", "OBSERVACION"],
			condicion: {
				condicion: false
			}
		});
		r.visita = visita;


		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m7_8_gs_actualizar_reporte_a_c_paso_1", param, e);
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
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_8_gs_actualizar_reporte_a_c_paso_2(data) {
	try {

		var r = {
			exito: true,
			mensaje: "El reporte de Acciones Correctivas se ha actualizado exitosamente"
		}
		var u = usuario();

		var reporte = query({
			tabla: "REPORTE",
			campo: ["ID_ARCHIVO"],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_REGIONAL"],
				criterio: ["M7_ACCIONES_CORRECTIVAS", u.id_regional],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			}
		});

		var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
		var folder = DriveApp.getFolderById("1cXQ1DtPfV-K0ALr4rfrLRGTfPYRAorsi");
		var copia = file.makeCopy("REPORTE ACCIONES CORRECTIVAS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);

		var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M7_ACCIONES_CORRECTIVAS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);

		var index_reporte = query({
			tabla: "INDEX_REPORTE",
			campo: [],
			condicion: {
				condicion: true,
				campo: ["REPORTE", "ID_MODULO"],
				criterio: ["M7_ACCIONES_CORRECTIVAS", 7],
				comparador: ["IGUAL", "IGUAL"],
				operador: ["Y"]
			},
			depuracion: {
				archivo: "m7_controlador",
				funcion: "m7_8_gs_actualizar_reporte_a_c_paso_2",
				variable: "index_reporte"
			}
		});

		index_reporte.edicion({
			campo: ["ACTIVO"],
			valor: [0]
		});

		index_reporte.insercion({
			campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
			valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, u.id_oficina, u.id_regional, "M7_ACCIONES_CORRECTIVAS", 7, 1, copia.getId()],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"data": ""
			}
		};
		var id_error = log_error("m7_8_gs_actualizar_reporte_v_a_paso_2", param, e);
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
* descripcion_funcion
*
* @param   {object}  parametro_1  descripcion_parametro_1
* @param   {number}  parametro_2  descripcion_parametro_2
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m7_8_gs_actualizar_reporte_general_v_a() {
	try {

		var programacion = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "ID_USUARIO", "FECHA_VISITA", "ID_USUARIO_PAC", "ESTADO", "OBSERVACIONES"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});

		var regional = query({
			tabla: "REGIONAL",
			campo: ["ID_REGIONAL", "REGIONAL"],
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

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			}
		});

		var visitas_categoria = query({
			tabla: "VISITA_CATEGORIA",
			campo: ["ID_VISITA", "ID_CATEGORIA"],
			condicion: {
				condicion: false
			}
		});

		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: false
			}
		});

		var data = [];
		var oficina;
		var id_regional;
		var contenido;
		var nombre_usuario;
		var nombre_regional;

		for (var j = 0; j < programacion.registros; j++) {
			var fila = [];

			oficina = ""
			id_regional = 0
			for (var l = 0; l < oficinas.registros; l++) {
				if (programacion.datos[j].id_pac == oficinas.datos[l].id_oficina) {
					id_regional = oficinas.datos[l].id_regional;
					oficina = oficinas.datos[l].oficina;
				}
			}
			nombre_regional = ""
			for (l = 0; l < regional.registros; l++) {
				if (id_regional == regional.datos[l].id_regional) {
					nombre_regional = regional.datos[l].regional;
				}
			}

			fila.push(programacion.datos[j].id_visita);
			fila.push(nombre_regional);
			fila.push(oficina);

			//usuario visita
			nombre_usuario = "";
			for (l = 0; l < usuarios.registros; l++) {
				if (usuarios.datos[l].id_usuario == programacion.datos[j].id_usuario) {
					nombre_usuario = usuarios.datos[l].nombre;
				}
			}
			fila.push(nombre_usuario)

			//usuario_pac
			nombre_usuario = ""
			for (l = 0; l < usuarios.registros; l++) {
				if (usuarios.datos[l].id_usuario == programacion.datos[j].id_usuario_pac) {
					nombre_usuario = usuarios.datos[l].nombre;
				}
			}
			fila.push(nombre_usuario)

			fila.push(programacion.datos[j].fecha_visita);
			fila.push(programacion.datos[j].estado);

			contenido = '';
			for (l = 0; l < visitas_categoria.registros; l++) {
				if (visitas_categoria.datos[l].id_visita == programacion.datos[j].id_visita) {
					for (var k = 0; k < categorias.registros; k++) {
						if (visitas_categoria.datos[l].id_categoria == categorias.datos[k].id_categoria) {
							contenido += '- ' + categorias.datos[k].categoria + '\r';
						}
					}
				}
			}
			fila.push(contenido)

			fila.push(programacion.datos[j].observaciones)

			data.push(fila);
		}

		var hoja_informe = SpreadsheetApp.openById("1ayrwDj-GZPZlU9tMAj-1yvnFa4Ie2TN_y5ogPdWXsoI").getSheetByName("REPORTE_GENERAL_VA");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);


		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		log_error("m7_8_gs_actualizar_reporte_general_v_a", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* descripcion_funcion
*
*/
function m7_8_gs_actualizar_reporte_general_a_c() {
	// try {

		var acciones_correctivas = query({
			tabla: "ACCION_CORRECTIVA",
			campo: ["ID_PLAN", "ID_VISITA", "ID_ITEM", "ESTADO", "PLAN_MEJORAMIENTO", "FECHA_VENCIMIENTO"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});

		var actualizaciones = query({
			tabla: "PLAN_ACCION_CORRECTIVA",
			campo: ["ID_PLAN", "FECHA_ACTUALIZACION", "ACTUALIZACION"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});

		var programacion = query({
			tabla: "PROGRAMACION",
			campo: ["ID_VISITA", "ID_PAC", "ID_USUARIO", "ID_USUARIO_PAC", "FECHA_VISITA"],
			condicion: {
				condicion: false
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});

		var oficinas = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA", "ID_REGIONAL"],
			condicion: {
				condicion: false
			}
		});

		var regional = query({
			tabla: "REGIONAL",
			campo: ["ID_REGIONAL", "REGIONAL"],
			condicion: {
				condicion: false
			}
		});

		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "NOMBRE"],
			condicion: {
				condicion: false
			}
		});

		var categorias = query({
			tabla: "CATEGORIA_CHECKLIST",
			campo: ["ID_CATEGORIA", "CATEGORIA"],
			condicion: {
				condicion: false
			}
		});

		var items = query({
			tabla: "CHECKLIST",
			campo: ["ID_CATEGORIA", "ID_ITEM", "ITEM"],
			condicion: {
				condicion: false
			}
		});

		var visita = query({
			tabla: "VISITA",
			campo: ["ID_VISITA", "ID_ITEM", "OBSERVACION"],
			condicion: {
				condicion: false
			}
		});

		var data = [];
		var id_oficina;
		var id_visita;
		var id_usuario;
		var id_usuario_pac;
		var fecha_visita;
		var id_regional;
		var nombre_regional;
		var oficina;
		var nombre_usuario;
		var observacion;

		for (var j = 0; j < acciones_correctivas.registros; j++) {
			id_oficina = "";
			id_visita = "";
			id_usuario = "";
			id_usuario_pac = "";
			fecha_visita = "";

			for (var l = 0; l < programacion.registros; l++) {
				if (acciones_correctivas.datos[j].id_visita == programacion.datos[l].id_visita) {
					id_oficina = programacion.datos[l].id_pac;
					id_visita = programacion.datos[l].id_visita;
					id_usuario = programacion.datos[l].id_usuario;
					id_usuario_pac = programacion.datos[l].id_usuario_pac;
					fecha_visita = programacion.datos[l].fecha_visita;
				}
			}

			var fila = [];

			oficina = ""
			id_regional = 0
			for (var l = 0; l < oficinas.registros; l++) {
				if (id_oficina == oficinas.datos[l].id_oficina) {
					id_regional = oficinas.datos[l].id_regional;
					oficina = oficinas.datos[l].oficina;
				}
			}
			nombre_regional = ""
			for (l = 0; l < regional.registros; l++) {
				if (id_regional == regional.datos[l].id_regional) {
					nombre_regional = regional.datos[l].regional;
				}
			}

			fila.push(acciones_correctivas.datos[j].id_plan);
			fila.push(id_visita);
			fila.push(nombre_regional);
			fila.push(oficina);
			fila.push(fecha_visita);

			nombre_usuario = "";
			for (l = 0; l < usuarios.registros; l++) {
				if (usuarios.datos[l].id_usuario == id_usuario) {
					nombre_usuario = usuarios.datos[l].nombre;
				}
			}
			fila.push(nombre_usuario);

			for (l = 0; l < items.registros; l++) {
				if (acciones_correctivas.datos[j].id_item == items.datos[l].id_item) {
					for (var k = 0; k < categorias.registros; k++) {
						if (items.datos[l].id_categoria == categorias.datos[k].id_categoria) {
							fila.push(categorias.datos[k].categoria);
						}
					}
					fila.push(items.datos[l].item)
				}
			}

			observacion = "";
			for (l = 0; l < visita.registros; l++) {
				if (acciones_correctivas.datos[j].id_visita == visita.datos[l].id_visita && acciones_correctivas.datos[j].id_item == visita.datos[l].id_item) {
					observacion = visita.datos[l].observacion;
				}
			}
			fila.push(observacion);

			fila.push(acciones_correctivas.datos[j].estado);
			fila.push(acciones_correctivas.datos[j].plan_mejoramiento);

			nombre_usuario = "";
			for (l = 0; l < usuarios.registros; l++) {
				if (usuarios.datos[l].id_usuario == id_usuario_pac) {
					nombre_usuario = usuarios.datos[l].nombre;
				}
			}
			fila.push(nombre_usuario);

			fila.push(acciones_correctivas.datos[j].fecha_vencimiento);

			var contenido = '';
			for (l = 0; l < actualizaciones.registros; l++) {
				if (actualizaciones.datos[l].id_plan == acciones_correctivas.datos[j].id_plan) {
					contenido += '-' + actualizaciones.datos[l].fecha_actualizacion + " / " + actualizaciones.datos[l].actualizacion + '\r';
				}
			}
			fila.push(contenido)
			data.push(fila);
		}

		var hoja_informe = SpreadsheetApp.openById("1eOuA_e_v9O49ytL6e9JOu2S9tc2hfi_Ww-5e7yMyULk").getSheetByName("M7_ACCIONES_CORRECTIVAS");
		hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
		hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);


		//***************************CAPTURA DE ERRORES***********************************************************************
	// } catch (e) {
	// 	var param = {
	// 		tipo_error: "codigo/GAS",
	// 		parametros: {}
	// 	};
	// 	log_error("m7_8_gs_actualizar_reporte_general_a_c", param, e);
	// }
	//***************************CAPTURA DE ERRORES***********************************************************************
}
