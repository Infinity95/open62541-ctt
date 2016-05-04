include( "./library/ServiceBased/ViewServiceSet/Browse/get_default_request.js" );

/*  Browse Service call helper object. This object is intended to reduce the level of scripting required for testing
    of the Browse service to just 1 line of code.
    Test code at the bottom of this file demonstrates the use of this class.

    Properties:
        - session:    A live UA Session that will be used to invoke the Browse service call.
        - request:    The current (last used) BrowseRequest object.
        - response:   The current (last received) BrowseResponse object.

    Methods: 
        - Execute:         Invokes the Browse service call.
        - ResultsToString: Returns the Browse response details in a string. */

function BrowseService( args ) {
    this.Name = "Browse";
    this.Session  = null;
    this.Request  = null;
    this.Response = null;
    this.UaStatus = null;

    if( !isDefined( args ) ) throw( this.Name + " CTOR, arguments not specified." );
    if( !isDefined( args.Session ) ) throw( this.Name + " CTOR, session not specified." );
    else this.Session = args.Session;

    /* Invokes the call to Browse.
        Parameters: 
            - NodesToBrowse:    a node or an array of MonitoredItem objects to Browse
            - MaxRefsToReturn:  max # of references to return.
            - View:             view (a UaViewDescription object).
            - ExpectedErrors:   expected results, can be 1 or an array of...
            - ExpectError: boolean specifying if browse should fail, or values within
            - SuppressMessaging: true=do not display verbose messages. */
    this.Execute = function( args ) {
        if( !isDefined( args ) ){ throw( "Browse.js::Execute() 'args' method not specified." ); }
        if( !isDefined( args.NodesToBrowse ) ){ throw( "Browse.js::Execute 'args.NodesToBrowse' not specified." ); }
        if( !isDefined( args.MaxReferencesToReturn ) ){ args.MaxReferencesToReturn = 0; }
        if( !isDefined( args.SuppressMessaging ) ) args.SuppressMessaging = false;

        // create the request/response objects
        this.Request = new UaBrowseRequest();
        this.Response = new UaBrowseResponse();
        var session = isDefined( this.Session.Session )? this.Session.Session : this.Session;
        this.Request.RequestHeader = UaRequestHeader.New( { Session: session } );
        // populate the request header with the specified parameters
        // configure the BrowseNext request
        this.Request.RequestedMaxReferencesPerNode = args.MaxReferencesToReturn;
        if( isDefined( args.View ) ) this.Request.View = args.View;
        if( args.NodesToBrowse.length === undefined ) args.NodesToBrowse = [args.NodesToBrowse];
        // now loop through all nodes to browse and build UaBrowseDescription objects
        for( var n=0; n<args.NodesToBrowse.length; n++ ) {
            // create the browseDescription object for this monitoredItem
            var uaBD = new UaBrowseDescription();
            if( isDefined( args.NodesToBrowse[n].NodeId ) ) uaBD.NodeId = args.NodesToBrowse[n].NodeId;
            else uaBD.NodeId = args.NodesToBrowse[n];
            if( args.NodesToBrowse[n].BrowseDirection !== undefined && args.NodesToBrowse[n].BrowseDirection !== null ){ uaBD.BrowseDirection = args.NodesToBrowse[n].BrowseDirection; }
            if( args.NodesToBrowse[n].IncludeSubtypes !== undefined && args.NodesToBrowse[n].IncludeSubtypes !== null ){ uaBD.IncludeSubtypes = args.NodesToBrowse[n].IncludeSubtypes; }
            if( args.NodesToBrowse[n].NodeClass       !== undefined && args.NodesToBrowse[n].NodeClass       !== null ){ uaBD.NodeClassMask   = args.NodesToBrowse[n].NodeClass; }
            if( args.NodesToBrowse[n].ReferenceTypeId !== undefined && args.NodesToBrowse[n].ReferenceTypeId !== null ){ uaBD.ReferenceTypeId = args.NodesToBrowse[n].ReferenceTypeId; }
            if( args.NodesToBrowse[n].ResultMask      !== undefined && args.NodesToBrowse[n].ResultMask      !== null ){ uaBD.ResultMask      = args.NodesToBrowse[n].ResultMask; }
            // add this browseDescription to the request
            if( !args.SuppressMessaging ) print( "\t[" + n + "] NodeId: " + uaBD.NodeId
                    + "; BrowseDirection: " + BrowseDirection.toString( uaBD.BrowseDirection )
                    + "; IncludeSubtypes: " + uaBD.IncludeSubtypes
                    + "; NodeClassMask: " + uaBD.NodeClassMask
                    + "; ReferenceTypeId: " + uaBD.ReferenceTypeId
                    + "; ResultMask: " + BrowseResultMask.toString( uaBD.ResultMask ) );
            this.Request.NodesToBrowse[n] = uaBD;
        }//for n
        if( !args.SuppressMessaging ) print( "Created " + this.Request.NodesToBrowse.length + " Request.NodesToBrowse objects. Invoking BROWSE..." );

        // now to invoke Browse 
        if( isDefined( args.PreHook ) ) args.PreHook();
        this.UaStatus = session.browse( this.Request, this.Response );
        if( isDefined( args.PostHook ) ) args.PostHook();
        var result = false;
        if( this.UaStatus.isGood() ) {
            result = UaResponseHeader.IsValid( { Service: this, ServiceResult: args.ServiceResult, SuppressMessaging: args.SuppressMessaging, SuppressErrors: args.SuppressErrors, ServiceInfo: "NodesToBrowse: " + this.Request.NodesToBrowse.length } );
            if( result ) {
                if( isDefined( args.OperationResults ) ) result = checkBrowseError( this.Request, this.Response, args.OperationResults, args.SuppressMessaging );
                else if( this.Response.ResponseHeader.ServiceResult.isGood() ) result = checkBrowseValidParameter( this.Request, this.Response );
            }
        }
        else addError( "Browse() failed: " + this.UaStatus, this.UaStatus );

        // now to record any continuationPoints into the monitoredItem objects
        if( this.UaStatus.isGood() ) {
            for( i=0; i<this.Response.Results.length; i++ ) {
                args.NodesToBrowse[i].ContinuationPoint = this.Response.Results[i].ContinuationPoint;
                args.NodesToBrowse[i].ReferenceDescriptions = [];
                for( var r=0; r<this.Response.Results[i].References.length; r++ ) {
                    args.NodesToBrowse[i].ReferenceDescriptions.push( this.Response.Results[i].References[r].clone() );
                }
            }//for i
        }
        return( result );
    }//this.Execute = function( args )
    
    this.ResultsToString = function() {
        var s = "Browse Response:\n\tDiagnosticInfos:";
        // get the diags
        if( this.Response.DiagnosticInfos.length > 0 ) {
            for( var d=0; d<this.Response.DiagnosticInfos.length; d++ ) s += "\n\t\t" + this.Response.DiagnosticInfos[d].toString();
        }
        else{ s += "\n\t\tNone."; }
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
        else{ s+= "\n\t\tNone." }
        return( s );
    }
}// function BrowseService( session )



