const fs = require('fs');
const path = require('path');

const LIGHTS_FILE = path.join(__dirname, 'lights.json');
const DOORS_FILE = path.join(__dirname, 'doors.json');

function loadState(file, defaults) {
  try {
    if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(defaults));
    const data = fs.readFileSync(file, 'utf8').trim();
    return data ? JSON.parse(data) : defaults;
  } catch (err) {
    console.error('Error loading:', file, err);
    return defaults;
  }
}

function saveState(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Lights
function getLights() {
  console.log('Loading lights');
  return loadState(LIGHTS_FILE, {
    Luz1: false,
    Luz2: false,
    Luz3: false,
    Luz4: false,
    Luz5: false
  });
}

function updateLight(name, state) {
  const lights = getLights();
  if (lights[name] === undefined) return null;
  lights[name] = state;
  saveState(LIGHTS_FILE, lights);
  console.log('Updated lights:', lights);
  return lights;
}

// Doors
function getDoors() {
  console.log('Loading doors');
  return loadState(DOORS_FILE, {
    puerta1: false,
    puerta2: false,
    puerta3: false,
    puerta4: false
  });
}

function updateDoor(name, state) {
  console.log('Updating door:', name, state);
  const doors = getDoors();
  if (doors[name] === undefined) return null;
  doors[name] = state;
  saveState(DOORS_FILE, doors);
  return doors;
}

module.exports = { getLights, updateLight, getDoors, updateDoor };