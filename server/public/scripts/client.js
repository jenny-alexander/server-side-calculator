$( document ).ready( onReady );

 function onReady() {
     console.log(`in onReady`);
     
     $( '#clearInput' ).on( 'click', clearInput );
     $( '.keypad' ).on( 'click', appendUserInputToScreen );
     $( '#submitCalculationButton' ).on( 'click', submitCalculation );
     
     getCalculations();
 }

function appendUserInputToScreen () {
    //Check to see if the user hit the '=' key. If yes, don't show the equal sign in the
    //input field.
    let value = '';
    if ( $( this ).data( 'value' ) != '=' ) {  
        value = $( '#userInput' ).val() + $( this ).data( 'value' );
        $( '#userInput' ).val(value);
    } else {
        //Don't show = sign in input field
        value = $( '#userInput' ).val();
    }
 }
function clearInput() {
    $( '#userInput' ).val('');
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
         console.log('back from server GET',response); //TODO REMOVE TEST DATA
         if ( response.length > 0 ){
            //target <p> answer element
            elAnswer = $( "#calcAnswer" );
            elAnswer.empty();
            elAnswer.append(response[response.length-1].answer);
            
            //target list element 
            let elList = $( '#calculationsOut' );
            elList.empty();

            for ( let i = 0; i < response.length; i++ ) {
                elList.append(`<li>${response[i].calculations} = ${response[i].answer}</li>`)
            }
            //clear input fields for next entry
            //clearInput();
         }
     }).catch( function( error ) {
         console.log( 'error:', error ); //TODO REMOVE TEST DATA
     })
 }

//TODO:
//1-Check that there is only 1 period
//2-Check that there are at least 2 numbers in input field
//2-Check that operators are between two sets of number...what to do with this:
//"32+43+"
function checkInputFields() {
    //Check to make sure input fields are not empty
    if ( $( "#userInput" ).val() === '' ) {
        return false;
    } else {
        return true; //Input field contains values
    }
}
