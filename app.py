from asyncio import subprocess
from flask import Flask, render_template
import subprocess
import psutil
import os

app = Flask(__name__)


@app.route("/")
def home():
    return render_template('home.html')


@app.route("/list")
def list():
    if not os.path.isdir("./movies"):
        os.mkdir("movies")

    files = os.listdir("./movies")

    return {"files": files}


@app.route("/play/<filename>")
def play(filename):
    playerProcess = playerProcessCheck()

    print(playerProcess[0])

    if not playerProcess[0]:
        currentDir = os.getcwd()

        path = currentDir + "/movies/" + filename

        proc = subprocess.Popen(
            ["omxplayer", path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        ret = {"pid": proc.pid, "path": path}
    else:
        ret = {"error": "now playing"}

    return ret


@app.route("/stop")
def stop():
    ret = {"status": ""}
    playerProcess = playerProcessCheck()

    if playerProcess[0]:
        pid = playerProcess[1]
        p = psutil.Process(pid)
        p.terminate()
        ret = {"status": "ok"}
    else:
        ret = {"error": "not playing"}

    return ret


def playerProcessCheck():
    ret = False, -1

    pids = {
        p.info["name"]: p.info["pid"]
        for p in psutil.process_iter(attrs=["pid", "name"])
    }

    if ('omxplayer.bin' in pids):
        ret = True, pids['omxplayer.bin']

    return ret
