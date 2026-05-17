from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Predefined dictionary for chatbot responses
faq_responses = {
    "greetings": ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    "courses": ["courses", "programs", "degrees", "what do you offer", "branches"],
    "admissions": ["admission", "apply", "enroll", "registration", "deadline"],
    "fees": ["fee", "cost", "tuition", "price", "how much"],
    "placements": ["placement", "jobs", "recruiters", "salary", "companies"],
    "hostel": ["hostel", "accommodation", "dorm", "room", "living"],
    "departments": ["department", "faculty", "staff", "professors", "hod"],
    "contact": ["contact", "phone", "email", "location", "address", "reach"],
    "goodbye": ["bye", "thank you", "thanks", "goodbye", "see you"]
}

response_data = {
    "greetings": "Hello there! Welcome to our College Assistant Chatbot. How can I help you today?",
    "courses": "We offer a wide range of undergraduate and postgraduate programs including Computer Science, Information Technology, Electronics, Mechanical Engineering, and Business Administration.",
    "admissions": "Admissions are currently open! You can apply online through our official portal. The last date to apply is August 30th. You will need your transcripts and ID proof.",
    "fees": "The fee structure varies by course. On average, undergraduate engineering courses cost around $10,000 per year, and business programs cost around $8,500 per year. Please check our website for specific details.",
    "placements": "We have an excellent placement record with top recruiters like Google, Microsoft, Amazon, and TCS visiting our campus. The average package last year was $85,000.",
    "hostel": "Yes, we provide separate hostel facilities for boys and girls with high-speed Wi-Fi, 24/7 security, gym, and mess facilities.",
    "departments": "Our college has 6 main departments: Computer Science, Information Tech, Electrical, Mechanical, Civil, and Management Studies.",
    "contact": "You can reach us at admissions@ourcollege.edu or call us at +1 (800) 123-4567. Our campus is located at 123 University Drive, Cityville.",
    "goodbye": "You're welcome! Have a great day ahead! Feel free to ask if you need more information.",
    "default": "I'm sorry, I didn't quite catch that. Could you please rephrase or ask about courses, admissions, fees, placements, hostel, or contact details?"
}

def get_response(user_input):
    user_input = user_input.lower()
    
    # Check for keywords in user input
    for category, keywords in faq_responses.items():
        if any(keyword in user_input for keyword in keywords):
            return response_data[category]
            
    return response_data["default"]

@app.route("/")
def home():
    """Render the chat interface."""
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat requests from the frontend."""
    user_message = request.json.get("message", "")
    if not user_message:
        return jsonify({"response": "Please enter a valid message."}), 400
        
    bot_response = get_response(user_message)
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)
