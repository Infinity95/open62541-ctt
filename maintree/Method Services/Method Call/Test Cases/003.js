/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Call a method that has OUT parameters only, e.g.void method( in ); */

function methodCallTest() {
    // Read method name setting. If setting is empty, return
    var methodName = MonitoredItem.fromNodeIds( UaNodeId.fromString( Settings.ServerTest.NodeIds.Methods.OArgs ) )[0];
    if ( !isDefined( methodName ) ) {
       addSkipped( "Method with 'out' only parameter(s) not specified in settings." );
       return false;
    }
    // find the parent object
    var methodObject = init_GetMethodParent( methodName );
    if ( !isDefined( methodObject ) ) {
       addError( "Method's parent could not be detected." );
       return false;
    }
    var result = true;
    //Make sure method exists; and get the parameter nodes so we can read them
    var paramInNodeId, paramOutNodeId;
    if( TranslateBrowsePathsToNodeIdsHelper.Execute( {
                    Node: methodName,
                    UaBrowsePaths: [ TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "InputArguments" ] ),
                                     TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "OutputArguments" ] ) ],
                    OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
                                        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ] } ) ) {
        if( Assert.Equal( 2, TranslateBrowsePathsToNodeIdsHelper.Response.Results.length, "2 TranslateBrowsePathsToNodeIds Results expected." ) ) {
            if( !Assert.Equal( 0, TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets.length, "TranslateBrowsePathsToNodeIdsHelper.Response[0].Targets NOT expected." ) ) {
                paramInNodeId = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
            }
            if( Assert.GreaterThan( 0, TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets.length, "TranslateBrowsePathsToNodeIdsHelper.Response[1].Targets expected." ) ) {
                paramOutNodeId = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0];
            }
        }
        else result = false;
    }
    // do we have the right parameter setup? if so then set a value and then invoke
    if( !isDefined( paramInNodeId ) && isDefined( paramOutNodeId ) ) {
        if( ReadHelper.Execute( { NodesToRead: paramOutNodeId } ) ) {
            if( result ) result = CallHelper.Execute( {
                    ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ),OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good, StatusCode.BadNoMatch ) ],
                    MethodsToCall: [ { MethodId: new UaNodeId.fromString( methodName.NodeId.toString() ), 
                                       ObjectId: new UaNodeId.fromString( methodObject.NodeId.toString() ) } ] } );

        }// read
    }
    else {
        addError( "The method signature is not correct for this test. Only 'out' parameters are needed. Please check settings." );
        result = false;
    }
    return( result );
}

Test.Execute( { Procedure: methodCallTest } );