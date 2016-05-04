/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: write to a node of type UINTEGER where the data-type of the value is specified as Byte, UInt16, UInt32, and UInt64; where the value is:
        - Data-type max
        - Data-type min */
        
function write582025() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/UInteger";
    var item = MonitoredItem.fromSettings( [ SETTING ] )[0];
    if( item == null ) { 
        addSkipped( "UInteger not configured, please check setting: " + SETTING + "." );
        return( false );
    };

    // byte
    addLog( "Byte -> UInteger" );
    GenerateScalarValue( item.Value.Value, BuiltInType.Byte, Constants.Byte_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.Byte, 0 );
    WriteHelper.Execute( { NodesToWrite: item } );
    
    // Uint16
    addLog( "UInt16 -> UInteger" );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt16, Constants.UInt16_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt16, 0 );
    WriteHelper.Execute( { NodesToWrite: item } );

    // Uint32
    addLog( "UInt32 -> UInteger" );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt32, Constants.UInt32_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt32, 0 );
    WriteHelper.Execute( { NodesToWrite: item } );

    // Uint64
    addLog( "UInt64 -> UInteger" );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt64, Constants.UInt64_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.UInt64, 0 );
    WriteHelper.Execute( { NodesToWrite: item } );
    return( true );
}

Test.Execute( { Procedure: write582025 } );