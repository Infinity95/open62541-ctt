/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to a value using the wrong data-type:
            Sent value of Type -> to the wrong node of Type
                � Int16 -> Bool         � Int32-> Byte
                � Int64-> Float         � UInt16-> String
                � UInt32-> DateTime     � UInt64 -> decimal
                � String -> bool        � Byte -> XmlElement
                � Guid -> UInt32        � SByte -> DateTime etc. */

Test.Execute( { Procedure: function test() {
    this.itemOfType = function( items, types ) {
        if( items == undefined || items == null || items.length == 0 ) return( null );
        if( types == undefined || types == null || types.length == 0 ) return( null );
        for( var i=0; i<items.length; i++ ) { // iterate thru each item
            // check if *this* item matches any of the specified types...
            for( var t=0; t<types.length; t++ ) { // iterate thru each type
                if( items[i].originalValue.DataType == types[t] ) return( items[i] );
            }//for t...
        }//for i...
        return( null );
    };

    // read the items and get their initial values, and then cache a copy...
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( !ReadHelper.Execute( { NodesToRead: items } ) ) return( false );
    for( var i=0; i<items.length; i++ ) items[i].originalValue = items[i].Value.Value.clone();

    var expectedResults = [];
    //dynamically construct IDs of nodes to write, specifically their values.
    for( var i=0; i<items.length; i++ ) {
        expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch ) );
        // this variable will contain the SPECIFIC UA object that will then be passed to the WRITE call.
        var item;
        switch( items[i].NodeSetting ) {
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Bool":        item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.Byte, BuiltInType.UInt16, BuiltInType.String ] );      break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Byte":        item = this.itemOfType( items, [ BuiltInType.XmlElement, BuiltInType.Int16, BuiltInType.String, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString":  item = this.itemOfType( items, [ BuiltInType.Boolean, BuiltInType.String, BuiltInType.Int16, BuiltInType.UInt16 ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/DateTime":    item = this.itemOfType( items, [ BuiltInType.UInt32, BuiltInType.Boolean, BuiltInType.String, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Double":      item = this.itemOfType( items, [ BuiltInType.DateTime, BuiltInType.Boolean, BuiltInType.String, BuiltInType.UInt16 ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Duration":    item = this.itemOfType( items, [ BuiltInType.Boolean, BuiltInType.String, BuiltInType.UInt16, BuiltInType.Byte ] );     break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Enumeration": item = this.itemOfType( items, [ BuiltInType.Boolean, BuiltInType.String, BuiltInType.Float, BuiltInType.Int16 ] );  break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Float":       item = this.itemOfType( items, [ BuiltInType.UInt64, BuiltInType.Boolean, BuiltInType.String, BuiltInType.Int16 ] );    break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Guid":        item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.Int16, BuiltInType.String, BuiltInType.XmlElement ] );  break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Image":       item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Int16, BuiltInType.LocalizedText, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/ImageBMP":    item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Int16, BuiltInType.LocalizedText, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/ImageGIF":    item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Int16, BuiltInType.LocalizedText, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/ImagePNG":    item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Int16, BuiltInType.LocalizedText, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Int16":       item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Boolean, BuiltInType.Float, BuiltInType.UInt16 ] );      break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Int32":       item = this.itemOfType( items, [ BuiltInType.Guid, BuiltInType.String, BuiltInType.XmlElement, BuiltInType.UInt32 ] );    break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Int64":       item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.String, BuiltInType.XmlElement, BuiltInType.Boolean ] );  break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Integer":     item = this.itemOfType( items, [ BuiltInType.Double, BuiltInType.String, BuiltInType.Boolean, BuiltInType.Byte ] );     break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/LocaleId":    item = this.itemOfType( items, [ BuiltInType.Boolean, BuiltInType.Int16, BuiltInType.Float, BuiltInType.String ] );     break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/LocalizedText": item = this.itemOfType( items, [ BuiltInType.String, BuiltInType.Boolean, BuiltInType.Float, BuiltInType.Byte ] );   break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/NodeId":        item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.String, BuiltInType.Int16, BuiltInType.DateTime ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Number":        item = this.itemOfType( items, [ BuiltInType.Guid, BuiltInType.String, BuiltInType.XmlElement, BuiltInType.LocalizedText ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/QualifiedName": item = this.itemOfType( items, [ BuiltInType.Boolean, BuiltInType.String, BuiltInType.Float, BuiltInType.XmlElement ] );      break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/String":        item = this.itemOfType( items, [ BuiltInType.UInt16, BuiltInType.LocalizedText, BuiltInType.Boolean, BuiltInType.UInt16 ] );  break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/SByte":         item = this.itemOfType( items, [ BuiltInType.Int32, BuiltInType.String, BuiltInType.DateTime, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Time":          item = this.itemOfType( items, [ BuiltInType.UInt16, BuiltInType.String, BuiltInType.Float, BuiltInType.Guid ] );        break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt16":        item = this.itemOfType( items, [ BuiltInType.Int16, BuiltInType.Guid, BuiltInType.String, BuiltInType.ByteString ] );    break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt32":        item = this.itemOfType( items, [ BuiltInType.Guid, BuiltInType.String, BuiltInType.Float, BuiltInType.LocalizedText ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/UInt64":        item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.XmlElement, BuiltInType.UInt16, BuiltInType.Double ] );  break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/UtcTime":       item = this.itemOfType( items, [ BuiltInType.Float, BuiltInType.String, BuiltInType.Int16, BuiltInType.Guid ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/UInteger":      item = this.itemOfType( items, [ BuiltInType.Int32, BuiltInType.String, BuiltInType.Guid, BuiltInType.Float ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/Variant":       item = this.itemOfType( items, [ BuiltInType.Null ] ); break;
            case "/Server Test/NodeIds/Static/All Profiles/Scalar/XmlElement":    item = this.itemOfType( items, [ BuiltInType.Double, BuiltInType.String, BuiltInType.Float, BuiltInType.Boolean ] ); break;
            default:
                print( "/n/n/t*** Unexpected Node received. Skipping '" + items[i].NodeId + " ' (Setting: '" + items[i].NodeSetting + "')" );
                break;
        }//switch
        if( item !== null ) items[i].Value.Value = item.originalValue.clone();
        else items[i] = null;
    }//for

    // now to make sure that any NULLs are removed: 
    var i=0; 
    while( i < items.length ) {
        if( items[i] == null ) {
            items.splice( i, 1 );
            expectedResults.splice( i, 1 );
        }
        else i++;
    }

    //WRITE the nodes.
    return( WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, ReadVerification: false } ) );
} } );