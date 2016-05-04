/*    Test 5.7.2-10 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Browse a (valid) node, specifying a nodeClassMask (other than all or View), requestedMaxReferencesPerNode = 1, and BrowseDirection = Both.
          The node must have at least two references of the specified class. Call BrowseNext(). BrowseNext to the end. */

include( "./library/ServiceBased/ViewServiceSet/BrowseNext/node_class_mask_test.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );

function Test572010() {
    var nodesForBrowsing = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.NodeClasses.Settings );
    // do we have enough nodes for testing?
    if( 0 === nodesForBrowsing.length ) {
        addSkipped( "Unable to complete test. Zero nodes configured for nodeClass testing." );
        return( false );
    }
    if( nodesForBrowsing.length !== Settings.ServerTest.NodeIds.NodeClasses.Settings.length ) {
        addWarning( "Some NodeClasses will not be tested because they are not configured. Check settings: '/Server Test/NodeIds/NodeClasses'." );
    }
    var nodeClasses = [];
    var nodesToBrowse = [];
    for( var i=0; i<nodesForBrowsing.length; i++ ) {
        nodesToBrowse.push( nodesForBrowsing[i].NodeId );
        switch( nodesForBrowsing[i].NodeSetting ) {
            case "/Server Test/NodeIds/NodeClasses/Object": nodeClasses.push( NodeClass.Object ); break;
            case "/Server Test/NodeIds/NodeClasses/Variable": nodeClasses.push( NodeClass.Variable ); break;
            case "/Server Test/NodeIds/NodeClasses/Method": nodeClasses.push( NodeClass.Method ); break;
            case "/Server Test/NodeIds/NodeClasses/ObjectType": nodeClasses.push( NodeClass.ObjectType ); break;
            case "/Server Test/NodeIds/NodeClasses/VariableType": nodeClasses.push( NodeClass.VariableType ); break;
            case "/Server Test/NodeIds/NodeClasses/ReferenceType": nodeClasses.push( NodeClass.ReferenceType ); break;
            case "/Server Test/NodeIds/NodeClasses/DataType": nodeClasses.push( NodeClass.DataType ); break;
        }// switch
    }// for i...
    // now test each nodeClass that is configured
    for( var i=0; i<nodesToBrowse.length; i++ ) {
        addLog( "Testing nodeClassMask <" + NodeClass.toString(nodeClasses[i]) + "> on Node '" + nodesToBrowse[i] + "'." );
        TestBrowseNextWhenMoreNodeClassReferencesExist( Test.Session.Session, nodesToBrowse[i], nodeClasses[i] );
    }// for i...
    return( true );
}// test

Test.Execute( { Procedure: Test572010 } );