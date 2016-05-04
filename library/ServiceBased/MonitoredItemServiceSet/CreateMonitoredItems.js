function CreateMonitoredItemsService( args ) {
    this.Name = "CreateMonitoredItems";
    this.Session = null;
    this.Request;
    this.Response;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /* this is a wrapper around the existing/original function (above)
        arguments:
           ItemsToCreate 
           SubscriptionId 
           TimestampsToReturn 
           ServiceResult 
           OperationResults
           SuppressMessaging
           MaxItemsPerCall */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "CreateMonitoredItems::Execute() no arguments specified." );
        if( !isDefined( args.SubscriptionId ) ) throw( "CreateMonitoredItems::Execute() SubscriptionId missing." );
        if( isDefined( args.ExpectedErrors ) || isDefined( args.ExpectedResults ) ) throw( "CreateMonitoredItems::Execute() uses older ExpectedResults methodology." );
        if( !isDefined( args.TimestampsToReturn ) ) args.TimestampsToReturn = TimestampsToReturn.Server;
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        var result;
        if( isDefined( args.MaxItemsPerCall ) && ( args.MaxItemsPerCall < args.ItemsToCreate.length ) && args.MaxItemsPerCall > 0 ) {
            var ic=0; // a counter to record how many items have been added
            this.Request = []; // convert the request parameter into an array to store each request
            this.Response = []; // store each response also
            // loop through adding items until all items have been added
            do{
                // get the next XX amount of items into a request
                var cmiItems = [];
                for( var a=0; a<args.MaxItemsPerCall; a++ ) {
                    if( ic < args.ItemsToCreate.length ) {
                        cmiItems.push( args.ItemsToCreate[ic++] );
                    }
                    else break;
                }
                // call CMI and store the request/response 
                result = createMonitoredItems( cmiItems, args.TimestampsToReturn, args.SubscriptionId, this.Session, args.ServiceResult, args.OperationResults, args.SuppressMessaging );
                this.Request.push( createMonItemsRequ );
                this.Response.push( createMonItemsResp );
            }while( ic < args.ItemsToCreate.length );
        }
        else {
            result = createMonitoredItems( args.ItemsToCreate, args.TimestampsToReturn, args.SubscriptionId, this.Session, args.ServiceResult, args.OperationResults, args.SuppressMessaging );
            this.Request = createMonItemsRequ;
            this.Response = createMonItemsResp;
        }
        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// this.Execute = function( args )

}// function CreateMonitoredItemsService( session )



// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaCreateMonitoredItemsRequest
// Response is of Type UaCreateMonitoredItemsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/Objects/expectedResults.js)
function checkCreateMonitoredItemsError( Request, Response, ExpectedOperationResultsArray ) {
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkCreateMonitoredItemsError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.ItemsToCreate.length ) {
        addError( "function checkCreateMonitoredItemsError(): ExpectedOperationResultsArray[] must have the same size as Request.ItemsToCreate[]. Expected length: " + ExpectedOperationResultsArray.length + "; Actual length: " + Request.ItemsToCreate.length );
        return( false );
    }
    // check results        
    // check number of results
    var success = true;
    if( Response.Results.length !== Request.ItemsToCreate.length ) {
        addError( "The number of results does not match the number of ItemsToCreate. ItemsToCreate.length=" + Request.ItemsToCreate.length + " Results.length=" + Response.Results.length );
        return( false );
    }
    else {
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // StatusCode
            // RevisedSamplingInterval
            // RevisedQueueSize
            // MonitoredItemId
            // FilterResult
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
                    if( Response.Results[i].StatusCode.StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ); {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "Response.Results[" + i + "].StatusCode = " + Response.Results[i].StatusCode + " but '" + ExpectedOperationResultsArray[i].ExpectedResults[0] + "' was expected", Response.Results[i].StatusCode );
                }
                else {
                    addError( "Response.Results[" + i + "].StatusCode = " + Response.Results[i].StatusCode + " but '" + ExpectedOperationResultsArray[i].ExpectedResults[0] + "' was expected", Response.Results[i].StatusCode );
                    success = false;
                }
            }            
        }
    }
    return( success );
}// function checkCreateMonitoredItemsError( Request, Response, ExpectedOperationResultsArray )


