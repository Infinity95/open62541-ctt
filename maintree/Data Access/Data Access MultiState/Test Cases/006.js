/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Browse for the EnumStrings variable.
    Expectations:
        All service and operation level results are Good. */

function browse65006()
{
    BrowseHelper.Execute( { NodesToBrowse: multiStateItems[0] } );
    AssertReferencesContainsBrowseName( BrowseHelper.Response.Results[0].References, "EnumStrings", "TrueState Variable reference expected!", undefined, "EnumStrings found!" );
    return( true );
}

Test.Execute( { Procedure: browse65006 } );