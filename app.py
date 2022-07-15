from asyncio import subprocess
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import subprocess
import psutil
import os

CURRENT_DIR = os.getcwd()
UPLOAD_FOLDER = CURRENT_DIR + '/movies/'
ALLOWED_EXTENSIONS = {'mp4'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/list')
def list():
    if not os.path.isdir('./movies'):
        os.mkdir('movies')

    files = os.listdir('./movies')

    return {'files': files}


@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return {'error': 'no file part'}
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return {'error': 'no selected file'}
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return {'status': 'ok'}

    return ''


@app.route('/play/<filename>')
def play(filename):
    playerProcess = player_process_check()

    if not playerProcess[0]:
        path = UPLOAD_FOLDER + filename

        proc = subprocess.Popen(
            ['omxplayer', path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        ret = {'pid': proc.pid, 'path': path}
    else:
        ret = {'error': 'now playing'}

    return ret


@app.route('/stop')
def stop():
    ret = {'status': ''}
    playerProcess = player_process_check()

    if playerProcess[0]:
        pid = playerProcess[1]
        p = psutil.Process(pid)
        p.terminate()
        ret = {'status': 'ok'}
    else:
        ret = {'error': 'not playing'}

    return ret


def player_process_check():
    ret = False, -1

    pids = {
        p.info['name']: p.info['pid']
        for p in psutil.process_iter(attrs=['pid', 'name'])
    }

    if ('omxplayer.bin' in pids):
        ret = True, pids['omxplayer.bin']

    return ret


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
