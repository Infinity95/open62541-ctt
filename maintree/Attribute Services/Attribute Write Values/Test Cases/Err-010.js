/*  Test  prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
     Description: write to a node of type UINTEGER where the data-type of the value is specified as SByte, Int16, Int32, and Int64 */

function write582err020() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/UInteger";
    var item = MonitoredItem.fromSetting( SETTING );
    if( !isDefined( item ) ) { 
        addSkipped( "UInteger data-type not configured, please check the setting: " + SETTING + "." );
        return( false );
    };

    var expectation = [ new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch ) ];
    if( isDefined( item ) ) {
        // sbyte
        GenerateScalarValue( item.Value.Value, BuiltInType.SByte, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
        // int16
        GenerateScalarValue( item.Value.Value, BuiltInType.Int16, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
        // int32
        GenerateScalarValue( item.Value.Value, BuiltInType.Int32, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
        // int64
        GenerateScalarValue( item.Value.Value, BuiltInType.Int64, 1 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
    }
    return( true );
}

Test.Execute( { Procedure: write582err020 } );