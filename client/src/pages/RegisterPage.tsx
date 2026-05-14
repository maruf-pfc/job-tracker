import { Link } from "react-router-dom";
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

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
