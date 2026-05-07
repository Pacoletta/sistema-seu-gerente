namespace SeuGerente.Infrastructure.EmailTemplates;

/// <summary>
/// Templates HTML para emails profissionais
/// </summary>
public static class HtmlTemplates
{
    private static string SiteUrl => 
        Environment.GetEnvironmentVariable("BUSINESS_SITE_URL") ?? "https://sistemaseugerente.com.br";
    
    private const string BaseTemplate = """
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{titulo}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #1a202c;
                    background-color: #ffffff;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                }
                .header {
                    padding: 30px 20px 20px;
                    text-align: center;
                    border-bottom: 2px solid #667eea;
                }
                .logo {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 24px;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 5px;
                }
                .logo-icon {
                    font-size: 28px;
                }
                .tagline {
                    color: #718096;
                    font-size: 12px;
                    font-weight: 400;
                    margin-top: 5px;
                }
                .content {
                    padding: 35px 30px;
                }
                .greeting {
                    font-size: 18px;
                    color: #1a202c;
                    margin-bottom: 16px;
                    font-weight: 600;
                }
                .message {
                    font-size: 15px;
                    color: #4a5568;
                    margin-bottom: 20px;
                    line-height: 1.7;
                }
                .info-box {
                    background-color: #f7fafc;
                    border-left: 3px solid #667eea;
                    padding: 18px;
                    margin: 24px 0;
                    border-radius: 4px;
                }
                .info-box p {
                    margin: 6px 0;
                    font-size: 14px;
                    color: #2d3748;
                }
                .info-box strong {
                    color: #1a202c;
                    font-weight: 600;
                }
                .button {
                    display: inline-block;
                    padding: 12px 28px;
                    background-color: #667eea;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                    margin: 16px 0;
                    text-align: center;
                }
                .alert {
                    background-color: #fff5f5;
                    border-left: 3px solid #f56565;
                    padding: 14px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .alert p {
                    color: #c53030;
                    font-weight: 500;
                    margin: 0;
                    font-size: 14px;
                }
                .footer {
                    border-top: 1px solid #e2e8f0;
                    padding: 25px 20px;
                    text-align: center;
                }
                .footer p {
                    color: #a0aec0;
                    font-size: 13px;
                    margin: 6px 0;
                }
                .footer a {
                    color: #667eea;
                    text-decoration: none;
                }
                .divider {
                    height: 1px;
                    background-color: #e2e8f0;
                    margin: 24px 0;
                }
                @media only screen and (max-width: 600px) {
                    .content {
                        padding: 25px 20px;
                    }
                    .logo {
                        font-size: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">
                        <span class="logo-icon">📊</span>
                        <span>Sistema Seu Gerente</span>
                    </div>
                    <p class="tagline">Gestão Inteligente de Condomínios</p>
                </div>
                {conteudo}
                <div class="footer">
                    <p><strong>Sistema Seu Gerente</strong></p>
                    <p><a href="{siteUrl}">{siteUrl}</a></p>
                    <p style="font-size: 11px; color: #cbd5e0; margin-top: 12px;">
                        Este é um email automático. Por favor, não responda.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """;

    public static string GetRelatorioTemplate(string nomeDestinatario, string mesAno)
    {
        var conteudo = $"""
            <div class="content">
                <h2 class="greeting">Olá, {nomeDestinatario}!</h2>
                
                <p class="message">
                    Seu relatório mensal de <strong>{mesAno}</strong> está disponível em anexo.
                </p>

                <div class="info-box">
                    <p><strong>📄 Relatório Mensal - {mesAno}</strong></p>
                    <p style="margin-top: 10px; font-size: 13px; color: #4a5568;">
                        Incluindo despesas do condomínio, valores por apartamento e rateio detalhado.
                    </p>
                </div>

                <p class="message">
                    Abra o arquivo PDF anexado para visualizar todas as informações.
                </p>

                <div class="divider"></div>

                <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                    Dúvidas? Entre em contato com a administração do condomínio.
                </p>
            </div>
            """;

        return BaseTemplate
            .Replace("{titulo}", $"Relatório Mensal - {mesAno}")
            .Replace("{conteudo}", conteudo)
            .Replace("{siteUrl}", SiteUrl)
            .Replace("{loginUrl}", $"{SiteUrl}/login");
    }

