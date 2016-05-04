/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: write to a node of type INTEGER where the data-type of the value is specified as SByte, UInt16, UInt32, and UInt64 */

function write582err021() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Integer";
    var item = MonitoredItem.fromSetting( SETTING );
    if( !isDefined( item ) ) { 
        addSkipped( "Integer data-type not configured, please check the setting: " + SETTING + "." );
        return( false );
    };

    var expectation = [ new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch ) ];
    if( isDefined( item ) ) {
        // sbyte
        GenerateScalarValue( item.Value.Value, BuiltInType.Byte, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );

        // int16
        GenerateScalarValue( item.Value.Value, BuiltInType.UInt16, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );

        // int32
        GenerateScalarValue( item.Value.Value, BuiltInType.UInt32, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );

        // int64
        GenerateScalarValue( item.Value.Value, BuiltInType.UInt64, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
    }
    return( false );
}// function write582err021()

Test.Execute( { Procedure: write582err021 } );