function DeleteMonitoredItemsService( args ) {
    this.Name = "DeleteMonitoredItems";
    this.Request;
    this.Response;
    this.Session;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;


    /* Parameters: 
        - ItemsToDelete, 
        - args.SubscriptionId,
        - args.Session, 
        - args.ExpectedErrors (obsolete), 
        - args.ExpectErrorNotFail (obsolete), 
        - args.SuppressMessaging
        - args.MaxItemsPerCall
        - args.ServiceResult
        - args.OperationResults */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "DeleteMonitoredItemsHelper.Execute() no arguments specified." );
        if( !isDefined( args.ItemsToDelete ) ) args.ItemsToDelete = [];
        if( !isDefined( args.SubscriptionId ) ) throw( "DeleteMonitoredItemsHelper.Execute() SubscriptionId not specified." );
        if( isDefined( args.ExpectedErrors ) ) throw( "DeleteMonitoredItemsHelper.Execute() uses old 'ExpectedErrors'" );
        if( isDefined( args.ExpectedResults ) ) throw( "DeleteMonitoredItemsHelper.Execute() uses old 'ExpectedResults'" );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        var result;
        if( isDefined( args.MaxItemsPerCall ) && ( args.MaxItemsPerCall < args.ItemsToDelete.length ) && args.MaxItemsPerCall > 0 ) {
            var ic=0; // a counter to record how many items have been added
            this.Request = []; // convert the request parameter into an array to store each request
            this.Response = []; // store each response also
            // loop through adding items until all items have been added
            do{
                // get the next XX amount of items into a request
                var dmiItems = [];
                for( var a=0; a<args.MaxItemsPerCall; a++ ) {
                    if( ic < args.ItemsToDelete.length ) {
                        dmiItems.push( args.ItemsToDelete[ic++] );
                    }
                    else break;
                }
                // call DMI and store the request/response 
                result = deleteMonitoredItems( 
                        dmiItems,  
                        args.SubscriptionId, 
                        this.Session, 
                        args.ServiceResult, 
                        args.OperationResults, 
                        args.SuppressMessaging );
                this.Request.push( deleteMonitoredItemsRequest );
                this.Response.push( deleteMonitoredItemsResponse );
            }while( ic < args.ItemsToDelete.length );
        }
        else {
                result = deleteMonitoredItems( 
                    args.ItemsToDelete, 
                    args.SubscriptionId,
                    this.Session, 
                    args.ServiceResult, 
                    args.OperationResults, 
                    args.SuppressMessaging );
                this.Request = deleteMonitoredItemsRequest;
                this.Response = deleteMonitoredItemsResponse;
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
function checkDeleteMonitoredItemsError( Request, Response, ExpectedOperationResultsArray ) {
    var result = true;
    // check in parameters
    if( arguments.length !== 3 ) {
        addError( "function checkDeleteMonitoredItemsError(Request, Response, ExpectedOperationResultsArray): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( !isDefined( ExpectedOperationResultsArray.length ) ) ExpectedOperationResultsArray = [ ExpectedOperationResultsArray ];
    if( ExpectedOperationResultsArray.length !== Request.MonitoredItemIds.length ) {
        addError( "function checkDeleteMonitoredItemsError(): ExpectedOperationResultsArray[] must have the same size as Request.MonitoredItemIds[]" );
        return( false );
    }
    // check results
    // check number of results
    if( Response.Results.length != Request.MonitoredItemIds.length ) {
        addError( "Length mismatch! DeleteMonitoredItems().MonitoredItemIds.length=" + Request.MonitoredItemIds.length + "; DeleteMonitoredItems().Results.length=" + Response.Results.length );
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
                    print( "\tDeleteMonitoredItems().Response.Results[" + i + "] = " + Response.Results[i], Response.Results[i] );
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
                    addWarning( "DeleteMonitoredItems().Response.Results[" + i + "] = " + Response.Results[i] + ", but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected.", Response.Results[i] );
                }
                else {
                    var msg = "DeleteMonitoredItems().Response.Results[" + i + "] = " + Response.Results[i] + ", but ";
                    if( ExpectedOperationResultsArray[i].ExpectedResults.length > 1 ) msg += "any of the following were expected: ";
                    for( var e=0; e<ExpectedOperationResultsArray[i].ExpectedResults.length; e++ ) msg += ExpectedOperationResultsArray[i].ExpectedResults[e] + "; ";
                    if( ExpectedOperationResultsArray[i].AcceptedResults.length > 0 ){
                            msg += "\n\t... and any of the following results would be acceptable: ";
                            for( var e=0; e<ExpectedOperationResultsArray[i].AcceptedResults.length; e++ ) msg += ExpectedOperationResultsArray[i].AcceptedResults[e];
                    }
                    addError( msg, Response.Results[i] );
                    result = false;
                }
            }
        }
    }
    return( result );
}



