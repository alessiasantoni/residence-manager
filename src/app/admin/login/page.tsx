import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold text-neutral-900">
          Pannello di amministrazione
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
