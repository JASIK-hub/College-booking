import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserContext } from "../../context/user.context";
import { Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { email, setEmail } = useUserContext();

  const { submit, loading, error } = useAuth({
    path: `/user/generate/code`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit({ email });

    if (result && !error) {
      navigate("/login/code");
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">JIHC System</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign in
            </h2>
            <p className="text-sm text-gray-600">
              Enter your institutional email to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="name@jihc.edu.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300
                    transition-colors duration-200"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={loading || !isValidEmail}
              className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg
                hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Only institutional emails allowed
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-md mx-auto px-6 py-4 text-center">
          <p className="text-xs text-gray-600">
            © 2025 JIHC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}