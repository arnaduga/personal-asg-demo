function consumeCPU(delay) {
  return new Promise((resolve) => {
    const endTime = Date.now() + delay * 1000;
    while (Date.now() < endTime) {
      Math.random();
    }
  });
}

async function asyncCall() {
  console.log("calling");
  const result = await consumeCPU(5);
  const result1 = consumeCPU(5);
  const result2 = consumeCPU(5);
  const result3 = consumeCPU(5);
  const result4 = consumeCPU(5);
  Promise.all([result1, result2, result3, result4]);
  console.log(result);
}

asyncCall();
