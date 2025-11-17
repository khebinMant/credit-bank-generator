'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  C: string;
  i: string;
  n: string;
  m: string;
  M: string;
  I: string;
  respuesta: string;
};

export default function InteresCompuesto() {
  const [incognita, setIncognita] = useState<'C' | 'i' | 'n' | 'M' | 'I'>('M');
  const [resultado, setResultado] = useState<{
    correcto: boolean;
    valorReal: number;
    mensaje: string;
  } | null>(null);

  const getFormula = () => {
    switch (incognita) {
      case 'M': return 'M = C(1 + i/m)^(n×m)';
      case 'I': return 'I = M - C';
      case 'C': return 'C = M / (1 + i/m)^(n×m)';
      case 'i': return 'i = m × [(M/C)^(1/(n×m)) - 1]';
      case 'n': return 'n = ln(M/C) / (m × ln(1 + i/m))';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    const C = parseFloat(data.C);
    const i = parseFloat(data.i) / 100;
    const n = parseFloat(data.n);
    const m = parseFloat(data.m);
    const M = parseFloat(data.M);
    const I = parseFloat(data.I);

    if (incognita !== 'C' && !data.C) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el Capital (C)',
      });
      return;
    }

    if (incognita !== 'i' && !data.i) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar la Tasa de Interés (i)',
      });
      return;
    }

    if (incognita !== 'n' && !data.n) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el Tiempo (n)',
      });
      return;
    }

    if (!data.m) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar el número de Capitalizaciones por año (m)',
      });
      return;
    }

    if (!data.respuesta?.trim()) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar tu respuesta calculada',
      });
      return;
    }

    let valorReal = 0;

    switch (incognita) {
      case 'M':
        valorReal = C * Math.pow(1 + i / m, n * m);
        break;
      case 'I':
        if (data.M) {
          valorReal = M - C;
        } else {
          const Mcalc = C * Math.pow(1 + i / m, n * m);
          valorReal = Mcalc - C;
        }
        break;
      case 'C':
        if (data.M) {
          valorReal = M / Math.pow(1 + i / m, n * m);
        } else if (data.I) {
          valorReal = I / (Math.pow(1 + i / m, n * m) - 1);
        }
        break;
      case 'i':
        if (data.M) {
          valorReal = m * (Math.pow(M / C, 1 / (n * m)) - 1) * 100;
        } else if (data.I) {
          valorReal = m * (Math.pow((I + C) / C, 1 / (n * m)) - 1) * 100;
        }
        break;
      case 'n':
        if (data.M) {
          valorReal = Math.log(M / C) / (m * Math.log(1 + i / m));
        } else if (data.I) {
          valorReal = Math.log((I + C) / C) / (m * Math.log(1 + i / m));
        }
        break;
    }

    const respuesta = parseFloat(data.respuesta);
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
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="border-l-4 border-emerald-600 pl-4 mb-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              📈 Calculadora de Interés Compuesto
            </h1>
            <p className="text-slate-600">
              Fórmula: <strong className="text-emerald-700">M = C(1 + i/m)^(n×m)</strong> | Interés: <strong className="text-emerald-700">I = M - C</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Selección de incógnita */}
            <div className="mb-8 bg-emerald-50 p-6 rounded-xl border border-emerald-200">
              <label className="block text-slate-800 font-bold mb-3 text-lg">
                Selecciona la incógnita a calcular:
              </label>
              <div className="grid grid-cols-5 gap-3">
                {['C', 'i', 'n', 'M', 'I'].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => {
                      setIncognita(opcion as any);
                      setResultado(null);
                    }}
                    className={`py-4 px-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      incognita === opcion
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                        : 'bg-white text-slate-700 hover:bg-emerald-100 border-2 border-emerald-300'
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-3 bg-white p-3 rounded-lg">
                <strong>C</strong> = Capital | <strong>i</strong> = Tasa anual (%) | <strong>n</strong> = Tiempo (años) | <strong>m</strong> = Capitalizaciones/año | <strong>M</strong> = Monto | <strong>I</strong> = Interés
              </p>
            </div>

            {/* Campos de entrada */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                  Capital (C)
                  {incognita === 'C' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">← Incógnita</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('C', {
                    required: incognita !== 'C',
                    min: { value: 0.01, message: 'Debe ser mayor a 0' },
                  })}
                  disabled={incognita === 'C'}
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-emerald-200 ${
                    incognita === 'C'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-emerald-400 focus:border-emerald-600 bg-white'
                  }`}
                  placeholder="Ej: 10000"
                />
                {errors.C && <p className="text-red-600 text-sm mt-1">{errors.C.message}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                  Tasa de Interés Anual (i) %
                  {incognita === 'i' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">← Incógnita</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('i', {
                    required: incognita !== 'i',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                  })}
                  disabled={incognita === 'i'}
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-emerald-200 ${
                    incognita === 'i'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-emerald-400 focus:border-emerald-600 bg-white'
                  }`}
                  placeholder="Ej: 12"
                />
                {errors.i && <p className="text-red-600 text-sm mt-1">{errors.i.message}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                  Tiempo (n) años
                  {incognita === 'n' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">← Incógnita</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('n', {
                    required: incognita !== 'n',
                    min: { value: 0.01, message: 'Debe ser mayor a 0' },
                  })}
                  disabled={incognita === 'n'}
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-emerald-200 ${
                    incognita === 'n'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-emerald-400 focus:border-emerald-600 bg-white'
                  }`}
                  placeholder="Ej: 5"
                />
                {errors.n && <p className="text-red-600 text-sm mt-1">{errors.n.message}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  Capitalizaciones por año (m)
                </label>
                <input
                  type="number"
                  {...register('m', {
                    required: 'Requerido',
                    min: { value: 1, message: 'Mínimo 1' },
                  })}
                  className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-800 font-semibold text-lg focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 transition-all bg-white"
                  placeholder="Ej: 12 (mensual)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Anual=1, Semestral=2, Trimestral=4, Mensual=12
                </p>
                {errors.m && <p className="text-red-600 text-sm mt-1">{errors.m.message}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                  Monto (M)
                  {incognita === 'M' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">← Incógnita</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('M', {
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                  })}
                  disabled={incognita === 'M'}
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-emerald-200 ${
                    incognita === 'M'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-emerald-400 focus:border-emerald-600 bg-white'
                  }`}
                  placeholder="Opcional"
                />
                {errors.M && <p className="text-red-600 text-sm mt-1">{errors.M.message}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
                  Interés (I)
                  {incognita === 'I' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">← Incógnita</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('I', {
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                  })}
                  disabled={incognita === 'I'}
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-emerald-200 ${
                    incognita === 'I'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-emerald-400 focus:border-emerald-600 bg-white'
                  }`}
                  placeholder="Opcional"
                />
                {errors.I && <p className="text-red-600 text-sm mt-1">{errors.I.message}</p>}
              </div>
            </div>

            {/* Fórmula automática */}
            <div className="mb-6 bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200">
              <label className="block text-slate-700 font-bold mb-2">
                📐 Fórmula a utilizar:
              </label>
              <div className="text-2xl font-bold text-emerald-700 bg-white p-4 rounded-lg border border-emerald-200 text-center">
                {getFormula()}
              </div>
            </div>

            {/* Respuesta del usuario */}
            <div className="mb-8">
              <label className="block text-slate-700 font-bold mb-2">
                💡 Tu respuesta para <strong className="text-emerald-600">{incognita}</strong>:
              </label>
              <input
                type="number"
                step="0.01"
                {...register('respuesta', { required: 'La respuesta es requerida' })}
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-800 font-semibold text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                placeholder={`Ingresa el valor de ${incognita}`}
              />
              {errors.respuesta && <p className="text-red-600 text-sm mt-1">{errors.respuesta.message}</p>}
            </div>

            {/* Botón evaluar */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-5 rounded-xl font-bold text-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              ✓ Evaluar Respuesta
            </button>
          </form>

          {/* Resultado */}
          {resultado && (
            <div
              className={`mt-8 p-6 rounded-xl border-2 ${
                resultado.correcto
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-2 ${
                  resultado.correcto ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {resultado.correcto ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </h3>
              <p className={`text-lg ${resultado.correcto ? 'text-emerald-800' : 'text-red-800'}`}>
                {resultado.mensaje}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
