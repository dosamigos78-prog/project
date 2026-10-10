import sys
import os
import datetime
import pandas as pd
import numpy as np
import cloudscraper  
from bs4 import BeautifulSoup
from sklearn.ensemble import RandomForestRegressor
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import google.generativeai as genai  

# =====================================================================
# --- 🔑 إعدادات مفتاح الذكاء الاصطناعي (Gemini API) ---
# =====================================================================
GEMINI_API_KEY = "YOUR_API_KEY_HERE"
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

# --- تفعيل سيرفر Flask والربط مع الـ React ---
app = Flask(__name__)
CORS(app)

# --- 1. فتح خط اتصال مركزي مع قاعدة بيانات phpMyAdmin ---
try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='smart_pricing_db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    print("===============================================================")
    print("✅ DATABASE CONFIGURATION: Connected to phpMyAdmin Successfully!")
    print("===============================================================")
except Exception as e:
    print(f"❌ Database Connection Error: {e}")
    sys.exit()

# =====================================================================
# --- 🧠 الذكاء الاصطناعي: تدريب الموديلات على الخصائص الثابتة ---
# =====================================================================
print("===============================================================")
print("🧠 AI ENGINE: Training Machine Learning Models from CSV Data...")

def train_category_model(csv_file, features_cols):
    try:
        df = pd.read_csv(csv_file)
        X = df[features_cols]
        y = df['Price_EGP']
        X_encoded = pd.get_dummies(X)
        model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
        model.fit(X_encoded, y)
        historical_avg = y.mean() 
        return model, list(X_encoded.columns), historical_avg
    except Exception as e:
        print(f"⚠️ Error training model for {csv_file}: {e}")
        return None, None, 1

ac_features = ['Capacity_HP', 'Technology', 'Cooling_Heating', 'Energy_Saving', 'Warranty_Years']
ac_model, ac_cols, ac_hist_avg = train_category_model('ac_cleaned.csv', ac_features)

wm_features = ['Capacity_KG', 'Type', 'Technology', 'RPM', 'Programs', 'Warranty_Years']
wm_model, wm_cols, wm_hist_avg = train_category_model('washing_machine_cleaned.csv', wm_features)

blender_features = ['Wattage', 'Type', 'Jar_Material', 'Warranty_Years']
blender_model, blender_cols, blender_hist_avg = train_category_model('blender_cleaned.csv', blender_features)

print("✅ AI Models & Historical Averages Loaded Successfully!")
print("===============================================================")

def load_products_from_db():
    with connection.cursor() as cursor:
        sql = "SELECT ProductID, ModelName FROM product WHERE Brand = 'Cairo Sales Category'"
        cursor.execute(sql)
        results = cursor.fetchall()
        urls_mapping = {
            'Air Conditioners': 'https://cairosales.com/en/air-conditioners/wall-mount/?n=60',
            'Blenders': 'https://cairosales.com/en/small-appliances/blenders/?n=60',
            'Washing Machines': 'https://cairosales.com/en/washers-dryers/?n=60'
        }
        db_products = {}
        for row in results:
            name = row['ModelName']
            if name in urls_mapping:
                db_products[str(row['ProductID'])] = {
                    'name': name,
                    'url': urls_mapping[name],
                    'db_id': row['ProductID']
                }
        return db_products

try:
    products = load_products_from_db()
except Exception as e:
    products = {}

def get_live_market_prices(url, product_name, category_product_id):
    scraped_prices = []
    scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True})
    try:
        response = scraper.get(url, timeout=30)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            price_tags = soup.find_all('span', {'class': 'product-price'}) or soup.find_all('span', {'class': 'price'})
            for p in price_tags:
                clean_p = p.text.replace('EGP', '').replace(',', '').strip()
                if clean_p:
                    try:
                        scraped_prices.append(float(clean_p))
                    except:
                        continue
    except Exception as e:
        pass
            
    if scraped_prices:
        current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with connection.cursor() as cursor:
            insert_query = "INSERT INTO competitor_price (ScrapedPrice, Timestamp, SourceWebsite, ProductID) VALUES (%s, %s, 'Cairo Sales', %s)"
            for price in scraped_prices:
                cursor.execute(insert_query, (price, current_time, category_product_id))
        connection.commit()
        return scraped_prices
    else:
        return [25000.0] * 12 if 'Air' in product_name else [15000.0] * 12 if 'Washing' in product_name else [2000.0] * 12