// the service is expected to succeed
// all operations are expected to succeed
function checkCreateMonitoredItemsValidParameter( Request, Response, suppressMessaging ) {
    if( !isDefined( Request ) || !isDefined( Response ) ) throw( "CreateMonitoredItems::checkCreateMonitoredItemsValidParameter: request/response not specified." );
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // no need to proceed if the overall call failed
    var bSucceeded = true;
    // check number of results
    if( Response.Results.length !== Request.ItemsToCreate.length ) {
        addError( "The number of results does not match the number of ItemsToCreate. ItemsToCreate.length = " + Request.ItemsToCreate.length + " Results.length = " + Response.Results.length + ". ServiceReslt: " + Response.ResponseHeader.ServiceResult.toString() );
        bSucceeded = false;
    }
    else {
        // check each result
        var msg = "CreateMonitoredItems().Results that:";
        var ok = 0;
        var bad = [];
        for( var i=0; i<Response.Results.length; i++ ) {
            var monitoredItemsCreateResult = Response.Results[i];
            if( monitoredItemsCreateResult.StatusCode.isNotGood() ) {
                bad.push( "[" + i.toString() + "] " + monitoredItemsCreateResult.StatusCode );
            }
            else ok++;
        }
        bSucceeded = ( bad.length == 0 );
        if( bad.length > 0 ) {
            msg += "\n\tPassed (" + ( ok === 0? "0" : ok.toString() ) + ")";
            msg += "\n\tFailed (" + ( bad.length === 0? "0" : bad.length.toString() ) + "): ";
            if( bad.length> 15 ) {
                for( b=0; b<10; b++ ) msg += bad[b]; 
                msg += " ...<truncated>... ";
                for( b=bad.length-6; b<bad.length-1; b++ ) msg += bad[b];
            }
            else {
                for( b=0; b<bad.length; b++ ) msg += bad[b];
            }
            addError( msg );
        }
    }
    // check diagnostic infos
    // no error is expected so the DiagnosticInfos should be empty
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "DiagnosticInfos are not empty. DiagnosticInfos: " + DiagnosticInfos );
        bSucceeded = false;
    }
    return bSucceeded;
}// function checkCreateMonitoredItemsValidParameter( Request, Response, suppressMessaging )




