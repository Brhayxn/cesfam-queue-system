import Swal from "sweetalert2";

export default function validarRUT(rutCompleto) {
    // Limpia puntos y guión
    rutCompleto = rutCompleto.replace(/\./g, '').replace('-', '').toUpperCase();

    // Extrae número y dígito verificador
    const rut = rutCompleto.slice(0, -1);
    const dv = rutCompleto.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    // Recorre el RUT de derecha a izquierda
    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const digitoCalculado = 11 - resto;

    let dvEsperado;
    if (digitoCalculado === 11) {
        dvEsperado = '0';
    } else if (digitoCalculado === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = digitoCalculado.toString();
    }

    return dv === dvEsperado;
}