    public static string GetCobrancaTemplate(string nomeDevedor, decimal valor, DateTime vencimento)
    {
        var vencido = vencimento < DateTime.Now;
        var statusClass = vencido ? "alert" : "info-box";
        var emoji = vencido ? "⚠️" : "💰";
        var loginUrl = $"{SiteUrl}/login";
        
        var conteudo = $"""
            <div class="content">
                <h2 class="greeting">Olá, {nomeDevedor}!</h2>
                
                <p class="message">
                    {(vencido 
                        ? "Você possui uma cobrança <strong>vencida</strong>." 
                        : "Você possui uma cobrança pendente de pagamento.")}
                </p>

                <div class="{statusClass}">
                    <p><strong>{emoji} Detalhes da Cobrança</strong></p>
                    <p style="margin-top: 12px;">
                        <strong>Valor:</strong> <span style="font-size: 20px; color: #667eea; font-weight: 700;">R$ {valor:F2}</span>
                    </p>
                    <p><strong>Vencimento:</strong> {vencimento:dd/MM/yyyy}</p>
                    {(vencido 
                        ? $"<p style=\"margin-top: 10px; color: #c53030; font-weight: 600; font-size: 13px;\">Vencido há {(DateTime.Now - vencimento).Days} dia(s)</p>" 
                        : "")}
                </div>

                <div style="text-align: center; margin: 24px 0;">
                    <a href="{loginUrl}" class="button">
                        Acessar Sistema
                    </a>
                </div>

                <div class="divider"></div>

                <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                    Dúvidas? Entre em contato com a administração.
                </p>
            </div>
            """;

        return BaseTemplate
            .Replace("{titulo}", "Cobrança Pendente")
            .Replace("{conteudo}", conteudo)
            .Replace("{siteUrl}", SiteUrl)
            .Replace("{loginUrl}", $"{SiteUrl}/login");
    }

    public static string GetResetPasswordTemplate(string resetLink)
    {
        var conteudo = $"""
            <div class="content">
                <h2 class="greeting">Recuperação de Senha</h2>
                
                <p class="message">
                    Você solicitou a redefinição de senha no Sistema Seu Gerente.
                </p>

                <p class="message">
                    Clique no botão abaixo para criar uma nova senha:
                </p>

                <div style="text-align: center; margin: 28px 0;">
                    <a href="{resetLink}" class="button">
                        Redefinir Senha
                    </a>
                </div>

                <div class="info-box">
                    <p><strong>⏱️ Importante:</strong> Este link expira em 1 hora.</p>
                    <p style="margin-top: 8px; font-size: 13px; color: #4a5568;">
                        Por segurança, após este período você precisará solicitar um novo link.
                    </p>
                </div>

                <div class="alert">
                    <p>Se você não solicitou esta recuperação, ignore este email.</p>
                </div>

                <div class="divider"></div>

                <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                    Nunca compartilhe seus dados de acesso com terceiros.
                </p>
            </div>
            """;

        return BaseTemplate
            .Replace("{titulo}", "Recuperação de Senha")
            .Replace("{conteudo}", conteudo);
    }

    public static string GetNotificacaoTemplate(string titulo, string mensagem)
    {
        var conteudo = $"""
            <div class="content">
                <h2 class="greeting">{titulo}</h2>
                
                <div class="message">
                    {mensagem}
                </div>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #718096; text-align: center;">
                    Sistema Seu Gerente - Gestão Inteligente de Condomínios
                </p>
            </div>
            """;

        return BaseTemplate
            .Replace("{titulo}", titulo)
            .Replace("{conteudo}", conteudo);
    }
}
