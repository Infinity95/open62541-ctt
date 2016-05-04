/*  TranslateBrowsePathsToNodeIds Service call helper object. This object is intended
    to reduce the level of scripting required for testing to just 1 line of code.
    Test code at the bottom of this file demonstrates the use of this class.

    Properties:
        - Session:    A live UA Session that will be used to invoke the Browse service call.
        - Request:    The current (last used) BrowseRequest object.
        - Response:   The current (last received) BrowseResponse object.

    Methods: 
        - Execute:         Invokes the Browse service call.
*/

function TranslateBrowsePathsToNodeIdsService( args ) {
    this.Name = "TranslateBrowsePathsToNodeIds";
    this.Session = null;
    this.Request = null;
    this.Response = null;
    this.UaStatus = null;
    this.callCount = 0;
    
    // CTOR
    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;

    /* Execute method - where the simplification of this call takes place
       Parameters: 
           - UaBrowsePaths[] - an array of UaBrowsePath objects
           - BrowsePaths[] - an array of strings, each the name of a path
           - Node - a node id to use;
           - ServiceResult - an ExpectedAndAcceptedResults object - specify when expecting a failure only!
           - OperationResults - an array of ExpectedAndAcceptedResults objects.
           - SuppressMessaging - true=no output
       Note: use either UaBrowsePaths or BrowsePaths - do not use both!
       Note: if using BrowsePaths - then also specify Node; otherwise node is not needed */
    this.Execute = function( args ) {
        if( !isDefined( args ) ) throw( "TranslateBrowsePathsHelper.Execute argument missing." );
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;
        if( isDefined( args.OperationResults ) && !isDefined( args.OperationResults.length ) ) args.OperationResults = [ args.OperationResults ];
        var result = true;
        // create new instances of our request and response objects
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request  = new UaTranslateBrowsePathsToNodeIdsRequest();
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        this.Response = new UaTranslateBrowsePathsToNodeIdsResponse();
        // check if BrowsePaths argument exists; if so then use it...
        if( isDefined( args.BrowsePaths ) ) {
            // we are converting an array of strings into browse paths...
            if( isDefined( args.Node ) ) args.NodeIds = [ args.Node ];
            if( !isDefined( args.NodeIds ) ) throw( "TranslateBrowsePathsToNodeIds.Execute() args.NodeIds not specified." );
            if( !isDefined( args.NodeIds.length ) ) args.NodeIds = [ args.NodeIds ];
            for( var n=0; n<args.NodeIds.length; n++ ) {
                this.Request.BrowsePaths[n] = this.stringsToBrowsePaths( args.NodeIds[n], args.BrowsePaths );
            }
        }
        else if( isDefined( args.UaBrowsePaths ) ) {
            // we are passing browse paths from the request into the call...
            if( args.UaBrowsePaths.length === undefined ) args.UaBrowsePaths = [args.UaBrowsePaths];
            for( var b=0; b<args.UaBrowsePaths.length; b++ ) {
                this.Request.BrowsePaths[b] = args.UaBrowsePaths[b];
            }//for b
        }
        else {
            throw( "TranslateBrowsePathsHelper.Execute() called with invalid arguments. No browsing paths specified!" );
        }
        // issue the call
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.translateBrowsePathsToNodeIds( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "BrowsePaths:#" + this.Request.BrowsePaths.length } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkTranslateBrowsePathsToNodeIdsError( this.Request, this.Response, args.OperationResults, args.SuppressMessaging );
                if( isDefined( args.ExpectedResults ) ) result = checkTranslateBrowsePathsToNodeIdsError( this.Request, this.Response, args.ExpectedResults, args.SuppressMessaging );
                else result = checkTranslateBrowsePathsToNodeIdsValidParameter( this.Request, this.Response );
            }
        }
        else result = false;
        return( result );
    }// this.Execute = function( args )


    /* internal private function for converting string[] to some default
       UaBrowsePath objects where:
           - IncludeSubtypes = false;
           - IsInverse = false;
           - ReferenceTypeID = null;
           - TargetName = the specified string */
    this.stringsToBrowsePaths = function( node, strings ) {
        if( !isDefined( [ node, strings ] ) ){ throw( "TranslateBrowsePathsHelper.stringsToBrowsePaths argument(s) missing." ); }
        if( strings.length === undefined ){ strings = [strings]; }//convert to an array
        // create the browse path and specify the starting node
        var bp = new UaBrowsePath();
        if( isDefined( node.NodeId ) ) {
            bp.StartingNode = node.NodeId;
        }
        else {
            bp.StartingNode = node;
        }
        // now create the relative paths
        for( var i=0; i<strings.length; i++ ) {
            // create the relative path element
            var rpe = new UaRelativePathElement();
            rpe.IncludeSubtypes = true;
            rpe.IsInverse = false;
            rpe.TargetName.Name = strings[i];
            // add the element to the browse path elements collection
            bp.RelativePath.Elements[i] = rpe;
        }//for i
        return( bp );
    }// this.stringsToBrowsePaths = function( node, strings )
}// function TranslateBrowsePathsToNodeIdsService( session ) 





