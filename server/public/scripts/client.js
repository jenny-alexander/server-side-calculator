// global attributes
let operation;
let dataArray = [];

$( document ).ready( onReady );

 function onReady() {
     console.log(`in onReady`)
    $( '#clearInput' ).on( 'click', clearInput );
//     getCalculations();
     $( '#submitCalculationButton' ).on( 'click', submitCalculation );
     $( '.keypad' ).on( 'click', appendUserInputToScreen );
     //$( '.symbol' ).on( 'click', addOperationToArray );
 }
//  function addOperationToArray () {
//     //create a "behind-the-scenes" array with user input separated by ','.
//     dataArray.push()
    
//  }
function appendUserInputToScreen () {
    let value = $( '#userInput' ).val() + $( this ).data( 'value' );
    //TODO: Don't show = sign in input field
    $( '#userInput' ).val(value);
 }
function clearInput() {
    $( '#userInput' ).val('');
    operation ='';
}

// function getOperation() {
//     operation = $( this ).attr( 'id' );
//     //convert to numeric symbol
//     switch ( operation ) {
//         case 'add':
//             operation = '+';
//             break;
//         case 'subtract':
//             operation = '-';
//             break;
//         case 'multiply':
//             operation = '*';
//             break;
//         case 'divide':
//             operation = '/';
//             break;
//     }
// }
 function submitCalculation() {
     console.log(`in submitCalculation `)
    if ( checkInputFields() == false ) {
        alert( `Check input.` );
    } else {
        //take input and put into an array that will look like this:
        //[['32','+'],['20','*'],['5']]
        let userInput = $( '#userInput' ).val();
        console.log(userInput);
        //TODO: Replace this with a method where we pass the input and the chars to replalce
        //USE MATCH and then call method????
        let string1 = userInput.replaceAll( '+',',+,' );
        userInput = string1;
        let string2 = userInput.replaceAll( '-',',-,' );
        userInput = string2;
        let string3 = userInput.replaceAll( '*',',*,' );
        userInput = string3;
        let string4 = userInput.replaceAll( '/',',/,' );
        userInput = string4;
        
        //split the string at commas
        let inputArray = userInput.split( ',' );
        console.log( inputArray );
        //let array = ['30','+','20','*','5']; //250
        let calculationsArray = [];
        while ( inputArray.length ) {
            calculationsArray.push( inputArray.splice( 0, 2 ) );
        }
            
        console.log(calculationsArray);

        let objectToSend = {
            calculations: calculationsArray,
            answer: ''
        }
        // make AJAX POST with the object
        $.ajax({
            method: 'POST',
            url: '/calculations',
            data: objectToSend
        }).then( function( response ){
            //if successful, update the DOM
            console.log('back from server POST',response);
            getCalculations();
        }).catch( function( error ){
            alert('error submitting calculation');
            console.log('submit error:', error );
        })
    }
}
 function getCalculations() {
     $.ajax({
         method: 'GET',
         url: '/calculations'
     }).then( function( response ){
         console.log('back from server GET',response);
//         if ( response.length > 0 ){
//             //target <p> answer element
//             elAnswer = $( "#calcAnswer" );
//             elAnswer.empty();
//             elAnswer.append(response[response.length-1].answer);
            
//             //target list element 
//             let elList = $( '#calculationsOut' );
//             elList.empty();

//             for ( let i = 0; i < response.length; i++ ) {
//                 elList.append(
//                     `<li>${response[i].firstNum} ${response[i].operation} 
//                     ${response[i].secondNum} = ${response[i].answer}</li>`
//                 )
//             }
//         }
     }).catch( function( error ) {
         console.log( 'error:', error );
     })
 }

function checkInputFields() {
    //Check to make sure input fields are not empty
    if ( $( "#userInput" ).val() === '' ) {
        return false;
    } else {
        return true; //Input field contains values
    }

    //TODO:
    //1-Check that there is only 1 period
    //2-Check that there are at least 2 numbers in input field
    //2-Check that operators are between two sets of number...what to do with this:
    //"32+43+"

}