'use client';

import { useState } from 'react';

export default function InteresCompuesto() {
  const [incognita, setIncognita] = useState<'C' | 'i' | 'n' | 'M' | 'I'>('M');
  const [valores, setValores] = useState({
    C: '',
    i: '',
    n: '',
    m: '',
    M: '',
    I: '',
  });
  const [formula, setFormula] = useState('');
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [resultado, setResultado] = useState<{
    correcto: boolean;
    valorReal: number;
    mensaje: string;
  } | null>(null);

  const handleEvaluar = () => {
    // Validar campos requeridos
    const C = parseFloat(valores.C);
    const i = parseFloat(valores.i) / 100;
    const n = parseFloat(valores.n);
    const m = parseFloat(valores.m);
    const M = parseFloat(valores.M);
    const I = parseFloat(valores.I);

    // Validaciones básicas
    if (incognita !== 'C' && !valores.C) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el Capital (C)',
      });
      return;
    }

    if (incognita !== 'i' && !valores.i) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar la Tasa de Interés (i)',
      });
      return;
    }

    if (incognita !== 'n' && !valores.n) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el Tiempo (n)',
      });
      return;
    }

    if (!valores.m) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el número de Capitalizaciones por año (m)',
      });
      return;
    }

    if (incognita === 'I' && !valores.M && !valores.C) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Para calcular I necesitas C o M',
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
    let valorReal = 0;

    switch (incognita) {
      case 'M':
        // M = C * (1 + i/m)^(n*m)
        valorReal = C * Math.pow(1 + i / m, n * m);
        break;
      case 'I':
        // I = M - C
        if (valores.M) {
          valorReal = M - C;
        } else {
          const Mcalc = C * Math.pow(1 + i / m, n * m);
          valorReal = Mcalc - C;
        }
        break;
      case 'C':
        if (valores.M) {
          // C = M / (1 + i/m)^(n*m)
          valorReal = M / Math.pow(1 + i / m, n * m);
        } else if (valores.I) {
          // De I = M - C y M = C(1 + i/m)^(n*m)
          // I = C[(1 + i/m)^(n*m) - 1]
          // C = I / [(1 + i/m)^(n*m) - 1]
          valorReal = I / (Math.pow(1 + i / m, n * m) - 1);
        }
        break;
      case 'i':
        if (valores.M) {
          // i = m * [(M/C)^(1/(n*m)) - 1]
          valorReal = m * (Math.pow(M / C, 1 / (n * m)) - 1) * 100;
        } else if (valores.I) {
          // De I = C[(1 + i/m)^(n*m) - 1]
          // (1 + i/m)^(n*m) = (I + C) / C
          // i = m * [(I+C)/C]^(1/(n*m)) - m
          valorReal = m * (Math.pow((I + C) / C, 1 / (n * m)) - 1) * 100;
        }
        break;
      case 'n':
        if (valores.M) {
          // n = ln(M/C) / (m * ln(1 + i/m))
          valorReal = Math.log(M / C) / (m * Math.log(1 + i / m));
        } else if (valores.I) {
          // n = ln((I+C)/C) / (m * ln(1 + i/m))
          valorReal = Math.log((I + C) / C) / (m * Math.log(1 + i / m));
        }
        break;
    }

    const respuesta = parseFloat(respuestaUsuario);
    const tolerancia = Math.abs(valorReal * 0.01);
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
            📈 Calculadora de Interés Compuesto
          </h1>
          <p className="text-gray-600 mb-8">
            Fórmula: <strong>M = C(1 + i/m)^(n×m)</strong> | Interés: <strong>I = M - C</strong>
          </p>

          {/* Selección de incógnita */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Selecciona la incógnita a calcular:
            </label>
            <div className="grid grid-cols-5 gap-3">
              {['C', 'i', 'n', 'M', 'I'].map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => {
                    setIncognita(opcion as any);
                    setResultado(null);
                  }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    incognita === opcion
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              C = Capital | i = Tasa anual (%) | n = Tiempo (años) | m = Capitalizaciones/año | M = Monto | I = Interés
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
                Capitalizaciones por año (m)
              </label>
              <input
                type="number"
                value={valores.m}
                onChange={(e) => setValores({ ...valores, m: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ej: 12 (mensual), 4 (trimestral)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Anual=1, Semestral=2, Trimestral=4, Mensual=12
              </p>
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
                placeholder="Opcional"
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
                placeholder="Opcional"
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
              placeholder="Ej: M = C * (1 + i/m)^(n*m)"
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
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
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
