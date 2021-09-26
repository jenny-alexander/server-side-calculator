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
    console.log('in GET route on server'); //REMOVE TEST DATA
    res.send( calculationsArray );
})

app.delete( '/calculations', ( req, res )=>{
    console.log('in DELETE route on server')
    while(calculationsArray.length > 0) {
        calculationsArray.pop();
    }
    res.send( calculationsArray );
})
//POST route
app.post( '/calculations', ( req, res )=>{
    console.log('in POST route on server', req.body); //REMOVE TEST DATA

    let total = 0;
    let symbol = '';
    let calculations = String(req.body.calculations);
    
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
