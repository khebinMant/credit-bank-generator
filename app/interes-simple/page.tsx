'use client';

import { useState } from 'react';

export default function InteresSimple() {
  const [incognita, setIncognita] = useState<'C' | 'i' | 'n' | 'I' | 'M'>('I');
  const [valores, setValores] = useState({
    C: '',
    i: '',
    n: '',
    I: '',
    M: '',
  });
  const [formula, setFormula] = useState('');
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [resultado, setResultado] = useState<{
    correcto: boolean;
    valorReal: number;
    mensaje: string;
  } | null>(null);

  const handleEvaluar = () => {
    // Validar que todos los campos excepto la incógnita estén llenos
    const camposRequeridos = ['C', 'i', 'n'];
    if (incognita === 'I') {
      // Para calcular I necesitamos C, i, n
    } else if (incognita === 'M') {
      // Para calcular M necesitamos C, i, n
    } else if (incognita === 'C') {
      // Para calcular C necesitamos I, i, n (o M, i, n)
      camposRequeridos.splice(0, 1);
      if (valores.I || valores.M) {
        camposRequeridos.push(valores.I ? 'I' : 'M');
      }
    } else if (incognita === 'i') {
      // Para calcular i necesitamos C, I, n (o C, M, n)
      camposRequeridos.splice(1, 1);
      if (valores.I || valores.M) {
        camposRequeridos.push(valores.I ? 'I' : 'M');
      }
    } else if (incognita === 'n') {
      // Para calcular n necesitamos C, i, I (o C, i, M)
      camposRequeridos.splice(2, 1);
      if (valores.I || valores.M) {
        camposRequeridos.push(valores.I ? 'I' : 'M');
      }
    }

    const camposFaltantes = camposRequeridos.filter(campo => !valores[campo as keyof typeof valores]);
    if (camposFaltantes.length > 0) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`,
      });
      return;
    }

    if (!formula.trim()) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar la fórmula que utilizaste',
      });
      return;
    }

    if (!respuestaUsuario.trim()) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar tu respuesta calculada',
      });
      return;
    }

    // Calcular el valor real
    const C = parseFloat(valores.C);
    const i = parseFloat(valores.i) / 100; // Convertir porcentaje a decimal
    const n = parseFloat(valores.n);
    const I = parseFloat(valores.I);
    const M = parseFloat(valores.M);

    let valorReal = 0;

    switch (incognita) {
      case 'I':
        // I = C * i * n
        valorReal = C * i * n;
        break;
      case 'M':
        // M = C + I = C(1 + i*n)
        valorReal = C * (1 + i * n);
        break;
      case 'C':
        if (valores.I) {
          // C = I / (i * n)
          valorReal = I / (i * n);
        } else if (valores.M) {
          // C = M / (1 + i*n)
          valorReal = M / (1 + i * n);
        }
        break;
      case 'i':
        if (valores.I) {
          // i = I / (C * n)
          valorReal = (I / (C * n)) * 100; // Convertir a porcentaje
        } else if (valores.M) {
          // i = (M - C) / (C * n)
          valorReal = ((M - C) / (C * n)) * 100;
        }
        break;
      case 'n':
        if (valores.I) {
          // n = I / (C * i)
          valorReal = I / (C * i);
        } else if (valores.M) {
          // n = (M - C) / (C * i)
          valorReal = (M - C) / (C * i);
        }
        break;
    }

    const respuesta = parseFloat(respuestaUsuario);
    const tolerancia = Math.abs(valorReal * 0.01); // 1% de tolerancia
    const correcto = Math.abs(respuesta - valorReal) <= tolerancia;

    setResultado({
      correcto,
      valorReal,
      mensaje: correcto
        ? '¡Correcto! Tu respuesta es acertada.'
        : `Incorrecto. El valor correcto es: ${valorReal.toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Calculadora de Interés Simple
          </h1>
          <p className="text-gray-600 mb-8">
            Fórmula: <strong>I = C × i × n</strong> | Monto: <strong>M = C + I = C(1 + i×n)</strong>
          </p>

          {/* Selección de incógnita */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Selecciona la incógnita a calcular:
            </label>
            <div className="grid grid-cols-5 gap-3">
              {['C', 'i', 'n', 'I', 'M'].map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => {
                    setIncognita(opcion as any);
                    setResultado(null);
                  }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    incognita === opcion
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              C = Capital | i = Tasa de interés anual (%) | n = Tiempo (años) | I = Interés | M = Monto
            </p>
          </div>

          {/* Campos de entrada */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Capital (C) {incognita === 'C' && '← Incógnita'}
              </label>
              <input
                type="number"
                value={valores.C}
                onChange={(e) => setValores({ ...valores, C: e.target.value })}
                disabled={incognita === 'C'}
                className={`w-full p-3 border rounded-lg ${
                  incognita === 'C'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'border-gray-300'
                }`}
                placeholder="Ingresa el capital"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tasa de Interés Anual (i) % {incognita === 'i' && '← Incógnita'}
              </label>
              <input
                type="number"
                value={valores.i}
                onChange={(e) => setValores({ ...valores, i: e.target.value })}
                disabled={incognita === 'i'}
                className={`w-full p-3 border rounded-lg ${
                  incognita === 'i'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'border-gray-300'
                }`}
                placeholder="Ingresa la tasa (%)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tiempo (n) años {incognita === 'n' && '← Incógnita'}
              </label>
              <input
                type="number"
                value={valores.n}
                onChange={(e) => setValores({ ...valores, n: e.target.value })}
                disabled={incognita === 'n'}
                className={`w-full p-3 border rounded-lg ${
                  incognita === 'n'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'border-gray-300'
                }`}
                placeholder="Ingresa el tiempo"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Interés (I) {incognita === 'I' && '← Incógnita'}
              </label>
              <input
                type="number"
                value={valores.I}
                onChange={(e) => setValores({ ...valores, I: e.target.value })}
                disabled={incognita === 'I'}
                className={`w-full p-3 border rounded-lg ${
                  incognita === 'I'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'border-gray-300'
                }`}
                placeholder="Opcional (o usa M)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Monto (M) {incognita === 'M' && '← Incógnita'}
              </label>
              <input
                type="number"
                value={valores.M}
                onChange={(e) => setValores({ ...valores, M: e.target.value })}
                disabled={incognita === 'M'}
                className={`w-full p-3 border rounded-lg ${
                  incognita === 'M'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'border-gray-300'
                }`}
                placeholder="Opcional (o usa I)"
              />
            </div>
          </div>

          {/* Fórmula */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Fórmula que utilizarás:
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Ej: I = C * i * n"
            />
          </div>

          {/* Respuesta del usuario */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tu respuesta para <strong>{incognita}</strong>:
            </label>
            <input
              type="number"
              value={respuestaUsuario}
              onChange={(e) => setRespuestaUsuario(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder={`Ingresa el valor de ${incognita}`}
            />
          </div>

          {/* Botón evaluar */}
          <button
            onClick={handleEvaluar}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Evaluar Respuesta
          </button>

          {/* Resultado */}
          {resultado && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                resultado.correcto
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
              }`}
            >
              <h3
                className={`text-xl font-bold mb-2 ${
                  resultado.correcto ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {resultado.correcto ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </h3>
              <p className="text-gray-700">{resultado.mensaje}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
