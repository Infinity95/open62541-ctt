/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Read a single attribute from a valid node where the type is an array data type. */

function read581024() {
const MIN_ARRAY_BOUNDS_SIZE = 2, MAXSTRINGSIZE = 100;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, 0 );
    if( items.length === 0 ) {
        addSkipped( "No Array items configured. Please check settings." );
        return( false );
    }
    if( ReadHelper.Execute( { NodesToRead: items } ) ) {
        for( var i=0; i<items.length; i++ ) {
            var itemLength = ReadHelper.Response.Results[i].length;
            // treat the byte/bytestring a little differently....
            if( items[i].Value.DataType === BuiltInType.Byte ) {

                if( items[i].Value.Value.ArrayType === 0 && items[i].Value.Value.DataType === BuiltInType.ByteString ) itemLength = items[i].Value.Value.toByteString().length;
                else valueAsArray = items[i].Value.Value.toByteArray().length;

            }
            Assert.GreaterThan( MIN_ARRAY_BOUNDS_SIZE, itemLength, "We expected to receive an array type, with bounds > " + MIN_ARRAY_BOUNDS_SIZE );
        }
    }// read 
    return( true );
}// function read581024() 

Test.Execute( { Procedure: read581024 } );