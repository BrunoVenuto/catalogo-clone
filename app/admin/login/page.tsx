import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Carregando...</div>}>
      <LoginClient />
    </Suspense>
  );
}