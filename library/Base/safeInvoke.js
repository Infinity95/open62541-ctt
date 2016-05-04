include( "./library/Base/assertions.js" );
include( "./library/Base/serviceRegister.js" );
include( "./library/Base/SettingsUtilities/NodeIds.js" );
include( "./library/ServiceBased/Helpers.js" );

/* A test framework.
   Parameters: 
       - TryFunction: the reference to the function. Must return TRUE/FALSE
       - ErrorFunction; a reference to a function to call if an error occurs; must return TRUE/FALSE 
       - FinallyFunction: a reference to a function to call in the FINALLY block.
       - Procedure: a reference to a function that does not return TRUE/FALSE */
var Test = new Object();
Test = {
    StartTime: null,
    EndTime: null,
    Duration: null,

    PreTestFunctions: [],
    PostTestFunctions: [],

    TestResult: false,

    TestsPassed: 0, 
    TestsPassedGlobal: 0,
    TestsFailed: 0, 
    TestsFailedGlobal: 0,

    Channel: null,
    Session: null,
    DiscoverySession: null,

    /* Connects to the UAServer using a channel and session.
       Parameters: 
           Debug (optional): 
           SkipCreateSession (optional): true = do not call createsession and consequently activatesession
           SkipActivateSession (optional): true = do not call activate session
           OpenSecureChannel (optional): passed to the OpenSecureChannel helper object
           CreateSession (optional):     passed to the CreateSession helper object 
           ActivateSession (optional):   passed to the ActivateSession helper object */
    Connect: function( args ) { 
                        if( !isDefined( args ) ) args = new Object();
                        if( !isDefined( args.Debug ) ) args.Debug = false;
                        if( !isDefined( args.SkipCreateSession ) ) args.SkipCreateSession = false;
                        if( !isDefined( args.SkipActivateSession ) ) args.SkipActivateSession = false;
                        this.Channel = new OpenSecureChannelService();
                        if( !this.Channel.Execute( args.OpenSecureChannel ) ) return( false );
                        // create a discovery session
                        this.DiscoverySession = new UaDiscovery( this.Channel.Channel );
                        // create a session?
                        if( args.SkipCreateSession ) return( true );
                        this.Session = new CreateSessionService( { Channel: this.Channel } );
                        var createSessionParams = isDefined( args.CreateSession )? args.CreateSession : new Object();
                        createSessionParams.Session = this.Session;
                        if( !this.Session.Execute( createSessionParams ) ) return( false );
                        // activate a session?
                        if( args.SkipActivateSession ) return( true );
                        if( !isDefined( args.ActivateSession ) ) args.ActivateSession = new Object();
                        args.ActivateSession.Session = this.Session;
                        if( !ActivateSessionHelper.Execute( args.ActivateSession ) ) return( false );
                        InstanciateHelpers( { Session: this.Session.Session, DiscoverySession: this.DiscoverySession } );
                        return( true );
                    },

    /* Disconnects from the UAServer
       Parameters: 
           SkipCloseSession (optional): does not invoke close session
           CloseSession: an array of arguments passed directly to the CloseSession service (See the CloseSession object the .Execute() parameters */
    Disconnect: function( args ) { 
                        // close the channel; is it open?
                        if( !isDefined( this.Channel ) || !isDefined( this.Channel.Channel ) ) return( true );
                        // close the channel; pass in any received arguments
                        if( !isDefined( args ) ) args = new Object();
                        if( !isDefined( args.CloseSecureChannel ) ) args.CloseSecureChannel = this.Channel;
                        // close the session; pass in any received arguments
                        if( !isDefined( args.SkipCloseSession ) ) args.SkipCloseSession = false;
                        if( !args.SkipCloseSession ) {
                            if( this.Session !== null ) {
                                CloseSessionHelper.Execute( { Session: this.Session } );
                                print( "Test.Disconnect() CloseSession called: " + CloseSessionHelper.Response.ResponseHeader.ServiceResult );
                                this.Session = null;
                            }
                            else print( "Test.Disconnect() this.Session is null!!!" );
                        }
                        else print( "Test.Disconnect() no session to close." );
                        if( this.Channel.Channel.IsConnected ) CloseSecureChannelHelper.Execute( args.CloseSecureChannel );
                        return( true );
                    },

    Execute: function( args ) {
                    if( !( isDefined( this.DONOTRUN ) && this.DONOTRUN ) ) {;
                        if( !isDefined( args ) ) throw( "Test.args not specified." );
                        if( !isDefined( args.TryFunction ) && !isDefined( args.Procedure ) ) throw( "Test.args.TryFunction and/or Procedure not specified." );
                        this.StartTime = UaDateTime.utcNow();
                        try {
                            if( this.PreTestFunctions.length > 0 ) for( var i=0; i<this.PreTestFunctions.length; i++ ) this.PreTestFunctions[i]();
                            print( "\n\n\t~~~ START OF TEST [" + args.Procedure.name + "] ~~~\n" );
                            if( isDefined( args.TryFunction ) ) this.TestResult = args.TryFunction( args.Args );
                            else if( isDefined( args.Procedure ) ) this.TestResult = args.Procedure( args.Args );
                            if( !isDefined( this.TestResult ) ) throw( "Test function did NOT return a true/false code. Please check the routine." );
                            if( this.TestResult ) this.incPass(); else this.incFail();
                            if( this.PostTestFunctions.length > 0 ) for( var i=0; i<this.PostTestFunctions.length; i++ ) this.PostTestFunctions[i]();
                            print( "\n\n\t~~~ END OF TEST [" + args.Procedure.name + "] ~~~\n" );
                        }
                        catch( ex ) {
                            if( isDefined( args.ErrorHandler ) ) {
                                if( !args.ErrorHandler() ) 
                                    addError( "Test.Execute() encountered an unexpected error: " + ex.toString() );
                            }
                            else addError( "Test.Execute() encounted an unexpected error: " + ex.toString() );
                            if( isDefined( args.Debug ) && args.Debug === true ) throw( ex );
                        }
                        finally {
                            if( isDefined( args.FinallyHandler ) ) args.FinallyHandler();
                        }
                        this.EndTime = UaDateTime.utcNow();
                        this.Duration = this.StartTime.msecsTo( this.EndTime );
                    }
                    this.DONOTRUN = false;
                }, // Execute

    Include: function( args ) { 
                    if( !isDefined( args ) ) throw( "Include.args not specified." );
                    if( !isDefined( args.File ) ) throw( "Include.args.File not specified." );
                    this.DONOTRUN = true;
                    include( args.File );
                }, //Include

    incPass:    function() { this.TestsPassedGlobal++; this.TestsPassed++; }, 
    incFail:    function() { this.TestsFailedGlobal++; this.TestsFailed++; }, 
    ResetStats: function() { this.TestsPassed = 0;     this.TestsFailed = 0; },

    Stats: function() { return( "Tests Passed:\n\tThis CU: " + this.TestsPassed +
                                "\n\tGlobally: " + this.TestsPassedGlobal +
                                "\nTests Failed:\n\tThis CU: " + this.TestsFailed +
                                "\n\tGlobally: " + this.TestsFailedGlobal ); },
}