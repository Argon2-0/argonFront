export class PrestamosInforme{
    constructor(TipoDocumentovisitante, Documentovisitante, nombres, apellidos, celular, email, marca, referencia, codigoBarras, estado, observacionPrestamo, observacionDevolucion, fechaPrestamo, fechaDevolucion) {
        this.TipoDocumentovisitante = TipoDocumentovisitante;
        this.Documentovisitante = Documentovisitante;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.celular = celular;
        this.email = email;
        this.marca = marca;
        this.referencia = referencia;
        this.codigoBarras = codigoBarras;
        this.estado = estado;
        this.observacionPrestamo = observacionPrestamo;
        this.observacionDevolucion = observacionDevolucion;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaDevolucion = fechaDevolucion;
    }
};