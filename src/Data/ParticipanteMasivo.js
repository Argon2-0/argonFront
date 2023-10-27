export class ParticipanteMasivo {
  constructor(tipoDocumento, cedula, nombres, apellidos, celular, sexo,
    tratDatos, fechaNacimiento, createdAt,  tiposervicio) {
    this.tipoDocumento = tipoDocumento;
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.celular = celular;
    this.sexo = sexo;
    this.tratDatos = tratDatos;
    this.createdAt = createdAt;
    this.fechaNacimiento = fechaNacimiento;
    this.tiposervicio = tiposervicio;
  }
};