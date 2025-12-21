import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserContext } from "../../context/user.context";
import { ChevronLeft, Clock } from "lucide-react";
import { useApi } from "../../hooks/useApi";

interface RegisterPayload {
  code: string;
}

export default function CodeLogin() {
  const navigate = useNavigate();
  const { email } = useUserContext();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const [resendTimer, setResendTimer] = useState(0);
  const {callApi}=useApi()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { submit, loading, error, } = useAuth<RegisterPayload>({
    path: "/user/login",
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvalidMessage("");

    const codeString = code.join("");

    try {
      const res = await submit({
        code: codeString,
      });
      if (res) {
        navigate("/main");
      }
    } catch (err: any) {
    }
  };

   const handleResend = async () => {
  try {
    await callApi("/user/generate/code", { email }, "POST"); 
    setResendTimer(60);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  } catch (err) {
  }
};

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Verify your email
            </h2>
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <div className="flex gap-2 justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={loading}
                    className="w-10 h-12 text-center text-lg font-semibold
                      border border-gray-300 rounded-lg
                      focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300
                      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
                      transition-colors duration-200"
                  />
                ))}
              </div>
            </div>

            {(error || invalidMessage) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error || invalidMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isCodeComplete || loading}
              className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg
                hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                Try again in {resendTimer}s
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm font-medium text-gray-900 hover:text-gray-700
                  disabled:text-gray-400 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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