// the service is expected to succeed
// all operations are expected to succeed
function AssertBrowseValidParameter( request, response ) {
    var result = true;
    if ( !Assert.Equal( 2, arguments.length, "assertBrowseValidParameter(): Number of arguments must be 2!" ) ) {
        return( false );
    }

    // check response header
    result = UaResponseHeader.IsValid( { Service: { Name: "Browse", Request: request, Response: response } } );
    
    // check results        
    // check number of results
    if( Assert.Equal( request.NodesToBrowse.length, response.Results.length, "The number of NodesToBrowse does not match the number of Results." ) ) {        
        // check each result
        for( var i = 0; i < response.Results.length; i++ ) {
            var browseResult = response.Results[i];
            
            // status code
            if( browseResult.StatusCode.isNotGood() ) {
                addError( "Results[" + i + "].StatusCode is not good: " + browseResult.StatusCode, browseResult.StatusCode );
                result = false;
                continue;
            }
            
            if( browseResult.StatusCode.StatusCode !== StatusCode.Good ) {
                addError( "Results[" + i + "].StatusCode is unexpected: " + browseResult.StatusCode, browseResult.StatusCode );
                result = false;
            }
            if( !browseResult.ContinuationPoint.isEmpty() ) {
                addLog( "Results[" + i + "].ContinuationPoint is not empty." );
            }
        }
    }
    // check diagnostic infos
    // no error is expected so the DiagnosticInfos should be empty
    AssertDiagnosticInfosEmpty( response.DiagnosticInfos );
    return( result );
}


