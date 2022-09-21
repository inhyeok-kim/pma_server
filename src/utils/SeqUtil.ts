export function makeSeq(){
    return btoa(Math.floor(Math.random()*100).toString(16).padEnd(2,'z') + new Date().getTime().toString(16));
}