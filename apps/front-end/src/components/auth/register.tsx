import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/search";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
}

type Role = "admin" | "teacher";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [role, setRole] = useState<Role>("teacher");
  const [invalidMessage,setInvalidMessage]=useState<any>()

  const { submit, loading, error } = useAuth<RegisterPayload>({
    path: "/user/register",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserExists(false);
    
    try {
      await submit({
        firstName,
        lastName,
        phone,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err:any) {
      setInvalidMessage(err.message)
      if (error === "User already exists") {
        setUserExists(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-5"
      >
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-500">Fill in your details</p>
        </div>

        <Input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <Input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        {!userExists && invalidMessage && (
          <p className="text-sm text-red-500 text-center">
            {invalidMessage}
          </p>)}

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {userExists && (
          <p className="text-sm text-red-500 text-center">
            User already exists
          </p>
        )}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        >
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create account"}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}