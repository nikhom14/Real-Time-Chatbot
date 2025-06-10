from flask import Flask, request, jsonify, render_template_string, send_file
from logic import get_response
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def home():
    with open("index.html") as f:
        return render_template_string(f.read())

@app.route("/styles.css")
def style():
    return send_file("styles.css", mimetype="text/css")

@app.route("/scripts.js")
def scripts():
    return send_file("scripts.js", mimetype="application/javascript")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_msg = data.get("message", "")
    bot_msg = get_response(user_msg)
    timestamp = datetime.now().strftime("%H:%M:%S")
    return jsonify({"response": bot_msg, "time": timestamp})

if __name__ == "__main__":
    app.run(debug=True)