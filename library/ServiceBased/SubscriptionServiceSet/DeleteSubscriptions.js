// A thin wrapper around the existing deleteSubscription function; now renamed to deleteSubscriptionDeprecated
function DeleteSubscriptionService( args ) {
    this.Name = "DeleteSubscription";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;
    this.uaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Parameters: 
            - SubscriptionIds: 
            - ServiceResult: 
            - OperationResults: 
*/
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "DeleteSubscriptionService.Execute() arguments not specified." );
        if(  isDefined( args.SubscriptionId ) )  args.SubscriptionIds = args.SubscriptionId;
        if( !isDefined( args.SubscriptionIds ) ) args.SubscriptionIds = [];
        if( !isDefined( args.SubscriptionIds.length ) ) args.SubscriptionIds = [ args.SubscriptionIds ];
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // delete subscription
        this.Request = new UaDeleteSubscriptionsRequest();
        this.Response = new UaDeleteSubscriptionsResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        var ids = [];
        for( var s=0; s<args.SubscriptionIds.length; s++ ) {
            if( args.SubscriptionIds[s].SubscriptionCreated ) {
                this.Request.SubscriptionIds[s] = args.SubscriptionIds[s].SubscriptionId;
                ids.push( args.SubscriptionIds[s].SubscriptionId );
            }
        }

        if( isDefined( args.PreHook ) ) args.PreHook();
        this.uaStatus = session.deleteSubscriptions( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, ServiceInfo: "SubscriptionIds #" + ids.length } );
            if( result ) {
                if( this.Response.ResponseHeader.ServiceResult.isGood() ) {
                    for( var s=0; s<this.Response.Results.length; s++ ) {
                        if( this.Response.Results[s].isGood() )
                            args.SubscriptionIds[s].SubscriptionCreated = false;
                    }
                }

                if( isDefined( args.OperationResults ) ) result = checkDeleteSubscriptionsError( this.Request, this.Response, args.OperationResults, args.SuppressMessaging );
                else result = checkDeleteSubscriptionsValidParameter( this.Request, this.Response, args.SuppressMessaging );
            }
        }
        else {
            addError( "session.deleteSubscription() returned bad status: " + this.uaStatus, this.uaStatus );
            result = false;
        }
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// Execute

}//DeleteSubscriptionService

// This function checks if the server returned the expected error codes
// Request is of Type UaDeleteSubscriptionsRequest
// Response is of Type UaDeleteSubscriptionsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkDeleteSubscriptionsError( Request, Response, ExpectedOperationResultsArray, suppressMessaging ) {
    var result = true;
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false );
    if( !isDefined( suppressMessaging ) ) suppressMessaging = false;
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.SubscriptionIds.length ) {
        if( Request.SubscriptionIds.length === 1 && !isDefined( ExpectedOperationResultsArray.length ) ) ExpectedOperationResultsArray = [ ExpectedOperationResultsArray ];
        else{
            addError( "function checkDeleteSubscriptionsError(): ExpectedOperationResultsArray[] must have the same size as Request.SubscriptionIds[]" );
            return( false );
        }
    }
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
                    print( "\tDeleteSubscription.Response.Results[" + i + "] = " + Response.Results[i], Response.Results[i] );
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
                if( bMatch ) addLog( "Response.Results[" + i + "] = " + Response.Results[i] + ". Any one of the following would also be acceptable: " + ExpectedOperationResultsArray[i].ExpectedResults.toString(), Response.Results[i] );
                else {
                    addError( "Response.Results[" + i + "] = " + Response.Results[i] + "; but one of the following was expected: " + ExpectedOperationResultsArray[i].ExpectedResults.toString(), Response.Results[i] );
                    result = false;
                }
            }
        }
    }
    return( result );
}

function checkDeleteSubscriptionsValidParameter( Request, Response, suppressMessaging ) {
    var bSucceeded = true;
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // no need to check if valid if the overall service call failed.
    if( !isDefined( suppressMessaging ) ) suppressMessaging = false;

    // as this is a valid parameter test we don't expect any diagnositcinfo
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "DeleteSubscriptionsResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
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
            if( Response.Results[i].isNotGood() ) {
                addError( "DeleteSubscriptions.Response.Results[" + i + "] is not good: " + Response.Results[i], Response.Results[i] );
                bSucceeded = false;
            }             
        }
    }
    return bSucceeded;
}