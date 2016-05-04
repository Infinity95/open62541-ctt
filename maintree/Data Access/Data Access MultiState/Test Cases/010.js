/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Request EnumValues and ValueAsText from TranslateBrowsePathsToNodeIds
    Revision History
        2012-09-13 NP: Initial version. */

function TranslateBrowsePathsToNodeIds013() { 

    // do we have an item to work with?
    if( !isDefined( multiStateValueDiscreteItems ) || multiStateValueDiscreteItems.length === 0 ) {
        addSkipped( "No multiStateValueDiscreteItems defined. Skipping test." );
        return( false );
    }
    var item = multiStateValueDiscreteItems[0];

    // call Translate...
    // both properties are mandatory, so we expect a Good result.
    TranslateBrowsePathsToNodeIdsHelper.Execute( { 
            UaBrowsePaths: [
                    UaBrowsePath.New( { StartingNode: item, RelativePathStrings: [ "EnumValues" ] } ),
                    UaBrowsePath.New( { StartingNode: item, RelativePathStrings: [ "ValueAsText" ] } ),
                    ]
                } );
    return( true );
}//func

Test.Execute( { Procedure: TranslateBrowsePathsToNodeIds013 } );