# 💡 دالة استخراج المميزات الاستثنائية وحساب علاوة السعر (تعديل الـ 8% إلى 2% لتكون واقعية)
def get_competitive_advantages(choice, input_dict):
    adv = []
    premium_multiplier = 1.0
    
    if choice == '1': 
        if input_dict.get('Capacity_HP', 0) >= 3.0: 
            adv.append(f"قوة تبريد فائقة ({input_dict.get('Capacity_HP')} حصان) [+5% علاوة سعرية]")
            premium_multiplier += 0.05
        if input_dict.get('Technology') == 'Inverter': 
            adv.append("تكنولوجيا الإنفرتر (توفر كفاءة عالية وميزة بيعية قوية) [+7% علاوة سعرية]")
            premium_multiplier += 0.07
        if input_dict.get('Warranty_Years', 0) > 5: 
            # ✅ تم التعديل إلى 2%
            adv.append(f"فترة ضمان استثنائية تفوق متوسط السوق ({input_dict.get('Warranty_Years')} سنوات) [+2% علاوة سعرية]")
            premium_multiplier += 0.02
        elif input_dict.get('Warranty_Years', 0) == 5: 
            adv.append("فترة ضمان ممتازة ومطابقة لأعلى معايير السوق (5 سنوات)")
            
    elif choice == '2': 
        if input_dict.get('Wattage', 0) >= 800: 
            adv.append(f"موتور فائق القوة ({input_dict.get('Wattage')} واط) [+5% علاوة سعرية]")
            premium_multiplier += 0.05
        if input_dict.get('Jar_Material') in ['Glass', 'Tritan']: 
            adv.append(f"خامة دورق صحية وعالية التحمل ({input_dict.get('Jar_Material')}) [+4% علاوة سعرية]")
            premium_multiplier += 0.04
        if input_dict.get('Warranty_Years', 0) > 1: 
            adv.append(f"فترة ضمان ممتدة ({input_dict.get('Warranty_Years')} سنوات) [+6% علاوة سعرية]")
            premium_multiplier += 0.06
            
    elif choice == '3': 
        if input_dict.get('Capacity_KG', 0) >= 10: 
            adv.append(f"سعة غسيل عائلية ضخمة ({input_dict.get('Capacity_KG')} كجم) [+5% علاوة سعرية]")
            premium_multiplier += 0.05
        if input_dict.get('Technology') in ['Inverter', 'Digital Inverter', 'EcoBubble', 'EcoSilence']: 
            adv.append(f"تكنولوجيا حديثة وموفرة ({input_dict.get('Technology')}) [+6% علاوة سعرية]")
            premium_multiplier += 0.06
        if input_dict.get('RPM', 0) >= 1200: 
            adv.append(f"سرعة عصر وتجفيف قوية جداً ({input_dict.get('RPM')} لفة/دقيقة) [+4% علاوة سعرية]")
            premium_multiplier += 0.04
        if input_dict.get('Warranty_Years', 0) > 5: 
            # ✅ تم التعديل إلى 2%
            adv.append(f"ضمان استثنائي يمنح ثقة للعميل ({input_dict.get('Warranty_Years')} سنوات) [+2% علاوة سعرية]")
            premium_multiplier += 0.02
            
    return adv, premium_multiplier

