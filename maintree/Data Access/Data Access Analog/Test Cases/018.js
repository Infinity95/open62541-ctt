/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: If available, write a value to the EngineeringUnits, e.g. C81, C25, MMT, KTM, FAH etc. */

function analog613018() {
    var item1;
    // find a node that has an EngineeringUnits 
    for( var i=0; i<AnalogItems.length; i++ ) {
         if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: AnalogItems[i], BrowsePaths: [ "EngineeringUnits" ], OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) } ) ) return( false );
         if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
             item1 = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
             break;
         }
    }//for i
    if( !isDefined( item1 ) ) {
        addSkipped( "Unable to find a node of type AnalogItemType featuring an `EngineeringUnits` property." );
        return( false );
    }
    // read the instrument range, and then remember the value so that we can revert back to it later 
    ReadHelper.Execute( { NodesToRead: item1 } );
    item1.OriginalValue = item1.Value.Value.clone();
    var eunitsRangeValue = item1.Value.Value.toExtensionObject().toEUInformation();
    addLog( "EngineeringUnits received in Read() =" + eunitsRangeValue.toString() );
    // change the value to one of the named measurement types
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] ) ];
    var units = [ "C81", "C25", "MMT", "KTM", "FAH" ];
    for( var i=0; i<units.length; i++ ) {
        // change the measurement value, and then write it
        var extObject = new UaExtensionObject();
        eunitsRangeValue.DisplayName.Text = units[i];
        extObject.setEUInformation( eunitsRangeValue );
        item1.Value.Value.setExtensionObject( extObject );
        addLog( "Write() EngineeringUnits '" + eunitsRangeValue.DisplayName.Text + "'." );
        WriteHelper.Execute( { NodesToWrite: item1, OperationResults: expectedResults, ReadVerification: false } );
        // we can exit gracefully if the write failed 
        if( WriteHelper.Response.Results[0].isGood() ) {
            // revert the value 
            item1.Value.Value = item1.OriginalValue;
            WriteHelper.Execute( { NodesToWrite: item1 } );
        }
        else {
            addSkipped( "Skipping test, Unable to write to EngineeringUnits. Write().Response.Results[0] returned '" + WriteHelper.Response.Results[0] );
            break;
        }
    }
    return( true );
}// function analog613018()

Test.Execute( { Procedure: analog613018 } );