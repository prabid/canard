const generateId = () => {
  return Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase();
};

const shuffle = (array) => {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function onlyUnique(array) {
  return [...new Set(array)];
}

module.exports = { generateId, shuffle, onlyUnique };
