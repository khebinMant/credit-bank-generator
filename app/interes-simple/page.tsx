'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  C: string;
  i: string;
  n: string;
  I: string;
  M: string;
  respuestaUsuario: string;
};

export default function InteresSimple() {
  const [incognita, setIncognita] = useState<'C' | 'i' | 'n' | 'I' | 'M'>('I');
  const [resultado, setResultado] = useState<{
    correcto: boolean;
    valorReal: number;
    mensaje: string;
  } | null>(null);

  const getFormula = () => {
    switch (incognita) {
      case 'I': return 'I = C × i × n';
      case 'M': return 'M = C(1 + i×n)';
      case 'C': return 'C = I / (i × n) o C = M / (1 + i×n)';
      case 'i': return 'i = I / (C × n) o i = (M - C) / (C × n)';
      case 'n': return 'n = I / (C × i) o n = (M - C) / (C × i)';
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
    // Validar campos requeridos según incógnita
    const camposRequeridos = ['C', 'i', 'n'];
    if (incognita === 'C') {
      camposRequeridos.splice(0, 1);
      if (!data.I && !data.M) {
        setResultado({
          correcto: false,
          valorReal: 0,
          mensaje: 'Para calcular C necesitas ingresar I o M',
        });
        return;
      }
    } else if (incognita === 'i') {
      camposRequeridos.splice(1, 1);
      if (!data.I && !data.M) {
        setResultado({
          correcto: false,
          valorReal: 0,
          mensaje: 'Para calcular i necesitas ingresar I o M',
        });
        return;
      }
    } else if (incognita === 'n') {
      camposRequeridos.splice(2, 1);
      if (!data.I && !data.M) {
        setResultado({
          correcto: false,
          valorReal: 0,
          mensaje: 'Para calcular n necesitas ingresar I o M',
        });
        return;
      }
    }

    const camposFaltantes = camposRequeridos.filter(campo => !data[campo as keyof FormData]);
    if (camposFaltantes.length > 0) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`,
      });
      return;
    }

    if (!data.respuestaUsuario?.trim()) {
      setResultado({
        correcto: false,
        valorReal: 0,
        mensaje: 'Debes ingresar tu respuesta calculada',
      });
      return;
    }

    // Calcular el valor real
    const C = parseFloat(data.C);
    const i = parseFloat(data.i) / 100;
    const n = parseFloat(data.n);
    const I = parseFloat(data.I);
    const M = parseFloat(data.M);

    let valorReal = 0;

    switch (incognita) {
      case 'I':
        valorReal = C * i * n;
        break;
      case 'M':
        valorReal = C * (1 + i * n);
        break;
      case 'C':
        if (data.I) {
          valorReal = I / (i * n);
        } else if (data.M) {
          valorReal = M / (1 + i * n);
        }
        break;
      case 'i':
        if (data.I) {
          valorReal = (I / (C * n)) * 100;
        } else if (data.M) {
          valorReal = ((M - C) / (C * n)) * 100;
        }
        break;
      case 'n':
        if (data.I) {
          valorReal = I / (C * i);
        } else if (data.M) {
          valorReal = (M - C) / (C * i);
        }
        break;
    }

    const respuesta = parseFloat(data.respuestaUsuario);
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
          <div className="border-l-4 border-slate-700 pl-4 mb-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              📊 Calculadora de Interés Simple
            </h1>
            <p className="text-slate-600">
              Fórmula: <strong className="text-slate-700">I = C × i × n</strong> | Monto: <strong className="text-slate-700">M = C(1 + i×n)</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Selección de incógnita */}
            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label className="block text-slate-800 font-bold mb-3 text-lg">
                Selecciona la incógnita a calcular:
              </label>
              <div className="grid grid-cols-5 gap-3">
                {['C', 'i', 'n', 'I', 'M'].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => {
                      setIncognita(opcion as any);
                      setResultado(null);
                    }}
                    className={`py-4 px-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      incognita === opcion
                        ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-300'
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-3 bg-white p-3 rounded-lg">
                <strong>C</strong> = Capital | <strong>i</strong> = Tasa de interés anual (%) | <strong>n</strong> = Tiempo (años) | <strong>I</strong> = Interés | <strong>M</strong> = Monto
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
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-slate-200 ${
                    incognita === 'C'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 bg-white'
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
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-slate-200 ${
                    incognita === 'i'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 bg-white'
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
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-slate-200 ${
                    incognita === 'n'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 bg-white'
                  }`}
                  placeholder="Ej: 5"
                />
                {errors.n && <p className="text-red-600 text-sm mt-1">{errors.n.message}</p>}
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
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-slate-200 ${
                    incognita === 'I'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 bg-white'
                  }`}
                  placeholder="Opcional (o usa M)"
                />
                {errors.I && <p className="text-red-600 text-sm mt-1">{errors.I.message}</p>}
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
                  className={`w-full p-4 border-2 rounded-xl text-slate-800 font-semibold text-lg transition-all focus:ring-4 focus:ring-slate-200 ${
                    incognita === 'M'
                      ? 'bg-amber-50 border-amber-300 cursor-not-allowed'
                      : 'border-slate-300 hover:border-slate-400 focus:border-slate-600 bg-white'
                  }`}
                  placeholder="Opcional (o usa I)"
                />
                {errors.M && <p className="text-red-600 text-sm mt-1">{errors.M.message}</p>}
              </div>
            </div>

            {/* Fórmula automática */}
            <div className="mb-6 bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
              <label className="block text-slate-700 font-bold mb-2">
                📐 Fórmula a utilizar:
              </label>
              <div className="text-2xl font-bold text-amber-700 bg-white p-4 rounded-lg border border-amber-200 text-center">
                {getFormula()}
              </div>
            </div>

            {/* Respuesta del usuario */}
            <div className="mb-6">
              <label className="block text-slate-700 font-bold mb-2">
                Tu respuesta para <strong className="text-amber-700">{incognita}</strong>:
              </label>
              <input
                type="number"
                step="0.01"
                {...register('respuestaUsuario', {
                  required: 'La respuesta es requerida',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                })}
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-800 font-semibold text-lg transition-all hover:border-slate-400 focus:border-slate-600 focus:ring-4 focus:ring-slate-200 bg-white"
                placeholder={`Ingresa el valor de ${incognita}`}
              />
              {errors.respuestaUsuario && <p className="text-red-600 text-sm mt-1">{errors.respuestaUsuario.message}</p>}
            </div>

            {/* Botón evaluar */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Evaluar Respuesta
            </button>
          </form>

          {/* Resultado */}
          {resultado && (
            <div
              className={`mt-6 p-6 rounded-xl ${
                resultado.correcto
                  ? 'bg-emerald-50 border-2 border-emerald-500'
                  : 'bg-red-50 border-2 border-red-500'
              }`}
            >
              <h3
                className={`text-xl font-bold mb-2 ${
                  resultado.correcto ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {resultado.correcto ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </h3>
              <p className="text-slate-700 font-semibold">{resultado.mensaje}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
