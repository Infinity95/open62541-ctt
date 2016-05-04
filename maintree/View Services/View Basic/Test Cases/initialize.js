include( "./library/Base/safeInvoke.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
// include all library scripts specific to browse tests
include( "./library/Base/array.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_default_request.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/get_references.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse/assert_browse_error.js" );


var nodeClassItems = [];
var nodeClassParents = [];
var nodeClasses = [];
var nodesToBrowse = [];

// Connect to the server 
function startTests() {
    if( !Test.Connect() ) {
        addError( "Connect failed. Stopping execution of current conformance unit." );
        stopCurrentUnit();
    }
    else { 
        // cache the NodeId settings for the NodeClass tests
        nodeClassItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.NodeClasses.Settings );
        // do we have enough nodes for testing?
        if( 0 === nodeClassItems.length ) {
            addSkipped( "Will not be able to complete all tests. Zero nodes configured for nodeClass testing." );
            stopCurrentUnit();
            return( false );
        }
        else if( nodeClassItems.length !== Settings.ServerTest.NodeIds.NodeClasses.Settings.length ) {
            addWarning( "Some NodeClasses will not be tested because they are not configured." );
        }

        for( var i=0; i<nodeClassItems.length; i++ ) {
            nodesToBrowse.push( nodeClassItems[i].NodeId );
            switch( nodeClassItems[i].NodeSetting ) {
                case "/Server Test/NodeIds/NodeClasses/Object":   nodeClasses.push( NodeClass.Object );   break;
                case "/Server Test/NodeIds/NodeClasses/Variable": nodeClasses.push( NodeClass.Variable ); break;
                case "/Server Test/NodeIds/NodeClasses/Method":   nodeClasses.push( NodeClass.Method );   break;
                case "/Server Test/NodeIds/NodeClasses/ObjectType":   nodeClasses.push( NodeClass.ObjectType );    break;
                case "/Server Test/NodeIds/NodeClasses/VariableType": nodeClasses.push( NodeClass.VariableType );  break;
                case "/Server Test/NodeIds/NodeClasses/ReferenceType":nodeClasses.push( NodeClass.ReferenceType ); break;
                case "/Server Test/NodeIds/NodeClasses/DataType":     nodeClasses.push( NodeClass.DataType );      break;
            }// switch
        }//for i..

        // now to get the parent nodes of each Node that has been selected for testing.
        for( var i=0; i<nodeClassItems.length; i++ ) nodeClassItems[i].BrowseDirection = BrowseDirection.Inverse;
        if( BrowseHelper.Execute( { NodesToBrowse: nodeClassItems } ) ) {
            if( Assert.Equal( nodeClassItems.length, BrowseHelper.Response.Results.length, "Browse.Response.Results length does not match expectations." ) ) {
                for( var i=0; i<BrowseHelper.Response.Results.length; i++ ) nodeClassParents.push( new MonitoredItem.fromNodeIds( BrowseHelper.Response.Results[i].References[0].NodeId.NodeId )[0] );
            }//assert lengths
        }//browse success
    }
}

startTests();

print( "\n\n\n***** CONFORMANCE UNIT 'View Basic' TESTING STARTING ******\n" );