// creates a number of monitored items with default parameters
// MonitoredItems is an array of MonitoredItem Objects defined in lib/Base/Objects/monitoredItem.js
// Subscription is of type Subscription defined in lib/Base/Objects/subscription.js
// Session is of type UaSession
var createMonItemsRequ;
var createMonItemsResp;
function createMonitoredItems( MonitoredItems, TimestampsToReturn, Subscription, Session, ServiceResult, OperationResults, suppressMessaging ) {
    var bSucceeded = true;
    var i;
    // check in parameters
    if( arguments.length < 4 ) {
        addError( "function createMonitoredItems(MonitoredItems, TimestampsToReturn, Subscription, Session): Number of arguments must be 4 by minimum!" );
        return false;
    }
    // do we have any items to specify?
    if( !isDefined( MonitoredItems ) ) {
        addError( "No items specified to createMonitoredItems." );
        return( false );
    }
    createMonItemsRequ = new UaCreateMonitoredItemsRequest();
    createMonItemsResp = new UaCreateMonitoredItemsResponse();
    var session = isDefined( Session.Session )? Session.Session : Session;
    createMonItemsRequ.RequestHeader = UaRequestHeader.New( { Session: session } );

    createMonItemsRequ.SubscriptionId = Subscription.SubscriptionId;
    createMonItemsRequ.TimestampsToReturn = TimestampsToReturn;

    // turn the MonitoredItems parameter into an array, if not already; then add to the request.
    if( !isDefined( MonitoredItems.length ) ) MonitoredItems = [ MonitoredItems];
    for( i = 0; i < MonitoredItems.length; i++ ) {
        createMonItemsRequ.ItemsToCreate[i] = new UaMonitoredItemCreateRequest();
        createMonItemsRequ.ItemsToCreate[i].ItemToMonitor.AttributeId = MonitoredItems[i].AttributeId;
        createMonItemsRequ.ItemsToCreate[i].ItemToMonitor.NodeId = MonitoredItems[i].NodeId;
        createMonItemsRequ.ItemsToCreate[i].ItemToMonitor.IndexRange = MonitoredItems[i].IndexRange;
        createMonItemsRequ.ItemsToCreate[i].ItemToMonitor.DataEncoding = MonitoredItems[i].DataEncoding;
        createMonItemsRequ.ItemsToCreate[i].MonitoringMode = MonitoredItems[i].MonitoringMode;
        createMonItemsRequ.ItemsToCreate[i].RequestedParameters.ClientHandle = MonitoredItems[i].ClientHandle;
        createMonItemsRequ.ItemsToCreate[i].RequestedParameters.SamplingInterval = MonitoredItems[i].SamplingInterval;
        createMonItemsRequ.ItemsToCreate[i].RequestedParameters.QueueSize = MonitoredItems[i].QueueSize;
        createMonItemsRequ.ItemsToCreate[i].RequestedParameters.DiscardOldest = MonitoredItems[i].DiscardOldest;

        if( MonitoredItems[i].Filter !== undefined && MonitoredItems[i].Filter != null ) createMonItemsRequ.ItemsToCreate[i].RequestedParameters.Filter = MonitoredItems[i].Filter;
    }

    var uaStatus = session.createMonitoredItems( createMonItemsRequ, createMonItemsResp );
    if( uaStatus.isGood() ) {
        bSucceeded = UaResponseHeader.IsValid( { Service: { Name: "CreateMonitoredItems", Request: createMonItemsRequ, Response: createMonItemsResp }, ServiceResult: ServiceResult, SuppressMessaging: suppressMessaging, ServiceInfo: ( "ItemsToCreate #" + createMonItemsRequ.ItemsToCreate.length + "; SubscriptionId: " + createMonItemsRequ.SubscriptionId + "; TimestampsToReturn: " + createMonItemsRequ.TimestampsToReturn ) } );
        if( bSucceeded ){
            if( isDefined( OperationResults ) ) bSucceeded = checkCreateMonitoredItemsError( createMonItemsRequ, createMonItemsResp, OperationResults );
            else bSucceeded = checkCreateMonitoredItemsValidParameter( createMonItemsRequ, createMonItemsResp, suppressMessaging );
        }

        for( i = 0; i < createMonItemsResp.Results.length; i++ ) {
            var currentResult = createMonItemsResp.Results[i];
            if( currentResult.StatusCode.isGood() ) {
                MonitoredItems[i].IsCreated = true;
                MonitoredItems[i].MonitoredItemId  = currentResult.MonitoredItemId;
                MonitoredItems[i].RevisedQueueSize = currentResult.RevisedQueueSize;
                MonitoredItems[i].RevisedSamplingInterval = currentResult.RevisedSamplingInterval;
                if( currentResult.FilterResult !== null ) {
                    var filterNodeId = currentResult.FilterResult.TypeId.NodeId.toString();
                    var emptyNodeId  = UaNodeId.fromString("i=0").toString();
                    if( filterNodeId !== emptyNodeId ) {
                        MonitoredItems[i].Filter = currentResult.FilterResult;
                    }
                }
                MonitoredItems[i].SubscriptionId   = Subscription.SubscriptionId;
            }
        }
    }
    else {
        addError( "CreateMonitoredItems() status " + uaStatus, uaStatus );
        bSucceeded = false;
    }
    return bSucceeded;
}// function createMonitoredItems( MonitoredItems, TimestampsToReturn, Subscription, Session, ServiceResult, OperationResults, suppressMessaging )