// the service is expected to succeed
// operations can fail or succeed
function AssertBrowseMixedParameter( request, response, expectedOperationResults ) {
    if( !Assert.Equal( 3, arguments.length, "AssertBrowseMixedParameter(): Number of arguments must be 3!" ) ) return;
    // check response header
    UaResponseHeader.IsValid( { Service: { Name: "Browse", Request: request, Response: response } } );
    // check number of results
    var itemsUnavailable=0;
    if( Assert.Equal( request.NodesToBrowse.length, response.Results.length, "The number of NodesToBrowse does not match the number of Results." ) ) {        
        // check each result
        for( var i=0; i<response.Results.length; i++ ) {
            var browseResult = response.Results[i];
            if( expectedOperationResults[i] === undefined || expectedOperationResults[i] === null ) {
                if( browseResult.StatusCode.isNotGood() ) {
                    addError( "Browse().Response.Results[" + i + "].StatusCode is not good: " + browseResult.StatusCode + ". Expected: Good.", browseResult.StatusCode );
                    itemsUnavailable++;
                    continue;
                }
            }
            else {
                Assert.StatusCodeIsOneOf( expectedOperationResults[i], browseResult.StatusCode, "Results[" + i + "].StatusCode"  );
                if( browseResult.StatusCode.isNotGood() ) {
                    itemsUnavailable++;
                    continue;
                }
            }

            if( browseResult.StatusCode.StatusCode !== StatusCode.Good ) {
                itemsUnavailable++;
                addError( "Results[" + i + "].StatusCode is unexpected: " + browseResult.StatusCode, browseResult.StatusCode );
            }
            if( !browseResult.ContinuationPoint.isEmpty() ) {
                addLog( "Results[" + i + "].ContinuationPoint is not empty." );
            }
        }
    }

    // check diagnostic infos
    // no error is expected so the DiagnosticInfos should be empty
    if( itemsUnavailable === 0 ) AssertDiagnosticInfosEmpty( response.DiagnosticInfos );
}


// Verify that a Browse or BrowseNext "fundamentally" succeeded at the ServiceResult level
function AssertBasicBrowseServiceSuccess( uaStatus, response, numNodesToBrowse ) {
    var rc = false;
    if( !uaStatus.isGood() ) addError( "Browse() status " + uaStatus, uaStatus );
    else if( !response.ResponseHeader.ServiceResult.isGood() ) addError( "Browse() status " + response.ResponseHeader.ServiceResult, response.ResponseHeader.ServiceResult );
    else if( response.Results.length != numNodesToBrowse ) addError( "Browse() Results not correct length" );
    else rc = true;
    return rc;
}


/* Verify that a Browse or BrowseNext "fundamentally" appears to have succeeded.
   expectedStatusResults is an array of ExpectedAndAcceptedResults objects.
   If expectedStatusResults is not provided, the operation status codes must be good.
   If expectedStatusResults is provided, the operation status codes must match a status code
   in expectedStatusResults.
*/
function AssertBasicBrowseSuccess( uaStatus, response, request, expectedStatusResults ) {
    var pass = AssertBasicBrowseServiceSuccess( uaStatus, response, request.NodesToBrowse.length );
    if( pass ) {
        var mustBeGood = ( expectedStatusResults === undefined || expectedStatusResults === null );
        for( var i = 0; i < response.Results.length; i++ ) {
            if ( mustBeGood ) {
                if( !response.Results[i].StatusCode.isGood() ) {
                    var errMessage = "Browse() Results[" + i + "].StatusCode is not good: " + response.Results[i].StatusCode + 
                            " reading NodeId: '" + request.NodesToBrowse[i].NodeId + "' (setting: '" + 
                            findSettings( request.NodesToBrowse[i].NodeId ) + "')";
                    pass = false;
                    if( response.Results[i].StatusCode.StatusCode !== StatusCode.BadNotSupported ) {
                        if( response.Results[i].StatusCode.StatusCode === StatusCode.BadNodeIdUnknown ) {
                            addWarning( errMessage, response.Results[i].StatusCode );
                        }
                        else {
                            addError( errMessage, response.Results[i].StatusCode );
                        }
                    }
                }
            }
            else {
                pass = Assert.StatusCodeIsOneOf( expectedStatusResults[i], response.Results[i].StatusCode, "Response.Results[" + i + "].StatusCode" );
            }
        }
    }
    
    return pass;
}


