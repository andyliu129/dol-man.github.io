from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def base():
    return render_template("base.html")

@app.route("/rules")
def rules():
    return render_template("rules.html")

@app.route("/info")
def info():
    return render_template("info.html")

@app.route("/play")
def play():
    return render_template("play.html")