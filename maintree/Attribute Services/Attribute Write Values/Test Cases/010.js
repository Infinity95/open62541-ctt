/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: write to a node of type INTEGER where the data-type of the value is specified as 
        SByte, Int16, Int32, and Int64; where the value is: - Data-type max - Data-type min */

function write582026() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Integer";
    var item = MonitoredItem.fromSettings( [ SETTING ] )[0];
    if( item == null ) { 
        addSkipped("Integer data-type not configured, please check setting: " + SETTING + "." );
        return( false );
    };

    // sbyte
    addLog( "SByte -> Integer" );
    GenerateScalarValue( item.Value.Value, BuiltInType.SByte, Constants.SByte_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.SByte, Constants.SByte_Min );
    WriteHelper.Execute( { NodesToWrite: item } );
    
    // int16
    addLog( "Int16 -> Integer" );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int16, Constants.Int16_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int16, Constants.Int16_Min );
    WriteHelper.Execute( { NodesToWrite: item } );

    // int32
    addLog( "Int32 -> Integer" );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int32, Constants.Int32_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int32, Constants.Int32_Min );
    WriteHelper.Execute( { NodesToWrite: item } );

    // int64
    addLog( "Int64 -> Integer" );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int64, Constants.Int64_Max );
    WriteHelper.Execute( { NodesToWrite: item } );
    GenerateScalarValue( item.Value.Value, BuiltInType.Int64, Constants.Int64_Min );
    WriteHelper.Execute( { NodesToWrite: item } );
    return( true );
}

Test.Execute( { Procedure: write582026 } );