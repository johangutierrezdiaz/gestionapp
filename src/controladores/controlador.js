//*******************************************************************************************************************************************************
//VARIABLES GLOBALES DE LA APLICACION
//*******************************************************************************************************************************************************
var LINK_APP_PRODUCCION = "https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec";
//var LINK_APP_PRODUCCION = "https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbyaDWdbSfOHB_FZ3jwb-Ih5JqGdi6DQQwJEPqDckYE/dev";
var LINK_APP_PRODUCCION_USUARIO = "https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbyo0y4hIdBxU14RYBRaB4S0DbS0wb5fpLs-J2VuOoBT6jAv16Y/exec";
//var LINK_APP_PRODUCCION_USUARIO = "https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbwtS6M3vr6G7yighXQVP9VfYF7qzXsC3MfzILcNXyA/dev";
/**
* funcion de inicio de la APP
*
* @param   {object}  e  objecto con los valores parametros del llamado web
*
* @return  {string}     cadena html que sera publicado en la pagina
*/
function doGet(e) {
	var r;
	var accion = "index"
	if (e.queryString !== "") {
		accion = "m" + e.parameter.m + "_gs_" + e.parameter.f;
	}
	switch (accion) {
		case "index":
			var html = HtmlService.createTemplateFromFile('index');
			html.tipo_carga = accion;
			html.param = {};
			r = html.evaluate().setTitle('Gestión.APP').setSandboxMode(HtmlService.SandboxMode.NATIVE);
			r.addMetaTag('viewport', 'width=device-width, initial-scale=1');
			break;
		case "m3_gs_eliminar_evento":
			var html = HtmlService.createTemplateFromFile('index');
			html.tipo_carga = accion;
			html.param = {
				id_evento: e.parameter.id
			}
			r = html.evaluate().setTitle('Gestión.APP').setSandboxMode(HtmlService.SandboxMode.NATIVE);
			r.addMetaTag('viewport', 'width=device-width, initial-scale=1');
			break;
		case "m0_gs_obtener_usuario":
			var u = m0_gs_obtener_usuario(e.parameter.u)
			r = ContentService.createTextOutput(JSON.stringify(u));
			break;
	}
	return (r);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga contenido html dentro del index, si tiene contenido del servidor, lo ejecuta antes de cargarlo.
*
* @param   {object}  param         Objecto con el parametro "filename" esencial para la ejecucion de la funcion y abierto para almacenar informacion adicional
*
* @return  {object}                Objecto con el contenido a mostrar del archivo, mas la informacion adicional que ya traia
*/
function include(param) {
	try {
		param.exito = true;
		param.contenido = "";
		if (param.filename === "") {
			param.exito = false;
			//***************************VALIDACION 1***********************************************************************
			var e = {
				fileName: "modelo",
				lineNumber: "N/A",
				message: "No existe contenido para mostrar"
			};
			var param = {
				tipo_error: "validacion",
				parametros: param,
			};
			log_error("include", param, e);
			//***************************VALIDACION 1***********************************************************************
		} else {
			if (verificar_acceso(param.id_privilegio)) {
				param.contenido = HtmlService.createTemplateFromFile(param.filename).evaluate().getContent();
			} else {
				param.exito = false;
			}
		}
		return param;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param,
		};
		log_error("include", param, e);
	}
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga los archivos js asociados a cada modulo
*
* @return  {string}  variable con la suma del contenido de todos los archivos js de la APP (1 js por modulo)
*/
function carga_configuracion_inicial() {
	try {
		var contenido = "";
		var privilegio;
		var param;
		var js;
		var css;
		var u = usuario();
		param = include({
			filename: 'vista/css/lib/material_icons',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/css/lib/material_design',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/lib/material_design',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/lib/jquery',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/css/lib/jquery_ui',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/lib/jquery_ui',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/css/lib/datatable_jquery',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/lib/datatable_jquery',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/css/lib/timepicker_jquery',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/lib/timepicker_jquery',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/css/css',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		param = include({
			filename: 'vista/js/js.js',
			id_privilegio: '0_0'
		})
		if (param.exito) {
			contenido += param.contenido;
		}
		for (var j = 0; j < u.modulos.length; j++) {
			privilegio = u.modulos[j].id_modulo + "_0";
			js = "vista/js/js_m" + u.modulos[j].id_modulo + ".js";
			param = include({
				filename: js,
				id_privilegio: privilegio
			});
			if (param.exito) {
				contenido += param.contenido;
			}
		}
		return contenido;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {},
		};
		log_error("carga_configuracion_inicial", param, e);
	}
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar la informacion de las oficinas en el select de admon de usuarios
*
* @param   {object}    param_select      objecto con la informacion para ejecutar el m0_js_poblar_menu
*
* @return  {object}                      objecto con la informacion para llenar el select 
*/
function m0_gs_modificar_oficina_base_llenar_formulario_oficinas(param_select) {
	try {
		var usuario_delegacion = query({
			tabla: "USUARIO_DELEGACION",
			campo: ["ID_OFICINA_ALTERNA", "ID_OFICINA_BASE"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [param_select.criterio],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				funcion: "m0_gs_modificar_oficina_base_llenar_formulario_oficinas",
				variable: "usuario_delegacion",
				archivo: "controlador"
			}
		});
		var oficina_base = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [usuario_delegacion.datos[0].id_oficina_base],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "controlador",
				funcion: "m0_gs_modificar_oficina_base_llenar_formulario_oficinas",
				variable: "oficina_base"
			}
		});
		var oficina_alterna = query({
			tabla: "OFICINA",
			campo: ["ID_OFICINA", "OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [usuario_delegacion.datos[0].id_oficina_alterna],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				archivo: "controlador",
				funcion: "m0_gs_modificar_oficina_base_llenar_formulario_oficinas",
				variable: "oficina_alterna"
			}
		});
		var rango = {
			texto: oficina_base.datos[0].oficina,
			valor: oficina_base.datos[0].id_oficina,
			selected: "selected"
		};
		param_select.datos.push(rango);
		var rango = {
			texto: oficina_alterna.datos[0].oficina,
			valor: oficina_alterna.datos[0].id_oficina,
			selected: ""
		};
		param_select.datos.push(rango);
		return param_select;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: param_select
		};
		log_error("m1_gs_manipular_usuarios_llenar_formulario_oficinas", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

function m0_gs_modificar_oficina_base_guardar(frm) {
	try {
		mensaje = "Datos guardados exitosamente";
		var usuarios = query({
			tabla: "USUARIO",
			campo: ["ID_USUARIO"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [frm.m0_hid_id_usuario],
				comparador: ["IGUAL"],
				operador: []
			},
			depuracion: {
				funcion: "m0_gs_modificar_oficina_base_guardar",
				variable: "usuarios",
				archivo: "controlador"
			}
		});
		usuarios.edicion({
			campo: ["ID_OFICINA"],
			valor: [frm.m0_sel_oficina]
		});
		return mensaje;
		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: frm
		};
		log_error("m0_gs_modificar_oficina_base_guardar", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar en el index el nombre de la oficina delegada
*
* @param   {number}  id_usuario  id de usuario
* @param   {number}  id_oficina  id de la oficina asignada en la tabla USUARIO
*
* @return  {string}              nombre de la oficina delegada
*/
function m0_gs_oficina_alterna(id_usuario, id_oficina) {
	try {

		var usuarios_delegacion = query({
			tabla: "USUARIO_DELEGACION",
			campo: ["ID_OFICINA_BASE", "ID_OFICINA_ALTERNA"],
			condicion: {
				condicion: true,
				campo: ["ID_USUARIO"],
				criterio: [id_usuario],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		if (usuarios_delegacion.datos[0].id_oficina_alterna == id_oficina) {
			var id_oficina_2 = usuarios_delegacion.datos[0].id_oficina_base;
		} else {
			var id_oficina_2 = usuarios_delegacion.datos[0].id_oficina_alterna;
		}
		var oficina = query({
			tabla: "OFICINA",
			campo: ["OFICINA"],
			condicion: {
				condicion: true,
				campo: ["ID_OFICINA"],
				criterio: [id_oficina_2],
				comparador: ["IGUAL"],
				operador: []
			}
		});
		return oficina.datos[0].oficina

		//***************************CAPTURA DE ERRORES***********************************************************************
	} catch (e) {
		var param = {
			tipo_error: "codigo/GAS",
			parametros: {
				"id_usuario": id_usuario,
				"id_oficina": id_oficina
			}
		};
		log_error("m0_gs_oficina_alterna", param, e);
	}
	//***************************CAPTURA DE ERRORES***********************************************************************
}

