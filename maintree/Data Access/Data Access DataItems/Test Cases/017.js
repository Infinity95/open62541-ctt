/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Browse the available inverse-references of a DataItem node. */

function browse614017 ()
{
    // Get access to the DataItem node
    var dataItemNodes = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings );
    if ( dataItemNodes.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }
    // We are interested in a single DataItem node for this test
    var nodeToBrowse = dataItemNodes[0].NodeId;

    // Prepare to browse 
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Inverse;
    print ( "Browsing the inverse references of the DataItem node '" + nodeToBrowse + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );

    // Check result
    if ( uaStatus.isGood() )
    {
        AssertBrowseValidParameter( request, response );
        var nCountOfReferences = 0;
        for ( var i=0; i<response.Results.length; i++)
        {
            for ( var n=0; n<response.Results[i].References.length; n++)
            {
                // Print info of the received inverse references
                addLog ( "Found inverse reference '" + response.Results[i].References[n].BrowseName.Name + "'." );
                nCountOfReferences++;
            }            
        }
        print ( "Total no. of inverse references found for dataitem node '" + nodeToBrowse + "': " + nCountOfReferences + "." );
    }
    else
    {
        addError( "Browse(): status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: browse614017 } );