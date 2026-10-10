import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload, Download, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

export function DataInput() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    categoryChoice: "1",
    modelName: "",
    brand: "",
    cost: "",
    demandScore: "4",
    capacityHP: "1.5",
    technologyAC: "Digital",
    coolingHeating: "Cool Only",
    energySavingAC: "Medium",
    warrantyAC: "5",
    wattage: "400",
    typeBlender: "Blender + 2 Grinders",
    jarMaterial: "Plastic",
    warrantyBlender: "1",
    capacityKG: "8",
    typeWM: "Front Load",
    technologyWM: "Standard",
    rpm: "1200",
    programs: "10",
    warrantyWM: "5",
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasPaid = localStorage.getItem("hasPaid");
    if (hasPaid !== "true") {
      alert("⚠️ Access Denied: Please choose a plan and complete your payment first!");
      navigate("/payment");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setAiResult(data);
      } else {
        alert("❌ AI Server Error: " + data.error);
      }
    } catch (error) {
      alert("❌ Could not connect to Python AI Server. Please make sure app.py is running!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow popups for this website");

    const advantagesHtml = aiResult.advantages && aiResult.advantages.length > 0 
      ? `
        <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; border-right: 5px solid #48bb78; margin-bottom: 20px;">
          <h3 style="color: #276749; margin-top: 0;">✨ المميزات التنافسية المكتشفة:</h3>
          <ul style="color: #2f855a; font-weight: bold; line-height: 1.8;">
            ${aiResult.advantages.map((adv: string) => `<li>${adv}</li>`).join("")}
          </ul>
        </div>
      ` 
      : "";

    const htmlContent = `
      <html dir="rtl">
        <head>
          <title>AI Pricing Report - ${formData.modelName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #2d3748; }
            .header { text-align: center; border-bottom: 3px solid #ff6b4a; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #1a202c; margin: 0; font-size: 28px; }
            .header p { color: #718096; margin-top: 5px; }
            .grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; }
            .card { background: #f7fafc; padding: 20px; border-radius: 10px; flex: 1; min-width: 200px; border: 1px solid #e2e8f0; }
            .card h4 { margin: 0 0 10px 0; color: #4a5568; font-size: 14px; }
            .card .value { font-size: 22px; font-weight: bold; color: #2b6cb0; }
            .highlight { color: #ff6b4a !important; font-size: 26px !important; }
            .strategy { background-color: #ebf8ff; padding: 20px; border-radius: 8px; border-right: 5px solid #3182ce; font-weight: bold; line-height: 1.6; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تقرير الذكاء الاصطناعي لاستراتيجية التسعير</h1>
            <p>رقم التحليل: #${aiResult.analysisId} | القسم: ${aiResult.categoryName}</p>
          </div>

          <div class="grid">
            <div class="card">
              <h4>المنتج (Model)</h4>
              <div class="value">${formData.modelName}</div>
            </div>
            <div class="card">
              <h4>العلامة التجارية (Brand)</h4>
              <div class="value">${formData.brand}</div>
            </div>
            <div class="card">
              <h4>تكلفة الإنتاج/الشراء</h4>
              <div class="value">${Number(formData.cost).toLocaleString()} EGP</div>
            </div>
          </div>

          <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">التحليل المالي والسوقي</h2>
          <div class="grid">
            <div class="card">
              <h4>متوسط سعر المنافسين</h4>
              <div class="value">${aiResult.competitorAvg.toLocaleString()} EGP</div>
            </div>
            <div class="card" style="border-color: #ff6b4a; background-color: #fffaf0;">
              <h4>السعر المقترح من AI</h4>
              <div class="value highlight">${aiResult.suggestedPrice.toLocaleString()} EGP</div>
            </div>
          </div>
          <div class="grid">
            <div class="card">
              <h4>الربح الصافي المتوقع</h4>
              <div class="value" style="color: #48bb78;">+${aiResult.expectedProfit.toLocaleString()} EGP</div>
            </div>
            <div class="card">
              <h4>هامش الربح المتوقع</h4>
              <div class="value">${aiResult.profitMargin}%</div>
            </div>
          </div>

          ${advantagesHtml}

          <div class="strategy">
            <span style="color: #2b6cb0; font-size: 18px;">💡 التوصية الاستراتيجية:</span><br/><br/>
            ${aiResult.strategy}
          </div>

          <div class="footer">
            تم توليد هذا التقرير آلياً بواسطة منصة AI Pricing Enterprise © 2026
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom right, var(--bg-light), var(--bg-gradient))" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "rgba(255, 107, 74, 0.1)", color: "var(--coral)", fontSize: "12px", fontWeight: "900", letterSpacing: "1px" }}
          >
            DATA INPUT
          </div>
          <h1 className="mb-4" style={{ fontSize: "48px", fontWeight: "900", color: "var(--navy)" }}>
            AI Feature-Based Pricing
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--navy-light)" }}>
            Enter your product features for precise Machine Learning analysis
          </p>
        </div>

        <div className="flex justify-center mb-16 relative">
          <div className="relative w-full max-w-xl">
            <div
              className="w-full p-1 shadow-2xl rounded-2xl"
              style={{ background: "linear-gradient(to bottom right, var(--coral), #FF9070)" }}
            >
              <div className="w-full h-full bg-white rounded-xl p-8 flex flex-col items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "linear-gradient(to bottom right, var(--coral), #FF9070)" }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy-light)" }}>Product Category</label>
                    <select
                      name="categoryChoice"
                      value={formData.categoryChoice}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[var(--coral)] focus:outline-none font-bold"
                      style={{ color: "var(--navy)" }}
                    >
                      <option value="1">Air Conditioners</option>
                      <option value="2">Blenders</option>
                      <option value="3">Washing Machines</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy-light)" }}>Brand</label>
                        <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[var(--coral)] focus:outline-none"
                        style={{ color: "var(--navy)" }}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy-light)" }}>Model Name</label>
                        <input
                        type="text"
                        name="modelName"
                        value={formData.modelName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[var(--coral)] focus:outline-none"
                        style={{ color: "var(--navy)" }}
                        />
                    </div>
                  </div>

                  <hr className="border-gray-200" />
                  
                  {/* ❄️ تكييفات */}
                  {formData.categoryChoice === "1" && (
                    <div className="space-y-4 p-5 rounded-lg bg-blue-50 border border-blue-100">
                      <h3 className="text-sm font-black text-blue-800 mb-2 border-b border-blue-200 pb-2">❄️ Air Conditioner Features</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-bold mb-1 text-blue-800">Capacity (HP)</label>
                          <select name="capacityHP" value={formData.capacityHP} onChange={handleChange} className="w-full p-2.5 border border-blue-200 rounded focus:outline-none focus:border-blue-500">
                            <option value="1.5">1.5 HP</option><option value="2.25">2.25 HP</option><option value="3.0">3.0 HP</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-blue-800">Technology</label>
                          <select name="technologyAC" value={formData.technologyAC} onChange={handleChange} className="w-full p-2.5 border border-blue-200 rounded focus:outline-none focus:border-blue-500">
                            <option value="Digital">Digital</option><option value="Inverter">Inverter</option><option value="Standard">Standard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-blue-800">System</label>
                          <select name="coolingHeating" value={formData.coolingHeating} onChange={handleChange} className="w-full p-2.5 border border-blue-200 rounded focus:outline-none focus:border-blue-500">
                            <option value="Cool Only">Cool Only</option><option value="Heat & Cool">Heat & Cool</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-blue-800">Energy Saving</label>
                          <select name="energySavingAC" value={formData.energySavingAC} onChange={handleChange} className="w-full p-2.5 border border-blue-200 rounded focus:outline-none focus:border-blue-500">
                            <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold mb-1 text-blue-800">Warranty</label>
                          <select name="warrantyAC" value={formData.warrantyAC} onChange={handleChange} className="w-full p-2.5 border border-blue-200 rounded focus:outline-none focus:border-blue-500">
                            <option value="3">3 Years Warranty</option>
                            <option value="4">4 Years Warranty</option>
                            <option value="5">5 Years Warranty</option>
                            <option value="6">6 Years Warranty</option>
                            <option value="7">7 Years Warranty</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 🍹 خلاطات */}
                  {formData.categoryChoice === "2" && (
                    <div className="space-y-4 p-5 rounded-lg bg-yellow-50 border border-yellow-100">
                      <h3 className="text-sm font-black text-yellow-800 mb-2 border-b border-yellow-200 pb-2">🍹 Blender Features</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-bold mb-1 text-yellow-800">Wattage (W)</label>
                          <select name="wattage" value={formData.wattage} onChange={handleChange} className="w-full p-2.5 border border-yellow-200 rounded focus:outline-none focus:border-yellow-500">
                            <option value="400">400 Watt</option><option value="500">500 Watt</option><option value="600">600 Watt</option><option value="800">800 Watt</option><option value="1000">1000 Watt</option><option value="1200">1200 Watt</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-yellow-800">Included Accessories</label>
                          <select name="typeBlender" value={formData.typeBlender} onChange={handleChange} className="w-full p-2.5 border border-yellow-200 rounded focus:outline-none focus:border-yellow-500">
                            <option value="Blender">Blender Only</option><option value="Blender + 1 Grinder">With 1 Grinder</option><option value="Blender + 2 Grinders">With 2 Grinders</option><option value="High Speed Blender">High Speed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-yellow-800">Jar Material</label>
                          <select name="jarMaterial" value={formData.jarMaterial} onChange={handleChange} className="w-full p-2.5 border border-yellow-200 rounded focus:outline-none focus:border-yellow-500">
                            <option value="Plastic">Plastic Jar</option><option value="Glass">Glass Jar</option><option value="Tritan">Tritan Jar</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-yellow-800">Warranty</label>
                          <select name="warrantyBlender" value={formData.warrantyBlender} onChange={handleChange} className="w-full p-2.5 border border-yellow-200 rounded focus:outline-none focus:border-yellow-500">
                            <option value="1">1 Year Warranty</option>
                            <option value="2">2 Years Warranty</option>
                            <option value="3">3 Years Warranty</option>
                            <option value="4">4 Years Warranty</option>
                            <option value="5">5 Years Warranty</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 🧺 غسالات */}
                  {formData.categoryChoice === "3" && (
                    <div className="space-y-4 p-5 rounded-lg bg-green-50 border border-green-100">
                      <h3 className="text-sm font-black text-green-800 mb-2 border-b border-green-200 pb-2">🧺 Washing Machine Features</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Capacity (KG)</label>
                          <select name="capacityKG" value={formData.capacityKG} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="7">7 KG</option><option value="8">8 KG</option><option value="9">9 KG</option><option value="10">10 KG</option><option value="13">13 KG</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Load Type</label>
                          <select name="typeWM" value={formData.typeWM} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="Front Load">Front Load</option><option value="Top Load">Top Load</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Technology</label>
                          <select name="technologyWM" value={formData.technologyWM} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="Standard">Standard</option><option value="Inverter">Inverter</option><option value="Digital Inverter">Digital Inverter</option><option value="EcoBubble">EcoBubble</option><option value="EcoSilence">EcoSilence</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Warranty</label>
                          <select name="warrantyWM" value={formData.warrantyWM} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="3">3 Years Warranty</option>
                            <option value="4">4 Years Warranty</option>
                            <option value="5">5 Years Warranty</option>
                            <option value="6">6 Years Warranty</option>
                            <option value="7">7 Years Warranty</option>
                            <option value="10">10 Years Warranty</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Spin Speed (RPM)</label>
                          <select name="rpm" value={formData.rpm} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="800">800 RPM</option><option value="1000">1000 RPM</option><option value="1200">1200 RPM</option><option value="1400">1400 RPM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 text-green-800">Programs</label>
                          <select name="programs" value={formData.programs} onChange={handleChange} className="w-full p-2.5 border border-green-200 rounded focus:outline-none focus:border-green-500">
                            <option value="8">8 Programs</option><option value="10">10 Programs</option><option value="12">12 Programs</option><option value="14">14 Programs</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy-light)" }}>Production Cost</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required step="0.01" className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[var(--coral)] focus:outline-none" style={{ color: "var(--navy)" }} />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold mb-1" style={{ color: "var(--navy-light)" }}>Demand Score</label>
                        <select name="demandScore" value={formData.demandScore} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[var(--coral)] focus:outline-none" style={{ color: "var(--navy)" }}>
                        <option value="3">Low (3)</option><option value="4">Stable (4)</option><option value="5">High (5)</option>
                        </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 rounded-lg text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 font-bold"
                    style={{ background: "var(--coral)" }}
                  >
                    {loading ? "AI Processing..." : "Analyze with AI"}
                  </button>
                </form>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full opacity-50" style={{ backgroundColor: "var(--coral)" }}></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full opacity-50" style={{ backgroundColor: "var(--navy)" }}></div>
          </div>
        </div>

        {/* 📊 التقرير الاحترافي مع المميزات التنافسية */}
        {aiResult && (
          <div className="max-w-3xl mx-auto mb-16 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative animate-slide-in">
            {/* رأس التقرير */}
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black" style={{ color: "var(--navy)" }}>Enterprise AI Report</h2>
                  <p className="text-xs text-gray-500 font-bold">Analysis ID: #{aiResult.analysisId} | Confidence: High</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Analysis Complete
                </span>
              </div>
            </div>

            {/* تفاصيل التقرير */}
            <div className="p-8 space-y-8">
              
              {/* القسم المالي */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-sm font-bold text-gray-500 mb-1">Competitor Market Average</p>
                  <p className="text-2xl font-black" style={{ color: "var(--navy)" }}>
                    {aiResult.competitorAvg.toLocaleString()} EGP
                  </p>
                </div>
                <div className="p-5 rounded-2xl border-2 border-[var(--coral)] relative" style={{ backgroundColor: "rgba(255, 107, 74, 0.03)" }}>
                  <p className="text-sm font-bold mb-1" style={{ color: "var(--coral)" }}>AI Suggested Selling Price</p>
                  <p className="text-3xl font-black" style={{ color: "var(--coral)" }}>
                    {aiResult.suggestedPrice.toLocaleString()} EGP
                  </p>
                  <div className="absolute top-4 right-4 animate-pulse">
                    <CheckCircle className="w-6 h-6 text-[var(--coral)]" />
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                  <p className="text-sm font-bold text-green-700 mb-1">Expected Net Profit</p>
                  <p className="text-xl font-black text-green-600">
                    +{aiResult.expectedProfit.toLocaleString()} EGP
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-sm font-bold text-blue-700 mb-1">Calculated Profit Margin</p>
                  <p className="text-xl font-black text-blue-600">
                    {aiResult.profitMargin}%
                  </p>
                </div>
              </div>

              {/* ✨ قسم المميزات التنافسية */}
              {aiResult.advantages && aiResult.advantages.length > 0 && (
                <div className="p-6 rounded-2xl bg-green-50 border-l-4 border-green-500 shadow-sm" dir="auto">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-black text-green-800">المميزات التنافسية المكتشفة (Competitive Advantages)</h3>
                  </div>
                  <ul className="space-y-2">
                    {aiResult.advantages.map((adv: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-green-700 font-semibold">
                        <span className="mt-1 text-green-500">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* النصيحة الاستراتيجية */}
              <div className="p-6 rounded-2xl bg-gray-50 border-l-4 border-[var(--coral)]" dir="auto">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" style={{ color: "var(--coral)" }} />
                  <h3 className="text-md font-black" style={{ color: "var(--navy)" }}>Strategic Recommendation</h3>
                </div>
                <p className="font-semibold text-gray-700">
                  {aiResult.strategy}
                </p>
              </div>

              {/* 📥 زرار تحميل التقرير كـ PDF */}
              <div className="pt-6 border-t border-gray-100 flex justify-center">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                  style={{ backgroundColor: "var(--navy)" }}
                >
                  <Download className="w-5 h-5" />
                  Download Report as PDF
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}