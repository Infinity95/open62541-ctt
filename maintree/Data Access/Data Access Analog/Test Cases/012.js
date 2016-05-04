/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to InstrumentRange property. */

function subscribe613012() {
    var item1;
    // find a node that has an InstrumentRange 
    for( var i=0; i<AnalogItems.length; i++ ) {
         if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { 
                Node: AnalogItems[i], 
                BrowsePaths: [ "InstrumentRange" ],
                OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] )
                } ) ) return( false );
         if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
             item1 = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
             break;
         }
    }//for i
    if( !isDefined( item1 ) ) {
        addSkipped( "Unable to find a node of type AnalogItemType featuring an `InstrumentRange` property." );
        return( false );
    }

    // read the instrument range, and then remember the value so that we can revert back to it later 
    ReadHelper.Execute( { NodesToRead: item1 } );
    item1.OriginalValue = new Object();
    var inRangeValue = item1.Value.Value.toExtensionObject().toRange();
    addLog( "InstrumentRange values received in Read() are High=" + inRangeValue.High + "; Low=" + inRangeValue.Low );
    // record the original values 
    item1.OriginalValue.Low = inRangeValue.Low;
    item1.OriginalValue.High = inRangeValue.High;
    // modify the values and write them back
    inRangeValue.Low = 10;
    inRangeValue.High = 50;
    addLog( "InstrumentRange values changing to: High=" + inRangeValue.High + "; Low=" + inRangeValue.Low );

    var extObject = new UaExtensionObject();
    extObject.setRange( inRangeValue );
    item1.Value.Value.setExtensionObject( extObject );

    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNotSupported, StatusCode.BadUserAccessDenied, StatusCode.BadNotWritable ] ) ];
    WriteHelper.Execute( { NodesToWrite: item1, OperationResults: expectedResults, ReadVerification: false } );

    // we can exit gracefully if the write failed 
    if( WriteHelper.Response.Results[0].isGood() ) {
        // revert the value 
        inRangeValue.Low = item1.OriginalValue.Low;
        inRangeValue.High = item1.OriginalValue.High;
        extObject.setRange( inRangeValue );
        item1.Value.Value.setExtensionObject( extObject );
        WriteHelper.Execute( { NodesToWrite: item1, ReadVerification: false } );
    }
    else addSkipped( "Skipping test, Unable to write to InstrumentRange. Write().Response.Results[0] returned '" + WriteHelper.Response.Results[0] );
    return( true );
}// function subscribe613012()

Test.Execute( { Procedure: subscribe613012 } );