from asyncio import subprocess
from curses.ascii import NUL
from flask import Flask
import subprocess
import psutil

app = Flask(__name__)

# サブプロセス
proc = None


@app.route("/")
def hello_world():
    proc = subprocess.Popen(
        ["omxplayer", "/home/motoki/idol.mp4"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    print(proc)

    return "<p>Hello, World!</p>"


@app.route("/stop")
def stop():
    pid = "not"

    pids = {
        p.info["name"]: p.info["pid"]
        for p in psutil.process_iter(attrs=["pid", "name"])
    }

    if ('omxplayer.bin' in pids):
        pid = pids['omxplayer.bin']
        p = psutil.Process(pid)
        p.terminate()

    ret = {"pid": pid}

    return ret
