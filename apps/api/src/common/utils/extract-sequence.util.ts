export function extractSequence(queueNumber: string): number {
  // ambil angka paling belakang
  const match = queueNumber.match(/(\d+)(?!.*\d)/);
  return match ? parseInt(match[1], 10) : 0;
}
