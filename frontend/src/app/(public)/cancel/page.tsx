import HomeHeader from "@/components/layout/header/home-header";

export default function CancelPage() {
  return (
    <>
      <HomeHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Operação cancelada
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          A operação foi cancelada pelo usuário.
          <br />
          Se precisar de ajuda, entre em contato com o suporte.
        </p>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline font-semibold"
        >
          Voltar para o Dashboard
        </a>
      </div>
    </>
  );
}
