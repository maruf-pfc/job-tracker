import { Link } from "react-router-dom";
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

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm">
          <p className="font-medium text-slate-700">Demo Account</p>

          <p className="mt-2 text-slate-600">
            Email:
            <span className="ml-2 font-medium">demo@jobtracker.dev</span>
          </p>

          <p className="mt-1 text-slate-600">
            Password:
            <span className="ml-2 font-medium">Demo@123</span>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create account
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
