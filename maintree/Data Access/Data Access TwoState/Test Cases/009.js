/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to both properties.
*/
function Write009() { 
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

    var trueStateItem = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
    var falseStateItem = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[1].Targets[0].TargetId.NodeId )[0];

    // read both items, to get their initial values and to remember them 
    ReadHelper.Execute( { 
                NodesToRead: [ trueStateItem, falseStateItem ]
                } );
    trueStateItem.OriginalValue = trueStateItem.Value.Value.clone();
    falseStateItem.OriginalValue = falseStateItem.Value.Value.clone();

    // modify the enum values for both properties; write to the server and validate results 
    trueStateItem.Value.Value.Text = "affirmative";
    falseStateItem.Value.Value.Text = "negative";

    WriteHelper.Execute( { 
            NodesToWrite: [ trueStateItem, falseStateItem ],
            OperationResults: [
                    new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] ),
                    new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] )
                    ]
            } );

    // did the write succeed? if so, then put the properties back to their original settings 
    // we'll check the first item since if one worked then the other should also 
    if( WriteHelper.Response.Results[0].isGood() ) { 

        // revert the values 
        trueStateItem.Value.Value = trueStateItem.OriginalValue;
        falseStateItem.Value.Value = falseStateItem.OriginalValue;

        // write them back; this time we expect a success 
        WriteHelper.Execute( { 
                    NodesToWrite: [ trueStateItem, falseStateItem ]
                    } );
    }
    return( true );
}// func

Test.Execute( { Procedure: Write009 } );