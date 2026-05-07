export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Essa página não existe
        </h1>
        <a
          href="/"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          Voltar para Home
        </a>
      </div>
    </main>
  );
}
