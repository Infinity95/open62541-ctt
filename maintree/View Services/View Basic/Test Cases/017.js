/*    Test 5.7.1-18 prepared by Dale Pope dale.pope@matrikon.com
      Description: Given one node to browse And the node has a View And the nodeClassMask is set to the View node class When Browse is called Then the server returns View references
                   If the Server has no Views (under /Views), then the test is not run.
                   Validation is accomplished by first browsing all references on a node with nodeClassMask = 0xFF, storing the found references, and comparing them to the nodeClassMask.
                   Test once with a node that has a View reference. If the node does not also have references of a different node class, then perform another test where references of a different node class do exist. */

include( "./library/ServiceBased/ViewServiceSet/Browse/node_class_mask_test.js" );

function browse017() {
    // first, browse the ViewsFolder to make sure Views are available.
    if( BrowseHelper.Execute( { NodesToBrowse: MonitoredItem.fromNodeIds( new UaNodeId( Identifier.ViewsFolder ) )[0] } ) ) {
        var views = [];
        for( var r=0; r<BrowseHelper.Response.Results.length; r++ ) {
            var currBrowseResult = BrowseHelper.Response.Results[r];
            if( currBrowseResult.StatusCode.isGood() ) {
                for( var f=0; f<currBrowseResult.References.length; f++ ) {
                    var currRef = currBrowseResult.References[f];
                    if( currRef.NodeClass === NodeClass.View ) views.push( currRef );
                }//for f...
            }
        }//for r...

        // were any views found? if so then continue with the test
        if( views.length > 0 ) {
            print( "** Found " + views.length + " views! **" );
            var nodesToBrowse = [];
            for( var v=0; v<views.length; v++ ) {
                nodesToBrowse[v] = MonitoredItem.fromNodeIds( views[v].NodeId.NodeId )[0];
                nodesToBrowse[v].NodeClass = NodeClass.View;
            }//for v...
            if( Assert.True( BrowseHelper.Execute( { NodesToBrowse: nodesToBrowse } ) ) ) {
                if( Assert.Equal( nodesToBrowse.length, BrowseHelper.Response.Results.length, "Number of Views returned does not match expectation." ) ) {
                    for( var r=0; r<BrowseHelper.Response.Results.length; r++ ) {
                        var currResult = BrowseHelper.Response.Results[r];
                        Assert.Equal( StatusCode.Good, currResult.StatusCode.StatusCode, "StatusCode error." );
                    }
                }//if lengths equal
            }//browse
        }
        else addSkipped( "No Views available in the 'Views' folder. Skipping test." );
    }
    else addError( "Unable to browse the 'Views' folder." );
    return( true );
}

Test.Execute( { Procedure: browse017 } );