// the service is expected to succeed
// all operations are expected to succeed
function checkTranslateBrowsePathsToNodeIdsValidParameter( request, response ) {
    var succeeded = true;
    // check in parameters
    if( arguments.length !== 2 ) {
        addError( "function checkTranslateBrowsePathsToNodeIdsValidParameter(): Number of arguments must be 2!" );
        return false;
    }
    // as this is a valid parameter test we don't expect any diagnosticinfo        
    if( response.DiagnosticInfos.length !== 0 ) {
        addError( "UaTranslateBrowsePathsToNodeIdsResponse.DiagnosticInfos was returned. No DiagnosticInfos were expected" );
        succeeded = false;
    }
    // check results        
    // check number of results
    if( response.Results.length !== request.BrowsePaths.length ) {
        addError( "The number of results does not match the number of BrowsePaths." );
        addError( "BrowsePaths.length = " + request.BrowsePaths.length + "; Results.length = " + response.Results.length );
        succeeded = false;
    }
    else {
        // check each result
        for( var i=0; i<response.Results.length; i++ ) {
            var browsePathResult = response.Results[i];
            // status code
            if( !Assert.StatusCodeIs( StatusCode.Good, browsePathResult.StatusCode, "Results[" + i + "].StatusCode is not Good" ) ) {
                succeeded = false;
                continue;
            }
        }
    }
    return succeeded;
}// function checkTranslateBrowsePathsToNodeIdsValidParameter( request, response )




// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaTranslateBrowsePathsToNodeIdsRequest
// Response is of Type UaTranslateBrowsePathsToNodeIdsResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/Objects/expectedResults.js)
function checkTranslateBrowsePathsToNodeIdsError( Request, Response, ExpectedOperationResultsArray, SuppressMessaging ) {
    // check in parameters
    if( arguments.length < 3 ) {
        addError( "function checkTranslateBrowsePathsToNodeIdsError(): Number of arguments must be 3" );
        return( false );
    }
    // ExpectedOperationResultsArray needs to have the correct size
    if( ExpectedOperationResultsArray.length !== Request.BrowsePaths.length ) {
        addError( "checkTranslateBrowsePathsToNodeIdsError: ExpectedOperationResultsArray[] (size: " + ExpectedOperationResultsArray.length + ") must have the same size as Request.BrowsePaths[] (size: " + Request.BrowsePaths.length + ")." );
        return( false );
    }
    var success = true;
    // check results        
    // check number of results
    if( Response.Results.length !== Request.BrowsePaths.length ) {
        addError( "The number of results does not match the number of BrowsePaths." );
        addError( "BrowsePaths.length=" + Request.BrowsePaths.length + "; Results.length=" + Response.Results.length );
        return( false );
    }
    else {        
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            var browsePathResult = Response.Results[i];
            var bMatch = false;
            // check if result matches any of the expected status code
            for( var j=0; j < ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                if( browsePathResult.StatusCode.StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    if( !SuppressMessaging ) print( "\tResponse.Results[" + i + "].StatusCode = " + browsePathResult.StatusCode );
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( browsePathResult.StatusCode.StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "Response.Results[" + i + "].StatusCode = " + browsePathResult.StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", browsePathResult.StatusCode );
                }
                else {
                    addError( "Response.Results[" + i + "].StatusCode = " + browsePathResult.StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", browsePathResult.StatusCode );
                    success = false;
                }
            }
        }
    }    
    return( success );
}// function checkTranslateBrowsePathsToNodeIdsError( Request, Response, ExpectedOperationResultsArray, SuppressMessaging )