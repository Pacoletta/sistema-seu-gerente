import HomeHeader from "@/components/layout/header/home-header";

export default function SuccessPage() {
  return (
    <>
      <HomeHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Operação realizada com sucesso!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Sua operação foi concluída com êxito.
          <br />
          Você já pode utilizar o sistema normalmente.
        </p>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline font-semibold"
        >
          Ir para o Dashboard
        </a>
      </div>
    </>
  );
}
