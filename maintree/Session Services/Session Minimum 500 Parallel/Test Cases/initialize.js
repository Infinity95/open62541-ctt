include( "./library/Base/safeInvoke.js" );

const MAX_SESSIONS = 500;

if( !Test.Connect( { SkipCreateSession: true } ) ) stopCurrentUnit();