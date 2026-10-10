import { useState } from "react";
import { useNavigate, Link } from "react-router"; // 👈 هنا عدلنا الكلمة لـ react-router المظبوطة عندك
import { Mail, Lock, Loader2 } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`👋 Welcome back, ${data.user.UserName}!`);
        navigate("/"); 
      } else {
        alert("❌ Login Failed: " + data.error);
      }
    } catch (error) {
      alert("❌ Connection Error: Make sure Python server (app.py) is running!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(to bottom right, var(--bg-light), var(--bg-gradient))" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--navy)" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--navy-light)" }}>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--navy-light)" }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)]"
                style={{ color: "var(--navy)" }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--navy-light)" }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)]"
                style={{ color: "var(--navy)" }}
              />
            </div>
          </div>

          <div className="text-right mb-6">
            <a
              href="#"
              className="text-sm transition-colors"
              style={{ color: "var(--coral)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--coral-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--coral)"}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white text-lg font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--coral)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative text-center my-8">
          <hr className="absolute top-1/2 left-0 right-0 border-gray-200" />
          <span className="relative bg-white px-4 text-sm" style={{ color: "var(--navy-light)" }}>
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium text-sm transition-all hover:border-[var(--coral)] hover:bg-gray-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium text-sm transition-all hover:border-[var(--coral)] hover:bg-gray-50">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center">
          <p style={{ color: "var(--navy-light)" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--coral)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-sm mt-6 max-w-md" style={{ color: "var(--navy-light)" }}>
        By signing in, you agree to our{" "}
        <a href="#" className="transition-colors" style={{ color: "var(--navy)" }}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="transition-colors" style={{ color: "var(--navy)" }}>
          Privacy Policy
        </a>
      </p>
    </div>
  );
}