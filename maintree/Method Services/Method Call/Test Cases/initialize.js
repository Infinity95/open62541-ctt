include( "./library/Base/safeInvoke.js" );

var CUVariables = new Object();

// Connect to the UA Server using default parameters (settings)
if( !Test.Connect() ) { 
    addError( "Unable to connect to Server. Aborting tests." ); 
    stopCurrentUnit(); 
}
else CUVariables.Debug = true;

function init_GetMethodParent( methodNodeId ) {
    var parentObject = null;
    methodNodeId.BrowseDirection = BrowseDirection.Inverse;
    var hasComponentNodeId = new UaNodeId( Identifier.HasComponent );
    if( BrowseHelper.Execute( { NodesToBrowse: methodNodeId, SuppressMessaging: true } ) ) {   // browse our method node for inverse references
        for( var i=0; i<BrowseHelper.Response.Results.length; i++ ) {                          // iterate thru all browse results
            if( BrowseHelper.Response.Results[i].StatusCode.isGood() ) {                       // we care for good results only
                for( var r=0; r<BrowseHelper.Response.Results[i].References.length; r++ ) {    // iterate thru all returned references for *this* result
                    if( BrowseHelper.Response.Results[i].References[r].ReferenceTypeId.equals( hasComponentNodeId ) ) { // HasComponent?
                        parentObject = MonitoredItem.fromNodeIds( BrowseHelper.Response.Results[i].References[r].NodeId.NodeId )[0]; // capture the parent object
                        break;                                                                       // exit this inner loop; outer loop exited next.
                    }
                }// for r...
            }// is good
            if( parentObject !== null ) break;                                                       // escape the loop if the object is defined
        }//for i...
    }// browse
    return( parentObject );
}