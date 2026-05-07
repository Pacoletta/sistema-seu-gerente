type MoradoresSearchProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
};

export function MoradoresSearch({
  searchTerm,
  onSearchChange,
  resultCount,
}: MoradoresSearchProps) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100">
      <div className="flex gap-3 items-center">
        {/* Campo de busca */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {searchTerm && resultCount !== undefined && (
        <p className="mt-3 text-base text-gray-600">
          {resultCount} resultado(s) encontrado(s)
        </p>
      )}
    </div>
  );
}