// the service is expected to succeed
// all operations are expected to succeed
function checkDeleteMonitoredItemsValidParameter( Request, Response ) {
    if( !isDefined( Request ) || !isDefined( Response ) ) throw( "DeleteMonitoredItems:checkDeleteMonitoredItemsValidParameter: Request/Response not specified." );
    if( Response.ResponseHeader.ServiceResult.isBad() ) return( false ); // no need to check the response if the overall call failed.
    var bSucceeded = true;
    // check number of results
    if( Response.Results.length !== Request.MonitoredItemIds.length ) {
        addError( "The number of results does not match the number of MonitoredItemIds." );
        addError( "MonitoredItemIds.length = " + Request.MonitoredItemIds.length + " Results.length = " + Response.Results.length );
        bSucceeded = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            // status code
            if( Response.Results[i].isNotGood() ) {
                addError( "DeleteMonitoredItems: Results[" + i + "] is not good: " + Response.Results[i], Response.Results[i] );
                bSucceeded = false;
            }
        }
    }
    // check diagnostic infos
    // no error is expected so the DiagnosticInfos should be empty
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "DiagnosticInfos are not empty" );
        addError( "DiagnosticInfos: " + DiagnosticInfos );
        bSucceeded = false;
    }
    return bSucceeded;
}





// deletes all monitoredItems from the subscirption
// MonitoredItemIds is of type UaUint32s or MonitoredItem object
// Subscription is of type Subscription defined in Lib/Base/Objects/subscription.js
// Session is of type UaSession
var deleteMonitoredItemsRequest;
var deleteMonitoredItemsResponse;
function deleteMonitoredItems( MonitoredItemIds, Subscription, Session, ServiceResult, OperationResults, suppressMessaging ) {
    var bSucceeded = true;

    // check in parameters
    if( arguments.length < 3 ) {
        addError( "function deleteMonitoredItems(MonitoredItemIds, Subscription, Session): Number of arguments must be at least 3!" );
        return false;
    }

    // allow the developer to be lazy. The "monitoredItemIds" parameter is expected to be an 
    // array of Integers (MonitoredItemId). However, if it is an array of MonitoredItem objects 
    // then ALLOW IT, because we can convert those to just the monitoredItemIds ourselves.
    // We are going to ASSUME that the array elements are all of the same type, so take a look 
    // at the first element to see if it is a monitoredItem object.
    // FIRST, is it an array?
    var itemIdsToRemove = [];
    if( MonitoredItemIds.length === undefined ) {
        // is it an integer or monitoredItem?
        if( MonitoredItemIds.MonitoredItemId !== undefined ) {
            itemIdsToRemove[0] = MonitoredItemIds.MonitoredItemId;
        }
        else {
            itemIdsToRemove[0] = MonitoredItemIds;
        }
        MonitoredItemIds = [MonitoredItemIds];
    }
    else if( MonitoredItemIds.length > 0 ) {
        // an array, of MonitoredItems? or integers?
        if( MonitoredItemIds[0].MonitoredItemId !== undefined ) {
            itemIdsToRemove = MonitoredItem.toIdsArray( MonitoredItemIds );
        }
        else {
            itemIdsToRemove = MonitoredItemIds;
        }
    }

    deleteMonitoredItemsRequest = new UaDeleteMonitoredItemsRequest();
    deleteMonitoredItemsResponse = new UaDeleteMonitoredItemsResponse();
    var session = isDefined( Session.Session )? Session.Session : Session;
    deleteMonitoredItemsRequest.RequestHeader = UaRequestHeader.New( { Session: session } );

    // the Subscription parameter might be a subscriptionId or subscription object...
    var subId;
    if( typeof Subscription === "number" ) subId = Subscription;
    else subId = Subscription.SubscriptionId;
    deleteMonitoredItemsRequest.SubscriptionId = subId;

    for( var i=0, n=0; i < itemIdsToRemove.length; i++ ) {
        // ignore bad MonitoredItemIds
        if( itemIdsToRemove[i] !== 0 ) {
            deleteMonitoredItemsRequest.MonitoredItemIds[n] = itemIdsToRemove[i];
            n++;
        }
    }

    var uaStatus = session.deleteMonitoredItems( deleteMonitoredItemsRequest, deleteMonitoredItemsResponse );
    if( uaStatus.isGood() ) {
        bSucceeded = UaResponseHeader.IsValid( { Service: { Name: "DeleteMonitoredItems", Request: deleteMonitoredItemsRequest, Response: deleteMonitoredItemsResponse }, ServiceResult: ServiceResult, SuppressMessaging: suppressMessaging, ServiceInfo: "MonitoredItemIds #" + itemIdsToRemove.length + "; SubscriptionId: " + subId } );
        if( bSucceeded ) {
            if( isDefined( OperationResults ) ) bSucceeded = checkDeleteMonitoredItemsError( deleteMonitoredItemsRequest, deleteMonitoredItemsResponse, OperationResults );
            else bSucceeded = checkDeleteMonitoredItemsValidParameter( deleteMonitoredItemsRequest, deleteMonitoredItemsResponse );
        }
    }
    else {
        addError( "DeleteMonitoredItems() failed, status: " + uaStatus, uaStatus );
        bSucceeded = false;
    }

    return bSucceeded;
}