// ReferenceDescription equality comparison. Just using toString(); is that safe?
function AssertReferenceDescriptionsEqual( expectedReference, actualReference, message ) {
    return Assert.Equal( expectedReference.toString(), actualReference.toString(), message );
}


// Compare the contents of two arrays of ReferenceDescriptions.
// The actualReferences need not contain every expectedReference.
function AssertArrayContainsReferences( expectedReferences, actualReferences ) {
    for( var i = 0; i < actualReferences.length; i++ ) {
        AssertReferenceDescriptionsEqual( expectedReferences[i], actualReferences[i], "Expected reference does not match browsed reference.");
    }
}


// Compare two arrays of references for equality.
function AssertReferenceArraysEqual( expectedReferences, actualReferences)
{
    if( Assert.Equal( expectedReferences.length, actualReferences.length, "Number of expected references did not match number number of browsed references." ) )
    {
        AssertArrayContainsReferences( expectedReferences, actualReferences );
        addLog("All " + actualReferences.length + " expected references checked");
    }
}


// Compare two arrays of references. All actualReferences must be in 
// expectedReferences, but expectedReferences may be bigger.
function AssertReferenceArrayContainsSome( expectedReferences, actualReferences )
{
    if( expectedReferences.length >= actualReferences.length )
    {
        AssertArrayContainsReferences( expectedReferences, actualReferences );
        addLog( "Returned references (" + actualReferences.length + ") checked" );
    }
    else
    {
        addError( "Too many references returned" );
    }
}


// The result should contain the expected references (unless there
// were too many references in the result).
function AssertResultHasExpectedReferences( expectedReferences, result, maxReferences )
{
    if( result.StatusCode.StatusCode === StatusCode.Good )
    {
        if( result.ContinuationPoint.isEmpty() )
        {
            // verify all returned references are equal to all expected references
            AssertReferenceArraysEqual( expectedReferences, result.References );
        }
        else
        {
            addWarning( "ContinuationPoint indicates more references exist. Only the first returned references will be validated." );
            
            // there should be at least one reference and fewer than all the references
            if( Assert.InRange( 1, maxReferences-1, result.References.length, "Invalid number of references returned." ) )
            {
                AssertReferenceArrayContainsSome( expectedReferences, result.References );
            }
        }
    }
    else
    {
        addError( "Operation result status code is not Good: " + result.StatusCode, result.StatusCode );
    }
}


/* This function will take an array of nodesToFind, these are the nodes that we have received, and we will then
   see if they exist in a cached nodeList. The nodes may or may not be in order.
   This function is used in the Browsing cases where the order of the results may come back differently on
   successive calls.
   
   Revision History:
       11-Mar-2011 NP: Initial version. */
function AssertNodeReferencesInListNotOrdered( nodesToFind, nodeList )
{
    // turn nodeList into an array if it is not already one.
    if( nodeList.length === undefined )
    {
        nodeList = [nodeList];
    }
    var result = true;
    var i; // i is the nodesToFind loop
    var l; // l is the nodeList loop.
    var found;
    for( i=0; i<nodesToFind.length; i++ )
    {
        found = false;
        // can we find nodesToFind[i] in nodeList?
        for( l=0; l<nodeList.length; l++ )
        {
            if( nodesToFind[i].ReferenceTypeId.equals( nodeList[l].ReferenceTypeId ) )
            {
                found = true;
                break; //break from "l" loop
            }//we have a match
        }//for l
        // if we got here and we didn't find the node, then the function fails
        if( found )
        {
            addLog( "Found Reference '" + nodesToFind[i] + "' in the response as expected." );
        }
        else
        {
            result = false;
            addError( "Expected to find Reference '" + nodesToFind[i] + "' somewhere in the response (not expecting the results to be sorted) but could not find it in the response anywhere." );
        }
    }//for i
    return( result );
}

