/*    This class object is responsible for calling the SetTriggering() service and for also
      performing any validation etc. This is a quick-use class. */

function SetTriggeringService( args ) {
    this.Name = "SetTriggering";
    this.Session = null;
    this.Request = new UaSetTriggeringRequest();
    this.Response = new UaSetTriggeringResponse();
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;



    /*  Invokes the call to SetTriggering()
        Parameters: 
            SubscriptionId        (required) - The subscription (Subscription object)
            TriggerItemId         (requred)  - A MonitoredItem for the TRIGGER
            LinksToAdd           (optional) - Array of MonitoredItems for LINKSTOADD
            LinksToRemove        (optional) - Array of MonitoredItems for LINKSTOREMOVE
            ServiceResults (optional) - True=expect Errors; FALSE=expect FAIL
            AddResults   (optional) - An array of ExpectedAndAcceptedResults
            DeleteResults (optional) - An array of ExpectedAndAcceptedResults
            SuppressMessaging (optional) - true/false; show/hide messages
    */
    this.Execute = function( args ) {
        // parameter validation
        if( !isDefined( args ) ) throw( "SetTriggering::Execute() args not specified." );
        if( isDefined( args.OperationResults ) ) throw( "SetTriggering::Execute() 'OperationResults' was specified. Use 'AddResults' and/or 'DeleteResults' instead." );
        if( !isDefined( args.SubscriptionId ) ) throw( "SetTriggering::Execute() SubscriptionId not specified." );
        if( !isDefined( args.SubscriptionId.SubscriptionId ) ) throw( "SetTriggering::Execute() SubscriptionId is not the correct type." );
        if( !isDefined( args.TriggeringItemId ) ) throw( "SetTriggering::Execute() TriggeringItemId not specified." );
        if( !isDefined( !args.TriggeringItemId.MontoredItemId ) ) throw( "SetTriggering::Execute() TriggeringItemId is not of the correct type." );
        if( !isDefined( args.LinksToAdd ) ) args.LinksToAdd = [];
        if( isDefined( args.LinksToAdd ) && !isDefined( args.LinksToAdd.length ) ) args.LinksToAdd = [ args.LinksToAdd ];
        if( !isDefined( args.LinksToRemove ) ) args.LinksToRemove = [];
        if( isDefined( args.LinksToRemove ) && !isDefined( args.LinksToRemove.length ) ) args.LinksToRemove = [ args.LinksToRemove ];
        if( isDefined( args.AddResults ) && !isDefined( args.LinksToAdd ) ) throw( "SetTriggering.Execute() argument mismatch: AddResults are specified although LinksToAdd is not." );
        if( isDefined( args.AddResults ) && !isDefined( args.AddResults.length ) ) args.AddResults = [ args.AddResults ];
        if( isDefined( args.DeleteResults ) && !isDefined( args.LinksToRemove ) ) throw( "SetTriggering.Execute() argument mismatch: DeleteResults are specified although LinksToRemove is not." );
        if( isDefined( args.DeleteResults ) && !isDefined( args.DeleteResults.length ) ) args.DeleteResults = [ args.DeleteResults ];
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        // register that this service is tested
        ServiceRegister.Register( { Service: ServiceRegister.UaService( { Name: this.Name, Available: true, Tested: true } ) } );

        var result = true;// return parameter, i.e. TRUE = Successfully executed.

        // built the SetTriggeringRequest request...
        this.Request = new UaSetTriggeringRequest();
        this.Response = new UaSetTriggeringResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        this.Request.SubscriptionId = args.SubscriptionId.SubscriptionId;
        this.Request.TriggeringItemId = args.TriggeringItemId.MonitoredItemId;

        // now to add any LinksToAdd/Delete 
        if( isDefined( args.LinksToAdd ) ) for( var a=0; a<args.LinksToAdd.length; a++ ) this.Request.LinksToAdd[a] = args.LinksToAdd[a].MonitoredItemId;
        if( isDefined( args.LinksToRemove ) ) for( var a=0; a<args.LinksToRemove.length; a++ ) this.Request.LinksToRemove[a] = args.LinksToRemove[a].MonitoredItemId;

        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.setTriggering( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "TriggeringItemId: " + this.Request.TriggeringItemId + "; LinksToAdd #" + this.Request.LinksToAdd.length + "; LinksToRemove #" + this.Request.LinksToRemove.length + "; SubscriptionId: " + this.Request.SubscriptionId } );
            if( result ) {
                if( isDefined( args.AddResults ) || isDefined( args.DeleteResults ) ) result = checkSetTriggeringError( this.Request, this.Response, args.AddResults, args.DeleteResults, args.SuppressMessaging );
                else if( !isDefined( args.ServiceResult ) ) result = checkSetTriggeringValidParameter( this.Request, this.Response, args.SuppressMessaging );
            }
        }
        else {
            addError( "SetMonitoringMode() failed, status: " + this.UaStatus, this.UaStatus );
            result = false;
        }// else... if( uaStatus.isGood() )
        // if the call failed then register that 
        if( !result ) ServiceRegister.SetFailed( { Name: this.Name } )
        return( result );
    }// Execute()
}



