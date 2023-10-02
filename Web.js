export {readTextFile}

// ✅ read file ASYNCHRONOUSLY
async function readTextFile(filename) {
  const response = await fetch(filename);
  const data = await response.text();
  return data;
}
