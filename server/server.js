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
let calculations = [];

//spin up server
app.listen( port, ()=>{
    console.log( 'server is up on:', port );
})

//routes
//GET route
app.get( '/calculations', ( req, res )=>{
    console.log('in GET route on server'); //REMOVE TEST DATA
    res.send( calculations );
})
//POST route
app.post( '/calculations', ( req, res )=>{
    console.log('in POST route on server', req.body); //REMOVE TEST DATA

    let total = '';
    let symbol = '';
    let calculations = req.body.calculations;
    
    for ( let i = 0; i < calculations.length; i++ ){
        if ( i == 0 ) {
            total = calculations[i][0];
            symbol = calculations[i][1];
        } else {
            total = doCalculation( total, calculations[i][0], symbol );
            //assign the symbol for the next go around
            symbol = calculations[i][1];
        }
    }
    req.body.answer = total;
    calculations.push( req.body );
    res.sendStatus( 200 );
})

function doCalculation ( firstNumber, secondNumber, symbol ) {
    console.log(`in doCalculation with:`, firstNumber, secondNumber, symbol ); //REMOVE TEST DATA
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
    console.log(answer) //REMOVE TEST DATA
    return answer;   
}

