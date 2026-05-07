import { NextRequest, type MiddlewareConfig, NextResponse } from "next/server";

const publicRoutes = [
  "/login",
  "/login/cadastro",
  "/seja-parceiro",
  "/parceiro",
  "/reset-password",
  "/nova-senha",
  "/aguardando-pagamento",
  "/pagamento/sucesso",
  "/pagamento/erro",
  "/pagamento/pendente",
  "/privacidade",
  "/termos",
  "/",
] as const;

const adminRoutes = ["/administrativo"];

function decodeJWT(token: string): { exp: number; sub?: string; role?: string } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64url").toString();
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next({ request: { headers: request.headers } });

  const token = request.cookies.get("auth_token")?.value;
  const decoded = token ? decodeJWT(token) : null;
  const isAuthenticated = !!decoded && decoded.exp * 1000 > Date.now();
  const role = decoded?.role;

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return path === "/";
    return path === route || path.startsWith(route + "/");
  });

  // Rota privada sem autenticação → login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Já autenticado tentando acessar login → redirecionar para área correta
  if (path === "/login" && isAuthenticated) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/administrativo" : "/dashboard", request.url),
    );
  }

  // Rota admin acessada por usuário comum → dashboard
  if (adminRoutes.some((r) => path === r || path.startsWith(r + "/")) && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)).*)",
  ],
};
