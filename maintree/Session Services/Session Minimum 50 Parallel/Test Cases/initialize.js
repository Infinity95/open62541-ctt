include( "./library/Base/safeInvoke.js" );

const MAX_SESSIONS = 50;

if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();