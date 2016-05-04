/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from multiple valid node where the type is an array data type. */

function read581025() {
    const MAXSTRINGSIZE = 100;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0 );
    if( items == null || items.length < 1 ) {
        addSkipped( SETTING_UNDEFINED_SCALARARRAYS );
        return( false );
    }
    if( ReadHelper.Execute( { NodesToRead: items, MaxAge: 100 } ) ) {
        // we're looping based on the 'nodeNumber' which is based on the number of
        // settings that were found to be valid, i.e. set and not empty!
        for( var r=0; r<items.length; r++ ) {
            // display the values
            var resultsString = ReadHelper.Response.Results[r].Value.toString();
            if( resultsString.length > MAXSTRINGSIZE ) resultsString = resultsString.substring( 0, MAXSTRINGSIZE ) + "... (truncated by script)";
            print( "Array value: '" + resultsString + "'" );

            switch( items[r].NodeSetting ) {
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Bool":
                    AssertUaValueOfType( BuiltInType.Boolean, ReadHelper.Response.Results[r].Value );
                    break;
                case  "/Server Test/NodeIds/Static/All Profiles/Arrays/Byte":
                    // we must permit either Byte[] or ByteString here.
                    if( items[r].Value.Value.ArrayType === 0 && items[r].Value.Value.DataType === BuiltInType.ByteString ) AssertUaValueOfType( BuiltInType.ByteString, ReadHelper.Response.Results[r].Value );
                    else AssertUaValueOfType( BuiltInType.Byte, ReadHelper.Response.Results[r].Value );
                    break;
                case  "/Server Test/NodeIds/Static/All Profiles/Arrays/ByteString":
                    AssertUaValueOfType( BuiltInType.ByteString, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/DateTime":
                    AssertUaValueOfType( BuiltInType.DateTime, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Double":
                    AssertUaValueOfType( BuiltInType.Double, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Float":
                    AssertUaValueOfType( BuiltInType.Float, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Guid":
                    AssertUaValueOfType( BuiltInType.Guid, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Int16":
                    AssertUaValueOfType( BuiltInType.Int16, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Int32":
                    AssertUaValueOfType( BuiltInType.Int32, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Int64":
                    AssertUaValueOfType( BuiltInType.Int64, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/LocalizedText":
                    AssertUaValueOfType( BuiltInType.LocalizedText, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/QualifiedName":
                    AssertUaValueOfType( BuiltInType.QualifiedName, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/SByte":
                    AssertUaValueOfType( BuiltInType.SByte, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/String":
                    AssertUaValueOfType( BuiltInType.String, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt16":
                    AssertUaValueOfType( BuiltInType.UInt16, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt32":
                    AssertUaValueOfType( BuiltInType.UInt32, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/UInt64":
                    AssertUaValueOfType( BuiltInType.UInt64, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/Variant":
                    AssertUaValueOfType( BuiltInType.Variant, ReadHelper.Response.Results[r].Value );
                    break;
                case "/Server Test/NodeIds/Static/All Profiles/Arrays/XmlElement":
                    AssertUaValueOfType( BuiltInType.XmlElement, ReadHelper.Response.Results[r].Value );
                    break;
                default:
                    addError( "Built in type not specified: " + items[r].NodeSetting );
            }// switch
            if( ReadHelper.Response.Results[r].Value.DataType !== BuiltInType.ByteString ) {
                Assert.Equal( 1, ReadHelper.Response.Results[r].Value.ArrayType, "Not an Array type: " + items[r].NodeSetting );
            }
        }// for r....
    }// if Read....
    return( true );
}

Test.Execute( { Procedure: read581025 } );