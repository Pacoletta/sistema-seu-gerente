import React from "react";

interface ConfiguracaoEmailCardProps {
  emailGmail: string;
  setEmailGmail: (value: string) => void;
  senhaAppGmail: string;
  setSenhaAppGmail: (value: string) => void;
  emailConfigurado: boolean;
  setEmailConfigurado: (value: boolean) => void;
  loading: boolean;
  onSalvar: (e: React.FormEvent) => Promise<void>;
}

export function ConfiguracaoEmailCard({
  emailGmail,
  setEmailGmail,
  senhaAppGmail,
  setSenhaAppGmail,
  emailConfigurado,
  setEmailConfigurado,
  loading,
  onSalvar,
}: ConfiguracaoEmailCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header do Card */}
      <div className="bg-linear-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-2xl">📧</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Configuração de Email Gmail
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure seu Gmail pessoal para enviar relatórios
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6 space-y-6">
        {/* Instruções */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900 font-semibold mb-2">
            🔐 Como gerar uma senha de app do Gmail:
          </p>
          <ol className="text-xs text-amber-800 space-y-1 ml-4 list-decimal">
            <li>
              Acesse sua{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                className="underline text-blue-600"
              >
                Conta do Google
              </a>
            </li>
            <li>
              Ative a <strong>Verificação em duas etapas</strong>
            </li>
            <li>
              Vá em <strong>Senhas de app</strong>
            </li>
            <li>
              Selecione <strong>E-mail</strong> e{" "}
              <strong>Outro (nome personalizado)</strong>
            </li>
            <li>Digite "Seu Gerente" e gere a senha</li>
            <li>Copie a senha de 16 caracteres e cole abaixo</li>
          </ol>
        </div>

        {/* Formulário de Email */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              📧 Email Gmail
            </label>
            <input
              type="email"
              value={emailGmail}
              onChange={(e) => setEmailGmail(e.target.value)}
              placeholder="seuemail@gmail.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este email será usado para enviar os relatórios aos moradores
            </p>
          </div>

          {/* Senha do App */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🔑 Senha de App do Gmail
            </label>
            <input
              type="password"
              value={senhaAppGmail}
              onChange={(e) => setSenhaAppGmail(e.target.value)}
              placeholder="Digite a senha de app (16 caracteres)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Nunca use sua senha normal do Gmail, apenas a senha de app
            </p>
          </div>

          {/* Toggle Ativo */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-800">
                ✅ Ativar Email Personalizado
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Se desativado, usaremos o email padrão do sistema
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailConfigurado}
                onChange={(e) => setEmailConfigurado(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        {/* Botão de Salvar Email */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onSalvar}
            disabled={loading}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span className="text-xl">📧</span>
                <span>Salvar Configuração de Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
