export class HerramientaParticipante{
    constructor(id, observacionSalida, observacionEntrada, estado, totHoras, createdAt, updatedAt, participante, herramienta) {
      console.log(id)
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
      if (herramienta !== null) {
        this.herrmienta_id = herramienta['id'];
        this.herrmienta_nombre = herramienta['nombre'];
        this.herrmienta_descripcion = herramienta['descripcion']; ;
        this.herrmienta_marca = herramienta['marca'];
        this.herrmienta_serial = herramienta['serial'];
        this.herrmienta_codigoBarras = herramienta['codigoBarras'];
        this.herrmienta_estado = herramienta['estado'];
        this.herrmienta_createdAt = herramienta['createdAt'];
        this.herrmienta_updatedAt = herramienta['updatedAt'];
        if (herramienta['participante'] !== null) {
          this.herrmienta_participante_id = (herramienta['participante'])['id'];
          this.herrmienta_participante_tipoDocumento = (herramienta['participante'])['tipoDocumento'];
          this.herrmienta_participante_cedula = (herramienta['participante'])['cedula'];
          this.herrmienta_participante_nombres = (herramienta['participante'])['nombres'];
          this.herrmienta_participante_apellidos = (herramienta['participante'])['apellidos'];
          this.herrmienta_participante_fechaNacimiento = (herramienta['participante'])['fechaNacimiento'];
          this.herrmienta_participante_celular = (herramienta['participante'])['celular'];
          this.herrmienta_participante_sexo = (herramienta['participante'])['sexo'];
          this.herrmienta_participante_email = (herramienta['participante'])['email'];
          this.herrmienta_participante_curso = (herramienta['participante'])['curso'];
          this.herrmienta_participante_tratDatos = (herramienta['participante'])['tratDatos'];
          this.herrmienta_participante_estado = (herramienta['participante'])['estado'];
          this.herrmienta_participante_createdAt = (herramienta['participante'])['createdAt'];
          this.herrmienta_participante_updatedAt = (herramienta['participante'])['updatedAt'];
          if ((herramienta['participante'])['tiposervicio'] !== null) {
            this.herrmienta_tiposervicio_id = ((herramienta['participante'])['tiposervicio'])['id'];
            this.herrmienta_tiposervicio_nombre = ((herramienta['participante'])['tiposervicio'])['nombre'];
            this.herrmienta_tiposervicio_descripcion = ((herramienta['participante'])['tiposervicio'])['descripcion'];
            this.herrmienta_tiposervicio_createdAt = ((herramienta['participante'])['tiposervicio'])['createdAt'];
            this.herrmienta_tiposervicio_updatedAt = ((herramienta['participante'])['tiposervicio'])['updatedAt'];
            this.herrmienta_tiposervicio_form = ((herramienta['participante'])['tiposervicio'])['form'];
          }
          else {
            this.herrmienta_tiposervicio_id = null;
            this.herrmienta_tiposervicio_nombre = null;
            this.herrmienta_tiposervicio_descripcion = null;
            this.herrmienta_tiposervicio_createdAt = null;
            this.herrmienta_tiposervicio_updatedAt = null;
            this.herrmienta_tiposervicio_form = null;
          }
        }
        else {
          this.herrmienta_participante_id = null;
          this.herrmienta_participante_tipoDocumento = null;
          this.herrmienta_participante_cedula = null;
          this.herrmienta_participante_nombres = null;
          this.herrmienta_participante_apellidos = null;
          this.herrmienta_participante_fechaNacimiento = null;
          this.herrmienta_participante_celular = null;
          this.herrmienta_participante_sexo = null;
          this.herrmienta_participante_email = null;
          this.herrmienta_participante_curso = null;
          this.herrmienta_participante_tratDatos = null;
          this.herrmienta_participante_estado = null;
          this.herrmienta_participante_createdAt = null;
          this.herrmienta_participante_updatedAt = null;
          this.herrmienta_tiposervicio_id = null;
          this.herrmienta_tiposervicio_nombre = null;
          this.herrmienta_tiposervicio_descripcion = null;
          this.herrmienta_tiposervicio_createdAt = null;
          this.herrmienta_tiposervicio_updatedAt = null;
          this.herrmienta_tiposervicio_form = null;
        }
      }
      else{
        this.herrmienta_id = null;
        this.herrmienta_nombre = null;
        this.herrmienta_descripcion = null;
        this.herrmienta_marca = null;
        this.herrmienta_serial = null;
        this.herrmienta_codigoBarras = null;
        this.herrmienta_estado = null;
        this.herrmienta_createdAt = null;
        this.herrmienta_updatedAt = null;
      }
    }
  };