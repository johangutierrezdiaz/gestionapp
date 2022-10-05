//--------------------------------------------------------------------------------------------------------------------------------------------------------
/**---------------------------------------MODULO REPORTES----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - REPORTES BEPS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Desde aqui se carga la informacion qeu se procesara del lado del cliente
*
* @return  {object}       objecto con los resultados de la operacion
*/
function m6_1_gs_base_beps_actualizar() {
  try {
    
    var r = {
      exito: true,
      mensaje: "Base Beps cargada. Espere mientras se cruza la información"
    }
    
    var beps = query({
      tabla: "BEPS_BASE",
      campo: [],
      condicion: {
        condicion: false
      },
      opciones: {
        FECHA_a_texto: true
      }
    });
    
    r.beps = beps;
    var usuarios = query({
      tabla: "USUARIO",
      campo: ["ID_USUARIO", "NOMBRE"],
      condicion: {
        condicion: false,
      }
    });
    r.usuarios = usuarios;
    var regional = query({
      tabla: "REGIONAL",
      campo: ["ID_REGIONAL", "REGIONAL"],
      condicion: {
        condicion: false
      }
    });
    r.regional = regional;
    
    var parametros_beps = query({
      tabla: "BEPS_PARAMETRO",
      campo: ["ID_PARAMETRO", "PARAMETRO", "AMBITO"],
      condicion: {
        condicion: false
      }
    });
    r.parametros_beps = parametros_beps;
    
    var divipola = query({
      tabla: "DIVIPOLA_MUNICIPIOS",
      campo: ["CODIGO_MUNICIPIO", "MUNICIPIO", "DEPARTAMENTO"],
      condicion: {
        condicion: false
      }
    });
    r.divipola = divipola;
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {}
    };
    var id_error = log_error("m6_1_gs_base_beps_actualizar", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Cargamos la base beps para reportes ya procesada y actualizada en el front
*
* @param   {object}  data  matriz con los datos ya actualizados
*
* @return  {object}        objecto con los resultados de la operacion
*/
function m6_1_gs_base_beps_cargar_base_actualizada(data) {
  try {
    
    var r = {
      exito: true,
      mensaje: "La base BEPS se actualizo correctamente"
    }
    var u = usuario();
    var file = DriveApp.getFileById("1z7--rP-FgVNL9uwOvQn8tVQJLNcS60bjwRBvl9r0RI0");
    var folder = DriveApp.getFolderById("1MrZ20lP-fl-Z8xzqGSDMwFlL5mzWmBaf");
    var copia = file.makeCopy("BASE_BEPS (PROSPECTIVA Y CANTADAS) - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);
    
    var hoja_informe = SpreadsheetApp.openById("1z7--rP-FgVNL9uwOvQn8tVQJLNcS60bjwRBvl9r0RI0").getSheetByName("M5_REPORTE_BASE_BEPS");
    hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
    hoja_informe.getRange(2, 1, data.length, 7).setValues(data);
    
    var reporte = query({
      tabla: "INDEX_REPORTE",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_MODULO"],
        criterio: ["BASE_BEPS (PROSPECTIVA Y CANTADAS)", 5],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
			depuracion: {
				archivo: "m5_controlador",
				funcion: "m6_1_gs_base_beps_cargar_base_actualizada",
				variable: "reporte"
			}
    });
    
    reporte.edicion({
      campo: ["ACTIVO"],
      valor: [0]
    });
    
    reporte.insercion({
      campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
      valor: ["", fecha_texto(0, "FECHA"), u.id_usuario, "BASE_BEPS (PROSPECTIVA Y CANTADAS)", 5, 1, copia.getId()],
      index: true
    });
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {
        "data": data
      }
    };
    var id_error = log_error("m6_1_gs_base_beps_cargar_base_actualizada", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}




//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 6 - REPORTES NOVEDADES TH
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
function m6_2_gs_cargar_reporte_base_novedades_th(id_regional) {
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
        criterio: ["M3_NOVEDADES_TH_GENERAL_CARIBE", id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    
    if (reporte.registros > 0) {
      r.contenido += '<button id="m6_2_btn_m3_general_th_actualizar" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">';
      r.contenido += 'ACTUALIZAR INFORME >>';
      r.contenido += '</button>';
      r.contenido += '<hr />';
      r.contenido += '<br />';
      r.contenido += '<iframe src="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
      r.contenido += '<br />';
      r.contenido += 'Abrir la Base NOVEDADES TH en Drive: <a class="mdl-button mdl-js-button mdl-button--accent" href="https://docs.google.com/spreadsheets/d/' + reporte.datos[0].id_archivo + '/edit?usp=sharing" target="_blank">Drive >></a>';
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
    var id_error = log_error("m6_2_gs_cargar_reporte_base_novedades_th", param, e);
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
function m6_2_gs_m3_base_novedades_th_actualizar() {
  try {
    
    var r = {
      exito: true,
      mensaje: "Base NOVEDADES TH cargada. Espere mientras se cruce la info"
    }
    
    var novedad = query({
      tabla: "NOVEDADES_TH",
      campo: ["ID_PAC", "ID_USUARIO", "ID_USUARIO_REPORTE", "FECHA", "NOVEDAD", "FECHA_INICIO_NOVEDAD", "FECHA_FIN_NOVEDAD", "DETALLE", "VIGENCIA", "AUTORIZADO"],
      condicion: {
        condicion: false
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
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {}
    };
    var id_error = log_error("m6_2_gs_m3_base_novedades_th_actualizar", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* Cargamos la base beps para reportes ya procesada y actualizada en el front
*
* @param   {object}  data  matriz con los datos ya actualizados
*
* @return  {object}        objecto con los resultados de la operacion
*/
function m6_2_gs_m3_base_novedades_th_cargar_base_actualizada(data) {
  try {
    
    var r = {
      exito: true,
      mensaje: "La base NOVEDADES TH se actualizo correctamente"
    }
    var u = usuario();
    
    var reporte = query({
      tabla: "REPORTE",
      campo: ["ID_ARCHIVO"],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_REGIONAL"],
        criterio: ["M3_NOVEDADES_TH_GENERAL_CARIBE", u.id_regional],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      }
    });
    var file = DriveApp.getFileById(reporte.datos[0].id_archivo);
    var folder = DriveApp.getFolderById("1MrZ20lP-fl-Z8xzqGSDMwFlL5mzWmBaf");
    var copia = file.makeCopy("BASE NOVEDADES TH - ACTUALIZADO - " + fecha_texto(0, "FECHA"), folder);
    
    var hoja_informe = SpreadsheetApp.openById(reporte.datos[0].id_archivo).getSheetByName("M3_NOVEDADES_TH_GENERAL_CARIBE");
    hoja_informe.getRange(2, 1, hoja_informe.getLastRow(), hoja_informe.getLastColumn()).clear({ formatOnly: false, contentsOnly: true });
    hoja_informe.getRange(2, 1, data.length, 10).setValues(data);
    
    var index_reporte = query({
      tabla: "INDEX_REPORTE",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["REPORTE", "ID_MODULO"],
        criterio: ["M3_NOVEDADES_TH_GENERAL_CARIBE", 3],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
			depuracion: {
				archivo: "m6_controlador",
				funcion: "m6_2_gs_m3_base_novedades_th_cargar_base_actualizada",
				variable: "index_reporte"
			}
    });
    
    index_reporte.edicion({
      campo: ["ACTIVO"],
      valor: [0]
    });
    
    index_reporte.insercion({
      campo: ["ID_ACTUALIZACION", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL","REPORTE", "ID_MODULO", "ACTIVO", "COPIA_ID"],
      valor: ["", fecha_texto(0, "FECHA"), u.id_usuario,  u.id_oficina, u.id_regional, "M3_NOVEDADES_TH_GENERAL_CARIBE", 3, 1, copia.getId()],
      index: true
    });
    
    return r;
    
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {
        "data": data
      }
    };
    var id_error = log_error("m6_2_gs_m3_base_novedades_th_cargar_base_actualizada", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}
