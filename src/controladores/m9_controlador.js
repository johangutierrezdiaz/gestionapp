//--------------------------------------------------------------------------------------------------------------------------------------------------------
/**---------------------------------------MODULO PLAN ESTRATEGICO----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//INICIALIZACION DE BASE DE DATOS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

/**
 * Descarga los datos con los que trabajara el modulo
 *
 * @param   {string}  dataset  Indica que conjunto de datos se descargara para el modulo. ("ALL" -> para descargar todos los datasets)
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_gs_inicializacion_bd() {
	try {

		var r = {
			fecha_sincronizacion: fecha_texto(0, "FECHA_HORA"),
			mensaje: "Bases de Objetivos, Estrategias e Indicadores",
			exito: true
		}
		var u = usuario();

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
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "oficinas"
			}
		});
		r.oficina = oficina;

		var usuario_query = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO", "USUARIO", "CORREO", "NOMBRE", "CARGO", "ROL", "AREA", "ACTIVO", "ID_OFICINA"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "usuario"
			}
		});
		r.usuario = usuario_query

		var estrategia = query({
			tabla: "ESTRATEGIA",
			campo: ["ID_ESTRATEGIA", "ESTRATEGIA", "DESARROLLO_ESTRATEGIA", "ID_AUTOR", "FECHA_CREACION", "ID_REGIONAL", "ACTIVO", "AREA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [u.id_regional],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "estrategia"
			},
			opciones: {
				formato_fecha: "FECHA_HORA_a_texto"
			}
		});
		r.estrategia = estrategia

		var objetivo = query({
			tabla: "OBJETIVO_ESTRATEGICO",
			campo: ["ID_OBJETIVO", "OBJETIVO_ESTRATEGICO", "OBJETIVO_ESTRATEGICO_NACIONAL", "ID_AUTOR", "FECHA_CREACION", "ACTIVO", "AREA"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [u.id_regional],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "objetivo"
			},
			opciones: {
				formato_fecha: "FECHA_HORA_a_texto"
			}
		});
		r.objetivo = objetivo

		var indicador = query({
			tabla: "INDICADOR",
			campo: ["ID_INDICADOR", "INDICADOR", "DESARROLLO_INDICADOR", "ID_AUTOR", "FECHA_CREACION", "ACTIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_REGIONAL"],
				criterio: [u.id_regional],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "indicador"
			},
			opciones: {
				formato_fecha: "FECHA_HORA_a_texto"
			}
		});
		r.indicador = indicador

		var plan_estrategico = query({
			tabla: "PLAN_ESTRATEGICO",
			campo: ["ID_PE", "ID_OBJETIVO", "ID_ESTRATEGIA", "ID_INDICADOR", "META", "PERIODICIDAD", "FECHA_INICIO", "FECHA_FIN", "ID_USUARIO_LIDER_PE", "AREA", "CONCLUSIONES", "ESTADO"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "plan_estrategico"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.plan_estrategico = plan_estrategico;

		var seguimiento_pe = query({
			tabla: "SEGUIMIENTO_PLAN_ESTRATEGICO",
			campo: ["ID_SEGUIMIENTO", "ID_PE", "VALOR_AVANCE_INDICADOR", "PERIODO_AVANCE_INDICADOR", "TIPO_VALOR_AVANCE_INDICADOR", "ID_USUARIO_AVANCE", "FECHA_SEGUIMIENTO", "OBSERVACIONES_LIDER_ESTRATEGIA", "OBSERVACIONES_SEGUIMIENTO"],
			condicion: {
				condicion: false
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_gs_inicializacion_bd",
				variable: "seguimiento_pe"
			},
			opciones: {
				formato_fecha: "FECHA_a_texto"
			}
		});
		r.seguimiento_pe = seguimiento_pe;

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {}
		};
		var id_error = log_error("m9_gs_inicializacion_bd", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - CREACION PLAN ESTRATEGICO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################



//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar el nuevo objetivo estrategico
 *
 * @param   {object}  frm  objeto formulario con la info para el nuevo objetivo estrategico
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_crear_objetivo(frm) {
	try {

		var r = {
			exito: true,
		}
		if (frm.m9_1_hid_creacion_pe_nuevo_objetivo_operacion === "INSERCION") {
			r.mensaje = "Objetivo Estratégico creado exitosamente.";
		} else {
			r.mensaje = "Objetivo Estratégico modificado exitosamente. ";
		}

		var u = usuario();
		var f = new Date()

		if (frm.m9_1_hid_creacion_pe_nuevo_objetivo_operacion === "INSERCION") {

			var objetivo = query({
				tabla: "OBJETIVO_ESTRATEGICO",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_objetivo",
					variable: "objetivo"
				}
			});

			objetivo.insercion({
				campo: ["ID_OBJETIVO", "OBJETIVO_ESTRATEGICO_NACIONAL", "OBJETIVO_ESTRATEGICO", "ID_AUTOR", "FECHA_CREACION", "ID_REGIONAL", "ACTIVO", "AREA"],
				valor: ["", frm.m9_1_sel_creacion_pe_nuevo_objetivo_estrategico_nacional, frm.m9_1_txt_creacion_pe_nuevo_objetivo_objetivo, u.id_usuario, f, u.id_regional, 1, u.area],
				index: true
			});

		} else {

			var objetivo = query({
				tabla: "OBJETIVO_ESTRATEGICO",
				campo: ["ID_OBJETIVO"],
				condicion: {
					condicion: true,
					campo: ["ID_OBJETIVO"],
					criterio: [frm.m9_1_hid_creacion_pe_nuevo_objetivo_id_objetivo],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_objetivo",
					variable: "objetivo"
				}
			});

			objetivo.edicion({
				campo: ["OBJETIVO_ESTRATEGICO", "OBJETIVO_ESTRATEGICO_NACIONAL"],
				valor: [frm.m9_1_txt_creacion_pe_nuevo_objetivo_objetivo, frm.m9_1_sel_creacion_pe_nuevo_objetivo_estrategico_nacional],
			});

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_crear_objetivo", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar el nuevo indicador
 *
 * @param   {object}  frm  objeto formulario con la info para el nuevo indicador
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_crear_indicador(frm) {
	try {

		var r = {
			exito: true,
		}
		if (frm.m9_1_hid_creacion_pe_nuevo_indicador_operacion === "INSERCION") {
			r.mensaje = "Indicador creado exitosamente.";
		} else {
			r.mensaje = "Indicador modificado exitosamente. ";
		}

		var u = usuario();
		var f = new Date()

		if (frm.m9_1_hid_creacion_pe_nuevo_indicador_operacion === "INSERCION") {
			var indicador = query({
				tabla: "INDICADOR",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_indicador",
					variable: "indicador"
				}
			});

			indicador.insercion({
				campo: ["ID_INDICADOR", "INDICADOR", "DESARROLLO_INDICADOR", "ID_AUTOR", "FECHA_CREACION", "ID_REGIONAL", "ACTIVO"],
				valor: ["", frm.m9_1_txt_creacion_pe_nuevo_indicador, frm.m9_1_txt_creacion_pe_nuevo_indicador_desarrollo, u.id_usuario, f, u.id_regional, 1],
				index: true
			});

		} else {
			var indicador = query({
				tabla: "INDICADOR",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["ID_INDICADOR"],
					criterio: [frm.m9_1_hid_creacion_pe_nuevo_indicador_id_indicador],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_indicador",
					variable: "indicador"
				}
			});

			indicador.edicion({
				campo: ["INDICADOR", "DESARROLLO_INDICADOR"],
				valor: [frm.m9_1_txt_creacion_pe_nuevo_indicador, frm.m9_1_txt_creacion_pe_nuevo_indicador_desarrollo],
			});

		}


		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_crear_objetivo", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar la nueva estrategia
 *
 * @param   {object}  frm  objeto formulario con la info para la nueva estrategia
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_crear_estrategia(frm) {
	try {

		var r = {
			exito: true,
		}
		if (frm.m9_1_txt_creacion_pe_nueva_estrategia_operacion === "INSERCION") {
			r.mensaje = "Estrategia creada exitosamente.";
		} else {
			r.mensaje = "Estrategia modificada exitosamente. ";
		}

		var u = usuario();
		var f = new Date()

		if (frm.m9_1_txt_creacion_pe_nueva_estrategia_operacion === "INSERCION") {

			var estrategia = query({
				tabla: "ESTRATEGIA",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_estrategia",
					variable: "estrategia"
				}
			});

			var id = estrategia.insercion({
				campo: ["ID_ESTRATEGIA", "ESTRATEGIA", "DESARROLLO_ESTRATEGIA", "ID_AUTOR", "FECHA_CREACION", "ID_REGIONAL", "ACTIVO"],
				valor: ["", frm.m9_1_txt_creacion_pe_nueva_estrategia, frm.m9_1_txt_creacion_pe_nueva_estrategia_desarrollo, u.id_usuario, f, u.id_regional, 1],
				index: true
			});

			r.id_estrategia = id.id;
			r.estrategia = frm.m9_1_txt_creacion_pe_nueva_estrategia;

		} else {
			var estrategia = query({
				tabla: "ESTRATEGIA",
				campo: ["ID_ESTRATEGIA"],
				condicion: {
					condicion: true,
					campo: ["ID_ESTRATEGIA"],
					criterio: [frm.m9_1_txt_creacion_pe_nueva_estrategia_id_estrategia],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_estrategia",
					variable: "estrategia"
				}
			});

			estrategia.edicion({
				campo: ["ESTRATEGIA", "DESARROLLO_ESTRATEGIA"],
				valor: [frm.m9_1_txt_creacion_pe_nueva_estrategia, frm.m9_1_txt_creacion_pe_nueva_estrategia_desarrollo],
			});

			r.id_estrategia = frm.m9_1_txt_creacion_pe_nueva_estrategia_id_estrategia;
			r.estrategia = frm.m9_1_txt_creacion_pe_nueva_estrategia;
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_crear_estrategia", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar el plan estrategico
 *
 * @param   {object}  frm  objeto formulario con la info para el nuevo plan estrategico
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_crear_pe(frm) {
	try {

		if (frm.m9_1_hid_creacion_pe_pe_operacion === "INSERCION") {

			var r = {
				exito: true,
				mensaje: "Plan Estratégico creado exitosamente. Para visualizarlo haga clic en la opción <<Ver Plan Estratégico - de la sub seccion Objetivos Estratégicos>>"
			}

			var u = usuario();
			var f = new Date();

			var pe = query({
				tabla: "PLAN_ESTRATEGICO",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_pe",
					variable: "pe"
				}
			});

			var id = pe.insercion({
				campo: ["ID_PE", "PERIODICIDAD", "ID_OBJETIVO", "ID_ESTRATEGIA", "ID_INDICADOR", "META", "FECHA_INICIO", "FECHA_FIN", "ID_USUARIO_LIDER_PE", "AREA", "ESTADO"],
				valor: ["", frm.m9_1_txt_creacion_pe_pe_periodicidad, frm.m9_1_sel_creacion_pe_pe_objetivo, frm.m9_1_hid_creacion_pe_pe_id_estrategia, frm.m9_1_sel_creacion_pe_pe_indicador, "'" + frm.m9_1_txt_creacion_pe_pe_meta, frm.m9_1_txt_creacion_pe_pe_fecha_inicio, frm.m9_1_txt_creacion_pe_pe_fecha_fin, u.id_usuario, u.area, "CREADA"],
				index: true
			});

			r.id_pe = id.id;

		} else {

			var r = {
				exito: true,
				mensaje: "Plan Estratégico editado exitosamente. Para visualizarlo haga clic en la opción <<Ver Plan Estratégico - de la sub seccion Objetivos Estratégicos>>"
			}

			var u = usuario();
			var f = new Date();

			var pe = query({
				tabla: "PLAN_ESTRATEGICO",
				campo: [],
				condicion: {
					condicion: true,
					campo: ["ID_PE"],
					criterio: [frm.m9_1_hid_creacion_pe_pe_id_pe],
					comparador: ["IGUAL"],
					operador: []
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_pe",
					variable: "pe"
				}
			});

			var modificaciones_pe = '<b>Periodicidad : </b> ' + pe.datos[0].periodicidad + ' / ' + frm.m9_1_txt_creacion_pe_pe_periodicidad + '<br/>';
			modificaciones_pe += '<b>Id Objetivo Estratégico : </b> ' + pe.datos[0].id_objetivo + ' / ' + frm.m9_1_sel_creacion_pe_pe_objetivo + '<br/>';
			modificaciones_pe += '<b>Id Estrategia : </b> ' + pe.datos[0].id_estrategia + ' / ' + frm.m9_1_hid_creacion_pe_pe_id_estrategia + '<br/>';
			modificaciones_pe += '<b>Id Indicador : </b> ' + pe.datos[0].id_indicador + ' / ' + frm.m9_1_sel_creacion_pe_pe_indicador + '<br/>';
			modificaciones_pe += '<b>Meta : </b> ' + pe.datos[0].meta + ' / ' + frm.m9_1_txt_creacion_pe_pe_meta + '<br/>';
			modificaciones_pe += '<b>Fecha Inicio : </b> ' + fecha_texto(pe.datos[0].fecha_inicio, "FECHA") + ' / ' + frm.m9_1_txt_creacion_pe_pe_fecha_inicio + '<br/>';
			modificaciones_pe += '<b>Fecha Fin : </b> ' + fecha_texto(pe.datos[0].fecha_fin, "FECHA") + ' / ' + frm.m9_1_txt_creacion_pe_pe_fecha_fin;

			var id = pe.edicion({
				campo: ["PERIODICIDAD", "ID_OBJETIVO", "ID_ESTRATEGIA", "ID_INDICADOR", "META", "FECHA_INICIO", "FECHA_FIN"],
				valor: [frm.m9_1_txt_creacion_pe_pe_periodicidad, frm.m9_1_sel_creacion_pe_pe_objetivo, frm.m9_1_hid_creacion_pe_pe_id_estrategia, frm.m9_1_sel_creacion_pe_pe_indicador, "'" + frm.m9_1_txt_creacion_pe_pe_meta, frm.m9_1_txt_creacion_pe_pe_fecha_inicio, frm.m9_1_txt_creacion_pe_pe_fecha_fin],
			});

			var seguimiento_pe = query({
				tabla: "SEGUIMIENTO_PLAN_ESTRATEGICO",
				campo: [],
				condicion: {
					condicion: 0
				},
				depuracion: {
					archivo: "m9_controlador",
					funcion: "m9_1_gs_creacion_pe_crear_pe",
					variable: "seguimiento_pe"
				}
			});

			seguimiento_pe.insercion({
				campo: ["ID_SEGUIMIENTO", "ID_PE",  "TIPO_VALOR_AVANCE_INDICADOR", "ID_USUARIO_AVANCE", "FECHA_SEGUIMIENTO", "OBSERVACIONES_LIDER_ESTRATEGIA"],
				valor: ["", frm.m9_1_hid_creacion_pe_pe_id_pe, "MODIFICACION PLAN ESTRATEGICO", u.id_usuario, f, modificaciones_pe],
				index: true
			});


		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_crear_pe", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para eliminar el objetivo
 *
 * @param   {number}  id_objetivo  	id del objetivo a eliminar
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_eliminar_objetivo(id_objetivo) {
	try {

		var r = {
			exito: true,
			mensaje: "Objetivo Estratégico eliminado exitosamente. En unos segundos se actualizará las bases de Objetivos, Estrategias e Indicadores"
		}

		var objetivo = query({
			tabla: "OBJETIVO_ESTRATEGICO",
			campo: ["ID_OBJETIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_OBJETIVO"],
				criterio: [id_objetivo],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_eliminar_objetivo",
				variable: "objetivo"
			}
		});


		if (objetivo.registros > 0) {
			objetivo.borrado();
		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: id_objetivo
		};
		var id_error = log_error("m9_1_gs_creacion_pe_eliminar_objetivo", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para eliminar el indicador
 *
 * @param   {number}  id_indicador  	id del objetivo a eliminar
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_eliminar_indicador(id_indicador) {
	try {

		var r = {
			exito: true,
			mensaje: "Indicador eliminado exitosamente"
		}

		var indicador = query({
			tabla: "INDICADOR",
			campo: ["ID_INDICADOR"],
			condicion: {
				condicion: true,
				campo: ["ID_INDICADOR"],
				criterio: [id_indicador],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_eliminar_indicador",
				variable: "indicador"
			}
		});

		if (indicador.registros > 0) {
			indicador.borrado();

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: id_indicador
		};
		var id_error = log_error("m9_1_gs_creacion_pe_eliminar_indicador", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para eliminar la estrategia
 *
 * @param   {number}  id_estrategia  	id de la estrategia a eliminar
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_eliminar_estrategia(id_estrategia) {
	try {

		var r = {
			exito: true,
			mensaje: "Estrategia eliminada exitosamente"
		}

		var estrategia = query({
			tabla: "ESTRATEGIA",
			campo: ["ID_ESTRATEGIA"],
			condicion: {
				condicion: true,
				campo: ["ID_ESTRATEGIA"],
				criterio: [id_estrategia],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_eliminar_estrategia",
				variable: "estrategia"
			}
		});

		if (estrategia.registros > 0) {
			estrategia.borrado();

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: id_estrategia
		};
		var id_error = log_error("m9_1_gs_creacion_pe_eliminar_estrategia", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para eliminar un plan estrategico
 *
 * @param   {number}  id_seguimiento  	id del plan estrategico a eliminar
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_eliminar_seguimiento_pe(id_seguimiento) {
	try {

		var r = {
			exito: true,
			mensaje: "Registro de seguimiento eliminado exitosamente"
		}

		var seguimiento_pe = query({
			tabla: "SEGUIMIENTO_PLAN_ESTRATEGICO",
			campo: ["ID_PE"],
			condicion: {
				condicion: true,
				campo: ["ID_SEGUIMIENTO"],
				criterio: [id_seguimiento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_eliminar_seguimiento_pe",
				variable: "seguimiento_pe"
			}
		});

		if (seguimiento_pe.registros > 0) {
			seguimiento_pe.borrado();

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: id_seguimiento
		};
		var id_error = log_error("m9_1_gs_creacion_pe_eliminar_seguimiento_pe", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar el plan estrategico
 *
 * @param   {object}  frm  objeto formulario con la info para el nuevo plan estrategico
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_crear_seguimiento_pe(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Seguimiento de estrategia registrado exitosamente.",
			id_pe: frm.m9_1_hid_creacion_pe_seguimiento_pe_id_pe
		}

		var u = usuario();
		var f = new Date();

		var seguimiento_pe = query({
			tabla: "SEGUIMIENTO_PLAN_ESTRATEGICO",
			campo: [],
			condicion: {
				condicion: 0
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_crear_seguimiento_pe",
				variable: "seguimiento_pe"
			}
		});

		seguimiento_pe.insercion({
			campo: ["ID_SEGUIMIENTO", "ID_PE", "VALOR_AVANCE_INDICADOR", "PERIODO_AVANCE_INDICADOR", "TIPO_VALOR_AVANCE_INDICADOR", "ID_USUARIO_AVANCE", "FECHA_SEGUIMIENTO", "OBSERVACIONES_LIDER_ESTRATEGIA"],
			valor: ["", frm.m9_1_hid_creacion_pe_seguimiento_pe_id_pe, "'" + frm.m9_1_txt_creacion_pe_seguimiento_pe_valor_indicador, frm.m9_1_txt_creacion_pe_seguimiento_pe_periodo, frm.m9_1_sel_creacion_pe_seguimiento_pe_tipo_registro, u.id_usuario, f, frm.m9_1_txt_creacion_pe_seguimiento_pe_observaciones_responsable],
			index: true
		});


		var pe = query({
			tabla: "PLAN_ESTRATEGICO",
			campo: ["ID_PE"],
			condicion: {
				condicion: true,
				campo: ["ID_PE"],
				criterio: [frm.m9_1_hid_creacion_pe_seguimiento_pe_id_pe],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_crear_seguimiento_pe",
				variable: "pe"
			}
		});

		if (frm.m9_1_sel_creacion_pe_seguimiento_pe_tipo_registro === "CIERRE ESTRATEGIA") {
			pe.edicion({
				campo: ["CONCLUSIONES", "ESTADO"],
				valor: [frm.m9_1_txt_creacion_pe_seguimiento_pe_conclusiones, "FINALIZADO"],
			});

		} else {
			pe.edicion({
				campo: ["ESTADO"],
				valor: ["EN SEGUIMIENTO"],
			});

		}

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_crear_seguimiento_pe", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para almacenar el plan estrategico
 *
 * @param   {object}  frm  objeto formulario con la info para el nuevo plan estrategico
 *
 * @return  {object}       objecto con los resultados de la operacion
 */
