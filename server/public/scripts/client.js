//Globals
let calculationList = [];

$( document ).ready( onReady );

 function onReady() {
     console.log(`in onReady`);
     //Capture click events
     $( '#clearInput' ).on( 'click', clearInput );
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
function clearInput() {
    $( '#userInput' ).val('');
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
    if ( checkInputFields() == false ) {
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
            clearInput();
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
            //target <p> answer element
            elAnswer = $( "#calcAnswer" );
            elAnswer.empty();
            elAnswer.append(response[response.length-1].answer);
            
            //create the 'clear calculation history' button
            let elClearButton = $( '#clearHistory' );
            elClearButton.empty();
            elClearButton.append( `<button id="clearHistoryButton">Clear Calculation History</button>`);

            //target list element to show calculation in list format
            let elList = $( '#calculationsOut' );
            elList.empty();
            //append the calculation to the list
            for ( let i = 0; i < response.length; i++ ) {
                elList.append(`<li id="listItem">${response[i].calculations} = ${response[i].answer}</li>`)

                //Push each response record into global array
                calculationList = []; //clear it out
                calculationList.push( response );
            }
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
//1-Check that there is only 1 period between numer and mathematical symbol
//2-Check that there are at least 2 numbers in input field
//3-Check that operators are between two sets of number...what to do with this:
//"32+43+"
//4-Check that user didn't enter anything but digits and 4 mathematical symbols
//5-Format output to ?? decimal places
function checkInputFields() {
    //Check to make sure input fields are not empty
    if ( $( "#userInput" ).val() === '' ) {
        return false;
    } else {
        return true; //Input field contains values
    }
}
