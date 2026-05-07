import type { ReceitasStats, Morador, Pagamento } from "@/features/receitas/types";

interface ReceitasStatsProps {
  moradores: Morador[];
  findPagamentoByMorador: (moradorId: string) => Pagamento | undefined;
  valorTotalGeralPago: number;
}

export function ReceitasStatsCards({
  moradores,
  findPagamentoByMorador,
  valorTotalGeralPago,
}: ReceitasStatsProps) {
  const totalPagos = moradores.filter((morador) => {
    const pagamento = findPagamentoByMorador(morador.id);
    return pagamento?.status === "pago";
  }).length;

  const totalPendentes = moradores.filter((morador) => {
    const pagamento = findPagamentoByMorador(morador.id);
    return !pagamento || pagamento?.status !== "pago";
  }).length;

  const taxaPagamento =
    moradores.length > 0
      ? Math.round((totalPagos / moradores.length) * 100)
      : 0;

  const totalAportes = moradores.reduce((acc, morador) => {
    const pagamento = findPagamentoByMorador(morador.id);
    return acc + Number(pagamento?.caixinha || 0);
  }, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {/* Card Pagos */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-50 rounded-lg p-2">
            <span className="text-xl">✅</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pagos
            </div>
            <div className="text-xl font-bold text-gray-900">{totalPagos}</div>
          </div>
        </div>
      </div>

      {/* Card Pendentes */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-50 rounded-lg p-2">
            <span className="text-xl">⏳</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pendentes
            </div>
            <div className="text-xl font-bold text-gray-900">
              {totalPendentes}
            </div>
          </div>
        </div>
      </div>

      {/* Card Total Apartamentos */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 rounded-lg p-2">
            <span className="text-xl">🏢</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Apartamentos
            </div>
            <div className="text-xl font-bold text-gray-900">
              {moradores.length}
            </div>
          </div>
        </div>
      </div>

      {/* Card Taxa de Pagamento */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-50 rounded-lg p-2">
            <span className="text-xl">📊</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Taxa
            </div>
            <div className="text-xl font-bold text-gray-900">
              {taxaPagamento}%
            </div>
          </div>
        </div>
      </div>

      {/* Card Total Aportes */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm p-3 border border-green-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-100 rounded-lg p-2">
            <span className="text-xl">💰</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-green-700 uppercase tracking-wide">
              Aportes
            </div>
            <div className="text-xl font-bold text-green-700">
              R${" "}
              {totalAportes.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
