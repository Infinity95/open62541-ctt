/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a node of type INTEGER where the data-type of the value is specified as float. */

function write582err022() {
    const SETTING = "/Server Test/NodeIds/Static/All Profiles/Scalar/Integer";
    var item = MonitoredItem.fromSetting( SETTING );
    if( !isDefined( item ) ) { 
        addSkipped( "Integer data-type not configured, please check the setting: " + SETTING + "." );
        return( false );
    };

    var expectation = [ new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch ) ];
    if( isDefined( item ) ) {
        // float
        GenerateScalarValue( item.Value.Value, BuiltInType.Float, 1.0 );
        WriteHelper.Execute( { NodesToWrite: item, OperationResults: expectation } );
    }
    return( true );
}// function write582err022()

Test.Execute( { Procedure: write582err022 } );