/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Translate both properties into a NodeId. */

function TranslateBrowsePathsToNodeIds010() {
    // we only need one item, but need to get the NodeId for both properties
    var item = twoStateItems[0];

    // call Translate...
    // both properties are mandatory, so we expect a Good result.
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { 
            UaBrowsePaths: [
                    UaBrowsePath.New( { StartingNode: item, RelativePathStrings: [ "TrueState" ] } ),
                    UaBrowsePath.New( { StartingNode: item, RelativePathStrings: [ "FalseState" ] } ),
                    ]
                } ) ) return( false );
    return( true );
}

Test.Execute( { Procedure: TranslateBrowsePathsToNodeIds010 } );