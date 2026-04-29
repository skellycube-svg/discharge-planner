from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")           # when someone visits the homepage...
def home():
    return render_template("index.html")   # ...show this page

@app.route("/medications")        # ← ADD THIS
def medications():
    return render_template("medications.html")

@app.route("/pickup")
def pickup():
    return render_template("pickup.html")

@app.route("/followup")
def followup():
    return render_template("followup.html")

if __name__ == "__main__":
    app.run(debug=True, port=5001)   # run the app locally