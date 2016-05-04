/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to ValueAsText property */

function Write012() { 
    // do we have an item to work with?
    if( !isDefined( multiStateValueDiscreteItems ) || multiStateValueDiscreteItems.length === 0 ) {
        addSkipped( "No multiStateValueDiscreteItems defined. Skipping test." );
        return( false );
    }

    // get the NodeId of the EnumStrings Property. Only 1 node needed.
    var item = multiStateValueDiscreteItems[0];
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { 
                BrowsePaths: [ "ValueAsText" ],
                Node: item
                } ) ) return( false );

    var enumStrings = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];

    // read the property to get the initial value; then we can modify an element 
    if( ReadHelper.Execute( { NodesToRead: enumStrings } ) ) {
        // modify the value, and store the original value
        var originalElementValue = enumStrings.Value.Value.toLocalizedText();
        var lt = new UaLocalizedText();
        lt.Text = "newTextValue";
        enumStrings.Value.Value.setLocalizedText( lt );

        // write to property; if it is succeeds then revert the enum back to its original value 
        var expectedResults = new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadNotWritable, StatusCode.BadUserAccessDenied ] );
        if( WriteHelper.Execute( { 
                NodesToWrite: [ enumStrings ],
                OperationResults: expectedResults } ) ) { 
            enumStrings.Value.Value.setLocalizedText( originalElementValue );
            WriteHelper.Execute( { NodesToWrite: enumStrings, OperationResults: expectedResults } );
        }//if write succeeds
    }
    return( true );
}// function Write012()

Test.Execute( { Procedure: Write012 } );