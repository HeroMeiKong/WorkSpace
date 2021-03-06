// function add(x: {a: string}[]): number;
// function add(x: any): any {
//   return x
// }

// var c = add([{a: 'a'},{a: 'ss'}])
// console.log(c)
// function min(a: number,b: number): number {
//   if(a<b){
//     return a;
//   } else {
//     return b;
//   }
// }

// var c = min(1,2);
// console.log(c);
enum Color {Red = 1 , Green, Yellow = 4}
let a = Color[4]
console.log(a)

// let suits = ["hearts", "spades", "clubs", "diamonds"];
// function pickCard(x: {suit: string; card: number; }[]): number;
// function pickCard(x: number): {suit: string; card: number; };
// function pickCard(x: any): any {
//     // Check to see if we're working with an object/array
//     // if so, they gave us the deck and we'll pick the card
//     if (typeof x == "object") {
//         let pickedCard = Math.floor(Math.random() * x.length);
//         return pickedCard;
//     }
//     // Otherwise just let them pick the card
//     else if (typeof x == "number") {
//         let pickedSuit = Math.floor(x / 13);
//         return { suit: suits[pickedSuit], card: x % 13 };
//     }
// }

// let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
// let pickedCard1 = myDeck[pickCard(myDeck)];
// console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);