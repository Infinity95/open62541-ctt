/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Browse the available references (both directions) of an Analog node. */

function browse613017() {
    // Get access to an analog node
    var analogNode = UaNodeId.FromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings[0] );
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
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    // Prepare to browse
    var response = new UaBrowseResponse();
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Both;
    print ( "Browsing the forward/inverse references of the analog node '" + analogNode + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );
    // Check result
    if( uaStatus.isGood() ) {
        AssertBrowseValidParameter( request, response );
        var nCountOfForwardReferences = 0;
        var nCountOfInverseReferences = 0;
        for( var i=0; i<response.Results.length; i++ ) {
            for( var n=0; n<response.Results[i].References.length; n++ ) {
                // Print info of the received references
                if( response.Results[i].References[n].IsForward ) {
                    addLog ( "Found forward reference '" + response.Results[i].References[n].BrowseName.Name + "'." );
                    nCountOfForwardReferences++;
                }
                else {
                    addLog ( "Found inverse reference '" + response.Results[i].References[n].BrowseName.Name + "'." );
                    nCountOfInverseReferences++;
                }
            }            
        }
        print ( "Total no. of references found for analog node '" + analogNode + "':\n\tForward references: " + nCountOfForwardReferences + "\n\tInverse references: " + nCountOfInverseReferences );
    }
    else addError( "Browse(): status " + uaStatus, uaStatus );
    return( true );
}// function browse613017()

Test.Execute( { Procedure: browse613017 } );