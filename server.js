function abc() {
  console.log("HI");
}

setTimeout(abc, 1000);

setTimeout( () => console.log("BYE"), 2000 );


const arr = [1, 2, 3, 4, 5, 6]


arr.forEach( (x,i) => {
  if(i%3 == 0) {
    console.log(x)
  }
} 
)

// kjlkjklsjflkejlkwejrlwejrlk