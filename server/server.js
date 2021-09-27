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

    while ( inputArray.length ) {
        tempCalcArray.push( inputArray.splice( 0, 2 ) );
    }
    
    for ( let i = 0; i < tempCalcArray.length; i++ ){
        
        if ( i == 0 ) {
            total = tempCalcArray[i][0];
            symbol = tempCalcArray[i][1];
        } else {
            total = parseFloat(doCalculation( total, tempCalcArray[i][0], symbol ) ).toFixed(2);
            //assign the symbol for the next go around
            symbol = tempCalcArray[i][1];
        }
    }
    req.body.answer = total;
    calculationsArray.push( req.body );
    res.sendStatus( 200 );
})

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
//need to convert intput field from front-end (client.js) to
//the format to be used here on server
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
function doOrderOfOperations( inputString ) {
    let regex = /(\*)|(\/)/;
    
    if (regex.test(inputString)) {
      let newInput = convertDataForServer(inputString);
      let stringArray = newInput.split(",");
      let multiplyIndex = stringArray.findIndex((operator) => operator === "*"); //1
      let divideIndex = stringArray.findIndex((operator) => operator === "/");
      let indexToSearch;
    
      //there is something to calculate
      while (multiplyIndex >= 0 || divideIndex >= 0) {
        let newCalc = [];
        let pushCalc = 0;
        
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
        newCalc = stringArray.splice(indexToSearch - 1, indexToSearch);
        pushCalc = doCalculation(newCalc[0], newCalc[2], newCalc[1]);
        stringArray.splice(indexToSearch - 1, 0, pushCalc.toString());
        //recalculate to decide if we should do another round of calculations for * and /
        multiplyIndex = stringArray.findIndex((operator) => operator === "*");
        divideIndex = stringArray.findIndex((operator) => operator === "/");
    
        inputString = "";
        for (let i = 0; i < stringArray.length; i++) {
          inputString += stringArray[i];
        } //end for
        console.log(`inputString is now:`, inputString);
      } //end while
    
      console.log(`inputString after all processing is:`, inputString);
    } //end if
    return inputString;
}
