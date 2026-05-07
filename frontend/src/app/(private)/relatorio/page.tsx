"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RelatorioStats } from "@/features/relatorio/components/RelatorioStats";
import { RelatorioMessages } from "@/features/relatorio/components/RelatorioMessages";
import { RelatorioHeader } from "@/features/relatorio/components/RelatorioHeader";
import { RelatorioActions } from "@/features/relatorio/components/RelatorioActions";
import { RelatorioTable } from "@/features/relatorio/components/RelatorioTable";
import { RelatorioModal } from "@/features/relatorio/components/RelatorioModal";
import { useRelatorioData } from "@/features/relatorio/hooks/useRelatorioData";
import { useRelatorioCalculations } from "@/features/relatorio/hooks/useRelatorioCalculations";
import { useRelatorioActions } from "@/features/relatorio/hooks/useRelatorioActions";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { Mensagem, Morador } from "@/features/relatorio/types";

export default function RelatorioPage() {
  const { userId } = useAuth();

  const now = new Date();
  const mesAtualNumero = now.getMonth() + 1;
  const anoAtualNumero = now.getFullYear();

  const [mesSelecionado, setMesSelecionado] = useState(
    String(mesAtualNumero).padStart(2, "0"),
  );
  const [anoSelecionado, setAnoSelecionado] = useState(String(anoAtualNumero));
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [moradorSelecionado, setMoradorSelecionado] = useState<Morador | null>(
    null,
  );
  const [valorSelecionado, setValorSelecionado] = useState<number>(0);
  const [showModalEnvio, setShowModalEnvio] = useState(false);

  const { despesas, moradores, findPagamentoByMorador } = useRelatorioData(
    userId,
    mesSelecionado,
    anoSelecionado,
  );

  const { despesasDoMes, totalDespesas, valoresFinais } =
    useRelatorioCalculations(
      despesas,
      moradores,
      mesSelecionado,
      anoSelecionado,
    );

  const {
    gerandoPDF,
    mensagemPDF,
    enviarCobrancaEmailIndividual,
    enviarCobrancaWhatsAppIndividual,
    enviarRelatorioEmailIndividual,
    enviarWhatsAppIndividual,
    gerarPDF,
  } = useRelatorioActions({
    userId,
    moradores,
    valoresFinais,
    despesasDoMes,
    mesSelecionado,
    anoSelecionado,
    totalDespesas,
    findPagamentoByMorador,
  });

  const handleClickMorador = (morador: Morador, valor: number) => {
    if (valor <= 0) {
      alert("Este apartamento não possui valor a pagar neste mês.");
      return;
    }
    setMoradorSelecionado(morador);
    setValorSelecionado(valor);
    setShowModalEnvio(true);
  };

  const handleEnviarCobrancaEmail = async () => {
    if (moradorSelecionado) {
      setShowModalEnvio(false);
      await enviarCobrancaEmailIndividual(moradorSelecionado, valorSelecionado);
    }
  };

  const handleEnviarCobrancaWhatsApp = async () => {
    if (moradorSelecionado) {
      setShowModalEnvio(false);
      await enviarCobrancaWhatsAppIndividual(
        moradorSelecionado,
        valorSelecionado,
      );
    }
  };

  const handleEnviarRelatorioEmail = async () => {
    if (moradorSelecionado) {
      setShowModalEnvio(false);
      await enviarRelatorioEmailIndividual(moradorSelecionado);
    }
  };

  const handleEnviarWhatsApp = async () => {
    if (moradorSelecionado) {
      setShowModalEnvio(false);
      await enviarWhatsAppIndividual(moradorSelecionado);
    }
  };

  const handleGerarPDF = () => {
    setShowModalEnvio(false);
    gerarPDF();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <main className="max-w-7xl mx-auto">
        {/* Container único para Stats, Header e Actions - tudo em linha */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Stats - Total Despesas e Apartamentos */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="text-xs text-gray-600">Total Despesas</div>
                  <div className="text-lg font-bold text-gray-900">
                    R${" "}
                    {totalDespesas.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-linear-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <span className="text-2xl">🏠</span>
                <div>
                  <div className="text-xs text-gray-600">Apartamentos</div>
                  <div className="text-lg font-bold text-gray-900">
                    {moradores.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Navegador de Mês e Ano */}
            <div className="flex w-full lg:w-auto">
              <MonthNavigator
                mes={parseInt(mesSelecionado)}
                ano={parseInt(anoSelecionado)}
                onMesChange={(m) => setMesSelecionado(String(m).padStart(2, "0"))}
                onAnoChange={(a) => setAnoSelecionado(String(a))}
              />
            </div>

            {/* Botões de Ação - compactos */}
            <div className="flex flex-wrap gap-2 ml-auto w-full lg:w-auto">
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  gerandoPDF
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 hover:shadow-md active:scale-95"
                }`}
                onClick={gerarPDF}
                disabled={gerandoPDF}
                title="Gerar PDF do relatório para download"
              >
                <span className="text-sm">📄</span>
                <span>Gerar PDF</span>
              </button>
            </div>
          </div>
        </div>

        <RelatorioMessages
          mensagem={mensagem}
          mensagemPDF={mensagemPDF}
          onDismissMensagem={() => setMensagem(null)}
        />

        <RelatorioTable
          despesasDoMes={despesasDoMes}
          moradores={moradores}
          valoresFinais={valoresFinais}
          mesSelecionado={mesSelecionado}
          anoSelecionado={anoSelecionado}
          onMoradorClick={handleClickMorador}
        />

        <RelatorioModal
          show={showModalEnvio}
          morador={moradorSelecionado}
          valor={valorSelecionado}
          onClose={() => setShowModalEnvio(false)}
          onEnviarCobrancaEmail={handleEnviarCobrancaEmail}
          onEnviarCobrancaWhatsApp={handleEnviarCobrancaWhatsApp}
          onEnviarRelatorioEmail={handleEnviarRelatorioEmail}
          onEnviarWhatsApp={handleEnviarWhatsApp}
          onGerarPDF={handleGerarPDF}
        />
      </main>
    </div>
  );
}
