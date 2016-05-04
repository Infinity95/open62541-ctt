/*  Nathan Pocock; nathan.pocock@opcfoundation.org
    This helper object simplifies the task of calling the ModifyMonitoredItems service call via the test-scripts.
        Methods:
            Execute = function( args) */

function ModifyMonitoredItemsService( args ) {
    this.Name = "ModifyMonitoredItems";
    this.Session = null;
    this.Request  = new UaModifyMonitoredItemsRequest();
    this.Response = new UaModifyMonitoredItemsResponse();
    this.uaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Executes the call to ModifyMonitoredItems.
       Parameters:
           - SubscriptionId      - Subscription object
           - ItemsToModify       - MonitoredItems objects to modify
           - TimestampsToReturn  - TimestampsToReturn
           - SubscriptionObject  - Subscription object to use
           - ExpectedResults     - Array of ExpectedAndAcceptedResults
           - ErrorNotFail        - TRUE=expect Error, FALSE=expect Fail.
       Returns:
           TRUE:  the call completed as expected. Otherwise FALSE.
    */
    this.Execute = function( args) {
        if( !isDefined( args.SubscriptionId ) )throw( "ModifyMonitoredItems.js::Execute() SubscriptionId not specified." );
        if( isDefined( args.ExpectError ) ) throw( "ModifyMonitoredItems.js::Execute() ExpectError deprecated." );
        if( !isDefined( args.ItemsToModify ) ) args.ItemsToModify = [];
        if( !isDefined( args.TimestampsToReturn ) )args.TimestampsToReturn = TimestampsToReturn.Both;
        if( args.ItemsToModify.length == undefined ) args.ItemsToModify = [ args.ItemsToModify];
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( !args.SuppressMessaging ) print( "ModifyMonitoredItems (helper). Items to modify: " + args.ItemsToModify.length + 
                "\n\t\tSubscriptionId: " + args.SubscriptionId.SubscriptionId + 
                "\n\t\tTimestampsToReturn: " + TimestampsToReturn.toString( args.TimestampsToReturn  ) );

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        // build the header
        this.Request  = new UaModifyMonitoredItemsRequest();
        this.Response = new UaModifyMonitoredItemsResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // specify the subscription and timestamp details
        this.Request.SubscriptionId = args.SubscriptionId.SubscriptionId;
        this.Request.TimestampsToReturn = args.TimestampsToReturn;
        // now to modify the items themselves...
        if( args.SuppressMessaging === undefined || args.SuppressMessaging == false ) print( "\tModifying items as follows:" );
        for( var i=0; i<args.ItemsToModify.length; i++ ) {
            this.Request.ItemsToModify[i].MonitoredItemId = args.ItemsToModify[i].MonitoredItemId;
            this.Request.ItemsToModify[i].RequestedParameters.ClientHandle = args.ItemsToModify[i].ClientHandle;
            this.Request.ItemsToModify[i].RequestedParameters.DiscardOldest = args.ItemsToModify[i].DiscardOldest;
            this.Request.ItemsToModify[i].RequestedParameters.QueueSize = args.ItemsToModify[i].QueueSize;
            this.Request.ItemsToModify[i].RequestedParameters.SamplingInterval = args.ItemsToModify[i].SamplingInterval;
            if( args.ItemsToModify[i].Filter !== null ) {
                this.Request.ItemsToModify[i].RequestedParameters.Filter = args.ItemsToModify[i].Filter;
            }
            if( !args.SuppressMessaging ) print( "\t\tNodeId: " + args.ItemsToModify[i].MonitoredItemId +
                    "; ClientHandle: " + args.ItemsToModify[i].ClientHandle +
                    "; MonitoringMode: " + MonitoringMode.toString( args.ItemsToModify[i].MonitoringMode ) +
                    "; DiscardOldest: " + args.ItemsToModify[i].DiscardOldest +
                    "; QueueSize:" + args.ItemsToModify[i].QueueSize +
                    "; SamplingInterval: " + args.ItemsToModify[i].SamplingInterval +
                    "; Filter: " + args.ItemsToModify[i].Filter );
        }// for i...
        // call modify
        var result = false;
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.uaStatus = session.modifyMonitoredItems( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.uaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "ItemsToModify #" + this.Request.ItemsToModify.length + "; SubscriptionId: " + this.Request.SubscriptionId + "; TimestampsToReturn: " + this.Request.TimestampsToReturn } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkModifyMonitoredItemsError( this.Request, this.Response, args.OperationResults );
                else result = checkModifyMonitoredItemsValidParameter( this.Request, this.Response, args.SuppressMessaging );
            }
        }// if Good
        else addError( "ModifyMonitoredItems() failed, Status: " + this.uaStatus, this.uaStatus );
        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }//execute
}// function ModifyMonitoredItemsService( Session ) 



// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaModifyMonitoredItemsRequest
// Response is of Type UaModifyMonitoredItemsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkModifyMonitoredItemsError( Request, Response, ExpectedOperationResultsArray ) {
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkModifyMonitoredItemsError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.ItemsToModify.length ) {
        addError( "function checkModifyMonitoredItemsError(): ExpectedOperationResultsArray[] must have the same size as Request.ItemsToModify[]\n\tItems Modified: " + Request.ItemsToModify.length + ", we Expected " + ExpectedOperationResultsArray.length + " errors." );
        return( false );
    }  
    var success = true;
    // check results        
    // check number of results
    if( Response.Results.length !== Request.ItemsToModify.length ) {
        addError( "ModifyMonitoredItems().ItemsToModify.length (" + Request.ItemsToModify.length + ") does not match ModifyMonitoredItems().Results.length (" + Response.Results.length + ")." );
        success = false;
    }
    else {   
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // FilterResults
            // RevisedQueueSize
            // RevisedSamplingInterval
            // StatusCode
            var bMatch = false;
            // check if result matches any of the expected status codes
            for( var j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                if( Response.Results[i].StatusCode.StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( Response.Results[i].StatusCode.StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "ModifyMonitoredItems().Response.Results[" + i + "].StatusCode = " + Response.Results[i].StatusCode + ", which is acceptable, but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected.", Response.Results[i].StatusCode );
                }
                else {
                    var err = "ModifyMonitoredItems().Response.Results[" + i + "].StatusCode = " + Response.Results[i].StatusCode + ", but any one of the following were expected:\n\t" + ExpectedOperationResultsArray[i].ExpectedResults.toString();
                    if( ExpectedOperationResultsArray[i].AcceptedResults.length > 0 ) err +=  "\n\tand any one of the following would have been accepted:\n\t" + ExpectedOperationResultsArray[i].AcceptedResults.toString();
                    addError( err, Response.Results[i].StatusCode );
                    success = false;
                }
            }
        }
    }
    return( success );
}// function checkModifyMonitoredItemsError( Request, Response, ExpectedOperationResultsArray )



// the service is expected to succeed
// all operations are expected to succeed
function checkModifyMonitoredItemsValidParameter( Request, Response, SuppressMessaging ) {
    if( !isDefined( Request ) || !isDefined( Response ) ) throw( "ModifyMonitoredItems::checkModifyMonitoredItemsValidParameter: Request/Response not specified." );
    if( !isDefined( SuppressMessaging ) ) SuppressMessaging = false;
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // no need to proceed if the overall call failed.
    var success = true;
    // check number of results
    if( Response.Results.length !== Request.ItemsToModify.length ) { 
        addError( "ModifyMonitoredItems().Request.ItemsToModify.length (" + Request.ItemsToModify.length + ") differs from ModifyMonitoredItems().Results.length (" + Response.Results.length + ")." );
    }
    else {
        // check each result
        var msg = "ModifyMonitoredItems().Results:";
        var ok = 0;
        var bad = [];
        for( var i=0; i<Response.Results.length; i++ ) {
            var currResult = Response.Results[i];
            if( currResult.StatusCode.isNotGood() ) {
                bad.push( "[" + i.toString() + "] " + currResult.StatusCode );
            }
            else ok++;
            bSucceeded = ok == 0;
            if( bad.length > 0 ) {
                msg += "\n\tPassed: " + ( ok === 0? "None." : ok.toString() );
                msg += "\n\tFailed: " + ( bad.length === 0? "None." :"" );
                for( var b=0; b<bad.length; b++ ) {
                    msg += bad[b];
                    if( b > 15 && b < bad.length - 6 ) { 
                        msg += "... <truncated>...";
                        b = bad.length - 6;
                    }
                }
                addError( msg );
            }
        }
    }
    return( success );
}// function checkModifyMonitoredItemsValidParameter( Request, Response, SuppressMessaging )