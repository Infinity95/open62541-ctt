/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the same node multiple times in the same call. This is done for each core data type: 
            Bool, Byte, SByte, ByteString, DateTime, Decimal, Double, Float, Guid, Int16, UInt16, Int32, UInt32,  Int64, UInt64, String */

function write582004() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !isDefined( items ) ) { addError( "No Scalar items defined. Check settings. Aborting test." ); return( false ); }

    ReadHelper.Execute( { NodesToRead: items, TimestampsToReturn: TimestampsToReturn.Server } );

    // now to iterate thru each data-type and issue 5 instructions within the single call; this will 
    // involve cloning the item and then changing the value 
    for( var t=0; t<items.length; t++ ){
        addLog( "Testing type: " + BuiltInType.toString( UaNodeId.GuessType( items[t].NodeSetting ) ) );

        // first, create our list of items to write, and values.
        var values = [];
        var itemsByType = [];
        for( var i=0; i<5; i++ ){ // i=item
            itemsByType.push( MonitoredItem.Clone( items[t], { IncludeValue: true } ) );
            for( var v=i; v<5; v++ ) {
                if( itemsByType[i].DataType === BuiltInType.ByteString || itemsByType[i].DataType === BuiltInType.XmlElement ) UaVariant.Increment( { Value: itemsByType[i].Value } );
                else {
                    if( isNaN( itemsByType[i].Value.Value ) ) UaVariant.SetValueMin( { Value: itemsByType[i].Value } );
                    else UaVariant.Increment( { Value: itemsByType[i].Value } );
                }
            }
            values.push( itemsByType[i].Value.Value );
        }

        // second, write the values. Do not verify.
        WriteHelper.Execute( { NodesToWrite: itemsByType, ReadVerification: false } );

        //  last, read the original item (since the previous set are just clones of it) and check that 
        // the value received matches the last one sent.
        ReadHelper.Execute( { NodesToRead: items[t], TimestampsToReturn: TimestampsToReturn.Server, MaxAge: 0 } );

        // compare the value received vs. last value sent 
        Assert.ValueInValues( items[t].Value.Value, values, 
                              "Item '" + items[t].NodeId + "' (setting: " + items[t].NodeSetting + ") Value: " + items[t].Value.Value + "; expecting one of the values previously written: " + values + ".",
                              "Item '" + items[t].NodeId + "' returned a value (" + items[t].Value.Value + ") that matched one of the values written: " + values + "." );
    }
    return( true );
}// function write582004() 

Test.Execute( { Procedure: write582004 } );