// Each reference in references should be of one of the expectedTypes.
function AssertReferencesAreOfTypes( expectedTypes, references )
{
    for( var i = 0; i < references.length; i++ )
    {
        var found = false;
        for( var n = 0; n < expectedTypes.length; n++)
        {
            if( expectedTypes[n].equals( references[i].ReferenceTypeId ) )
            {
                found = true;
                break;
            }
        }
        Assert.True( found, "ReferenceTypeId <" + references[i].ReferenceTypeId + "> not expected." );
    }
}


// Validate that ReferenceDescription fields are either null or match the
// expectedReference depending on the resultMask.
function AssertReferenceDescriptionFieldsMatchMask( resultMask, expectedReference, reference, referenceText ) {
    if( resultMask & 1 ) Assert.NodeIdsEqual( expectedReference.ReferenceTypeId, reference.ReferenceTypeId, referenceText + "ReferenceTypeId does not match" );
    else Assert.NodeIdIsNull( reference.ReferenceTypeId, referenceText + "ReferenceTypeId is not a null NodeId" );

    if( resultMask & 2 ) Assert.Equal( expectedReference.IsForward, reference.IsForward, referenceText + "IsFoward does not match" );
    else Assert.False( reference.IsForward, referenceText + "IsForward is not false" );

    if( resultMask & 4 ) Assert.Equal( expectedReference.NodeClass, reference.NodeClass, referenceText + "NodeClass does not match" );
    else Assert.Equal( 0, reference.NodeClass, referenceText + "NodeClass is not zero" );

    if( resultMask & 8 ) Assert.QualifiedNamesEqual( expectedReference.BrowseName, reference.BrowseName, referenceText + "BrowseName does not match" );
    else Assert.QualifiedNameIsNull( reference.BrowseName, referenceText + "BrowseName is not null or empty" );

    if( resultMask & 16 ) Assert.LocalizedTextsEqual( expectedReference.DisplayName, reference.DisplayName, referenceText + "DisplayName does not match" );
    else Assert.LocalizedTextIsNull( reference.DisplayName, referenceText + "DisplayName is not null or empty" );

    if( resultMask & 32 ) Assert.ExpandedNodeIdsEqual( expectedReference.TypeDefinition, reference.TypeDefinition, referenceText + "TypeDefinition does not match" );
    else Assert.ExpandedNodeIdIsNull( reference.TypeDefinition, referenceText + "TypeDefinition is not null or empty" );
}// function AssertReferenceDescriptionFieldsMatchMask( resultMask, expectedReference, reference, referenceText ) 




// the service is expected to succeed
// all operations are expected to succeed
function checkBrowseValidParameter( Request, Response ) {
    var bSucceeded = true;
    if( arguments.length !== 2 ) {
        addError( "function checkBrowseValidParameter(): Number of arguments must be 2!" );
        return false;
    }
    // check number of results
    if( Response.Results.length !== Request.NodesToBrowse.length ) {
        addError( "The number of results does not match the number of NodesToBrowse. NodesToBrowse.length = " + Request.NodesToBrowse.length + "; Results.length = " + Response.Results.length );
        bSucceeded = false;
    }
    else {        
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            var browseResult = Response.Results[i];
            // status code
            if( browseResult.StatusCode.isNotGood() ) {
                addError( "Browse.Results[" + i + "].StatusCode is: " + browseResult.StatusCode, browseResult.StatusCode );
                bSucceeded = false;
                continue;
            }
            // node ids
            for( var r=0; r<Response.Results[i].References.length; r++ ) { // iterate thru all references 
                if( !Assert.False( UaQualifiedName.IsEmpty( Response.Results[i].References[r].BrowseName ), "Browse.Response.Results[" + i + "].References[" + r + "].BrowseName is empty: '" + Response.Results[i].References[r].BrowseName + "'.\nBrowse.Response.Results[" + i + "].References[" + r + "].NodeId: " + Response.Results[i].References[r].NodeId.NodeId + "\nBrowse.Request.NodesToBrowse[" + i + "].NodeId: " + Request.NodesToBrowse[i].NodeId + "; BrowseDirection: " + BrowseDirection.toString( Request.NodesToBrowse[i].BrowseDirection ) + "." ) ) bSucceeded = false;
                if( !Assert.True( UaNodeId.Validate( Response.Results[i].References[r].NodeId.NodeId ), "Browse.Response.Results[" + i + "].References[" + r + "].NodeId is not valid." ) ) bSucceeded = false;
                if( !Assert.True( UaNodeId.Validate( Response.Results[i].References[r].TypeDefinition.NodeId ), "Browse.Response.Results[" + i + "].References[" + r + "].TypeDefinition is not valid." ) ) bSucceeded = false;
            }
            // max references per node
            if( ( Request.RequestedMaxReferencesPerNode != 0 ) && ( browseResult.References.length > Request.RequestedMaxReferencesPerNode ) ) {
                addError( "The server returned more references than requested.\nBrowse.Results[" + i + "].References.length = " + browseResult.References.length + " but Request.RequestedMaxReferencesPerNode = " + Request.RequestedMaxReferencesPerNode );
                bSucceeded = false;
                continue;
            }
        }
    }
    return bSucceeded;
}


