/*  Test prepared Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: per Errata 1.02.2: attempt a DoS attack on Server by consuming SecureChannels and NOT using them!
                 When creating a valid/real SecureChannel, prior [unused] channels should be clobbered. */


Test.Include( { File: "./maintree/Security/Security None/Test Cases/006.js" } );
Test.Execute( { Procedure: DoSAttempt,
                Args: { RequestedSecurityPolicyUri: SecurityPolicy.Basic128Rsa15, 
                        MessageSecurityMode: MessageSecurityMode.SignAndEncrypt } } );