/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Browse a node of this type requesting all INVERSE references.
   Expectations:
        Service and operation level results are good. */

function browse65007()
{
    var inverseRefs = GetIsDirectionReferences( multiStateItems[0].NodeId, BrowseDirection.Inverse, Test.Session.Session );
    if( inverseRefs.length === 0 )
    {
        addLog( "No inverse references found. This is legal." );
    }
    else
    {
        for( var r=0; r<inverseRefs.length; r++ )
        {
            addLog( "Found Inverse Reference: BrowseName='" + inverseRefs[r].BrowseName + "'; RefTypeId: " + inverseRefs[r].ReferenceTypeId );
        }
    }
    return( true );
}

Test.Execute( { Procedure: browse65007 } );