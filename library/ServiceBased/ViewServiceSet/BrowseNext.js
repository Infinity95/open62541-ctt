/*  BrowseNext Service call helper object. This object is intended to reduce the level of scripting required for testing
    of the BrowseNext service to just 1 line of code.
    Test code at the bottom of this file demonstrates the use of this class.

    Properties:
        - session:    A live UA Session that will be used to invoke the Browse service call.
        - request:    The current (last used) BrowseNextRequest object.
        - response:   The current (last received) BrowseNextResponse object.

    Methods: 
        - Execute:         Invokes the BrowseNext service call.
        - ResultsToString: Returns the BrowseNext response details in a string. */

function BrowseNextService( args ) {
    this.Name = "BrowseNext";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) { throw( "Invalid use of the BrowseNext helper method. Arguments must be specified when instanciating this class helper." ); }
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR failed; session not specified." );
    else this.Session = args.Session;

    /* Invokes the call to BrowseNext.
        Parameters: 
            - ContinuationPoints: an array of MonitoredItem objects to Browse
            - ReleaseContinuationPoints: Release continuationPoints? (boolean)
            - ServiceResult:
            - OperationResults: */
    //this.Execute = function( continuationPoints, releaseCPs, expectedErrors, expectErrorNotFail  )
    this.Execute = function( args ) {
        // parameter check
        if( !isDefined( args ) ) throw( "BrowseNext::Execute() args not specified." );
        if( isDefined( args.ContinuationPoints ) && !isDefined( args.ContinuationPoints.length ) ) args.ContinuationPoints = [ args.ContinuationPoints ];
        if( !isDefined( args.ReleaseContinuationPoints ) ) args.ReleaseContinuationPoints = false;

        // create the request/response objects
        this.Request = new UaBrowseNextRequest();
        this.Response = new UaBrowseNextResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );

        // populate the request header with the specified parameters
        if( isDefined( args.ContinuationPoints ) ) {
            this.Request.ReleaseContinuationPoints = args.ReleaseContinuationPoints;
            // now loop through all nodes to browse and build UaBrowseDescription objects
            for( var n=0; n<args.ContinuationPoints.length; n++ ) this.Request.ContinuationPoints[n] = args.ContinuationPoints[n].ContinuationPoint;

            // now to invoke Browse 
            if( isDefined( args.PreHook ) ) args.PreHook();
            this.UaStatus = session.browseNext( this.Request, this.Response );
            if( isDefined( args.PostHook ) ) args.PostHook();
            // now to check the results
            var result = false;
            if( this.UaStatus.isGood() ) {
                result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "ContinuationPoints #" + this.Request.ContinuationPoints.length + "; ReleaseContinuationPoints: " + this.Request.ReleaseContinuationPoints } );
                if( result ) {
                    if( isDefined( args.OperationResults ) ) result = checkBrowseNextError( this.Request, this.Response, expectedErrors );
                    else result = checkBrowseNextValidParameter( this.Request, this.Response );
                }
            }
            else addError( this.Name + "() failed: " + this.UaStatus, this.UaStatus );

            // now to record any continuationPoints into the monitoredItem objects
            if( this.UaStatus.isGood() ) {
                for( i=0; i<this.Response.Results.length; i++ ) {
                    args.ContinuationPoints[i].ContinuationPoint = this.Response.Results[i].ContinuationPoint;
                }//for i
            }

            return( result );
        }
    }//Execute
    
    this.ResultsToString = function() {
        var s = "BrowseNext Response:\n\tDiagnosticInfos:";
        // get the diags
        if( this.Response.DiagnosticInfos.length > 0 ) {
            for( var d=0; d<this.Response.DiagnosticInfos.length; d++ ) {
                s += "\n\t\t" + this.Response.DiagnosticInfos[d].toString();
            }//for s...
        }
        else {
            s += "\n\t\tNone.";
        }
        // get the results
        s += "\n\tResults:";
        if( this.Response.Results.length > 0 ) {
            var currResult;
            // loop thru each result
            for( var r=0; r<this.Response.Results.length; r++ ) {
                currResult = this.Response.Results[r]
                s += "\n\t[" + r + "] Status: " + currResult.StatusCode.toString() +
                    "; ContinuationPoint: " + currResult.ContinuationPoint.toString() +
                    "; References: " + currResult.References.length;
                // loop thru all references 
                var currRef;
                for( var f=0; f<currResult.References.length; f++ ) {
                    currRef = currResult.References[f];
                    s += "\n\t\t[" + f + "] BrowseName: " + currRef.BrowseName.Name +
                        "; IsForward: " + currRef.IsForward +
                        "; NodeClass: " +  NodeClass.toString( currRef.NodeClass ) +
                        "; NodeId: " + currRef.NodeId.toString() +
                        "; ReferenceType: " + currRef.ReferenceTypeId;
                }//for f
            }//for r...
        }
        else {
            s+= "\n\t\tNone."
        }
        return( s );
    }

}// BrowseNext


