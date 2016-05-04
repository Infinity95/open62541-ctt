/*  Test prepared by nathan.pocock@opcfoundation.org
    Description: Call a method that does not use any parameters, e.g.void method(); */

function methodCallTest() {
    var methodName = MonitoredItem.fromNodeIds( UaNodeId.fromString( Settings.ServerTest.NodeIds.Methods.NoArgs ) )[0];
    if ( !isDefined( methodName ) ) {
       addSkipped( "MethodNoArgs name is not configured within the setting: /Server Test/NodeIds/Methods/MethodNoArgs" );
       return false;
    }
    // find the parent object
    var methodObject = init_GetMethodParent( methodName );
    if ( !isDefined( methodObject ) ) {
       addError( "Method's parent could not be detected." );
       return false;
    }
    //Make sure method exists
    if( TranslateBrowsePathsToNodeIdsHelper.Execute( {
                    Node: methodName,
                    UaBrowsePaths: [ TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "InputArguments" ] ),
                                     TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "OutputArguments" ] ) ],
                    OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
                                        new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ] } ) ) {
            if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
                addSkipped( "Method signature does not match. Please check settings. A method that does not use any InputArguments and OutputArguments is needed." );
                return false;
            }
    }

    //Execute call
    var callResult = CallHelper.Execute( {
                            ServiceResult: new ExpectedAndAcceptedResults( StatusCode.Good ),OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.Good, StatusCode.BadNoMatch ) ],
                            MethodsToCall: [ { MethodId: new UaNodeId.fromString( methodName.NodeId.toString() ), ObjectId: new UaNodeId.fromString( methodObject.NodeId.toString() )
                                         } ] } );
    return( callResult );
}

Test.Execute( { Procedure: methodCallTest } );