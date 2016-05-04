/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the Value attribute of a Variable, where the AccessLevel == CurrentWriteService.*/

function write582020() {
    const SETTING = "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite";
    if( !AssertSettingGood( SETTING, undefined, true ) ) return( false );

    // step 1: identify a node from the settings that we can use in this test
    var item = MonitoredItem.fromSetting( SETTING, 0, Attribute.AccessLevel );

    // we actually need to read the access level, and the value attribute so we can identify that data-type (needed for write)
    var itemV = MonitoredItem.Clone( item );
    itemV.AttributeId = Attribute.DataType;

    // step 2: read the node to make sure that it is writable
    //         (it should be since it's supposed to be Read/Write 
    ReadHelper.Execute( { NodesToRead: [ item, itemV ] } );

    // step 3: can we use this node? is it writable?
    var valueAsByte = item.Value.Value.toByte();
    Assert.True( ( valueAsByte & AccessLevel.CurrentWrite ), "Expected 'AccessLevel' bit 2 (CurrentWrite) to be TRUE.", "'AccessLevel' bit 2 is TRUE!" );

    // step 4: generate a value to write and then write it.
    GenerateScalarValue( itemV.Value.Value, NodeIdIdentifierToDataType( itemV.Value.Value.toNodeId() ), 1 );
    var expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    itemV.AttributeId = Attribute.Value;
    return( WriteHelper.Execute( { NodesToWrite: itemV, OperationResults: expectedResults, ReadVerification: false, CheckNotSupported: true } ) );
}

Test.Execute( { Procedure: write582020 } );