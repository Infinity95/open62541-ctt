/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Browse a node of this type and query the forward references.
        Then browse a node of this type and query the inverse references.
        Then browse a node of this type and query both forward and inverse references.
    Expectations:
        Service and operation level results are Good.
        2 or more References exist for first call, and the TrueState and FalseState
        variables references are returned.
        1 or more references exist for the 2nd call.
        All references returned in the previous 2 calls are returned for the 3rd call. */

function browse66007direction(item, direction)
{
    item.SetBrowse( direction, true, 0xff, null, 0x3f );
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    BrowseHelper.Execute( {  NodesToBrowse: item } );

    // record the # of forward references, and display them in the console
    print( "BrowseDirection=" + direction + "\n" + BrowseHelper.ResultsToString() );
    return( item.ReferenceDescriptions.length );
}

function browse66007()
{
    if( twoStateItems == null || twoStateItems.length == 0 )
    {
        addSkipped( TSDT );
        return( false );
    }

    twoStateItems.ForwardReferencesCount = browse66007direction( twoStateItems[0], BrowseDirection.Forward );
    twoStateItems.InverseReferencesCount = browse66007direction( twoStateItems[0], BrowseDirection.Inverse );
    twoStateItems.AllReferencesCount = browse66007direction( twoStateItems[0], BrowseDirection.Both );

    Assert.GreaterThan( 1, twoStateItems.ForwardReferencesCount, "Expected two or more references (BrowseDirection: Forward)." );
    Assert.Equal( 
            twoStateItems.AllReferencesCount, 
            ( twoStateItems.ForwardReferencesCount + twoStateItems.InverseReferencesCount ), 
            "Expected the number returned with BrowseDirection=Forward (refs: " + twoStateItems.ForwardReferencesCount + " ) plus the " +
            "BrowseDirection=Inverse (refs: " + twoStateItems.InverseReferencesCount + ") to equal the number of references when " +
            "BrowseDirection=Both (refs: " + twoStateItems.AllReferencesCount + ").",
            "Received " + twoStateItems.AllReferencesCount + " references total, which also matched the sum of all references found when browsing Forward references only, plus Inverse references only." );
    return( true );
}

Test.Execute( { Procedure: browse66007 } );