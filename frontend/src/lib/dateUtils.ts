// Utilitários para formatação de datas no timezone do Brasil
// Criado para corrigir problemas de timezone onde datas aparecem com +1 dia

/**
 * Formata uma data ISO string para exibição no Brasil (UTC-3)
 * @param dataISO - Data em formato ISO string ou null
 * @returns String no formato YYYY-MM-DD para input type="date" ou string vazia
 */
export const formatarDataBrasil = (
  dataISO: string | null | undefined,
): string => {
  if (!dataISO) return "";

  try {
    const data = new Date(dataISO);

    // Verificar se a data é válida
    if (isNaN(data.getTime())) return "";

    // Ajustar para timezone do Brasil (UTC-3)
    // Adiciona o offset do timezone para mostrar a data correta no Brasil
    const offsetMinutos = data.getTimezoneOffset();
    const dataLocal = new Date(data.getTime() + offsetMinutos * 60000);

    return dataLocal.toISOString().split("T")[0];
  } catch (error) {
    console.error("Erro ao formatar data para Brasil:", error);
    return "";
  }
};

/**
 * Converte data do input HTML para UTC mantendo o dia correto no Brasil
 * @param dataInput - Data no formato YYYY-MM-DD do input
 * @returns String ISO com timezone correto ou ISO atual em caso de erro
 */
export const converterDataParaUTC = (dataInput: string): string => {
  if (!dataInput) return new Date().toISOString();

  try {
    // Criar a data como meio-dia no Brasil (UTC-3) para evitar problemas de timezone
    // Isso garante que o dia selecionado seja mantido independente do horário
    const data = new Date(dataInput + "T12:00:00-03:00");

    // Verificar se a data é válida
    if (isNaN(data.getTime())) {
      throw new Error("Data inválida");
    }

    return data.toISOString();
  } catch (error) {
    console.error("Erro ao converter data para UTC:", error);
    return new Date().toISOString();
  }
};

/**
 * Formata data para exibição amigável no Brasil
 * @param dataISO - Data em formato ISO string
 * @returns String no formato DD/MM/AAAA
 */
export const formatarDataExibicao = (
  dataISO: string | null | undefined,
): string => {
  if (!dataISO) return "";

  try {
    const data = new Date(dataISO);

    if (isNaN(data.getTime())) return "";

    // Ajustar para timezone do Brasil
    const offsetMinutos = data.getTimezoneOffset();
    const dataLocal = new Date(data.getTime() + offsetMinutos * 60000);

    const dia = dataLocal.getDate().toString().padStart(2, "0");
    const mes = (dataLocal.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataLocal.getFullYear();

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error("Erro ao formatar data para exibição:", error);
    return "";
  }
};

/**
 * Normaliza uma data para o formato YYYY-MM-DD
 * Funciona com strings ISO completas, Date objects, ou já no formato correto
 * @param data - Data em qualquer formato string ou Date
 * @returns String no formato YYYY-MM-DD ou string vazia se inválida
 */
export const normalizarDataParaInput = (
  data: string | Date | null | undefined,
): string => {
  if (!data) return "";

  try {
    const dataObj = typeof data === "string" ? new Date(data) : data;

    // Verificar se a data é válida
    if (isNaN(dataObj.getTime())) return "";

    // Extrair ano, mês e dia diretamente do objeto Date
    const ano = dataObj.getFullYear();
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const dia = String(dataObj.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  } catch (error) {
    console.error("Erro ao normalizar data:", error);
    return "";
  }
};

/**
 * Verifica se uma data é hoje (no timezone do Brasil)
 * @param dataISO - Data em formato ISO string
 * @returns Boolean indicando se é hoje
 */
export const ehHoje = (dataISO: string | null | undefined): boolean => {
  if (!dataISO) return false;

  try {
    const data = new Date(dataISO);
    const hoje = new Date();

    // Ajustar ambas para timezone do Brasil
    const offsetMinutos = data.getTimezoneOffset();
    const dataLocal = new Date(data.getTime() + offsetMinutos * 60000);
    const hojeLocal = new Date(
      hoje.getTime() + hoje.getTimezoneOffset() * 60000,
    );

    return dataLocal.toDateString() === hojeLocal.toDateString();
  } catch {
    return false;
  }
};
