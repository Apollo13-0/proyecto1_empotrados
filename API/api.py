from flask import Flask, request, jsonify, send_file
import os
import json
import hashlib
import uuid
import subprocess

app = Flask(__name__)

USERS_FILE = 'users.json'
LIGHTS_FILE = 'lights.json'
DOORS_FILE = 'doors.json'
PIC_DIR = 'fotos'
PIC_PATH = os.path.join(PIC_DIR, 'ultima.jpg')

def ensure_file(path, default):
    if not os.path.exists(path):
        with open(path, 'w') as f:
            json.dump(default, f)

# Users
def load_users():
    ensure_file(USERS_FILE, {})
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def hash_password(password, salt=None):
    if salt is None:
        salt = uuid.uuid4().hex
    h = hashlib.sha256()
    h.update((salt + password).encode('utf-8'))
    return salt, h.hexdigest()

def register_user(username, password):
    users = load_users()
    if username in users:
        return {"success": False, "message": "Usuario ya existe"}
    salt, hash_ = hash_password(password)
    users[username] = {"salt": salt, "hash": hash_}
    save_users(users)
    return {"success": True, "message": "Usuario registrado"}

def authenticate_user(username, password):
    users = load_users()
    user = users.get(username)
    if not user:
        return {"success": False, "message": "Usuario no encontrado"}
    _, hash_ = hash_password(password, user['salt'])
    if hash_ == user['hash']:
        return {"success": True, "message": "Autenticación exitosa"}
    return {"success": False, "message": "Contraseña incorrecta"}

def load_state(file, defaults):
    ensure_file(file, defaults)
    with open(file, 'r') as f:
        return json.load(f)

def save_state(file, data):
    with open(file, 'w') as f:
        json.dump(data, f, indent=2)

# Lights & doors
def update_light(name, state):
    lights = load_state(LIGHTS_FILE, {
        "Luz1": False, "Luz2": False, "Luz3": False, "Luz4": False, "Luz5": False
    })
    if name not in lights:
        return None
    lights[name] = state
    save_state(LIGHTS_FILE, lights)
    return lights

def update_door(name, state):
    doors = load_state(DOORS_FILE, {
        "puerta1": False, "puerta2": False, "puerta3": False, "puerta4": False
    })
    if name not in doors:
        return None
    doors[name] = state
    save_state(DOORS_FILE, doors)
    return doors

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    result = register_user(data['username'], data['password'])
    return jsonify(result), 201 if result['success'] else 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    result = authenticate_user(data['username'], data['password'])
    return jsonify(result), 200 if result['success'] else 401

@app.route('/lights/<room>', methods=['POST'])
def lights(room):
    data = request.json
    result = update_light(room, data['state'])
    if result:
        return jsonify({"success": True, "lights": result})
    return jsonify({"success": False, "message": "Luz no encontrada"}), 404

@app.route('/doors/<door>', methods=['POST'])
def doors(door):
    data = request.json
    result = update_door(door, data['state'])
    if result:
        return jsonify({"success": True, "doors": result})
    return jsonify({"success": False, "message": "Puerta no encontrada"}), 404

@app.route('/picture', methods=['GET'])
def picture():
    os.makedirs(PIC_DIR, exist_ok=True)
    try:
        subprocess.run(["fswebcam", "-r", "640x480", "--jpeg", "90", "-D", "1", PIC_PATH], check=True)
        return 'Foto tomada y guardada como ultima.jpg', 200
    except subprocess.CalledProcessError as e:
        return 'Error al tomar la foto', 500

@app.route('/last-picture', methods=['GET'])
def last_picture():
    if os.path.exists(PIC_PATH):
        return send_file(PIC_PATH, mimetype='image/jpeg')
    return 'No hay ninguna foto almacenada', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)