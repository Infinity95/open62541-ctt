/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the Value attribute of a Variable, where the AccessLevel == CurrentWriteService. */

function write582021()
{
    // step 1: identify a node from the settings that we can use in this test
    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite", 0, Attribute.UserAccessLevel );
    if( item == null )
    { 
        addSkipped( "No 'WriteOnly' node configured." );
        return( false );
    };
    var itemDT = MonitoredItem.Clone( item );
    itemDT.AttributeId = Attribute.DataType;

    // step 2: read the node to make sure that it is writable
    //         (it should be since it's supposed to be Read/Write 
    ReadHelper.Execute( { NodesToRead: [ item, itemDT ] } );

    // step 3: can we use this node? is it writable?
    var valueAsByte = item.Value.Value.toByte();
    Assert.True( ( valueAsByte & AccessLevel.CurrentWrite ), "Expected 'UserAccessLevel' bit 2 (CurrentWrite) to be TRUE.", "'UserAccessLevel' bit 2 is TRUE!" );

    item.SafelySetValueTypeKnown( 0, getDataTypeFromNodeId( itemDT.Value.Value ) );

    // step 4: generate a value to write and then write it.
    item.AttributeId = Attribute.Value;

    //GenerateScalarValue( item.Value.Value, nodeSetting.datatype, 1 );
    var readResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
    WriteHelper.Execute( {
            NodesToWrite: item, 
            OperationResults: readResults, 
            CheckNotSupported: true,
            ReadVerification: false } );

    // clean-up
    item = null;
    return( true );
}

Test.Execute( { Procedure: write582021 } );