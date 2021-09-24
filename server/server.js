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
    console.log('in GET route on server');
    res.send( calculations );
})
//POST route
app.post( '/calculations', ( req, res )=>{
    console.log('in POST route on server', req.body);
    let total = '';
    let symbol = '';
    //do calculations with req.body here
    //looks like this:
    //{ calculations: [ [ '85', '+' ], [ '3', '+' ], [ '9' ] ], answer: '' }
    
    let calculations = [];
    calculations = req.body.calculations;
    console.log(calculations);
    for ( let i = 0; i < calculations.length; i++ ){

        if ( i == 0 ) {
            total = calculations[i][0];
            symbol = calculations[i][1];
            console.log( `total is:`,total,`and symbol is:`,symbol );
        } else {
            total = doCalculation( total, calculations[i][0], symbol );
            //assign the symbol for the next go around

            symbol = calculations[i][1];
            console.log( `total from else is:`, total );
        }
    }

    //req.body.answer = doCalculation( '1' , '4', '+' ); <--this works


    calculations.push( req.body );
    res.sendStatus( 200 );
})

function doCalculation ( firstNumber, secondNumber, symbol ) {
    console.log(`in doCalculation with:`, firstNumber, secondNumber, symbol );
    let answer = 0;

    //convert strings to numbers
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
    console.log(answer)
    return answer;   
}

