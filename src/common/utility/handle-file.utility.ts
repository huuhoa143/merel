const fs = require('fs-extra');

export async function isExistFile(file) {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (error) => {
      if (error) return resolve(false);

      resolve(true);
    });
  });
}

export async function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) return reject(error);
      resolve(data);
    });
  });
}

export async function appendFile(pathFile, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(pathFile, data, (error) => {
      if (error) return reject(error);

      return resolve(true);
    });
  });
}

export async function writeFile(pathFile, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathFile, data, (error) => {
      if (error) return reject(error);

      return resolve(true);
    });
  });
}

export async function deleteFirstLine(pathFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathFile, 'utf8', (error, data) => {
      if (error) return reject(error);
      const linesExceptFirst = data.split('\n').slice(1).join('\n');
      fs.writeFile(pathFile, linesExceptFirst, (error) => {
        if (error) return reject(error);

        return resolve(true);
      });
    });
  });
}

export async function unlinkFile(pathFile) {
  return new Promise((resolve, reject) => {
    fs.unlink(pathFile, (error) => {
      if (error) return reject(error);

      resolve(true);
    });
  });
}
