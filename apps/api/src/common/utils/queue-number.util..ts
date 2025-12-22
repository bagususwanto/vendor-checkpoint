function generateQueueNumber(format: string, sequence: number) {
  const now = new Date();

  const pad = (num: number, length: number) =>
    String(num).padStart(length, '0');

  const replacements = {
    YYYY: now.getFullYear(),
    MM: pad(now.getMonth() + 1, 2),
    DD: pad(now.getDate(), 2),
  };

  let result = format;

  // replace date tokens
  for (const key in replacements) {
    result = result.replaceAll(key, replacements[key]);
  }

  // handle sequence ###
  const match = result.match(/#+/);
  if (match) {
    const length = match[0].length;
    result = result.replace(match[0], pad(sequence, length));
  }

  return result;
}
