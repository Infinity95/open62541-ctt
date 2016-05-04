/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Browse the available inverse-references of an Analog node. */

function browse613016() {
    // Get access to an analog node
    var analogNode = UaNodeId.FromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings[1] );
    if( analogNode.length == 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }
    // We are interested in a single analog node for this test
    var nodeToBrowse = UaNodeId.fromString( analogNode.toString() );
    if( nodeToBrowse === undefined || nodeToBrowse === null ) {
        addError( "Unable to genereate the NodeId for the Node to browse. Please debug this script." );
        return( false );
    }
    // Prepare to browse 
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    // Prepare to browse    
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Inverse;
    print ( "Browsing the inverse references of the analog node '" + analogNode + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );
    // Check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );
        var nCountOfReferences = 0;
        for( var i=0; i<response.Results.length; i++ ) {
            for( var n=0; n<response.Results[i].References.length; n++ ) {
                // Print info of the received inverse references
                addLog ( "Found inverse reference " + response.Results[i].References[n].BrowseName.Name + "." );
                nCountOfReferences++;
            }            
        }
        print ( "Total no. of inverse references found for analog node '" + analogNode + "': " + nCountOfReferences + "." );
    }
    else addError( "Browse(): status " + uaStatus, uaStatus );
    return( true );
}// function browse613016()

Test.Execute( { Procedure: browse613016 } );