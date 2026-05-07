
// Interface para valores totais simplificada
export interface ValorTotal {
  id: string;
  morador_id: string;
  mes_ano: string;
  valor_total: number;
  usuario_id: string;
  status?: string;
  data_pagamento?: string;
  comprovante_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ValoresTotaisResult {
  success: boolean;
  error?: string;
  processados?: number;
}

// Função para sincronizar valores totais completos (despesas + receitas) via backend Express
export async function sincronizarValoresTotaisCompleto(
  usuarioId: string,
  mesAno: string
): Promise<ValoresTotaisResult> {
  try {
    const response = await fetch(`/api/valores-totais/sincronizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, mesAno }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        success: false,
        error: "Resposta não é JSON válido",
      };
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao sincronizar valores totais completos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para sincronizar valores totais quando uma despesa é criada/editada via backend Express
export async function sincronizarValoresDespesa(
  usuarioId: string,
  mesAno: string
): Promise<void> {
  try {
    await fetch(`/api/valores-totais/sincronizar-despesa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, mesAno }),
    });
  } catch (error) {
    console.error('Erro ao sincronizar valores de despesas:', {
      error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      usuarioId,
      mesAno,
    });
    throw error;
  }
}