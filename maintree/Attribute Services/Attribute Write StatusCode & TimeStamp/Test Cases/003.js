/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a single valid Node a VTQ by passing the Value, Quality, sourceTimestamp and serverTimestamp. */

function write582012() {
    var item = scalarNodes[0].clone();
    var sourceTimeOffset = 5000; // milliseconds (in the past)
    var serverTimeOffset = 6000;

    // write the value and quality and both timestamps
    GenerateScalarValue( item.Value.Value, UaNodeId.GuessType( item.NodeSetting ) );
    item.Value.StatusCode.StatusCode = StatusCode.GoodLocalOverride;
    item.Value.SourceTimestamp = UaDateTime.utcNow();
    item.Value.SourceTimestamp.addMilliSeconds(-sourceTimeOffset);
    item.Value.ServerTimestamp = UaDateTime.utcNow();
    item.Value.ServerTimestamp.addMilliSeconds(-serverTimeOffset);
    item.Value.Set = "Value;StatusCode;SourceTimestamp;ServerTimestamp";
    if( WriteHelper.Execute( { NodesToWrite: item, OperationResults: WriteExpectedResult } ) ) {
        if( WriteHelper.Response.Results[0].isGood() ) {
            item.ValueWritten = item.Value.clone();
            print( "\tReading back the value to compare to the values previously written." );
            if( ReadHelper.Execute( { NodesToRead: item } ) ) {
                Assert.Equal( item.ValueWritten.Value,           item.Value.Value          , "Value was not as written" );
                Assert.Equal( item.ValueWritten.StatusCode,      item.Value.StatusCode     , "Quality was not as written" );
                Assert.Equal( item.ValueWritten.SourceTimestamp, item.Value.SourceTimestamp, "Source timestamp was not as written" );
            }
            VQTsupport |= UaVQTSupport.ServerTimestamp | UaVQTSupport.SourceTimestamp | UaVQTSupport.Value;
        }
        else {
            addNotSupported( "Writing to SourceTimstamp+ServerTimestamp" );
            return( false );
        }
    }
    else return( false );
    return( true );
}

Test.Execute( { Procedure: write582012 } );