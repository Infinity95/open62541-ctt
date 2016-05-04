/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        For all nodes configured of this type, invoke a TranslateBrowsePathsToNodeIds() and request all 
        properties: Definition, and ValuePrecision. Note: invoke one call per node.
        Note: test requires each node to be read individually. */

function translate64019()
{
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ];
    for( var i=0; i<allDataItems.length; i++ )
    {
        TranslateBrowsePathsToNodeIdsHelper.Execute( {
                Node: allDataItems[i],
                BrowsePaths: [ "Definition", "ValuePrecision" ],
                OperationResults: expectedResults
                } );
    }//for i
    return( true );
}

Test.Execute( { Procedure: translate64019 } );