// the service is expected to succeed
// one, some or all operations are expected to fail
// This function checks if the server returned the expected error codes
// Request is of Type UaBrowseRequest
// Response is of Type UaBrowseResponse
// ExpectedOperationResultsArray is an array ExpectedAndAcceptedResult (defined in Base/Objects/expectedResults.js)
function checkBrowseError( Request, Response, ExpectedOperationResultsArray, SuppressMessaging ) {
    // check in parameters
    if( !isDefined( [ Request, Response, ExpectedOperationResultsArray ] ) ) {
        addError( "function checkBrowseError(): Check 'Request', 'Response', and 'ExpectedOperationResultsArray'." );
        return( false );
    }
    if( !isDefined( SuppressMessaging ) ) SuppressMessaging = false;
    if( !isDefined( ExpectedOperationResultsArray.length ) ) ExpectedOperationResultsArray = [ ExpectedOperationResultsArray ];
    if( ExpectedOperationResultsArray.length !== Request.NodesToBrowse.length ) {
        addError( "checkBrowseError: ExpectedOperationResultsArray[" + ExpectedOperationResultsArray.length + "] must have the same size as Request.NodesToBrowse[" + Request.NodesToBrowse.length + "]" );
        return( false );
    }
    // check results        
    // check number of results
    if( Response.Results.length !== Request.NodesToBrowse.length ) {
        addError( "The number of results does not match the number of NodesToBrowse." );
        addError( "Browse.Request.NodesToBrowse.length=" + Request.NodesToBrowse.length + "; Browse.Response.Results.length=" + Response.Results.length );
    }
    else {        
        // check each result
        for( var i=0; i<Response.Results.length; i++ ) {
            var browseResult = Response.Results[i];
            var bMatch = false;
            // check if result matches any of the expected status code
            for( var j=0; j<ExpectedOperationResultsArray[i].ExpectedResults.length; j++ ) {
                if( browseResult.StatusCode.StatusCode == ExpectedOperationResultsArray[i].ExpectedResults[j].StatusCode ) {
                    if( !SuppressMessaging ) print( "\tBrowse.Response.Results[" + i + "].StatusCode = " + browseResult.StatusCode + " as expected.", browseResult.StatusCode );
                    bMatch = true;
                    break;
                }
            }
            if( !bMatch ) {
                // check if result matches any of the accepted status codes
                for( var j=0; j<ExpectedOperationResultsArray[i].AcceptedResults.length; j++ ) {
                    if( browseResult.StatusCode.StatusCode == ExpectedOperationResultsArray[i].AcceptedResults[j].StatusCode ) {
                        bMatch = true;
                        break;
                    }
                }
                if( bMatch ) {
                    addWarning( "Response.Results[" + i + "].StatusCode = " + browseResult.StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", browseResult.StatusCode );
                }
                else {
                    addError( "Response.Results[" + i + "].StatusCode = " + browseResult.StatusCode + " but " + ExpectedOperationResultsArray[i].ExpectedResults[0] + " was expected", browseResult.StatusCode );
                }
            }
            // max references per node
            if( ( Request.RequestedMaxReferencesPerNode != 0 ) && ( browseResult.References.length > Request.RequestedMaxReferencesPerNode ) ) {
                addError( "The server returned more references than requested." );
                addError( "Browse.Response.Results[" + i + "].References.length = " + browseResult.References.length + " but Browse.Request.RequestedMaxReferencesPerNode = " + Request.RequestedMaxReferencesPerNode );
                bSucceeded = false;
                continue;
            }
        }
    }    
    return( true );
}