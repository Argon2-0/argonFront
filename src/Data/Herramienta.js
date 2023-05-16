export class Herramienta {
  constructor(id, nombre, descripcion, marca, serial, codigoBarras, estado, createdAt, updatedAt,
    participante) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.marca = marca;
    this.serial = serial;
    this.codigoBarras = codigoBarras;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (participante !== null) {
      this.participante_id = participante['id'];
      this.participante_tipoDocumento = participante['tipoDocumento'];
      this.participante_cedula = participante['cedula'];
      this.participante_nombres = participante['nombres'];
      this.participante_apellidos = participante['apellidos'];
      this.participante_fechaNacimiento = participante['fechaNacimiento'];
      this.participante_celular = participante['celular'];
      this.participante_sexo = participante['sexo'];
      this.participante_email = participante['email'];
      this.participante_curso = participante['curso'];
      this.participante_tratDatos = participante['tratDatos'];
      this.participante_estado = participante['estado'];
      this.participante_createdAt = participante['createdAt'];
      this.participante_updatedAt = participante['updatedAt'];
      if (participante['tiposervicio'] !== null) {
        this.tiposervicio_id = (participante['tiposervicio'])['id'];
        this.tiposervicio_nombre = (participante['tiposervicio'])['nombre'];
        this.tiposervicio_descripcion = (participante['tiposervicio'])['descripcion'];
        this.tiposervicio_createdAt = (participante['tiposervicio'])['createdAt'];
        this.tiposervicio_updatedAt = (participante['tiposervicio'])['updatedAt'];
        this.tiposervicio_form = (participante['tiposervicio'])['form'];
      }
      else {
        this.tiposervicio_id = null;
        this.tiposervicio_nombre = null;
        this.tiposervicio_descripcion = null;
        this.tiposervicio_createdAt = null;
        this.tiposervicio_updatedAt = null;
        this.tiposervicio_form = null;
      }
    }
    else {
      this.participante_id = null;
      this.participante_tipoDocumento = null;
      this.participante_cedula = null;
      this.participante_nombres = null;
      this.participante_apellidos = null;
      this.participante_fechaNacimiento = null;
      this.participante_celular = null;
      this.participante_sexo = null;
      this.participante_email = null;
      this.participante_curso = null;
      this.participante_tratDatos = null;
      this.participante_estado = null;
      this.participante_createdAt = null;
      this.participante_updatedAt = null;
      this.tiposervicio_id = null;
      this.tiposervicio_nombre = null;
      this.tiposervicio_descripcion = null;
      this.tiposervicio_createdAt = null;
      this.tiposervicio_updatedAt = null;
      this.tiposervicio_form = null;
    }
  }
};