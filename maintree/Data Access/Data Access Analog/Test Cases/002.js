/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Read value attribute of an analog node of each of the following data type: 
        Double, Float, Int16, UInt16, Int32, UInt32, Int64, UInt64. Perform the reads in a single call. */

function read613002() {
    // Analog type nodes array
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings );
    // Check that we are covering all the data types as required by this test
    if ( items.length < 8 ) addWarning( "Not all the datatypes are being covered by this test. Add additional analog items." );
    // we have to read these nodes individually
    ReadHelper.Execute( { NodesToRead: items } );
    // check the data-types of the results 
    for( var i=0; i<items.length; i++ ) {
        var dt = UaNodeId.GuessType( items[i].NodeSetting );
        Assert.Equal( dt, items[i].Value.Value.DataType, 
                "Read() returned a value that was not of the expected data-type.",
                "Read() validated Analog node of data-type: " + BuiltInType.toString( dt ) );
    }//for i
    return( true );
}// function read613002()

Test.Execute( { Procedure: read613002 } );