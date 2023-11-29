export class Participante {
  constructor(id, tipoDocumento, cedula, nombres, apellidos, celular, email, curso,
    tratDatos, estado, createdAt, updatedAt, tiposervicio) {
    this.id = id;
    this.tipoDocumento = tipoDocumento;
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.celular = celular;
    this.email = email;
    this.curso = curso;
    this.tratDatos = tratDatos;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (tiposervicio !== null) {
      this.tiposervicio_id = tiposervicio['id'];
      this.tiposervicio_nombre = tiposervicio['nombre'];
      this.tiposervicio_descripcion = tiposervicio['descripcion'];
      this.tiposervicio_createdAt = tiposervicio['createdAt'];
      this.tiposervicio_updatedAt = tiposervicio['updatedAt'];
      this.tiposervicio_form = tiposervicio['form'];
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
};