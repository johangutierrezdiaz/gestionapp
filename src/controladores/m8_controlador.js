//--------------------------------------------------------------------------------------------------------------------------------------------------------
/**---------------------------------------MODULO CONTROL DE LA RADICACION----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - REGISTRO INCONSISTENCIAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia informacion de agentes de rotonda para poblar el menu 
*
* @param   {object}  param_select  	objeto con el contenedor tipo select en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     						objecto con los resultados de la consulta
*/
function m8_1_gs_ir_cargar_agente_rotonda(param_select) {
	try {

		var usuario_rotonda = query({
			tabla: "USUARIO",
			campo: ["NOMBRE", "ID_USUARIO"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA", "ROL"],
				criterio: [param_select.criterio, "PAC / AGENTE ROTONDA"],
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
		var rango = {
			texto: "Punto SIN agente de rotonda",
			valor: "Punto SIN agente de rotonda",
			selected: ""
		};
		param_select.datos.push(rango);
		for (var j = 0; j < usuario_rotonda.registros; j++) {
			var rango = {
				texto: usuario_rotonda.datos[j].nombre,
				valor: usuario_rotonda.datos[j].id_usuario,
				selected: ""
			};
			param_select.datos.push(rango);
		}
		return param_select;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_tabla
		};
		var id_error = log_error("m8_1_gs_ir_cargar_agente_rotonda", param, e);
		param_select.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return param_select;
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descripcion_funcion
 *
 * @param   {object}  frm  				formulario con los datos de inconsistencias en radicacion
 *
 * @return  {object}       				objecto con los resultados de la operacion
 */
function m5_6_gs_ir_registro(frm) {
	try {

		var u = usuario();
		var r = {
			exito: true,
			mensaje: "Datos guardados exitosamente"
		}

		var radicacion = query({
			tabla: "CALIDAD_RADICACION",
			campo: [],
			condicion: {
				condicion: 0
			}
		});

		var chk_oya = false;
		if (frm.m8_1_chk_ir_caso_oya === "SI") {
			chk_oya = true;
		}
		var index_radicacion = radicacion.insercion({
			campo: [
				"ID_INCONSISTENCIA",
				"FECHA",
				"ID_USUARIO",
				"ID_OFICINA",
				"CASO_OYA",
				"ID_USUARIO_ROTONDA",
				"CASO_BIZAGI",
				"CATEGORIA_INCONSISTENCIA",
				"CAUSA_INCONSISTENCIA",
				"INCONSISTENCIA"
			],
			valor: [
				"",
				fecha_texto(0, "FECHA"),
				u.id_usuario,
				u.id_oficina,
				chk_oya,
				frm.m8_1_sel_ir_agente_rotonda,
				frm.m8_1_txt_ir_bizagi,
				frm.m8_1_sel_ir_categoria_inconsistencia,
				frm.m8_1_sel_ir_causa_inconsistencia,
				frm.m8_1_txt_ir_inconsistencia
			],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"frm": frm
			}
		};
		var id_error = log_error("m5_6_gs_ir_registro", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - REPORTE CONSOLIDADO
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
function m8_2_gs_cargar_reporte_incosistencias(id_regional) {
  try {
    
    var r = {
      exito: true,
      mensaje: "Reporte cargado exitosamente",
      contenido_inconsistencias: '',
			contenido_qof: ''
    }
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M8_REGISTRO_INCONSISTENCIAS", id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    if (reporte.registros > 0) {
      r.contenido_inconsistencias += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m8_2_js_actualizar_informe()>';
      r.contenido_inconsistencias += 'ACTUALIZAR INFORME >>';
      r.contenido_inconsistencias += '</button>';
      r.contenido_inconsistencias += '<hr />';
      r.contenido_inconsistencias += '<br />';
      r.contenido_inconsistencias += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
      r.contenido_inconsistencias += '<br />';
      r.contenido_inconsistencias += 'Abrir <b>REPORTE CONSOLIDADO INCONSISTENCIAS </b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
      r.contenido_inconsistencias += '<br />';
    } else {
      r.contenido_inconsistencias += '<br />';
      r.contenido_inconsistencias += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
      r.contenido_inconsistencias += '<br />';
    }
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M8_REGISTRO_QOF", id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    if (reporte.registros > 0) {
      r.contenido_qof += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m8_2_js_actualizar_informe_qof()>';
      r.contenido_qof += 'ACTUALIZAR INFORME >>';
      r.contenido_qof += '</button>';
      r.contenido_qof += '<hr />';
      r.contenido_qof += '<br />';
      r.contenido_qof += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
      r.contenido_qof += '<br />';
      r.contenido_qof += 'Abrir <b>REPORTE CONSOLIDADO QUEJAS O FELICITACIONES </b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
      r.contenido_qof += '<br />';
    } else {
      r.contenido_qof += '<br />';
      r.contenido_qof += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
      r.contenido_qof += '<br />';
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
    var id_error = log_error("m8_2_gs_cargar_reporte_incosistencias", param, e);
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
function m8_2_gs_actualizar_informe_paso_1() {
  try {
    
    var r = {
      exito: true,
      mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
    };
    

    var inconsistencias = query({
      tabla: "CALIDAD_RADICACION",
      campo: ["ID_INCONSISTENCIA", "FECHA", "ID_USUARIO", "ID_OFICINA", "CASO_OYA",	"ID_USUARIO_ROTONDA", "CASO_BIZAGI", "CATEGORIA_INCONSISTENCIA", "CAUSA_INCONSISTENCIA", "INCONSISTENCIA"],
      condicion: {
        condicion: false,
      },
      opciones: {
        formato_fecha: "FECHA_a_texto"
      }
    });
    r.inconsistencias = inconsistencias;
    
    var usuarios = query({
      tabla: "USUARIO",
      campo: ["ID_USUARIO", "NOMBRE"],
      condicion: {
        condicion: false
      }
    });
    r.usuarios = usuarios;
    
    var oficinas = query({
      tabla: "OFICINA",
      campo: ["ID_OFICINA", "OFICINA"],
      condicion: {
        condicion: false
      }
    });
    r.oficinas = oficinas;
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {}
    };
    var id_error = log_error("m8_2_gs_actualizar_informe_paso_1", param, e);
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
function m8_2_gs_actualizar_informe_paso_2(data) {
  try {
        
    var r = {
      exito: true,
      mensaje: "El informe de REPORTE DE INCONSISTENCIAS OYA  se ha actualizado correctamente"
    }
    var u = usuario();
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M8_REGISTRO_INCONSISTENCIAS", u.id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
    var folder = DriveApp.getFolderById("1HUYUhlIqQ-0R5a5oJWEmXlgYJqU_4K33");
    var copia = file.makeCopy("REPORTE CONSOLIDADO INCONSISTENCIAS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);
    
    var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M8_REGISTRO_INCONSISTENCIAS");
    hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
    hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);
    
    var index_reporte = query({
      tabla: "INDEX_REPORTE",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_MODULO"],
        criterio: ["M8_REGISTRO_INCONSISTENCIAS", 8],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
			depuracion: {
				archivo: "m8_controlador",
				funcion: "m8_2_gs_actualizar_informe_paso_2",
				variable: "index_reporte"
			}
    });
    
    index_reporte.edicion({
      campo: ["ACTIVO"],
      valor: [0]
    });
    
    index_reporte.insercion({
      campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
      valor: ["", fecha_texto(0, "FECHA"), u.id_usuario,  u.id_oficina, u.id_regional,"M8_REGISTRO_INCONSISTENCIAS", 8, 1, copia.getId()],
      index: true
    });
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: data
    };
    var id_error = log_error("m8_2_gs_actualizar_informe_paso_2", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para guardar los datos de la Queja o Felicitacion en la base
 *
 * @param   {object}  frm  				formulario con los datos de inconsistencias en radicacion
 *
 * @return  {object}       				objecto con los resultados de la operacion
 */
function m8_3_gs_creacion_registro_qof(frm) {
	try {

		var u = usuario();
		var r = {
			exito: true,
			mensaje: "Datos guardados exitosamente"
		}

		var qof = query({
			tabla: "QOF",
			campo: [],
			condicion: {
				condicion: 0
			}
		});

		var index_qof = qof.insercion({
			campo: [
				"ID_QOF",
				"TIPO",
				"FECHA",
				"BIZAGI",
				"ID_USUARIO",
				"ID_OFICINA",
				"OBSERVACION"
			],
			valor: [
				"",
				frm.m8_3_txt_qof_tipo_pqrs,
				fecha_texto(0, "FECHA"),
				frm.m8_3_txt_qof_bizagi,
				u.id_usuario,
				u.id_oficina,
				frm.m8_3_txt_qof_observaciones
			],
			index: true
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"frm": frm
			}
		};
		var id_error = log_error("m8_3_gs_creacion_registro_qof", param, e);
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
function m8_2_gs_actualizar_informe_qof_paso_1() {
  try {
    
    var r = {
      exito: true,
      mensaje: "Base de datos descargada, por favor espere mientras se actualiza el informe"
    };
    

    var qof = query({
      tabla: "QOF",
      campo: ["ID_QOF",	"TIPO",	"FECHA",	"BIZAGI",	"ID_USUARIO",	"ID_OFICINA",	"OBSERVACION"],
      condicion: {
        condicion: false,
      },
      opciones: {
        formato_fecha: "FECHA_a_texto"
      }
    });
    r.qof = qof;
    
    var usuarios = query({
      tabla: "USUARIO",
      campo: ["ID_USUARIO", "NOMBRE"],
      condicion: {
        condicion: false
      }
    });
    r.usuarios = usuarios;
    
    var oficinas = query({
      tabla: "OFICINA",
      campo: ["ID_OFICINA", "OFICINA"],
      condicion: {
        condicion: false
      }
    });
    r.oficinas = oficinas;
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {}
    };
    var id_error = log_error("m8_2_gs_actualizar_informe_qof_paso_1", param, e);
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
function m8_2_gs_actualizar_informe_qof_paso_2(data) {
  try {
    
    var r = {
      exito: true,
      mensaje: "El informe de REPORTE DE QUEJAS O FELICITACIONES  se ha actualizado correctamente"
    }
    var u = usuario();
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M8_REGISTRO_QOF", u.id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
    var folder = DriveApp.getFolderById("1HUYUhlIqQ-0R5a5oJWEmXlgYJqU_4K33");
    var copia = file.makeCopy("REPORTE CONSOLIDADO QUEJAS O FELICITACIONES - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);
    
    var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M8_REGISTRO_QOF");
    hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
    hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);
    
    var index_reporte = query({
      tabla: "INDEX_REPORTE",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_MODULO"],
        criterio: ["M8_REGISTRO_QOF", 8],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
			depuracion: {
				archivo: "m8_controlador",
				funcion: "m8_2_gs_actualizar_informe_qof_paso_2",
				variable: "index_reporte"
			}
    });
    
    index_reporte.edicion({
      campo: ["ACTIVO"],
      valor: [0]
    });
    
    index_reporte.insercion({
      campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
      valor: ["", fecha_texto(0, "FECHA"), u.id_usuario,  u.id_oficina, u.id_regional,"M8_REGISTRO_QOF", 8, 1, copia.getId()],
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
    var id_error = log_error("m8_2_gs_actualizar_informe_qof_paso_2", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}
