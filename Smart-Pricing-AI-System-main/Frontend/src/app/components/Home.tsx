import { Link } from "react-router";
import { Search } from "lucide-react";

export function Home() {
  const plans = [
    {
      name: "Starter",
      price: "$25", // 👈 السعر الحقيقي اللي في الداتا بيز
      period: "per user / per month",
      features: [
        "Real-time market analysis",
        "5 Products limit", // 👈 الليميت الحقيقي
        "Essential AI chatbot access",
        "Weekly performance reports",
      ],
      plan: "starter",
    },
    {
      name: "Professional",
      price: "$129", // 👈 السعر الحقيقي
      period: "per user / per month",
      featured: true,
      features: [
        "Advanced predictive modeling",
        "25 Products limit", // 👈 الليميت الحقيقي
        "Full AI interactions dashboard",
        "Daily strategic insights",
        "API Data Stream access",
      ],
      plan: "professional",
    },
    {
      name: "Enterprise",
      price: "$299", // 👈 السعر الحقيقي بدل CUSTOM
      period: "per user / per month",
      features: [
        "Custom AI model calibration",
        "Unlimited products", // 👈 الليميت الحقيقي
        "Enterprise SLA support",
        "Unlimited API throughput",
        "Quarterly strategic review",
      ],
      plan: "enterprise",
    },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg mb-8">
            <img
              src="https://images.unsplash.com/photo-1771320515748-a3b5c65ba9f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Crystal prism"
              className="w-full h-96 object-contain"
            />
          </div>
          <h1 className="mb-6" style={{
            fontSize: "48px",
            fontWeight: "900",
            color: "var(--navy)",
            lineHeight: "1.2"
          }}>
            AI-DRIVEN<br />
            PRECISION<br />
            PRICING<br />
            FOR THE EDGE
          </h1>
          <p className="text-xl mb-8 max-w-2xl" style={{ color: "var(--navy-light)" }}>
            Real-time competitive analysis designed to help businesses optimize profit margins
            and stay ahead of rapidly evolving market trends with unparalleled precision.
          </p>
          
          {/* 6️⃣ الخطوة السادسة: تعديل الزرار الكبير ليوجّه التاجر لصفحة الدفع مباشرة بدلاً من الداتا إنبوت */}
          <Link
            to="/payment"
            className="inline-block px-8 py-4 rounded-lg text-white text-lg transition-colors"
            style={{ backgroundColor: "var(--coral)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Precision Analytics Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
            PRECISION ANALYTICS
          </div>
          <h2 className="mb-8" style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
            Empower Your Strategy with Real-Time AI Insight
          </h2>
          <div className="flex justify-center mb-8">
            <Search className="w-16 h-16" style={{ color: "var(--navy)" }} />
          </div>
          <h3 style={{ fontSize: "32px", fontWeight: "900", color: "var(--navy)" }}>
            Competitor Tracking
          </h3>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-16" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
              SUBSCRIPTION PLANS
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: "48px", fontWeight: "900" }}>
              Scale Your Strategic Edge
            </h2>
            <p className="text-lg" style={{ color: "#d1d5db" }}>
              Accessible AI-driven competitive analysis for every market stage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 shadow-2xl relative ${
                  plan.featured ? 'border-4' : ''
                }`}
                style={plan.featured ? { borderColor: "var(--coral)" } : {}}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-lg text-white text-xs font-semibold whitespace-nowrap"
                    style={{ backgroundColor: "var(--coral)" }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-3xl font-black mb-4 ${plan.featured ? 'mt-4' : ''}`} style={{ color: "var(--navy)" }}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-black" style={{ color: "var(--coral)" }}>
                    {plan.price}
                  </span>
                  <div className="mt-2" style={{ color: "var(--navy-light)" }}>
                    {plan.period}
                  </div>
                </div>
                <hr className="border-2 mb-6" style={{ borderColor: "var(--coral)" }} />
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="pl-6 relative"
                      style={{ color: "var(--navy-light)" }}
                    >
                      <span
                        className="absolute left-0"
                        style={{ color: "var(--navy-light)" }}
                      >
                        •
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/payment?plan=${plan.plan}`}
                  className="block w-full py-3 rounded-lg text-white text-center text-lg transition-colors"
                  style={{ backgroundColor: "var(--coral)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
                >
                  {plan.featured ? "Try Free Trial" : plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Clarity Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-100 rounded-2xl p-8 mb-8 h-64 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1662974770404-468fd9660389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Chat interface"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="text-center">
            <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
              AI CLARITY
            </div>
            <h2 className="mb-8" style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
              Interactive Strategic Consulting
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: "var(--navy-light)" }}>
              Consult your dedicated AI pricing assistant. Simulate thousands of market scenarios
              and query historical behavior through our intuitive chat interface to validate your
              commercial strategies instantly.
            </p>
            <Link
              to="/chatbot"
              className="inline-block px-8 py-4 rounded-lg text-white text-lg transition-colors"
              style={{ backgroundColor: "var(--coral)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
            >
              Start Consulting
            </Link>
          </div>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-100 rounded-2xl p-8 mb-8 h-64 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Analytics dashboard"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="text-center">
            <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
              MARKET INTELLIGENCE
            </div>
            <h2 className="mb-8" style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
              Real-Time Competitor Analysis
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: "var(--navy-light)" }}>
              Gain a decisive edge with AI-driven monitoring. Our platform tracks global market
              fluctuations down to the millisecond, delivering precision insights that protect
              your profit margins from sudden shifts.
            </p>
            <button
              className="px-8 py-4 rounded-lg text-white text-lg transition-colors"
              style={{ backgroundColor: "var(--coral)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--coral-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--coral)"}
            >
              Explore Analysis Tools
            </button>
          </div>
        </div>
      </section>

      {/* Latest Industry Updates Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-xs tracking-widest mb-4" style={{ color: "var(--coral)", fontWeight: "600" }}>
            INTELLIGENCE STREAM
          </div>
          <h2 style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
            Latest Industry Updates
          </h2>
          <hr className="border-2 border-gray-300 max-w-2xl mx-auto my-8" />
        </div>
      </section>
    </div>
  );
}