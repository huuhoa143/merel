const {
  writeFile,
  readFile,
  unlinkFile,
  isExistFile,
} = require('./handle-file.ultility');
const path = require('path');

export async function writeLogError(content, type) {
  const { id, errorMessage, errorCode } = content;
  const pathFile = path.join(__dirname, `../../../log_error_${id}.txt`);

  console.log({ pathFile });
  const mainContent = `${type}|${id}|${errorMessage}|${errorCode}`;
  return writeFile(pathFile, mainContent);
}

export async function readLogError(id) {
  const pathFile = path.join(__dirname, `../../../log_error_${id}.txt`);

  const checkExist = await isExistFile(pathFile);

  if (checkExist) {
    let content = await readFile(pathFile);

    content = content.split('|');

    await unlinkFile(pathFile);

    console.log('Delete log error file');

    return {
      type: content[0],
      message: content[2],
      code: content[3],
    };
  }

  return {
    type: '',
    message: '',
    code: '',
  };
}
