'use client';

import { useState } from 'react';

type TablaCuota = {
  numero: number;
  cuota: number;
  capital: number;
  interes: number;
  saldo: number;
};

export default function SimuladorCredito() {
  const [datos, setDatos] = useState({
    monto: '',
    tasaAnual: '',
    tiempo: '',
    pagosAnio: '',
  });
  const [tipoTabla, setTipoTabla] = useState<'francesa' | 'alemana'>('francesa');
  const [tabla, setTabla] = useState<TablaCuota[]>([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const calcularCuotaFrancesa = (C: number, i: number, n: number): number => {
    // Cuota = C * [i * (1+i)^n] / [(1+i)^n - 1]
    const numerador = i * Math.pow(1 + i, n);
    const denominador = Math.pow(1 + i, n) - 1;
    return (C * numerador) / denominador;
  };

  const generarTablaFrancesa = () => {
    const C = parseFloat(datos.monto);
    const tasaAnual = parseFloat(datos.tasaAnual) / 100;
    const tiempo = parseFloat(datos.tiempo);
    const m = parseFloat(datos.pagosAnio);

    const i = tasaAnual / m; // Tasa por período
    const n = tiempo * m; // Número total de pagos

    const cuotaFija = calcularCuotaFrancesa(C, i, n);
    let saldo = C;
    const tablaNueva: TablaCuota[] = [];

    for (let periodo = 1; periodo <= n; periodo++) {
      const interes = saldo * i;
      const capital = cuotaFija - interes;
      saldo -= capital;

      // Ajustar último período para evitar errores de redondeo
      if (periodo === n && saldo < 0.01) {
        saldo = 0;
      }

      tablaNueva.push({
        numero: periodo,
        cuota: cuotaFija,
        capital,
        interes,
        saldo: Math.max(0, saldo),
      });
    }

    setTabla(tablaNueva);
    setMostrarTabla(true);
  };

  const generarTablaAlemana = () => {
    const C = parseFloat(datos.monto);
    const tasaAnual = parseFloat(datos.tasaAnual) / 100;
    const tiempo = parseFloat(datos.tiempo);
    const m = parseFloat(datos.pagosAnio);

    const i = tasaAnual / m;
    const n = tiempo * m;

    const capitalFijo = C / n; // Capital constante por período
    let saldo = C;
    const tablaNueva: TablaCuota[] = [];

    for (let periodo = 1; periodo <= n; periodo++) {
      const interes = saldo * i;
      const cuota = capitalFijo + interes;
      saldo -= capitalFijo;

      if (periodo === n && saldo < 0.01) {
        saldo = 0;
      }

      tablaNueva.push({
        numero: periodo,
        cuota,
        capital: capitalFijo,
        interes,
        saldo: Math.max(0, saldo),
      });
    }

    setTabla(tablaNueva);
    setMostrarTabla(true);
  };

  const handleCalcular = () => {
    // Validaciones
    if (!datos.monto || !datos.tasaAnual || !datos.tiempo || !datos.pagosAnio) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const monto = parseFloat(datos.monto);
    const tasa = parseFloat(datos.tasaAnual);
    const tiempo = parseFloat(datos.tiempo);
    const pagos = parseFloat(datos.pagosAnio);

    if (monto <= 0 || tasa <= 0 || tiempo <= 0 || pagos <= 0) {
      alert('Todos los valores deben ser mayores a 0');
      return;
    }

    if (tipoTabla === 'francesa') {
      generarTablaFrancesa();
    } else {
      generarTablaAlemana();
    }
  };

  const calcularTotales = () => {
    const totalCuotas = tabla.reduce((sum, row) => sum + row.cuota, 0);
    const totalCapital = tabla.reduce((sum, row) => sum + row.capital, 0);
    const totalInteres = tabla.reduce((sum, row) => sum + row.interes, 0);

    return { totalCuotas, totalCapital, totalInteres };
  };

  const totales = mostrarTabla ? calcularTotales() : null;

  return (
    <div className="min-h-screen p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 Simulador de Crédito Bancario
          </h1>
          <p className="text-gray-600 mb-8">
            Genera tablas de amortización con sistema <strong>Francés</strong> (cuotas constantes) o{' '}
            <strong>Alemán</strong> (capital constante)
          </p>

          {/* Selección de tipo de tabla */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Selecciona el sistema de amortización:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTipoTabla('francesa')}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  tipoTabla === 'francesa'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🇫🇷 Tabla Francesa
                <p className="text-sm mt-1 opacity-90">Cuotas constantes</p>
              </button>
              <button
                onClick={() => setTipoTabla('alemana')}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  tipoTabla === 'alemana'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🇩🇪 Tabla Alemana
                <p className="text-sm mt-1 opacity-90">Capital constante</p>
              </button>
            </div>
          </div>

          {/* Campos de entrada */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Monto del Crédito (C)
              </label>
              <input
                type="number"
                value={datos.monto}
                onChange={(e) => setDatos({ ...datos, monto: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ej: 10000"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tasa de Interés Anual (i) %
              </label>
              <input
                type="number"
                value={datos.tasaAnual}
                onChange={(e) => setDatos({ ...datos, tasaAnual: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ej: 12"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tiempo en años (n)
              </label>
              <input
                type="number"
                value={datos.tiempo}
                onChange={(e) => setDatos({ ...datos, tiempo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ej: 2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Número de pagos por año (m)
              </label>
              <input
                type="number"
                value={datos.pagosAnio}
                onChange={(e) => setDatos({ ...datos, pagosAnio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ej: 12 (mensual)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Anual=1, Semestral=2, Trimestral=4, Mensual=12
              </p>
            </div>
          </div>

          {/* Botón calcular */}
          <button
            onClick={handleCalcular}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Calcular Tabla de Amortización
          </button>
        </div>

        {/* Tabla de resultados */}
        {mostrarTabla && tabla.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              📋 Tabla de Amortización - Sistema {tipoTabla === 'francesa' ? 'Francés' : 'Alemán'}
            </h2>

            {/* Resumen */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${totales?.totalCuotas.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600">Capital Total</p>
                <p className="text-2xl font-bold text-green-700">
                  ${totales?.totalCapital.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <p className="text-sm text-gray-600">Intereses Totales</p>
                <p className="text-2xl font-bold text-red-700">
                  ${totales?.totalInteres.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Tabla scrollable */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-purple-600 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">Cuota #</th>
                    <th className="px-4 py-3 text-right">Cuota</th>
                    <th className="px-4 py-3 text-right">Capital</th>
                    <th className="px-4 py-3 text-right">Interés</th>
                    <th className="px-4 py-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((fila, index) => (
                    <tr
                      key={fila.numero}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-4 py-3 font-semibold">{fila.numero}</td>
                      <td className="px-4 py-3 text-right">${fila.cuota.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-600">
                        ${fila.capital.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        ${fila.interes.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${fila.saldo.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-200 font-bold sticky bottom-0">
                  <tr>
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right">${totales?.totalCuotas.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-green-700">
                      ${totales?.totalCapital.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-700">
                      ${totales?.totalInteres.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Botón para exportar o imprimir */}
            <button
              onClick={() => window.print()}
              className="mt-6 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              🖨️ Imprimir Tabla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
