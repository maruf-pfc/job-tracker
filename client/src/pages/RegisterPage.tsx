import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <AuthCard
        title="Create Account"
        subtitle="Start organizing your applications, interviews, and opportunities."
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
