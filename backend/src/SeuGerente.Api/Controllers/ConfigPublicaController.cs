using Microsoft.AspNetCore.Mvc;
using SeuGerente.Infrastructure.Common;

namespace SeuGerente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigPublicaController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ConfigPublicaController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public ActionResult<object> GetConfigPublica()
    {
        return Ok(new
        {
            mercadopago_public_key = ConfigurationHelper.GetValue(_configuration,
                "MercadoPago:PublicKey",
                "MERCADO_PAGO_PUBLIC_KEY",
                "MercadoPago__PublicKey") ?? "",

            business = new
            {
                site_url = ConfigurationHelper.GetValue(_configuration,
                    "Business:SiteUrl",
                    "BUSINESS_SITE_URL",
                    "Business__SiteUrl") ?? "https://sistemaseugerente.com.br",
                whatsapp = ConfigurationHelper.GetValue(_configuration,
                    "Business:WhatsApp",
                    "BUSINESS_WHATSAPP",
                    "Business__WhatsApp") ?? "5531983625590",
                whatsapp_support = ConfigurationHelper.GetValue(_configuration,
                    "Business:WhatsAppSupport",
                    "BUSINESS_WHATSAPP_SUPPORT",
                    "Business__WhatsAppSupport") ?? "5511999999999"
            }
        });
    }
}