@app.route('/api/analyze-product', methods=['POST'])
def analyze_product():
    try:
        data = request.json
        user_model_name = data.get('modelName', '').strip()
        user_brand = data.get('brand', '').strip()
        user_cost = float(data.get('cost', 0))
        user_demand = int(data.get('demandScore', 4))
        choice = str(data.get('categoryChoice', '1')).strip()
        
        if choice not in products: return jsonify({'success': False, 'error': 'Invalid category choice'})

        selected_product = products[choice]['name']
        category_id = products[choice]['db_id']
        
        if choice == '1':
            input_dict = {
                'Capacity_HP': float(data.get('capacityHP', 1.5)),
                'Technology': data.get('technologyAC', 'Digital'),
                'Cooling_Heating': data.get('coolingHeating', 'Cool Only'),
                'Energy_Saving': data.get('energySavingAC', 'Medium'),
                'Warranty_Years': int(data.get('warrantyAC', 5))
            }
            active_model, active_cols, hist_avg = ac_model, ac_cols, ac_hist_avg
        elif choice == '2':
            input_dict = {
                'Wattage': int(data.get('wattage', 400)),
                'Type': data.get('typeBlender', 'Blender + 2 Grinders'),
                'Jar_Material': data.get('jarMaterial', 'Plastic'),
                'Warranty_Years': int(data.get('warrantyBlender', 1))
            }
            active_model, active_cols, hist_avg = blender_model, blender_cols, blender_hist_avg
        elif choice == '3':
            input_dict = {
                'Capacity_KG': int(data.get('capacityKG', 8)),
                'Type': data.get('typeWM', 'Front Load'),
                'Technology': data.get('technologyWM', 'Standard'),
                'RPM': int(data.get('rpm', 1000)),
                'Programs': int(data.get('programs', 10)),
                'Warranty_Years': int(data.get('warrantyWM', 5))
            }
            active_model, active_cols, hist_avg = wm_model, wm_cols, wm_hist_avg

        # استقبال المميزات ومعامل الزيادة
        advantages, premium_multiplier = get_competitive_advantages(choice, input_dict)
        
        input_df = pd.DataFrame([input_dict])
        input_encoded = pd.get_dummies(input_df)
        input_aligned = input_encoded.reindex(columns=active_cols, fill_value=0)
        intrinsic_value = active_model.predict(input_aligned)[0]
        feature_ratio = intrinsic_value / hist_avg if hist_avg > 0 else 1.0
        live_prices = get_live_market_prices(products[choice]['url'], selected_product, category_id)
        live_avg = sum(live_prices) / len(live_prices) if live_prices else intrinsic_value

        demand_multiplier = 1.0
        if user_demand == 5: demand_multiplier = 1.06
        elif user_demand == 3: demand_multiplier = 0.94

        # المعادلة النهائية
        final_suggested_price = live_avg * feature_ratio * demand_multiplier * premium_multiplier

        if user_cost <= 0: return jsonify({'success': False, 'error': 'Cost must be greater than zero.'})

        expected_profit = final_suggested_price - user_cost
        profit_margin = (expected_profit / final_suggested_price) * 100 if final_suggested_price > 0 else 0
        
        # ديناميكية نص التوصية
        rec_parts = []
        if user_demand == 5: rec_parts.append("🔥 [High Demand] Aggressive Pricing Active.")
        elif user_demand == 3: rec_parts.append("⚠️ [Low Demand] Penetration Pricing Active.")
        else: rec_parts.append("✅ [Stable Demand] Feature-Based Optimization.")

        if premium_multiplier > 1.0:
            added_value_perc = int(round((premium_multiplier - 1.0) * 100, 0))
            rec_parts.append(f"💎 [Premium Specs] AI applied a +{added_value_perc}% price boost due to exceptional product features.")
            
        rec = " | ".join(rec_parts)

        current_time_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with connection.cursor() as cursor:
            report_title = f"Hybrid AI Entry - {user_model_name} ({current_time_str})"
            cursor.execute("INSERT INTO analysis_report (ReportTitle, DateGenerated) VALUES (%s, %s)", (report_title, current_time_str))
            analysis_id = cursor.lastrowid
            ins_prod_query = "INSERT INTO product (ModelName, Brand, EstimatedCost, DemandScore, UserID, AnalysisID) VALUES (%s, %s, %s, %s, NULL, %s)"
            cursor.execute(ins_prod_query, (user_model_name, user_brand, user_cost, user_demand, analysis_id))
        connection.commit()

        adv_text = "\n".join([f"  ⭐ {a}" for a in advantages]) if advantages else "  ⭐ No exceptional competitive advantages identified."
        report_content = f"""=======================================================
               HYBRID AI PRICING REPORT
=======================================================
Date Generated    : {current_time_str}
Target Category   : {selected_product}
Linked Report ID  : #{analysis_id}
-------------------------------------------------------
• Product Name             : {user_model_name}
• Brand                    : {user_brand}
• Production/Purchase Cost : {user_cost:,.2f} EGP
• Live Market Average      : {live_avg:,.2f} EGP
• Feature Value Ratio      : {feature_ratio:.2f}x
• Expert Premium Multiplier: {premium_multiplier:.2f}x
-------------------------------------------------------
✨ COMPETITIVE ADVANTAGES IDENTIFIED:
{adv_text}
-------------------------------------------------------
• AI SUGGESTED SELLING PRICE: {final_suggested_price:,.2f} EGP
-------------------------------------------------------
• Expected Net Profit      : {expected_profit:,.2f} EGP
• Calculated Profit Margin : {profit_margin:.2f}%
-------------------------------------------------------
Strategy: {rec}
=======================================================
"""
        with open("pricing_report.txt", "w", encoding="utf-8") as f:
            f.write(report_content)

        return jsonify({
            'success': True,
            'categoryName': selected_product,
            'suggestedPrice': round(final_suggested_price, 2),
            'competitorAvg': round(live_avg, 2),
            'analysisId': analysis_id,
            'expectedProfit': round(expected_profit, 2),
            'profitMargin': round(profit_margin, 2),
            'strategy': rec,
            'advantages': advantages
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# =====================================================================
# --- 🤖 المستشار الذكي (Gemini AI Chatbot Endpoint) ---
# =====================================================================
@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        user_id = data.get('userId', None)
        
        if not user_message:
            return jsonify({'success': False, 'error': 'Message cannot be empty.'})

        current_month = datetime.datetime.now().strftime('%B')
        current_year = datetime.datetime.now().strftime('%Y')
        
        system_prompt = f"""
        أنت مستشار أعمال وتسعير ذكي اسمك "جيمي" (Gemini). أنت مدمج في نظام تسعير ذكي للأجهزة الكهربائية (تكييفات، غسالات، خلاطات).
        تتحدث باللغتين العربية والإنجليزية بطلاقة حسب لغة المستخدم وبنبرة احترافية، ودودة، ومباشرة.
        نحن الآن في شهر {current_month} من عام {current_year}. 
        قواعد هامة:
        1. إذا سألك المستخدم عن نصائح، استخدم الوعي بالزمن. مثلاً، إذا كنا في الصيف (يونيو-أغسطس) والمنتج تكييف، انصحه برفع السعر قليلاً لزيادة الطلب. 
        2. إذا اقتربنا من نوفمبر، ذكره بتجهيز خصومات البلاك فرايداي.
        3. اجعل إجاباتك مختصرة، في صميم الموضوع، ومرتبة في نقاط إذا لزم الأمر. لا تطل في الكلام.
        
        رسالة التاجر: {user_message}
        """

        response = gemini_model.generate_content(system_prompt)
        bot_reply = response.text

        current_time_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with connection.cursor() as cursor:
            insert_query = """
                INSERT INTO ai_consultation (UserID, QueryText, ResponseText, Timestamp)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(insert_query, (user_id, user_message, bot_reply, current_time_str))
        connection.commit()

        return jsonify({
            'success': True,
            'reply': bot_reply
        })

    except Exception as e:
        print(f"❌ Gemini Chatbot Error: {e}")
        return jsonify({'success': False, 'error': 'AI Service is currently busy or API key is invalid.'})

# 📌 --- [دوال الـ Signup والـ Login والـ Payment] ---
@app.route('/api/signup', methods=['POST'])
def signup_user():
    try:
        data = request.json
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        if not name or not email or not password: return jsonify({'success': False, 'error': 'All fields are required.'})
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM user WHERE Email = %s", (email,))
            if cursor.fetchone(): return jsonify({'success': False, 'error': 'This email is already registered!'})
            cursor.execute("INSERT INTO user (Name, Email, Password) VALUES (%s, %s, %s)", (name, email, password))
        connection.commit()
        return jsonify({'success': True, 'message': 'User registered successfully!'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        with connection.cursor() as cursor:
            cursor.execute("SELECT UserID, Name, Email FROM user WHERE Email = %s AND Password = %s", (email, password))
            user_data_row = cursor.fetchone()
        if user_data_row:
            return jsonify({
                'success': True, 
                'message': 'Login successful!', 
                'user': {
                    'UserID': user_data_row['UserID'], 
                    'UserName': user_data_row['Name'], 
                    'Email': user_data_row['Email']
                }
            })
        else:
            return jsonify({'success': False, 'error': 'Invalid email or password.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/payment', methods=['POST'])
def process_payment():
    try:
        data = request.json
        email = data.get('email', '').strip()
        plan_name = data.get('planName', '').strip().lower() 
        with connection.cursor() as cursor:
            cursor.execute("SELECT UserID FROM user WHERE Email = %s", (email,))
            user_row = cursor.fetchone()
            if not user_row: return jsonify({'success': False, 'error': 'This email is not registered.'})
            sub_id = 3 if "enterprise" in plan_name else 2 if "professional" in plan_name or "pro" in plan_name else 1
            cursor.execute("INSERT INTO user_subscription (UserID, SubscriptionID) VALUES (%s, %s)", (user_row['UserID'], sub_id))
        connection.commit()
        return jsonify({'success': True, 'message': 'Payment logged!'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)