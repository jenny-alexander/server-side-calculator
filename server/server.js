// requires
const express = require( 'express' );
const app = express();
/// - NEEDED for POST - ///
const bodyparser = require( 'body-parser' );
//uses
// server static files
app.use( express.static( 'server/public' ) ); //base folder for files
/// - NEEDED for POST - ///
app.use( bodyparser.urlencoded( { extended: true } ) );
//globals
const port = 5000;
let calculationsArray = [];
//spin up server
app.listen( port, ()=>{
    console.log( 'server is up on:', port );
})
//routes
//GET route
app.get( '/calculations', ( req, res )=>{
    res.send( calculationsArray );
})
//DELETE route
app.delete( '/calculations', ( req, res )=>{
    while(calculationsArray.length > 0) {
        calculationsArray.pop();
    }
    res.send( calculationsArray );
})
//POST route
app.post( '/calculations', ( req, res )=>{
    let total = 0;
    let symbol = '';
    let calculations = String(req.body.calculations);
    
    //handle the '*' and '/' before calculating the entry from left-to-right.
    //only do this if there is more than one calculation to make (check length)
    if ( calculations.length > 2 ){
        calculations = doOrderOfOperations( calculations );
    }

    //need to convert intput field from front-end (client.js) to
    //the format to be used here on server
    let userInput = convertDataForServer( calculations );
    //split the string at commas
    let inputArray = userInput.split( ',' );
    let tempCalcArray = [];
    //divide up the input into an array of arrays containing a number and symbol
    //the last array element will always only have 1 digit
    //example: [ ['2','+'],['5','*'],['7']
    while ( inputArray.length ) {
        tempCalcArray.push( inputArray.splice( 0, 2 ) );
    }

    for ( let i = 0; i < tempCalcArray.length; i++ ){
        //first time through, set the total to the first number and the symbol as the first symbol
        if ( i == 0 ) {
            total = tempCalcArray[i][0];
            symbol = tempCalcArray[i][1];
        } else {
            //total = parseFloat(doCalculation( total, tempCalcArray[i][0], symbol ) ).toFixed(2);
            total = doCalculation( total, tempCalcArray[i][0], symbol ) ;
            //assign the symbol for the next go around
            symbol = tempCalcArray[i][1];
        }
    }
    req.body.answer = parseFloat(total).toFixed(2);
    calculationsArray.push( req.body );
    res.sendStatus( 200 );
})
/**
 * Calculate the answer of the two numbers passed in according their symbol(operator)
 */
function doCalculation ( firstNumber, secondNumber, symbol ) {
    let answer = 0;

    //convert strings to numbers for calculations
    firstNumber = Number( firstNumber );
    secondNumber = Number( secondNumber );
    //do calculation
    switch ( symbol ) {
        case ( '+' ):
            answer = firstNumber + secondNumber;
            break;
        case ( '-' ):
            answer = firstNumber - secondNumber;
            break;
        case ( '*' ):
            answer = firstNumber * secondNumber;
            break;
        case ( '/' ):
            answer = firstNumber / secondNumber;
            break;
    } 

    return answer;   
}
//need to convert input field from front-end (client.js) to
//the format to be used here on server. It needs to be comma-separated 
//in order to split it into an array.
//inputString before: 3*9+27
//inputString after: '3','*','9','+','27'
function convertDataForServer( inputString ) {
        let tempString = '';

        //replace +
        tempString = inputString.replace(/\+/g, ',+,');
        inputString = tempString;  
        //replace -
        tempString = inputString.replace( /\-/g,',-,' );
        inputString = tempString;
        //replace *
        tempString = inputString.replace( /\*/g,',*,' );
        inputString = tempString;
        //replace /
        tempString = inputString.replace( /\//g,',/,' );
        inputString = tempString;    
    
        return inputString;
}
/**
 * The first time around, I didn't do order of operations since it wasn't explicitly required
 * in the assignment instructions. However, after seeing that my son's very basic calculator
 * could do order of operations, I decided to have a go and build it. Since it was already in 
 * place (and working), I used doCalculation function as my scaffolding and built it off of that. 
 */
function doOrderOfOperations( inputString ) {
    let regex = /(\*)|(\/)/;
    
    if (regex.test(inputString)) {
      let newInput = convertDataForServer(inputString);
      let stringArray = newInput.split(",");
      let multiplyIndex = stringArray.findIndex((operator) => operator === "*"); //1
      let divideIndex = stringArray.findIndex((operator) => operator === "/");
      let indexToSearch;
    
      //there is something to calculate, so figure out what to do first 
      while (multiplyIndex >= 0 || divideIndex >= 0) {
        let newCalc = [];
        let pushCalc = 0;
        //figure out if the next operation in the string is a multiplication
        //or a division
        if ( multiplyIndex >= 0 ) {
          if ( divideIndex >= 0 ) {
            if ( multiplyIndex < divideIndex ) {
              indexToSearch = multiplyIndex;
            } else {
              indexToSearch = divideIndex;
            }
          } else {
            indexToSearch = multiplyIndex;
          }
        }
        if ( divideIndex >= 0 ) {
          if ( multiplyIndex >= 0 ) {
            if ( divideIndex < multiplyIndex ) {
              indexToSearch = divideIndex;
            } else {
              indexToSearch = multiplyIndex;
            }
          } else {
            indexToSearch = divideIndex;
          }
        }
        //get the digit to the left and to the right of the symbol
        newCalc = stringArray.splice(indexToSearch - 1, 3);
        //push this info to the doCalculation to get the answer
        pushCalc = doCalculation(newCalc[0], newCalc[2], newCalc[1]);
        //insert the answer back into the array
        stringArray.splice(indexToSearch - 1, 0, pushCalc.toString());
        //recalculate to decide if we should do another round of calculations for * and /
        multiplyIndex = stringArray.findIndex((operator) => operator === "*");
        divideIndex = stringArray.findIndex((operator) => operator === "/");
        //reformat the remaining calculation into a string to be processed again
        inputString = "";
        for (let i = 0; i < stringArray.length; i++) {
          inputString += stringArray[i];
        } //end for
      } //end while
    } //end if
    return inputString;
}
