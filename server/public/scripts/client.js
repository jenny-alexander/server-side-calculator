//Globals
let calculationList = [];

$( document ).ready( onReady );

 function onReady() {
     console.log(`in onReady`);
     //Capture click events
     $( '#clearInput' ).on( 'click', clearUserInput );
     $( '.keypad' ).on( 'click', appendUserInputToScreen );
     $( '#submitCalculationButton' ).on( 'click', submitCalculation );
     $( '#outputDiv' ).on( 'click', '#clearHistoryButton', deleteHistory );
     $( '#calculationsOut' ).on( 'click', '#listItem',showCalculationFromList );
     getCalculations();
 }
function showCalculationFromList() {
    let index = $( this ).index();
    let calcToShow = calculationList[0].slice( index, index + 1 );
    $( '#userInput' ).val( calcToShow[0].calculations + '=' + calcToShow[0].answer );
    showAnswer(calcToShow[0].answer );
}
function appendUserInputToScreen () {
    //Check to see if the user hit the '=' key. If yes, don't show the equal sign in the
    //input field.
    let value = '';
    if ( $( this ).data( 'value' ) != '=' ) {  
        value = $( '#userInput' ).val() + $( this ).data( 'value' );
        $( '#userInput' ).val( value );
    } else {
        //Don't show = sign in input field
        value = $( '#userInput' ).val();
    }
 }
function deleteHistory () {
        // make AJAX POST with the object
        $.ajax({
            method: 'DELETE',
            url: '/calculations',
        }).then( function( response ){
            //if successful, update the DOM           
            console.log('back from server DELETE',response); //TODO REMOVE TEST DATA
            getCalculations();
            //clearInput();
        }).catch( function( error ){
            alert('error deleting calculation history');
            console.log('submit error:', error );
        })
}
 function submitCalculation() {
    if ( isUserInputValid( $( '#userInput' ).val() ) == false ) {
        alert( `Check input.` );
    } else {
        let objectToSend = {
            calculations: $( '#userInput' ).val(),
            answer: ''
        }
        // make AJAX POST with the object
        $.ajax({
            method: 'POST',
            url: '/calculations',
            data: objectToSend
        }).then( function( response ){
            //if successful, update the DOM           
            console.log('back from server POST',response); //TODO REMOVE TEST DATA
            getCalculations();
            clearUserInput();
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
         console.log( 'back from server GET',response ); //TODO REMOVE TEST DATA
         if ( response.length > 0 ){
            showAnswer(response[response.length-1].answer);
            clearCalcHistory();
            appendCalcToList( response );
          } else {
            //   Get the children of the DOM container and loop through the children & empty out
            let children = $( "#outputDiv" ).children();
            for( let i = 0; i < children.length; i++ ) {
                $(children[i]).empty();
            }
         }
     }).catch( function( error ) {
         console.log( 'error:', error ); //TODO REMOVE TEST DATA
     })
 }

//TODO:
//1-Do I have to do order of operations? See how much work on Sunday 09/26
//2-How to check if user entered different symbols in a row?
function isUserInputValid( userInput ) {
    let isInputGood = true;
    let plusCheck = /(\+)\1/;
    let minusCheck = /(\-)\1/;
    let timesCheck = /(\*)\1/;
    let divideCheck = /(\/)\1/;
    let dotCheck = /(\.)\1/;

    //check that first character/digit is a number
    if ( !/^\d/.test( userInput ) ) {
        isInputGood = false;
    } 
    //check that last character/digit is a number
    if ( !/[0-9]$/.test( userInput ) ) {
        isInputGood = false;
    } 
    //check that two symbols were not entered in a row
    if( plusCheck.test( userInput ) || minusCheck.test( userInput ) || 
        timesCheck.test( userInput ) || divideCheck.test( userInput ) ||
        dotCheck.test( userInput ) ) {
        isInputGood = false;
    }              
    return isInputGood;
}
//show calculation answer under the calculator
function showAnswer ( answer ) {
    let elAnswer = $( "#calcAnswer" );
    elAnswer.empty();
    elAnswer.append( `Answer: ` + answer );
}
//clear user input
function clearCalcHistory() {
    let elClearButton = $( '#clearHistory' );
    elClearButton.empty();
    elClearButton.append( `<button id="clearHistoryButton">Clear Calculation History</button>`);
}
function clearUserInput() {
    $( '#userInput' ).val('');
}
function appendCalcToList( response ) {
    //target list element to show calculation in list format
    let elList = $( '#calculationsOut' );
    elList.empty();
    //append the calculation to the list
    for ( let i = 0; i < response.length; i++ ) {
        elList.append(`<li id="listItem">${response[i].calculations} = ${response[i].answer}</li>`)
        //Push each response record into global array. We access the global array when the user
        //clicks on the historical list of calculations in order to display one of them in the
        //input field of the calculator;
        calculationList = []; //clear it out
        calculationList.push( response );
    }
}
