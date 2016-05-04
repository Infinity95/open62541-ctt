/*    This class object is responsible for calling the SetPublishingMode() service and for also
      performing any validation etc. This is a quick-use class.

    Revision History
        16-Oct-2009 NP: Initial Version
        06-Mar-2015 NP: Added message suppression option
*/
function SetPublishingModeService( args ) {

    this.Name = "SetPublishingMode";
    this.Request  = null;
    this.Response = null;
    this.Session  = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    // Sets the publishing mode of the specified subscriptionIds
    // Parameters:
    //   SubscriptionIds    - [REQUIRED] an array/single instance of an integer (subscriptionId)
    //   PublishingEnabled  - [REQUIRED] true/false
    //   ServiceResult - an array of ExpectedAndAcceptedErrors
    //   OperationResults - an array of ExpectedAndAcceptedErrors
    //   PreHook            - a function pointer (delegate) to call a method prior to invocation
    //   SuppressMessaging  - (true/false) print/hide messages
    this.Execute = function( args ) { //subscriptions, publishingEnabled, expectedErrors, errorExpected, preHook )
        if( !isDefined( args ) ) throw( "SetPublishingMode.js::Execute() args not specified." );
        if( !isDefined( args.SubscriptionIds ) ) throw( "SetPublishingMode::Execute() SubscriptionIds not specified." );
        if( !isDefined( args.SubscriptionIds.length ) ) args.SubscriptionIds = [ args.SubscriptionIds ];
        if( !isDefined( args.PublishingEnabled ) ) throw( "SetPublishingMode::Execute() PublishingEnabled not specified." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];
        var result; // return flag

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        this.Request  = new UaSetPublishingModeRequest();
        this.Response = new UaSetPublishingModeResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.Request.PublishingEnabled = args.PublishingEnabled;

        // specify the subscriptions to alter
        var subIds = [];
        for( var s=0; s<args.SubscriptionIds.length; s++ ) {
            this.Request.SubscriptionIds[s] = args.SubscriptionIds[s].SubscriptionId;
            subIds.push( args.SubscriptionIds[s].SubscriptionId );
        }// for s...

        // call any "pre hook" function
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.setPublishingMode( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "PublishingEnabled=" + this.Request.PublishingEnabled + "; SubscriptionIds #" + this.Request.SubscriptionIds.length } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkSetPublishingModeError( this.Request, this.Response, args.OperationResults );
                else result = checkSetPublishingModeValidParameter( this.Request, this.Response );
    
                // go through and update the subscriptions that were successfully modified.
                for( var r=0; r<this.Response.Results.length; r++ ) {
                    if( this.Response.Results[r].isGood() ) {
                        if( isDefined( args.SubscriptionIds[r] ) ) {
                            args.SubscriptionIds[r].PublishingEnabled = args.PublishingEnabled;
                        }
                    }
                }
            }
        }
        else {
            addError( "SetPublishingMode() failed, status: " + this.UaStatus, this.UaStatus );
            result = false;
        }
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// Execute

}//class



// the service is expected to succeed
// all operations are expected to succeed
function checkSetPublishingModeValidParameter( Request, Response ) {
    var bSucceeded = true;
    // check in parameters
    if( arguments.length !== 2 ) {
        addError( "function checkSetPublishingModeValidParameter(Request, Response): Number of arguments must be 2!" );
        return false;
    }
    // as this is a valid parameter test we don't expect any diagnositcinfo        
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "SetPublishingModeResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
        bSucceeded = false;
    }
    // check results        
    // check number of results
    if( Response.Results.length !== Request.SubscriptionIds.length ) {
        addError( "The number of results does not match the number of SubscriptionIds." );
        addError( "SubscriptionIds.length = " + Request.SubscriptionIds.length + " Results.length = " + Response.Results.length );
        bSucceeded = false;
    }
    else {        
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // status code
            if( Response.Results[i].isNotGood() ) {
                addError( "Results[" + i + "] is not good: " + Response.Results[i], Response.Results[i] );
                bSucceeded = false;
            }             
        }
    }
    return bSucceeded;
}




// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaSetPublishingModeRequest
// Response is of Type UaSetPublishingModeResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkSetPublishingModeError( Request, Response, ExpectedOperationResultsArray ) {
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkSetPublishingModeError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.SubscriptionIds.length ) {
        addError( "function checkSetPublishingModeError(): ExpectedOperationResultsArray[] must have the same size as Request.SubscriptionIds[]. SubscriptionIds: " + Request.SubscriptionIds.length + "; Expected: " + ExpectedOperationResultsArray.length );
        return( false );
    }  
    // check results
    // check number of results
    if( Response.Results.length !== Request.SubscriptionIds.length ) {
        addError( "The number of results does not match the number of SubscriptionIds." );
        addError( "SubscriptionIds.length=" + Request.SubscriptionIds.length + " Results.length=" + Response.Results.length );
        result = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // StatusCode
            var bMatch = false;
            // check if result matches any of the expected status codes
            for( var j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                if( Response.Results[i].StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( Response.Results[i].StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "Response.Results[" + i + "] = " + Response.Results[i] + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i] );
                }
                else {
                    addError( "Response.Results[" + i + "] = " + Response.Results[i] + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i] );
                    result = false;
                }
            }
        }
    }
    return( result );
}