/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write a value exceeding the InstrumentRange (high and low values) */

function analog613020() {
    var item1;
    var analogItem;
    // find a node that has an InstrumentRange 
    var expectedResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadNoMatch ] ) ];
    for( var i=0; i<AnalogItems.length; i++ ) {
         if( !TranslateBrowsePathsToNodeIdsHelper.Execute( { Node: AnalogItems[i], BrowsePaths: [ "InstrumentRange" ], OperationResults: expectedResults, } ) ) return( false );
         if( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].StatusCode.isGood() ) {
             item1 = MonitoredItem.fromNodeIds( TranslateBrowsePathsToNodeIdsHelper.Response.Results[0].Targets[0].TargetId.NodeId )[0];
             analogItem = AnalogItems[i];
             break;
         }
    }//for i
    if( !isDefined( item1 ) ) {
        addSkipped( "Unable to find a node of type AnalogItemType featuring an `InstrumentRange` property, which is an OPTIONAL property." );
        return( false );
    }
    // read the InstrumentRange, and then remember the value; also get the analogitem value 
    ReadHelper.Execute( { NodesToRead: [ item1, analogItem ] } );
    item1.OriginalValue = item1.Value.Value.clone();
    var instrumentRangeValue = item1.Value.Value.toExtensionObject().toRange();
    addLog( "InstrumentRange received in Read() =" + instrumentRangeValue.toString() );
    // write a value less than InstrumentRange.Low
    analogItem.SafelySetValueTypeKnown( parseInt( instrumentRangeValue.Low - 1 ), analogItem.Value.Value.DataType );
    addLog( "Write() value '" + analogItem.Value.Value + "' to exceed InstrumentRange.Low (value = " + instrumentRangeValue.Low + ") to node: " + analogItem.NodeSetting + "." );
    WriteHelper.Execute( { NodesToWrite: analogItem, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadOutOfRange ) } );
    // write a value greater than InstrumentRange.High, which should also be fine 
    analogItem.SafelySetValueTypeKnown( parseInt( instrumentRangeValue.High + 1 ), analogItem.Value.Value.DataType );
    addLog( "Write() value '" + analogItem.Value.Value + "' to exceed InstrumentRange.High (value = " + instrumentRangeValue.High + ") to node: " + analogItem.NodeSetting + "." );
    WriteHelper.Execute( { NodesToWrite: analogItem, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadOutOfRange ) } );
    // clean-up
    analogItem = null;
    item1 = null;
    return( true );
}// function analog613020()

Test.Execute( { Procedure: analog613020 } );