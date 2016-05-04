/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:
        Write a value (Value attribute) that exceeds the bounds of the EnumStrings attribute.
    Expectations:
        ServiceResult = Good. Operation level result is Bad_OutOfRange. */

function readErr65001() {
    // read the node and display the Value
    if( ReadHelper.Execute( { NodesToRead: multiStateItems[0] } ) ) {
        Assert.True( IsUInteger( { Value: multiStateItems[0].Value.Value } ), "Data Type of .Value attribute should be UInteger, but is: " + BuiltInType.toString( multiStateItems[0].Value.Value.DataType ) );
        print( "\tRead complete of Node: " + multiStateItems[0].NodeSetting + "\n\t\tItem value: " + multiStateItems[0].Value.Value.toBoolean() );
        
        // we have the main node itself, now to get the TrueState and FalseState into a Node 
        var multiStateEnum = GetMultiStateDiscreteEnumStrings( multiStateItems[0].NodeSetting, Test.Session.Session, ReadHelper );
        if( multiStateEnum !== null ) {
            addLog( "There are " + multiStateEnum.length + " element(s), now to write a value that exceeds the bound (bound + 1 )." );

            //record the initial value so that we can revert back to it after the test
            multiStateItems[0].InitialValue = multiStateItems[0].Value.Value.clone();

            // now write a value that exceeds the bounds of the enum
            multiStateItems[0].SafelySetValueTypeKnown( ( multiStateEnum.length + 1 ), multiStateItems[0].Value.Value.DataType );

            var operationResults = [ new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadOutOfRange ] ) ];
            WriteHelper.Execute( { NodesToWrite: multiStateItems[0], OperationResults: operationResults } );

            // now revert to the original value
            multiStateItems[0].Value.Value = multiStateItems[0].InitialValue.clone();
            expectedResults = [ new ExpectedAndAcceptedResults( StatusCode.Good ) ];
            WriteHelper.Execute( { NodesToWrite: multiStateItems[0], OperationResults: operationResults } );
        }
    }
    return( true );
}

Test.Execute( { Procedure: readErr65001 } );