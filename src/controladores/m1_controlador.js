/**---------------------------------------MODULO ADMINISTRACION APP----------------------------------------------------------------------------------- */

//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 1 - ADMON USUARIOS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################

/**
* funcion para cargar las oficinas de una regional en un select
*
* @param   {object}  param_select  objecto con los parametros para cargar el select
*
* @return  {object}                objecto con los parametros para cargar el select
*/
function m1_gs_inicializar_busqueda_usuarios(param_select) {
  try {

    var rango = {
      texto: "",
      valor: "",
      selected: "selected"
    };
    param_select.datos.push(rango);
    if (verificar_acceso("0_1")) {
      var regionales = query({
        tabla: "REGIONAL",
        campo: ["REGIONAL", "ID_REGIONAL"],
        condicion: {
          condicion: true,
          campo: ["ACTIVO"],
          criterio: [1],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_gs_inicializar_busqueda_usuarios",
          variable: "regionales"
        }
      });
      for (var j = 0; j < regionales.registros; j++) {
        var oficinas = query({
          tabla: "OFICINA",
          campo: ["OFICINA", "ID_OFICINA"],
          condicion: {
            condicion: true,
            campo: ["ID_REGIONAL"],
            criterio: [regionales.datos[j].id_regional],
            comparador: ["IGUAL"],
            operador: []
          },
          depuracion: {
            archivo: "m1_controlador",
            funcion: "m1_gs_inicializar_busqueda_usuarios",
            variable: "oficinas"
          }
        });
        for (var i = 0; i < oficinas.registros; i++) {
          var rango = {
            texto: regionales.datos[j].regional + " / " + oficinas.datos[i].oficina,
            valor: oficinas.datos[i].id_oficina,
            selected: ""
          };
          param_select.datos.push(rango);
        }
      }
    } else {
      var oficinas = query({
        tabla: "OFICINA",
        campo: ["OFICINA", "ID_OFICINA"],
        condicion: {
          condicion: true,
          campo: ["ID_REGIONAL"],
          criterio: [param_select.criterio],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_gs_inicializar_busqueda_usuarios",
          variable: "oficinas"
        }
      });
      for (var j = 0; j < oficinas.registros; j++) {
        var rango = {
          texto: oficinas.datos[j].oficina,
          valor: oficinas.datos[j].id_oficina,
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
    log_error("m1_gs_inicializar_busqueda_usuarios", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* carga los usuarios registrados en a app
*
* @param   {object}  param_tabla  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     					objecto con los resultados de la consulta
*/
function m1_gs_cargar_usuarios_app(param_tabla) {
  try {

    param_tabla.titulos = ["ID USUARIO", "USUARIO", "NOMBRE", "CORREO", "OFICINA", "CARGO", "ROL", "AREA" ,"ACTIVO", ""];
    param_tabla.datos = [];
    var criterio = [];
    var campo = [];
    var comparador = [];
    var operador = [];
    if(param_tabla.criterio.id_oficina == "" && param_tabla.criterio.cargo == "" && param_tabla.criterio.rol == "" && param_tabla.criterio.area == ""){
      var usuarios = query({
        tabla: "USUARIO",
        campo: [],
        condicion: {
          condicion: false
        }
      });
    }else{
      if (param_tabla.criterio.id_oficina != "") {
        campo.push("ID_OFICINA");
        criterio.push(param_tabla.criterio.id_oficina);
        comparador.push("IGUAL");
        operador.push("Y")
      }
      if (param_tabla.criterio.cargo != "") {
        campo.push("CARGO");
        criterio.push(param_tabla.criterio.cargo);
        comparador.push("IGUAL");
        operador.push("Y");
      }
      if (param_tabla.criterio.rol != "") {
        campo.push("ROL");
        criterio.push(param_tabla.criterio.rol)
        comparador.push("IGUAL");
        operador.push("Y");
      }
      if (param_tabla.criterio.area != "") {
        campo.push("AREA");
        criterio.push(param_tabla.criterio.area)
        comparador.push("IGUAL");
        operador.push("Y");
      }
      operador.splice(1,1);
      var usuarios = query({
        tabla: "USUARIO",
        campo: [],
        condicion: {
          condicion: true,
          campo: campo,
          criterio: criterio,
          comparador: comparador,
          operador: operador
        }
      });
    }
    param_tabla.usuarios = usuarios

    var oficina = query({
      tabla: "OFICINA",
      campo: ["OFICINA", "ID_REGIONAL", "ID_OFICINA"],
      condicion: {
        condicion: false
      }
    });
    param_tabla.oficinas = oficina;

    return param_tabla;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param_tabla
    };
    var id_error = log_error("m1_gs_cargar_usuarios_app", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* cargamos en el formulario la informacion del usuario , funciona de mano con m1_js_manipular_usuario
*
* @param   {number}  info_usuario  id_de usuario
*
* @return  {object}                objecto con toda la informacion del usuario en cuestion
*/
function m1_gs_manipular_usuarios_llenar_formulario(id_usuario) {
  try {
    var usuarios = query({
      tabla: "USUARIO",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["ID_USUARIO"],
        criterio: [id_usuario],
        comparador: ["IGUAL"],
        operador: []
      },
      depuracion: {
        funcion: "m1_gs_manipular_usuarios_llenar_formulario",
        variable: "usuarios",
        archivo: "m1_controlador"
      }
    });
    var info_usuario = {
      id_usuario: id_usuario,
      usuario: usuarios.datos[0].usuario,
      correo: usuarios.datos[0].correo,
      nombre: usuarios.datos[0].nombre,
      cargo: usuarios.datos[0].cargo,
      rol: usuarios.datos[0].rol,
			area: usuarios.datos[0].area,
      activo: usuarios.datos[0].activo
    };
    var oficinas = query({
      tabla: "OFICINA",
      campo: ["OFICINA", "ID_OFICINA"],
      condicion: {
        condicion: true,
        campo: ["ID_OFICINA"],
        criterio: [usuarios.datos[0].id_oficina],
        comparador: ["IGUAL"],
        operador: []
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_gs_manipular_usuarios_llenar_formulario",
        variable: "oficinas"
      }
    });
    info_usuario.id_oficina = oficinas.datos[0].id_oficina;
    return info_usuario;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {
        "id_usuario": id_usuario
      }
    };
    log_error("m1_gs_manipular_usuarios_llenar_formulario", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar la informacion de las oficinas en el select de admon de usuarios
*
* @param   {id_oficina}    id_oficina      id de la oficina
* @param   {number}        id_regional     id de la regional
*
* @return  {object}                        objecto con la informacion para llenar el select
*/
function m1_gs_manipular_usuarios_llenar_formulario_oficinas(param_select) {
  try {
    if (verificar_acceso("0_1")) {
      var oficinas = query({
        tabla: "OFICINA",
        campo: ["OFICINA", "ID_OFICINA"],
        condicion: {
          condicion: false,
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_gs_manipular_usuarios_llenar_formulario_oficinas",
          variable: "oficinas"
        }
      });
    } else {
      var oficinas = query({
        tabla: "OFICINA",
        campo: ["OFICINA", "ID_OFICINA"],
        condicion: {
          condicion: true,
          campo: ["ID_REGIONAL"],
          criterio: [param_select.criterio],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_gs_manipular_usuarios_llenar_formulario_oficinas",
          variable: "oficinas"
        }
      });
    }
    var rango = {
      texto: "",
      valor: "",
      selected: "selected"
    };
    param_select.datos.push(rango);
    for (var j = 0; j < oficinas.registros; j++) {
      var rango = {
        texto: oficinas.datos[j].oficina,
        valor: oficinas.datos[j].id_oficina,
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
    log_error("m1_gs_manipular_usuarios_llenar_formulario_oficinas", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* almacenamiento de datos del formularion de admon de usuarios
*
* @param   {object}  frm  objecto formulario
*
* @return  {r}       resultado de la operacion de almacenamiento
*/
function m1_gs_manipular_usuarios_guardar(frm) {
  try {
    var r = {
      exito: false,
      mensaje: "Error en el almacenamiento de los datos, por favor intentelo nuevamente  o comuniquese con el aministrador de la APP"
    }
    var chk_usuario = 0;
    if (frm.m1_chk_usuario_activo === "si") {
      chk_usuario = 1;
    }
    if (frm.m1_hid_operacion === "INSERCION") {
      var usuarios = query({
        tabla: "USUARIO",
        campo: [],
        condicion: {
          condicion: true,
          campo: ["USUARIO", "CORREO"],
          criterio: [frm.m1_txt_usuario.toUpperCase(), frm.m1_txt_mail.toUpperCase()],
          comparador: ["IGUAL", "IGUAL"],
          operador: ["O"]
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_js_manipular_usuarios_guardar",
          variable: "usuarios"
        }
      });
      if (usuarios.registros == 0) {
        var sw_insercion = usuarios.insercion({
          campo: [
            "ID_USUARIO",
            "USUARIO",
            "CORREO",
            "NOMBRE",
            "ID_OFICINA",
            "CARGO",
            "ROL",
						"AREA",
            "ACTIVO"
          ],
          valor: [
            "",
            frm.m1_txt_usuario.toUpperCase(),
            frm.m1_txt_mail.toUpperCase(),
            frm.m1_txt_nombre.toUpperCase(),
            frm.m1_sel_oficina,
            frm.m1_sel_cargo,
            frm.m1_sel_rol,
						frm.m1_sel_area,
            chk_usuario
          ],
          index: true
        });
        if (sw_insercion.exito) {
          r.mensaje = "Datos almacenados exitosamente";
          r.exito = true;
        }
      } else {
        r.mensaje = "El USUARIO o CORREO de la persona a quien intenta registrar ya se encuentra registrado en el sistema por favor verifique la información a registrar";
        r.exito = false;
      }
    } else {
      var usuarios = query({
        tabla: "USUARIO",
        campo: [],
        condicion: {
          condicion: true,
          campo: ["ID_USUARIO"],
          criterio: [frm.m1_hid_id_usuario],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_js_manipular_usuarios_guardar",
          variable: "usuarios"
        }
      });
      var id_oficina_modificacion = frm.m1_sel_oficina
      if (usuarios.datos[0].id_oficina != id_oficina_modificacion) {
        var usuarios_delegacion = query({
          tabla: "USUARIO_DELEGACION",
          campo: ["ID_OFICINA_BASE"],
          condicion: {
            condicion: true,
            campo: ["ID_USUARIO", "ACTIVO"],
            criterio: [frm.m1_hid_id_usuario, "1"],
            comparador: ["IGUAL", "IGUAL"],
            operador: ["Y"]
          },
          depuracion: {
            archivo: "m1_controlador",
            funcion: "m1_gs_manipular_usuarios_guardar",
            variable: "usuarios_delegacion"
          }
        });
        if (usuarios_delegacion.registros > 0) {
          usuarios_delegacion.edicion({
            campo: ["ID_OFICINA_BASE"],
            valor: [id_oficina_modificacion]
          });
          if (usuarios_delegacion.datos[0].id_oficina_base != usuarios.datos[0].id_oficina) {
            id_oficina_modificacion = usuarios.datos[0].id_oficina;
          }
        }
      }
      var sw_edicion = usuarios.edicion({
        campo: [
          "USUARIO",
          "CORREO",
          "NOMBRE",
          "ID_OFICINA",
          "CARGO",
          "ROL",
					"AREA",
          "ACTIVO"
        ],
        valor: [
          frm.m1_txt_usuario.toUpperCase(),
          frm.m1_txt_mail.toUpperCase(),
          frm.m1_txt_nombre.toUpperCase(),
          id_oficina_modificacion,
          frm.m1_sel_cargo,
          frm.m1_sel_rol,
					frm.m1_sel_area,
          chk_usuario
        ]
      });
      if (sw_edicion) {
        r.mensaje = "Datos almacenados exitosamente";
        r.exito = true;
      }
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: frm
    };
    log_error("m1_gs_manipular_usuarios_guardar", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 2 - ADMON PRIVILEGIOS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* carga los usuarios registrados en a app
*
* @param   {object}  q  objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}     objecto con los resultados de la consulta
*/
function m1_2_gs_cargar_usuarios(param_tabla) {
  try {
    param_tabla.titulos = ["ID USUARIO", "USUARIO", "NOMBRE", "CORREO", "OFICINA", "CARGO", "ROL","AREA", ""];
    param_tabla.datos = [];
    var activo;
    var criterio = [];
    var campo = [];
    var comparador = [];
    var operador = [];
    campo.push("ACTIVO");
    criterio.push(1);
    comparador.push("IGUAL");
    operador.push()
    if (param_tabla.criterio.id_oficina != "") {
      campo.push("ID_OFICINA");
      criterio.push(param_tabla.criterio.id_oficina);
      comparador.push("IGUAL");
      operador.push("Y")
    }
    if (param_tabla.criterio.cargo != "") {
      campo.push("CARGO");
      criterio.push(param_tabla.criterio.cargo);
      comparador.push("IGUAL");
      operador.push("Y");
    }
    if (param_tabla.criterio.rol != "") {
      campo.push("ROL");
      criterio.push(param_tabla.criterio.rol)
      comparador.push("IGUAL");
      operador.push("Y");
    }
    if (param_tabla.criterio.area != "") {
      campo.push("AREA");
      criterio.push(param_tabla.criterio.area)
      comparador.push("IGUAL");
      operador.push("Y");
    }
    var usuarios = query({
      tabla: "USUARIO",
      campo: [],
      condicion: {
        condicion: true,
        campo: campo,
        criterio: criterio,
        comparador: comparador,
        operador: operador
      }
    });
    param_tabla.usuarios = usuarios;

    var oficina = query({
      tabla: "OFICINA",
      campo: ["OFICINA", "ID_REGIONAL", "ID_OFICINA"],
      condicion: {
        condicion: false
      }
    });
    param_tabla.oficinas = oficina;

    return param_tabla;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param_tabla
    };
    var id_error = log_error("m1_2_gs_cargar_usuarios", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r;
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* envia al front la informacion del modulos, privilegios y priviegios_modulos
*
* @param   {object}  param  objecto con la informacion necesaria para la construccion de la tabla en el front
*
* @return  {param}          el mismo objecto param que recibo pero con informacion adicional de las tablas mencionadas anteriormente
*/
function m1_2_gs_administrar_privilegios_cargar(param) {
  try {
    var modulos = query({
      tabla: "MODULO",
      campo: ["ID_MODULO", "MODULO"],
      condicion: {
        condicion: true,
        campo: ["ACTIVO", "ID_MODULO"],
        criterio: [1, 0],
        comparador: ["IGUAL", "DIFERENTE"],
        operador: ["Y"]
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_2_gs_administrar_privilegios_cargar",
        variable: "modulos"
      }
    });
    param.modulos = modulos.datos;
    var privilegios = query({
      tabla: "PRIVILEGIO",
      campo: ["ID_PRIVILEGIO", "PRIVILEGIO", "ID_MODULO"],
      condicion: {
        condicion: false,
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_2_gs_administrar_privilegios_cargar",
        variable: "privilegios"
      }
    });
    param.privilegios = privilegios.datos;
    var privilegio_usuario = query({
      tabla: "PRIVILEGIO_USUARIO",
      campo: ["ID_PRIVILEGIO", "ID_USUARIO"],
      condicion: {
        condicion: false,
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_2_gs_administrar_privilegios_cargar",
        variable: "privilegio_usuario"
      }
    });
    param.privilegios_usuario = privilegio_usuario.datos;
    return param;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param
    };
    log_error("m1_2_gs_administrar_privilegios_cargar", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* modifica los privilegios de determinado usuario
*
* @param   {number}  id_usuario     id usuario
* @param   {string}  id_privilegio  id privilegio a modificar
* @param   {boolean}  estado        falso a verdadero si se trata de adicionar o eliminar privilegio
*
* @return  {string}                 mensaje de estado sobre la operacion
*/
function m1_gs_modificar_privilegio(param) {
  try {
    var usuarios = query({
      tabla: "USUARIO",
      campo: ["CORREO"],
      condicion: {
        condicion: true,
        criterio: [param.id_usuario],
        campo: ["ID_USUARIO"],
        comparador: ["IGUAL"],
        operador: []
      },
      depuracion: {
        archivo: "controladores/m1_controlador",
        funcion: "m1_gs_modificar_privilegio",
        variable: "usuarios"
      }
    });
    var privilegio_usuario = query({
      tabla: "PRIVILEGIO_USUARIO",
      campo: [],
      condicion: {
        condicion: true,
        criterio: [param.id_privilegio, param.id_usuario],
        campo: ["ID_PRIVILEGIO", "ID_USUARIO"],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
      depuracion: {
        archivo: "controladores/m1_controlador",
        funcion: "m1_gs_modificar_privilegio",
        variable: "privilegio_usuario"
      }
    });
    if (privilegio_usuario.registros > 0) {
      privilegio_usuario.borrado();
    }
    if (param.estado) {
      privilegio_usuario.insercion({
        campo: ["ID_USUARIO", "ID_PRIVILEGIO"],
        valor: [param.id_usuario, param.id_privilegio],
        index: false
      });
    }
    return "Datos almacenados correctamente";
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: param
    };
    log_error("m1_gs_modificar_privilegio", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 3 - ADMON OFICINAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* carga los oficinas registrados en la app
*
* @param   {object}  param_tabla   objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}                objecto con los resultados de la consulta
*/
function m1_3_gs_listar_oficinas(param_tabla) {
  try {
    if (verificar_acceso("0_1")) {
      param_tabla.titulos = ["ID OFICINA", "OFICINA", "REGIONAL", "TIPO OFICINA","ACTIVO", ""];
      param_tabla.datos = [];
      var regionales = query({
        tabla: "REGIONAL",
        campo: ["REGIONAL", "ID_REGIONAL"],
        condicion: {
          condicion: false,
        },
        depuracion: {
          funcion: "m1_3_gs_listar_oficinas",
          variable: "regionales",
          archivo: "m1_controlador"
        }
      });
      for (var j = 0; j < regionales.registros; j++) {
        var oficinas = query({
          tabla: "OFICINA",
          campo: ["ID_OFICINA", "OFICINA", "ACTIVO", "TIPO_OFICINA"],
          condicion: {
            condicion: true,
            campo: ["ID_REGIONAL"],
            criterio: [regionales.datos[j].id_regional],
            comparador: ["IGUAL"],
            operador: []
          },
          depuracion: {
            funcion: "m1_3_gs_listar_oficinas",
            variable: "oficinas",
            archivo: "m1_controlador"
          }
        });
        for (var i = 0; i < oficinas.registros; i++) {
          var fila = [];
          fila.push(oficinas.datos[i].id_oficina);
          fila.push(oficinas.datos[i].oficina);
          fila.push(regionales.datos[j].regional);
					fila.push(oficinas.datos[i].tipo_oficina);
          if (oficinas.datos[i].activo == 1) {
            activo = "SI";
          } else {
            activo = "NO";
          }
          fila.push(activo);
          fila.push('<a href="#m0_div_panel_secundario" id="m1_3_btn_editar_oficina" data-id_oficina="' + oficinas.datos[i].id_oficina + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">edit</i></a>');
          param_tabla.datos.push(fila);
        }
      }
    } else {
      param_tabla.titulos = ["ID OFICINA", "OFICINA", "TIPO OFICINA", "ACTIVO", ""];
      param_tabla.datos = [];
      var activo;
      var oficinas = query({
        tabla: "OFICINA",
        campo: [],
        condicion: {
          condicion: true,
          campo: ["ID_REGIONAL"],
          criterio: [param_tabla.criterio.id_regional],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          funcion: "m1_3_gs_listar_oficinas",
          variable: "oficinas",
          archivo: "m1_controlador"
        }
      });
      for (var j = 0; j < oficinas.registros; j++) {
        var fila = [];
        fila.push(oficinas.datos[j].id_oficina);
        fila.push(oficinas.datos[j].oficina);
				fila.push(oficinas.datos[j].tipo_oficina);
        if (oficinas.datos[j].activo == 1) {
          activo = "SI";
        } else {
          activo = "NO";
        }
        fila.push(activo);
        fila.push('<a href="#m0_div_panel_secundario" id="m1_3_btn_editar_oficina" data-id_oficina="' + oficinas.datos[j].id_oficina + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">edit</i></a>');
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
    log_error("m1_3_gs_listar_oficinas", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* cargamos en el formulario la informacion de la oficina
*
* @param   {number}  id_oficina    id_de usuario
*
* @return  {object}                objecto con toda la informacion del usuario en cuestion
*/
function m1_gs_manipular_oficinas_llenar_formulario(id_oficina) {
  try {
    var oficinas = query({
      tabla: "OFICINA",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["ID_OFICINA"],
        criterio: [id_oficina],
        comparador: ["IGUAL"],
        operador: []
      },
      depuracion: {
        funcion: "m1_gs_manipular_oficinas_llenar_formulario",
        variable: "oficinas",
        archivo: "m1_controlador"
      }
    });
    var info_oficina = {
      id_oficina: id_oficina,
      id_regional: oficinas.datos[0].id_regional,
      oficina: oficinas.datos[0].oficina,
			tipo_oficina: oficinas.datos[0].tipo_oficina,
      activo: oficinas.datos[0].activo
    };
    return info_oficina;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: {
        "id_oficina": id_oficina
      }
    };
    log_error("m1_gs_manipular_oficinas_llenar_formulario", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* almacenamiento de datos del formulario de admon de oficinas
*
* @param   {object}  frm  objecto formulario
*
* @return  {r}            resultado de la operacion de almacenamiento
*/
function m1_3_gs_manipular_oficinas_guardar(frm) {
  try {
    var r = {
      exito: false,
      mensaje: "Error en el almacenamiento de los datos, por favor intentelo nuevamente  o comuniquese con el aministrador de la APP"
    }
    var chk_oficina = 0;
    if (frm.m1_3_chk_oficina_activa === "si") {
      chk_oficina = 1;
    }
    if (frm.m1_3_hid_operacion === "INSERCION") {
      var oficinas = query({
        tabla: "OFICINA",
        campo: [],
        condicion: {
          condicion: true,
          campo: ["OFICINA"],
          criterio: [frm.m1_3_txt_oficina.toUpperCase()],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_3_gs_manipular_oficinas_guardar",
          variable: "oficinas"
        }
      });
      if (oficinas.registros == 0) {
        var sw_insercion = oficinas.insercion({
          campo: [
            "ID_OFICINA",
            "OFICINA",
            "ID_REGIONAL",
						"TIPO_OFICINA",
            "ACTIVO"
          ],
          valor: [
            "",
            frm.m1_3_txt_oficina.toUpperCase(),
            frm.m1_3_hid_id_regional,
						frm.m1_3_sel_tipo_oficina,
            chk_oficina
          ],
          index: true
        });
        if (sw_insercion.exito) {
          r.mensaje = "Datos almacenados exitosamente";
          r.exito = true;
        }
      } else {
        r.mensaje = "Ya se encuentra una oficina registrada con este nombre";
        r.exito = false;
      }
    } else {
      var oficinas = query({
        tabla: "OFICINA",
        campo: [],
        condicion: {
          condicion: true,
          campo: ["ID_OFICINA"],
          criterio: [frm.m1_3_hid_id_oficina],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          archivo: "m1_controlador",
          funcion: "m1_3_gs_manipular_oficinas_guardar",
          variable: "oficinas"
        }
      });
      var sw_edicion = oficinas.edicion({
        campo: [
          "OFICINA",
          "ID_REGIONAL",
					"TIPO_OFICINA",
          "ACTIVO"
        ],
        valor: [
          frm.m1_3_txt_oficina.toUpperCase(),
          frm.m1_3_hid_id_regional,
					frm.m1_3_sel_tipo_oficina,
          chk_oficina
        ]
      });
      if (sw_edicion) {
        r.mensaje = "Datos almacenados exitosamente";
        r.exito = true;
      }
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: frm
    };
    log_error("m1_3_gs_manipular_oficinas_guardar", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}


//################################################################################################################################################################################################################
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCION 4 - DELEGACION OFICINAS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//################################################################################################################################################################################################################


/**
* carga los oficinas registrados en la app
*
* @param   {object}  param_tabla   objeto con el contenedor en donde se mostraran los resultados de la consulta y los criterios de busqueda
*
* @return  {object}                objecto con los resultados de la consulta
*/
function m1_4_gs_listar_usuarios(param_tabla) {
  try {
    param_tabla.titulos = ["ID USUARIO", "USUARIO", "NOMBRE", "OFICINA", "OFICINA ALTERNA", "FIN DELEGACIÓN", "ACTIVO", ""];
    param_tabla.datos = [];
    var activo;
    var usuarios = query({
      tabla: "USUARIO",
      campo: ["ID_USUARIO", "USUARIO", "NOMBRE", "ID_OFICINA"],
      condicion: {
        condicion: true,
        campo: ["ACTIVO", "CARGO"],
        criterio: [1, "JEFE PAC COLPENSIONES"],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
      depuracion: {
        funcion: "m1_4_gs_listar_usuarios",
        variable: "usuarios",
        archivo: "m1_controlador"
      }
    });
    for (var j = 0; j < usuarios.registros; j++) {
      var usuarios_oficina = query({
        tabla: "OFICINA",
        campo: ["OFICINA", "ID_REGIONAL"],
        condicion: {
          condicion: true,
          campo: ["ID_OFICINA"],
          criterio: [usuarios.datos[j].id_oficina],
          comparador: ["IGUAL"],
          operador: []
        },
        depuracion: {
          funcion: "m1_4_gs_listar_usuarios",
          variable: "usuario_oficina",
          archivo: "m1_controlador"
        }
      });
      if (usuarios_oficina.datos[0].id_regional == param_tabla.criterio.id_regional) {
        var fila = [];
        fila.push(usuarios.datos[j].id_usuario);
        fila.push(usuarios.datos[j].usuario);
        fila.push(usuarios.datos[j].nombre);
        var usuarios_delegacion = query({
          tabla: "USUARIO_DELEGACION",
          campo: ["ID_OFICINA_BASE", "ID_OFICINA_ALTERNA", "FIN_DELEGACION", "ACTIVO"],
          condicion: {
            condicion: true,
            campo: ["ID_USUARIO"],
            criterio: [usuarios.datos[j].id_usuario],
            comparador: ["IGUAL"],
            operador: []
          },
          depuracion: {
            funcion: "m1_4_gs_listar_usuarios",
            variable: "usuarios_delegacion",
            archivo: "m1_controlador"
          }
        });
        if (usuarios_delegacion.registros != 0) {
          id_oficina_base = usuarios_delegacion.datos[0].id_oficina_base;
          var usuarios_oficina_base = query({
            tabla: "OFICINA",
            campo: ["OFICINA", "ID_OFICINA"],
            condicion: {
              condicion: true,
              campo: ["ID_OFICINA"],
              criterio: [usuarios_delegacion.datos[0].id_oficina_base],
              comparador: ["IGUAL"],
              operador: []
            },
            depuracion: {
              funcion: "m1_4_gs_listar_usuarios",
              variable: "usuario_oficina",
              archivo: "m1_controlador"
            }
          });
          fila.push(usuarios_oficina_base.datos[0].oficina);
          var usuarios_oficina_alterna = query({
            tabla: "OFICINA",
            campo: ["OFICINA", "ID_OFICINA"],
            condicion: {
              condicion: true,
              campo: ["ID_OFICINA"],
              criterio: [usuarios_delegacion.datos[0].id_oficina_alterna],
              comparador: ["IGUAL"],
              operador: []
            },
            depuracion: {
              funcion: "m1_4_gs_listar_usuarios",
              variable: "usuario_oficina",
              archivo: "m1_controlador"
            }
          });
          fila.push(usuarios_oficina_alterna.datos[0].oficina);
          fila.push(fecha_texto(usuarios_delegacion.datos[0].fin_delegacion, "FECHA"));
          if (usuarios_delegacion.datos[0].activo == 1) {
            activo = "SI";
          } else {
            activo = "NO";
          }
          fila.push(activo);
        } else {
          fila.push(usuarios_oficina.datos[0].oficina);
          fila.push("");
          fila.push("");
          fila.push("");
        }
        fila.push('<a href="#m0_div_panel_secundario" id="m1_4_btn_delegar_usuario" data-id_usuario="' + usuarios.datos[j].id_usuario + '"  data-usuario="' + usuarios.datos[j].usuario + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" ><i class="material-icons">person_pin</i></a>');
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
    log_error("m1_4_gs_listar_usuarios", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* funcion para cargar la informacion de las oficinas en el select de admon de usuarios
*
* @param   {id_oficina}    id_oficina      id de la oficina
* @param   {number}        id_regional     id de la regional
*
* @return  {object}                        objecto con la informacion para llenar el select
*/
function m1_4_gs_delegar_oficina_llenar_formulario_oficinas(param_select) {
  try {
    var oficinas = query({
      tabla: "OFICINA",
      campo: ["OFICINA", "ID_OFICINA"],
      condicion: {
        condicion: true,
        campo: ["ID_REGIONAL", "ACTIVO"],
        criterio: [param_select.criterio.id_regional, 1],
        comparador: ["IGUAL", "IGUAL"],
        operador: ["Y"]
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_4_gs_delegar_oficina_llenar_formulario_oficinas",
        variable: "oficinas"
      }
    });
    var rango = {
      texto: "",
      valor: "",
      selected: "selected"
    };
    param_select.datos.push(rango);
    for (var j = 0; j < oficinas.registros; j++) {
      var rango = {
        texto: oficinas.datos[j].oficina,
        valor: oficinas.datos[j].id_oficina,
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
    log_error("m1_4_gs_delegar_oficina_llenar_formulario_oficinas", param, e);
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

/**
* almacenamiento de datos del formularion de delegacion de oficinas
*
* @param   {object}  frm   objecto formulario
*
* @return  {r}             resultado de la operacion de almacenamiento
*/
function m1_4_gs_delegar_oficina_guardar(frm) {
  try {
    
    var r = {
      exito: false,
      mensaje: "Error en el almacenamiento de los datos, por favor intentelo nuevamente  o comuniquese con el aministrador de la APP"
    }
    var chk_usuario = 0;
    if (frm.m1_4_chk_oficina_activa === "si") {
      chk_usuario = 1;
    }
    var usuarios_delegacion = query({
      tabla: "USUARIO_DELEGACION",
      campo: [],
      condicion: {
        condicion: true,
        campo: ["ID_USUARIO"],
        criterio: [frm.m1_4_hid_id_usuario],
        comparador: ["IGUAL"],
        operador: []
      },
      depuracion: {
        archivo: "m1_controlador",
        funcion: "m1_4_gs_delegar_oficina_guardar",
        variable: "usuarios_delegacion"
      }
    });
    if (usuarios_delegacion.registros > 0) {
      var id_oficina_base = usuarios_delegacion.datos[0].id_oficina_base;
      usuarios_delegacion.borrado();
    } else {
      var usuarios = query({
        tabla: "USUARIO",
        campo: ["ID_OFICINA"],
        condicion: {
          condicion: true,
          campo: ["ID_USUARIO"],
          criterio: [frm.m1_4_hid_id_usuario],
          comparador: ["IGUAL"],
          operador: []
        }
      });
      var id_oficina_base = usuarios.datos[0].id_oficina;
    }
    var sw_insercion = usuarios_delegacion.insercion({
      campo: [
        "ID_USUARIO",
        "ID_OFICINA_BASE",
        "ID_OFICINA_ALTERNA",
        "FIN_DELEGACION",
        "ACTIVO",
      ],
        valor: [
        frm.m1_4_hid_id_usuario,
        id_oficina_base,
        frm.m1_4_sel_oficina_alterna,
        frm.m1_4_txt_fin_delegacion,
        chk_usuario
      ],
      index: false
    });
    if (sw_insercion.exito) {
      r.mensaje = "Datos almacenados exitosamente";
      r.exito = true;
    }
    return r;
    //***************************CAPTURA DE ERRORES***********************************************************************
  } catch (e) {
    var param = {
      tipo_error: "codigo/GAS",
      parametros: frm
    };
    var id_error = log_error("m1_gs_manipular_usuarios_guardar", param, e);
    r.exito = false;
    r.error = "Error en la aplicación, por favor intente nuevamente o comuníquese con el administrador (id_error: " + id_error + ")"
    return r
  }
  //***************************CAPTURA DE ERRORES***********************************************************************
}