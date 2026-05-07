import type { Morador } from "@/features/moradores/types";

type MoradoresStatsProps = {
  moradores: Morador[];
};

export function MoradoresStats({ moradores }: MoradoresStatsProps) {
  const moradoresCount = moradores.filter((m) => m.tipo === "morador").length;
  const inquilinosCount = moradores.filter((m) => m.tipo === "inquilino").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 rounded-lg p-2">
            <span className="text-xl">🏢</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Apartamentos</div>
            <div className="text-xl font-bold text-gray-900">{moradores.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 rounded-lg p-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Moradores</div>
            <div className="text-xl font-bold text-gray-900">{moradoresCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-50 rounded-lg p-2">
            <span className="text-xl">🏠</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Inquilinos</div>
            <div className="text-xl font-bold text-gray-900">{inquilinosCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
