/* functions included in Script:
   function checkTransferSubscriptionValidParameter( Request, Response, ignoreNotSupportedErr )
   function checkTransferSubscriptionsError( Request, Response, ExpectedOperationResultsArray )
   function TransferSubscriptionsService( sourceSession, destinationSession, subscriptions )
*/

function TransferSubscriptionsService() {
    this.Name = "TransferSubscriptions";
    this.Subscriptions;
    this.Request = new UaTransferSubscriptionsRequest();;
    this.Response = new UaTransferSubscriptionsResponse();;
    this.UaStatus;

    /* Transfer the Subscriptions from SourceSession to DestinationSession
            Parameters: 
                - SourceSession: 
                - DestinationSession: 
                - SendInitialValues: 
                - SubscriptionIds: 
                - ServiceResult: 
                - OperationResults: 
            */
    this.Execute = function( args ) {
        // initial parameter validation
        if( !isDefined( args ) ) throw( "TransferSubscriptions::Execute() args missing." );
        if( !isDefined( args.SourceSession ) ) throw( "TransferSubscription::Execute() SourceSession missing." );
        if( !isDefined( args.DestinationSession ) ) throw( "TransferSubscription::Execute()  DestinationSession missing." );
        if (!isDefined( args.SubscriptionIds ) ) throw( "TransferSubscription::Execute() SubscriptionIds missing." );
        if( !isDefined( args.SendInitialValues ) ) args.SendInitialValues = true;
        if( !isDefined( args.SubscriptionIds.length ) ) args.SubscriptionIds = [ args.SubscriptionIds ];
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];

        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // Build the RequestHeader to run on SourceSession with the AuthenticationToken
        // from the DestinationSession.
        this.Request = new UaTransferSubscriptionsRequest();
        this.Response = new UaTransferSubscriptionsResponse();
        var destinationSession = isDefined( args.DestinationSession.Session )? args.DestinationSession.Session : args.DestinationSession;
        destinationSession.buildRequestHeader( this.Request.RequestHeader );
        var subIds = [];
        for( var i = 0; i < args.SubscriptionIds.length; i++ ) {
            this.Request.SubscriptionIds[i] = args.SubscriptionIds[i].SubscriptionId;
            subIds.push( args.SubscriptionIds[i].SubscriptionId );
        }
        this.Request.SendInitialValues = args.SendInitialValues;

        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = destinationSession.transferSubscriptions( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            var result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "SendInitialValues: " + this.Request.SendInitialValues + "; SubscriptionIds #" + this.Request.SubscriptionIds.length } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkTransferSubscriptionsError( this.Request, this.Response, args.OperationResults )
                else result = checkTransferSubscriptionValidParameter( this.Request, this.Response );
            }
        }
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    };//execute

}//TransferSubscriptionsService


// the service is expected to succeed
// all operations are expected to succeed
function checkTransferSubscriptionValidParameter( Request, Response, ignoreNotSupportedErr ) {
    var bSucceeded = true;
    // check in parameters
    if( arguments.length !== 2 ) {
        addError( "function checkTransferSubscriptionValidParameter(Request, Response): Number of arguments must be 2!" );
        bSucceeded = false;
    }
    // check for "not supported"
    if( Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNotImplemented || Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadServiceUnsupported  ) {
        addNotSupported( "TransferSubscription." );
        if( ignoreNotSupportedErr === undefined || ignoreNotSupportedErr == null ) ignoreNotSupportedErr = false;
        if( ignoreNotSupportedErr === false ) addError( "TransferSubscription is a required Service. Verify if this Conformance Unit should be selected for testing." );
        return( false );
    }
    // general checks state to check for Bad_SessionIdInvalid
    if( Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadSessionIdInvalid ) {
        addError( "TransferSubscription returned: Bad_SessionIdInvalid" );
        return( false );
    }
    
    // check operation results
    bSucceeded = bSucceeded && Assert.Equal( Request.SubscriptionIds.length, Response.Results.length, "TransferSubscriptions: number of Request.SubscriptionIds did not match the number of Response.Results" );
    for( var i = 0; i < Response.Results.length; i++ ) {
        if( !Response.Results[i].StatusCode.isGood() ) {
            addError( "TransferSubscriptions: Response.Results[" + i + "] expected 'Good' but received '" + Response.Results[i].StatusCode + "'.", Response.Results[i].StatusCode );
            bSucceeded = false;
        }
    }
    return bSucceeded;
}



// the service is expected to succeed
// one, some or all operations are expected to fail

// This function checks if the server returned the expected error codes
// Request is of Type UaDeleteSubscriptionsRequest
// Response is of Type UaDeleteSubscriptionsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkTransferSubscriptionsError( Request, Response, ExpectedOperationResultsArray ) {
    var result = true;
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkTransferSubscriptionsError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // check service result
    if( Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNotImplemented 
        || Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadServiceUnsupported )
    {
        addNotSupported( "TransferSubscription" );
        addError( "TransferSubscription is a required Service. Verify if this Conformance Unit should be selected for testing." );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.SubscriptionIds.length )
    {
        addError( "function checkTransferSubscriptionsError(): ExpectedOperationResultsArray[] must have the same size as Request.SubscriptionIds[]" );
        return( false );
    }
    if( result )
    {
        // check results        
        // check number of results
        if( Response.Results.length !== Request.SubscriptionIds.length )
        {
            addError( "The number of results does not match the number of SubscriptionIds." );
            addError( "SubscriptionIds.length=" + Request.SubscriptionIds.length + " Results.length=" + Response.Results.length );
            result = false;
        }
        else
        {   
            // check each result
            for( var i=0; i<Response.Results.length; i++ )
            {
                // StatusCode
                var bMatch = false;
                // check if result matches any of the expected status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ )
                {
                    if( Response.Results[i].StatusCode.StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode )
                    {
                        print( "\tTransferSubscription.Response.Results[" + i + "] = " + Response.Results[i].StatusCode, Response.Results[i].StatusCode );
                        bMatch = true;
                        break;
                    }
                }
                if( !bMatch )
                {
                    // check if result matches any of the accepted status codes
                    for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ )
                    {
                        if( Response.Results[i].StatusCode.StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode )
                        {
                            bMatch = true;
                            break;
                        }
                    }
                    if( bMatch )
                    {
                        addWarning( "Response.Results[" + i + "] = " + Response.Results[i].StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i].StatusCode );
                    }
                    else
                    {
                        addError( "Response.Results[" + i + "] = " + Response.Results[i].StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i].StatusCode );
                        result = false;
                    }
                }
            }
        }
    }
    return( result );
}