// the service is expected to succeed
// all operations are expected to succeed
function checkSetTriggeringValidParameter( Request, Response, suppressMessaging ) {
    // make sure the parameters contain something
    if( Request === undefined || Request === null || Response === undefined || Response === null ) {
        addError( "function checkSetTriggeringValidParameter(Request, Response). These parameters were specified, but not correctly." );
        return( false );
    }
    // not implemented?
    if( Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNotImplemented 
        || Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadServiceUnsupported ) {
        addNotSupported( "SetTriggering" );
        addError( "SetTriggering() is a required Service. Verify if this Conformance Unit should be selected for testing." );
        return( false );
    }
    var result = true; // return code
    // as this is a valid parameter test we don't expect any diagnositcinfo
    if( Response.AddDiagnosticInfos.length !== 0 ) {
        addError( "SetTriggering().Response.AddDiagnosticInfos was returned. No DiagnosticInfos were expected" );
        result = false;
    }
    if( Response.RemoveDiagnosticInfos.length !== 0 ) {
        addError( "SetTriggering().Response.RemoveDiagnosticInfos was returned. No DiagnosticInfos were expected" );
        result = false;
    }
    // check add results
    if( Response.AddResults.length !== Request.LinksToAdd.length ) {
        addError( "The number of SetTriggering().Response.AddResults (" + Request.LinksToAdd.length + ") does not match the number of SetTriggering.Request.LinksToAdd (" + Response.AddResults.length + ")." );
        result = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.AddResults.length; i++ ) {
            // status code
            if( Response.AddResults[i].isNotGood() ) {
                addError( "SetTriggering().Response.AddResults[" + i + "] is not good: " + Response.AddResults[i], Response.AddResults[i] );
                result = false;
            }
        }
    }
    // check remove results 
    if( Response.RemoveResults.length !== Request.LinksToRemove.length ) {
        addError( "The number of SetTriggering().Response.RemoveResults (" + Response.RemoveResults.length + ") does not match the number of LinksToRemove (" + Request.LinksToRemove.length + ")." );
        result = false;
    }
    else {        
        // check each result
        for( var i=0; i<Response.RemoveResults.length; i++ ) {
            // status code
            if( Response.RemoveResults[i].isNotGood() ) {
                addError( "SetTriggering().Response.RemoveResults[" + i + "] is not good: " + Response.RemoveResults[i], Response.RemoveResults[i] );
                result = false;
            }
        }
    }
    // check diagnostic infos for add and remove
    // no error is expected so the DiagnosticInfos should be empty
    if( Response.AddDiagnosticInfos.length !== 0 ) {
        addError( "SetTriggering().Response.AddDiagnosticInfos are not empty:" + Response.AddDiagnosticInfos );
        result = false;
    }
    if( Response.RemoveDiagnosticInfos.length !== 0 ) {
        addError( "SetTriggering().Response.RemoveDiagnosticInfos are not empty: " + Response.RemoveDiagnosticInfos );
        result = false;
    }
    return( result );
}





// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaModifyMonitoredItemsRequest
// Response is of Type UaModifyMonitoredItemsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/objects.js)
function checkSetTriggeringError( Request, Response, ExpectedOperationResultsAdd, ExpectedOperationResultsRemove, suppressMessaging ) {
    // check service result
    if( Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadNotImplemented || Response.ResponseHeader.ServiceResult.StatusCode === StatusCode.BadServiceUnsupported ) {
        addNotSupported( "SetTriggering" );
        addError( "SetTriggering() is a required Service. Verify if this Conformance Unit should be selected for testing." );
        return( false );
    }
    // ExpectedOperationResultsAdd and ExpectedOperationResultsRemove needs to have the correct size
    if( Request.LinksToAdd.length > 0 ) {
        if( ExpectedOperationResultsAdd.length !== Request.LinksToAdd.length ) {
            addError( "function checkSetTriggeringError(): ExpectedOperationResultsAdd[] must have the same size as Request.LinksToAdd[]" );
            return( false );
        }
    }
    if( Request.LinksToRemove.length > 0 ) {
        if( ExpectedOperationResultsRemove.length != Request.LinksToRemove.length ) {
            addError( "function checkSetTriggeringError(): ExpectedOperationResultsRemove[] must have the same size as Request.LinksToRemove[]" );
            return( false );
        }
    }
    var results = true;
    // check AddResults
    if( Response.AddResults.length !== Request.LinksToAdd.length ) {
        addError( "SetTriggering().LinksToAdd.length=" + Request.LinksToAdd.length + " AddResults.length=" + Response.AddResults.length );
        results = false;
    }
    else {
        // check each result
        for( var i=0; i<Response.AddResults.length; i++ ) {
            // StatusCode
            var bMatch = false;
            // check if result matches any of the expected status codes
            for( var j = 0; j < ExpectedOperationResultsAdd[i].ExpectedResults.length; j++ ) {
                if( Response.AddResults[i].StatusCode == ExpectedOperationResultsAdd[i].ExpectedResults[j].StatusCode ) {
                    if( !suppressMessaging ) addLog( "SetTriggering().Response.AddResults[" + i + "] = " + Response.AddResults[i], Response.AddResults[i] );
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsAdd[i].AcceptedResults.length; j++ ) {
                    if( Response.AddResults[i].StatusCode == ExpectedOperationResultsAdd[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "SetTriggering().Response.AddResults[" + i + "] = " + Response.AddResults[i] + " but " + ExpectedOperationResultsAdd[i].ExpectedResults[0] + " was expected", Response.AddResults[i] );
                }
                else {
                    addError( "SetTriggering().Response.AddResults[" + i + "] = " + Response.AddResults[i] + " but " + ExpectedOperationResultsAdd[i].ExpectedResults[0] + " was expected", Response.AddResults[i] );
                    results = false;
                }
            }
        }//for i...
        // check the ADD diagnositcinfo
        Assert.Equal( 0, Response.AddDiagnosticInfos.length, "SetTriggeringResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
    }
    // check RemoveResults
    if( Response.RemoveResults.length !== Request.LinksToRemove.length ) {
        addError( "The number of SetTriggering().Response.RemoveResults (" + Response.LinksToRemove +  ") does not match the number of SetTriggering().Request.LinksToRemove (" + Request.LinksToRemove.length + ")." );
        results = false;
    }
    else {   
        // check each result
        for( var i=0; i<Response.RemoveResults.length; i++ ) {
            var bMatch = false;
            // check if result matches any of the expected status codes
            for( var j=0; j<ExpectedOperationResultsRemove[i].ExpectedResults.length; j++ ) {
                if( Response.RemoveResults[i].StatusCode == ExpectedOperationResultsRemove[i].ExpectedResults[j].StatusCode ) {
                    if( !suppressMessaging ) addLog( "SetTriggering().Response.RemoveResults[" + i + "] = " + Response.RemoveResults[i], Response.RemoveResults[i] );
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsRemove[i].AcceptedResults.length; j++ ) {
                    if( Response.RemoveResults[i].StatusCode == ExpectedOperationResultsRemove[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) addWarning( "SetTriggering().Response.RemoveResults[" + i + "] = " + Response.RemoveResults[i] + " but " + ExpectedOperationResultsRemove[i].ExpectedResults[0] + " was expected", Response.RemoveResults[i] );
                else {
                    addError( "SetTriggering().Response.RemoveResults[" + i + "] = " + Response.RemoveResults[i] + " but " + ExpectedOperationResultsRemove[i].ExpectedResults[0] + " was expected", Response.RemoveResults[i] );
                    results = false;
                }
            }// for j...
            // check the REMOVE diagnosticinfo
            Assert.Equal( 0, Response.RemoveDiagnosticInfos.length, "SetTriggering().Response.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
        }
    }
    return( results );
}