function m9_1_gs_creacion_pe_observaciones_seguimiento_pe(frm) {
	try {

		var r = {
			exito: true,
			mensaje: "Observaciones registradas exitosamente."
		}

		var seguimiento_pe = query({
			tabla: "SEGUIMIENTO_PLAN_ESTRATEGICO",
			campo: ["ID_PE"],
			condicion: {
				condicion: true,
				campo: ["ID_SEGUIMIENTO"],
				criterio: [frm.m9_1_hid_creacion_pe_seguimiento_pe_id_seguimiento],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_creacion_pe_observaciones_seguimiento_pe",
				variable: "seguimiento_pe"
			}
		});

		r.id_pe = seguimiento_pe.datos[0].id_pe;

		seguimiento_pe.edicion({
			campo: ["OBSERVACIONES_SEGUIMIENTO"],
			valor: [frm.m9_1_txt_creacion_pe_seguimiento_pe_observaciones_seguimiento]
		});

		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		var id_error = log_error("m9_1_gs_creacion_pe_observaciones_seguimiento_pe", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * funcion para eliminar un plan estrategico
 *
 * @param   {number}  id_seguimiento  	id del plan estrategico a eliminar
 *
 * @return  {object}       					objecto con los resultados de la operacion
 */
function m9_1_gs_a_creacion_pe_eliminacion_pe(id_pe) {
	try {

		var r = {
			exito: true,
			mensaje: "Plan Estratégico eliminado exitosamente"
		}

		var pe = query({
			tabla: "PLAN_ESTRATEGICO",
			campo: ["ID_OBJETIVO"],
			condicion: {
				condicion: true,
				campo: ["ID_PE"],
				criterio: [id_pe],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "m9_controlador",
				funcion: "m9_1_gs_a_creacion_pe_eliminacion_pe",
				variable: "seguimiento_pe"
			}
		});

		r.id_objetivo = pe.datos[0].id_objetivo

		if (pe.registros > 0) {
			pe.borrado();
		}


		return r;

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: id_pe
		};
		var id_error = log_error("m9_1_gs_a_creacion_pe_eliminacion_pe", param, e);
		r.exito = false;
		r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
		return r
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}



//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - REPORTES CONSOLIDADO
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
function m9_2_gs_cargar_reportes(id_regional) {
  try {
    
    var r = {
      exito: true,
      mensaje: "Reporte cargado exitosamente",
      contenido: ''
    }
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M9_PLAN_ESTRATEGICO", id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    if (reporte.registros > 0) {
      r.contenido += '<button id="m9_2_btn_actualizar_pe_objetivos" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick=m9_2_js_actualizar_pe()>';
      r.contenido += 'ACTUALIZAR INFORME >>';
      r.contenido += '</button>';
      r.contenido += '<hr />';
      r.contenido += '<br />';
      r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
      r.contenido += '<br />';
      r.contenido += 'Abrir <b>REPORTE CONSOLIDADO PLANES ESTRATÉGICOS </b> en: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">DRIVE >></a>';
      r.contenido += '<br />';
    } else {
      r.contenido += '<br />';
      r.contenido += '<div class=" aviso_error">SU REGIONAL NO TIENE ACTIVO ESTE REPORTE</div>';
      r.contenido += '<br />';
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
    var id_error = log_error("m9_2_gs_cargar_reportes", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


/**
* descripcion_funcion
*
* @param   {object}  data  Los datos a insertar en el reporte
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m9_2_gs_actualizar_pe(data) {
  try {
    
    var r = {
      exito: true,
      mensaje: "El informe de PLANES ESTRATÉGICOS se ha actualizado correctamente"
    }
    var u = usuario();
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M9_PLAN_ESTRATEGICO", u.id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
    var folder = DriveApp.getFolderById("1HUYUhlIqQ-0R5a5oJWEmXlgYJqU_4K33");
    var copia = file.makeCopy("REPORTE PLANES ESTRATÉGICOS - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);
    
    var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M9_PLAN_ESTRATEGICO");
    hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
    hoja_informe.getRange(2, 1, data.length, data[0].length).setValues(data);
    
    var index_reporte = query({
      tabla: "INDEX_REPORTE",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_MODULO"],
        criterio: ["M9_PLAN_ESTRATEGICO", 9],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
			depuracion: {
				archivo: "m8_controlador",
				funcion: "m9_2_gs_actualizar_pe",
				variable: "index_reporte"
			}
    });
    
    index_reporte.edicion({
      campo: ["ACTIVO"],
      valor: [0]
    });
    
    index_reporte.insercion({
      campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
      valor: ["", fecha_texto(0, "FECHA"), u.id_usuario,  u.id_oficina, u.regional,"M9_PLAN_ESTRATEGICO", 9, 1, copia.getId()],
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
    var id_error = log_error("m9_2_gs_actualizar_pe", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}
