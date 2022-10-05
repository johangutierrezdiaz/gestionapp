/**
* query Clase que nos permite la comunicacion con la base de datos
*
* @param   {object}    q                           variable objeto en donde se hace la consulta a la base de datos en esta forma:
* @param   {string}    q.tabla                     Nombre de la tabla
* @param   {Array}     q.campo                     vector con los campos a traer de la consulta
* @param   {boolean}   q.condicion.condicion       define si trae condicion la consulta a la BD
* @param   {Array}     q.condicion.campo           Vector con los campos a comparar en la condicion
* @param   {Array}     q.condicion.criterio        Vector con los criterios de comparacion
* @param   {Array}     q.condicion.comparador      Vector con los operadores de comparacion 
* @param   {Array}     q.condicion.operador        Vector con los operadores logicos "Y" - "O" 
* @param   {string}    q.depuracion.archivo        Nombre de el archivo desde donde se llama la clase 
* @param   {string}    q.depuracion.funcion        Nombre de la funcion desde donde se llama la clase 
* @param   {string}    q.depuracion.variable       Variable en donde se guardara los datos de la consulta 
* 
* @return  {object}                                Objeto con los resultados de la consulta, con los siguientes metodos y atributos: 
*                                                  exito: true,
*                                                  registros: 0,
*                                                  datos: [],
*                                                  edicion: edicion_bd_drive,
*                                                  insercion: insercion_bd_drive,
*                                                  borrado: borrado_bd_drive 
*/
function query(q) {
  try {
    var posicion;
    var criterio;
    var comparador;
    var operador;
    var fecha;
    var sw_especifico;
    var sw_general;
    var base_final = [];
    var base_posicion = [];
    var j;
    var k;
    var m;
    var n;
    if (typeof q.depuracion === 'undefined') {
      q.depuracion = {
        archivo: "modelo/modelo.gs (LLAMADO EXTERNO)",
        funcion: "query (LLAMADO EXTERNO)",
        variable: "DB_TABLA: " + q.tabla
      }
    }
    if (typeof q.opciones === 'undefined') {
      q.opciones = {
        //Por ahora comenzar con solo FECHA, si se necesitan otros formatos de fecha, ir creandolos del estilo: HORA_a_texto o FECHA_HORA_a_textp
        formato_fecha: "SIN_FORMATO"
      }
    }
    var r = {
      exito: true,
      tabla: q.tabla,
      registros: 0,
      datos: [],
      edicion: edicion_bd_drive,
      insercion: insercion_bd_drive,
      borrado: borrado_bd_drive,
      depuracion_archivo: q.depuracion.archivo,
      depuracion_funcion: q.depuracion.funcion,
      depuracion_variable: q.depuracion.variable,
    };
    r.id_tabla = consulta_id_tabla(r.tabla);
    if (r.id_tabla === -1) {
      r.exito = false;
      //***************************VALIDACION ***********************************************************************
      var e = {
        fileName: q.depuracion.archivo,
        lineNumber: "N/A",
        message: "No se encontro la tabla en el directorio. Variable en donde se guardan los datos (" + q.depuracion.variable + ")"
      };
      var param = {
        tipo_error: "validacion",
        parametros: q
      };
      log_error(q.depuracion.funcion, param, e);
      //***************************VALIDACION***********************************************************************
    } else {
      var base_hoja = SpreadsheetApp.openById(r.id_tabla).getSheetByName(r.tabla);
      if (base_hoja.getLastRow() <= 1) {
        var base = [];
      } else {
        var base = base_hoja.getRange(2, 1, base_hoja.getLastRow() - 1, base_hoja.getLastColumn()).getValues();
      }
      var base_campos = base_hoja.getRange(1, 1, 1, base_hoja.getLastColumn()).getValues();
    }
    if (q.campo.length === 0) {
      q.campo = base_campos[0].slice();
    } else {
      var v = valida_campo(q.campo, base_campos[0]);
      r.exito = v.exito;
      //***************************VALIDACION***********************************************************************
      if (r.exito === false) {
        var e = {
          fileName: q.depuracion.archivo,
          lineNumber: "N/A",
          message: "Los campos no coinciden con la base. Variable en donde se guardan los datos (" + q.depuracion.variable + ")"
        };
        var param = {
          tipo_error: "validacion",
          parametros: q
        };
        log_error(q.depuracion.funcion, param, e);
      }
      //***************************VALIDACION***********************************************************************
    }
    if (r.exito) {
      r.campo = q.campo.slice();
      if (q.condicion.condicion) {
        if ((q.condicion.campo > 0) && (q.condicion.campo.length !== q.condicion.criterio.length || q.condicion.campo.length !== (q.condicion.operador.length + 1) || q.condicion.criterio.length !== (q.condicion.operador.length + 1))) {
          r.exito = false;
          //***************************VALIDACION***********************************************************************
          var e = {
            fileName: q.depuracion.archivo,
            lineNumber: "N/A",
            message: "La longitud de los parametros de la condicion no coinciden o son menores de 0. Variable en donde se guardan los datos (" + q.depuracion.variable + ")"
          };
          var param = {
            tipo_error: "validacion",
            parametros: q
          };
          log_error(q.depuracion.funcion, param, e);
          //***************************VALIDACION***********************************************************************
          return r;
        }
        for (k = 0; k < base.length; k++) {
          var fila = base[k];
          for (j = 0; j < q.condicion.campo.length; j++) {
            sw_especifico = false;
            posicion = posicion_campo(q.condicion.campo[j], base_campos[0]);
            criterio = q.condicion.criterio[j];
            comparador = q.condicion.comparador[j];
            switch (comparador) {
              case "IGUAL":
                if (fila[posicion] == criterio) {
                  sw_especifico = true;
                }
                break;
              case "DIFERENTE":
                if (fila[posicion] != criterio) {
                  sw_especifico = true;
                }
                break;
              case "FECHA_IGUAL":
                fecha = new Date(fila[posicion]);
                if (typeof fecha == "object" && typeof criterio == "object") {
                  fecha.setHours(0, 0, 0, 0);
                  criterio.setHours(0, 0, 0, 0);
                  if (fecha.getTime() === criterio.getTime()) {
                    sw_especifico = true;
                  }
                }
                break;
              case "FECHA_MAYOR":
                fecha = new Date(fila[posicion]);
                if (typeof fecha == "object" && typeof criterio == "object") {
                  if (fecha > criterio) {
                    sw_especifico = true;
                  }
                }
                break;
              case "FECHA_MAYOR_IGUAL":
                fecha = new Date(fila[posicion]);
                if (typeof fecha == "object" && typeof criterio == "object") {
                  fecha.setHours(0, 0, 0, 0);
                  criterio.setHours(0, 0, 0, 0);
                  if (fecha > criterio || fecha.getTime() === criterio.getTime()) {
                    sw_especifico = true;
                  }
                }
                break;
              case "FECHA_MENOR":
                fecha = new Date(fila[posicion]);
                if (typeof fecha == "object" && typeof criterio == "object") {
                  if (fecha < criterio) {
                    sw_especifico = true;
                  }
                }
                break;
              case "FECHA_MENOR_IGUAL":
                fecha = new Date(fila[posicion]);
                if (typeof fecha == "object" && typeof criterio == "object") {
                  fecha.setHours(0, 0, 0, 0);
                  criterio.setHours(0, 0, 0, 0);
                  if (fecha < criterio || fecha.getTime() === criterio.getTime()) {
                    sw_especifico = true;
                  }
                }
                break;
              default:
                r.exito = false;
                //***************************VALIDACION***********************************************************************
                var e = {
                  fileName: q.depuracion.archivo,
                  lineNumber: "N/A",
                  message: "El parametro -" + comparador + "- de la clausula de comparacion no es valido. Variable en donde se guardan los datos (" + q.depuracion.variable + ")"
                };
                var param = {
                  tipo_error: "validacion",
                  sw: true,
                  parametros: {
                    "q": JSON.stringify(q)
                  }
                };
                log_error(q.depuracion.funcion, param, e);
                //***************************VALIDACION***********************************************************************
                return r;
                break;
            }
            if (j == 0) {
              sw_general = sw_especifico;
            } else {
              operador = q.condicion.operador[j - 1];
              switch (operador) {
                case "Y":
                  if (sw_especifico && sw_general) {
                    sw_general = true;
                  } else {
                    sw_general = false;
                  }
                  break;
                case "O":
                  if (sw_especifico || sw_general) {
                    sw_general = true;
                  } else {
                    sw_general = false;
                  }
                  break;
                default:
                  r.exito = false;
                  //***************************VALIDACION***********************************************************************
                  var e = {
                    fileName: q.depuracion.archivo,
                    lineNumber: "N/A",
                    message: "El parametro -" + operador + "- de la clausula de operadores de comparacion no es valido. Variable en donde se guardan los datos (" + q.depuracion.variable + ")"
                  };
                  var param = {
                    tipo_error: "validacion",
                    parametros: q
                  };
                  log_error(q.depuracion.funcion, param, e);
                  //***************************VALIDACION***********************************************************************
                  return r;
                  break;
              }
            }
          }
          if (sw_general) {
            base_final.push(fila);
            base_posicion.push(k + 2);
          }
        }
      } else {
        if (q.condicion.condicion == false) {
          for (k = 0; k < base.length; k++) {
            base_final.push(base[k]);
            base_posicion.push(k + 2);
          }
        }
      }
      r.registros = base_final.length;
      for (m = 0; m < base_final.length; m++) {
        var rango = {
          posicion: base_posicion[m]
        };
        for (n = 0; n < q.campo.length; n++) {
          switch (q.opciones.formato_fecha) {
            case "SIN_FORMATO":
              rango[sanitizador(q.campo[n])] = base_final[m][posicion_campo(q.campo[n], base_campos[0])];
              break;
            case "FECHA_a_texto":
              if (typeof base_final[m][posicion_campo(q.campo[n], base_campos[0])] === "object") {
                rango[sanitizador(q.campo[n])] = fecha_texto(base_final[m][posicion_campo(q.campo[n], base_campos[0])], "FECHA");
              } else {
                rango[sanitizador(q.campo[n])] = base_final[m][posicion_campo(q.campo[n], base_campos[0])];
              }
              break;
            case "FECHA_HORA_a_texto":
              if (typeof base_final[m][posicion_campo(q.campo[n], base_campos[0])] === "object") {
                rango[sanitizador(q.campo[n])] = fecha_texto(base_final[m][posicion_campo(q.campo[n], base_campos[0])], "FECHA_HORA");
              } else {
                rango[sanitizador(q.campo[n])] = base_final[m][posicion_campo(q.campo[n], base_campos[0])];
              }
              break;
            case "HORA_a_texto":
              if (typeof base_final[m][posicion_campo(q.campo[n], base_campos[0])] === "object") {
                rango[sanitizador(q.campo[n])] = fecha_texto(base_final[m][posicion_campo(q.campo[n], base_campos[0])], "HORA");
              } else {
                rango[sanitizador(q.campo[n])] = base_final[m][posicion_campo(q.campo[n], base_campos[0])];
              }
            case "HORA_MINUTOS_a_texto":
              if (typeof base_final[m][posicion_campo(q.campo[n], base_campos[0])] === "object") {
                rango[sanitizador(q.campo[n])] = fecha_texto(base_final[m][posicion_campo(q.campo[n], base_campos[0])], "HORA_MINUTOS");
              } else {
                rango[sanitizador(q.campo[n])] = base_final[m][posicion_campo(q.campo[n], base_campos[0])];
              }
              break;
          }
        }
        r.datos.push(rango);
      }
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var e_adicional = {
      fileName: q.depuracion.archivo,
      lineNumber: e.lineNumber,
      message: e.message + " (" + q.depuracion.variable + ")"
    }
    var param = {
      tipo_error: "Codigo/GAS",
      parametros: q
    };
    log_error(q.depuracion.funcion, param, e_adicional);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* metodo de la clase query, para la edicion de los datos
*
* @param   {object}  q     objeto con los datos a ser modificados por el metodo, en la siguiente forma:
*                          campo: ["ID_CAMPO", "NOMBRE"],
*                          valor : [1, "JOHAN"],
*
* @return  {object}       objeto resultado con un solo parametro "exito", que indica el resultado del metodo 
*/
function edicion_bd_drive(q) {
  try {
    var fila;
    var columna;
    var r = {
      exito: true,
    };
    if (q.valor.length === 0 || q.campo.length === 0 || q.campo.length !== q.valor.length) {
      r.exito = false;
      //***************************VALIDACION***********************************************************************
      var e = {
        fileName: this.depuracion_archivo,
        lineNumber: "N/A",
        message: "Los parametros de -campo- o -valor- no son validos. Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
      };
      var param = {
        tipo_error: "validacion",
        parametros: q
      };
      log_error(this.depuracion_funcion, param, e);
      //***************************VALIDACION***********************************************************************
    } else {
      if (this.registros > 0) {
        var hoja = SpreadsheetApp.openById(this.id_tabla).getSheetByName(this.tabla);
        var base_campos = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues();
        var v = valida_campo(q.campo, base_campos[0]);
        r.exito = v.exito;
        //***************************VALIDACION 4***********************************************************************
        if (r.exito === false) {
          r.exito = false;
          //***************************VALIDACION***********************************************************************
          var e = {
            fileName: this.depuracion_archivo,
            lineNumber: "N/A",
            message: "No paso la validacion los nombres de los campos. Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
          };
          var param = {
            tipo_error: "validacion",
            parametros: q
          };
          log_error(this.depuracion_funcion, param, e);
          //***************************VALIDACION***********************************************************************
        }
        //***************************VALIDACION 4***********************************************************************
        if (r.exito) {
          for (var j = 0; j < this.registros; j++) {
            fila = this.datos[j].posicion;
            for (var i = 0; i < q.campo.length; i++) {
              columna = posicion_campo(q.campo[i], base_campos[0]);
              hoja.getRange(fila, columna + 1).setValue(q.valor[i]);
              this.datos[j][sanitizador(q.campo[i])] = q.valor[i];
            }
          }
        }
      } else {
        r.exito = false;
        //***************************VALIDACION***********************************************************************
        var e = {
          fileName: this.depuracion_archivo,
          lineNumber: "N/A",
          message: "El objeto query tiene 0 registros. Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
        };
        var param = {
          tipo_error: "validacion",
          parametros: q
        };
        log_error(this.depuracion_funcion, param, e);
        //***************************VALIDACION***********************************************************************
      }
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var e_adicional = {
      fileName: this.depuracion_archivo,
      lineNumber: e.lineNumber,
      message: e.message + " (" + this.depuracion_variable + ")"
    }
    var param = {
      tipo_error: "Codigo/GAS",
      parametros: q
    };
    log_error(this.depuracion_funcion, param, e_adicional);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* metodo de la clase query para la insercion de datos
*
* @param   {objeto}  q  objeto con los datos a ser insertados por la clase query, en la siguiente forma:
*                      {
*                          campo : ["INDEX", "NOMBRE"]
*                          valor : ["", "JOHAN"],
*                          index : true
*                      }
*                      ---En caso de que el parametro index sea true se asumira que del parametro campo en su primera posicion, sera la columna en donde esta el index de la tabla y por lo tanto en el parametro valor en su primera posicion se reescribira con el index 
*
* @return  {objeto}    objeto con los resultados de la ejecucion del metodo, el objeto viene con los sgtes parametros:
*                      {
*                          -exito
*                          -id: el nuevo id
*                      }
*/
function insercion_bd_drive(q) {
  try {

    var u = usuario();
    var fila;
    var columna;
    var sw;
    var r = {
      exito: true,
      id: -1
    };
    if (q.valor.length === 0 || q.campo.length === 0 || q.campo.length !== q.valor.length || q.campo.length < 1) {
      r.exito = false;
      //***************************VALIDACION***********************************************************************
      var e = {
        fileName: this.depuracion_archivo,
        lineNumber: "N/A",
        message: "Los parametros de -campo- o -valor- no son validos. Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
      };
      var param = {
        tipo_error: "validacion",
        parametros: q
      };
      log_error(this.depuracion_funcion, param, e);
      //***************************VALIDACION***********************************************************************
    } else {
      var hoja = SpreadsheetApp.openById(this.id_tabla).getSheetByName(this.tabla);
      var base_campos = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues();
      var v = valida_campo(q.campo, base_campos[0]);
      r.exito = v.exito;
      //***************************VALIDACION 4***********************************************************************
      if (r.exito === false) {
        r.exito = false;
        //***************************VALIDACION***********************************************************************
        var e = {
          fileName: this.depuracion_archivo,
          lineNumber: "N/A",
          message: "No paso la validacion los nombres de los campos. Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
        };
        var param = {
          tipo_error: "validacion",
          parametros: q
        };
        log_error(this.depuracion_funcion, param, e);
        //***************************VALIDACION***********************************************************************
      } else {
        if (q.index) {
          q.valor[0] = index(this.tabla);
          r.id = q.valor[0];
        }
        var encabezado = base_campos[0];
        var valores = [];
        var valor;
        for (var k = 0; k < encabezado.length; k++) {
          valor = "";
          for (var l = 0; l < q.campo.length; l++) {
            if (encabezado[k] === q.campo[l]) {
              valor = q.valor[l];
            }
          }
          valores.push(valor);
        }
        var fila = hoja.getLastRow() + 1
        hoja.appendRow(valores);
        var rango = {
          posicion: fila
        };
        for (var j = 0; j < this.campo.length; j++) {
          sw = false;
          for (i = 0; i < q.campo.length; i++) {
            if (this.campo[j] === q.campo[i]) {
              sw = true;
            }
          }
          if (sw) {
            rango[sanitizador(this.campo[j])] = q.valor[j];
          } else {
            rango[sanitizador(this.campo[j])] = "";
          }
        }
        this.datos.push(rango);
        this.registros = this.registros + 1;
      }
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var e_adicional = {
      fileName: this.depuracion_archivo,
      lineNumber: e.lineNumber,
      message: e.message + " (" + this.depuracion_variable + ")"
    }
    var param = {
      tipo_error: "Codigo/GAS",
      parametros: q
    };
    log_error(this.depuracion_funcion, param, e_adicional);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* metodo de la clase query para el borrado de datos
*
* @return  {object}  objeto resultado con un solo parametro "exito", que indica el resultado del metodo 
*/
function borrado_bd_drive() {
  try {
    var r = {
      exito: true
    };
    if (this.registros > 0) {
      var hoja = SpreadsheetApp.openById(this.id_tabla).getSheetByName(this.tabla);
      for (var j = 0; j < this.registros; j++) {
        hoja.deleteRow(this.datos[j].posicion);
        for (var i = j; i < this.registros; i++) {
          this.datos[i].posicion = this.datos[i].posicion - 1;
        }
      }
      for (var j = 0; j < this.registros; j++) {
        this.datos.splice(j, 1)
      }

    } else {
      r.exito = false;
      //***************************VALIDACION***********************************************************************
      var e = {
        fileName: this.depuracion_archivo,
        lineNumber: "N/A",
        message: "Se esta intentando borrar un numero de registros no permitido (" + this.registros + "). Variable en donde se guardan los datos (" + this.depuracion_variable + ")"
      };
      var param = {
        tipo_error: "validacion",
        parametros: {}
      };
      log_error(this.depuracion_funcion, param, e);
    }
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      sw: false
    };
    log_error("borrado_bd_drive", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------


/**
* [valida que los campos que se envien en la consulta query coincidan con los que estan en la tabla]
*
* @param   {Array}  campos  [campos enviados en la consulta]
* @param   {Array}  base    [campos que estan en la base]
*
* @return  {boolean}        [el resultado de la validacion]
*/
function valida_campo(campos, base) {
  var r = {
    exito: true,
  };
  for (var j = 0; j < campos.length; j++) {
    if (base.indexOf(campos[j]) == -1) {
      r.exito = false;
    }
  }
  return r;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion generica para la creacion de index
*
*	@param {string} tabla - Tabla en donde se insertaria el nuevo index.
*
* @return  {number}		index
*/
function index(tabla) {
  var r;
  switch (tabla) {
    //BD_BASE
    case "USUARIO":
      r = "B01";
      break;
    case "OFICINA":
      r = "B02";
      break;
    case "REGIONAL":
      r = "B03";
      break;
    case "CALENDARIO":
      r = "B04";
      break;
    case "MODULO":
      r = "B05";
      break;
    case "PRIVILEGIO":
      r = "B06";
      break;
    case "PRIVILEGIO_USUARIO":
      r = "B07";
      break;
    case "DIVIPOLA_MUNICIPIOS":
      r = "B08";
      break;
    case "USUARIO_DELEGACION":
      r = "B09";
      break;
    case "INDEX_UPLOAD":
      r = "B10";
      break;
    case "REPORTE":
      r = "B11";
      break;
    case "INDEX_REPORTE":
      r = "B12";
      break;
    case "INDEX_CORREO":
      r = "B13";
      break;
    case "MODULO_UPLOAD":
      r = "B14";
      break;
    case "INDEX_SCRIPTS_USUARIO":
      r = "B15";
      break;
    //BD_APERTURA_CIERRE
    case "NOVEDADES_PERSONAL":
      r = "AC01";
      break;
    case "OPERACION_PAC":
      r = "AC02";
      break;
    case "NOVEDADES_OPERACION":
      r = "AC03";
      break;
    case "BASE_DOCUMENTAL":
      r = "AC04";
      break;
    case "BASE_SOCIALIZACION":
      r = "AC05";
      break;
    //BD_TH
    case "NOVEDADES_TH":
      r = "TH01";
      break;
    //BD_BEPS
    case "PSAP_BASE":
      r = "BEPS01";
      break;
    case "PSAP_GESTION":
      r = "BEPS02";
      break;
    case "BEPS_PARAMETRO":
      r = "BEPS03";
      break;
    case "BEPS_BASE":
      r = "BEPS04";
      break;
    case "ANUALIDAD_GESTION":
      r = "BEPS05";
      break;
    case "ANUALIDAD_BASE":
      r = "BEPS06";
      break;
    //BD_VISITAS_ASEGURAMIENTO
    case "ACCION_CORRECTIVA":
      r = "VA01";
      break;
    case "PLAN_ACCION_CORRECTIVA":
      r = "VA02";
      break;
    case "CATEGORIA_CHECKLIST":
      r = "VA03";
      break;
    case "CHECKLIST":
      r = "VA04";
      break;
    case "PROGRAMACION":
      r = "VA05";
      break;
    case "VISITA":
      r = "VA06";
      break;
    case "VISITA_CATEGORIA":
      r = "VA07";
      break;
    //BD_CALIDAD
    case "CALIDAD_RADICACION":
      r = "C01";
      break;
    case "REPROCESO":
      r = "C02";
      break;
    //BD_PE
    case "OBJETIVO_ESTRATEGICO":
      r = "PE01";
      break;
    case "ESTRATEGIA":
      r = "PE02";
      break;
    case "INDICADOR":
      r = "PE03";
      break;
    case "PLAN_ESTRATEGICO":
      r = "PE04";
      break;
    case "SEGUIMIENTO_PLAN_ESTRATEGICO":
      r = "PE05";
      break;
    //BD_AUDITORIA
    case "SESION":
      r = "SESION01";
      break;
    case "LOG_SESION":
      r = "SESION02";
      break;
  }

  /*
  var u = usuario();
  var hoja = SpreadsheetApp.openById("1NTp4LDlLc-QKNlcrG_piaOWkuH-ulmijhB4w9tebEKM").getSheetByName("INDEX");
var index = hoja.getRange(hoja.getLastRow(), 1).getValue() + 1;
var linea = [];
linea.push(index);
linea.push(Session.getActiveUser().getEmail());
linea.push(fecha_texto(0, "FECHA_HORA"))
linea.push(tabla)
  hoja.appendRow(linea);
return r  + "" + u.id_usuario + "" + index;
  */

  //var index1 = addZero(Math.round(Math.random() * (99 - 0) + 0))
  //var index2 = addZero(Math.round(Math.random() * (99 - 0) + 0))
  //return r + "" + u.id_usuario + "" + index1 + index2;

  var u = usuario();
  var marca_temporal_insercion = new Date();
  var str_id = u.id_usuario + "" + marca_temporal_insercion.getTime();

  if (str_id.length > 13) {
    id = str_id.slice(str_id.length - 13, str_id.length)
  } else {
    id = str_id
  }

  return "N" + id

}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* directorio de la BD, asocia con el nombre de la tabla su id
*
* @param   {string}  tabla  nombre de la tabla
*
* @return  {string}         id de Drive 
*/
function consulta_id_tabla(tabla) {
  var r;
  switch (tabla) {
    //BD_BASE
    case "USUARIO":
      r = "19FlfKHSSeKFumAlm3hDuKYsV30dIOYZc95898tk3eDQ";
      break;
    case "OFICINA":
      r = "1_h1oHp92Fmb-PMHZ7mQhSn8yjj9UPY-3A2K-d1RYcSc";
      break;
    case "REGIONAL":
      r = "1fp1Fx3DjFl0wbIjixC0x-pcfsMLIPNIwRk_i1UKpYLg";
      break;
    case "CALENDARIO":
      r = "12r6g_BjEJTiIw5VRVQg2p477z0cPkvrF6zpRIR-HsOY";
      break;
    case "MODULO":
      r = "1EfULJrCOYBvOFQ2R9tdCVL3JOfyq1gxxeUHfkFlmLOo";
      break;
    case "PRIVILEGIO":
      r = "1RtmHscTDmQRn1agpt-MQT-RCo3UBCQxoDV1ptpcH57Y";
      break;
    case "PRIVILEGIO_USUARIO":
      r = "1BvFJuJ1mkdc8eZ-fYb3OrQRxhekVG5JN4uIvWLDharE";
      break;
    case "DIVIPOLA_MUNICIPIOS":
      r = "1d9N-Mykpzrsm5AXZ8MDrSePU5qH9LZUe_u7cRy6FRsI";
      break;
    case "USUARIO_DELEGACION":
      r = "1ch5IbtWmVZzBxynecwgb9MSgaYTCBfHa02nVhVsLI6g";
      break;
    case "INDEX_UPLOAD":
      r = "1l7weBQhL7LmybspfmUDg2WuBDZXEkO-8TmyOfGl37HA";
      break;
    case "REPORTE":
      r = "1FmNyAfgZrh0wh1_Xcl0Q-9nHO2rxtSoiHyNGJub2dt8";
      break;
    case "INDEX_REPORTE":
      r = "12eEh6wGcU2fIpu3-JTnq_kn7CtU45f8OzUuLCGQi7uM";
      break;
    case "INDEX_CORREO":
      r = "1PyTnKWGaFf2lAM2aC9xIgMoM_5dqjOU3oNk3T384CYs";
      break;
    case "INDEX_SCRIPTS_USUARIO":
      r = "1k6lEQtQZYD50k7XeaGg-hlMy5z0XcMJSRHo35tN5qss";
      break;
    case "MUNICIPIO":
      r = "1M8Qs2D6a0yA6YpppknoLC5yuDrB-EClc1Q8CZrqheQ8";
      break;
    case "MODULO_UPLOAD":
      r = "1EvgKRFBEdI_c-aaSA9eKxXhMHwH5GLb1BT_6WSJ7n0w";
      break;
    //BD_APERTURA_CIERRE
    case "NOVEDADES_PERSONAL":
      r = "1z-ON9BV0DPtkoPapg2ewhxewNxMwkUf8_yMBNolaU34";
      break;
    case "OPERACION_PAC":
      r = "1ujlSs_gWTfLXuQaGj6j5qEK2U9JgNm3oijqLwTmXenI";
      break;
    case "NOVEDADES_OPERACION":
      r = "1jPnb_RNLeqz8MXdrnh6C5860Wnc7i0LdAjO5rWv6T2k";
      break;
    case "BASE_DOCUMENTAL":
      r = "1YHCT12781U8ojYFQ0Glok6m61ELGgT8WJRapOmv2KJ4";
      break;
    case "BASE_SOCIALIZACION":
      r = "1WyQcbS8-9TQv0NgnFrJ_GkBMHkJWvQcue2ihS4IA0LU";
      break;
    //BD_TH
    case "NOVEDADES_TH":
      r = "1MBGF-TETioxiNt939pG3UWzVC9hlmOtIutyd8xq8NAw";
      break;
    //BD_BEPS
    case "PSAP_BASE":
      r = "1_4gOcKC62DzlmUbOvnQLaITDYWlIBHUXfHedc_uzGJQ";
      break;
    case "PSAP_GESTION":
      r = "1tA8oQ4nHYSYfBQHO24G5Vr2_jHIbHyzdh5R2qaaZEag";
      break;
    case "BEPS_PARAMETRO":
      r = "1fh_VznWTUfLH-mebQxafjaXzbUsXy-_Gq-ipNjIPwfw";
      break;
    case "BEPS_BASE":
      r = "1avG0nmpt-XDn_LAO85-Y4HEA3q38Uvoa6gm12Y6n5EQ";
      break;
    case "ISPV_BEPS":
      r = "1lcv4Bm0le2uiw_W9ijQxYu5BX8itgYOOx1ueyg4Yhj8";
      break;
    case "REFERIDOS_BEPS":
      r = "1dPbVQ1cp1kHMKcyY7s7eDRwQB5yVBC3fv7rpUf-71NI";
      break;
    case "CONSOLIDADO_TRAMITES_BIZAGI":
      r = "1zTOHJwf7SSUncOwpduPIkycy_k6W9a6wjueHxh5pXGw";
      break;
    case "ANUALIDAD_GESTION":
      r = "1XDVgxwBHm1i6hGZSuqS-vnyiBdbVssRQHVXyOiIgQ0k";
      break;
    case "ANUALIDAD_BASE":
      r = "1iE0yzxqPLlsas2M2SS-y-cnY9oET1VatO6yd0SLlzF8";
      break;

    //BD_VISITAS_ASEGURAMIENTO
    case "ACCION_CORRECTIVA":
      r = "1k1K-42Xfgte5u8XlAolrlEZmiBtZdg2E9HnbYxmeGCE";
      break;
    case "PLAN_ACCION_CORRECTIVA":
      r = "1nsByuyMxD6NYfy-FiCxLmdI48TiC8ylGTOx4XQsBlnQ";
      break;
    case "CATEGORIA_CHECKLIST":
      r = "1PwQUjEm1EZj8IWuZcX_tkXs-HiEymjqJAZFbu8zz-oU";
      break;
    case "CHECKLIST":
      r = "1J2Ht9nM_-KZr2lQfaMLyAgzn5ZbgjS1kOkh8DXprVMM";
      break;
    case "PROGRAMACION":
      r = "1KDx9qRxRQ0a8AbGAixs7sy0v8DvwThgLKIfhoAlG2Y4";
      break;
    case "VISITA":
      r = "1ePNccq6QyS1YqeESwLnbLuQsMF3wyt0q9ZYekDpO65E";
      break;
    case "VISITA_CATEGORIA":
      r = "1_dj7TzTErYXMLxDFvVbyZeGo952zKLbAo4Mcm1c7_44";
      break;
    //BD_CALIDAD
    case "CALIDAD_RADICACION":
      r = "1FOyLSbopcGKZ-Iw0ad4C0zAxI1_0cK5SoSg3gQ5XmWg";
      break;
    case "REPROCESO":
      r = "1zPVsase3PDZLTx73IC5cpFpp5M_9uKwaySfFx_6rgyA";
      break;
    case "QOF":
      r = "1uaHzohacGCl7uCFGcIbUCQtkj_ckZ0XUI-IMBL_OKMs";
      break;
    //BD_PE
    case "OBJETIVO_ESTRATEGICO":
      r = "1Yoaz-h7eMdvanorFMDmiPe5JWpeUpcFT3tju7zELgF8";
      break;
    case "ESTRATEGIA":
      r = "1TmvxdUikhGxfPv_F_5nQEUdlYc5qb64U5FNY6vHu_F0";
      break;
    case "INDICADOR":
      r = "1L-cXuZ8Lf-l7JHIOD0PucEMvdXM1FQfRYEkIXgzKuCQ";
      break;
    case "PLAN_ESTRATEGICO":
      r = "1M4EfEoFyLJBwYE7XbgICLIgGj9vXZdwMQ-yWASsAn0M";
      break;
    case "SEGUIMIENTO_PLAN_ESTRATEGICO":
      r = "14cckvlF1TXj08-mm8uKfwXmo_pJlBlaZ1z2InZf7TLA";
      break;
    //BD_AUDITORIA
    case "SESION":
      r = "1I98ivAMVggvCpRP9_IzoKr7Uw5gw22tMVg9lOLp9HXQ";
      break;
    case "LOG_SESION":
      r = "14XSSjLso84huvNpdu2kZGBlSbriG4y0GHLjdFTXfoYI";
      break;
    default:
      r = -1;
  }
  return r;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* [con el nombre del campo nos devuelve su posicion en la BD]
*
* @param   {string}  campo [nombre del campo]
* @param   {Array}  base   [base ]
*
* @return  {number}        [posicion]
*/
function posicion_campo(campo, base) {
  for (var j = 0; j < base.length; j++) {
    if (campo === base[j])
      break;
  }
  return (j);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* [sanitizador de texto para el nombre de los campos en la construccion del objeto respuesta de la clase query]
*
* @param   {string}  texto  [nombre del campo original]
*
* @return  {string}         [nombre del campo en minuscula sin espacios, acentos o caracteres especiales]
*/
function sanitizador(texto) {
  return (remove_accents(texto).trim().toLowerCase());
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* [removedor de acentos en cadenas de texto, trabaja en conjunto con Sanitizador()]
*
* @param   {string}  p  [nombre del campo]
*
* @return  {string}     [nombre del campo sin acentos o caracteres especiales]
*/
function remove_accents(p) {
  c = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇñÑ ()-';
  s = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUCnN____';
  n = '';
  for (i = 0; i < p.length; i++) {
    if (c.search(p.substr(i, 1)) >= 0) {
      n += s.substr(c.search(p.substr(i, 1)), 1);
    } else {
      n += p.substr(i, 1);
    }
  }
  return n;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para la conversion de milisegundos a formato hh:mm:ss
*
* @param   {number}  s  milisegundos
*
* @return  {string}     tiempo en el formato indicado
*/
function milisegundos_a_tiempo(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return addZero(hrs) + ':' + addZero(mins) + ':' + addZero(secs);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para añadir ceros a la izquierda
*
* @param   {number}  i  numero base 10
*
* @return  {string}     cadena con los ceros a la izquierda
*/
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* dado el numero del mes devuelve la cadena
*
* @param   {number}  mes  numero del mes
*
* @return  {string}       el nombre del mes
*/
function obtener_mes(mes) {
  var r;
  switch (mes) {
    case 1:
      r = "ENERO";
      break;
    case 2:
      r = "FEBRERO";
      break;
    case 3:
      r = "MARZO";
      break;
    case 4:
      r = "ABRIL";
      break;
    case 5:
      r = "MAYO";
      break;
    case 6:
      r = "JUNIO";
      break;
    case 7:
      r = "JULIO";
      break;
    case 8:
      r = "AGOSTO";
      break;
    case 9:
      r = "SEPTIEMBRE";
      break;
    case 10:
      r = "OCTUBRE";
      break;
    case 11:
      r = "NOVIEMBRE";
      break;
    case 12:
      r = "DICIEMBRE";
      break;
  }
  return r;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para convertir un objeto fecha en cadena 
*
* @param   {object}  obj      objeto fecha
* @param   {string}  formato  formato deseado para la fecha
*
* @return  {string}           cadena con el formato deseado para la fecha
*/
function fecha_texto(obj, formato) {
  if (obj === 0) {
    var f = new Date();
  } else {
    var f = obj;
  }
  var t = "";
  switch (formato) {
    case 'FECHA':
      t = (f.getFullYear() + '/' + addZero(f.getMonth() + 1) + '/' + addZero(f.getDate()));
      break;
    case 'FECHA_HORA':
      t = (f.getFullYear() + '/' + addZero(f.getMonth() + 1) + '/' + addZero(f.getDate()) + " " + f.getHours() + ':' + addZero(f.getMinutes()) + ':' + addZero(f.getSeconds()));
      break;
    case 'HORA':
      t = (f.getHours() + ':' + addZero(f.getMinutes()) + ':' + addZero(f.getSeconds()));
      break;
    case 'HORA_MINUTOS':
      t = (f.getHours() + ':' + addZero(f.getMinutes()));
      break;
  }
  return t;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* dado el numero de la semana devuelve la cadena
*
* @param   {number}  mes  numero de la semana
*
* @return  {string}       el nombre del dia de la semana 
*/
function obtener_dia_semana(dia) {
  var r;
  switch (dia) {
    case 0:
      r = "Domingo";
      break;
    case 1:
      r = "Lunes";
      break;
    case 2:
      r = "Martes";
      break;
    case 3:
      r = "Miercoles";
      break;
    case 4:
      r = "Jueves";
      break;
    case 5:
      r = "Viernes";
      break;
    case 6:
      r = "Sabado";
      break;
  }
  return r;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion generica para el envio de correos
*
*
* @example modelo basico de correo
* {
* 	usuarios: [802],
* 	asunto: "asunto generico",
* 	contenido: '<p>contenido correo</p>',
* 	id_modulo: 0
* }
*
* @param {array} 	param_mail.usuarios - array con los id usuarios a donde se enviara el correo.
*	@param {string} param_mail.asunto - asunto del correo.
*	@param {string} param_mail.contenido - Contenido del correo en formato enriquecido HTML
*	@param {number} param_mail.id_modulo - array con los id usuarios a donde se enviara el correo.
*
* @return  {object}		objecto con los resultados del envio del correo
*/
function generador_de_correo(param_mail) {
  try {

    var r = {
      exito: true,
      mensaje: "El correo se envío exitosamente"
    }

    var usuario_correo = "";
    var contenido = '';

    for (var j = 0; j < param_mail.usuarios.length; j++) {
      var base_usuario_correo = query({
        tabla: "USUARIO",
        campo: ["CORREO"],
        condicion: {
          condicion: true,
          campo: ["ID_USUARIO"],
          criterio: [param_mail.usuarios[j]],
          comparador: ["IGUAL"],
          operador: []
        }
      });
      usuario_correo += base_usuario_correo.datos[0].correo + ",";
    }
    contenido += '<p>Cordial Saludo,</p>';
    contenido += '<br />';
    contenido += '<p>A trav&eacute;s del presente correo se le env&iacute;a <b>' + param_mail.asunto + '</b> :</p>';
    contenido += '<br />';
    contenido += param_mail.contenido;
    contenido += '<br />';
    contenido += '<p>&nbsp;</p>';
    contenido += '<pre><q>Este es un correo generado autom&aacuteticamente a travtrav&eacute;s de <a href="https://script.google.com/a/colpensiones.gov.co/macros/s/AKfycbzTFkgm7Ra_W18qcSziRe-g2urBVb6IGhGUIm8orJhsFRYpgTA/exec" target="_blank">Gestión.APP</a>. Por favor no responderlo.</q></pre>';

    if (usuario_correo !== "") {
      var base_correo = query({
        tabla: "INDEX_CORREO",
        campo: [],
        condicion: {
          condicion: 0
        }
      });
      var u = usuario();
      var insercion = base_correo.insercion({
        campo: ["ID_CORREO", "FECHA", "ID_USUARIO", "ID_OFICINA", "ID_REGIONAL", "DESTINATARIO", "ID_MODULO", "ASUNTO", "CONTENIDO", "SENDER"],
        valor: ["", fecha_texto(0, "FECHA_HORA"), u.id_usuario, u.id_oficina, u.id_regional, usuario_correo, param_mail.id_modulo, param_mail.asunto, contenido, param_mail.sender],
        index: true
      })
      if (param_mail.sender === "APP") {
        MailApp.sendEmail({
          to: usuario_correo,
          subject: param_mail.asunto,
          htmlBody: contenido,
          noReply: true
        });
      } else {
        var param = {
          id_correo: insercion.id
        }
        var base_scripts_usuario = query({
          tabla: "INDEX_SCRIPTS_USUARIO",
          campo: [],
          condicion: {
            condicion: 0
          }
        });
        var u = usuario();
        var url = LINK_APP_PRODUCCION_USUARIO + '?m=0&f=generar_correo&id=' + param.id_correo;
        var insercion = base_scripts_usuario.insercion({
          campo: ["ID_EJECUCION", "FECHA", "USUARIO", "OFICINA", "REGIONAL", "PROCEDIMIENTO", "PARAMETROS", "URL"],
          valor: ["", fecha_texto(0, "FECHA_HORA"), u.usuario, u.oficina, u.regional, "generar_correo", JSON.stringify(param), url],
          index: true
        })
        r.url = url;
      }
    } else {
      r.exito = false
      r.mensaje = "No se encontraron destinatarios, no se envía el correo"
      r.id_mail = insercion.id
    }
    return r

    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param_mail
    };
    log_error("generador_de_correo", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para el registro de errrores
*
* @param   {string}  funcion  nombre de la funcion en donde se genero el error
* @param   {object}  param    objeto con informacion de los parametros que recibe la funcion
* @param   {object}  e        objeto con la informacion del error capturada por el "try...catch"
*
*/
function log_error(funcion, param, e) {
  var hoja = SpreadsheetApp.openById('1tydvS-GigXYNsTkOr1DMdgRFvZFxGhpnZzEZUeMMiyY').getSheetByName('ERROR');
  var fila = [];
  var matriz = [];
  var fecha = new Date();
  var id_error = generateUUID();
  fila.push(id_error);
  fila.push(Session.getActiveUser().getEmail());
  fila.push(fecha.getYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds());
  fila.push("NO")
  if (e.fileName === "js") {
    fila.push("FRONT")
  } else {
    fila.push("BACK");
  }
  fila.push(e.fileName);
  fila.push(funcion);
  fila.push(e.lineNumber);
  fila.push(param.tipo_error);
  fila.push(e.message);
  fila.push(JSON.stringify(param.parametros))
  fila.push("NO");
  matriz.push(fila);
  hoja.getRange(hoja.getLastRow() + 1, 1, 1, hoja.getLastColumn()).setValues(matriz);
  return id_error;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para obtener valores unicos en formato string 
*
*
* @return  {string}           cadena con el formato deseado para la fecha
*/
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion de validacion del usuario, nos devuelve la informacion completa del usuario activo
*
* @return  {object}  objeto usuario con toda la informacion relacionada
*/
function usuario() {
  try {
    var u = {
      delegacion_activa: 0,
      usuario: "NO_REGISTRADO",
      id_usuario: -1,
      id_oficina: -1,
      oficina: "OFICINA SIN IDENTIFICAR",
      tipo_oficina: "",
      oficina_activa: 1,
      id_regional: -1,
      regional: "REGIONAL SIN IDENTIFICAR",
      telefono: 0,
      cargo: "",
      nombre: "",
      rol: "",
      area: "",
      privilegios: [],
      modulos: [],
      correo: Session.getActiveUser().getEmail()
    };
    if (typeof u.correo != 'undefined') {
      var usuario_gmail = Session.getActiveUser().getEmail();
      usuario_gmail = usuario_gmail.substring(0, usuario_gmail.indexOf('@', usuario_gmail)).toUpperCase();
      var usuario = query({
        tabla: "USUARIO",
        campo: ["ID_USUARIO", "USUARIO", "CORREO", "NOMBRE", "ID_OFICINA", "CARGO", "ROL", "ACTIVO", "AREA"],
        condicion: {
          condicion: true,
          campo: ["ACTIVO", "USUARIO"],
          criterio: [1, usuario_gmail],
          comparador: ["IGUAL", "IGUAL"],
          operador: ["Y"]
        },
        depuracion: {
          archivo: "modelo",
          funcion: "clase usuario",
          variable: "usuario"
        }
      });
      if (usuario.exito && usuario.registros >= 1) {
        if (usuario.registros > 1) {
          MailApp.sendEmail({
            to: "jjgutierrezd@colpensiones.gov.co",
            subject: "Registro de USUARIO duplicado en el APP: " + usuario_gmail,
            htmlBody: "Por favor revisar !!!!",
            noReply: true
          });
        }
        u.usuario = usuario_gmail;
        u.id_usuario = usuario.datos[0].id_usuario;
        u.id_oficina = usuario.datos[0].id_oficina;
        u.activo = usuario.datos[0].activo;
        u.nombre = usuario.datos[0].nombre;
        u.cargo = usuario.datos[0].cargo;
        u.rol = usuario.datos[0].rol;
        u.area = usuario.datos[0].area;
        var usuario_delegacion = query({
          tabla: "USUARIO_DELEGACION",
          campo: ["ID_OFICINA_ALTERNA", "ID_OFICINA_BASE", "FIN_DELEGACION", "ACTIVO"],
          condicion: {
            condicion: true,
            campo: ["ID_USUARIO", "ACTIVO"],
            criterio: [usuario.datos[0].id_usuario, 1],
            comparador: ["IGUAL", "IGUAL"],
            operador: ["Y"]
          },
          depuracion: {
            funcion: "usuario",
            variable: "usuario_delegacion",
            archivo: "modelo"
          }
        });
        if (usuario_delegacion.registros != 0) {
          var fecha_fin_delegacion = new Date(usuario_delegacion.datos[0].fin_delegacion);
          var fecha_actual = new Date();
          fecha_fin_delegacion.setHours(0, 0, 0, 0);
          fecha_actual.setHours(0, 0, 0, 0);
          if ((fecha_fin_delegacion > fecha_actual || fecha_fin_delegacion.getTime() == fecha_actual.getTime()) && (usuario_delegacion.datos[0].activo == 1)) {
            u.delegacion_activa = 1;
          } else {
            usuario_delegacion.edicion({
              campo: ["ACTIVO"],
              valor: [0]
            });
            if (u.id_oficina != usuario_delegacion.datos[0].id_oficina_base) {
              usuario.edicion({
                campo: ["ID_OFICINA"],
                valor: [usuario_delegacion.datos[0].id_oficina_base]
              });
            }
          }
        }
        if (u.id_oficina !== "") {
          var oficinas = query({
            tabla: "OFICINA",
            campo: ["OFICINA", "ID_REGIONAL", "TIPO_OFICINA", "ACTIVO"],
            condicion: {
              condicion: true,
              campo: ["ID_OFICINA"],
              criterio: [u.id_oficina],
              comparador: ["IGUAL"],
              operador: []
            },
            depuracion: {
              archivo: "modelo",
              funcion: "clase usuario",
              variable: "oficinas"
            }
          });
          if (oficinas.exito && oficinas.registros > 0) {
            u.oficina = oficinas.datos[0].oficina;
            u.id_regional = oficinas.datos[0].id_regional;
            u.tipo_oficina = oficinas.datos[0].tipo_oficina;
            u.oficina_activa = oficinas.datos[0].activo;
          }
          var regional = query({
            tabla: "REGIONAL",
            campo: ["REGIONAL", "ACTIVO"],
            condicion: {
              condicion: true,
              campo: ["ID_REGIONAL"],
              criterio: [u.id_regional],
              comparador: ["IGUAL"],
              operador: []
            },
            depuracion: {
              archivo: "modelo",
              funcion: "clase usuario",
              variable: "regional"
            }
          });
          if (regional.exito && regional.registros > 0) {
            u.regional = regional.datos[0].regional;
          }
        }
        var privilegios = query({
          tabla: "PRIVILEGIO_USUARIO",
          campo: ["ID_PRIVILEGIO"],
          condicion: {
            condicion: true,
            campo: ["ID_USUARIO"],
            criterio: [u.id_usuario],
            comparador: ["IGUAL"],
            operador: []
          },
          depuracion: {
            archivo: "modelo",
            funcion: "clase usuario",
            variable: "privilegios"
          }
        });
        if (privilegios.exito) {
          for (var j = 0; j < privilegios.registros; j++) {
            u.privilegios.push(privilegios.datos[j].id_privilegio);
          }
        }
        var modulos = query({
          tabla: "MODULO",
          campo: ["ID_MODULO", "MODULO", "ICONO", "DESCRIPCION", "COLOR"],
          condicion: {
            condicion: true,
            campo: ["ACTIVO", "ID_MODULO"],
            criterio: [1, 0],
            comparador: ["IGUAL", "DIFERENTE"],
            operador: ["Y"]
          },
          depuracion: {
            archivo: "modelo",
            funcion: "clase usuario",
            variable: "modulos"
          }
        });
        if (modulos.exito && modulos.registros > 0) {
          var m;
          for (var i = 0; i < modulos.registros; i++) {
            m = modulos.datos[i].id_modulo + "_0";
            if (u.privilegios.indexOf(m) !== -1) {
              u.modulos.push(modulos.datos[i]);
            }
          }
        }
      }
    }
    return u;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {}
    };
    log_error("usuario", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* verifica si determinado privilegio esta asignado al usuario actual
*
* @param   {string}  id_privilegio     id del privilegio
*
* @return  {boolean}                   verdadero o falso de acuerdo a la comparacion
*/
function verificar_acceso(id_privilegio) {
  if (id_privilegio === "0_0") {
    return true;
  } else {
    var u = usuario();
    if (u.privilegios.indexOf(id_privilegio) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * descripcion_funcion
 *
 * @param   {object}  param  objecto con la info que sera registrada en el log de sesion (id_sesion y id_modulo)
 *
 * @return  {null} 
 */
function m0_gs_log_sesion(param) {
  try {

    var marca_temporal = new Date();
    var log_sesion = query({
      tabla: "LOG_SESION",
      campo: [],
      condicion: 0,
      depuracion: {
        archivo: "modelo.gs",
        funcion: "m0_gs_log_sesion",
        variable: "log_sesion"
      }
    });
    log_sesion.insercion({
      campo: ["ID_SESION", "ID_MODULO", "MARCA_TEMPORAL", "OPERACION"],
      valor: [param.id_sesion, param.log, marca_temporal, param.tipo_log],
      index: false
    });

    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param
    };
    log_error("m0_gs_log_sesion", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Funcion para sincronizar la base de datos
 *
 * @param   {number}  id_sesion		id de sesion del usuario
 *
 * @return  {number}	id_modulo		id de el ultimo modulo en el que acceso el usuario
 */
function m0_gs_sincronizar_bd(id_sesion) {
  try {

    var log_sesion = query({
      tabla: "LOG_SESION",
      campo: ["ID_MODULO"],
      condicion: {
        condicion: true,
        campo: ["ID_SESION", "OPERACION"],
        criterio: [id_sesion, "ACCESO A MODULO"],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
      depuracion: {
        archivo: "modelo.js",
        funcion: "m0_gs_sincronizar_bd",
        variable: "log_sesion"
      }
    });

    if (log_sesion.registros > 0) {
      return log_sesion.datos[log_sesion.registros - 1].id_modulo
    } else {
      return -1
    }

  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: id_sesion
    };
    log_error("m0_gs_sincronizar_bd", param, e);
  }
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * inicializa un id de sesion para el usuario activo
 *
 * @param   {string}  operacion		tipo de inicio de sesion que se registrara en bd
 *
 * @return  {string}	id de sesion del usuario
 */
function m0_gs_inicializar_sesion(operacion) {
  try {

    var u = usuario();
    var marca_temporal = new Date();
    var sesion = query({
      tabla: "SESION",
      campo: [],
      condicion: 0,
      depuracion: {
        archivo: "modelo.js",
        funcion: "m0_gs_inicializar_sesion",
        variable: "sesion"
      }
    });

    if (u.usuario === "NO_REGISTRADO") {
      var usuario_gmail = Session.getActiveUser().getEmail();
      var res_sesion = sesion.insercion({
        campo: ["ID_SESION", "USUARIO", "MARCA_TEMPORAL"],
        valor: ["", usuario_gmail, marca_temporal],
        index: true
      });
    } else {
      var res_sesion = sesion.insercion({
        campo: ["ID_SESION", "USUARIO", "MARCA_TEMPORAL"],
        valor: ["", u.usuario, marca_temporal],
        index: true
      });
    }

    var log_sesion = query({
      tabla: "LOG_SESION",
      campo: [],
      condicion: 0,
      depuracion: {
        archivo: "modelo.js",
        funcion: "m0_gs_inicializar_sesion",
        variable: "log_sesion"
      }
    });
    log_sesion.insercion({
      campo: ["ID_SESION", "MARCA_TEMPORAL", "OPERACION"],
      valor: [res_sesion.id, marca_temporal, operacion],
      index: false
    });

    return res_sesion.id;

    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: operacion
    };
    log_error("m0_gs_inicializar_sesion", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------


function prueba() {

  var e = {
    fileName: "js",
    message: "error de prueba",
    lineNumber: 1
  }
  var param = {
    tipo_error: "codigo/GAS",
    parametros: {}
  };
  Logger.log(log_error("generador_de_correo", param, e));
}

