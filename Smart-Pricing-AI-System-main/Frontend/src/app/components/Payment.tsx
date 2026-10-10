import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Lock, CreditCard, Check, Loader2 } from "lucide-react";

export function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 🛡️ الحارس الشخصي للصفحة (Route Guard)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("⚠️ يرجى تسجيل الدخول أولاً لتتمكن من إتمام عملية الدفع.");
      navigate("/login");
    }
  }, [navigate]);

  const planParam = (searchParams.get("plan") || "starter").toLowerCase();

  const [formData, setFormData] = useState({
    email: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // 📝 مميزات باقات واقعية مبنية على المشروع
  const plans = {
    starter: {
      name: "Starter",
      price: "$25",
      period: "per user / per month",
      features: [
        "تسعير ذكي لـ 5 منتجات شهرياً",
        "تقييم فني أساسي للمنتجات",
        "توليد تقارير تسعير نصية",
        "دعم فني عبر البريد الإلكتروني",
      ],
    },
    pro: {
      name: "Professional", 
      price: "$129",
      period: "per user / per month",
      features: [
        "تسعير ديناميكي ل 25 منتج شهريا",
        "Live Market Scraping (نبض السوق اللحظي)",
        "اكتشاف الميزة التنافسية (Feature Inspector)",
        "وصول كامل للمستشار الذكي (Gemini Chatbot)",
        "أولوية في الدعم الفني",
      ],
    },
    professional: {
      name: "Professional", 
      price: "$129",
      period: "per user / per month",
      features: [
        "تسعير ديناميكي ل 25 منتج شهريا",
        "Live Market Scraping (نبض السوق اللحظي)",
        "اكتشاف الميزة التنافسية (Feature Inspector)",
        "وصول كامل للمستشار الذكي (Gemini Chatbot)",
        "أولوية في الدعم الفني",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: "$299",
      period: "per user / per month",
      features: [
        "تسعير ديناميكي لعدد غير محدود من المنتجات",
        "تدريب مخصص لنموذج الذكاء الاصطناعي",
        "لوحة تحكم كاملة للإدارة والتحليلات",
        "توجيه مخصص (Custom Prompts) للمستشار",
        "دعم فني فوري 24/7 (SLA Support)",
      ],
    },
  };

  const currentPlan = plans[planParam as keyof typeof plans] || plans.starter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          planName: currentPlan.name, 
          amount: currentPlan.price,
          cardName: formData.cardName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("hasPaid", "true");
        localStorage.setItem("activePlan", currentPlan.name);
        alert(`✅ Payment Successful! Your ${currentPlan.name} plan is now active.`);
        navigate("/data-input");
      } else {
        alert("❌ Payment Failed: " + data.error);
      }
    } catch (error) {
      alert("❌ Connection Error: Make sure Python server (app.py) is running!");
    } finally {
      setIsLoading(false);
    }
  };

  // 💳 اللوجيك الذكي لفورمات الكارت وتاريخ الانتهاء
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      formattedValue = digitsOnly.substring(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    } 
    else if (name === "expiryDate") {
      const digitsOnly = value.replace(/\D/g, "").substring(0, 4);
      if (digitsOnly.length > 2) {
        formattedValue = digitsOnly.substring(0, 2) + "/" + digitsOnly.substring(2, 4);
      } else {
        formattedValue = digitsOnly;
      }
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "linear-gradient(to bottom right, var(--bg-light), var(--bg-gradient))" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
            SECURE CHECKOUT
          </div>
          <h1 className="mb-4" style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
            Complete Your Purchase
          </h1>
          <p className="text-lg" style={{ color: "var(--navy-light)" }}>
            Join thousands of businesses optimizing their pricing strategy
          </p>
        </div>

        {/* Payment Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5" style={{ color: "var(--coral)" }} />
              <h2 className="text-2xl font-black" style={{ color: "var(--navy)" }}>
                Payment Information
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)] font-medium"
                  style={{ color: "var(--navy)" }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)] font-medium"
                  style={{ color: "var(--navy)" }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)] font-medium tracking-wide"
                    style={{ color: "var(--navy)" }}
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: "var(--navy-light)" }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)] font-medium text-center tracking-widest"
                    style={{ color: "var(--navy)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="•••"
                    maxLength={4}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-[var(--coral)] font-medium text-center tracking-widest"
                    style={{ color: "var(--navy)" }}
                  />
                </div>
              </div>

              <div className="flex gap-3 bg-gray-50 rounded-lg p-4 mb-6">
                <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--coral)" }} />
                <p className="text-sm m-0" style={{ color: "var(--navy-light)" }}>
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-lg text-white text-lg font-semibold shadow-lg transition-colors mb-4 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--coral)" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Complete Purchase - ${currentPlan.price}`
                )}
              </button>

              <p className="text-center text-xs m-0" style={{ color: "var(--navy-light)" }}>
                By completing this purchase, you agree to our{" "}
                <a href="#" className="transition-colors" style={{ color: "var(--navy)" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="transition-colors" style={{ color: "var(--navy)" }}>
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-black mb-6" style={{ color: "var(--navy)" }}>
              Order Summary
            </h2>

            <div className="pb-6 border-b-2 border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black" style={{ color: "var(--navy)" }}>
                  {currentPlan.name}
                </h3>
                <span className="text-2xl font-black" style={{ color: "var(--coral)" }}>
                  {currentPlan.price}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--navy-light)" }}>
                {currentPlan.period}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3" style={{ color: "var(--navy)" }}>
                What's included:
              </h4>
              <ul className="space-y-3">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium" style={{ color: "var(--navy-light)" }}>
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--coral)" }} />
                    {/* 💡 التعديل هنا: استخدمنا dir="auto" بدلاً من style */}
                    <span dir="auto">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t-2 border-gray-100">
              <div className="flex justify-between py-3 font-medium" style={{ color: "var(--navy-light)" }}>
                <span>Subtotal</span>
                <span>{currentPlan.price}</span>
              </div>
              <div className="flex justify-between py-3 font-medium" style={{ color: "var(--navy-light)" }}>
                <span>Tax (included)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between py-3 pt-3 border-t-2 border-gray-100 mt-3 text-xl font-black" style={{ color: "var(--navy)" }}>
                <span>Total</span>
                <span>{currentPlan.price}</span>
              </div>
            </div>

            <div
              className="rounded-xl p-5 text-center text-white mt-8 shadow-md"
              style={{ background: "linear-gradient(to bottom right, var(--coral), #FF9070)" }}
            >
              <p className="font-bold text-lg mb-1 m-0">30-Day Money Back Guarantee</p>
              <p className="text-sm opacity-90 m-0">Not satisfied? Get a full refund within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}