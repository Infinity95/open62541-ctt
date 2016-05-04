/*  Test 6.5 Test 9; prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:Browse a node of this type requesting all Forward and Inverse references.
    Expectations:
        Service and operation level results are good.
        Verify references returned are valid.
        The results should be a combination of the individual Forward and Inverse requests (previous 2 test-cases).*/

function browse65007direction(item, direction)
{
    item.SetBrowse( direction, true, 0xff, null, 0x3f );
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    BrowseHelper.Execute( {  NodesToBrowse: item } );

    // record the # of forward references, and display them in the console
    print( "BrowseDirection=" + direction + "\n" + BrowseHelper.ResultsToString() );
    return( item.ReferenceDescriptions.length );
}

function browse65007()
{
    multiStateItems.ForwardReferencesCount = browse65007direction( multiStateItems[0], BrowseDirection.Forward );
    multiStateItems.InverseReferencesCount = browse65007direction( multiStateItems[0], BrowseDirection.Inverse );
    multiStateItems.AllReferencesCount = browse65007direction( multiStateItems[0], BrowseDirection.Both );

    Assert.GreaterThan( 1, multiStateItems.ForwardReferencesCount, "Expected two or more references (BrowseDirection: Forward)." );
    Assert.Equal( 
            multiStateItems.AllReferencesCount, 
            ( multiStateItems.ForwardReferencesCount + multiStateItems.InverseReferencesCount ), 
            "Expected the number returned with BrowseDirection=Forward (refs: " + multiStateItems.ForwardReferencesCount + " ) plus the " +
            "BrowseDirection=Inverse (refs: " + multiStateItems.InverseReferencesCount + ") to equal the number of references when " +
            "BrowseDirection=Both (refs: " + multiStateItems.AllReferencesCount + ").",
            "Received " + multiStateItems.AllReferencesCount + " references total, which also matched the sum of all references found when browsing Forward references only, plus Inverse references only." );
    return( true );
}

Test.Execute( { Procedure: browse65007 } );