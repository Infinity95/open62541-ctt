/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Read multiple nodes of this type and display the value. Verify the value is in the 
        EnumStrings Variable, i.e. numeric value is within the bounds of the EnumStrings array.
    Expectations:
        All service and operation level results are Good.
*/

function read65002() {
    // read the node and display the Value
    if( ReadHelper.Execute( { NodesToRead: multiStateItems } ) ) {
        for( i=0; i<multiStateItems.length; i++ ) {
            Assert.True( IsUInteger( { Value: multiStateItems[i].Value.Value } ), "Data Type of .Value attribute should be UInteger, but is: " + BuiltInType.toString( multiStateItems[i].Value.Value.DataType ) );

            // we have the main node itself, now to get the TrueState and FalseState into a Node
            var multiStateEnum = GetMultiStateDiscreteEnumStrings( multiStateItems[i].NodeSetting, Test.Session.Session, ReadHelper );
            if( multiStateEnum !== null ) {
                var msValue = multiStateItems[i].SafelySetValueTypeKnown( multiStateItems[i].Value.Value, multiStateItems[i].Value.Value.DataType );
                if( msValue > multiStateEnum.length ) {
                    addLog( "Read NodeID: " + multiStateItems[i].NodeId + ", where the value received is greater than defined bounds: Value=" + msValue + "; Bound Size=" + multiStateEnum.length + "; EnumValues are: '" + multiStateEnum + "'" );
                    addWarning( "Server does not restrict the value of an Enum to stay within the bounds of the Array. This is legal, but should be verified." );
                }
                else {
                    addLog( "Read NodeId '" + multiStateItems[i].NodeId + "' (setting: '" + multiStateItems[i].NodeSetting + "')\n\t\tValue: " + multiStateItems[i].Value.Value + ";\n\t\tEnumerated translation: " + msValue );
                }
            }
        }
    }
    return( true );
}

Test.Execute( { Procedure: read65002 } );