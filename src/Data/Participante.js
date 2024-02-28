export class Participante {
  constructor(id, tipoDocumento, cedula, nombres, apellidos, celular, email, 
    tratDatos, estado, createdAt, updatedAt) {
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
  }
};