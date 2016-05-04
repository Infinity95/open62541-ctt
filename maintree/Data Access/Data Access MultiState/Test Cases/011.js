/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to EnumStrings property  */

function Write011() { 
    // get the NodeId of the EnumStrings Property. Only 1 node needed.
    var item = multiStateItems[0];
    if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { 
                BrowsePaths: [ "EnumStrings" ],
                Node: item
                } ) ) return( false );

    var enumStrings = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];

    // read the property to get the initial value; then we can modify an element 
    ReadHelper.Execute( { NodesToRead: enumStrings } );

    if( enumStrings.Value.Value.getArraySize() > 1 ) { 
        // modify the second element, and store the original value
        var originalElementValue = enumStrings.Value.Value[1];
        enumStrings.Value.Value[1] = "newValue";

        // write to property; if it is succeeds then revert the enum back to its original value 
        if( WriteHelper.Execute( { 
                NodesToWrite: enumStrings,
                OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] )
                } ) ) { 

            if( WriteHelper.Response.Results[0].isGood() ) {
                enumStrings.Value.Value[1] = originalElementValue;
                WriteHelper.Execute( { NodesToWrite: enumStrings } );
            }

        }//if write succeeds
    }
    return( true );
}// func

Test.Execute( { Procedure: Write011 } );