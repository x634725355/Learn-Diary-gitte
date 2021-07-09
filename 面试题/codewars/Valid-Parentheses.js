

function validParentheses(parens){
    return parens.match(/(/);    
}

console.log('1', validParentheses("()"));
console.log('2', validParentheses(")(()))"));
console.log('3', validParentheses("("));
console.log('4', validParentheses("(())((()())())"));