export class Participante {
  constructor(id, tipoDocumento, cedula, nombres, apellidos, celular, email, 
    tratDatos, estado, createdAt, updatedAt, tiposervicio) {
    this.id = id;
    this.tipoDocumento = tipoDocumento;
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.celular = celular;
    this.email = email;
    this.tratDatos = tratDatos;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (tiposervicio !== null) {
      this.tiposervicio_id = tiposervicio['id'];
      this.tiposervicio_nombre = tiposervicio['nombre'];
      this.tiposervicio_descripcion = tiposervicio['descripcion'];
    }
    else {
      this.tiposervicio_id = null;
      this.tiposervicio_nombre = null;
      this.tiposervicio_descripcion = null;
    }
  }
};