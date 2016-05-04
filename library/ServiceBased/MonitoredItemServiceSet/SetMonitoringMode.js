/*  This object is responsible for calling and processing calls to the SetMonitoringMode() Service.
    Object definition
        Properties:
            Session      - a reference to the Session object.
            Request      - request header used in the call
            Response     - response header received from the server
            UaStatus     - result of last call invocation
        Methods:
            Execute      - invokes the call to Publish() */

function SetMonitoringModeService( args ) {
    // objects used by this class
    this.Name = "SetMonitoringMode";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* invokes the SetMonitoringMode() call.
           Parameters:
               MonitoringMode - 'monitoringMode' enumerator.
               MonitoredItemIds - array of 'monitoredItem' objects.
               SubscriptionId - 'subscription' object.
               ServiceResult - 
               OperationResults - 
               SuppressMessaging - true/false; show/hide messages
    */
    this.Execute = function( args ) {
        if( !isDefined( args ) )throw( "SetMonitoringMode::Execute() no args specified." );
        if( !isDefined( args.MonitoringMode ) ) throw( "SetMonitoringMode::Execute() MonitoringMode not specified." );
        if( !isDefined( args.MonitoredItemIds ) ) args.MonitoredItemIds = [];
        if( !isDefined( args.MonitoredItemIds.length ) ) args.MonitoredItemIds = [ args.MonitoredItemIds ];
        if( !isDefined( args.SubscriptionId ) ) throw( "SetMonitoringMode::Execute() SubscriptionId not specified." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( isDefined ( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        this.Request = new UaSetMonitoringModeRequest();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.Request.MonitoringMode = args.MonitoringMode;
        this.Request.SubscriptionId = args.SubscriptionId.SubscriptionId;
        this.Response = new UaSetMonitoringModeResponse();

        var ids = [];
        for( var m=0; m<args.MonitoredItemIds.length; m++ ) { // 'm' for MonitoredItem 
            this.Request.MonitoredItemIds[m] = args.MonitoredItemIds[m].MonitoredItemId;
            ids.push( args.MonitoredItemIds[m].MonitoredItemId );
        }

        var result; // function return

        // now to invoke the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.setMonitoringMode( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "SubscriptionId: " + this.Request.SubscriptionId + "; MonitoringMode: " + this.Request.MonitoringMode + "; MonitoredItemIds #" + this.Request.MonitoredItemIds.length } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkSetMonitoringModeError( this.Request, this.Response, args.OperationResults, args.SuppressMessaging );
                else if( !isDefined( args.ServiceResult ) ) result = checkSetMonitoringModeValidParameter( this.Request, this.Response, args.SuppressMessaging );
            }
        }
        else {
            addError( "SetMonitoringMode() failed, status: " + this.UaStatus, this.UaStatus );
            result = false;
        }

        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }
}

// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaModifyMonitoredItemsRequest
// Response is of Type UaModifyMonitoredItemsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkSetMonitoringModeError( Request, Response, ExpectedOperationResultsArray, suppressMessaging ) {
    var result = true;
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length != Request.MonitoredItemIds.length ) {
        addError( "function checkSetMonitoringModeError(): ExpectedOperationResultsArray[] must have the same size as Request.MonitoredItemIds[]. Expected: " + ExpectedOperationResultsArray.length + ", but received: " + Request.MonitoredItemIds.length );
        return false;
    }  
    // check number of results
    if( Response.Results.length !== Request.MonitoredItemIds.length ) {
        addError( "The number of results does not match the number of MonitoredItemIds." );
        addError( "SetMonitoringMode().Results.length (" + Response.Results.length + ") does not match the SetMonitoringMode().Request.MonitoredItemIds.length (" + Response.Results.length + ")." );
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
                    if( !suppressMessaging ) print( "\tSetMonitoringMode().Response.Results[" + i + "] = " + Response.Results[i], Response.Results[i] );
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
                if( bMatch && !suppressMessaging ) addWarning( "SetMonitoringMode().Response.Results[" + i + "] = " + Response.Results[i] + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i] );
                else {
                    addError( "SetMonitoringMode().Response.Results[" + i + "] = " + Response.Results[i] + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", Response.Results[i] );
                    result = false;
                }
            }
        }
    }
    return result;
}

// the service is expected to succeed all operations are expected to succeed
function checkSetMonitoringModeValidParameter( Request, Response, suppressMessaging ) {
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // don't proceed if the overall call failed.
    var result = true;
    // check number of results
    if( Response.Results.length !== Request.MonitoredItemIds.length ) {
        addError( "SetMonitoringMode.Results.length (" + Response.Results.length + ") does not match the SetMonitoringMode.Request.MonitoredItemIds length( " + Request.MonitoredItemIdes.length + ")." );
        result = false;
    }
    else {
        for( var i=0; i<Response.Results.length; i++ ) { // check each result
            if( Response.Results[i].isNotGood() ) {
                addError( "SetMonitoringMode().Results[" + i + "] is not good: " + Response.Results[i], Response.Results[i] );
                result = false;
            }
        }
    }
    return( result );
}