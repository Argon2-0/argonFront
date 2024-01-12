export class HerramientaParticipante{
    constructor(id,observacionEntrada, observacionSalida, estado, totHoras, createdAt, updatedAt, participante, herramienta) {
      console.log(id)
      console.log(participante)
      console.log(participante['tiposervicio'])
      this.id = id;
      this.observacionSalida = observacionSalida;
      this.observacionEntrada = observacionEntrada;
      this.estado = estado;
      this.totHoras = totHoras;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      if (participante !== null) {
        this.participante_id = participante['id'];
        this.participante_tipoDocumento = participante['tipoDocumento'];
        this.participante_documento = participante['cedula'];
        this.participante_nombres = participante['nombres'];
        this.participante_apellidos = participante['apellidos'];
        this.participante_celular = participante['celular'];
        this.participante_email = participante['email'];
        this.participante_tratDatos = participante['tratDatos'];
        if (participante['tiposervicio'] !== null) {
          this.tiposervicio_id = (participante['tiposervicio'])['id'];
          this.tiposervicio_nombre = (participante['tiposervicio'])['nombre'];
          this.tiposervicio_descripcion = (participante['tiposervicio'])['descripcion'];
        }
        else {
          this.tiposervicio_id = null;
          this.tiposervicio_nombre = null;
          this.tiposervicio_descripcion = null;
        }
      }
      else {
        this.participante_id = null;
        this.participante_tipoDocumento = null;
        this.participante_documento = null;
        this.participante_nombres = null;
        this.participante_apellidos = null;
        this.participante_celular = null;
        this.participante_email = null;
        this.participante_tratDatos = null;
        this.participante_createdAt = null;
        this.participante_updatedAt = null;
        this.tiposervicio_id = null;
        this.tiposervicio_nombre = null;
        this.tiposervicio_descripcion = null;
      }
      if (herramienta !== null) {
        this.herrmienta_id = herramienta['id'];
        this.herrmienta_nombre = herramienta['nombre'];
        this.herrmienta_descripcion = herramienta['descripcion']; ;
        this.herrmienta_marca = herramienta['marca'];
        this.herrmienta_serial = herramienta['serial'];
        this.herrmienta_codigoBarras = herramienta['codigoBarras'];
      }
      else{
        this.herrmienta_id = null;
        this.herrmienta_nombre = null;
        this.herrmienta_descripcion = null;
        this.herrmienta_marca = null;
        this.herrmienta_serial = null;
        this.herrmienta_codigoBarras = null;
      }
    }
  };