import Link from 'next/link';

export default function Home() {
  const calculators = [
    {
      title: 'Interés Simple',
      description: 'Calcula capital, tasa de interés, tiempo o interés simple. Ingresa 3 valores y calcula el cuarto.',
      icon: '📊',
      href: '/interes-simple',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Interés Compuesto',
      description: 'Calcula con capitalización. Ingresa capital, tasa, tiempo y frecuencia para obtener el monto o interés.',
      icon: '📈',
      href: '/interes-compuesto',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Simulador de Crédito',
      description: 'Genera tablas de amortización con sistema francés o alemán. Visualiza todas las cuotas y detalles.',
      icon: '💰',
      href: '/simulador-credito',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen p-8 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Calculadoras Financieras
          </h1>
          <p className="text-xl text-gray-600">
            Herramientas para calcular intereses y simular créditos bancarios
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                {/* Color Header */}
                <div className={`h-32 bg-gradient-to-br ${calc.color} flex items-center justify-center`}>
                  <span className="text-6xl">{calc.icon}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {calc.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-6 flex items-center text-blue-600 font-semibold">
                    <span>Abrir calculadora</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ℹ️ Instrucciones de uso
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">1.</span>
              <span>Selecciona la calculadora que necesitas desde el menú o las tarjetas.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">2.</span>
              <span>Completa los datos requeridos (todos los campos excepto la incógnita).</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">3.</span>
              <span>Ingresa la fórmula que utilizarás para el cálculo.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">4.</span>
              <span>Ingresa tu respuesta calculada y presiona "Evaluar" para verificar.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
