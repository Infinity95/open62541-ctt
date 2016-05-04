/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write a valid value to each attribute that can be written to as determined by the value of the WriteMask and/or UserWriteMask attributes. */

include( "./library/Base/NodeTypeAttributesMatrix.js" );
include( "./library/Base/array.js" );

function write582err026() {
    // get an item to work with
    var item1 = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    if( !isDefined( item1 ) ) {
        addSkipped( "No items to use. Aborting test." );
        return( false );
    }

    item1.AttributeId = Attribute.WriteMask;
    var item2 = MonitoredItem.Clone( item1 );
    item2.AttributeId = Attribute.UserWriteMask;

    // we need to read all attributes except Value; lets assume this is a Variable 
    var allAttributes = new NodeTypeAttributesMatrix().Variable;
    ArrayRemoveElement( allAttributes, Attribute.Value );

    ReadHelper.Execute( { NodesToRead:[ item1, item2 ] } );

    var writeMask = UaVariantToSimpleType( item1.Value.Value );
    var userWriteMask = UaVariantToSimpleType( item2.Value.Value );
    if( writeMask === 0 && userWriteMask === 0 ) {
        addSkipped( "WriteMask/UserWriteMask indicate that no attributes can be written to on NodeId: '" + item1.NodeId + "' (setting: '" + item1.NodeSetting + "')." );
        return( false );
    }


    var itemsToWrite = [];
    var attributesTested = [];
    var expectedResults = [];

    // loop through each attribute and see if we can write to it
    // make sure the WriteMask and UserWriteMask 
    for( var i=0; i<22; i++ ) {
        if( Bit.IsOff( { Value: userWriteMask, Bit: i } ) ) { print( "Bit #" + i + " is FALSE. Skipping." ); continue; }
        var item = MonitoredItem.Clone( item1 );
        
        // read the original attribute value to get correct locale for locaized texts
        item.AttributeId = Attribute.fromWriteMaskBit(i);
        ReadHelper.Execute( { NodesToRead:[ item ] } );
        item.OriginalValue = item.Value.Value.clone();
        
        switch( i ) {
            case 0: //accesslevel
                item.Value.Value.setByte( 0 );
                break; 
            case 1: //arraydimensions
                var dims = new UaUInt32s();
                dims[0] = 1;
                dims[1] = 2;
                item.Value.Value.setUInt32Array( dims );
                break; 
            case 2: //browseName
                var qn = new UaQualifiedName();
                qn.Name = "hello world";
                item.Value.Value.setQualifiedName( qn );
                break;
            case 3: //containsNoLoops
                item.Value.Value.setBoolean( true );
                break; 
            case 4: //datatype
                item.Value.Value.setNodeId( UaNodeId.fromString( "ns=99;i=999" ) );
                break; 
            case 5: //description
                // var lt = new UaLocalizedText();
                var lt = item.OriginalValue.toLocalizedText();
                lt.Text = "Hello world!";
                item.Value.Value.setLocalizedText( lt );
                break;
            case 6: //displayName
                var lt = item.OriginalValue.toLocalizedText();
                lt.Text = "Hello world";
                item.Value.Value.setLocalizedText( lt );
                break;
            case 7: //eventNotifier
                item.Value.Value.setByte( 0 );
                break;
            case 8: //executable
                item.Value.Value.setBoolean( true );
                break; 
            case 9: //historizing
                item.Value.Value.setBoolean( true );
                break; 
            case 10: //inversename
                var lt = item.OriginalValue.toLocalizedText();
                lt.Text = "Hello world";
                item.Value.Value.setLocalizedText( lt );
                break;
            case 11: //isabstract
                item.Value.Value.setBoolean( true );
                break;
            case 12: //minimumsamplinginterval
                item.Value.Value.setDouble( 0.0 );
                break;
            case 13: //nodeclass
                item.Value.Value.setUInt16( NodeClass.Method );
                break;
            case 14: //nodeid
                item.Value.Value.setNodeId( UaNodeId.fromString( "ns=99;s=kissMyCtt" ) );
                break;
            case 15: //symmetric
                item.Value.Value.setBoolean( true );
                break;
            case 16: //useraccesslevel
                item.Value.Value.setByte( 0 );
                break;
            case 17: //userexecutable
                item.Value.Value.setBoolean( true );
                break;
            case 18: //userwritemask
                item.Value.Value.setUInt32( 0 );
                break;
            case 19: //valuerank
                item.Value.Value.setInt32( 0 );
                break;
            case 20: //writemask
                item.Value.Value.setUInt32( 0 );
                break;
            case 21: //ValueForVariableType
                item.Value.Value.setBoolean( false );
                break;
        }//switch
        itemsToWrite.push( item );
        expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
        attributesTested[i] = Attribute.toString( i );
    }//for

    // now issue the write 
    if( itemsToWrite.length > 0 ) {
        WriteHelper.Execute( { NodesToWrite: itemsToWrite } );
        addLog( "Attributes tested:\n" + attributesTested );

        // now revert back to the original values 
        revertToOriginalValues();
    }
    else addSkipped( "No attributes to write to. Aborting test." );
    return( true );
}// function write582err026() 

Test.Execute( { Procedure: write582err026 } );