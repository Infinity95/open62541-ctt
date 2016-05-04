/*    Test 5.7.2-13 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node exists
            And the node has at least two View references
            And RequestedMaxReferencesPerNode is 1
            And NodeClassMask is set to 128 (View)
            And Browse has been called
          When BrowseNext is called
            And ReleaseContinuationPoints is false
          Then the server returns the second reference
            And ContinuationPoint is not empty
          Validation is accomplished by first browsing all references matching 
          the node class, then performing the test and comparing the second 
          reference to the reference returned by the BrowseNext call. So this
          test only validates that Browse two references is consistent with 
          Browse one reference followed by BrowseNext. */

include( "./library/ServiceBased/ViewServiceSet/BrowseNext/node_class_mask_test.js" );

// Return the NodeId of a node that has two View references.
// Start looking under /Views. The Views can be in either direction.
function GetNodeWithTwoViews( session, nodeToBrowse ) {
    var references = GetTest1ReferencesFromNodeId( session, nodeToBrowse );
    var count = 0;
    for( var i=0; i<references.length; i++ ) {
        if( references[i].NodeClass == NodeClass.View ) {
            count++;
            if( count >= 2 ) {
                return nodeToBrowse;
            }
        }
    }// for i
    return -1;
}

// BrowseNext for references matching a NodeClassMask
function Test572010() {
    // determine if the server supports views
    if( !ServerHasViews( Test.Session.Session ) ) {
        addSkipped( "Server does not have Views. This test will not be run." );
        return( false );
    }
    var nodeToBrowse = new UaNodeId( Identifier.ViewsFolder );
    // determine if there are at least two Views on one node
    var nodeWithViews = -1
    try {
        nodeWithViews = GetNodeWithTwoViews( Session, nodeToBrowse );
    }
    catch ( exception ) {
        // stack might overflow
        addWarning( "Could not find a node containing two Views. This test will not be run." );
        return( false );
    }
    if( nodeWithViews == -1 ) {
        addWarning( "Server does not have a node containing two Views. This test will not be run." );
        return( false );
    }
    var nodeClassMask = 128;
    addLog( "Testing nodeClassMask <" + nodeClassMask + ">" );
    TestBrowseNextWhenMoreNodeClassReferencesExist( nodeWithViews, nodeClassMask );
    return( true );
}

Test.Execute( { Procedure: Test572010 } );