/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description:
        Specify a filter using a deadband absolute. Set the deadband value to 2. Write numerous values to the item that will cause 
        event notifications to be sent, and for some items to be filtered. 
        call Publish() to verify the deadband is correctly filtering values.
        The following types are tested:
            SByte, Int16, Int32, Int64, Byte, UInt16, UInt32, UInt64, Duration, Float */

Test.Execute( { Procedure: function test() {
    var integerDeadband   = 2;
    var integerWritesPass = [ 3, 6, 9 ];
    var integerWritesFail = [ 8, 7, 10 ];

    var floatDeadband = 2.2;
    floatWritesPass   = [ 2.3, 4.6, 6.4 ];
    floatWritesFail   = [ 4.2, 8.6, 6.6 ];

    DeadbandAbsoluteFiltering_WritePublishTesting( MonitorBasicSubscription, ReadHelper, WriteHelper, PublishHelper, 
        integerDeadband, integerWritesPass, integerWritesFail,
        floatDeadband,   floatWritesPass,   floatWritesFail );
    return( true );
} } );