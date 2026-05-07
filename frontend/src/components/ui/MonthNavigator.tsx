const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface MonthNavigatorProps {
  mes: number; // 1-12
  ano: number;
  onMesChange: (mes: number) => void;
  onAnoChange: (ano: number) => void;
}

export function MonthNavigator({
  mes,
  ano,
  onMesChange,
  onAnoChange,
}: MonthNavigatorProps) {
  const anterior = () => {
    if (mes === 1) {
      onMesChange(12);
      onAnoChange(ano - 1);
    } else onMesChange(mes - 1);
  };

  const proximo = () => {
    if (mes === 12) {
      onMesChange(1);
      onAnoChange(ano + 1);
    } else onMesChange(mes + 1);
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm px-1 py-1">
      <button
        type="button"
        onClick={anterior}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span className="px-3 py-1 text-sm font-semibold text-gray-800 min-w-[140px] text-center">
        {MESES[mes - 1]} {ano}
      </span>
      <button
        type="button"
        onClick={proximo}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
