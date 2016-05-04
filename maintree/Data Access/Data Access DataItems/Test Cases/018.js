/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Browse the available references (both directions) of a DataItem node.*/

function browse614018 ()
{
    // Get access to the DataItem node
    var dataItemNodes = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings );
    if ( dataItemNodes.length == 0 )
    {
        addSkipped( "Static DataItem" );
        return( false );
    }
    // We are interested in a single dataitem node for this test
    var nodeToBrowse = dataItemNodes[0].NodeId;

    // Prepare to browse
    var request = GetTest1BrowseRequest( Test.Session.Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    request.RequestHeader.ReturnDiagnostics = 0;
    request.NodesToBrowse[0].BrowseDirection = BrowseDirection.Both;
    print ( "Browsing the forward/inverse references of the DataItem node '" + nodeToBrowse + "'." );
    var uaStatus = Test.Session.Session.browse( request, response );

    // Check result
    if ( uaStatus.isGood() )
    {
        AssertBrowseValidParameter( request, response );
        
        var nCountOfForwardReferences = 0;
        var nCountOfInverseReferences = 0;
        for ( var i=0; i<response.Results.length; i++)
        {
            for ( var n=0; n<response.Results[i].References.length; n++)
            {
                // Print info of the received references
                if ( response.Results[i].References[n].IsForward )
                {
                    addLog ( "Found forward reference '" + response.Results[i].References[n].BrowseName.Name + "'." );
                    nCountOfForwardReferences++;
                }
                else
                {
                    addLog ( "Found inverse reference '" + response.Results[i].References[n].BrowseName.Name + "'." );
                    nCountOfInverseReferences++;
                }
            }            
        }
        print ( "Total no. of references found for DataItem node '" + nodeToBrowse + "':\n\tForward references: " + nCountOfForwardReferences + "\n\tInverse references: " + nCountOfInverseReferences );
    }
    else
    {
        addError( "Browse(): status " + uaStatus, uaStatus );
    }
    return( true );
}

Test.Execute( { Procedure: browse614018 } );