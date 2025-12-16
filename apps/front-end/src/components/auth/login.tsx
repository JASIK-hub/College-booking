import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Input } from "../ui/search";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../ui/spinner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { submit, loading, error } = useAuth({
    path: `/user/login`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit({ email, password });
    
    if (result && !error) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate("/main");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        {/* Title */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Email */}
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300
            focus:border-black focus:ring-1 focus:ring-black outline-none
            transition"
        />

        {/* Password */}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300
            focus:border-black focus:ring-1 focus:ring-black outline-none
            transition"
        />
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full py-2 rounded-lg font-medium transition
                    flex items-center justify-center gap-2
                    disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}