const stepArray = new Array(10).fill(1).map((p, index) => {
  if (index === 3 || index === 6) {
    return { dance: true };
  }

  return { dance: false };
});

console.log("step", stepArray);

const child = [];

function main() {
    if (child[child.length - 1] >= 10) {
        return child;
    }

    
    
}

console.log(main());