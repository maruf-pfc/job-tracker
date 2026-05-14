import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <AuthCard
        title="Sign In"
        subtitle="Access your career pipeline and application tracking workspace."
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
