import React from "react";

interface ConfiguracaoEnvioAutomaticoCardProps {
  envioAutomaticoAtivo: boolean;
  setEnvioAutomaticoAtivo: (value: boolean) => void;
  diaEnvioRelatorio: string;
  setDiaEnvioRelatorio: (value: string) => void;
  horaEnvioRelatorio: string;
  setHoraEnvioRelatorio: (value: string) => void;
  diaEnvioCobranca: string;
  setDiaEnvioCobranca: (value: string) => void;
  horaEnvioCobranca: string;
  setHoraEnvioCobranca: (value: string) => void;
  mesReferenciaCobranca: string;
  setMesReferenciaCobranca: (value: string) => void;
  diaVencimento: string;
  setDiaVencimento: (value: string) => void;
  pixCobranca: string;
  setPixCobranca: (value: string) => void;
  pixNomeBeneficiario: string;
  setPixNomeBeneficiario: (value: string) => void;
}

export function ConfiguracaoEnvioAutomaticoCard({
  envioAutomaticoAtivo,
  setEnvioAutomaticoAtivo,
  diaEnvioRelatorio,
  setDiaEnvioRelatorio,
  horaEnvioRelatorio,
  setHoraEnvioRelatorio,
  diaEnvioCobranca,
  setDiaEnvioCobranca,
  horaEnvioCobranca,
  setHoraEnvioCobranca,
  mesReferenciaCobranca,
  setMesReferenciaCobranca,
  diaVencimento,
  setDiaVencimento,
  pixCobranca,
  setPixCobranca,
  pixNomeBeneficiario,
  setPixNomeBeneficiario,
}: ConfiguracaoEnvioAutomaticoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header do Card */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 p-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-2xl">⏰</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Envio Automático
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Configure quando os relatórios e cobranças serão enviados
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">
                Mês de Referência
              </label>
              <select
                value={mesReferenciaCobranca}
                onChange={(e) => setMesReferenciaCobranca(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="atual">Mês Atual</option>
                <option value="anterior">Mês Anterior</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">
                📅 Dia Vencimento
              </label>
              <select
                value={diaVencimento}
                onChange={(e) => setDiaVencimento(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                  <option key={dia} value={dia}>
                    Dia {dia}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">
                💰 PIX Cobrança
              </label>
              <input
                type="text"
                value={pixCobranca}
                onChange={(e) => setPixCobranca(e.target.value)}
                placeholder="Chave PIX"
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all w-48"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">
                👤 Nome Beneficiário
              </label>
              <input
                type="text"
                value={pixNomeBeneficiario}
                onChange={(e) => setPixNomeBeneficiario(e.target.value)}
                placeholder="Nome do beneficiário"
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all w-48"
              />
            </div>
            <button
              type="submit"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 mt-5"
            >
              <span className="text-lg">💾</span>
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6 space-y-6">
        {/* Toggle de Ativação */}
        <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800 inline">
              Ativar Envio Automático
            </h3>
            <span className="text-sm text-gray-600 ml-2">
              • Habilite o envio automático mensal de relatórios e cobranças
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={envioAutomaticoAtivo}
              onChange={(e) => setEnvioAutomaticoAtivo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Configurações de Dias e Horários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Relatório */}
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <h3 className="text-sm font-bold text-purple-900 mb-3">
              📊 Relatório Mensal
            </h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  📅 Dia do Mês
                </label>
                <select
                  value={diaEnvioRelatorio}
                  onChange={(e) => setDiaEnvioRelatorio(e.target.value)}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <option key={dia} value={dia}>
                      Dia {dia}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  🕐 Hora
                </label>
                <select
                  value={horaEnvioRelatorio.split(":")[0] || "00"}
                  onChange={(e) => {
                    const minuto = horaEnvioRelatorio.split(":")[1] || "00";
                    setHoraEnvioRelatorio(`${e.target.value}:${minuto}`);
                  }}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}h
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Minuto
                </label>
                <select
                  value={horaEnvioRelatorio.split(":")[1] || "00"}
                  onChange={(e) => {
                    const hora = horaEnvioRelatorio.split(":")[0] || "00";
                    setHoraEnvioRelatorio(`${hora}:${e.target.value}`);
                  }}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="00">00</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Aviso de Vencimento */}
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <h3 className="text-sm font-bold text-amber-900 mb-3">
              🔔 Aviso de Vencimento
            </h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  📅 Dia do Mês
                </label>
                <select
                  value={diaEnvioCobranca}
                  onChange={(e) => setDiaEnvioCobranca(e.target.value)}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <option key={dia} value={dia}>
                      Dia {dia}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  🕐 Hora
                </label>
                <select
                  value={horaEnvioCobranca.split(":")[0] || "00"}
                  onChange={(e) => {
                    const minuto = horaEnvioCobranca.split(":")[1] || "00";
                    setHoraEnvioCobranca(`${e.target.value}:${minuto}`);
                  }}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}h
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Minuto
                </label>
                <select
                  value={horaEnvioCobranca.split(":")[1] || "00"}
                  onChange={(e) => {
                    const hora = horaEnvioCobranca.split(":")[0] || "00";
                    setHoraEnvioCobranca(`${hora}:${e.target.value}`);
                  }}
                  disabled={!envioAutomaticoAtivo}
                  className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="00">00</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informação Adicional */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <p className="text-xs text-blue-800 font-semibold">
            ⏰ Como funciona:
          </p>
          <ul className="text-xs text-blue-700 space-y-0.5 ml-4">
            <li>
              • <strong>Frequência:</strong> Uma vez por mês no dia e horário
              selecionado
            </li>
            <li>
              • <strong>Verificação:</strong> Sistema verifica a cada 5 minutos
            </li>
            <li>
              • <strong>Toggle:</strong> Ligue/desligue sem perder configurações
            </li>
            <li>
              • <strong>Canais:</strong> Email e WhatsApp automáticos
            </li>
          </ul>
          {envioAutomaticoAtivo && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-1">
                📅 Próximos envios:
              </p>
              <div className="text-xs text-blue-700 space-y-0.5">
                <p>
                  • Relatório: Dia <strong>{diaEnvioRelatorio}</strong> às{" "}
                  <strong>{horaEnvioRelatorio}</strong>
                </p>
                <p>
                  • Aviso: Dia <strong>{diaEnvioCobranca}</strong> às{" "}
                  <strong>{horaEnvioCobranca}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
