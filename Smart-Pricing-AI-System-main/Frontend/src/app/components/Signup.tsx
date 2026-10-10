import { useState } from "react";
import { useNavigate, Link } from "react-router"; // للتنقل والربط
import { User, Mail, Lock, Loader2 } from "lucide-react";

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التأكد إن الباسورد ومطابقته زي بعض
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // الـ API الحقيقية اللي بتضرب في سيرفر بايثون لضخ البيانات
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Account created successfully! Please sign in.");
        // توجيه التاجر لصفحة الـ Login عشان يدخل على نضافة ويستلم الـ session
        navigate("/login");
      } else {
        alert("❌ Signup Failed: " + data.error);
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
            Create Account
          </h1>
          <p style={{ color: "var(--navy-light)" }}>Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* خانة الاسم الكامل */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--navy-light)" }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)]"
                style={{ color: "var(--navy)" }}
              />
            </div>
          </div>

          {/* خانة الإيميل */}
          <div className="mb-4">
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

          {/* خانة الباسورد */}
          <div className="mb-4">
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

          {/* خانة تأكيد الباسورد */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--navy-light)" }} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)]"
                style={{ color: "var(--navy)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white text-lg font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--coral)" }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p style={{ color: "var(--navy-light)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: "var(--coral)" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}