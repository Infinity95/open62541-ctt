/*  Test prepared by nathan.pocock@opcfoundation.org
Description: Invoke all methods on a given node; requires input parameters, and provides output values, e.g. void method( in [], out [] ); */

function methodCallTest( session, objectId, methodId ) {
    var testNode = MonitoredItem.fromNodeIds( UaNodeId.fromString( Settings.ServerTest.NodeIds.Methods.Multiple ) )[0];
    if ( !isDefined( testNode ) ) {
       addSkipped( "Node with multiple methods not configured" );
       return false;
    }

    // step 1: get a list of all Methods on the node
    testNode.NodeClass = NodeClass.Method;
    if( !BrowseHelper.Execute( { NodesToBrowse: testNode } ) ) return( false );
    if( !Assert.GreaterThan( 1, BrowseHelper.Response.Results[0].References.length, "Browse.Response.Results[0].References yielded too few Methods. Check settings specify a NodeId that is known to have multiple Methods." ) ) return( false );

    // loop through our browse results and invoke each method we encounter...
    for( var i=0; i<BrowseHelper.Response.Results[0].References.length; i++ ) {                                                // loop thru each browse result
        var methodName = MonitoredItem.fromNodeIds( BrowseHelper.Response.Results[0].References[i].NodeId.NodeId )[0];         // convert the nodeid into 'monitored item' object
        if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: methodName,                                                  // find the method signature...
              UaBrowsePaths: [ TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "InputArguments" ] ),   // call translate to get the input/output params
              TranslateBrowsePathsToNodeIdsHelper.stringsToBrowsePaths( methodName, [ "OutputArguments" ] ) ],
              OperationResults: [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ),
              new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ] } ) ) return( false );            // if the call fails, exit the test.

        var arguments = [], inArgs, outArgs;                                                                                   // variables needed to build the parameters/values
        if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) 
            inArgs  = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
        if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].StatusCode.isGood() ) 
            outArgs = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0];
    }//for i...

    return( true );
}

Test.Execute( { Procedure: methodCallTest } );