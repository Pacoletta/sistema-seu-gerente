import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const usuarioId = formData.get("usuarioId") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !usuarioId || !fileName) {
      return NextResponse.json(
        { error: "Arquivo, usuarioId ou fileName não fornecido" },
        { status: 400 },
      );
    }

    const backendForm = new FormData();
    backendForm.append("file", file, fileName);
    backendForm.append("usuarioId", usuarioId);
    backendForm.append("fileName", fileName);

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BACKEND_URL}/api/comprovantes/upload`, {
      method: "POST",
      headers,
      body: backendForm,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Erro no upload" }));
      return NextResponse.json(err, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro desconhecido" },
      { status: 500 },
    );
  }
}