// the service is expected to succeed
// all operations are expected to succeed
function checkBrowseNextValidParameter( Request, Response ) {
    var bSucceeded = true;
    // check in parameters
    if( arguments.length != 2 ) {
        addError( "function checkBrowseNextValidParameter(): Number of arguments must be 2!" );
        return false;
    }
    // as this is a valid parameter test we don't expect any diagnositcinfo        
    if( Response.DiagnosticInfos.length !== 0 ) {
        addError( "BrowseNextResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
        bSucceeded = false;
    }    
    // check number of results
    if( Response.Results.length !== Request.ContinuationPoints.length ) {
        addError( "The number of results does not match the number of ContinuationPoints." );
        addError( "ContinuationPoints.length = " + Request.ContinuationPoints.length + "; Results.length = " + Response.Results.length );
        bSucceeded = false;
    }
    else { 
                /* NP Apr-11-2012: adding 2 new checks when ReleaseContinuationPoints=TRUE:
                                   (1) Results are empty
                                   (2) DiagnosticInfos are empty */
        if( Request.ReleaseContinuationPoints ) {
            Assert.Equal( 0, Response.Results.length, "ReleaseContinuationPoints=True, but BrowseNext.Response.Results[] is not empty. Review UA Part 4 Table 33 (BrowseNext Service Parameters)" );
            Assert.Equal( 0, Response.ResponseHeader.ServiceDiagnostics.length, "ReleaseContinuationPoints=True, but BrowseNext.ResponseHeader.ServiceDiagnostics[] is not empty. Review UA Part 4 Table 33 (BrowseNext Service Parameters)" );
        }
        else {
            // check each result
            for( var i=0; i<Response.Results.length; i++ ) {
                var browseResult = Response.Results[i];
                // status code
                if( browseResult.StatusCode.isNotGood() ) {
                    addError( "Results[" + i + "].StatusCode is not good. ", browseResult.StatusCode );
                    bSucceeded = false;
                    continue;
                }
                // check for ReleaseContinuationPoints
                if( Request.ReleaseContinuationPoints === true ) {
                    if( !browseResult.ContinuationPoint.isEmpty() ) {
                        addError( "Request.ReleaseContinuationPoints = true but Results[" + i + "].ContinuationPoint is not empty. " );
                        bSucceeded = false;
                        continue;
                    }
                    if( browseResult.References.length !== 0 ) {
                        addError( "Request.ReleaseContinuationPoints = true but Results[" + i + "].References.length = " + browseResult.References.length );
                        bSucceeded = false;
                        continue;
                    }
                }
                // check references node ids
                for( var r=0; r<Response.Results[i].References.length; r++ ) { // iterate thru all references 
                    if( !Assert.False( UaQualifiedName.IsEmpty( Response.Results[i].References[r].BrowseName ), "BrowseName cannot be empty." ) ) result = false;
                    if( !Assert.True( UaNodeId.Validate( Response.Results[i].References[r].NodeId.NodeId ), "NodeId is not valid." ) ) result = false;
                    if( !Assert.True( UaNodeId.Validate( Response.Results[i].References[r].TypeDefinition.NodeId ), "TypeDefinition is not valid." ) ) result = false;
                }
            }
        }// if( release continuation points)
    }

    return bSucceeded;
}




// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaBrowseNextRequest
// Response is of Type UaBrowseNextResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/Objects/expectedResults.js)
function checkBrowseNextError( request, response, expectedOperationResultsArray )
{
    // check in parameters
    if( arguments.length !== checkBrowseNextError.length )
    {
        addError( "function checkBrowseNextError(): Number of arguments must be " + checkBrowseNextError.length );
        return( false );
    }
    
    // ExpectedOperationResultsArray needs to have the correct size
    if( expectedOperationResultsArray.length !== request.ContinuationPoints.length )
    {
        addError( "checkBrowseNextError: ExpectedOperationResultsArray[] must have the same size as Request.ContinuationPoints[]" );
        return( false );
    }  
    // check results        
    // check number of results
    if( response.Results.length !== request.ContinuationPoints.length )
    {
        addError( "The number of results does not match the number of ContinuationPoints." );
        addError( "ContinuationPoints.length=" + request.ContinuationPoints.length + "; Results.length=" + response.Results.length );
    }
    else
    {        
        // check each result
        for( var i=0; i<response.Results.length; i++ )
        {
            var browseResult = response.Results[i];
            // check if result matches any of the expected status code
            Assert.StatusCodeIsOneOf( expectedOperationResultsArray[i], browseResult.StatusCode, "Response.Results[" + i + "].StatusCode" );
            // check for ReleaseContinuationPoints
            if( request.ReleaseContinuationPoints === true )
            {
                if( !browseResult.ContinuationPoint.isEmpty() )
                {
                    addError( "Request.ReleaseContinuationPoints = true but Results[" + i + "].ContinuationPoint is not empty. " );
                    continue;
                }
                if( browseResult.References.length !== 0 )
                {
                    addError( "Request.ReleaseContinuationPoints = true but Results[" + i + "].References.length = " + browseResult.References.length );
                    continue;
                }
            }
        }
    }    
}