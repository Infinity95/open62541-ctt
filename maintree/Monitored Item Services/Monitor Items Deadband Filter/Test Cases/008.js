/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Specify a filter using a deadband absolute. Set the deadband value to be the equivalent of 10. Write numerous values 
                 to the item that will cause event notifications to be sent, and for some items to be filtered. call Publish() to verify 
                 the deadband is correctly filtering values. The following types are tested: 
                     SByte, Int16, Int32, Int64, Byte, UInt16, UInt32, UInt64, Duration, Float
        Expected Results: ServiceResult=�Good�, operation level result also �Good�. However, we ONLY expect values that pass the deadband 
                 to be received when invoking Publish. */

Test.Execute( { Procedure: function test() {
    var integerDeadband   = 1;
    var integerWritesPass = [ 11, 22, 9 ];
    var integerWritesFail = [ 9, 9, 10 ];

    var floatDeadband = 0.25;
    floatWritesPass   = [ 0.26, 0.52, 0.77 ];
    floatWritesFail   = [ 0.74, 0.53, 0.9 ];

    DeadbandAbsoluteFiltering_WritePublishTesting( MonitorBasicSubscription, ReadHelper, WriteHelper, PublishHelper, 
        integerDeadband, integerWritesPass, integerWritesFail,
        floatDeadband,   floatWritesPass,   floatWritesFail );
    return( true );
} } );