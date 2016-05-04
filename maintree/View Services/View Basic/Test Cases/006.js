/*    Test 5.7.1-7 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node has a reference matching the nodeClassMask
            And the nodeClassMask is set to one node class
          When Browse is called
          Then the server returns references with node classes matching the mask
          Validation is accomplished by first browsing all references on a node
          with nodeClassMask = 0xFF, storing the found references, and comparing
          them to the nodeClassMask.
          Test once with a node that has a reference of node class matching the 
          NodeClassMask. If the node does not also have references of a different 
          node class, then perform another test where references of a different 
          node class do exist. */

include( "./library/ServiceBased/ViewServiceSet/Browse/node_class_mask_test.js" );

// The test
function Test571007() {
    print( "About to test NodeClasses, here's what's currently configured: " + nodeClasses.toString() );
    for( var i=0; i<nodeClasses.length; i++ ) {
        addLog( "Testing nodeClassMask <" + NodeClass.toString(nodeClasses[i]) + "> with returnDiagnostics <0>" );
        BrowseOneNodeWithClassMaskMatchAndNoMatch( Test.Session.Session, nodeClassParents[i].NodeId, nodeClasses[i], nodeClassParents, 0 );// nodesToBrowse[i], nodeClasses[i], nodesToBrowse, 0 );

        addLog( "Testing nodeClassMask <" + NodeClass.toString(nodeClasses[i]) + "> with returnDiagnostics <0x3FF>" );
        BrowseOneNodeWithClassMaskMatchAndNoMatch( Test.Session.Session, nodeClassParents[i].NodeId, nodeClasses[i], nodeClassParents, 0x3FF ); // nodesToBrowse[i], nodeClasses[i], nodesToBrowse, 0x3FF );
    }
    return( true );
}// function Test571007()

Test.Execute( { Procedure: Test571007 } );